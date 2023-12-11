import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import ButtonModal from "../components/ButtonModal";
import {
  calculateInitialRegion,
  convertToPolylineFormat,
} from "../utils/helper";
import { Polyline, Marker } from "react-native-maps";
import { getDirections } from "../api/GoogleMap";
import Map from "../components/Map";
import { Ionicons } from "@expo/vector-icons";
import ButtonIcon from "../components/UI/ButtonIcon";

export default function TripProcessing({ route }) {
  const startLat = route.params.startLat;
  const startLng = route.params.startLng;
  const endLat = route.params.endLat;
  const endLng = route.params.endLng;
  const curLat = route.params.curLat;
  const curLng = route.params.curLng;

  const [pickedUpCustomer, setPickedUpCustomer] = useState(false);
  const [coords, setCoords] = useState([]);
  const [iniRegion, setIniRegion] = useState({
    latitude: curLat,
    longitude: curLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  // const [polyCoords, setPolyCoords] = useState({
  //   startCoord: `${curLat},${curLng}`,
  //   endCoord: `${startLat},${startLng}`,
  // });
  const [polyCoords, setPolyCoords] = useState([
    [10.82884, 106.66659],
    [10.82903, 106.6663],
    [10.82904, 106.6663],
    [10.82936, 106.66651],
    [10.82949, 106.66636],
    [10.82957, 106.66626],
    [10.82959, 106.66627],
    [10.82976, 106.66636],
    [10.83, 106.66647],
    [10.83025, 106.66658],
    [10.83038, 106.66664],
    [10.83026, 106.66688],
    [10.8302, 106.66697],
    [10.83017, 106.66706],
    [10.83017, 106.6671],
    [10.83032, 106.66721],
    [10.83027, 106.66729],
    [10.83025, 106.66739],
    [10.83023, 106.66752],
    [10.83006, 106.66779],
    [10.83006, 106.66781],
    [10.8301, 106.66785],
    [10.83039, 106.66807],
    [10.83045, 106.66813],
    [10.83097, 106.66858],
    [10.83122, 106.6688],
    [10.83121, 106.66882],
    [10.83091, 106.66918],
    [10.83046, 106.66975],
    [10.83019, 106.67011],
    [10.83013, 106.67023],
    [10.82964, 106.67118],
    [10.82912, 106.67223],
    [10.82893, 106.6727],
    [10.82875, 106.67325],
    [10.82867, 106.67344],
    [10.8283, 106.67446],
    [10.82807, 106.67509],
    [10.82782, 106.67584],
    [10.82752, 106.67681],
    [10.8273, 106.67737],
    [10.82697, 106.67841],
    [10.82674, 106.67905],
    [10.82646, 106.67984],
    [10.82642, 106.67996],
    [10.82615, 106.67995],
    [10.82589, 106.67987],
    [10.82545, 106.67969],
  ]);

  console.log(curLat);

  useEffect(() => {
    console.log("poly");
    // function getPolyline() {
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

  function onPickupHandler() {
    // setPolyCoords({
    //   startCoord: `${startLat},${startLng}`,
    //   endCoord: `${endLat},${endLng}`,
    // });
    setPickedUpCustomer(true);
  }

  function onFinishHandler() {}

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text>NƠI ĐẾN</Text>
      </View>
      {!pickedUpCustomer ? (
        <Map fl={{ flex: 2 }} region={iniRegion}>
          <Marker
            coordinate={{
              latitude: startLat,
              longitude: startLng,
            }}
          />
          <Polyline coordinates={coords} />
        </Map>
      ) : (
        <Map fl={{ flex: 2 }} region={iniRegion}>
          <Marker
            coordinate={{
              latitude: endLat,
              longitude: endLng,
            }}
          />
          <Polyline coordinates={coords} />
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
