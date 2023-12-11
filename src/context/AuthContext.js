import React, { createContext, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  authenticate: (token) => {},
  logout: () => {},
  isLoading: false,
  userToken: "",
  isLogin: false,
});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        setUserToken(storedToken);
      }
    }

    fetchToken();
  }, [setUserToken]);

  const login = (token) => {
    setUserToken(token);
    setIsLoading(false);
    AsyncStorage.setItem("token", token);
  };

  const logout = () => {
    setUserToken(null);
    setIsLoading(false);
    AsyncStorage.removeItem("token");
  };

  const value = {
    authenticate: login,
    logout: logout,
    isLoading: isLoading,
    userToken: userToken,
    isLogin: !!userToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
