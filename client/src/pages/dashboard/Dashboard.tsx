import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button
} from '@mui/material';
import { reportService, approvalService } from '../../services/api'; // Import approvalService
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardRounded';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(value);
};

// Formatting date helper
const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active':
        case 'approved': return 'success';
        case 'pending': return 'warning';
        case 'rejected': return 'error';
        case 'processing': return 'info';
        default: return 'default';
    }
};

const Dashboard: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                reportService.getStats(),
                approvalService.getPending() // Fetching REAL pending approvals
            ]);

            setStats(statsRes.data);

            // Map real data to table format
            // If API returns empty, we might show a message or empty state, but for now filtering to top 5
            const mappedActivity = pendingRes.data.slice(0, 5).map((item: any) => ({
                id: item.referenceNumber || `REF-${Math.random().toString(36).substr(2, 9)}`,
                type: item.transactionType || 'Transaction',
                counterparty: item.customerName || 'System User',
                amount: item.amount || 0,
                status: 'Pending',
                date: item.submittedDate || new Date().toISOString()
            }));

            setRecentActivity(mappedActivity);

        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            pt: 4,
            pb: 4
        }}>

            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.02em' }}>
                    Financial Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time metrics and key performance indicators
                </Typography>
            </Box>

            {/* KPI Cards section */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        border: 'none',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        height: 220,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        boxShadow: '0 10px 20px rgba(25, 118, 210, 0.15)',
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="600" sx={{ color: 'rgba(255,255,255,0.9)' }}>TOTAL LCs</Typography>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                                    <AssignmentIcon />
                                </Box>
                            </Box>
                            <Typography variant="h2" fontWeight="800" sx={{ color: '#fff' }}>
                                {stats?.totalLCs || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        border: 'none',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        height: 220,
                        background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                        boxShadow: '0 10px 20px rgba(156, 39, 176, 0.15)',
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="600" sx={{ color: 'rgba(255,255,255,0.9)' }}>TOTAL BGs</Typography>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                                    <AssignmentIcon />
                                </Box>
                            </Box>
                            <Typography variant="h2" fontWeight="800" sx={{ color: '#fff' }}>
                                {stats?.totalBGs || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        border: 'none',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        height: 220,
                        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                        boxShadow: '0 10px 20px rgba(46, 125, 50, 0.15)',
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="600" sx={{ color: 'rgba(255,255,255,0.9)' }}>EXPOSURE</Typography>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                                    <AccountBalanceWalletIcon />
                                </Box>
                            </Box>
                            <Typography variant="h3" fontWeight="800" sx={{ color: '#fff' }}>
                                {formatCurrency(stats?.totalExposure || 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={0} sx={{
                        border: 'none',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        height: 220,
                        background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
                        boxShadow: '0 10px 20px rgba(237, 108, 2, 0.15)',
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" fontWeight="600" sx={{ color: 'rgba(255,255,255,0.9)' }}>PENDING</Typography>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                                    <WarningIcon />
                                </Box>
                            </Box>
                            <Typography variant="h2" fontWeight="800" sx={{ color: '#fff' }}>
                                {stats?.pendingApprovals || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* RECENT ACTIVITY SECTION - NOW USING REAL DATA */}
            <Paper elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">Recent Activity (Live)</Typography>
                    <Button
                        endIcon={<ArrowForwardIcon />}
                        sx={{ textTransform: 'none' }}
                        onClick={() => navigate('/approvals')}
                    >
                        View All
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Reference ID</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Counterparty</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentActivity.length > 0 ? (
                                recentActivity.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{row.id}</TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>{row.counterparty}</TableCell>
                                        <TableCell fontWeight="bold">{formatCurrency(row.amount)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                color={getStatusColor(row.status) as any}
                                                sx={{ fontWeight: 600, borderRadius: 1 }}
                                            />
                                        </TableCell>
                                        <TableCell color="text.secondary">{formatDate(row.date)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No recent activity found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

        </Box>
    );
};

export default Dashboard;
