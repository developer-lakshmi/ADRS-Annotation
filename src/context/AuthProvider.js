import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync } from "../redux/slices/auth/authSlice";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();
    return token && tokenExpiry && Number(tokenExpiry) > currentTime;
  });

  useEffect(() => {
    const validateToken = () => {
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      const currentTime = new Date().getTime();

      if (token && tokenExpiry && Number(tokenExpiry) > currentTime) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        dispatch(logoutAsync());
      }
    };

    validateToken();
  }, [token, dispatch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;