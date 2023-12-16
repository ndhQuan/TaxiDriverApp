export function calculateInitialRegion(coords) {
  let minLat = coords[0][0];
  let maxLat = coords[0][0];
  let minLng = coords[0][1];
  let maxLng = coords[0][1];

  coords.forEach((item) => {
    if (item[0] < minLat) {
      // minLat = coordinate.latitude;
      minLat = item[0];
    }
    if (item[0] > maxLat) {
      // maxLat = coordinate.latitude;
      maxLat = item[0];
    }
    if (item[1] < minLng) {
      // minLng = coordinate.longitude;
      minLng = item[1];
    }
    if (item[1] > maxLng) {
      // maxLng = coordinate.longitude;
      maxLng = item[1];
    }
  });

  let padding = 0.1;
  let latDelta = (maxLat - minLat) * (1 + padding);
  let lonDelta = (maxLng - minLng) * (1 + padding);

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  let region = {
    latitude,
    longitude,
    latitudeDelta: latDelta,
    longitudeDelta: lonDelta,
  };
  return region;
}

export function convertToPolylineFormat(points) {
  return points.map((point, index) => {
    return {
      latitude: point[0],
      longitude: point[1],
    };
  });
}

export function getFormatedNow() {
  const now = new Date();
  let hours = now.getHours() > 9 ? now.getHours() : `0${now.getHours()}`;
  let minutes =
    now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes()}`;
  let seconds =
    now.getSeconds() > 9 ? now.getSeconds() : `0${now.getSeconds()}`;
  let miliseconds =
    now.getMilliseconds() > 9
      ? now.getMilliseconds()
      : `0${now.getMilliseconds()}`;

  return `${hours}:${minutes}:${seconds}.${miliseconds}`;
}
