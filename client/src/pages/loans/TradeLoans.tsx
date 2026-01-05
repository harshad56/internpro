import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Grid, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { loanService } from '../../services/api';

const TradeLoans: React.FC = () => {
    const [interest, setInterest] = useState(0);
    const [amount, setAmount] = useState('');
    const [tenor, setTenor] = useState('90');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const calculateInterest = () => {
        // Simple interest: P * R * T / 360 (assuming 5.5% rate used in backend)
        const amt = Number(amount);
        const day = Number(tenor);
        const calculated = (amt * 0.055 * day) / 360;
        setInterest(calculated);
    };

    const handleSubmit = async () => {
        const amt = Number(amount);
        const day = Number(tenor);
        if (!amt || amt <= 0 || !day || day <= 0) {
            alert("Please enter a valid Loan Amount and Tenor before submitting.");
            return;
        }
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const response = await loanService.apply({
                loanType: 'Packing',
                linkedReferenceNumber: 'EXP-12345',
                amount: amt,
                currency: 'INR',
                tenorDays: day,
                purpose: 'Working Capital for Export Order'
            });
            setSuccessMsg(`Loan Approved! Ref: ${response.data.loanReferenceNumber}`);
        } catch (error) {
            console.error(error);
            setErrorMsg('Loan Application Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Trade Finance Loans
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Loan Application</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField select label="Loan Product" fullWidth defaultValue="">
                                    <MenuItem value="Packing">Packing Credit (Pre-shipment)</MenuItem>
                                    <MenuItem value="PostShipment">Post-shipment Finance</MenuItem>
                                    <MenuItem value="BillDiscounting">Bill Discounting</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField label="Linked LC/Contract Ref" fullWidth defaultValue="EXP-12345" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField label="Currency" fullWidth defaultValue="INR" />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Loan Amount"
                                    fullWidth
                                    value={amount}
                                    onChange={(e) => {
                                        if (/^\d*\.?\d*$/.test(e.target.value)) {
                                            setAmount(e.target.value);
                                        }
                                    }}
                                    onBlur={calculateInterest}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Tenor (Days)"
                                    fullWidth
                                    value={tenor}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value)) {
                                            setTenor(e.target.value);
                                        }
                                    }}
                                    onBlur={calculateInterest}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Purpose of Finance" fullWidth multiline rows={3} defaultValue="Working Capital for Export Order" />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ borderLeft: '6px solid', borderLeftColor: 'primary.main', bgcolor: 'background.paper' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary.main">Repayment Preview</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography color="text.secondary">Principal:</Typography>
                                <Typography fontWeight={600}>₹{Number(amount).toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography color="text.secondary">Est. Interest (5.5%):</Typography>
                                <Typography fontWeight={600} color="success.main">+ ₹{interest.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px dashed #E2E8F0' }}>
                                <Typography fontWeight="bold">Total Repayment:</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary.main">₹{(Number(amount) + interest).toFixed(2)}</Typography>
                            </Box>
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
                        {loading ? <CircularProgress size={24} /> : 'Apply for Loan'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TradeLoans;
