import { Pressable, View, Text } from "react-native";

export default function ButtonModal({ children, bgColor, width, onPress }) {
  return (
    <Pressable
      style={{
        backgroundColor: bgColor,
        width: width ? width : "90%",
        paddingVertical: 20,
        alignItems: "center",
        // position: "absolute",
        // bottom: 20,
        borderRadius: 10,
      }}
      android_ripple={{ color: "#999292" }}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
