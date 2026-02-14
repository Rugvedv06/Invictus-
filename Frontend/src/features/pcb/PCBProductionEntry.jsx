import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Typography,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Autocomplete,
    Chip,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import {
    fetchPCBs,
    fetchPCBComponents,
    createProduction,
    fetchProductions,
    clearError,
    clearSuccess,
} from './pcbSlice';

const PCBProductionEntry = () => {
    const dispatch = useDispatch();
    const { pcbs, pcbComponents, productions, loading, error, success } = useSelector(
        (state) => state.pcbs
    );

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPCB, setSelectedPCB] = useState(null);
    const [productionData, setProductionData] = useState({
        quantity_produced: '',
        production_date: new Date().toISOString().split('T')[0],
        batch_number: '',
        dc_number: '',
        location: '',
        notes: '',
    });
    const [componentCheck, setComponentCheck] = useState([]);
    const [canProduce, setCanProduce] = useState(false);

    const hasValidQuantity = Number.parseInt(productionData.quantity_produced, 10) > 0;
    const hasMappedComponents = pcbComponents.length > 0;

    useEffect(() => {
        dispatch(fetchPCBs());
        dispatch(fetchProductions());
    }, [dispatch]);

    useEffect(() => {
        if (selectedPCB) {
            dispatch(fetchPCBComponents(selectedPCB.id));
        }
    }, [selectedPCB, dispatch]);

    useEffect(() => {
        if (success) {
            setOpenDialog(false);
            resetForm();
            dispatch(fetchProductions());
            setTimeout(() => dispatch(clearSuccess()), 3000);
        }
    }, [success, dispatch]);

    useEffect(() => {
        if (pcbComponents.length > 0 && productionData.quantity_produced) {
            checkComponentAvailability();
        } else {
            setCanProduce(false);
        }
    }, [pcbComponents, productionData.quantity_produced]);

    const checkComponentAvailability = () => {
        const quantity = parseInt(productionData.quantity_produced) || 0;

        const checks = pcbComponents.map((component) => {
            const required = component.quantity_per_pcb * quantity;
            const available = component.current_stock_quantity || 0;
            const sufficient = available >= required;

            return {
                component_name: component.component_name,
                part_number: component.part_number,
                required,
                available,
                sufficient,
                shortage: sufficient ? 0 : required - available,
            };
        });

        setComponentCheck(checks);
        setCanProduce(checks.every((check) => check.sufficient));
    };

    const resetForm = () => {
        setSelectedPCB(null);
        setProductionData({
            quantity_produced: '',
            production_date: new Date().toISOString().split('T')[0],
            batch_number: '',
            dc_number: '',
            location: '',
            notes: '',
        });
        setComponentCheck([]);
        setCanProduce(false);
    };

    const handleOpenDialog = () => {
        resetForm();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        resetForm();
    };

    const handlePCBChange = (event, newValue) => {
        setSelectedPCB(newValue);
        setComponentCheck([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedPCB || !canProduce) {
            return;
        }

        dispatch(
            createProduction({
                pcb_id: selectedPCB.id,
                ...productionData,
                quantity_produced: parseInt(productionData.quantity_produced),
            })
        );
    };

    const productionColumns = [
        {
            field: 'pcb_name',
            headerName: 'PCB',
            width: 200,
            renderCell: (params) => (
                <Chip label={params.row.pcb_code} color="primary" size="small" />
            ),
        },
        { field: 'quantity_produced', headerName: 'Quantity', width: 100 },
        { field: 'production_date', headerName: 'Date', width: 120 },
        { field: 'batch_number', headerName: 'Batch #', width: 150 },
        { field: 'dc_number', headerName: 'DC #', width: 150 },
        { field: 'location', headerName: 'Location', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'completed' ? 'success' : 'warning'}
                    size="small"
                />
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">PCB Production Entry</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    New Production Entry
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                    {error.message || 'An error occurred'}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
                    Production entry created successfully! Components deducted from stock.
                </Alert>
            )}

            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={productions}
                    columns={productionColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    loading={loading}
                    disableSelectionOnClick
                />
            </Paper>

            {/* Production Entry Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>New Production Entry</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={pcbs.filter((pcb) => pcb.is_active)}
                                    getOptionLabel={(option) => `${option.pcb_code} - ${option.pcb_name}`}
                                    value={selectedPCB}
                                    onChange={handlePCBChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select PCB" required />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Quantity to Produce"
                                    name="quantity_produced"
                                    value={productionData.quantity_produced}
                                    onChange={handleInputChange}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Production Date"
                                    name="production_date"
                                    value={productionData.production_date}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Batch Number"
                                    name="batch_number"
                                    value={productionData.batch_number}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="DC Number"
                                    name="dc_number"
                                    value={productionData.dc_number}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={productionData.location}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Notes"
                                    name="notes"
                                    value={productionData.notes}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            {/* Component Availability Check */}
                            {selectedPCB && hasValidQuantity && !hasMappedComponents && (
                                <Grid item xs={12}>
                                    <Alert severity="warning">
                                        This PCB has no component mapping (BOM). Add components in PCB Management
                                        before creating a production entry.
                                    </Alert>
                                </Grid>
                            )}

                            {componentCheck.length > 0 && (
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Component Availability Check
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <List dense>
                                                {componentCheck.map((check, index) => (
                                                    <ListItem
                                                        key={index}
                                                        sx={{
                                                            bgcolor: check.sufficient
                                                                ? 'success.lighter'
                                                                : 'error.lighter',
                                                            mb: 1,
                                                            borderRadius: 1,
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                            {check.sufficient ? (
                                                                <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                                                            ) : (
                                                                <WarningIcon color="error" sx={{ mr: 2 }} />
                                                            )}
                                                            <ListItemText
                                                                primary={`${check.part_number} - ${check.component_name}`}
                                                                secondary={
                                                                    check.sufficient
                                                                        ? `Available: ${check.available} | Required: ${check.required}`
                                                                        : `Shortage: ${check.shortage} units (Available: ${check.available}, Required: ${check.required})`
                                                                }
                                                            />
                                                        </Box>
                                                    </ListItem>
                                                ))}
                                            </List>

                                            {!canProduce && (
                                                <Alert severity="error" sx={{ mt: 2 }}>
                                                    Cannot proceed with production due to insufficient component stock.
                                                    Please procure the required components first.
                                                </Alert>
                                            )}

                                            {canProduce && (
                                                <Alert severity="success" sx={{ mt: 2 }}>
                                                    All components are available. Production can proceed.
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || !selectedPCB || !hasValidQuantity || !canProduce}
                        >
                            Create Production Entry
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default PCBProductionEntry;
