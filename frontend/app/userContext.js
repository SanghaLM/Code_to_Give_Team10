// <<<<<<< HEAD
// import React, { createContext, useContext, useState } from "react";
// =======
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// >>>>>>> 94c69ee0e567371e51151cb609b9ac0d5c488055

// const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [role, setRole] = useState(null);
//   const [username, setUsername] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
// <<<<<<< HEAD
//   const [userData, setUserData] = useState(null);
//   const [childProfiles, setChildProfiles] = useState([]);
// =======
//   const [token, setToken] = useState(null);
//   const [childrenList, setChildrenList] = useState([]); // parent's children
//   const [selectedChildId, setSelectedChildId] = useState(null);

//   // Rehydrate from AsyncStorage
//   useEffect(() => {
//     (async () => {
//       try {
//         // Development convenience: clear persisted session so login shows on startup.
//         // This runs only when React Native/Expo __DEV__ flag is true.
//         if (typeof __DEV__ !== 'undefined' && __DEV__) {
//           try {
//             await AsyncStorage.removeItem('reach:user');
//             console.log('Dev: cleared persisted reach:user from AsyncStorage');
//           } catch (e) {
//             console.warn('Dev: failed to clear persisted reach:user', e);
//           }
//         }

//         const raw = await AsyncStorage.getItem('reach:user');
//         if (!raw) return;
//         const data = JSON.parse(raw);
//         if (data.token) setToken(data.token);
//         if (data.role) setRole(data.role);
//         if (data.username) setUsername(data.username);
//         if (data.selectedChildId) setSelectedChildId(data.selectedChildId);
//         if (data.childrenList) setChildrenList(data.childrenList);
//         if (data.isLoggedIn) setIsLoggedIn(true);
//       } catch (err) {
//         console.warn('Failed to rehydrate user context', err);
//       }
//     })();
//   }, []);

//   // Persist small set of fields
//   useEffect(() => {
//     (async () => {
//       try {
//         const payload = JSON.stringify({ token, role, username, selectedChildId, childrenList, isLoggedIn });
//         await AsyncStorage.setItem('reach:user', payload);
//       } catch (err) {
//         console.warn('Failed to persist user context', err);
//       }
//     })();
//   }, [token, role, username, selectedChildId, childrenList, isLoggedIn]);
// >>>>>>> 94c69ee0e567371e51151cb609b9ac0d5c488055

//   return (
//     <UserContext.Provider
//       value={{
//         role,
//         setRole,
//         username,
//         setUsername,
//         isLoggedIn,
//         setIsLoggedIn,
// <<<<<<< HEAD
//         userData,
//         setUserData,
//         childProfiles,
//         setChildProfiles,
// =======
//         token,
//         setToken,
//         childrenList,
//         setChildrenList,
//         selectedChildId,
//         setSelectedChildId,
// >>>>>>> 94c69ee0e567371e51151cb609b9ac0d5c488055
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// }

// // Add default export to satisfy Expo Router
// export default function UserContextRoute() {
//   return null; // This won't be used as a route, but satisfies the requirement
// }

// // Default export for router compatibility (not used as a screen). Export the provider.
// export default UserProvider;



import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [childProfiles, setChildProfiles] = useState([]);
  const [token, setToken] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Rehydrate from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        // Development convenience: clear persisted session so login shows on startup.
        // This runs only when React Native/Expo __DEV__ flag is true.
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          try {
            await AsyncStorage.removeItem("reach:user");
            console.log("Dev: cleared persisted reach:user from AsyncStorage");
          } catch (e) {
            console.warn("Dev: failed to clear persisted reach:user", e);
          }
        }

        const raw = await AsyncStorage.getItem("reach:user");
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.token) setToken(data.token);
        if (data.role) setRole(data.role);
        if (data.username) setUsername(data.username);
        if (data.userData) setUserData(data.userData);
        if (data.childProfiles) setChildProfiles(data.childProfiles);
        if (data.childrenList) setChildrenList(data.childrenList);
        if (data.selectedChildId) setSelectedChildId(data.selectedChildId);
        if (data.isLoggedIn) setIsLoggedIn(data.isLoggedIn);
      } catch (err) {
        console.warn("Failed to rehydrate user context", err);
      }
    })();
  }, []);

  // Persist small set of fields
  useEffect(() => {
    (async () => {
      try {
        const payload = JSON.stringify({
          token,
          role,
          username,
          userData,
          childProfiles,
          childrenList,
          selectedChildId,
          isLoggedIn,
        });
        await AsyncStorage.setItem("reach:user", payload);
      } catch (err) {
        console.warn("Failed to persist user context", err);
      }
    })();
  }, [token, role, username, userData, childProfiles, childrenList, selectedChildId, isLoggedIn]);

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
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Named export for Expo Router compatibility (not used as a screen)
export function UserContextRoute() {
  return null; // This won't be used as a route, but satisfies the requirement
}

// Default export: the provider
export default UserProvider;