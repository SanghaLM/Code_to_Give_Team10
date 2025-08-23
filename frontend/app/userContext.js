import React, { createContext, useContext, useState } from 'react';

// Example roles: 'student' or 'teacher'
const UserContext = createContext();

export function UserProvider({ children }) {
  const [role, setRole] = useState(null); 
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <UserContext.Provider value={{ role, setRole, username, setUsername, isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
