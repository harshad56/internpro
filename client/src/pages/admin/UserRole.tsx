import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Avatar, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';

const UserRole: React.FC = () => {
    // Mock Data
    const [users, setUsers] = useState<any[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({ username: '', email: '', role: 'Initiator' });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    const requestDelete = (user: any) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/Admin/users/${userToDelete.id}`);
            window.location.reload();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete user");
        }
    };

    // Fetch users ... (existing code)

    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleUpdate = async () => {
        if (!selectedUser.email || !selectedUser.role) {
            alert("Please enter all details properly (Email, Role) before submitting.");
            return;
        }
        if (!isValidEmail(selectedUser.email)) {
            alert("Please enter a valid email address.");
            return;
        }
        try {
            await api.put(`/Admin/users/${selectedUser.id}`, {
                UserID: selectedUser.id,
                Email: selectedUser.email,
                Role: selectedUser.role
            });
            setEditDialogOpen(false);
            // Refresh list
            window.location.reload();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const isValidUsername = (username: string) => {
        // Alphanumeric, 3-20 characters
        return /^[a-zA-Z0-9]{3,20}$/.test(username);
    };

    const handleCreate = async () => {
        if (!newUser.username || !newUser.email || !newUser.role) {
            alert("Please enter all details properly (Username, Email, Role) before submitting.");
            return;
        }
        if (!isValidEmail(newUser.email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!isValidUsername(newUser.username)) {
            alert("Username must be 3-20 characters long and contain only letters and numbers (no special characters or spaces).");
            return;
        }
        try {
            await api.post('/Admin/users', {
                Username: newUser.username,
                Email: newUser.email,
                Role: newUser.role,
                PasswordHash: 'temp_pass' // Backend handles hashing, this is just to satisfy model matching if needed
            });
            setAddDialogOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Create failed", error);
        }
    };

    // Fetch users from API
    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/Admin/users');
                // Map backend User model to frontend display format
                const mappedUsers = response.data.map((u: any) => ({
                    id: u.userID,
                    name: u.username,
                    email: u.email,
                    role: u.role,
                    status: 'Active', // Default to Active as DB doesn't have status yet
                    department: 'General' // Default department
                }));
                setUsers(mappedUsers);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Admin': return 'error';
            case 'Approver': return 'warning';
            case 'Initiator': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    User & Role Management
                </Typography>
                <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAddDialogOpen(true)}>
                    Add New User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                                            {row.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2">{row.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>
                                    <Chip label={row.role} size="small" color={getRoleColor(row.role) as any} />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        size="small"
                                        variant="outlined"
                                        color={row.status === 'Active' ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => requestDelete(row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ADD USER DIALOG */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Username"
                            fullWidth
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <TextField
                            select
                            label="Role"
                            fullWidth
                            SelectProps={{ native: true }}
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="Initiator">Initiator</option>
                            <option value="Approver">Approver</option>
                            <option value="Admin">Admin</option>
                            <option value="TradeOps">TradeOps</option>
                            <option value="BranchUser">BranchUser</option>
                            <option value="CreditOfficer">CreditOfficer</option>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create User</Button>
                </DialogActions>
            </Dialog>

            {/* EDIT DIALOG */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit User Role</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">User: {selectedUser.name}</Typography>
                            <TextField
                                label="Email"
                                fullWidth
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            />
                            <TextField
                                select
                                label="Role"
                                fullWidth
                                SelectProps={{ native: true }}
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                            >
                                <option value="Initiator">Initiator</option>
                                <option value="Approver">Approver</option>
                                <option value="Admin">Admin</option>
                                <option value="TradeOps">TradeOps</option>
                                <option value="BranchUser">BranchUser</option>
                                <option value="CreditOfficer">CreditOfficer</option>
                            </TextField>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
                </DialogActions>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user <b>{userToDelete?.name}</b>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserRole;
