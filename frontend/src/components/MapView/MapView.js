import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@mui/material";
import PropTypes from "prop-types";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import * as mgrs from "mgrs";
import axios from "axios";
import { message } from "antd";

// Define icons
const smallIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const largeIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -34],
  shadowSize: [57, 57],
});

// ClickHandler component to handle map clicks
const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const MapView = ({ searchContent, isRoleAdmin }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const [mevziler, setMevziler] = useState([]);

  const fetchAllMevzi = async () => {
    if (searchContent !== "") {
      try {
        const response = await axios.get(`/api/mevzi/search/${searchContent}`);
        setMevziler(response.data);
      } catch (error) {
        message.error(error.response?.data?.detail || error.message);
      }
    } else {
      try {
        const response = await axios.get("/api/mevzi/all/");
        setMevziler(response.data);
      } catch (error) {
        message.error(error.response?.data?.detail || error.message);
      }
    }
  };

  useEffect(() => {
    fetchAllMevzi();
  }, [searchContent]);

  return (
    <MapContainer
      center={[38.9637, 35.2433]}
      zoom={7}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
    >
      <TileLayer url={process.env.REACT_APP_MAP_TILE_URL} />
      {mevziler.map((mevzi, idx) => {
        if (mevzi.kordinat) {
          let long, lat;
          try {
            [long, lat] = mgrs.toPoint(mevzi.kordinat);
            return (
              <Marker
                key={idx}
                position={[lat, long]}
                icon={activeMarker === idx ? largeIcon : smallIcon}
                onClick={() => setActiveMarker(idx)}
              >
                <Popup>
                  Mevzi Adı: {mevzi.name} <br /> İsmi: {mevzi.isim} <br />
                  MGRS: {mevzi.kordinat}
                  {/* Koordinatlar (X, Y): {lat.toFixed(3)}, {long.toFixed(3)} */}
                </Popup>
              </Marker>
            );
          } catch (error) {
            console.error("Invalid MGRS coordinate:", mevzi.kordinat);
            return null;
          }
        } else {
          return null;
        }
      })}
    </MapContainer>
  );
};

MapView.propTypes = {
  searchContent: PropTypes.string,
  isRoleAdmin: PropTypes.bool.isRequired,
  coordinates: PropTypes.object.isRequired,
  setCoordinates: PropTypes.func.isRequired,
};

ClickHandler.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default MapView;
