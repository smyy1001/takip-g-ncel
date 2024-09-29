import React, { useState, useEffect, useRef } from "react";
import { createRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Box,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import { message } from "antd";
import "./SystemEdit.css";
import SystemAdd from "../SystemAdd/SystemAdd";

function SystemEdit({
  systems,
  fetchSystems,
  isRoleAdmin,
  mevziler,
  fetchAllMevzi,
  freeMalzemeler,
  fetchFreeMalzemeler,
  malzemeler,
  fetchMalzemeler,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  const [openSystem, setOpenSystem] = useState({});
  const [system, setSystem] = useState(null);
  const [systemMalzemeler, setSystemMalzemeler] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);

  useEffect(() => {
    itemRefs.current = systems.map(
      (_, index) => itemRefs.current[index] ?? createRef()
    );
  }, [systems]);

  useEffect(() => {
    const fetchCurrentSystem = async () => {
      try {
        const response = await axios.get(`/api/system/get/${id}`);

        setSystem(response.data);

        const malzemeResponse = await axios.get(`/api/malzeme/get/${id}`);
        setSystemMalzemeler(malzemeResponse.data); // Değişiklik burada
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCurrentSystem();
    fetchSystems();
  }, [id]);

  useEffect(() => {
    const fetchedSystem = systems.find((system) => system.id === id);
    if (fetchedSystem) {
      setSelectedSystem(fetchedSystem);
    }
  }, [id, systems]);

  const toggleSystemOpen = (id, event) => {
    event.stopPropagation();
    setOpenSystem((prevOpenSystem) => ({
      ...prevOpenSystem,
      [id]: !prevOpenSystem[id],
    }));
  };

  const handleDeleteSystemClick = async (systemId, event) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(`/api/system/delete/${systemId}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Sistem silindi!");
        fetchSystems();
      } else {
        message.error("Sistem silinemedi'");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleEditMalzemeClick = (malzeme) => {
    navigate(`/malzemeler/${malzeme.id}`);
  };

  const handleEditSystemClick = (system) => {
    setSelectedSystem(system);
    navigate(`/sistemler/${system.id}`);
  };

  const handleToSystems = () => {
    navigate(`/sistemler`);
  };

  return (
    <Container className="system-edit-container">
      <div className="system-edit-main-div-class">
        <div className="system-edit-left-div">
          <Tooltip
            title="Tabular Görünüm"
            style={{ cursor: "pointer" }}
            onClick={() => handleToSystems()}
          >
            <Typography
              component="span"
              sx={{
                fontSize: "1.5rem",
                color: "white",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "35px",
              }}
            >
              SİSTEMLER
            </Typography>
          </Tooltip>

          <div className="system-edit-scroll">
            {systems.length > 0 ? (
              systems.map((sys, index) => (
                <div
                  key={sys.id}
                  className={`sys-edit-all-list ${
                    sys.id === id ? "chosen" : ""
                  }`}
                >
                  <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem
                          disablePadding
                          ref={itemRefs.current[index]}
                          secondaryAction={
                            isRoleAdmin && (
                              <Tooltip title="Sil">
                                <IconButton
                                  edge="end"
                                  onClick={(event) =>
                                    handleDeleteSystemClick(sys.id, event)
                                  }
                                  aria-label="delete"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            )
                          }
                        >
                          <ListItemButton
                            className={`system-edit-list-item ${
                              sys.id === id ? "chosen" : ""
                            }`}
                            onClick={() => handleEditSystemClick(sys)}
                          >
                            <ListItemText
                              sx={{
                                ".MuiListItemText-primary": {
                                  fontSize: "1.3rem",
                                  color: "white",
                                  fontWeight: "bold",
                                },
                              }}
                              primary={sys.name}
                            />
                            {sys.malzemeler && sys.malzemeler.length > 0 && (
                              <Tooltip title="Sistemdeki Malzemeler">
                                {openSystem[sys.id] ? (
                                  <ExpandLess
                                    onClick={(e) => toggleSystemOpen(sys.id, e)}
                                  />
                                ) : (
                                  <ExpandMore
                                    onClick={(e) => toggleSystemOpen(sys.id, e)}
                                  />
                                )}
                              </Tooltip>
                            )}
                          </ListItemButton>
                        </ListItem>
                        <Collapse
                          in={openSystem[sys.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {sys.malzemeler?.map((malzeme, index) => (
                              <>
                                <ListItem
                                  key={index}
                                  className="sys-edit-sub-malz-list-class"
                                  sx={{ pl: 4 }}
                                  onClick={() =>
                                    handleEditMalzemeClick(malzeme)
                                  }
                                >
                                  <ListItemText
                                    primary={malzeme.name}
                                    secondary={`Seri No: ${malzeme.seri_num}`}
                                    sx={{
                                      ".MuiListItemText-primary": {
                                        fontSize: "1rem",
                                        color: "white",
                                        fontWeight: "bold",
                                      },
                                    }}
                                  />
                                </ListItem>
                                {index < sys.malzemeler.length - 1 && (
                                  <Divider
                                    variant="inset"
                                    sx={{ marginLeft: 4 }}
                                  />
                                )}
                              </>
                            ))}
                          </List>
                        </Collapse>
                      </List>
                    </Grid>
                  </Box>
                </div>
              ))
            ) : (
              <Typography className="sys-edit-empty-message">
                Görüntülenecek Sistem bulunmamaktadır.
              </Typography>
            )}
          </div>
        </div>
        <div className="system-edit-right-div">
          {selectedSystem && (
            <SystemAdd
              system={selectedSystem}
              fetchSystems={fetchSystems}
              isRoleAdmin={isRoleAdmin}
              mevziler={mevziler}
              fetchAllMevzi={fetchAllMevzi}
              freeMalzemeler={freeMalzemeler}
              fetchFreeMalzemeler={fetchFreeMalzemeler}
              malzemeler={malzemeler}
              fetchMalzemeler={fetchMalzemeler}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

export default SystemEdit;
