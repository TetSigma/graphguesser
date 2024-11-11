import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';


interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Restore session if refresh token exists
  const restoreSession = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await axios.post(`${backendUrl}/api/auth/refresh-token`, { refreshToken });
        const { access_token, user } = response.data;
        localStorage.setItem('accessToken', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setIsAuthenticated(true);
        setUser(user);
      } catch (error) {
        console.error('Session restoration failed:', error);
        await logout();
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false); // Finish loading after restore attempt
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      const { access_token, refresh_token, user } = response.data.session;
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setIsAuthenticated(true);
      setUser(user);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!isLoading ? children : <Loader/>} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
