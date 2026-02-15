import React from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import styles from '../styles/Analytics.module.css';
import ChartContainer from './ChartContainer';

const ConsumptionCharts = ({ consumptionSummary, totalComponents, lowStockCount }) => {
    return (
        <div className={styles.chartGrid}>
            <ChartContainer title="Component-wise Consumption Summary">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={consumptionSummary.slice(0, 15)} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="component_name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            stroke="#CBD5E1"
                        />
                        <YAxis
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            stroke="#CBD5E1"
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 8,
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="total_consumed" fill="#3B82F6" name="Total Consumed" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="current_stock_quantity" fill="#14B8A6" name="Current Stock" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Stock Status Distribution">
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={[
                                { name: 'Normal Stock', value: totalComponents - lowStockCount },
                                { name: 'Low Stock', value: lowStockCount },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {[0, 1].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
};

export default ConsumptionCharts;
