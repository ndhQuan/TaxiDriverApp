import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ButtonIcon({
  iconName,
  iconColor = "black",
  description,
}) {
  return (
    <Pressable
      style={{
        height: "80%",
        width: 80,
        borderRadius: 25,
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#aca6a6",
          overflow: "hidden",
        }}
      >
        <Ionicons name={iconName} size={30} color={iconColor} />
      </View>
      <Text style={{ color: "white", fontSize: 16 }}>{description}</Text>
    </Pressable>
  );
}
