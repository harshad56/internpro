import React from 'react';
import { Box, Paper, Typography, TextField, Grid, Button, Divider } from '@mui/material';

const LCAmendment: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                LC Amendment
            </Typography>

            <Paper sx={{ p: 4, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <TextField label="Search LC Reference Number" fullWidth placeholder="e.g. LC2026001" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" size="large">Search</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Amendment Details</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Current Amount</Typography>
                        <Typography variant="h6">₹50,000.00</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">Current Expiry Details</Typography>
                        <Typography variant="h6">10-Apr-2026</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField label="New Amount" fullWidth type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField label="New Expiry Date" fullWidth type="date" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Amendment Narrative / Reason" fullWidth multiline rows={4} />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined">Cancel</Button>
                    <Button variant="contained">Submit Amendment</Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LCAmendment;
