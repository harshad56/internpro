import React, { useState } from 'react';
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
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { approvalService } from '../../services/api';

const ApprovalQueue: React.FC = () => {
    const [approvals, setApprovals] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const fetchApprovals = async () => {
        setLoading(true);
        try {
            const response = await approvalService.getPending();
            setApprovals(response.data);
        } catch (error) {
            console.error("Failed to fetch approvals", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchApprovals();
    }, []);

    const handleAction = async (ref: string, type: string, action: 'Approve' | 'Reject') => {
        try {
            await approvalService.processAction({
                referenceNumber: ref,
                transactionType: type,
                action: action,
                remarks: `${action}d by Checker`
            });
            // Refresh list
            fetchApprovals();
            if (openDialog) setOpenDialog(false); // Close dialog if action taken from there
        } catch (error) {
            alert(`Failed to ${action} transaction`);
        }
    };

    const handleViewDetails = (item: any) => {
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Pending Approvals
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'secondary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reference</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Applicant</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Submitted</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {approvals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No pending approvals found.</TableCell>
                                </TableRow>
                            ) : (
                                approvals.map((row) => (
                                    <TableRow key={row.referenceNumber}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{row.referenceNumber}</TableCell>
                                        <TableCell>{row.transactionType} - {row.subType}</TableCell>
                                        <TableCell>₹{row.amount.toLocaleString()} {row.currency}</TableCell>
                                        <TableCell>{row.customerName}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                color="warning"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(row.submittedDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                title="View Details"
                                                onClick={() => handleViewDetails(row)} // WIRED UP HERE
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="success" title="Approve" onClick={() => handleAction(row.referenceNumber, row.transactionType, 'Approve')}><CheckCircleIcon /></IconButton>
                                            <IconButton color="error" title="Reject" onClick={() => handleAction(row.referenceNumber, row.transactionType, 'Reject')}><CancelIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* DETAILS DIALOG */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    {selectedItem ? `Transaction Details: ${selectedItem.referenceNumber}` : 'Details'}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon sx={{ color: 'white' }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedItem && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom color="primary">Core Information</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Transaction Type</Typography>
                                <Typography variant="body1" fontWeight="bold">{selectedItem.transactionType} ({selectedItem.subType})</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Applicant</Typography>
                                <Typography variant="body1" fontWeight="bold">{selectedItem.customerName}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Amount</Typography>
                                <Typography variant="h6" color="success.main">₹{selectedItem.amount.toLocaleString()} {selectedItem.currency}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Submitted Date</Typography>
                                <Typography variant="body1">{new Date(selectedItem.submittedDate).toLocaleString()}</Typography>
                            </Grid>

                            <Grid item xs={12} sx={{ my: 1 }}><Divider /></Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom color="primary">Counterparty Details</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Beneficiary Name</Typography>
                                <Typography variant="body1">{selectedItem.beneficiaryName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">Beneficiary Bank</Typography>
                                <Typography variant="body1">{selectedItem.beneficiaryBank || 'N/A'}</Typography>
                            </Grid>

                            <Grid item xs={12} sx={{ my: 1 }}><Divider /></Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Remarks / Purpose</Typography>
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5', mt: 1 }}>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        {selectedItem.remarks || 'No specific remarks provided.'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit">Close</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleAction(selectedItem.referenceNumber, selectedItem.transactionType, 'Reject')}
                        startIcon={<CancelIcon />}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAction(selectedItem.referenceNumber, selectedItem.transactionType, 'Approve')}
                        startIcon={<CheckCircleIcon />}
                        autoFocus
                    >
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ApprovalQueue;
