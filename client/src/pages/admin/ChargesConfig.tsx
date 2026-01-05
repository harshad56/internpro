import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';

const ChargesConfig: React.FC = () => {
    const [charges, setCharges] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        Product: '',
        ChargeType: '',
        Rate: '',
        Basis: 'Flat',
        Currency: 'INR'
    });

    useEffect(() => {
        fetchCharges();
    }, []);

    const fetchCharges = async () => {
        try {
            const response = await api.get('/Admin/charges');
            setCharges(response.data);
        } catch (error) {
            console.error("Error fetching charges", error);
        }
    };

    const handleAddClick = () => {
        setFormData({ Product: '', ChargeType: '', Rate: '', Basis: 'Flat', Currency: 'INR' });
        setIsEdit(false);
        setOpenDialog(true);
    };

    const handleEditClick = (charge: any) => {
        setFormData({
            Product: charge.Product,
            ChargeType: charge.ChargeType,
            Rate: charge.Rate,
            Basis: charge.Basis,
            Currency: charge.Currency
        });
        setCurrentId(charge.ChargeID);
        setIsEdit(true);
        setOpenDialog(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this charge?")) {
            try {
                await api.delete(`/Admin/charges/${id}`);
                fetchCharges();
            } catch (error) {
                console.error("Error deleting charge", error);
            }
        }
    };

    const handleSave = async () => {
        if (!formData.Product || !formData.ChargeType || !formData.Rate || !formData.Currency) {
            alert("Please enter all details properly (Product, Charge Type, Rate, Currency) before submitting.");
            return;
        }
        try {
            if (isEdit && currentId) {
                await api.put(`/Admin/charges/${currentId}`, formData);
            } else {
                await api.post('/Admin/charges', formData);
            }
            setOpenDialog(false);
            fetchCharges();
        } catch (error) {
            console.error("Error saving charge", error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Charges & Commission Setup
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
                    Add New Charge
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Charge Type</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rate / Amount</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Basis</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Currency</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {charges.map((row) => (
                            <TableRow key={row.ChargeID} hover>
                                <TableCell>{row.Product}</TableCell>
                                <TableCell>{row.ChargeType}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>{row.Rate}</TableCell>
                                <TableCell>
                                    <Chip label={row.Basis} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{row.Currency}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleEditClick(row)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(row.ChargeID)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Charge' : 'Add New Charge'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            select
                            label="Product"
                            fullWidth
                            SelectProps={{ native: true }}
                            value={formData.Product}
                            onChange={(e) => setFormData({ ...formData, Product: e.target.value })}
                        >
                            <option value="">Select Product...</option>
                            <option value="Letter of Credit">Letter of Credit</option>
                            <option value="Bank Guarantee">Bank Guarantee</option>
                            <option value="Trade Loan">Trade Loan</option>
                            <option value="Collection">Collection</option>
                            <option value="All Products">All Products</option>
                        </TextField>
                        <TextField
                            label="Charge Type"
                            fullWidth
                            value={formData.ChargeType}
                            onChange={(e) => setFormData({ ...formData, ChargeType: e.target.value })}
                        />
                        <TextField
                            label="Rate / Amount"
                            fullWidth
                            placeholder="e.g. 0.125% or 25.00"
                            value={formData.Rate}
                            onChange={(e) => setFormData({ ...formData, Rate: e.target.value })}
                        />
                        <TextField
                            select
                            label="Basis"
                            fullWidth
                            SelectProps={{ native: true }}
                            value={formData.Basis}
                            onChange={(e) => setFormData({ ...formData, Basis: e.target.value })}
                        >
                            <option value="Flat">Flat</option>
                            <option value="Per Quarter">Per Quarter</option>
                            <option value="Per Annum">Per Annum</option>
                            <option value="Per Transaction">Per Transaction</option>
                        </TextField>
                        <TextField
                            label="Currency"
                            fullWidth
                            value={formData.Currency}
                            onChange={(e) => setFormData({ ...formData, Currency: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChargesConfig;
