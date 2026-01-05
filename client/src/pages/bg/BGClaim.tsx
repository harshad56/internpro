import React from 'react';
import { Box, Paper, Typography, TextField, Grid, Button, Alert } from '@mui/material';

const BGClaim: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Lodge Claim on Bank Guarantee
            </Typography>

            <Paper sx={{ p: 4, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField label="Enter BG Reference Number" fullWidth placeholder="e.g. BG-2026-991" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" size="large">Find BG</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Claim Details</Typography>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Please ensure the claim is lodged within the claim expiry period.
                </Alert>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField label="Claim Amount" fullWidth type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField label="Claim Date" fullWidth type="date" InputLabelProps={{ shrink: true }} defaultValue={new Date().toISOString().split('T')[0]} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Reason for Claim / Narrative"
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="contained" color="error">Reject Claim</Button>
                    <Button variant="contained" color="success">Process Claim Settlement</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default BGClaim;
