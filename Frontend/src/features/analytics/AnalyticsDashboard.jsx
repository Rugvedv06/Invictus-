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
        // load data for the initially active tab
        fetchTabData(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const loadAllData = () => {
        dispatch(fetchConsumptionSummary());
        dispatch(fetchTopConsumed({ limit: 20 }));
        dispatch(fetchLowStock());
        dispatch(fetchPCBProductionSummary());
        dispatch(fetchStockAlerts());
        dispatch(fetchProcurementStatus());
    };

    const fetchTabData = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                dispatch(fetchConsumptionSummary());
                dispatch(fetchStockAlerts());
                break;
            case 1:
                dispatch(fetchTopConsumed({ limit: 20 }));
                break;
            case 2:
                dispatch(fetchLowStock());
                break;
            case 3:
                dispatch(fetchPCBProductionSummary());
                break;
            case 4:
                dispatch(fetchProcurementStatus());
                break;
            default:
                break;
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        fetchTabData(newValue);
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
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Analytics Dashboard
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
                        Overview of inventory performance and stock levels
                    </Typography>
                </Box>
                <Tooltip title="Refresh Data">
                    <IconButton
                        onClick={loadAllData}
                        disabled={loading}
                        sx={{
                            bgcolor: 'white',
                            boxShadow: 2,
                            '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                    >
                        <RefreshIcon color="primary" />
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
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        Total Components
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{totalComponents}</Typography>
                                </Box>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    display: 'flex'
                                }}>
                                    <Inventory sx={{ fontSize: 30, color: 'white' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #006064 0%, #00838f 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px 0 rgba(0, 96, 100, 0.3)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        Total Consumed
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{totalConsumed.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    display: 'flex'
                                }}>
                                    <TrendingUp sx={{ fontSize: 30, color: 'white' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px 0 rgba(183, 28, 28, 0.3)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        Low Stock Items
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {lowStockCount}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    display: 'flex'
                                }}>
                                    <Warning sx={{ fontSize: 30, color: 'white' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px 0 rgba(255, 111, 0, 0.3)'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                                        Pending Procurement
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {pendingProcurement}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    display: 'flex'
                                }}>
                                    <LocalShipping sx={{ fontSize: 30, color: 'white' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.08)' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                        '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', py: 2 }
                    }}
                >
                    <Tab label="Consumption Analysis" />
                    <Tab label="Top Consumed" />
                    <Tab label="Low Stock Alerts" />
                    <Tab label="PCB Production" />
                    <Tab label="Procurement Status" />
                </Tabs>
            </Paper>
            {/* Tab 0: Consumption Analysis */}
            {/* using conditional rendering to avoid mounting all charts at once */}
            {activeTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                Component-wise Consumption Summary
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={consumptionSummary.slice(0, 15)} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                                    <XAxis dataKey="component_name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#666' }} />
                                    <YAxis tick={{ fill: '#666' }} />
                                    <ChartTooltip
                                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="total_consumed" fill="#3f51b5" name="Total Consumed" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="current_stock_quantity" fill="#009688" name="Current Stock" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                Stock Status Distribution
                            </Typography>
                            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
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
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#4caf50' : '#f44336'} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip contentStyle={{ borderRadius: 8 }} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Tab 1: Top Consumed Components */}
            {activeTab === 1 && (
                <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Top 20 Consumed Components
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Part Number</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Component Name</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Consumed</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg per Transaction</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topConsumed.map((component, index) => (
                                    <TableRow key={component.part_number} hover>
                                        <TableCell>
                                            <Chip label={index + 1} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }} />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{component.part_number}</TableCell>
                                        <TableCell>{component.component_name}</TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" fontWeight="bold" color="primary">
                                                {component.total_consumed?.toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {component.avg_consumption_per_transaction?.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right">{component.current_stock_quantity}</TableCell>
                                        <TableCell align="center">
                                            {component.is_low_stock ? (
                                                <Chip label="Low Stock" color="error" size="small" sx={{ fontWeight: 500 }} />
                                            ) : (
                                                <Chip label="OK" color="success" size="small" variant="outlined" sx={{ fontWeight: 500 }} />
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
                <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                            Low Stock Alerts
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Components with stock less than 20% of monthly requirement
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#ffebee' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Part Number</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Component Name</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Monthly Required</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock Level</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Procurement Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lowStock.map((component) => {
                                    const percentage = component.stock_percentage || 0;
                                    return (
                                        <TableRow key={component.part_number} hover>
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
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">{component.monthly_required_quantity}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={Math.min(percentage, 100)}
                                                            color="error"
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                    </Box>
                                                    <Typography variant="caption" fontWeight="bold">{percentage.toFixed(0)}%</Typography>
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
                                                        sx={{ textTransform: 'capitalize' }}
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
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                PCB Production Overview
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={pcbProductionSummary} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                                    <XAxis dataKey="pcb_code" tick={{ fill: '#666' }} />
                                    <YAxis tick={{ fill: '#666' }} />
                                    <ChartTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="total_quantity_produced" fill="#7e57c2" name="Total Produced" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="total_productions" fill="#26a69a" name="Production Runs" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>PCB Code</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>PCB Name</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Produced</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Production Runs</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Last Production</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pcbProductionSummary.map((pcb) => (
                                            <TableRow key={pcb.pcb_code} hover>
                                                <TableCell>
                                                    <Chip label={pcb.pcb_code} color="primary" size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{pcb.pcb_name}</TableCell>
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
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Tab 4: Procurement Status */}
            {activeTab === 4 && (
                <Paper sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Procurement Triggers & Status
                        </Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Component</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Required Qty</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Trigger Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {procurementStatus.map((trigger) => (
                                    <TableRow key={trigger.id} hover>
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
                                                sx={{ fontWeight: 'bold' }}
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
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{trigger.notes || '-'}</Typography>
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
