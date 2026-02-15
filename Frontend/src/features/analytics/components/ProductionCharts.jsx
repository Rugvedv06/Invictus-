import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import styles from '../styles/Analytics.module.css';
import ChartContainer from './ChartContainer';

const ProductionCharts = ({ pcbProductionSummary }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <ChartContainer title="PCB Production Overview" fullWidth>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={pcbProductionSummary} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="pcb_code"
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            stroke="#CBD5E1"
                        />
                        <YAxis
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            stroke="#CBD5E1"
                        />
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="total_quantity_produced" fill="#8B5CF6" name="Total Produced" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="total_productions" fill="#10B981" name="Production Runs" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h3 className={styles.tableTitle}>Production Details</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className={styles.customTable}>
                        <thead>
                            <tr>
                                <th>PCB Code</th>
                                <th>PCB Name</th>
                                <th align="right">Total Produced</th>
                                <th align="right">Production Runs</th>
                                <th>Last Production</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pcbProductionSummary.map((pcb) => (
                                <tr key={pcb.pcb_code}>
                                    <td>
                                        <span className={`${styles.chip} ${styles.chipInfo}`}>
                                            {pcb.pcb_code}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{pcb.pcb_name}</td>
                                    <td align="right" style={{ fontWeight: 600 }}>
                                        {pcb.total_quantity_produced?.toLocaleString()}
                                    </td>
                                    <td align="right">{pcb.total_productions}</td>
                                    <td>
                                        {pcb.last_production_date
                                            ? new Date(pcb.last_production_date).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductionCharts;
