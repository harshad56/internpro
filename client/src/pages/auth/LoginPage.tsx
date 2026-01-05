import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, InputAdornment, Dialog, DialogTitle, DialogContent, Container, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [loginStage, setLoginStage] = useState<'credentials' | 'otp'>('credentials');
    const [otp, setOtp] = useState(['', '', '', '', '']); // 5-digit OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');



    // ... (existing state)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const usernameInput = (document.getElementById('email') as HTMLInputElement).value;
            const response = await api.post('/Auth/login', {
                username: usernameInput,
                password: (document.getElementById('password') as HTMLInputElement).value
            });

            if (response.data.requiresOtp) {
                setLoginStage('otp');
                // Store username temporarily for next step
                localStorage.setItem('temp_user', usernameInput);
                if (response.data.maskedEmail) {
                    setMaskedEmail(response.data.maskedEmail);
                }
            } else if (response.data.token) {
                // Fallback for legacy flow if ever enabled
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.Message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async () => {
        setLoading(true);
        setError('');
        try {
            const otpValue = otp.join('');
            const username = localStorage.getItem('temp_user');

            const response = await api.post('/Auth/verify-otp', {
                username: username,
                otp: otpValue
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.removeItem('temp_user'); // Cleanup
                navigate('/');
                window.location.reload();
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.Message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const newOtp = [...otp];
        if (value.length <= 1) {
            newOtp[index] = value;
            setOtp(newOtp);
            // Auto-focus next input
            if (value && index < 4) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh', width: '100vw', margin: 0, overflow: 'hidden', bgcolor: '#F1F5F9' }}>
            {/* Left Brand Panel */}
            <Grid
                item
                xs={false}
                sm={4}
                md={6}
                sx={{
                    backgroundImage: 'linear-gradient(135deg, #0047AB 0%, #003380 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    p: 4
                }}
            >
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <AccountBalanceWalletIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h2" fontWeight="700" sx={{ letterSpacing: -1 }}>
                        FINANCE
                    </Typography>
                    <Typography variant="h6" sx={{ letterSpacing: 4, opacity: 0.7 }}>
                        SYSTEMS
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ maxWidth: 400, textAlign: 'center', opacity: 0.8, display: { xs: 'none', md: 'block' } }}>
                    Secure, compliant, and efficient trade finance operations for the modern banking era.
                </Typography>
            </Grid>

            {/* Right Login Panel */}
            <Grid
                item
                xs={12}
                sm={8}
                md={6}
                component={Paper}
                elevation={0}
                square
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}
            >
                <Box sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: 400,
                    width: '100%'
                }}>

                    <Box sx={{ p: 1, bgcolor: '#E3F2FD', borderRadius: '50%', mb: 2 }}>
                        <LockOutlinedIcon sx={{ color: '#0047AB', fontSize: 32 }} />
                    </Box>

                    <Typography component="h1" variant="h5" fontWeight="600" color="text.primary" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Sign in to access your dashboard
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Corporate ID / Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleOutlinedIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyOutlinedIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 4, mb: 2, height: 50, fontSize: '1rem' }}
                        >
                            {loading ? 'Verifying...' : 'Sign In'}
                        </Button>

                    </Box>
                </Box>
            </Grid>

            {/* OTP Modal */}
            <Dialog open={loginStage === 'otp'} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 2 } }}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Security Verification
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Enter the 5-digit code sent to {maskedEmail || "your registered email"}.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                id={`otp-${index}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                inputProps={{
                                    maxLength: 1,
                                    style: { textAlign: 'center', fontSize: '1.5rem', padding: '10px' }
                                }}
                                sx={{ width: 50 }}
                            />
                        ))}
                    </Box>

                    {error && <Typography color="error" variant="caption" display="block" sx={{ mb: 2 }}>{error}</Typography>}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleOtpVerify}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Verify & Access'}
                    </Button>
                    <Button
                        size="small"
                        sx={{ mt: 2, textTransform: 'none' }}
                        onClick={() => setLoginStage('credentials')}
                    >
                        Back to Login
                    </Button>
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

export default LoginPage;
