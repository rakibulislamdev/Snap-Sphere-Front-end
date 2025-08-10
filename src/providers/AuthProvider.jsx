import { useState } from "react";
import { AuthContext } from "../context";
import { useEffect } from "react";

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const user = JSON.parse(localStorage.getItem("user"));
      if (accessToken && refreshToken && user) {
        setAuth({ accessToken, refreshToken, user });
      }
    } catch (error) {
      console.error("Error retrieving authentication data:", error);
      setAuth(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
