import React, { forwardRef } from 'react';
import {
    Box,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const ProductionBill = forwardRef(({ production, consumption }, ref) => {
    if (!production) return null;

    const totalQuantity = consumption.reduce((sum, item) => sum + (Number(item.quantity_consumed) || 0), 0);

    return (
        <Box ref={ref} sx={{ p: 4, bgcolor: 'white', color: 'black' }} className="print-bill-content">
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    PRODUCTION BILL / BOM
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Electrolyte Inventory Management System
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Production Details */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '2px solid #eee', pb: 0.5 }}>
                    Production Details
                </Typography>
                <Table size="small" sx={{ '& td': { border: 'none' } }}>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>PCB Name:</TableCell>
                            <TableCell>{production.pcb_name}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>PCB Code:</TableCell>
                            <TableCell>{production.pcb_code}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Batch Number:</TableCell>
                            <TableCell>{production.batch_number || 'N/A'}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>DC Number:</TableCell>
                            <TableCell>{production.dc_number || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Production Date:</TableCell>
                            <TableCell>{new Date(production.production_date).toLocaleDateString()}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity Produced:</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>{production.quantity_produced} units</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Location:</TableCell>
                            <TableCell>{production.location || 'N/A'}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status:</TableCell>
                            <TableCell sx={{ textTransform: 'capitalize' }}>{production.status}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            {/* Component Consumption Table */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', borderBottom: '2px solid #eee', pb: 0.5 }}>
                    Bill of Materials (Consumed)
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Part Number</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Component Name</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty per PCB</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Consumed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {consumption.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.part_number}</TableCell>
                                    <TableCell>{item.component_name}</TableCell>
                                    <TableCell align="right">
                                        {(item.quantity_consumed / production.quantity_produced).toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">{item.quantity_consumed}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                                <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Total Components Consumed</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{totalQuantity}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Footer / Notes */}
            {production.notes && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Notes:</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        {production.notes}
                    </Typography>
                </Box>
            )}

            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ textAlign: 'center', width: '200px' }}>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="caption">Authorized Signature</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', width: '200px' }}>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="caption">Production Supervisor</Typography>
                </Box>
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mt: 4, textAlign: 'center', color: 'text.secondary' }}>
                Printed on {new Date().toLocaleString()}
            </Typography>
        </Box>
    );
});

ProductionBill.displayName = 'ProductionBill';

export default ProductionBill;
