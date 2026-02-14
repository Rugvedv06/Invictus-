import { query } from '../config/db.js';

export const getDashboardStats = async () => {
  const [components, lowStock, pcbs, productions, pendingProcurement] = await Promise.all([
    query('SELECT COUNT(*)::INT AS count FROM components'),
    query('SELECT COUNT(*)::INT AS count FROM components WHERE is_low_stock = true'),
    query('SELECT COUNT(*)::INT AS count FROM pcbs WHERE is_active = true'),
    query('SELECT COALESCE(SUM(quantity_produced), 0)::INT AS total FROM pcb_production'),
    query("SELECT COUNT(*)::INT AS count FROM procurement_triggers WHERE status = 'pending'"),
  ]);

  return {
    total_components: Number(components.rows[0].count),
    low_stock_components: Number(lowStock.rows[0].count),
    active_pcbs: Number(pcbs.rows[0].count),
    total_production_quantity: Number(productions.rows[0].total),
    pending_procurement_triggers: Number(pendingProcurement.rows[0].count),
  };
};

export const getComponentConsumptionSummary = async () => {
  const result = await query('SELECT * FROM v_component_consumption_summary ORDER BY total_consumed DESC');
  return result.rows.map((row) => ({
    ...row,
    total_consumed: Number(row.total_consumed),
    stock_percentage: Number(row.stock_percentage),
    current_stock_quantity: Number(row.current_stock_quantity),
    monthly_required_quantity: Number(row.monthly_required_quantity),
  }));
};

export const getTopConsumedComponents = async () => {
  const result = await query(
    `SELECT
      c.component_name,
      c.part_number,
      c.current_stock_quantity,
      c.is_low_stock,
      COALESCE(SUM(cc.quantity_consumed), 0) AS total_consumed,
      COUNT(DISTINCT DATE(cc.consumption_date)) AS consumption_days,
      COALESCE(AVG(cc.quantity_consumed), 0) AS avg_consumption_per_transaction
     FROM components c
     LEFT JOIN component_consumption cc ON c.id = cc.component_id
     GROUP BY c.id, c.component_name, c.part_number, c.current_stock_quantity, c.is_low_stock
     ORDER BY total_consumed DESC`
  );
  return result.rows.map((row) => ({
    ...row,
    total_consumed: Number(row.total_consumed),
    consumption_days: Number(row.consumption_days),
    avg_consumption_per_transaction: Number(row.avg_consumption_per_transaction),
    current_stock_quantity: Number(row.current_stock_quantity),
  }));
};

export const getLowStockComponentsView = async () => {
  const result = await query('SELECT * FROM v_low_stock_components');
  return result.rows.map((row) => ({
    ...row,
    current_stock_quantity: Number(row.current_stock_quantity),
    monthly_required_quantity: Number(row.monthly_required_quantity),
    stock_percentage: Number(row.stock_percentage),
  }));
};

export const getPCBProductionSummary = async () => {
  const result = await query('SELECT * FROM v_pcb_production_summary ORDER BY total_quantity_produced DESC NULLS LAST');
  return result.rows.map((row) => ({
    ...row,
    total_productions: Number(row.total_productions),
    total_quantity_produced: Number(row.total_quantity_produced),
  }));
};
