import { useEffect, useState, useRef, useLayoutEffect } from "react";
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
import { calculateInitialRegion } from "../utils/helper";

import InfoModal from "../components/InfoModal";
import ButtonModal from "../components/ButtonModal";
import Map from "../components/Map";
import * as signalR from "@microsoft/signalr";
import { BASEAPI_URL } from "../utils/constant";

const connection = new signalR.HubConnectionBuilder()
  .withAutomaticReconnect()
  .withUrl(`${BASEAPI_URL}/hubs/journey`)
  .configureLogging(signalR.LogLevel.Information)
  .build();

function TripProcessing({
  pickedUpCustomer,
  requestInfo,
  finishTrip,
  onPickupHandler,
  coords,
  iniRegion,
}) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text>NƠI ĐẾN</Text>
      </View>
      {pickedUpCustomer ? (
        <Map fl={{ flex: 2 }} region={iniRegion}>
          <Marker
            coordinate={{
              latitude: requestInfo.startLat,
              longitude: requestInfo.startLng,
            }}
          />
          <Polyline coordinates={coords} />
        </Map>
      ) : (
        <Map fl={{ flex: 2 }} region={iniRegion}>
          <Polyline coordinates={coords} />
        </Map>
      )}

      <View style={{ flex: 1 }}>
        <View></View>
        <View>
          {!pickedUpCustomer ? (
            <ButtonModal onPress={onPickupHandler} bgColor="#09c009">
              <Text style={{ color: "white" }}>ĐÓN KHÁCH</Text>
            </ButtonModal>
          ) : (
            <ButtonModal onPress={finishTrip} bgColor="#09c009">
              <Text style={{ color: "white" }}>KHÁCH XUỐNG XE</Text>
            </ButtonModal>
          )}
        </View>
      </View>
    </View>
  );
}

export default function GetLocation({ navigation }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  // const [coords, setCoords] = useState([]);
  const [requestInfo, setRequestInfo] = useState({
    startLat: 10.82884,
    startLng: 106.66659,
    endLat: 10.82545,
    endLng: 106.67969,
  });
  const [acceptBooking, setAcceptBooking] = useState(false);
  // const [pickedUpCustomer, setPickedUpCustomer] = useState(false);
  // const [iniRegion, setIniRegion] = useState();

  const mapRef = useRef(null);
  const polyCoords = useRef();
  // const [placeIdStart, setPlaceIdStart] = useState(
  //   "ChIJ2U3J2QUpdTER8vO_6Unx4Fk"
  // );
  // const [placeIdEnd, setPlaceIdEnd] = useState("ChIJkdCR-fwodTER-jQabj62D3M");
  // const [permission, setPermission] = useState(true);

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

  async function onAcceptRequestHandler() {
    setAcceptBooking(true);
    setIsOpenModal(false);
    navigation.navigate("TripProcessing", {
      ...requestInfo,
      curLat: currentLocation.lat,
      curLng: currentLocation.lng,
    });
  }

  function finishTrip() {
    setAcceptBooking(false);
    setPickedUpCustomer(false);
  }

  useLayoutEffect(() => {
    async function getCurrentCoord() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.High,
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
    const setModal = setTimeout(() => {
      setIsOpenModal(true);
    }, 3000);
    return () => clearTimeout(setModal);
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

  // useEffect(() => {
  //   connection.on(
  //     "ReceiveRequestInfo",
  //     function (
  //       id,
  //       name,
  //       phoneNumber,
  //       starAddr,
  //       startLat,
  //       startLng,
  //       endAddr,
  //       endLat,
  //       endLng
  //     ) {
  //       setRequestInfo({
  //         id,
  //         name,
  //         phoneNumber,
  //         starAddr,
  //         startLat,
  //         startLng,
  //         endAddr,
  //         endLat,
  //         endLng,
  //       });
  //       setIsOpenModal(true);
  //     }
  //   );

  //   connection.start().then(console.log("Successful connection"));
  //   return () => connection.stop();
  // }, [setRequestInfo, setIsOpenModal]);

  // useEffect(() => {
  //   let sendCoordInterval = null;
  //   if (acceptBooking) {
  //     connection.send("SendDriverInfo", requestInfo.id);
  //     sendCoordInterval = setInterval(async () => {
  //       let location = await Location.getCurrentPositionAsync({
  //         enableHighAccuracy: true,
  //         accuracy: Location.Accuracy.High,
  //       });
  //       connection.send(
  //         "SendRealTimeDriverCoords",
  //         requestInfo.id,
  //         location.coords.latitude,
  //         location.coords.longitude
  //       );
  //     }, 3000);
  //   } else {
  //     stopSendCoords();
  //   }

  //   function stopSendCoords() {
  //     if (sendCoordInterval) clearInterval(sendCoordInterval);
  //   }
  // }, [acceptBooking]);

  console.log(currentLocation, "picked");

  // if (acceptBooking) {
  //   return (
  //     <TripProcessing
  //       pickedUpCustomer={pickedUpCustomer}
  //       setAcceptBooking={setAcceptBooking}
  //       requestInfo={requestInfo}
  //       finishTrip={finishTrip}
  //       currentLocation={currentLocation}
  //       onPickupHandler={onPickupHandler}
  //       coords={polyCoords.current}
  //       iniRegion={iniRegion}
  //     />
  //   );
  // }
  return (
    <PaperProvider>
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
            <View
              style={{
                width: "100%",
                backgroundColor: "#ccc",
                alignItems: "center",
                justifyContent: "space-around",
                paddingVertical: 50,
              }}
            >
              <Text style={{ fontSize: 24 }}>ĐIỂM ĐÓN</Text>
              <Text style={{ fontSize: 18 }}>
                full address jbmnbmbhkhbnkhgkb 124537fghfhg
              </Text>
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
              <Text style={{ fontSize: 24 }}>ĐIỂM ĐẾN</Text>
              <Text style={{ fontSize: 18 }}>full address</Text>
            </View>
          </View>
          <ButtonModal onPress={onAcceptRequestHandler} bgColor="#09c009">
            <Text style={{ color: "white" }}>ĐỒNG Ý NHẬN CUỐC ((TIME))</Text>
          </ButtonModal>
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
