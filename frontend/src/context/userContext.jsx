/* eslint-disable react-refresh/only-export-components */
// import { createContext, useContext, useState } from "react";

// export const UserContext = createContext(null)

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null)
//     return <UserContext.Provider value={{ user, setUser }}>
//         {children}
//     </UserContext.Provider>
// }

// export const getData = () => useContext(UserContext) 

import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    // 1. Inizializza lo stato utente leggendo da localStorage
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            return null;
        }
    });

    // 2. Sincronizza lo stato React con localStorage ogni volta che lo stato "user" cambia
    useEffect(() => {
        if (user) {
            // Salva l'utente nello storage solo se esiste
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            // Rimuovi l'utente se lo stato è null (es. dopo il logout)
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-hooks/rules-of-hooks
export const getData = () => useContext(UserContext);