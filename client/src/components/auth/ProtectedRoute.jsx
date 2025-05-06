import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, isUser, redirect = '/login' }) => {
    if (!isUser) {
        return <Navigate to={redirect} />;
    }

    return children;
}

export default ProtectedRoute