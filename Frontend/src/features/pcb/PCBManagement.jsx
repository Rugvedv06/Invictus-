import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Typography,
    Paper,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Chip,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Assignment as BOMIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import {
    fetchPCBs,
    createPCB,
    updatePCB,
    deletePCB,
    clearError,
    clearSuccess,
} from './pcbSlice';
import PCBComponentMapping from './components/PCBComponentMapping';

const PCBManagement = () => {
    const dispatch = useDispatch();
    const { pcbs, loading, error, success } = useSelector((state) => state.pcbs);

    const [openDialog, setOpenDialog] = useState(false);
    const [openMappingDialog, setOpenMappingDialog] = useState(false);
    const [selectedPCB, setSelectedPCB] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        pcb_name: '',
        pcb_code: '',
        description: '',
        version: '',
    });

    useEffect(() => {
        dispatch(fetchPCBs());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setOpenDialog(false);
            resetForm();
            setTimeout(() => dispatch(clearSuccess()), 3000);
        }
    }, [success, dispatch]);

    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 5000);
        }
    }, [error, dispatch]);

    const resetForm = () => {
        setFormData({
            pcb_name: '',
            pcb_code: '',
            description: '',
            version: '',
        });
        setIsEditing(false);
        setSelectedPCB(null);
    };

    const handleOpenDialog = (pcb = null) => {
        if (pcb) {
            setFormData({
                pcb_name: pcb.pcb_name,
                pcb_code: pcb.pcb_code,
                description: pcb.description || '',
                version: pcb.version || '',
            });
            setSelectedPCB(pcb);
            setIsEditing(true);
        } else {
            resetForm();
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        resetForm();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && selectedPCB) {
            dispatch(updatePCB({ id: selectedPCB.id, pcbData: formData }));
        } else {
            dispatch(createPCB(formData));
        }
    };

    const handleDelete = (pcb) => {
        if (window.confirm(`Are you sure you want to delete PCB "${pcb.pcb_name}"?`)) {
            dispatch(deletePCB(pcb.id));
        }
    };

    const handleOpenMapping = (pcb) => {
        setSelectedPCB(pcb);
        setOpenMappingDialog(true);
    };

    const handleCloseMapping = () => {
        setOpenMappingDialog(false);
        setSelectedPCB(null);
    };

    const columns = [
        {
            field: 'pcb_code',
            headerName: 'PCB Code',
            width: 150,
            renderCell: (params) => (
                <Chip label={params.value} color="primary" size="small" />
            ),
        },
        { field: 'pcb_name', headerName: 'PCB Name', width: 250 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'version', headerName: 'Version', width: 100 },
        {
            field: 'is_active',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Active' : 'Inactive'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View/Edit BOM">
                        <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenMapping(params.row)}
                        >
                            <BOMIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit PCB">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(params.row)}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete PCB">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(params.row)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">PCB Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add PCB
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                    {error.message || 'An error occurred'}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>
                    Operation completed successfully!
                </Alert>
            )}

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={pcbs}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    loading={loading}
                    disableSelectionOnClick
                />
            </Paper>

            {/* Add/Edit PCB Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {isEditing ? 'Edit PCB' : 'Add New PCB'}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="PCB Code"
                                    name="pcb_code"
                                    value={formData.pcb_code}
                                    onChange={handleInputChange}
                                    disabled={isEditing}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="PCB Name"
                                    name="pcb_name"
                                    value={formData.pcb_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Version"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* PCB Component Mapping Dialog */}
            <Dialog
                open={openMappingDialog}
                onClose={handleCloseMapping}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Bill of Materials - {selectedPCB?.pcb_name}
                </DialogTitle>
                <DialogContent>
                    {selectedPCB && <PCBComponentMapping pcb={selectedPCB} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMapping}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PCBManagement;
