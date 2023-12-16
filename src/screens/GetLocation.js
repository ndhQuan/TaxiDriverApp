import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import { AuthContext } from "../context/AuthContext";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import {
  Alert,
  Pressable,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TextInput,
  Modal as OriginalModal,
  ActivityIndicator,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { getGeocode, getDirections } from "../api/GoogleMap";
import ButtonToggle from "../components/UI/ButtonToggleOperation";

import InfoModal from "../components/InfoModal";
import ButtonModal from "../components/ButtonModal";
import Map from "../components/Map";
import * as signalR from "@microsoft/signalr";
import { BASEAPI_URL } from "../utils/constant";

export default function GetLocation({ navigation }) {
  const [connection, setConnection] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  // const [requestInfo, setRequestInfo] = useState({
  //   startLat: 10.82884,
  //   startLng: 106.66659,
  //   endLat: 10.82545,
  //   endLng: 106.67969,
  // });
  const [requestInfo, setRequestInfo] = useState(null);
  const [countDown, setCountDown] = useState(15);
  const authCtx = useContext(AuthContext);
  const token = authCtx.userToken;
  const mapRef = useRef(null);
  const polyCoords = useRef();
  const countDownInterval = useRef(null);
  // const [placeIdStart, setPlaceIdStart] = useState(
  //   "ChIJ2U3J2QUpdTER8vO_6Unx4Fk"
  // );
  // const [placeIdEnd, setPlaceIdEnd] = useState("ChIJkdCR-fwodTER-jQabj62D3M");

  const { width, height } = Dimensions.get("window");

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.092;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const INITIAL_LAT = 10.82302;
  const INITIAL_LONG = 106.62965;
  const region = {
    latitude: INITIAL_LAT,
    longitude: INITIAL_LONG,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  // function getTripInfo(start, end) {
  //   const startCoord = { lat: 10.828939, lng: 106.6667 };
  //   const endCoord = { lat: 10.8254, lng: 106.6798 };
  //   setIsOpenModal(false);
  //   console.log(startCoord, endCoord);
  //   navigation.navigate("BookingTaxi", {
  //     start,
  //     end,
  //   });
  // }

  function onAcceptRequestHandler() {
    setIsOpenModal(false);
    setCountDown(15);
    clearInterval(countDownInterval.current);
    navigation.navigate("TripProcessing", {
      ...requestInfo,
      curLat: currentLocation.lat,
      curLng: currentLocation.lng,
    });
  }

  function denyHandler() {
    setIsOpenModal(false);
    setRequestInfo(null);
    connection.send("SendDenyResponse", requestInfo.userId);
    clearInterval(countDownInterval.current);
    setCountDown(15);
  }

  useLayoutEffect(() => {
    async function getCurrentCoord() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        // enableHighAccuracy: true,
        // accuracy: Location.Accuracy.High,
      });
      console.log(location, "location");

      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }
    // const findCoord = setTimeout(getCurrentCoord, 3000);
    // return () => clearTimeout(findCoord);
    getCurrentCoord();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          latitudeDelta: 0.001,
          longitudeDelta: 0.008,
        },
        2000
      );
    }
  }, [currentLocation]);

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
      connection.on(
        "ReceiveRequestInfo",
        function (
          userId,
          name,
          phoneNumber,
          startAddr,
          startLat,
          startLng,
          endAddr,
          endLat,
          endLng
        ) {
          setRequestInfo({
            userId,
            name,
            phoneNumber,
            startAddr,
            startLat,
            startLng,
            endAddr,
            endLat,
            endLng,
          });
          setIsOpenModal(true);
        }
      );
    }
  }, [connection]);

  useEffect(() => {
    if (isOpenModal) {
      countDownInterval.current = setInterval(() => {
        if (countDown == 0) {
          setIsOpenModal(false);
          connection.send("SendDenyResponse", requestInfo.userId);
          clearInterval(countDownInterval.current);
          setCountDown(15);
        } else {
          setCountDown((time) => time - 1);
        }
      }, 1000);
      return () => clearInterval(countDownInterval.current);
    }
  }, [isOpenModal, countDown]);

  return (
    <PaperProvider>
      <ButtonToggle
        styles={{ position: "absolute", top: 40, left: 20, zIndex: 10 }}
      />
      <OriginalModal visible={isOpenModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={{
              width: "90%",
              alignItems: "center",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <View></View>
            {requestInfo && (
              <>
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#ccc",
                    alignItems: "center",
                    justifyContent: "space-around",
                    paddingVertical: 50,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>
                    {requestInfo.startAddr.split(",", 1)[0].toUpperCase()}
                  </Text>
                  <Text style={{ fontSize: 18 }}>{requestInfo.startAddr}</Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "#b1a8a8",
                    alignItems: "center",
                    justifyContent: "space-around",
                    paddingVertical: 50,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>
                    {requestInfo.endAddr.split(",", 1)[0].toUpperCase()}
                  </Text>
                  <Text style={{ fontSize: 18 }}>{requestInfo.endAddr}</Text>
                </View>
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              bottom: 20,
              width: "90%",
              zIndex: 11,
            }}
          >
            <ButtonModal onPress={denyHandler} bgColor="#ecdfdf" width="25%">
              <Ionicons name="close" size={24} />
            </ButtonModal>
            <ButtonModal
              onPress={onAcceptRequestHandler}
              bgColor="#09c009"
              width="70%"
            >
              <Text style={{ color: "white" }}>
                ĐỒNG Ý NHẬN CUỐC ({countDown})
              </Text>
            </ButtonModal>
          </View>
        </View>
      </OriginalModal>
      <InfoModal region={region} visible={!currentLocation}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <ActivityIndicator />
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              padding: 8,
              fontSize: 16,
            }}
          >
            Đang tìm vị trí của bạn
          </Text>
        </View>
      </InfoModal>
      <Map mapRef={mapRef} region={region}></Map>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1daf",
  },
  map: {
    width: "100%",
    height: 100,
    overflow: "hidden",
    borderRadius: 20,
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00BCD4",
    height: 300,
    width: "80%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    // marginTop: 80,
    marginLeft: 40,
  },
  textInput: {
    backgroundColor: "#e4d0ff",
    paddingLeft: 16,
    paddingVertical: 10,
    height: 40,
    fontSize: 15,
    flex: 1,
  },

  search: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#311b6b",
  },
});
