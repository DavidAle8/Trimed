import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    token: null
  });

  const login = (userData, token, isAdmin = false) => {
    setAuthState({
      isAuthenticated: true,
      isAdmin,
      user: userData,
      token
    });
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null
    });
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
