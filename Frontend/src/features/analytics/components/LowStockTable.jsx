import React from 'react';
import styles from '../styles/Analytics.module.css';

const LowStockTable = ({ lowStock }) => {
    return (
        <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
                <div>
                    <h3 className={styles.tableTitle} style={{ color: '#EF4444' }}>Low Stock Alerts</h3>
                    <p className={styles.tableSubtitle}>Components with stock less than 20% of monthly requirement</p>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>Part Number</th>
                            <th>Component Name</th>
                            <th align="right">Current Stock</th>
                            <th align="right">Monthly Required</th>
                            <th align="center">Stock Level</th>
                            <th>Procurement Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStock.map((component) => {
                            const percentage = component.stock_percentage || 0;
                            return (
                                <tr key={component.part_number}>
                                    <td style={{ fontWeight: 500 }}>{component.part_number}</td>
                                    <td>{component.component_name}</td>
                                    <td align="right">
                                        <span className={`${styles.chip} ${styles.chipError}`}>
                                            {component.current_stock_quantity}
                                        </span>
                                    </td>
                                    <td align="right">{component.monthly_required_quantity}</td>
                                    <td align="center">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '120px', margin: '0 auto' }}>
                                            <div style={{ flex: 1, height: '6px', backgroundColor: '#FEE2E2', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div
                                                    style={{
                                                        width: `${Math.min(percentage, 100)}%`,
                                                        height: '100%',
                                                        backgroundColor: '#EF4444'
                                                    }}
                                                />
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: 600 }}>{percentage.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        {component.procurement_status ? (
                                            <span
                                                className={`
                                                    ${styles.chip} 
                                                    ${component.procurement_status === 'pending' ? styles.chipWarning : styles.chipSuccess}
                                                `}
                                                style={{ textTransform: 'capitalize' }}
                                            >
                                                {component.procurement_status}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#94A3B8', fontSize: '12px' }}>No trigger</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LowStockTable;
