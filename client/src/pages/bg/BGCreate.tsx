import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Grid, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { bgService } from '../../services/api';

const BGCreate: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        bgType: 'Performance',
        amount: '',
        currency: 'INR',
        beneficiaryName: '',
        guaranteeText: ''
    });

    const handleSubmit = async () => {
        if (!formData.amount || !formData.beneficiaryName || !formData.bgType || !formData.guaranteeText) {
            alert("Please enter all details properly (Amount, Beneficiary Name, Guarantee Text) before submitting.");
            return;
        }
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const response = await bgService.issue({
                ...formData,
                amount: Number(formData.amount),
                effectiveDate: new Date(),
                expiryDate: new Date(),
                claimExpiryDate: new Date()
            });
            setSuccessMsg(`BG Issued! Ref: ${response.data.bgReferenceNumber}`);
        } catch (error) {
            console.error(error);
            setErrorMsg('Failed to issue BG. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Bank Guarantee Issuance
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Guarantee Details</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="BG Type"
                                    fullWidth
                                    value={formData.bgType}
                                    onChange={(e) => setFormData({ ...formData, bgType: e.target.value })}
                                >
                                    <MenuItem value="Performance">Performance Bond</MenuItem>
                                    <MenuItem value="BidBond">Bid Bond</MenuItem>
                                    <MenuItem value="AdvancePayment">Advance Payment Guarantee</MenuItem>
                                    <MenuItem value="Financial">Financial Guarantee</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Beneficiary Name"
                                    fullWidth
                                    value={formData.beneficiaryName}
                                    onChange={(e) => {
                                        if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                            setFormData({ ...formData, beneficiaryName: e.target.value });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Currency" fullWidth defaultValue="INR" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Amount"
                                    fullWidth
                                    value={formData.amount}
                                    onChange={(e) => {
                                        if (/^\d*\.?\d*$/.test(e.target.value)) {
                                            setFormData({ ...formData, amount: e.target.value });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField type="date" label="Effective Date" fullWidth InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField type="date" label="Expiry Date" fullWidth InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField type="date" label="Claim Expiry Date" fullWidth InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Guarantee Text / Narrative"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    onChange={(e) => setFormData({ ...formData, guaranteeText: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ borderLeft: '6px solid', borderLeftColor: 'secondary.main', bgcolor: 'background.paper' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="secondary.main">Commission Est.</Typography>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">₹{(Number(formData.amount) * 0.015).toFixed(2)}</Typography>
                            <Typography variant="body2" color="text.secondary">Does not include SWIFT fees</Typography>
                        </CardContent>
                    </Card>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Issue Guarantee'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BGCreate;
