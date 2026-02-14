import { query, withTransaction } from '../config/db.js';

export const listComponents = async ({ search, lowStock }) => {
  const values = [];
  const where = [];

  if (search) {
    values.push(`%${search}%`);
    where.push(`(component_name ILIKE $${values.length} OR part_number ILIKE $${values.length})`);
  }

  if (lowStock === 'true') {
    where.push('is_low_stock = true');
  }

  const result = await query(
    `SELECT * FROM components
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY created_at DESC`,
    values
  );

  return result.rows;
};

export const getComponentById = async (id) => {
  const result = await query('SELECT * FROM components WHERE id = $1', [id]);
  if (!result.rowCount) {
    const error = new Error('Component not found');
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

export const createComponent = async (payload, userId) => {
  const result = await query(
    `INSERT INTO components (
      component_name,
      part_number,
      description,
      current_stock_quantity,
      monthly_required_quantity,
      unit_of_measurement,
      reorder_threshold,
      created_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      payload.component_name,
      payload.part_number,
      payload.description || null,
      payload.current_stock_quantity ?? 0,
      payload.monthly_required_quantity ?? 0,
      payload.unit_of_measurement || 'pcs',
      payload.reorder_threshold ?? null,
      userId,
    ]
  );

  return result.rows[0];
};

export const updateComponent = async (id, payload) => {
  const fields = [];
  const values = [];

  const allowed = [
    'component_name',
    'part_number',
    'description',
    'current_stock_quantity',
    'monthly_required_quantity',
    'unit_of_measurement',
    'reorder_threshold',
  ];

  for (const key of allowed) {
    if (payload[key] !== undefined) {
      values.push(payload[key]);
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (!fields.length) {
    const error = new Error('No valid fields to update');
    error.status = 400;
    throw error;
  }

  values.push(id);
  const result = await query(
    `UPDATE components SET ${fields.join(', ')} WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (!result.rowCount) {
    const error = new Error('Component not found');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

export const deleteComponent = async (id) => {
  const result = await query('DELETE FROM components WHERE id = $1 RETURNING id', [id]);
  if (!result.rowCount) {
    const error = new Error('Component not found');
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

export const adjustStock = async (componentId, payload, userId) =>
  withTransaction(async (client) => {
    const componentResult = await client.query(
      'SELECT id, current_stock_quantity FROM components WHERE id = $1 FOR UPDATE',
      [componentId]
    );

    if (!componentResult.rowCount) {
      const error = new Error('Component not found');
      error.status = 404;
      throw error;
    }

    const currentStock = componentResult.rows[0].current_stock_quantity;
    const inputQuantity = Number(payload.quantity);
    const adjustmentType = payload.adjustment_type;
    let newStock = currentStock;
    let delta = 0;

    if (adjustmentType === 'addition') {
      delta = Math.abs(inputQuantity);
      newStock = currentStock + delta;
    } else if (adjustmentType === 'deduction') {
      delta = -Math.abs(inputQuantity);
      newStock = currentStock + delta;
    } else if (adjustmentType === 'correction') {
      newStock = inputQuantity;
      delta = newStock - currentStock;
    } else {
      const error = new Error('adjustment_type must be one of: addition, deduction, correction');
      error.status = 400;
      throw error;
    }

    if (newStock < 0) {
      const error = new Error('Stock cannot be negative');
      error.status = 400;
      throw error;
    }

    await client.query('UPDATE components SET current_stock_quantity = $1 WHERE id = $2', [
      newStock,
      componentId,
    ]);

    const adjustmentResult = await client.query(
      `INSERT INTO stock_adjustments (
        component_id,
        adjustment_type,
        quantity,
        previous_stock,
        new_stock,
        reason,
        created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [componentId, adjustmentType, delta, currentStock, newStock, payload.reason || null, userId]
    );

    const updatedComponent = await client.query('SELECT * FROM components WHERE id = $1', [componentId]);

    return {
      component: updatedComponent.rows[0],
      adjustment: adjustmentResult.rows[0],
    };
  });

export const listPCBs = async () => {
  const result = await query('SELECT * FROM pcbs ORDER BY created_at DESC');
  return result.rows;
};

export const getPCBById = async (id) => {
  const result = await query('SELECT * FROM pcbs WHERE id = $1', [id]);
  if (!result.rowCount) {
    const error = new Error('PCB not found');
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

export const createPCB = async (payload, userId) => {
  const result = await query(
    `INSERT INTO pcbs (pcb_name, pcb_code, description, version, is_active, created_by)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      payload.pcb_name,
      payload.pcb_code,
      payload.description || null,
      payload.version || null,
      payload.is_active ?? true,
      userId,
    ]
  );
  return result.rows[0];
};

export const updatePCB = async (id, payload) => {
  const fields = [];
  const values = [];
  const allowed = ['pcb_name', 'pcb_code', 'description', 'version', 'is_active'];

  for (const key of allowed) {
    if (payload[key] !== undefined) {
      values.push(payload[key]);
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (!fields.length) {
    const error = new Error('No valid fields to update');
    error.status = 400;
    throw error;
  }

  values.push(id);
  const result = await query(
    `UPDATE pcbs SET ${fields.join(', ')} WHERE id = $${values.length}
     RETURNING *`,
    values
  );

  if (!result.rowCount) {
    const error = new Error('PCB not found');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

export const deletePCB = async (id) => {
  const result = await query('DELETE FROM pcbs WHERE id = $1 RETURNING id', [id]);
  if (!result.rowCount) {
    const error = new Error('PCB not found');
    error.status = 404;
    throw error;
  }
  return result.rows[0];
};

export const listPCBComponents = async (pcbId) => {
  const result = await query(
    `SELECT pc.*, c.component_name, c.part_number, c.current_stock_quantity
     FROM pcb_components pc
     JOIN components c ON c.id = pc.component_id
     WHERE pc.pcb_id = $1
     ORDER BY c.component_name ASC`,
    [pcbId]
  );
  return result.rows;
};

export const upsertPCBComponent = async (pcbId, payload) => {
  const result = await query(
    `INSERT INTO pcb_components (pcb_id, component_id, quantity_per_pcb, notes)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (pcb_id, component_id)
     DO UPDATE SET quantity_per_pcb = EXCLUDED.quantity_per_pcb,
                   notes = EXCLUDED.notes,
                   updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [pcbId, payload.component_id, payload.quantity_per_pcb, payload.notes || null]
  );
  return result.rows[0];
};

export const removePCBComponent = async (pcbId, componentId) => {
  const result = await query(
    'DELETE FROM pcb_components WHERE pcb_id = $1 AND component_id = $2 RETURNING id',
    [pcbId, componentId]
  );

  if (!result.rowCount) {
    const error = new Error('PCB component mapping not found');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

export const listProduction = async () => {
  const result = await query(
    `SELECT pp.*, p.pcb_name, p.pcb_code
     FROM pcb_production pp
     JOIN pcbs p ON p.id = pp.pcb_id
     ORDER BY pp.production_date DESC, pp.created_at DESC`
  );
  return result.rows;
};

export const createProduction = async (payload, userId) => {
  const result = await query(
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
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      payload.pcb_id,
      payload.quantity_produced,
      payload.production_date || new Date().toISOString().slice(0, 10),
      payload.batch_number || null,
      payload.dc_number || null,
      payload.location || null,
      payload.status || 'completed',
      payload.notes || null,
      userId,
    ]
  );

  return result.rows[0];
};

export const listConsumption = async () => {
  const result = await query(
    `SELECT cc.*, c.component_name, c.part_number
     FROM component_consumption cc
     JOIN components c ON c.id = cc.component_id
     ORDER BY cc.consumption_date DESC`
  );
  return result.rows;
};

export const listProcurement = async ({ status }) => {
  const values = [];
  const where = [];

  if (status) {
    values.push(status);
    where.push(`pt.status = $${values.length}`);
  }

  const result = await query(
    `SELECT pt.*, c.component_name, c.part_number
     FROM procurement_triggers pt
     JOIN components c ON c.id = pt.component_id
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY pt.trigger_date DESC`,
    values
  );
  return result.rows;
};

export const updateProcurement = async (id, payload, userId) => {
  const values = [payload.status, payload.notes || null, id];
  const shouldResolve = ['ordered', 'received', 'cancelled'].includes(payload.status);

  const result = await query(
    `UPDATE procurement_triggers
     SET status = $1,
         notes = COALESCE($2, notes),
         resolved_at = ${shouldResolve ? 'CURRENT_TIMESTAMP' : 'resolved_at'},
         resolved_by = ${shouldResolve ? `$${values.length + 1}` : 'resolved_by'}
     WHERE id = $3
     RETURNING *`,
    shouldResolve ? [...values, userId] : values
  );

  if (!result.rowCount) {
    const error = new Error('Procurement trigger not found');
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

export const listImportLogs = async () => {
  const result = await query('SELECT * FROM import_logs ORDER BY imported_at DESC');
  return result.rows;
};

export const createImportLog = async (payload, userId) => {
  const result = await query(
    `INSERT INTO import_logs (
      file_name,
      import_type,
      records_imported,
      records_failed,
      status,
      error_details,
      imported_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      payload.file_name,
      payload.import_type,
      payload.records_imported ?? 0,
      payload.records_failed ?? 0,
      payload.status || 'completed',
      payload.error_details || null,
      userId,
    ]
  );

  return result.rows[0];
};
