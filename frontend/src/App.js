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
import SystemBilgi from "./pages/SystemBilgi/SystemBilgi";
import MalzemeBilgi from "./pages/MalzemeBilgi/MalzemeBilgi";
import MevziBilgi from "./pages/MevziBilgi/MevziBilgi";
import MevziEdit from "./pages/MevziEdit/MevziEdit";
import MalzemeEdit from "./pages/MalzemeEdit/MalzemeEdit";
import Malzemeler from "./pages/Malzemeler/Malzemeler";
import SystemAdd from "./pages/SystemAdd/SystemAdd";
import { useTheme } from "@mui/material/styles";
import "./index.css";
import AppBarComponent from "./components/AppBarComponent/AppBarComponent";
import axios from "axios";
import { message } from "antd";
import MalzemeAdd from "./pages/MalzemeAdd/MalzemeAdd";
import MevziAdd from "./pages/MevziAdd/MevziAdd";
import PhotoGallery from "./pages/PhotoGallery/PhotoGallery";
import MevziAltYapi from "./pages/MevziAltYapi/MevziAltYapi";
import { useAuth } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {
  const theme = useTheme();
  useEffect(() => {
    if (theme.palette.mode === "dark") {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.add("dark-mode");
    }
  }, [theme.palette.mode]);
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const [mevziler, setMevziler] = useState([]);
  const [systems, setSystems] = useState([]);
  const [freeMalzemeler, setFreeMalzemeler] = useState([]);
  const [malzemeler, setMalzemeler] = useState([]);
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  let isRoleAdmin;
  if (isAdmin) {
    isRoleAdmin = true;
  } else {
    isRoleAdmin = false;
  }

  // FETCH ALL MEVZILER
  const fetchAllMevzi = async () => {
    try {
      const response = await axios.get("/api/mevzi/all/");
      setMevziler(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  // FETCH SYSTEMS
  const fetchSystems = async () => {
    try {
      const response = await axios.get("/api/system/all/");
      const systemsData = response.data;
      // Fetch malzemeler for each system
      const systemsWithMalzemeler = await Promise.all(
        systemsData.map(async (system) => {
          const malzemeResponse = await axios.get(
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
      const response = await axios.get("/api/malzeme/free/");
      setFreeMalzemeler(response.data);
    } catch (error) {
      console.error(error.response?.data?.detail || error.message);
    }
  };
  // FETCH ALL MALZEMELER
  const fetchMalzemeler = async () => {
    try {
      const response = await axios.get("/api/malzeme/all/");
      setMalzemeler(response.data);
    } catch (error) {
      console.error(error.response?.data?.detail || error.message);
    }
  };

  return (
    <>
      <AppBarComponent isRoleAdmin={isRoleAdmin} />
      <Routes>
        <Route element={<PrivateRoute />}>
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
            path="/"
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
            path="/sistem/:id/bilgi"
            element={<SystemBilgi isRoleAdmin={isRoleAdmin} />}
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
            path="/mevzi/:id/bilgi"
            element={<MevziBilgi isRoleAdmin={isRoleAdmin} />}
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
            path="/malzeme/:id/bilgi"
            element={<MalzemeBilgi isRoleAdmin={isRoleAdmin} />}
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
            element={
              <MevziAdd
                isRoleAdmin={isRoleAdmin}
                systems={systems}
                fetchSystems={fetchSystems}
                fetchAllMevzi={fetchAllMevzi}
                mevziler={mevziler}
              />
            }
          />
          <Route
            path="/:sis-malz-mev/gallery/:name"
            element={<PhotoGallery isRoleAdmin={isRoleAdmin} />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
