import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Grid, Button, Chip, LinearProgress, Alert, Card, CardContent } from '@mui/material';
import { complianceService } from '../../services/api';

const AMLReview: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        entityName: '',
        country: '',
        referenceId: ''
    });

    const handleScreen = async () => {
        setLoading(true);
        setResult(null);
        try {
            const response = await complianceService.screenAml(formData);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            alert('Screening failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                AML & Sanctions Screening
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>Screening Request</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Entity Name"
                                    fullWidth
                                    value={formData.entityName}
                                    onChange={(e) => {
                                        if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                            setFormData({ ...formData, entityName: e.target.value });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Country"
                                    fullWidth
                                    helperText="Type 'Iran' or 'North Korea' to test Hits"
                                    value={formData.country}
                                    onChange={(e) => {
                                        if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                            setFormData({ ...formData, country: e.target.value });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Reference ID (Optional)"
                                    fullWidth
                                    value={formData.referenceId}
                                    onChange={(e) => {
                                        if (/^[a-zA-Z0-9]*$/.test(e.target.value)) {
                                            setFormData({ ...formData, referenceId: e.target.value });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleScreen}
                                    disabled={loading}
                                >
                                    Run Screening
                                </Button>
                            </Grid>
                        </Grid>
                        {loading && <LinearProgress sx={{ mt: 3 }} />}
                    </Paper>

                    {result && (
                        <Paper sx={{ p: 4, mt: 3, bgcolor: result.isMatchFound ? '#fff5f5' : '#f0fff4' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Screening Result</Typography>

                            {result.isMatchFound ? (
                                <Alert severity="error" sx={{ mb: 2 }}>High Risk Match Detected!</Alert>
                            ) : (
                                <Alert severity="success" sx={{ mb: 2 }}>No Sanction Matches Found</Alert>
                            )}

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">Overall Status:</Typography>
                                <Chip
                                    label={result.overallStatus}
                                    color={result.isMatchFound ? 'error' : 'success'}
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">Risk Score:</Typography>
                                <Typography variant="h4">{result.riskScore}/100</Typography>
                            </Box>

                            {result.matchedSanctionsLists.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2">Matched Lists:</Typography>
                                    {result.matchedSanctionsLists.map((list: string) => (
                                        <Chip key={list} label={list} size="small" sx={{ mr: 1, mt: 1 }} />
                                    ))}
                                </Box>
                            )}
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">About AML Check</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                This module checks against OFAC, UN, and EU sanction lists.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                All hits must be reviewed by the Compliance department before transaction approval.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AMLReview;
