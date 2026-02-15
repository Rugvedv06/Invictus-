import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Upload as UploadIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { Alert } from '@mui/material';

import api from '../../services/api';
import styles from './styles/ExcelImportExport.module.css';

import ImportExportHeader from './components/ImportExportHeader';
import ActionCard from './components/ActionCard';
import GuidelinesSection from './components/GuidelinesSection';
import ImportModal from './components/ImportModal';
import ExportModal from './components/ExportModal';

const ExcelImportExport = () => {
    // const dispatch = useDispatch(); // Not used in original logic, but kept in imports just in case

    // State
    const [openImportDialog, setOpenImportDialog] = useState(false);
    const [openExportDialog, setOpenExportDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importType, setImportType] = useState('components');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Handlers
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
            // File input ref reset is handled inside Modal if needed, or by causing re-render
            setOpenImportDialog(false); // Close dialog on success
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
            // setOpenExportDialog(false); // Optional: close dialog after export
        } catch (err) {
            setError(err.response?.data?.message || 'Error exporting data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>

                <ImportExportHeader />

                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '8px' }}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Alert
                        severity={result.success ? 'success' : 'error'}
                        onClose={() => setResult(null)}
                        sx={{ borderRadius: '8px' }}
                    >
                        {result.message}
                        {result.records_imported > 0 && (
                            <div style={{ marginTop: '4px', fontSize: '0.875rem' }}>
                                Records imported: {result.records_imported}
                                {result.records_failed > 0 && ` | Failed: ${result.records_failed}`}
                            </div>
                        )}
                    </Alert>
                )}

                <div className={styles.cardsRow}>
                    <ActionCard
                        title="Import Data"
                        description="Upload Excel files to import your component inventory or production data seamlessly."
                        icon={<UploadIcon />}
                        buttonText="Import from Excel"
                        buttonVariant="primary"
                        onClick={() => setOpenImportDialog(true)}
                    />

                    <ActionCard
                        title="Export Data"
                        description="Download detailed inventory, consumption, and production reports in Excel format."
                        icon={<DownloadIcon />}
                        buttonText="Export to Excel"
                        buttonVariant="success"
                        onClick={() => setOpenExportDialog(true)}
                    />
                </div>

                <GuidelinesSection />

            </div>

            <ImportModal
                open={openImportDialog}
                onClose={() => setOpenImportDialog(false)}
                importType={importType}
                setImportType={setImportType}
                selectedFile={selectedFile}
                handleFileSelect={handleFileSelect}
                handleImport={handleImport}
                loading={loading}
            />

            <ExportModal
                open={openExportDialog}
                onClose={() => setOpenExportDialog(false)}
                handleExport={handleExport}
                loading={loading}
            />
        </div>
    );
};

export default ExcelImportExport;