import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [childProfiles, setChildProfiles] = useState([]);

  return (
    <UserContext.Provider
      value={{
        role,
        setRole,
        username,
        setUsername,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        childProfiles,
        setChildProfiles,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Add default export to satisfy Expo Router
export default function UserContextRoute() {
  return null; // This won't be used as a route, but satisfies the requirement
}
