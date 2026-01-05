import React from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

const DocumentUpload: React.FC = () => {
    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                Document Management Center
            </Typography>

            <Paper
                sx={{
                    p: 6,
                    mb: 4,
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#f0f0f0'
                    }
                }}
            >
                <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                    Drag and drop files here to upload
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    (PDF, Word, or Excel files up to 10MB)
                </Typography>
                <Button variant="contained">Browse Files</Button>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2 }}>Recent Uploads</Typography>
            <Paper>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <InsertDriveFileIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Commercial_Invoice_INV992.pdf"
                            secondary="Uploaded on 03-Jan-2026 by TradeOps"
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <InsertDriveFileIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="BL_Draft_Copy.docx"
                            secondary="Uploaded on 02-Jan-2026 by Customer"
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default DocumentUpload;
