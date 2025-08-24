import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Example roles: 'student' or 'teacher'
const UserContext = createContext();

export function UserProvider({ children }) {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [childrenList, setChildrenList] = useState([]); // parent's children
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Rehydrate from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        // Development convenience: clear persisted session so login shows on startup.
        // This runs only when React Native/Expo __DEV__ flag is true.
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          try {
            await AsyncStorage.removeItem('reach:user');
            console.log('Dev: cleared persisted reach:user from AsyncStorage');
          } catch (e) {
            console.warn('Dev: failed to clear persisted reach:user', e);
          }
        }

        const raw = await AsyncStorage.getItem('reach:user');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.token) setToken(data.token);
        if (data.role) setRole(data.role);
        if (data.username) setUsername(data.username);
        if (data.selectedChildId) setSelectedChildId(data.selectedChildId);
        if (data.childrenList) setChildrenList(data.childrenList);
        if (data.isLoggedIn) setIsLoggedIn(true);
      } catch (err) {
        console.warn('Failed to rehydrate user context', err);
      }
    })();
  }, []);

  // Persist small set of fields
  useEffect(() => {
    (async () => {
      try {
        const payload = JSON.stringify({ token, role, username, selectedChildId, childrenList, isLoggedIn });
        await AsyncStorage.setItem('reach:user', payload);
      } catch (err) {
        console.warn('Failed to persist user context', err);
      }
    })();
  }, [token, role, username, selectedChildId, childrenList, isLoggedIn]);

  return (
    <UserContext.Provider
      value={{
        role,
        setRole,
        username,
        setUsername,
        isLoggedIn,
        setIsLoggedIn,
        token,
        setToken,
        childrenList,
        setChildrenList,
        selectedChildId,
        setSelectedChildId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
