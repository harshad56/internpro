import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Grid, Button, Checkbox, FormControlLabel, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { lcService } from '../../services/api';

const LCCreate: React.FC = () => {
    const [charges, setCharges] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        amount: '',
        currency: 'INR',
        beneficiaryName: '',
        lcType: 'Irrevocable',
        paymentTerms: 'Sight'
    });

    const calculateCharges = () => {
        // Mock logic for charge calculation
        setCharges(150 + Math.random() * 100);
    };

    const handleSubmit = async () => {
        if (!formData.amount || !formData.beneficiaryName || !formData.lcType || !formData.paymentTerms) {
            alert("Please enter all details properly (Amount, Beneficiary Name) before submitting.");
            return;
        }
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const response = await lcService.create({
                ...formData,
                amount: Number(formData.amount),
                expiryDate: new Date(), // Mock date
                latestShipmentDate: new Date(), // Mock date
                requiredDocuments: ['Commercial Invoice', 'Packing List']
            });
            setSuccessMsg(`LC Created! Ref: ${response.data.lcReferenceNumber}`);
        } catch (error) {
            console.error(error);
            setErrorMsg('Failed to create LC. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Create Letter of Credit (LC)
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>LC Key Details</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="LC Type"
                                    fullWidth
                                    value={formData.lcType}
                                    onChange={(e) => setFormData({ ...formData, lcType: e.target.value })}
                                >
                                    <MenuItem value="Irrevocable">Irrevocable</MenuItem>
                                    <MenuItem value="Revocable">Revocable</MenuItem>
                                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="Payment Terms"
                                    fullWidth
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                >
                                    <MenuItem value="Sight">Sight</MenuItem>
                                    <MenuItem value="Usance">Usance</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="BeneficiaryName"
                                    fullWidth
                                    value={formData.beneficiaryName}
                                    onChange={(e) => {
                                        if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                            setFormData({ ...formData, beneficiaryName: e.target.value });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Applicant Name" fullWidth disabled value="Global Importers Ltd" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Currency" fullWidth defaultValue="INR" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Amount"
                                    fullWidth
                                    value={formData.amount}
                                    onBlur={calculateCharges}
                                    onChange={(e) => {
                                        if (/^\d*\.?\d*$/.test(e.target.value)) {
                                            setFormData({ ...formData, amount: e.target.value });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Tolerance (%)" fullWidth />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Shipment & Documents</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField label="Port of Loading" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Port of Discharge" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField type="date" label="Latest Shipment Date" fullWidth InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField type="date" label="Expiry Date" fullWidth InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Required Documents</Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Commercial Invoice" />
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Packing List" />
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Bill of Lading" />
                                    <FormControlLabel control={<Checkbox />} label="Certificate of Origin" />
                                    <FormControlLabel control={<Checkbox />} label="Insurance Certificate" />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ mb: 3, borderLeft: '6px solid', borderLeftColor: 'primary.main' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary.main">Charges Preview</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography color="text.secondary">Issuance Fee:</Typography>
                                <Typography fontWeight={600}>₹{charges.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography color="text.secondary">Swift Charges:</Typography>
                                <Typography fontWeight={600}>₹25.00</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px dashed #E2E8F0' }}>
                                <Typography fontWeight="bold">Total Est.:</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary.main">₹{(charges + 25).toFixed(2)}</Typography>
                            </Box>
                            <Button variant="outlined" size="small" fullWidth sx={{ mt: 3 }} onClick={calculateCharges}>Recalculate</Button>
                        </CardContent>
                    </Card>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ mb: 2 }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit for Approval'}
                    </Button>
                    <Button variant="outlined" size="large" fullWidth>Save Draft</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LCCreate;
