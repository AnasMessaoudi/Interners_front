import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Landing from './Pages/landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Error404 from './Pages/Error404';
import Discover from './Pages/Discover';
import { AuthContext } from './context/AuthContext';

// Restricts /Login and /Register to unauthenticated users only
function GuestRoute() {
  const { logged, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return logged ? <Navigate to="/" replace /> : <Outlet />;
}

// Restricts /discover to authenticated users only
function ProtectedRoute() {
  const { logged, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return logged ? <Outlet /> : <Navigate to="/Login" replace />;
}

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  // Guest-only routes
  {
    element: <GuestRoute />,
    children: [
      { path: '/Login', element: <Login /> },
      { path: '/Register', element: <Register /> },
    ],
  },
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/discover', element: <Discover /> },
    ],
  },
  {
    path: '/*',
    element: <Error404 />,
  },
]);

export default function App() {
  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        console.log(response.data);
        setLogged(true);
      } catch (err) {
        localStorage.removeItem('token');
        console.error(err.message);
      } finally {
        setLoading(false); 
      }
    };

    loadUser();
  }, [logged]);

  return (
    <AuthContext.Provider value={{ user, setUser, logged, setLogged, loading }}>
      <RouterProvider router={routes} />
    </AuthContext.Provider>
  );
}