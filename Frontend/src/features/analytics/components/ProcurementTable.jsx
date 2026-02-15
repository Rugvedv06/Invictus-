import React from 'react';
import styles from '../styles/Analytics.module.css';

const ProcurementTable = ({ procurementStatus }) => {
    return (
        <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
                <div>
                    <h3 className={styles.tableTitle}>Procurement Triggers & Status</h3>
                    <p className={styles.tableSubtitle}>Automated triggers generated when stock falls below 20% of monthly requirement</p>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th align="right">Current Stock</th>
                            <th align="right">Required Qty</th>
                            <th>Trigger Date</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {procurementStatus.map((trigger) => (
                            <tr key={trigger.id}>
                                <td>
                                    <div style={{ fontWeight: 500, color: '#0F172A' }}>
                                        {trigger.component_name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                                        {trigger.part_number}
                                    </div>
                                </td>
                                <td align="right">
                                    <span style={{ fontWeight: 600, color: '#EF4444' }}>
                                        {trigger.current_stock}
                                    </span>
                                </td>
                                <td align="right">{trigger.required_quantity}</td>
                                <td>
                                    {new Date(trigger.trigger_date).toLocaleDateString()}
                                </td>
                                <td>
                                    <span
                                        className={`
                                            ${styles.chip} 
                                            ${trigger.status === 'pending' ? styles.chipWarning :
                                                trigger.status === 'ordered' ? styles.chipInfo : styles.chipSuccess}
                                        `}
                                        style={{ textTransform: 'capitalize' }}
                                    >
                                        {trigger.status}
                                    </span>
                                </td>
                                <td style={{ color: '#64748B', fontStyle: 'italic' }}>
                                    {trigger.notes || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcurementTable;
