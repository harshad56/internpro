import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const countryData = [
    { country: 'Nigeria', risk: 'Low', limit: 10000000, utilized: 4500000 },
    { country: 'Ghana', risk: 'Medium', limit: 5000000, utilized: 3200000 },
    { country: 'Kenya', risk: 'High', limit: 2000000, utilized: 1950000 },
    { country: 'South Africa', risk: 'Low', limit: 15000000, utilized: 2000000 },
];

const CountryRisk: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Country Risk Exposure
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Country</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Risk Rating</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Limit (INR)</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Utilized (INR)</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Available</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countryData.map((row) => (
                            <TableRow key={row.country}>
                                <TableCell>{row.country}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.risk}
                                        color={row.risk === 'High' ? 'error' : row.risk === 'Medium' ? 'warning' : 'success'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{row.limit.toLocaleString()}</TableCell>
                                <TableCell>{row.utilized.toLocaleString()}</TableCell>
                                <TableCell>{(row.limit - row.utilized).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CountryRisk;
