import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const GLEntries: React.FC = () => {
    // Mock Data mimicking API response
    const [entries] = useState([
        { id: 1001, date: '2024-03-20', type: 'Loan Disbursement', ref: 'LN-2024-001', debit: '10100 (Cash)', credit: '20100 (Loan Asset)', amount: 500000.00, ccy: 'INR' },
        { id: 1002, date: '2024-03-21', type: 'LC Issuance', ref: 'LC-2024-889', debit: '20200 (Liability)', credit: '40100 (Fee Income)', amount: 250.00, ccy: 'INR' },
        { id: 1003, date: '2024-03-21', type: 'BG Issuance', ref: 'BG-2024-005', debit: '20200 (Liability)', credit: '40100 (Fee Income)', amount: 1500.00, ccy: 'INR' },
        { id: 1004, date: '2024-03-22', type: 'Export Collection', ref: 'EXP-2024-112', debit: '10100 (Cash)', credit: '10500 (Customer)', amount: 45000.00, ccy: 'INR' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredEntries = entries.filter(entry =>
        entry.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceIcon color="primary" /> General Ledger
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Real-time accounting entries from trade transactions
                    </Typography>
                </Box>
                <TextField
                    size="small"
                    placeholder="Search Reference or Type..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Entry ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Transaction Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'error.main' }}>Debit Account</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>Credit Account</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>CCY</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEntries.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>GL-{row.id}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>
                                    <Chip label={row.type} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace' }}>{row.ref}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{row.debit}</TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>{row.credit}</TableCell>
                                <TableCell sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>{row.ccy}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default GLEntries;
