import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home/home";
import Systems from "./pages/Systems/Systems";
import Mevziler from "./pages/Mevziler/Mevziler";
import SystemEdit from "./pages/SystemEdit/SystemEdit";
import MevziEdit from "./pages/MevziEdit/MevziEdit";
import MalzemeEdit from "./pages/MalzemeEdit/MalzemeEdit";
import Malzemeler from "./pages/Malzemeler/Malzemeler";
import SystemAdd from "./pages/SystemAdd/SystemAdd";
import { useTheme } from "@mui/material/styles";
import "./index.css";
import AppBarComponent from "./components/AppBarComponent/AppBarComponent";
import Axios from "axios";
import { message } from "antd";
import MalzemeAdd from "./pages/MalzemeAdd/MalzemeAdd";
import MevziAdd from "./pages/MevziAdd/MevziAdd";
import PhotoGallery from "./pages/PhotoGallery/PhotoGallery";
import MevziAltYapi from "./pages/MevziAltYapi/MevziAltYapi";
import MevziIp from "./pages/MevziIp/MevziIp";

function App() {
  const theme = useTheme();
  const [mevziler, setMevziler] = useState([]);
  const [systems, setSystems] = useState([]);
  const [freeMalzemeler, setFreeMalzemeler] = useState([]);
  const [malzemeler, setMalzemeler] = useState([]);
  const [malzMatch, setMalzMatch] = useState([]);
  const isAdmin = process.env.REACT_APP_ROLE;
  let isRoleAdmin;

  if (isAdmin === "admin") {
    isRoleAdmin = true;
  } else {
    isRoleAdmin = false;
  }

  // FETCH ALL MEVZILER
  const fetchAllMevzi = async () => {
    try {
      const response = await Axios.get("/api/mevzi/all/");
      setMevziler(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  // FETCH ALL MALZ MATCH
  const fetchMalzMatch = async () => {
    try {
      const response = await Axios.get("/api/malzeme/malzmatches/get");
      setMalzMatch(response.data);
    } catch (error) {
      console.error(error.response?.data?.detail || error.message);
    }
  };

  // FETCH SYSTEMS
  const fetchSystems = async () => {
    try {
      const response = await Axios.get("/api/system/all/");
      const systemsData = response.data;
      // Fetch malzemeler for each system
      const systemsWithMalzemeler = await Promise.all(
        systemsData.map(async (system) => {
          const malzemeResponse = await Axios.get(
            `/api/malzeme/get/${system.id}`
          );
          return { ...system, malzemeler: malzemeResponse.data };
        })
      );
      setSystems(systemsWithMalzemeler);
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };

  // FETCH FREE MALZEME
  const fetchFreeMalzemeler = async () => {
    try {
      const response = await Axios.get("/api/malzeme/free/");
      setFreeMalzemeler(response.data);
    } catch (error) {
      console.error(error.response?.data?.detail || error.message);
    }
  };
  // FETCH ALL MALZEMELER
  const fetchMalzemeler = async () => {
    try {
      const response = await Axios.get("/api/malzeme/all/");
      setMalzemeler(response.data);
    } catch (error) {
      console.error(error.response?.data?.detail || error.message);
    }
  };

  useEffect(() => {
    if (theme.palette.mode === "dark") {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.add("dark-mode");
    }
  }, [theme.palette.mode]);

  return (
    <Router>
      <>
        <AppBarComponent isRoleAdmin={isRoleAdmin} />
        <Routes>
          <Route
            path="/home"
            element={
              <Home
                isRoleAdmin={isRoleAdmin}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
                systems={systems}
                fetchSystems={fetchSystems}
              />
            }
          />
          <Route
            path="/sistemler"
            element={
              <Systems
                isRoleAdmin={isRoleAdmin}
                initialSystems={systems}
                fetchSystems={fetchSystems}
              />
            }
          />
          <Route
            path="/sistemler/:id"
            element={
              <SystemEdit
                systems={systems}
                fetchSystems={fetchSystems}
                isRoleAdmin={isRoleAdmin}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
                freeMalzemeler={freeMalzemeler}
                fetchFreeMalzemeler={fetchFreeMalzemeler}
                malzemeler={malzemeler}
                fetchMalzemeler={fetchMalzemeler}
              />
            }
          />
          <Route
            path="/mevziler"
            element={
              <Mevziler
                isRoleAdmin={isRoleAdmin}
                initialMevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
              />
            }
          />
          <Route
            path="/mevziler/:id"
            element={
              <MevziEdit
                isRoleAdmin={isRoleAdmin}
                systems={systems}
                fetchSystems={fetchSystems}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
              />
            }
          />
          <Route
            path="/mevziler/:id/altyapi"
            element={
              <MevziAltYapi
                isRoleAdmin={isRoleAdmin}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
              />
            }
          />
          <Route
            path="/mevziler/:id/ip"
            element={
              <MevziIp
                isRoleAdmin={isRoleAdmin}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
                malzMatch={malzMatch}
                fetchMalzMatch={fetchMalzMatch}
              />
            }
          />
          <Route
            path="/malzemeler"
            element={
              <Malzemeler
                isRoleAdmin={isRoleAdmin}
                initialMalzemeler={malzemeler}
                fetchMalzemeler={fetchMalzemeler}
              />
            }
          />
          <Route
            path="/malzemeler/:id"
            element={
              <MalzemeEdit
                isRoleAdmin={isRoleAdmin}
                malzemeler={malzemeler}
                fetchMalzemeler={fetchMalzemeler}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
                freeMalzemeler={freeMalzemeler}
                fetchFreeMalzemeler={fetchFreeMalzemeler}
                fetchSystems={fetchSystems}
                systems={systems}
              />
            }
          />
          <Route
            path="/sistem-ekle"
            element={
              <SystemAdd
                isRoleAdmin={isRoleAdmin}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
                freeMalzemeler={freeMalzemeler}
                fetchFreeMalzemeler={fetchFreeMalzemeler}
                malzemeler={malzemeler}
                fetchMalzemeler={fetchMalzemeler}
              />
            }
          />
          <Route
            path="/malzeme-ekle"
            element={
              <MalzemeAdd
                isRoleAdmin={isRoleAdmin}
                mevziler={mevziler}
                fetchAllMevzi={fetchAllMevzi}
                freeMalzemeler={freeMalzemeler}
                fetchFreeMalzemeler={fetchFreeMalzemeler}
                systems={systems}
                fetchSystems={fetchSystems}
                malzemeler={malzemeler}
                fetchMalzemeler={fetchMalzemeler}
              />
            }
          />
          <Route
            path="/mevzi-ekle"
            element={<MevziAdd isRoleAdmin={isRoleAdmin} systems={systems}
              fetchSystems={fetchSystems} />}
          />
          <Route
            path="/:sis-malz-mev/gallery/:name"
            element={
              <PhotoGallery
                isRoleAdmin={isRoleAdmin}
              />
            }
          />

        </Routes>
      </>
    </Router>
  );
}

export default App;
