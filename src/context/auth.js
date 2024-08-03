import axios from "axios";
import { useState, useContext, createContext, useEffect } from "react";

const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    //eslint-disable-next-line
  }, []);

  // const updateAuth = (newAuth) => {
  //   // Update localStorage
  //   setAuth(newAuth);
  //   localStorage.setItem("auth", JSON.stringify(newAuth));
  // };

  return (
    <authContext.Provider value={[auth, setAuth]}>
      {children}
    </authContext.Provider>
  );
};

// Custom Hook
const useAuth = () => useContext(authContext);

export { useAuth, AuthProvider };
