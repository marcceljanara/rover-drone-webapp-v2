// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_URL + "/v1/authentications/me",
          { withCredentials: true }
        );
        setUser(res.data.data.user); // {id, role, fullname, email}
      } catch (err) {
        setUser(null);
        // redirect ke halaman awal kalau token invalid / expired
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
