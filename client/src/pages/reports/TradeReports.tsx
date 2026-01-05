import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Button, CircularProgress, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { reportService } from '../../services/api';
import DownloadIcon from '@mui/icons-material/Download';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TradeReports: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [volumeData, setVolumeData] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [volumeRes, statsRes] = await Promise.all([
                reportService.getVolume(),
                reportService.getStats()
            ]);

            // Transform backend data to Chart format if needed
            // Backend returns [{ label: 'Import', value1: 4000 }, ...]
            // Recharts expects [{ name: 'Import', value: 4000 }]

            const transformedVolume = volumeRes.data.map((item: any) => ({
                name: item.label || 'Unknown',
                value: item.value1
            }));

            setVolumeData(transformedVolume);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Error fetching reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        // Simple CSV Export
        const headers = ["Label,Value"];
        const rows = volumeData.map(row => `${row.name},${row.value}`);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "TradeVolumeReport.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    MIS & Regulatory Reports
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                        sx={{ mr: 1 }}
                    >
                        Export Excel
                    </Button>
                    <Button variant="contained" onClick={() => window.print()}>Print PDF</Button>
                </Box>
            </Box>

            {/* KPI Cards */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Total LCs</Typography>
                                <Typography variant="h4">{stats.totalLCs}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Total BGs</Typography>
                                <Typography variant="h4">{stats.totalBGs}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Total Exposure</Typography>
                                <Typography variant="h4">₹{stats.totalExposure.toLocaleString()}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Pending Approvals</Typography>
                                <Typography variant="h4" color="warning.main">{stats.pendingApprovals}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Product Exposure Analysis</Typography>
                        {volumeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={volumeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" name="Amount (INR)" fill="#1E88E5" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography color="text.secondary">No Data Available</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Portfolio Distribution</Typography>
                        {volumeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie
                                        data={volumeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {volumeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography color="text.secondary">No Data Available</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TradeReports;
