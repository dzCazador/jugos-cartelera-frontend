import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'; // Importa ArrowBackIcon
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'USER',
    });
    const [editUserId, setEditUserId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editUserId) {
                await axios.patch(`${API_BASE_URL}/api/users/${editUserId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEditUserId(null);
            } else {
                await axios.post(`${API_BASE_URL}/api/users/auth/register`, formData);
            }
            fetchUsers();
            setFormData({ email: '', password: '', name: '', role: 'USER' });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (user) => {
        setEditUserId(user.id);
        setFormData({ email: user.email, password: '', name: user.name, role: user.role });
    };

    const handleBack = () => {
        navigate(-1); // Navega a la página anterior
    };

    return (
        <Box
            component={Paper}
            sx={{
                p: 4,
                maxWidth: 800,
                mx: 'auto',
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>{editUserId ? 'Editar Usuario' : 'Crear Usuario'}</Typography>
                <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />}>Volver</Button>
            </Box>
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required={!editUserId} />
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
            <FormControl fullWidth>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                    labelId="role-select-label"
                    id="role-select"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSubmit}>{editUserId ? 'Actualizar Usuario' : 'Crear Usuario'}</Button>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserManagement;