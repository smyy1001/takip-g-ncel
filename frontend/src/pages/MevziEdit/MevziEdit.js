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
import { message } from "antd";
import "./MevziEdit.css";
import MevziAdd from "../MevziAdd/MevziAdd";
import GetAppIcon from "@mui/icons-material/GetApp";

function MevziEdit({
  isRoleAdmin,
  systems,
  fetchSystems,
  mevziler,
  fetchAllMevzi,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const itemRefs = useRef([]);

  const [selectedMevzi, setSelectedMevzi] = useState(null);

  useEffect(() => {
    itemRefs.current = mevziler.map(
      (_, index) => itemRefs.current[index] ?? createRef()
    );
  }, [mevziler]);

  useEffect(() => {
    fetchAllMevzi();
  }, [id]);
  useEffect(() => {
    const currentMevzi = mevziler.find((mevzi) => mevzi.id === id);
    if (currentMevzi) {
      setSelectedMevzi(currentMevzi);
    }
  }, [id, mevziler]);

  useEffect(() => {
    if (mevziler.length > 0 && id) {
      const index = mevziler.findIndex((mevzi) => mevzi.id === id);
      const ref = itemRefs.current[index];

      if (ref && ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        console.error("Ref not found or not attached to a DOM element");
      }
    }
  }, [mevziler, id]);

  const handleDeleteMevziClick = async (mevziId, event) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(`/api/mevzi/delete/${mevziId}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Mevzi silindi!");
        fetchAllMevzi();
      } else {
        message.error("Mevzi silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleEditMevziClick = (mevzi) => {
    setSelectedMevzi(mevzi);
    navigate(`/mevziler/${mevzi.id}`);
  };

  const handleToMevziler = () => {
    navigate(`/mevziler`);
  };

  const handleExportMevziClick = async (mevzi) => {
    try {
      const response = await axios({
        url: `/api/mevzi/export/${mevzi.id}`,
        method: "POST",
        responseType: "blob",
      });

      const date = new Date();
      const formattedTimestamp = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}_${date
        .getHours()
        .toString()
        .padStart(2, "0")}-${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}-${date.getSeconds().toString().padStart(2, "0")}`;

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const formattedName = mevzi.name
        .replace(/[\s-]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "_");
      a.download = `${formattedName}_${formattedTimestamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exporting mevzi data:", error);
    }
  };

  return (
    <Container className="mevzi-edit-container">
      <div className="mevzi-edit-main-div-class">
        <div className="mevzi-edit-left-div">
          <Tooltip
            title="Tabular Görünüm"
            style={{ cursor: "pointer" }}
            onClick={() => handleToMevziler()}
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
              MEVZİLER
            </Typography>
          </Tooltip>
          <div className="mevzi-edit-scroll">
            {mevziler.length > 0 ? (
              mevziler.map((mevzi, index) => (
                <div
                  key={mevzi.id}
                  className={`mevzi-edit-all-list ${
                    mevzi.id === id ? "chosen" : ""
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
                              <>
                                <Tooltip title="Envanter Özeti Çıkart">
                                  <IconButton
                                    edge="end"
                                    onClick={() =>
                                      handleExportMevziClick(mevzi)
                                    }
                                    aria-label="export"
                                  >
                                    <GetAppIcon />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Sil">
                                  <IconButton
                                    edge="end"
                                    onClick={(event) =>
                                      handleDeleteMevziClick(mevzi.id, event)
                                    }
                                    aria-label="delete"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )
                          }
                        >
                          <ListItemButton
                            className={`mevzi-edit-list-item ${
                              mevzi.id === id ? "chosen" : ""
                            }`}
                            onClick={() => handleEditMevziClick(mevzi)}
                          >
                            <ListItemText
                              sx={{
                                ".MuiListItemText-primary": {
                                  fontSize: "1.3rem",
                                  color: "white",
                                  fontWeight: "bold",
                                },
                              }}
                              primary={mevzi.name}
                            />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </Grid>
                  </Box>
                </div>
              ))
            ) : (
              <Typography className="mevzi-edit-empty-message">
                Görüntülenecek Mevzi bulunmamaktadır.
              </Typography>
            )}
          </div>
        </div>
        <div className="mevzi-edit-right-div">
          {selectedMevzi && (
            <MevziAdd
              isRoleAdmin={isRoleAdmin}
              systems={systems}
              fetchSystems={fetchSystems}
              mevzi={selectedMevzi}
              fetchAllMevzi={fetchAllMevzi}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

export default MevziEdit;
