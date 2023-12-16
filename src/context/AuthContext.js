import React, { createContext, useLayoutEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateRealTimeLocation } from "../api/UpdateLocation";
import { updateOperationState } from "../api/TripHandler";
import * as Location from "expo-location";

export const AuthContext = createContext({
  authenticate: (user) => {},
  logout: () => {},
  isLoading: false,
  userToken: "",
  userId: "",
  isLogin: false,
  online: false,
  toggleOperation: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [online, setOnline] = useState(false);
  const sendLocationRealTime = useRef(null);

  useLayoutEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedId = await AsyncStorage.getItem("id");

      if (storedToken) {
        setUserToken(storedToken);
        setUserId(storedId);
      }
    }

    fetchToken();
  }, [setUserToken, setUserId]);

  useLayoutEffect(() => {
    if (online) {
      sendRealTimeLocation();
    }

    return () => {
      setOffline();
    };
  }, [online]);

  function sendRealTimeLocation() {
    sendLocationRealTime.current = setInterval(async () => {
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.High,
      });

      const driverLocation = {
        latCurrent: location.coords.latitude,
        longCurrent: location.coords.longitude,
        tinhTP: null,
        quanHuyen: null,
        phuongXa: null,
        duong: null,
      };
      await updateRealTimeLocation(userToken, userId, driverLocation);
    }, 5000);
  }

  function setOffline() {
    clearInterval(sendLocationRealTime.current);
  }

  function toggleOperation() {
    setOnline((current) => !current);
  }

  const login = (user) => {
    setUserToken(user.token);
    setUserId(user.id);
    setIsLoading(false);
    AsyncStorage.setItem("token", user.token);
    AsyncStorage.setItem("id", user.id);
  };

  const logout = () => {
    setUserToken(null);
    setIsLoading(false);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("id");
  };

  const value = {
    authenticate: login,
    logout: logout,
    isLoading: isLoading,
    userToken: userToken,
    userId: userId,
    isLogin: !!userToken,
    toggleOperation: toggleOperation,
    online: online,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
