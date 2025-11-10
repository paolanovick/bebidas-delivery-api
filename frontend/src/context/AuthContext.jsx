// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUsuario(null);
          setLoading(false);
          return;
        }
        setUsuario(decoded);
      } catch {
        localStorage.removeItem("token");
        setUsuario(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUsuario(decoded);
  };

  const logout = () => {
    // 🔴 NO usamos useCarrito acá
    localStorage.removeItem("token");
    localStorage.removeItem("carrito"); // limpia carrito persistido
    window.dispatchEvent(new CustomEvent("carrito:updated")); // aviso opcional
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
