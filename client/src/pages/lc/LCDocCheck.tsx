import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl, Select, MenuItem, TextField, Button, Chip } from '@mui/material';

interface DocItem {
    id: number;
    name: string;
    status: string;
    remarks: string;
}

const initialDocs: DocItem[] = [
    { id: 1, name: 'Commercial Invoice', status: 'Pending', remarks: '' },
    { id: 2, name: 'Packing List', status: 'Pending', remarks: '' },
    { id: 3, name: 'Bill of Lading', status: 'Pending', remarks: '' },
    { id: 4, name: 'Certificate of Origin', status: 'Pending', remarks: '' },
];

const LCDocCheck: React.FC = () => {
    const [docs, setDocs] = useState<DocItem[]>(initialDocs);

    const handleStatusChange = (id: number, newStatus: string) => {
        setDocs(docs.map(doc => doc.id === id ? { ...doc, status: newStatus } : doc));
    };

    const handleRemarksChange = (id: number, newRemarks: string) => {
        setDocs(docs.map(doc => doc.id === id ? { ...doc, remarks: newRemarks } : doc));
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Document Checking: LC2026001
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Document Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Verification Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Discrepancies / Remarks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {docs.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell>{doc.name}</TableCell>
                                <TableCell>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={doc.status}
                                            onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                                            sx={{
                                                color: doc.status === 'Clean' ? 'green' : doc.status === 'Discrepant' ? 'red' : 'inherit',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Clean">Clean</MenuItem>
                                            <MenuItem value="Discrepant">Discrepant / Issue</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Note discrepancies..."
                                        value={doc.remarks}
                                        onChange={(e) => handleRemarksChange(doc.id, e.target.value)}
                                        disabled={doc.status === 'Clean'}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="contained" color="error">Reject Set</Button>
                <Button variant="contained" color="primary">Approve & Pay</Button>
            </Box>
        </Box>
    );
};

export default LCDocCheck;
