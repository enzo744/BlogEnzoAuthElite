import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- 1. IMPORTA useNavigate
import axios from "axios"; // <-- 1. IMPORTA axios
import { toast } from "sonner"; // <-- 1. IMPORTA sonner per le notifiche

// eslint-disable-next-line react-refresh/only-export-components
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

    const navigate = useNavigate(); // <-- 2. INIZIALIZZA useNavigate

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

        // --- 3. CREA LA FUNZIONE DI LOGOUT CENTRALIZZATA ---
  const logout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await axios.post(
          `https://blogenzoauthelite.onrender.com/user/logout`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
      toast.success("Logout effettuato con successo.");
    } catch (error) {
      console.error("Errore durante il logout API:", error);
      toast.error("Errore durante il logout, verrai disconnesso localmente.");
    } finally {
      // Questa parte viene eseguita sempre, garantendo il logout
      localStorage.clear(); // Pulisce tutto lo storage (token, user, etc.)
      setUser(null);     // Resetta lo stato ALLA FINE
      navigate("/", { replace: true }); // ⬅️ POI naviga alla home
    }
  };

  // --- 4. AGGIUNGI 'logout' AL VALORE DEL CONTEXT ---
  const value = {
    user,
    setUser,
    logout, // Esponi la funzione logout
  };


    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components, react-hooks/rules-of-hooks
export const getData = () => useContext(UserContext);