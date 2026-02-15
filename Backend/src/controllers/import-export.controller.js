import multer from 'multer';
import * as XLSX from 'xlsx';
import { query } from '../config/db.js';

const normalizeRowKeys = (row) => {
    const normalized = {};
    for (const [key, value] of Object.entries(row || {})) {
        normalized[String(key).trim().toLowerCase()] = value;
    }
    return normalized;
};

const getValue = (row, aliases) => {
    const normalized = normalizeRowKeys(row);
    for (const alias of aliases) {
        const value = normalized[String(alias).trim().toLowerCase()];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }
    return null;
};

const toNumberOrDefault = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') return defaultValue;
    const parsed = Number(String(value).replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : defaultValue;
};

const toBooleanOrDefault = (value, defaultValue = true) => {
    if (value === null || value === undefined || value === '') return defaultValue;
    if (typeof value === 'boolean') return value;

    const normalized = String(value).trim().toLowerCase();
    if (['true', '1', 'yes', 'y', 'active'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n', 'inactive'].includes(normalized)) return false;

    return defaultValue;
};

const toDateString = (value) => {
    if (value === null || value === undefined || value === '') return null;

    if (typeof value === 'number') {
        const converted = XLSX.SSF.parse_date_code(value);
        if (!converted) return null;
        const month = String(converted.m).padStart(2, '0');
        const day = String(converted.d).padStart(2, '0');
        return `${converted.y}-${month}-${day}`;
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
    }

    return null;
};

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
        ];
        if (validTypes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Please upload a valid Excel file (.xlsx or .xls)'));
        }
    },
});

export const uploadMiddleware = upload.single('file');

// ===== IMPORT FUNCTIONS =====

export const importExcel = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { import_type } = req.body;
    if (!import_type) {
        return res.status(400).json({ message: 'import_type is required' });
    }

    try {
        // Parse Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: null, raw: true });

        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        let result;
        if (import_type === 'components') {
            result = await importComponents(data, req.user.id);
        } else if (import_type === 'pcb_master_bom') {
            result = await importPCBMasterWithBOM(data, req.user.id);
        } else if (import_type === 'pcb_production') {
            result = await importPCBProduction(data, req.user.id);
        } else {
            return res.status(400).json({ message: 'Invalid import_type' });
        }

        // Create import log
        await query(
            `INSERT INTO import_logs (
        file_name,
        import_type,
        records_imported,
        records_failed,
        status,
        error_details,
        imported_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                req.file.originalname,
                import_type,
                result.success,
                result.failed,
                result.failed === 0 ? 'completed' : 'completed_with_errors',
                result.errors.length > 0 ? JSON.stringify(result.errors) : null,
                req.user.id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: `Import completed. ${result.success} records imported, ${result.failed} failed.`,
            records_imported: result.success,
            records_failed: result.failed,
            errors: result.errors,
        });
    } catch (error) {
        console.error('Import error:', error);
        return res.status(500).json({ message: error.message || 'Error importing file' });
    }
};

const importComponents = async (data, userId) => {
    const results = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
            // Validate required fields
            const componentName = getValue(row, ['Component Name', 'component_name']);
            const partNumber = getValue(row, ['Part Number', 'part_number']);
            const currentStock = toNumberOrDefault(
                getValue(row, [
                    'Current Stock Quantity',
                    'current_stock_quantity',
                    'Current Stock',
                    'current_stock',
                ])
            );
            const monthlyRequired = toNumberOrDefault(
                getValue(row, [
                    'Monthly Required Quantity',
                    'monthly_required_quantity',
                    'Monthly Required',
                    'monthly_required',
                ])
            );

            if (!componentName || !partNumber) {
                throw new Error('Missing required fields: Component Name and Part Number');
            }

            if (currentStock < 0 || monthlyRequired < 0) {
                throw new Error('Quantity fields cannot be negative');
            }

            // Check if component exists
            const existing = await query('SELECT id FROM components WHERE part_number = $1', [partNumber]);

            if (existing.rowCount > 0) {
                // Update existing component
                await query(
                    `UPDATE components SET
            component_name = $1,
            current_stock_quantity = $2,
            monthly_required_quantity = $3,
            description = $4,
            unit_of_measurement = $5
          WHERE part_number = $6`,
                    [
                        componentName,
                        currentStock,
                        monthlyRequired,
                        getValue(row, ['Description', 'description']) || null,
                        getValue(row, ['Unit of Measurement', 'unit_of_measurement']) || 'pcs',
                        partNumber,
                    ]
                );
            } else {
                // Insert new component
                await query(
                    `INSERT INTO components (
            component_name,
            part_number,
            description,
            current_stock_quantity,
            monthly_required_quantity,
            unit_of_measurement,
            created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        componentName,
                        partNumber,
                        getValue(row, ['Description', 'description']) || null,
                        currentStock,
                        monthlyRequired,
                        getValue(row, ['Unit of Measurement', 'unit_of_measurement']) || 'pcs',
                        userId,
                    ]
                );
            }

            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({ row: i + 1, error: error.message });
        }
    }

    return results;
};

