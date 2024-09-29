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
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { message } from "antd";
import "./MalzemeEdit.css";
import MalzemeAdd from "../MalzemeAdd/MalzemeAdd";

function MalzemeEdit({
  malzemeler,
  fetchMalzemeler,
  isRoleAdmin,
  mevziler,
  fetchAllMevzi,
  freeMalzemeler,
  fetchFreeMalzemeler,
  fetchSystems,
  systems,
}) {
  const { id } = useParams(); // URL'den id alıyoruz
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  const [openMalzeme, setOpenMalzeme] = useState({});
  const [malzeme, setMalzeme] = useState(null);
  const [selectedMalzeme, setSelectedMalzeme] = useState(null);

  // Refs'i güncellemek için
  useEffect(() => {
    itemRefs.current = malzemeler.map(
      (_, index) => itemRefs.current[index] ?? createRef()
    );
  }, [malzemeler]);

  // Mevcut malzeme bilgisini çekiyoruz
  useEffect(() => {
    const fetchCurrentMalzeme = async () => {
      try {
        const response = await axios.get(`/api/malzeme/get/${id}`);
        setMalzeme(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCurrentMalzeme();
    fetchMalzemeler();
  }, [id]);

  useEffect(() => {
    const fetchedMalzeme = malzemeler.find((malzeme) => malzeme.id === id);
    if (fetchedMalzeme) {
      setSelectedMalzeme(fetchedMalzeme);
    }
  }, [id, malzemeler]);

  // Listeden tıklanan malzemenin detaylarını sağ tarafta göstermek için
  const handleEditMalzemeClick = (malzeme) => {
    setSelectedMalzeme(malzeme);
    navigate(`/malzemeler/${malzeme.id}`);
  };

  const handleDeleteMalzemeClick = async (malzemeId, event) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(`/api/malzeme/delete/${malzemeId}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Malzeme silindi!");
        fetchMalzemeler();
      } else {
        message.error("Malzeme silinemedi'");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleToMalzmeler = () => {
    navigate("/malzemeler");
  };

  return (
    <Container className="malzeme-edit-container">
      <div className="malzeme-edit-main-div-class">
        <div className="malzeme-edit-left-div">
          <Tooltip
            title="Tabular Görünüm"
            style={{ cursor: "pointer" }}
            onClick={() => handleToMalzmeler()}
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
              MALZEMELER
            </Typography>
          </Tooltip>
          <div className="malzeme-edit-scroll">
            {malzemeler.length > 0 ? (
              malzemeler.map((malz, index) => (
                <div
                  key={malz.id}
                  className={`malz-edit-all-list ${
                    malz.id === id ? "chosen" : ""
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
                                    handleDeleteMalzemeClick(malz.id, event)
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
                            className={`malzeme-edit-list-item ${
                              malz.id === id ? "chosen" : ""
                            }`}
                            onClick={() => handleEditMalzemeClick(malz)}
                          >
                            <ListItemText
                              sx={{
                                ".MuiListItemText-primary": {
                                  fontSize: "1.3rem",
                                  color: "white",
                                  fontWeight: "bold",
                                },
                              }}
                              primary={malz.name}
                            />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </Grid>
                  </Box>
                </div>
              ))
            ) : (
              <Typography className="malz-edit-empty-message">
                Görüntülenecek Malzeme bulunmamaktadır.
              </Typography>
            )}
          </div>
        </div>
        <div className="malzeme-edit-right-div">
          {selectedMalzeme && (
            <MalzemeAdd
              malzeme={selectedMalzeme}
              fetchMalzemeler={fetchMalzemeler}
              isRoleAdmin={isRoleAdmin}
              mevziler={mevziler}
              fetchAllMevzi={fetchAllMevzi}
              freeMalzemeler={freeMalzemeler}
              fetchFreeMalzemeler={fetchFreeMalzemeler}
              fetchSystems={fetchSystems}
              systems={systems}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

export default MalzemeEdit;
