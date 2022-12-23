import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

import "./App.css";
export default function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
      ? process.env.REACT_APP_GOOGLE_MAP_API_KEY
      : "",
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <AppRun />;
}
const containerStyle = {
  height: "100vh",
  width: "90%",
};

type currentLocation = {
  lng: number;
  lat: number;
};

interface accessPointType {
  ssid: string;
  pos: { lat: number; lng: number };
  address: string;
}

type dataType = {
  ID: [any, { 識別値: string }];
  設置地点: {
    地理座標: {
      緯度: number;
      経度: number;
    };
    住所: {
      表記: string;
    };
  };
};

interface selectType {
  pos: { lat: number; lng: number };
  address: string;
}

function AppRun() {
  const [wifiPlaces, setWifiPlaces] = useState<accessPointType[]>([]);
  const accessPoints: accessPointType[] = [];
  const [selectedMarker, setSelectedMarker] = useState<
    selectType | null | accessPointType
  >(null);
  const [currentPlace, setCurrentPlace] = useState<currentLocation>();

  const [myMap, setMyMap] = useState<google.maps.Map>();

  const getApi = async () => {
    const response = await fetch(
      "https://api.data.metro.tokyo.lg.jp/v1/WifiAccessPoint?limit=100",
      {
        method: "GET",

        headers: {
          "cache-control": "private",
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    const openData = await response.json();

    openData[0].map((item: dataType) =>
      accessPoints.push({
        ssid: item["ID"][1]["識別値"],
        pos: {
          lat: Number(item["設置地点"]["地理座標"]["緯度"]),
          lng: Number(item["設置地点"]["地理座標"]["経度"]),
        },
        address: item["設置地点"]["住所"]["表記"],
      })
    );
    setWifiPlaces(accessPoints);
  };

  useEffect(() => {
    getApi();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function success(position: any) {
        setCurrentPlace({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function error() {
        setCurrentPlace({
          lat: 35.6809591,
          lng: 139.7673068,
        });
      }
    );
  }, []);

  return (
    <div className="App">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPlace}
        zoom={17}
        onLoad={(map: google.maps.Map) => setMyMap(map)}
      >
        {wifiPlaces.map((item: accessPointType, i) => (
          <div key={i}>
            <MarkerF
              position={item.pos}
              onClick={() => {
                setSelectedMarker(item);
              }}
            />
            {selectedMarker && (
              <InfoWindow position={selectedMarker.pos}>
                <div>
                  <h1>{selectedMarker.address}</h1>
                  <button onClick={() => setSelectedMarker(null)}>close</button>
                </div>
              </InfoWindow>
            )}
          </div>
        ))}
      </GoogleMap>
      {/* <button onClick={() => map.panTo({ lat: userLat, lng userLong })}> */}
      <button onClick={() => myMap?.panTo(currentPlace!)}>現在地に戻る</button>
    </div>
  );
}
