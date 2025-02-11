"use client";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import { Dispatch, SetStateAction, use } from "react";
import L from "leaflet";
import { useAddressStore } from "@/store";

const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/64/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// interface Props {
//   position: [number, number];
//   setPosition: Dispatch<SetStateAction<[number, number]>>;
// }
export default function MapsLeaflet() {
  const userAddress = useAddressStore((state) => state.address);
  const setAddress = useAddressStore((state) => state.setAddress);
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setAddress({
          ...userAddress,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });

    return (
      <Marker
        position={[userAddress.lat, userAddress.lng]}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            setAddress({
              ...userAddress,
              lat: e.target._latlng.lat,
              lng: e.target._latlng.lng,
            });
          },
        }}
      >
        <Popup>
          Coordenadas: <br />
          Lat: {userAddress.lat} <br />
          Lng: {userAddress.lng}
        </Popup>
      </Marker>
    );
  }

  return (
    <MapContainer
      center={[userAddress.lat, userAddress.lng]}
      zoom={18}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
