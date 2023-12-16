import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import ButtonModal from "../components/ButtonModal";
import {
  calculateInitialRegion,
  convertToPolylineFormat,
  getFormatedNow,
} from "../utils/helper";
import { Polyline, Marker } from "react-native-maps";
import { getDirections } from "../api/GoogleMap";
import Map from "../components/Map";
import { Ionicons } from "@expo/vector-icons";
import ButtonIcon from "../components/UI/ButtonIcon";
import * as Location from "expo-location";
import * as signalR from "@microsoft/signalr";
import {
  BASEAPI_URL,
  driverToGuest,
  guestToEnd,
  journeyState,
} from "../utils/constant";
import { AuthContext } from "../context/AuthContext";
import {
  CreateJourney,
  getDriverState,
  getTaxiTypeInfo,
  updateJourneyState,
  updateOperationState,
} from "../api/TripHandler";

export default function TripProcessing({ navigation, route }) {
  const startAddr = route.params.startAddr;
  const endAddr = route.params.endAddr;
  const startLat = route.params.startLat;
  const startLng = route.params.startLng;
  const endLat = route.params.endLat;
  const endLng = route.params.endLng;
  const curLat = route.params.curLat;
  const curLng = route.params.curLng;
  const guestId = route.params.userId;
  const guestName = route.params.name;
  const guestPhone = route.params.phoneNumber;

  const [pickedUpCustomer, setPickedUpCustomer] = useState(false);
  const [coords, setCoords] = useState([]);
  const [iniRegion, setIniRegion] = useState({
    latitude: curLat,
    longitude: curLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const authCtx = useContext(AuthContext);
  const token = authCtx.userToken;
  const [connection, setConnection] = useState();
  // const [polyCoords, setPolyCoords] = useState({
  //   startCoord: `${curLat},${curLng}`,
  //   endCoord: `${startLat},${startLng}`,
  // });
  const [polyCoords, setPolyCoords] = useState(driverToGuest);

  const mapRef = useRef();
  const km = useRef(5200 * 0.001);
  const unitCost = useRef();
  const journey = useRef();

  useEffect(() => {
    async function createJourney() {
      const driverState = await getDriverState(
        authCtx.userId,
        authCtx.userToken
      );

      const taxiTypeId = driverState.taxi.typeId;
      // console.log(taxiTypeId);
      const taxiType = await getTaxiTypeInfo(authCtx.userToken, 4);
      console.log(taxiType.cost);
      unitCost.current = taxiType.cost;

      const journeyInfo = {
        customerId: guestId,
        driverId: authCtx.userId,
        licensePlate: driverState.bienSoXe,
        startAddr: startAddr,
        startLat: startLat,
        startLng: startLng,
        endAddr: endAddr,
        endLat: endLat,
        endLng: endLng,
        distance: 5.2,
        timeStart: getFormatedNow(),
        state: journeyState.confirmed,
        totalPrice: unitCost.current * km.current,
      };
      journey.current = await CreateJourney(journeyInfo, authCtx.userToken);
      console.log(journey.current.id);
      console.log(getFormatedNow());
    }

    createJourney();
  }, []);
  useEffect(() => {
    // async function getPolyline() {
    //   // const { points, distance } = await getDirections(
    //   //   polyCoords.startCoord,
    //   //   polyCoords.endCoord
    //   // );
    //   // console.log(distance, "points");

    // }
    // getPolyline();
    const polylineCoords = convertToPolylineFormat(polyCoords);
    setCoords(polylineCoords);
    setIniRegion(() => calculateInitialRegion(polyCoords));
  }, [polyCoords, setCoords]);

  useEffect(() => {
    const newconnection = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl(`${BASEAPI_URL}/hubs/journey`, {
        accessTokenFactory: () => token,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newconnection
      .start()
      .then(() => setConnection(newconnection))
      .catch((err) => console.log(err));
    return () => newconnection.stop();
  }, []);

  useEffect(() => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
      connection.send("SendDriverInfo", guestId);
      async function sendCoord() {
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
          accuracy: Location.Accuracy.High,
        });
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        connection.send("SendRealTimeDriverCoords", guestId, lat, lng);
      }
      sendCoord();
    }
  }, [connection]);

  useEffect(() => {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
      const sendRealTimeCoords = setInterval(async () => {
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
          accuracy: Location.Accuracy.High,
        });
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        connection.send("SendRealTimeDriverCoords", guestId, lat, lng);
      }, 3000);
      return () => clearInterval(sendRealTimeCoords);
    }
  }, [connection]);

  async function onPickupHandler() {
    // setPolyCoords({
    //   startCoord: `${startLat},${startLng}`,
    //   endCoord: `${endLat},${endLng}`
    // });
    setPolyCoords(guestToEnd);
    setPickedUpCustomer(true);
    await updateJourneyState(
      authCtx.userToken,
      journey.current.id,
      "state",
      journeyState.onGoing
    );
    connection.send("SendPickedupNotification", guestId);
  }

  async function onFinishHandler() {
    connection.send("SendFinishNotification", guestId);
    await updateJourneyState(
      authCtx.userToken,
      journey.current.id,
      "state",
      journeyState.completed
    );
    const timeEnd = getFormatedNow();
    await updateJourneyState(
      authCtx.userToken,
      journey.current.id,
      "timeEnd",
      timeEnd
    );

    navigation.replace("Bill", {
      cost: unitCost.current * km.current,
      guestName: guestName,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {!pickedUpCustomer && (
            <View
              style={[{ flex: 1, backgroundColor: "#09c009" }, styles.title]}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                ĐÓN KHÁCH
              </Text>
            </View>
          )}

          <View
            style={[
              {
                flex: 1,
                backgroundColor: pickedUpCustomer ? "#09c009" : "black",
              },
              styles.title,
            ]}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              KHÁCH XUỐNG XE
            </Text>
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <View
            style={{
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#ccc",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "white" }}>{guestName}</Text>
            <Text style={{ color: "white" }}>{guestPhone}</Text>
          </View>
          <View>
            {!pickedUpCustomer && (
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                {startAddr}
              </Text>
            )}
            {pickedUpCustomer && (
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                {endAddr}
              </Text>
            )}
          </View>
        </View>
      </View>
      {!pickedUpCustomer ? (
        <Map fl={{ flex: 2 }} region={iniRegion} mapRef={mapRef}>
          <Marker
            coordinate={{
              latitude: startLat,
              longitude: startLng,
            }}
          />
          <Polyline
            coordinates={coords}
            strokeWidth={8}
            strokeColor="#4b4ee7"
          />
        </Map>
      ) : (
        <Map fl={{ flex: 2 }} region={iniRegion} mapRef={mapRef}>
          <Marker
            coordinate={{
              latitude: endLat,
              longitude: endLng,
            }}
          />
          <Polyline
            coordinates={coords}
            strokeWidth={8}
            strokeColor="#4b4ee7"
          />
        </Map>
      )}

      <View style={{ flex: 1, backgroundColor: "#1f1c1c" }}>
        <View
          style={{
            flex: 1,
            // backgroundColor: "#2c2727",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <ButtonIcon
            iconName={"chatbox-ellipses-outline"}
            description={"Chat"}
          />
          <ButtonIcon iconName={"close"} description={"Hủy"} />
        </View>
        <View
          style={{
            flex: 1,
            // backgroundColor: "#8b18e9",
            alignItems: "center",
          }}
        >
          {!pickedUpCustomer ? (
            <ButtonModal onPress={onPickupHandler} bgColor="#09c009">
              <Text style={{ color: "white" }}>ĐÓN KHÁCH</Text>
            </ButtonModal>
          ) : (
            <ButtonModal onPress={onFinishHandler} bgColor="#09c009">
              <Text style={{ color: "white" }}>KHÁCH XUỐNG XE</Text>
            </ButtonModal>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    justifyContent: "center",
    alignItems: "center",
  },
});
