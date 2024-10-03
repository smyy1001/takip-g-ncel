import React, { useEffect, useState } from "react";
import MapView from "../../components/MapView/MapView";
import Container from "@mui/material/Container";
import SearchFilterPanel from "../../components/SearchFilterPanel/SearchFilterPanel";
import MevziPanel from "../../components/MevziPanel/MevziPanel";
import SystemPanel from "../../components/SystemPanel/SystemPanel";
import "./home.css";

function Home({ isRoleAdmin, mevziler, fetchAllMevzi, systems, fetchSystems }) {
  const [isSystemPanelOpen, setIsSystemPanelOpen] = useState(false);
  const [isMevziPanelOpen, setIsMevziPanelOpen] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [searchLocation, setSearchLocation] = useState("a");
  const [searchRakimL, setSearchRakimL] = useState(null);
  const [searchRakimH, setSearchRakimH] = useState(null);
  const [state, setState] = useState({
    aktif: true,
    inaktif: true,
    bilinmeyen: true
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };


  // SYSTEM PANEL
  const toggleSystemPanel = () => {
    setIsSystemPanelOpen(!isSystemPanelOpen);
    setIsMevziPanelOpen(false);
  };

  // MEVZI PANEL
  const toggleMevziPanel = () => {
    setIsMevziPanelOpen(!isMevziPanelOpen);
    setIsSystemPanelOpen(false);
  };

  // USE EFFECTS
  useEffect(() => {
    fetchAllMevzi();
    fetchSystems();
  }, []);

  return (
    <Container className="home-main-container">
      <div className="home-content">
        <MapView
          mevziler={mevziler}
          searchContent={searchContent}
          searchLocation={searchLocation}
          searchRakimL={searchRakimL}
          searchRakimH={searchRakimH}
          state={state}
          isRoleAdmin={isRoleAdmin}
        />
        <SearchFilterPanel
          searchContent={searchContent}
          setSearchContent={setSearchContent}
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          searchRakimL={searchRakimL}
          setSearchRakimL={setSearchRakimL}
          searchRakimH={searchRakimH}
          setSearchRakimH={setSearchRakimH}
          state={state}
          handleChange={handleChange}
        />
        <SystemPanel
          systems={systems}
          fetchSystems={fetchSystems}
          isOpen={isSystemPanelOpen}
          togglePanel={toggleSystemPanel}
          isRoleAdmin={isRoleAdmin}
        />
        <MevziPanel
          mevziler={mevziler}
          fetchAllMevzi={fetchAllMevzi}
          isOpen={isMevziPanelOpen}
          togglePanel={toggleMevziPanel}
          isRoleAdmin={isRoleAdmin}
        />
      </div>
    </Container>
  );
}

export default Home;
