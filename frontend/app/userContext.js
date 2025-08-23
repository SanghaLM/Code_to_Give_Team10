import React, { createContext, useContext, useState } from 'react';

// Example roles: 'student' or 'teacher'
const UserContext = createContext();

export function UserProvider({ children }) {
  // In a real app, fetch/set this from login or backend
  const [role, setRole] = useState('teacher'); // default to student
  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
