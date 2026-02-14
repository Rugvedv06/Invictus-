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
    total_components: components.rows[0].count,
    low_stock_components: lowStock.rows[0].count,
    active_pcbs: pcbs.rows[0].count,
    total_production_quantity: productions.rows[0].total,
    pending_procurement_triggers: pendingProcurement.rows[0].count,
  };
};

export const getComponentConsumptionSummary = async () => {
  const result = await query('SELECT * FROM v_component_consumption_summary ORDER BY total_consumed DESC');
  return result.rows;
};

export const getTopConsumedComponents = async () => {
  const result = await query('SELECT * FROM v_top_consumed_components');
  return result.rows;
};

export const getLowStockComponentsView = async () => {
  const result = await query('SELECT * FROM v_low_stock_components');
  return result.rows;
};

export const getPCBProductionSummary = async () => {
  const result = await query('SELECT * FROM v_pcb_production_summary ORDER BY total_quantity_produced DESC NULLS LAST');
  return result.rows;
};
