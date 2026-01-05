import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import { auditService } from '../../services/api';

interface AuditLog {
    logID: number;
    action: string;
    entityName: string;
    entityID: string;
    performedBy: string;
    timestamp: string;
    details: string;
}

const AuditLogViewer: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await auditService.getLogs();
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'login': return 'success';
            case 'create': return 'primary';
            case 'approve': return 'warning';
            case 'reject': return 'error';
            default: return 'default';
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>System Audit Logs</Typography>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell>Time</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Performed By</TableCell>
                                <TableCell>Entity</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.logID} hover>
                                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.action}
                                            size="small"
                                            color={getActionColor(log.action) as any}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{log.performedBy}</TableCell>
                                    <TableCell>{log.entityName} #{log.entityID}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {log.details}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No audit logs found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default AuditLogViewer;
