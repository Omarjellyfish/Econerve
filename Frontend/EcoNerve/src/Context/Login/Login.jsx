import { createContext, useState, useEffect } from "react";

export const LoginContext = createContext();

export const LoginAdmin = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <LoginContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </LoginContext.Provider>
  );
};
