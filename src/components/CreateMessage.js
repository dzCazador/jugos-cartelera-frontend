import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'; // Importa ArrowBackIcon

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Obtener la URL base de la variable de entorno

const CreateMessage = () => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [contentError, setContentError] = useState(false);
  const [userError, setUserError] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    // Obtener la lista de usuarios
    axios.get(`${API_BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, [token]);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones
    let isValid = true;
    if (!content.trim()) {
      setContentError(true);
      isValid = false;
    } else {
      setContentError(false);
    }

    if (!isPublic && !selectedUser) {
      setUserError(true);
      isValid = false;
    } else {
      setUserError(false);
    }

    if (!isValid) {
      return;
    }    

    const formData = new FormData();
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }
    formData.append('isPublic', isPublic);

    if (!isPublic) {
      formData.append('userId', parseInt(selectedUser, 10));
    }
    else{
      formData.append('userId', 1);
    }
    try {
      await axios.post('/api/messages', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Mensaje creado con éxito');
      setContent('');
      setFile(null);
      setIsPublic(true);
      setSelectedUser('');
    } catch (error) {
      console.error('Error al crear el mensaje:', error);
      alert('Error al crear el mensaje');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
};

  return (
    <Box
      component={Paper}
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" gutterBottom>Crear Mensaje</Typography>
                  <Button variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />}>Volver</Button>
                  </Box>
      <TextField
        label="Contenido"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={contentError}
        helperText={contentError ? 'El contenido no puede estar en blanco' : ''}
      />
      <FormControlLabel
        control={<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
        label="Público"
      />
      {!isPublic && (
        <FormControl fullWidth error={userError}>
          <InputLabel id="user-select-label">Usuario</InputLabel>
          <Select
            labelId="user-select-label"
            id="user-select"
            value={selectedUser}
            label="Usuario"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
            ))}
          </Select>
          {userError && <Typography color="error">Selecciona un usuario</Typography>}
        </FormControl>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="outlined" component="span">
            Seleccionar archivo
          </Button>
        </label>
        <Typography variant="body2" sx={{ ml: 2 }}>{file ? file.name : 'Ningún archivo seleccionado'}</Typography>
      </Box>
      <Button variant="contained" onClick={handleSubmit}>Crear Mensaje</Button>
    </Box>
  );
};

export default CreateMessage;