import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { AuthContext } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { BookingScreen } from "../screens/BookingScreen";

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>;
  }
  return (
    <NavigationContainer>
      {userToken !== null ? <BookingScreen /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;
