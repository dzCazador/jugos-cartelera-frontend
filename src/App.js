import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Messages from './components/Messages';
import CreateMessage from './components/CreateMessage';
import UserManagement from './components/UserManagement'; // Importa UserManagement
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/create-message" element={<CreateMessage />} />
                    <Route path="/users" element={<UserManagement />} /> {/* Agrega la ruta para UserManagement */}
                </Route>
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;