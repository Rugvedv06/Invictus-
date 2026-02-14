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
    IconButton,
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    fetchPCBComponents,
    addComponentToPCB,
    removePCBComponent,
    clearError,
    clearSuccess,
} from '../pcbSlice';
import { getAllInventory } from '../../inventory/inventorySlice';

const PCBComponentMapping = ({ pcb }) => {
    const dispatch = useDispatch();
    const { pcbComponents, loading, error, success } = useSelector((state) => state.pcbs);
    const { items } = useSelector((state) => state.inventory);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (pcb?.id) {
            dispatch(fetchPCBComponents(pcb.id));
        }
        dispatch(getAllInventory());
    }, [pcb?.id, dispatch]);

    useEffect(() => {
        if (success) {
            setOpenDialog(false);
            resetForm();
            setTimeout(() => dispatch(clearSuccess()), 3000);
        }
    }, [success, dispatch]);

    const resetForm = () => {
        setSelectedComponent(null);
        setQuantity('');
        setNotes('');
    };

    const handleOpenDialog = () => {
        resetForm();
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        resetForm();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedComponent || !quantity || parseInt(quantity) <= 0) {
            return;
        }

        dispatch(
            addComponentToPCB({
                pcbId: pcb.id,
                componentData: {
                    component_id: selectedComponent.id,
                    quantity_per_pcb: parseInt(quantity),
                    notes,
                },
            })
        );
    };

    const handleRemoveComponent = (component) => {
        if (window.confirm(`Remove ${component.component_name} from BOM?`)) {
            dispatch(
                removePCBComponent({
                    pcbId: pcb.id,
                    componentId: component.component_id || component.id,
                    mappingId: component.id,
                })
            );
        }
    };

    const availableComponents = (items || []).filter(
        (comp) => !pcbComponents.find((pcbComp) => pcbComp.component_id === comp.id)
    );

    return (
        <Box sx={{ p: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                    {error.message || 'An error occurred'}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
                    Component mapping updated successfully!
                </Alert>
            )}

            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Components in BOM</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    size="small"
                >
                    Add Component
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Part Number</TableCell>
                            <TableCell>Component Name</TableCell>
                            <TableCell align="right">Qty per PCB</TableCell>
                            <TableCell align="right">Current Stock</TableCell>
                            <TableCell align="right">Available PCBs</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pcbComponents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" color="textSecondary">
                                        No components added to BOM yet
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            pcbComponents.map((component) => {
                                const availablePCBs = Math.floor(
                                    (component.current_stock_quantity || 0) / component.quantity_per_pcb
                                );
                                const isLowStock = component.is_low_stock || availablePCBs < 10;

                                return (
                                    <TableRow key={component.id}>
                                        <TableCell>{component.part_number}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {component.component_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={component.quantity_per_pcb}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">{component.current_stock_quantity || 0}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={availablePCBs}
                                                size="small"
                                                color={isLowStock ? 'error' : 'success'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {isLowStock && (
                                                <Chip label="Low Stock" color="error" size="small" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{component.notes || '-'}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemoveComponent(component)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pcbComponents.length > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2">
                        <strong>Summary:</strong> {pcbComponents.length} component(s) in BOM
                    </Typography>
                </Box>
            )}

            {/* Add Component Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add Component to BOM</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={availableComponents}
                                    getOptionLabel={(option) =>
                                        `${option.partNumber || option.part_number || ''} - ${option.name || option.component_name || ''} (Stock: ${option.stock ?? option.current_stock_quantity ?? 0})`
                                    }
                                    value={selectedComponent}
                                    onChange={(e, newValue) => setSelectedComponent(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Component"
                                            required
                                            helperText="Search by part number or component name"
                                        />
                                    )}
                                    renderOption={(props, option) => {
                                        const { key, ...restProps } = props;
                                        return (
                                        <Box component="li" key={key} {...restProps}>
                                            <Box>
                                                <Typography variant="body2">
                                                    <strong>{option.partNumber || option.part_number}</strong> - {option.name || option.component_name}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Stock: {option.stock ?? option.current_stock_quantity ?? 0} |
                                                    Required/month: {option.monthlyRequired ?? option.monthly_required_quantity ?? 0}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        );
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Quantity per PCB"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    inputProps={{ min: 1 }}
                                    helperText="How many of this component are used in one PCB"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Notes (Optional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    helperText="Any special notes about this component"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            Add to BOM
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default PCBComponentMapping;
