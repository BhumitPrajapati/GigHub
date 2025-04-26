import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const PrivateAdminRoute = () => {
  const getToken: string | null = localStorage.getItem('token');

  const decodedToken: { role: string } | null = getToken ? jwtDecode<{ role: string }>(getToken) : null;

  if (decodedToken && decodedToken.role === 'admin') {
    return <Outlet />; // Render the Outlet component for admin routes
  } else {
    return <Navigate to="/login" />;
  }
};

export { PrivateRoute, PrivateAdminRoute };