import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
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
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
    Chip,
} from '@mui/material';
import {
    Upload as UploadIcon,
    Download as DownloadIcon,
    CheckCircle,
    Description,
    Assessment,
} from '@mui/icons-material';
import api from '../../services/api';

const ExcelImportExport = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef();

    const [openImportDialog, setOpenImportDialog] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importType, setImportType] = useState('components');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                setSelectedFile(file);
                setError(null);
            } else {
                setError('Please select a valid Excel file (.xlsx or .xls)');
                setSelectedFile(null);
            }
        }
    };

    const handleImport = async () => {
        if (!selectedFile) {
            setError('Please select a file to import');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('import_type', importType);

        try {
            const response = await api.post('/import/excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(response.data);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error importing file');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (exportType) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/export/${exportType}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${exportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setResult({
                success: true,
                message: `${exportType} exported successfully`,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error exporting data');
        } finally {
            setLoading(false);
        }
    };

    const importOptions = [
        {
            type: 'components',
            title: 'Component Inventory',
            description: 'Import component master data with part numbers, quantities, and requirements',
            icon: <Description color="primary" />,
        },
        {
            type: 'pcb_master_bom',
            title: 'PCB Master + BOM Mapping',
            description: 'Bulk import PCB master and component-to-PCB BOM mapping in one file',
            icon: <Assessment color="primary" />,
        },
        {
            type: 'pcb_production',
            title: 'PCB Production Data',
            description: 'Import production records with batch numbers and quantities',
            icon: <Assessment color="primary" />,
        },
    ];

    const exportOptions = [
        {
            type: 'components',
            title: 'Component Inventory',
            description: 'Export all component data including stock levels and consumption',
        },
        {
            type: 'consumption-report',
            title: 'Consumption Report',
            description: 'Export detailed consumption history and analytics',
        },
        {
            type: 'low-stock-report',
            title: 'Low Stock Report',
            description: 'Export components with low stock levels',
        },
        {
            type: 'pcb-production',
            title: 'PCB Production Report',
            description: 'Export production history and statistics',
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Excel Import & Export
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {result && (
                <Alert
                    severity={result.success ? 'success' : 'error'}
                    sx={{ mb: 2 }}
                    onClose={() => setResult(null)}
                >
                    {result.message}
                    {result.records_imported > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Records imported: {result.records_imported}
                            {result.records_failed > 0 && ` | Failed: ${result.records_failed}`}
                        </Typography>
                    )}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Import Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <UploadIcon sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
                            <Typography variant="h5">Import Data</Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Upload Excel files to import component inventory or production data.
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={() => setOpenImportDialog(true)}
                            fullWidth
                            size="large"
                        >
                            Import from Excel
                        </Button>
                    </Paper>
                </Grid>

                {/* Export Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <DownloadIcon sx={{ mr: 1, fontSize: 32, color: 'success.main' }} />
                            <Typography variant="h5">Export Data</Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Download inventory and consumption reports in Excel format.
                        </Typography>

                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={() => setOpenExportDialog(true)}
                            fullWidth
                            size="large"
                        >
                            Export to Excel
                        </Button>
                    </Paper>
                </Grid>

                {/* Import Guidelines */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Import Guidelines
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Component Import"
                                    secondary="Required columns: Component Name, Part Number, Current Stock Quantity, Monthly Required Quantity"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="PCB Master + BOM Import"
                                    secondary="Required columns: PCB Code, PCB Name, Component Part Number, Quantity Per PCB"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="PCB Production Import"
                                    secondary="Required columns: PCB Code, Quantity Produced, Production Date, Batch Number"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="File Format"
                                    secondary="Supported formats: .xlsx, .xls | Maximum file size: 10MB"
                                />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Import Dialog */}
            <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Import from Excel</DialogTitle>
                <DialogContent>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Select import type:
                        </Typography>
                        <Grid container spacing={2}>
                            {importOptions.map((option) => (
                                <Grid item xs={12} sm={6} key={option.type}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            border: importType === option.type ? '2px solid' : '1px solid',
                                            borderColor: importType === option.type ? 'primary.main' : 'divider',
                                        }}
                                        onClick={() => setImportType(option.type)}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                {option.icon}
                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                    {option.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {option.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => fileInputRef.current?.click()}
                            fullWidth
                        >
                            {selectedFile ? selectedFile.name : 'Choose File'}
                        </Button>
                        {selectedFile && (
                            <Chip
                                label={`${(selectedFile.size / 1024).toFixed(2)} KB`}
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenImportDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        disabled={!selectedFile || loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
                    >
                        Import
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Export Dialog */}
            <Dialog open={openExportDialog} onClose={() => setOpenExportDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Export to Excel</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                        Select the type of data you want to export:
                    </Typography>
                    <Grid container spacing={2}>
                        {exportOptions.map((option) => (
                            <Grid item xs={12} sm={6} key={option.type}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {option.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" paragraph>
                                            {option.description}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => handleExport(option.type)}
                                            disabled={loading}
                                            fullWidth
                                        >
                                            Export
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExportDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExcelImportExport;