
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

// Mocked user data - in a real app this would come from Supabase
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'nawaf',
    password: 'nawaf123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'abdulsalam',
    password: 'abdulsalam123',
    role: 'manager',
    createdAt: new Date().toISOString(),
  }
];

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('alramz_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user', err);
        localStorage.removeItem('alramz_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to Supabase
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      
      if (!user) {
        throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      // Store user in local storage
      localStorage.setItem('alramz_user', JSON.stringify(userWithoutPassword));
      setCurrentUser(userWithoutPassword as User);
      
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('alramz_user');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error, 
      login, 
      logout,
      isAuthenticated: !!currentUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
