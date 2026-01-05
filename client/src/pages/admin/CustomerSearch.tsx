import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';

const CustomerSearch: React.FC = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', country: '', risk: 'Low' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/Customer');
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers", error);
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<any>(null);

    const requestDelete = (customer: any) => {
        setCustomerToDelete(customer);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!customerToDelete) return;
        try {
            await api.delete(`/Customer/${customerToDelete.Id}`);
            fetchCustomers();
            setDeleteConfirmOpen(false);
            setCustomerToDelete(null);
        } catch (error: any) {
            console.error("Delete failed", error);
            const msg = error.response?.data?.Message || "Failed to delete customer";
            alert(msg);
        }
    };

    const handleCreate = async () => {
        if (!newCustomer.name || !newCustomer.email || !newCustomer.country) {
            alert("Please enter all details properly (Name, Email, Country) before submitting.");
            return;
        }

        if (!isValidEmail(newCustomer.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (newCustomer.name.length < 3) {
            alert("Company Name must be at least 3 characters.");
            return;
        }

        try {
            await api.post('/Customer', {
                Name: newCustomer.name,
                Email: newCustomer.email,
                Country: newCustomer.country,
                Risk: newCustomer.risk
            });
            fetchCustomers(); // Refresh list
            setOpenDialog(false);
        } catch (error) {
            alert("Failed to create customer");
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    const filteredCustomers = customers.filter(c => {
        const matchesSearch = (c.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.CIF.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCountry = countryFilter ? c.Country === countryFilter : true;
        return matchesSearch && matchesCountry;
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Customer Master
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Add Business Customer
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Search by Name or CIF"
                            value={searchTerm}
                            onChange={(e) => {
                                if (/^[a-zA-Z0-9\s]*$/.test(e.target.value)) {
                                    setSearchTerm(e.target.value);
                                }
                            }}
                            InputProps={{ endAdornment: <SearchIcon color="action" /> }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Filter by Country"
                            SelectProps={{ native: true }}
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value="">All Countries</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Kenya">Kenya</option>
                            <option value="South Africa">South Africa</option>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>CIF ID</TableCell>
                            <TableCell sx={{ color: 'white' }}>Customer Name</TableCell>
                            <TableCell sx={{ color: 'white' }}>Country</TableCell>
                            <TableCell sx={{ color: 'white' }}>Risk Rating</TableCell>
                            <TableCell sx={{ color: 'white' }}>Sanction Status</TableCell>
                            <TableCell sx={{ color: 'white' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCustomers.map((row) => (
                            <TableRow key={row.Id} hover>
                                <TableCell sx={{ fontWeight: 'bold' }}>{row.CIF}</TableCell>
                                <TableCell>{row.Name}</TableCell>
                                <TableCell>{row.Country}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.Risk}
                                        size="small"
                                        color={row.Risk === 'High' ? 'error' : row.Risk === 'Medium' ? 'warning' : 'success'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.SanctionStatus}
                                        size="small"
                                        variant="outlined"
                                        color={row.SanctionStatus === 'Clean' ? 'success' : row.SanctionStatus === 'Watchlist' ? 'warning' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => navigate(`/admin/customers/${row.Id}`)}>View Profile</Button>
                                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => requestDelete(row)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* CREATE DIALOG */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>New Business Customer</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Company Name"
                            fullWidth
                            value={newCustomer.name}
                            onChange={(e) => {
                                if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                    setNewCustomer({ ...newCustomer, name: e.target.value });
                                }
                            }}
                        />
                        <TextField label="Email Address" fullWidth onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                        <TextField
                            label="Country of Incorporation"
                            fullWidth
                            value={newCustomer.country}
                            onChange={(e) => {
                                if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                                    setNewCustomer({ ...newCustomer, country: e.target.value });
                                }
                            }}
                        />
                        <TextField
                            select
                            label="Initial Risk Rating"
                            fullWidth
                            SelectProps={{ native: true }}
                            onChange={(e) => setNewCustomer({ ...newCustomer, risk: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create Record</Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete customer <b>{customerToDelete?.Name}</b>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerSearch;
