import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PropTypes from "prop-types";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import * as mgrs from "mgrs";
import axios from "axios";
import { message } from "antd";
import { Room as RoomIcon } from "@mui/icons-material";
import { renderToStaticMarkup } from "react-dom/server";

// const createCustomIcon = (icon) => {
//   const customMarkerHtml = renderToStaticMarkup(icon);

//   return L.divIcon({
//     html: customMarkerHtml,
//     iconSize: [35, 57],
//     iconAnchor: [17, 57],
//     popupAnchor: [1, -34],
//     shadowSize: [57, 57],
//     // className: 'custom-icon-unknown' // Optional custom class for additional styling
//   });
// };

const createCustomIcon = (icon, shadow) => {
  const iconHtml = renderToStaticMarkup(icon);
  const shadowHtml = renderToStaticMarkup(shadow);

  return L.divIcon({
    html: `<div class="custom-icon-container">${iconHtml}${shadowHtml}</div>`,
    iconSize: [40, 40], // Adjust size as needed
    iconAnchor: [20, 40], // Adjust anchor point as needed
    popupAnchor: [0, -40], // Adjust popup anchor as needed
    className: "", // You can use this to add additional custom class names for styling
  });
};

const iconComponent = <RoomIcon style={{ fontSize: "40px", color: "blue" }} />;
const iconComponent2 = (
  <RoomIcon style={{ fontSize: "40px", color: "green" }} />
);
const iconComponent3 = <RoomIcon style={{ fontSize: "40px", color: "red" }} />;
const shadowComponent = (
  <div
    style={{
      width: "30px",
      height: "10px",
      backgroundColor: "#999",
      filter: "blur(3px)",
      borderRadius: "50%",
      transform: "translate3d(4px, -12px, 0)",
    }}
  />
);

const customIcon = createCustomIcon(iconComponent, shadowComponent);
const customIconUp = createCustomIcon(iconComponent2, shadowComponent);
const customIconDown = createCustomIcon(iconComponent3, shadowComponent);

// // Define icons
// const smallIcon = new L.Icon({
//   iconUrl: markerIcon,
//   iconRetinaUrl: markerIcon2x,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const largeIcon = new L.Icon({
//   iconUrl: markerIcon,
//   iconRetinaUrl: markerIcon2x,
//   shadowUrl: markerShadow,
//   iconSize: [35, 57],
//   iconAnchor: [17, 57],
//   popupAnchor: [1, -34],
//   shadowSize: [57, 57],
// });

// ClickHandler component to handle map clicks
const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const MapView = ({
  searchContent,
  searchLocation,
  searchRakimL,
  searchRakimH,
  state,
  isRoleAdmin,
}) => {
  const [mevziler, setMevziler] = useState([]);
  const stateIntervalIds = useRef([]);
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

  const updateState = async (mevziId) => {
    try {
      const response = await axios.get(`/api/mevzi/update-state/${mevziId}`);
      setMevziler((prevMevziler) =>
        prevMevziler.map((mevzi) =>
          mevzi.id === mevziId
            ? { ...mevzi, state: response.data.state }
            : mevzi
        )
      );
    } catch (error) {
      console.error(
        `Durum güncellenirken hata alındı (Mevzi ID: ${mevziId}):`,
        error
      );
    }
  };

  const startOrUpdateInterval = (mevzi) => {
    const existingInterval = stateIntervalIds.current.find(
      (item) => item.mevziId === mevzi.id
    );

    if (existingInterval) {
      if (existingInterval.frequency !== mevzi.frequency) {
        clearInterval(existingInterval.intervalId);
        stateIntervalIds.current = stateIntervalIds.current.filter(
          (item) => item.mevziId !== mevzi.id
        );
      } else {
        return;
      }
    }

    const intervalTime = mevzi.frequency * 60000;

    const intervalId = setInterval(() => {
      updateState(mevzi.id);
    }, intervalTime);

    stateIntervalIds.current.push({
      mevziId: mevzi.id,
      intervalId: intervalId,
      frequency: mevzi.frequency,
    });
  };

  useEffect(() => {
    if (mevziler && mevziler.length > 0) {
      mevziler.forEach((mevzi) => {
        if (mevzi && mevzi.frequency) {
          startOrUpdateInterval(mevzi);
        }
      });
    }
  }, [mevziler]);

  const filterMevziler = (
    mevziler,
    state,
    searchLocation,
    searchRakimL,
    searchRakimH
  ) => {
    if (
      searchRakimL !== null &&
      searchRakimH !== null &&
      searchRakimL !== 0 &&
      searchRakimH !== 0 &&
      searchRakimL !== "" &&
      searchRakimH !== "" &&
      searchRakimL > searchRakimH
    ) {
      message.error("Alt Sınır üst sınırdan büyük olamaz");
      return mevziler;
    }

    return mevziler.filter((mevzi) => {
      // Filter by location type
      let locationMatch = true;
      if (searchLocation === "i") {
        locationMatch = mevzi.yurt_i === true;
      } else if (searchLocation === "d") {
        locationMatch = mevzi.yurt_i === false;
      }

      // Filter by rakim range
      const stateMapping = ["inaktif", "bilinmeyen", "aktif"];
      const stateKey = stateMapping[mevzi.state];
      const stateMatch = state[stateKey] === true;
      const lowerBound =
        searchRakimL !== null && searchRakimL !== 0 && searchRakimL !== ""
          ? searchRakimL
          : -Infinity;
      const upperBound =
        searchRakimH !== null && searchRakimH !== 0 && searchRakimH !== ""
          ? searchRakimH
          : Infinity;
      const rakimMatch = mevzi.rakim >= lowerBound && mevzi.rakim <= upperBound;

      return locationMatch && stateMatch && rakimMatch;
    });
  };

  const filteredMevziler = filterMevziler(
    mevziler,
    state,
    searchLocation,
    searchRakimL,
    searchRakimH
  );

  useEffect(() => {
    // console.log("Active States:", state);
    // console.log("Filtered Mevziler:", filteredMevziler);
  }, [filteredMevziler, state]);

  return (
    <MapContainer
      center={[38.9637, 35.2433]}
      zoom={7}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
    >
      <TileLayer url={process.env.REACT_APP_MAP_TILE_URL} />
      {filteredMevziler.map((mevzi, idx) => {
        if (mevzi.kordinat) {
          let long, lat;
          try {
            [long, lat] = mgrs.toPoint(mevzi.kordinat);
            return (
              <Marker
                key={idx}
                position={[lat, long]}
                icon={
                  mevzi.state === 1
                    ? customIcon
                    : mevzi.state === 0
                    ? customIconDown
                    : customIconUp
                }
              >
                <Popup>
                  Mevzi Adı: {mevzi.name} <br /> MGRS: {mevzi.kordinat} <br />
                  IP: {mevzi.ip} / Durum:{" "}
                  {mevzi.state === 2 ? (
                    <span style={{ color: "green" }}>Aktif</span>
                  ) : mevzi.state === 1 ? (
                    <span style={{ color: "blue" }}>Bilinmiyor</span>
                  ) : (
                    <span style={{ color: "red" }}>İnaktif</span>
                  )}{" "}
                  <br />
                  <a
                    href={`/mevzi/${mevzi.id}/bilgi`}
                    style={{ textDecoration: "underline" }}
                  >
                    Detaylar
                  </a>
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
  searchLocation: PropTypes.string,
  searchRakimL: PropTypes.number,
  searchRakimH: PropTypes.number,
  state: PropTypes.object.isRequired,
};

ClickHandler.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default MapView;
