import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography,Button } from '@mui/material';
import downloadIcon from '../assets/download-pdf.png'
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Obtener la URL base de la variable de entorno

const Messages = () => {
  const [publicMessages, setPublicMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    console.log('Hola')
      // Obtener el rol del usuario
    if (token) {
      axios.get(`${API_BASE_URL}/api/users/loggedUser`, {
          headers: { Authorization: `Bearer ${token}` },
      })
          .then(response => {
              setUserRole(response.data.role); // Obtener el rol del usuario de la respuesta
          })
          .catch(error => console.error('Error al obtener el rol del usuario:', error));
    }


    // Obtener mensajes públicos
    axios.get(`${API_BASE_URL}/api/messages/public`)
      .then(response => {
        const messagesWithIds = response.data.map((message, index) => ({ ...message, id: index }));
        setPublicMessages(messagesWithIds);
      })
      .catch(error => console.error(error));

    // Obtener mensajes privados (solo si el usuario está autenticado)
    if (token) {
      axios.get(`${API_BASE_URL}/api/messages/private`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const messagesWithIds = response.data.map((message, index) => ({ ...message, id: index }));
          setPrivateMessages(messagesWithIds);
        })
        .catch(error => console.error(error));
    }
  }, [token]);

  const columns = [
    {
      field: 'content',
      headerName: 'Mensaje',
      width: 300,
      renderCell: (params) => {
        const mensaje = params.row.content;
        const fileUrl = params.row.file; // Usando el campo 'file'

        if (fileUrl) {
          return (
            <div>
              {mensaje}
              <a 
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: '10px' }}
              >
                <img
                    src={downloadIcon}
                    alt="Descargar archivo"
                    style={{ width: '20px', height: '20px' }} // Ajusta el tamaño del icono
                />
            </a>
            </div>
          );
        } else {
          return mensaje;
        }
      },
    },
  ];

  const localeText = {
    rowsPerPageText: 'Filas por página:',
    // Puedes agregar más textos personalizados aquí
  };

  const handleCreateMessageClick = () => {
    navigate('/create-message'); // Navega a la ruta /create-message
  };
  const handleUserManagementClick = () => {
    navigate('/users'); // Navega a la ruta /users
  };  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography variant="h6" gutterBottom>Cartelera Pública</Typography>
        {userRole === 'ADMIN' && ( // Renderiza los botones solo si el rol es ADMIN
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <Button variant="contained" onClick={handleCreateMessageClick}>Crear mensajes</Button>
                        <Button variant="contained" onClick={handleUserManagementClick}>Mantenimiento de Usuarios</Button>
                    </Box>
                )}
      </Box>
      <div style={{ height: 400, width: '100%', marginBottom: '20px' }}>
        <DataGrid
          rows={publicMessages}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          localeText={localeText}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#ADD8E6',
              color: '#1976D2',
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: '#E0F2F7',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
      </div>
      <Typography variant="h6" gutterBottom>Cartelera Privada</Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={privateMessages}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          localeText={localeText}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#ADD8E6',
              color: '#1976D2',
            },
            '& .MuiDataGrid-row:nth-of-type(odd)': {
              backgroundColor: '#E0F2F7',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
      </div>
    </Box>
  );
};

export default Messages;