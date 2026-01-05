import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Avatar,
    Badge
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import DescriptionIcon from '@mui/icons-material/DescriptionRounded';
import GavelIcon from '@mui/icons-material/GavelRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceRounded';
import AssessmentIcon from '@mui/icons-material/AssessmentRounded';
import SecurityIcon from '@mui/icons-material/SecurityRounded';
import MenuIcon from '@mui/icons-material/MenuRounded';
import PostAddIcon from '@mui/icons-material/PostAddRounded';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolderRounded';
import HistoryEduIcon from '@mui/icons-material/HistoryEduRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import GroupIcon from '@mui/icons-material/Group';

const drawerWidth = 280;

// ... existing imports ...

const menuItems: MenuItem[] = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'New Application', path: '/trade/new', icon: <PostAddIcon /> },
    { text: 'Letters of Credit', path: '/lc', icon: <DescriptionIcon /> },
    { text: 'Bank Guarantees', path: '/bg', icon: <SecurityIcon /> },
    { text: 'Trade Loans', path: '/loans', icon: <AccountBalanceIcon /> },
    { text: 'Collections', path: '/collections', icon: <DescriptionIcon /> },
    { text: 'Approvals', path: '/approvals', icon: <PlaylistAddCheckIcon /> },
    { text: 'Transaction History', path: '/history', icon: <HistoryEduIcon /> },
    { text: 'Documents', path: '/documents', icon: <SnippetFolderIcon /> },
    { text: 'Compliance Risk', path: '/compliance/risk', icon: <GavelIcon /> },
    { text: 'AML Screening', path: '/compliance/aml', icon: <SecurityIcon /> },
    { text: 'Reports & MIS', path: '/reports', icon: <AssessmentIcon /> },
    { text: 'Customer Master', path: '/admin/customers', icon: <GroupIcon /> },
    { text: 'Charges Setup', path: '/admin/charges', icon: <AccountBalanceIcon /> },
    { text: 'User Roles', path: '/admin/users', icon: <GroupIcon /> },
    { text: 'General Ledger', path: '/admin/gl', icon: <AssessmentIcon /> },
    { text: 'Audit Logs', path: '/admin/audit', icon: <HistoryEduIcon /> },
];

const MainLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar sx={{
                display: 'flex',
                alignItems: 'center',
                px: 3,
                py: 2,
                minHeight: 80,
                borderBottom: '1px solid #E2E8F0',
                flexShrink: 0
            }}>
                <AccountBalanceWalletIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                <Box>
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, lineHeight: 1 }}>
                        FINANCE
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 2, fontWeight: 600 }}>
                        SYSTEMS
                    </Typography>
                </Box>
            </Toolbar>
            <Box sx={{ py: 2, flexGrow: 1, overflowY: 'auto' }}>
                <Typography variant="subtitle2" sx={{ px: 3, py: 1, color: 'text.secondary', fontSize: '0.75rem' }}>
                    MAIN MENU
                </Typography>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileOpen(false);
                                }}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ p: 3, borderTop: '1px solid #E2E8F0', flexShrink: 0 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    System v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
                elevation={0}
            >
                <Toolbar sx={{ minHeight: 72 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />


                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* ... Notifications ... */}
                        <IconButton onClick={handleLogout} title="Logout">
                            <LogoutIcon color="action" />
                        </IconButton>

                        <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                John Doe
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Relationship Manager
                            </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>JD</Avatar>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    mt: 8
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