const importPCBMasterWithBOM = async (data, userId) => {
    const results = { success: 0, failed: 0, errors: [] };

    const componentResult = await query('SELECT id, part_number FROM components');
    const componentMap = new Map(
        componentResult.rows.map((row) => [String(row.part_number || '').trim().toLowerCase(), row.id])
    );

    const pcbResult = await query('SELECT id, pcb_code FROM pcbs');
    const pcbMap = new Map(
        pcbResult.rows.map((row) => [String(row.pcb_code || '').trim().toLowerCase(), row.id])
    );

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
            const rawPcbCode = getValue(row, ['PCB Code', 'pcb_code']);
            const rawPcbName = getValue(row, ['PCB Name', 'pcb_name']);
            const rawPartNumber = getValue(row, [
                'Component Part Number',
                'component_part_number',
                'Part Number',
                'part_number',
            ]);
            const quantityPerPcb = toNumberOrDefault(
                getValue(row, [
                    'Quantity Per PCB',
                    'quantity_per_pcb',
                    'Qty Per PCB',
                    'qty_per_pcb',
                ]),
                NaN
            );

            const pcbCode = rawPcbCode ? String(rawPcbCode).trim() : '';
            const pcbName = rawPcbName ? String(rawPcbName).trim() : '';
            const componentPartNumber = rawPartNumber ? String(rawPartNumber).trim() : '';

            if (!pcbCode || !pcbName || !componentPartNumber || !Number.isFinite(quantityPerPcb)) {
                throw new Error(
                    'Missing required fields: PCB Code, PCB Name, Component Part Number, Quantity Per PCB'
                );
            }

            if (quantityPerPcb <= 0) {
                throw new Error('Quantity Per PCB must be greater than 0');
            }

            let pcbId = pcbMap.get(pcbCode.toLowerCase());

            if (!pcbId) {
                const insertPcb = await query(
                    `INSERT INTO pcbs (pcb_name, pcb_code, description, version, is_active, created_by)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING id`,
                    [
                        pcbName,
                        pcbCode,
                        getValue(row, ['Description', 'description', 'PCB Description', 'pcb_description']) ||
                            null,
                        getValue(row, ['Version', 'version']) || null,
                        toBooleanOrDefault(getValue(row, ['Is Active', 'is_active']), true),
                        userId,
                    ]
                );

                pcbId = insertPcb.rows[0].id;
                pcbMap.set(pcbCode.toLowerCase(), pcbId);
            } else {
                await query(
                    `UPDATE pcbs
                     SET pcb_name = $1,
                         description = COALESCE($2, description),
                         version = COALESCE($3, version),
                         is_active = COALESCE($4, is_active),
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = $5`,
                    [
                        pcbName,
                        getValue(row, ['Description', 'description', 'PCB Description', 'pcb_description']) ||
                            null,
                        getValue(row, ['Version', 'version']) || null,
                        toBooleanOrDefault(getValue(row, ['Is Active', 'is_active']), null),
                        pcbId,
                    ]
                );
            }

            const componentId = componentMap.get(componentPartNumber.toLowerCase());
            if (!componentId) {
                throw new Error(
                    `Component with part number ${componentPartNumber} not found. Import components first.`
                );
            }

            await query(
                `INSERT INTO pcb_components (pcb_id, component_id, quantity_per_pcb, notes)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (pcb_id, component_id)
                 DO UPDATE SET quantity_per_pcb = EXCLUDED.quantity_per_pcb,
                               notes = EXCLUDED.notes,
                               updated_at = CURRENT_TIMESTAMP`,
                [
                    pcbId,
                    componentId,
                    quantityPerPcb,
                    getValue(row, ['Notes', 'notes', 'BOM Notes', 'bom_notes']) || null,
                ]
            );

            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({ row: i + 1, error: error.message });
        }
    }

    return results;
};

