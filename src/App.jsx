import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginRegister from './components/LoginRegister'
import MainMenu from './components/MainMenu'
import Profile from './components/Profile'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'
import axios from 'axios'
import CompletePost from './components/CompletePost'
import NotificationSocket from './components/NotificationSocket'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await axios.get("http://localhost:1234/auth/validate", {
                withCredentials: true
            });
            if (response.status === 200) {
              setIsAuthenticated(true);
              console.log("Usuario autenticado");
            } else {
              setIsAuthenticated(false);
              console.log("Usuario no autenticado");
              document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        } catch (error) {
            setIsAuthenticated(false);
            console.log("Error al autenticar usuario");
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        const userData = await getUser();
        setUser(userData);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const getUser = async () => {
    const username = localStorage.getItem('username');
    const response = await axios.get("http://localhost:1234/api/user/username/" + username, {
        withCredentials: true
    });
    return response.data;
};

  return (
    <ThemeProvider>
      {isAuthenticated && <NotificationSocket />}
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <MainMenu /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/auth" 
            element={isAuthenticated ? <Navigate to="/" /> : <LoginRegister />}
          />
          <Route
            path="/profile"
            element={<Profile User={user} />}
          />
          <Route
            path="/profile/:username"
            element={<Profile User={null} />}
          />
          <Route
            path="/post/:id"
            element={<CompletePost />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
