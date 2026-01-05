import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import DocumentUpload from '../../components/common/DocumentUpload';

const DocumentCenter: React.FC = () => {
    const [reference, setReference] = useState('');
    const [activeRef, setActiveRef] = useState('REF-TEMP-001');

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
                Document Center
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Manage documents for any transaction. Enter the Reference Number below (e.g., LC Number) to view or upload files.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <TextField
                            label="Reference Number"
                            variant="outlined"
                            size="small"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="e.g. LC-2024-001"
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            onClick={() => setActiveRef(reference)}
                            disabled={!reference}
                        >
                            Search
                        </Button>
                    </Box>

                    {activeRef && (
                        <DocumentUpload referenceNumber={activeRef} />
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* Placeholder for preview or instructions */}
                    <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, border: '1px dashed grey', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">Document Preview Area (Coming Soon)</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DocumentCenter;
