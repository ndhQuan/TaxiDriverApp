import { useEffect, useContext, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { accountInfo } from "../api/Auth";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function AccountInfo() {
  const autCtx = useContext(AuthContext);
  const [account, setAccount] = useState();

  useEffect(() => {
    async function getAccountInfo() {
      const info = await accountInfo(autCtx.userToken, autCtx.userId);
      if (info) {
        setAccount(info);
        console.log(info);
      }
    }
    getAccountInfo();
  }, []);

  console.log(account);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/driver-avatar.jpg")}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <View style={{ paddingLeft: 20 }}>
            <Text style={{ fontWeight: "bold" }}>{account.name}</Text>
            <Text>{account.phoneNumber}</Text>
            <Text>{account.email}</Text>
          </View>
        </View>
        <Pressable>
          <Ionicons name="pencil" size={18} />
        </Pressable>
      </View>
      <View></View>
    </View>
  );
}
