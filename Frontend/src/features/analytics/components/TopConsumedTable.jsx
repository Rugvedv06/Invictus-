import React from 'react';
import styles from '../styles/Analytics.module.css';

const TopConsumedTable = ({ topConsumed }) => {
    return (
        <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Top 20 Consumed Components</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Part Number</th>
                            <th>Component Name</th>
                            <th align="right">Total Consumed</th>
                            <th align="right">Avg / Transaction</th>
                            <th align="right">Current Stock</th>
                            <th align="center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topConsumed.map((component, index) => (
                            <tr key={component.part_number}>
                                <td>
                                    <span style={{
                                        display: 'inline-flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: '#F1F5F9',
                                        borderRadius: '50%',
                                        fontSize: '12px',
                                        fontWeight: 600
                                    }}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td>{component.part_number}</td>
                                <td>{component.component_name}</td>
                                <td align="right" style={{ fontWeight: 600, color: '#0F172A' }}>
                                    {component.total_consumed?.toLocaleString()}
                                </td>
                                <td align="right">
                                    {component.avg_consumption_per_transaction?.toFixed(2)}
                                </td>
                                <td align="right">{component.current_stock_quantity}</td>
                                <td align="center">
                                    {component.is_low_stock ? (
                                        <span className={`${styles.chip} ${styles.chipError}`}>Low Stock</span>
                                    ) : (
                                        <span className={`${styles.chip} ${styles.chipSuccess}`}>OK</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopConsumedTable;
