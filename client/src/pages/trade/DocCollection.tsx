import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, TextField, MenuItem, Button, Alert, CircularProgress } from '@mui/material';
import api from '../../services/api';

const DocCollection: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({
        type: 'Import',
        tenorType: 'Sight',
        amount: '',
        currency: 'INR',
        drawer: '',
        drawee: '',
        bankRef: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validation Logic
        if (name === 'amount') {
            // Only allow numbers and decimals
            if (/^\d*\.?\d*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'drawer' || name === 'drawee') {
            // Only allow alphabet characters and spaces
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            // No specific validation for others
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        if (!formData.amount || !formData.drawer || !formData.drawee || !formData.bankRef) {
            alert("Please enter all details properly (Amount, Drawer, Drawee, Bank Ref) before submitting.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                Type: formData.type === 'Import' ? 'Import Collection' : 'Export Collection',
                TenorType: formData.tenorType,
                Amount: Number(formData.amount),
                Currency: formData.currency,
                DrawerName: formData.drawer,
                DraweeName: formData.drawee,
                BankRef: formData.bankRef
            };

            const response = await api.post('/Collection/lodge', payload);
            setSuccessMsg(`Collection Lodged Successfully! Reference: ${response.data.referenceNumber}`);

            // Allow time for user to see success before redirect or clear
            // setTimeout(() => navigate('/approvals'), 2000); 
        } catch (error) {
            console.error(error);
            setSuccessMsg(''); // Clear success if error
            alert("Failed to lodge collection. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Documentary Collections
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

            <Paper sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                    Lodge New Collection
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Collection Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="Import">Import Collection</MenuItem>
                            <MenuItem value="Export">Export Collection</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            label="Tenor"
                            name="tenorType"
                            value={formData.tenorType}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="Sight">Sight (D/P)</MenuItem>
                            <MenuItem value="Usance">Usance (D/A)</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField label="Drawer (Exporter)" name="drawer" value={formData.drawer} fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField label="Drawee (Importer)" name="drawee" value={formData.drawee} fullWidth onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField label="Currency" name="currency" value={formData.currency} fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Amount" name="amount" value={formData.amount} fullWidth onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Counterparty Bank Ref" name="bankRef" value={formData.bankRef} fullWidth onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Submit Collection'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default DocCollection;
