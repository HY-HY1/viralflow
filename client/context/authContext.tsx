"use client";

import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null,
  logout: async () => {} 
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const logout = async () => {
    // Implement your logout logic here
  };

  return (
    <AuthContext.Provider value={{ user: null, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
