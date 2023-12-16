import { View, Text } from "react-native";
import ButtonModal from "../components/ButtonModal";

export default function Bill({ navigation, route }) {
  const cost = route.params.cost;
  const guestName = route.params.guestName;
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Biên nhận thu tiền
        </Text>
      </View>
      <View>
        <View style={{ padding: 20, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 18 }}>{guestName}</Text>
        </View>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 18 }}>Giá cước</Text>
          <Text style={{ fontSize: 18 }}>{cost.toLocaleString("en-US")}đ</Text>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <ButtonModal bgColor="#09c009" onPress={() => navigation.popToTop()}>
          <Text style={{ fontWeight: "bold" }}>XÁC NHẬN</Text>
        </ButtonModal>
      </View>
    </View>
  );
}
