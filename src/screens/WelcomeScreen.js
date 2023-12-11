import { Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import Button from "../components/Button";

export default function WelcomeScreen({ navigation }) {
  function onBookingHandler(e) {
    navigation.navigate("GetTripInfo");
  }

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Welcome, you are logged in
        </Text>
      </View>
      <View style={styles.feature}>
        <Button android_ripple={{ color: "#ccc" }} onPress={onBookingHandler}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Nhận cuốc</Text>
          </View>
        </Button>
        <Button android_ripple={{ color: "#ccc" }} style={{ flex: 1 }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tài khoản</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feature: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 30,
    marginTop: 20,
    // backgroundColor: "#ca1",
  },
  inputConten: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    flex: 1,
    justifyContent: "center",
  },
});
