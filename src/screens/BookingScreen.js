import React, { useContext } from "react";
import { View, Text } from "react-native";
import MapView from "react-native-maps";
import CustomButton from "../components/CustomButton";
import { SafeArea } from "../utils/safe-area.component";
import { AuthContext } from "../context/AuthContext";
export const BookingScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <SafeArea>
      <View style={{ padding:16}}>
        <CustomButton
          label={"logout"}
          onPress={() => {
            logout();
          }}
        />
      </View>
      <View>
        <MapView style={{ height: "80%", width: "100%" }} />
        <CustomButton label={"Go online" } onPress={() => {}} />
      </View>
    </SafeArea>
  );
};
