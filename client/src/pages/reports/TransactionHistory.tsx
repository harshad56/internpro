import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    Tabs,
    Tab,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { lcService, bgService, loanService } from '../../services/api';

interface Transaction {
    id: string; // Reference Number
    type: 'LC' | 'BG' | 'Loan';
    subType: string;
    customerName: string; // Or Applicant
    beneficiary: string;
    amount: number;
    currency: string;
    status: string;
    date: string;
}

const TransactionHistory: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchAllTransactions();
    }, []);

    const fetchAllTransactions = async () => {
        setLoading(true);
        try {
            const [lcRes, bgRes, loanRes] = await Promise.all([
                lcService.getAll().catch(() => ({ data: [] })),
                bgService.getAll().catch(() => ({ data: [] })),
                loanService.getAll().catch(() => ({ data: [] }))
            ]);

            // Normalizing data structure
            const lcData = (lcRes.data || []).map((item: any) => ({
                id: item.LCNumber || item.referenceNumber || 'N/A',
                type: 'LC',
                subType: item.LCType || 'Letter of Credit',
                customerName: item.ApplicantName || 'N/A', // Adjust based on actual API response
                beneficiary: item.BeneficiaryName || 'N/A',
                amount: item.Amount || 0,
                currency: item.Currency || 'USD',
                status: item.Status || 'Pending',
                date: item.IssueDate || item.date || new Date().toISOString()
            }));

            const bgData = (bgRes.data || []).map((item: any) => ({
                id: item.BGNumber || item.referenceNumber || 'N/A',
                type: 'BG',
                subType: item.BGType || 'Bank Guarantee',
                customerName: item.ApplicantName || 'N/A',
                beneficiary: item.BeneficiaryName || 'N/A',
                amount: item.Amount || 0,
                currency: item.Currency || 'USD',
                status: item.Status || 'Pending',
                date: item.IssueDate || item.date || new Date().toISOString()
            }));

            const loanData = (loanRes.data || []).map((item: any) => ({
                id: item.LoanID || item.referenceNumber || 'N/A',
                type: 'Loan',
                subType: 'Trade Loan',
                customerName: item.ApplicantName || 'N/A',
                beneficiary: item.ApplicantName || 'N/A',
                amount: item.Amount || 0,
                currency: item.Currency || 'USD',
                status: item.Status || 'Pending',
                date: item.ApplicationDate || item.date || new Date().toISOString()
            }));

            setTransactions([...lcData, ...bgData, ...loanData]);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Filter logic
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch =
            String(t.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(t.customerName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(t.beneficiary).toLowerCase().includes(searchTerm.toLowerCase());

        let matchesType = true;
        if (tabValue === 1) matchesType = t.type === 'LC';
        if (tabValue === 2) matchesType = t.type === 'BG';
        if (tabValue === 3) matchesType = t.type === 'Loan';

        return matchesSearch && matchesType;
    });

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('approve') || s.includes('issued')) return 'success';
        if (s.includes('reject')) return 'error';
        if (s.includes('submitted') || s.includes('pending')) return 'warning';
        return 'default';
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Transaction History
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                    <Tab label="All Transactions" />
                    <Tab label="Letters of Credit" />
                    <Tab label="Bank Guarantees" />
                    <Tab label="Trade Loans" />
                </Tabs>

                <Box sx={{ p: 2 }}>
                    <TextField
                        placeholder="Search by ID, Customer, or Beneficiary..."
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <IconButton>
                                    <FilterListIcon />
                                </IconButton>
                            )
                        }}
                    />
                </Box>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'secondary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reference ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Beneficiary</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No transactions found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((row, index) => (
                                    <TableRow key={`${row.id}-${index}`} hover>
                                        <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{row.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">{row.type}</Typography>
                                            <Typography variant="caption" color="text.secondary">{row.subType}</Typography>
                                        </TableCell>
                                        <TableCell>{row.beneficiary}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: row.currency }).format(row.amount)}</TableCell>
                                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                color={getStatusColor(row.status) as any}
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default TransactionHistory;
