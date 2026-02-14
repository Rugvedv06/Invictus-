import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Card,
    CardContent,
    Alert,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    TrendingUp,
    TrendingDown,
    Inventory,
    Warning,
    CheckCircle,
    LocalShipping,
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    fetchConsumptionSummary,
    fetchTopConsumed,
    fetchLowStock,
    fetchPCBProductionSummary,
    fetchStockAlerts,
    fetchProcurementStatus,
    clearError,
} from './analyticsSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsDashboard = () => {
    const dispatch = useDispatch();
    const {
        consumptionSummary,
        topConsumed,
        lowStock,
        pcbProductionSummary,
        stockAlerts,
        procurementStatus,
        loading,
        error,
    } = useSelector((state) => state.analytics);

    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        loadAllData();
    }, [dispatch]);

    const loadAllData = () => {
        dispatch(fetchConsumptionSummary());
        dispatch(fetchTopConsumed({ limit: 20 }));
        dispatch(fetchLowStock());
        dispatch(fetchPCBProductionSummary());
        dispatch(fetchStockAlerts());
        dispatch(fetchProcurementStatus());
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Calculate key metrics
    const totalComponents = consumptionSummary.length;
    const lowStockCount = lowStock.length;
    const totalConsumed = consumptionSummary.reduce(
        (sum, item) => sum + (item.total_consumed || 0),
        0
    );
    const pendingProcurement = procurementStatus.filter(
        (item) => item.status === 'pending'
    ).length;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Analytics Dashboard</Typography>
                <Tooltip title="Refresh Data">
                    <IconButton onClick={loadAllData} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                    {error.message || 'Error loading analytics data'}
                </Alert>
            )}

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            {/* Key Metrics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" variant="body2">
                                        Total Components
                                    </Typography>
                                    <Typography variant="h4">{totalComponents}</Typography>
                                </Box>
                                <Inventory sx={{ fontSize: 40, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" variant="body2">
                                        Total Consumed
                                    </Typography>
                                    <Typography variant="h4">{totalConsumed.toLocaleString()}</Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" variant="body2">
                                        Low Stock Items
                                    </Typography>
                                    <Typography variant="h4" color="error">
                                        {lowStockCount}
                                    </Typography>
                                </Box>
                                <Warning sx={{ fontSize: 40, color: 'error.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="textSecondary" variant="body2">
                                        Pending Procurement
                                    </Typography>
                                    <Typography variant="h4" color="warning.main">
                                        {pendingProcurement}
                                    </Typography>
                                </Box>
                                <LocalShipping sx={{ fontSize: 40, color: 'warning.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Consumption Analysis" />
                <Tab label="Top Consumed" />
                <Tab label="Low Stock Alerts" />
                <Tab label="PCB Production" />
                <Tab label="Procurement Status" />
            </Tabs>

            {/* Tab 0: Consumption Analysis */}
            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Component-wise Consumption Summary
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={consumptionSummary.slice(0, 15)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="component_name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <ChartTooltip />
                                    <Legend />
                                    <Bar dataKey="total_consumed" fill="#8884d8" name="Total Consumed" />
                                    <Bar dataKey="current_stock_quantity" fill="#82ca9d" name="Current Stock" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Stock Status Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Normal Stock', value: totalComponents - lowStockCount },
                                            { name: 'Low Stock', value: lowStockCount },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {[0, 1].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Tab 1: Top Consumed Components */}
            {activeTab === 1 && (
                <Paper>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Top 20 Consumed Components
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>Part Number</TableCell>
                                    <TableCell>Component Name</TableCell>
                                    <TableCell align="right">Total Consumed</TableCell>
                                    <TableCell align="right">Avg per Transaction</TableCell>
                                    <TableCell align="right">Current Stock</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topConsumed.map((component, index) => (
                                    <TableRow key={component.part_number}>
                                        <TableCell>
                                            <Chip label={index + 1} size="small" color="primary" />
                                        </TableCell>
                                        <TableCell>{component.part_number}</TableCell>
                                        <TableCell>{component.component_name}</TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight="bold">
                                                {component.total_consumed?.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {component.avg_consumption_per_transaction?.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right">{component.current_stock_quantity}</TableCell>
                                        <TableCell align="center">
                                            {component.is_low_stock ? (
                                                <Chip label="Low Stock" color="error" size="small" />
                                            ) : (
                                                <Chip label="OK" color="success" size="small" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Tab 2: Low Stock Alerts */}
            {activeTab === 2 && (
                <Paper>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Low Stock Components (Less than 20% of Monthly Requirement)
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Part Number</TableCell>
                                    <TableCell>Component Name</TableCell>
                                    <TableCell align="right">Current Stock</TableCell>
                                    <TableCell align="right">Monthly Required</TableCell>
                                    <TableCell align="center">Stock Level</TableCell>
                                    <TableCell>Procurement Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lowStock.map((component) => {
                                    const percentage = component.stock_percentage || 0;
                                    return (
                                        <TableRow key={component.part_number}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {component.part_number}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{component.component_name}</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={component.current_stock_quantity}
                                                    color="error"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">{component.monthly_required_quantity}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={Math.min(percentage, 100)}
                                                            color={percentage < 10 ? 'error' : 'warning'}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption">{percentage.toFixed(0)}%</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {component.procurement_status ? (
                                                    <Chip
                                                        label={component.procurement_status}
                                                        color={
                                                            component.procurement_status === 'pending'
                                                                ? 'warning'
                                                                : 'success'
                                                        }
                                                        size="small"
                                                    />
                                                ) : (
                                                    <Chip label="No trigger" size="small" variant="outlined" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Tab 3: PCB Production Summary */}
            {activeTab === 3 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                PCB Production Overview
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={pcbProductionSummary}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="pcb_code" />
                                    <YAxis />
                                    <ChartTooltip />
                                    <Legend />
                                    <Bar dataKey="total_quantity_produced" fill="#8884d8" name="Total Produced" />
                                    <Bar dataKey="total_productions" fill="#82ca9d" name="Production Runs" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>PCB Code</TableCell>
                                        <TableCell>PCB Name</TableCell>
                                        <TableCell align="right">Total Produced</TableCell>
                                        <TableCell align="right">Production Runs</TableCell>
                                        <TableCell>Last Production</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pcbProductionSummary.map((pcb) => (
                                        <TableRow key={pcb.pcb_code}>
                                            <TableCell>
                                                <Chip label={pcb.pcb_code} color="primary" size="small" />
                                            </TableCell>
                                            <TableCell>{pcb.pcb_name}</TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight="bold">
                                                    {pcb.total_quantity_produced?.toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">{pcb.total_productions}</TableCell>
                                            <TableCell>
                                                {pcb.last_production_date
                                                    ? new Date(pcb.last_production_date).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}

            {/* Tab 4: Procurement Status */}
            {activeTab === 4 && (
                <Paper>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Procurement Triggers & Status
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Component</TableCell>
                                    <TableCell align="right">Current Stock</TableCell>
                                    <TableCell align="right">Required Qty</TableCell>
                                    <TableCell>Trigger Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {procurementStatus.map((trigger) => (
                                    <TableRow key={trigger.id}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {trigger.component_name}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {trigger.part_number}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={trigger.current_stock}
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">{trigger.required_quantity}</TableCell>
                                        <TableCell>
                                            {new Date(trigger.trigger_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={trigger.status}
                                                size="small"
                                                color={
                                                    trigger.status === 'pending'
                                                        ? 'warning'
                                                        : trigger.status === 'ordered'
                                                            ? 'info'
                                                            : 'success'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{trigger.notes || '-'}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    );
};

export default AnalyticsDashboard;
