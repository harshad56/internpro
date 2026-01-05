import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { documentService } from '../../services/api';

interface DocumentUploadProps {
    referenceNumber?: string;
    onUploadSuccess?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ referenceNumber = "REF-PENDING", onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchDocuments = async () => {
        if (!referenceNumber || referenceNumber === "REF-PENDING") return;
        try {
            const res = await documentService.list(referenceNumber);
            setDocuments(res.data);
        } catch (err) {
            console.error("Failed to fetch documents", err);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [referenceNumber]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Please select a file first.' });
            return;
        }

        const formData = new FormData();
        formData.append('File', file);
        formData.append('ReferenceNumber', referenceNumber);
        formData.append('DocumentType', 'General Document'); // Can be made dynamic
        formData.append('UploadedBy', 'Current User');

        setUploading(true);
        try {
            await documentService.upload(formData);
            setMessage({ type: 'success', text: 'File uploaded successfully!' });
            setFile(null);
            fetchDocuments(); // Refresh list
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Document Management
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ textTransform: 'none' }}
                >
                    Select File
                    <input type="file" hidden onChange={handleFileChange} accept=".pdf,.jpg,.png,.docx" />
                </Button>
                {file && <Typography variant="body2">{file.name}</Typography>}

                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    sx={{ textTransform: 'none' }}
                >
                    {uploading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Uploaded Documents ({documents.length})
            </Typography>

            <List dense>
                {documents.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No documents uploaded yet.
                    </Typography>
                ) : (
                    documents.map((doc) => (
                        <ListItem key={doc.documentID}>
                            <ListItemIcon>
                                <InsertDriveFileIcon color="action" />
                            </ListItemIcon>
                            <ListItemText
                                primary={doc.fileName}
                                secondary={`Uploaded by ${doc.uploadedBy} on ${new Date(doc.uploadDate).toLocaleDateString()}`}
                            />
                        </ListItem>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default DocumentUpload;
