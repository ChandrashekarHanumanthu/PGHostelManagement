import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { setupAuthInterceptors } from '../api/axiosClient';

type Role = 'ADMIN' | 'OWNER' | 'TENANT' | null;

interface AuthState {
  token: string | null;
  role: Role;
  userId: number | null;
  name: string | null;
  hostelId: number | null;
  hostelName: string | null;
  isSetupComplete: boolean | null;
  isLoading: boolean;
}

interface AuthContextValue extends Omit<AuthState, 'isLoading'> {
  isLoading: boolean;
  login: (data: { 
    token: string; 
    role: Role; 
    userId: number; 
    name: string;
    hostelId?: number;
    hostelName?: string;
    isSetupComplete?: boolean;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    userId: null,
    name: null,
    hostelId: null,
    hostelName: null,
    isSetupComplete: null,
    isLoading: true,
  });

  // Set up auth interceptors once when provider mounts
  useEffect(() => {
    setupAuthInterceptors(() => {
      setState(prev => ({ 
        ...prev,
        token: null, 
        role: null, 
        userId: null, 
        name: null,
        hostelId: null,
        hostelName: null,
        isSetupComplete: null,
      }));
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as Role;
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const hostelId = localStorage.getItem('hostelId');
    const hostelName = localStorage.getItem('hostelName');
    const isSetupComplete = localStorage.getItem('isSetupComplete');
    
    if (token && role && userId) {
      setState({
        token,
        role,
        userId: Number(userId),
        name: name || null,
        hostelId: hostelId ? Number(hostelId) : null,
        hostelName: hostelName || null,
        isSetupComplete: isSetupComplete ? isSetupComplete === 'true' : null,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (data: { 
    token: string; 
    role: Role; 
    userId: number; 
    name: string;
    hostelId?: number;
    hostelName?: string;
    isSetupComplete?: boolean;
  }) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role || '');
    localStorage.setItem('userId', String(data.userId));
    localStorage.setItem('name', data.name);
    
    if (data.hostelId) {
      localStorage.setItem('hostelId', String(data.hostelId));
    }
    if (data.hostelName) {
      localStorage.setItem('hostelName', data.hostelName);
    }
    if (data.isSetupComplete !== undefined) {
      localStorage.setItem('isSetupComplete', String(data.isSetupComplete));
    }
    
    setState({
      token: data.token,
      role: data.role,
      userId: data.userId,
      name: data.name,
      hostelId: data.hostelId || null,
      hostelName: data.hostelName || null,
      isSetupComplete: data.isSetupComplete || null,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.clear();
    setState({ 
      token: null, 
      role: null, 
      userId: null, 
      name: null,
      hostelId: null,
      hostelName: null,
      isSetupComplete: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
