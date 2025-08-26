import React, { createContext, useContext, useState } from 'react';

// Créer le contexte
const UserContext = createContext();

// Fournisseur de contexte
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useUserContext = () => {
  return useContext(UserContext);
};