import multer from 'multer';
import * as XLSX from 'xlsx';
import { query, withTransaction } from '../config/db.js';

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
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (!data || data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        let result;
        if (import_type === 'components') {
            result = await importComponents(data, req.user.id);
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
            const componentName = row['Component Name'] || row['component_name'];
            const partNumber = row['Part Number'] || row['part_number'];
            const currentStock = row['Current Stock Quantity'] || row['current_stock_quantity'];
            const monthlyRequired = row['Monthly Required Quantity'] || row['monthly_required_quantity'];

            if (!componentName || !partNumber) {
                throw new Error('Missing required fields: Component Name and Part Number');
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
                        currentStock || 0,
                        monthlyRequired || 0,
                        row['Description'] || row['description'] || null,
                        row['Unit of Measurement'] || row['unit_of_measurement'] || 'pcs',
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
                        row['Description'] || row['description'] || null,
                        currentStock || 0,
                        monthlyRequired || 0,
                        row['Unit of Measurement'] || row['unit_of_measurement'] || 'pcs',
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

const importPCBProduction = async (data, userId) => {
    const results = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
            // Validate required fields
            const pcbCode = row['PCB Code'] || row['pcb_code'];
            const quantityProduced = row['Quantity Produced'] || row['quantity_produced'];
            const productionDate = row['Production Date'] || row['production_date'];

            if (!pcbCode || !quantityProduced) {
                throw new Error('Missing required fields: PCB Code and Quantity Produced');
            }

            // Find PCB by code
            const pcbResult = await query('SELECT id FROM pcbs WHERE pcb_code = $1', [pcbCode]);
            if (pcbResult.rowCount === 0) {
                throw new Error(`PCB with code ${pcbCode} not found`);
            }

            const pcbId = pcbResult.rows[0].id;

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
                    quantityProduced,
                    productionDate || new Date().toISOString().slice(0, 10),
                    row['Batch Number'] || row['batch_number'] || null,
                    row['DC Number'] || row['dc_number'] || null,
                    row['Location'] || row['location'] || null,
                    row['Status'] || row['status'] || 'completed',
                    row['Notes'] || row['notes'] || null,
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