const importPCBProduction = async (data, userId) => {
    const results = { success: 0, failed: 0, errors: [] };

    const pcbResult = await query('SELECT id, pcb_code FROM pcbs');
    if (pcbResult.rowCount === 0) {
        throw new Error('No PCB master data found. Create PCB records before importing production data.');
    }

    const pcbCodeMap = new Map(
        pcbResult.rows.map((row) => [String(row.pcb_code || '').trim().toLowerCase(), row.id])
    );

    const bomResult = await query(
        `SELECT
            pc.pcb_id,
            pc.component_id,
            pc.quantity_per_pcb,
            c.part_number,
            c.component_name,
            c.current_stock_quantity
         FROM pcb_components pc
         JOIN components c ON c.id = pc.component_id`
    );

    if (bomResult.rowCount === 0) {
        throw new Error(
            'No PCB component mappings found. Map components to PCBs (BOM) before importing production data.'
        );
    }

    const bomByPcbId = new Map();
    const simulatedStockByComponentId = new Map();

    for (const row of bomResult.rows) {
        const pcbId = String(row.pcb_id);
        const bomList = bomByPcbId.get(pcbId) || [];

        bomList.push({
            componentId: row.component_id,
            qtyPerPcb: Number(row.quantity_per_pcb || 0),
            partNumber: row.part_number,
            componentName: row.component_name,
        });

        bomByPcbId.set(pcbId, bomList);
        if (!simulatedStockByComponentId.has(String(row.component_id))) {
            simulatedStockByComponentId.set(
                String(row.component_id),
                Number(row.current_stock_quantity || 0)
            );
        }
    }

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
            // Validate required fields
            const rawPcbCode = getValue(row, ['PCB Code', 'pcb_code']);
            const pcbCode = rawPcbCode ? String(rawPcbCode).trim() : null;
            const quantityProduced = toNumberOrDefault(
                getValue(row, ['Quantity Produced', 'quantity_produced']),
                NaN
            );
            const productionDate = toDateString(
                getValue(row, ['Production Date', 'production_date'])
            );

            if (!pcbCode || !Number.isFinite(quantityProduced)) {
                throw new Error('Missing required fields: PCB Code and Quantity Produced');
            }

            if (quantityProduced <= 0) {
                throw new Error('Quantity Produced must be greater than 0');
            }

            // Find PCB by code
            const pcbId = pcbCodeMap.get(pcbCode.toLowerCase());
            if (!pcbId) {
                throw new Error(`PCB with code ${pcbCode} not found`);
            }

            const bomList = bomByPcbId.get(String(pcbId)) || [];
            if (bomList.length === 0) {
                throw new Error(`PCB ${pcbCode} has no BOM/component mapping`);
            }

            for (const bom of bomList) {
                const key = String(bom.componentId);
                const available = Number(simulatedStockByComponentId.get(key) || 0);
                const required = Number(bom.qtyPerPcb || 0) * Math.round(quantityProduced);

                if (required > 0 && available < required) {
                    throw new Error(
                        `Insufficient stock for ${bom.partNumber || bom.componentName} while producing ${pcbCode}`
                    );
                }
            }

            for (const bom of bomList) {
                const key = String(bom.componentId);
                const available = Number(simulatedStockByComponentId.get(key) || 0);
                const required = Number(bom.qtyPerPcb || 0) * Math.round(quantityProduced);
                simulatedStockByComponentId.set(key, available - required);
            }

            // Insert production record
            await query(
                `INSERT INTO pcb_production (
          pcb_id,
          quantity_produced,
          production_date,
          batch_number,
          dc_number,
          location,
          status,
          notes,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    pcbId,
                    Math.round(quantityProduced),
                    productionDate || new Date().toISOString().slice(0, 10),
                    getValue(row, ['Batch Number', 'batch_number']) || null,
                    getValue(row, ['DC Number', 'dc_number']) || null,
                    getValue(row, ['Location', 'location']) || null,
                    getValue(row, ['Status', 'status']) || 'completed',
                    getValue(row, ['Notes', 'notes']) || null,
                    userId,
                ]
            );

            results.success++;
        } catch (error) {
            results.failed++;
            results.errors.push({ row: i + 1, error: error.message });
        }
    }

    return results;
};

// ===== EXPORT FUNCTIONS =====

export const exportComponents = async (req, res) => {
    try {
        const result = await query(`
      SELECT 
        component_name AS "Component Name",
        part_number AS "Part Number",
        description AS "Description",
        current_stock_quantity AS "Current Stock Quantity",
        monthly_required_quantity AS "Monthly Required Quantity",
        unit_of_measurement AS "Unit of Measurement",
        reorder_threshold AS "Reorder Threshold",
        is_low_stock AS "Low Stock",
        created_at AS "Created At"
      FROM components
      ORDER BY component_name ASC
    `);

        // Handle empty result set
        const data = result.rows.length > 0 ? result.rows : [{
            "Component Name": "",
            "Part Number": "",
            "Description": "",
            "Current Stock Quantity": "",
            "Monthly Required Quantity": "",
            "Unit of Measurement": "",
            "Reorder Threshold": "",
            "Low Stock": "",
            "Created At": ""
        }];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Components');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="components.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Error exporting components' });
    }
};

export const exportConsumptionReport = async (req, res) => {
    try {
        const result = await query(`
      SELECT 
        c.component_name AS "Component Name",
        c.part_number AS "Part Number",
        cc.quantity_consumed AS "Quantity Consumed",
        cc.consumption_date AS "Consumption Date",
        cc.transaction_type AS "Transaction Type",
        cc.notes AS "Notes"
      FROM component_consumption cc
      JOIN components c ON c.id = cc.component_id
      ORDER BY cc.consumption_date DESC
    `);

        // Handle empty result set
        const data = result.rows.length > 0 ? result.rows : [{
            "Component Name": "",
            "Part Number": "",
            "Quantity Consumed": "",
            "Consumption Date": "",
            "Transaction Type": "",
            "Notes": ""
        }];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Consumption Report');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="consumption_report.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Error exporting consumption report' });
    }
};

export const exportLowStockReport = async (req, res) => {
    try {
        const result = await query(`
      SELECT 
        component_name AS "Component Name",
        part_number AS "Part Number",
        current_stock_quantity AS "Current Stock",
        monthly_required_quantity AS "Monthly Required",
        reorder_threshold AS "Reorder Threshold",
        unit_of_measurement AS "Unit",
        description AS "Description"
      FROM components
      WHERE is_low_stock = true
      ORDER BY current_stock_quantity ASC
    `);

        // Handle empty result set
        const data = result.rows.length > 0 ? result.rows : [{
            "Component Name": "",
            "Part Number": "",
            "Current Stock": "",
            "Monthly Required": "",
            "Reorder Threshold": "",
            "Unit": "",
            "Description": ""
        }];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Low Stock Report');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="low_stock_report.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Error exporting low stock report' });
    }
};

export const exportPCBProduction = async (req, res) => {
    try {
        const result = await query(`
      SELECT 
        p.pcb_name AS "PCB Name",
        p.pcb_code AS "PCB Code",
        pp.quantity_produced AS "Quantity Produced",
        pp.production_date AS "Production Date",
        pp.batch_number AS "Batch Number",
        pp.dc_number AS "DC Number",
        pp.location AS "Location",
        pp.status AS "Status",
        pp.notes AS "Notes",
        pp.created_at AS "Recorded At"
      FROM pcb_production pp
      JOIN pcbs p ON p.id = pp.pcb_id
      ORDER BY pp.production_date DESC
    `);

        // Handle empty result set
        const data = result.rows.length > 0 ? result.rows : [{
            "PCB Name": "",
            "PCB Code": "",
            "Quantity Produced": "",
            "Production Date": "",
            "Batch Number": "",
            "DC Number": "",
            "Location": "",
            "Status": "",
            "Notes": "",
            "Recorded At": ""
        }];

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PCB Production');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="pcb_production.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Error exporting PCB production report' });
    }
};
