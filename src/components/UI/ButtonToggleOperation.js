import { useContext } from "react";
import { Pressable, View, Text } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { updateOperationState } from "../../api/TripHandler";

export default function ButtonToggle({ styles }) {
  const autCtx = useContext(AuthContext);

  async function toggleHandler() {
    if (autCtx.online) {
      await updateOperationState(autCtx.userToken, autCtx.userId, 0);
    } else {
      await updateOperationState(autCtx.userToken, autCtx.userId, 1);
    }

    autCtx.toggleOperation();
  }
  return (
    <Pressable
      onPress={toggleHandler}
      style={[
        {
          flexDirection: "row",
          height: 30,
        },
        styles,
      ]}
    >
      <View
        style={{
          backgroundColor: autCtx.online ? "rgb(16, 192, 30)" : "#8b8585",
          width: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>ON</Text>
      </View>
      <View
        style={{
          backgroundColor: autCtx.online ? "#8b8585" : "rgb(197, 11, 11)",
          width: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>OFF</Text>
      </View>
    </Pressable>
  );
}
