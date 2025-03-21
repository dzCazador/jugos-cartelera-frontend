import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messages = () => {
  const [publicMessages, setPublicMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Obtener mensajes públicos
    axios.get('http://localhost:3000/messages/public')
      .then(response => setPublicMessages(response.data))
      .catch(error => console.error(error));

    // Obtener mensajes privados (solo si el usuario está autenticado)
    if (token) {
      axios.get('http://localhost:3000/messages/private', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setPrivateMessages(response.data))
        .catch(error => console.error(error));
    }
  }, [token]);

  return (
    <div>
      <h2>Mensajes Públicos</h2>
      <ul>
        {publicMessages.map(message => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>

      <h2>Mensajes Privados</h2>
      <ul>
        {privateMessages.map(message => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;