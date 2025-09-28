import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsConnected(!!token);
    };

    checkConnection();
  }, []);

  const login = async (token, utilisateur) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    setIsConnected(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('utilisateur');
    setIsConnected(false);
  };

  return (
    <AuthContext.Provider value={{ isConnected, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};