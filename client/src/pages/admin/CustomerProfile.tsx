import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Grid, Chip, Button, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../services/api';

const CustomerProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            const response = await api.get('/Customer');
            const found = response.data.find((c: any) => c.Id === Number(id));
            setCustomer(found);
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setEditData({
            Name: customer.Name,
            Email: customer.Email,
            Country: customer.Country,
            Risk: customer.Risk,
            SanctionStatus: customer.SanctionStatus
        });
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!editData.Name || !editData.Email || !editData.Country) {
            alert("Please enter all details properly (Name, Email, Country) before submitting.");
            return;
        }
        try {
            await api.put(`/Customer/${customer.Id}`, editData); // Matches backend PUT /{id}
            setEditOpen(false);
            fetchCustomer(); // Refresh data
        } catch (error) {
            console.error("Failed to update", error);
            alert("Failed to update customer");
        }
    };

    if (loading) return <Box p={3}><CircularProgress /></Box>;
    if (!customer) return <Box p={3}><Typography>Customer not found</Typography></Box>;

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin/customers')}
                sx={{ mb: 3, textTransform: 'none', fontWeight: 600 }}
            >
                Back to Customer Master
            </Button>

            <Paper elevation={0} sx={{ p: 0, overflow: 'hidden', border: '1px solid #e0e0e0', borderRadius: 2 }}>
                {/* Header Section */}
                <Box sx={{ bgcolor: '#f8f9fa', p: 4, borderBottom: '1px solid #e0e0e0' }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h4" fontWeight="800" sx={{ textTransform: 'capitalize', color: '#1a1a1a' }}>
                                    {customer.Name}
                                </Typography>
                                <Chip
                                    label={customer.Risk}
                                    color={customer.Risk === 'High' ? 'error' : customer.Risk === 'Medium' ? 'warning' : 'success'}
                                    sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Detailed business profile and credit facility overview
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={handleEditClick}>
                                Edit Profile
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Content Section */}
                <Box sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                        Organization Details
                    </Typography>

                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" mb={0.5}>
                                CIF ID
                            </Typography>
                            <Typography variant="body1" fontWeight="500">{customer.CIF}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" mb={0.5}>
                                Email Address
                            </Typography>
                            <Typography variant="body1" fontWeight="500">{customer.Email || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" mb={0.5}>
                                Country of Incorporation
                            </Typography>
                            <Typography variant="body1" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                                {customer.Country}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" mb={0.5}>
                                Sanction Status
                            </Typography>
                            <Chip
                                label={customer.SanctionStatus}
                                variant="outlined"
                                color={customer.SanctionStatus === 'Clean' ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" fontWeight="600" display="block" mb={0.5}>
                                Internal System ID
                            </Typography>
                            <Typography variant="body1" fontFamily="monospace">{customer.Id}</Typography>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                        Trade Finance Facilities
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    background: 'linear-gradient(to bottom right, #ffffff, #f8fbff)'
                                }}
                            >
                                <Typography variant="subtitle2" color="primary.main" fontWeight="600" gutterBottom>
                                    Letter of Credit Limit
                                </Typography>
                                <Typography variant="h4" fontWeight="700" color="#1a1a1a">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(1000000)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Revolving Facility | Exp: Dec 2026
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    background: 'linear-gradient(to bottom right, #ffffff, #f8fbff)'
                                }}
                            >
                                <Typography variant="subtitle2" color="primary.main" fontWeight="600" gutterBottom>
                                    Bank Guarantee Limit
                                </Typography>
                                <Typography variant="h4" fontWeight="700" color="#1a1a1a">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(500000)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Non-Funded | Exp: Jun 2027
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    border: '1px solid #ffedef',
                                    borderRadius: 2,
                                    bgcolor: '#fff5f6'
                                }}
                            >
                                <Typography variant="subtitle2" color="error.main" fontWeight="600" gutterBottom>
                                    Currently Utilized
                                </Typography>
                                <Typography variant="h4" fontWeight="700" color="error.main">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(150000)}
                                </Typography>
                                <Typography variant="caption" color="error.dark">
                                    10% of Total Exposure
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Customer Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Business Name"
                            fullWidth
                            value={editData.Name || ''}
                            onChange={(e) => {
                                if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                    setEditData({ ...editData, Name: e.target.value });
                                }
                            }}
                        />
                        <TextField
                            label="Email Address"
                            fullWidth
                            value={editData.Email || ''}
                            onChange={(e) => setEditData({ ...editData, Email: e.target.value })}
                        />
                        <TextField
                            label="Country of Incorporation"
                            fullWidth
                            value={editData.Country || ''}
                            onChange={(e) => {
                                if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                    setEditData({ ...editData, Country: e.target.value });
                                }
                            }}
                        />
                        <TextField
                            select
                            label="Risk Rating"
                            fullWidth
                            SelectProps={{ native: true }}
                            value={editData.Risk || 'Low'}
                            onChange={(e) => setEditData({ ...editData, Risk: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </TextField>
                        <TextField
                            select
                            label="Sanction Status"
                            fullWidth
                            SelectProps={{ native: true }}
                            value={editData.SanctionStatus || 'Clean'}
                            onChange={(e) => setEditData({ ...editData, SanctionStatus: e.target.value })}
                        >
                            <option value="Clean">Clean</option>
                            <option value="Watchlist">Watchlist</option>
                            <option value="Blocked">Blocked</option>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Update Profile</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerProfile;
