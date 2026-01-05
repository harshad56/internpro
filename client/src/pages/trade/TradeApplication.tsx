import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/DescriptionRounded';
import SecurityIcon from '@mui/icons-material/SecurityRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardRounded';

const TradeApplication: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const products = [
        {
            title: 'Letter of Credit',
            description: 'Create a new Import or Export LC. Supports Sight, Usance, and Standby LCs.',
            icon: <DescriptionIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
            path: '/lc/create',
            color: theme.palette.primary.light
        },
        {
            title: 'Bank Guarantee',
            description: 'Issue Performance Bonds, Bid Bonds, and Financial Guarantees.',
            icon: <SecurityIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
            path: '/bg/create',
            color: theme.palette.secondary.light
        },
        {
            title: 'Trade Loan',
            description: 'Apply for Pre-shipment or Post-shipment financing.',
            icon: <AccountBalanceIcon sx={{ fontSize: 48, color: theme.palette.success.main }} />,
            path: '/loans',
            color: theme.palette.success.light
        }
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    New Trade Application
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Select a trade finance product to begin your application.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} md={4} key={product.title}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <CardActionArea
                                onClick={() => navigate(product.path)}
                                sx={{ height: '100%', p: 2 }}
                            >
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: '50%',
                                            bgcolor: `${product.color}20`,
                                            mb: 2
                                        }}
                                    >
                                        {product.icon}
                                    </Box>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        {product.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                                        {product.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 600 }}>
                                        Start Application <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>


        </Box>
    );
};

export default TradeApplication;
