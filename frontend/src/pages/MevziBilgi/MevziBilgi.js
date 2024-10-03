import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import axios from "axios";
import "./MevziBilgi.css";
import CollectionsIcon from "@mui/icons-material/Collections";
import ConstructionIcon from "@mui/icons-material/Construction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { message } from "antd";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import RemoveIcon from "@mui/icons-material/Remove";

function MevziBilgi({ isRoleAdmin }) {
  const { id } = useParams();
  const [mevziInfo, setMevziInfo] = useState(null);
  const navigate = useNavigate();
  const stateIntervalIds = useRef([]);
  useEffect(() => {
    const fetchSistemler = async () => {
      try {
        const response = await axios.get("/api/sistem/all/");
        return response.data;
      } catch (error) {
        console.error("Sistem bilgisi alınırken hata oluştu: ", error);
        return [];
      }
    };
    const fetchSubeler = async () => {
      try {
        const response = await axios.get("/api/sube/all/");
        return response.data;
      } catch (error) {
        console.error("Sube bilgisi alınırken hata oluştu: ", error);
        return [];
      }
    };
    const fetchBSorum = async () => {
      try {
        const response = await axios.get("/api/bakimsorumlulari/all/");
        return response.data;
      } catch (error) {
        console.error("Bakım sorumlusu bilgisi alınırken hata oluştu: ", error);
        return [];
      }
    };

    const fetchMevziInfo = async () => {
      try {
        const mevziResponse = await axios.get(`/api/mevzi/mevzi/get/${id}`);
        const sistemlerData = await fetchSistemler();
        const suberesponse = await fetchSubeler();
        const bsorumlulari = await fetchBSorum();

        const updatedMevzi = {
          ...mevziResponse.data,
          y_sistemler: mevziResponse.data.y_sistemler.map(
            (systemId) =>
              sistemlerData.find((sistem) => sistem.id === systemId)?.name ||
              null
          ),
          sube:
            suberesponse.find((sube) => sube.id === mevziResponse.data.sube_id)
              ?.name || null,
          bakim_sorumlusu:
            bsorumlulari.find(
              (bsorum) => bsorum.id === mevziResponse.data.bakim_sorumlusu_id
            )?.name || null,
        };

        setMevziInfo(updatedMevzi);
      } catch (error) {
        console.error("Mevzi bilgisi alınırken hata oluştu: ", error);
      }
    };

    fetchMevziInfo();
  }, [id]);

  const updateState = async (mevziId) => {
    try {
      const response = await axios.get(`/api/mevzi/update-state/${mevziId}`);
      if (mevziInfo && mevziInfo.id === mevziId) {
        setMevziInfo({
          ...mevziInfo,
          state: response.data.state,
        });
      }
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
    if (mevziInfo && mevziInfo.frequency) {
      startOrUpdateInterval(mevziInfo);
    }
  }, [mevziInfo, id]);

  const handleMevziPhotoClick = async (name) => {
    navigate(`/mevzi/gallery/${name}`);
  };
  const handleAltyClick = async (id) => {
    navigate(`/mevziler/${id}/altyapi`);
  };
  const handleEditMevziClick = async (id) => {
    navigate(`/mevziler/${id}`);
  };
  const handleDeleteMevziClick = async (id) => {
    try {
      const response = await axios.delete(`/api/mevzi/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Mevzi silindi!");
        setMevziInfo(null);
        setTimeout(() => {
          navigate(`/mevziler`);
        }, 2000);
      } else {
        message.error("Mevzi silinemedi'");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };
  return (
    <Container className="mevzi-bilgi-main-container">
      <div className="mevzi-bilgi-header-container">
        <div className="mevzi-bilgi-mevzi-page-header-add">
          <Typography
            className="mevzi-bilgi-main-header"
            variant="h4"
            gutterBottom
          >
            Mevzi: {mevziInfo?.name || "Bilinmiyor"}
          </Typography>
          <div className="mevzi-bilgi-icons-container">
            <IconButton
              aria-label="photo-gallery"
              size="small"
              className="mevzi-bilgi-photo-gallery-icon"
              onClick={() => handleMevziPhotoClick(mevziInfo?.name)}
            >
              <Tooltip title="Fotoğraflar">
                <CollectionsIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              aria-label="edit"
              size="small"
              className="mevzi-bilgi-alty-icon"
              onClick={() => handleAltyClick(mevziInfo?.id)}
            >
              <Tooltip title="Alt Yapı">
                <ConstructionIcon />
              </Tooltip>
            </IconButton>
            {isRoleAdmin && (
              <>
                <IconButton
                  aria-label="edit"
                  size="small"
                  className="mevzi-bilgi-edit-icon"
                  onClick={() => handleEditMevziClick(mevziInfo?.id)}
                >
                  <Tooltip title="Düzenle">
                    <EditIcon />
                  </Tooltip>
                </IconButton>

                <IconButton
                  aria-label="delete"
                  size="small"
                  className="mevzi-bilgi-delete-icon"
                  onClick={() => handleDeleteMevziClick(mevziInfo?.id)}
                >
                  <Tooltip title="Sil">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </>
            )}
          </div>
        </div>
      </div>

      {mevziInfo ? (
        <>
          <TableContainer
            component={Paper}
            className="mevzi-bilgi-table-container"
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Özellik</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Değer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Mevzi Adı</TableCell>
                  <TableCell>{mevziInfo.name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Karakol İsmi</TableCell>
                  <TableCell>{mevziInfo.isim || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IP Adresi</TableCell>
                  <TableCell>
                    {" "}
                    {mevziInfo.ip ? (
                      mevziInfo.state !== null &&
                      mevziInfo.state !== undefined ? (
                        <>
                          {mevziInfo.state < 1 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowDownIcon
                                  style={{ color: "red" }}
                                />
                                <span style={{ fontSize: "1rem" }}>
                                  İnaktif / Ip: {mevziInfo.ip}
                                </span>
                              </IconButton>
                            </>
                          )}
                          {mevziInfo.state === 2 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowUpIcon
                                  style={{ color: "green" }}
                                />
                                <span style={{ fontSize: "1rem" }}>
                                  Aktif / Ip: {mevziInfo.ip}
                                </span>
                              </IconButton>
                            </>
                          )}
                          {mevziInfo.state === 1 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <RemoveIcon style={{ color: "yellow" }} />
                                <span style={{ fontSize: "1rem" }}>
                                  Bilinmiyor / Ip: {mevziInfo.ip}
                                </span>
                              </IconButton>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <IconButton className="noHighlight" disableRipple>
                            <RemoveIcon style={{ color: "yellow" }} />
                            <span style={{ fontSize: "0.875rem" }}>
                              Bilinmiyor
                            </span>
                          </IconButton>
                        </>
                      )
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Keşif Tarihi</TableCell>
                  <TableCell>
                    {mevziInfo.kesif_tarihi
                      ? new Date(mevziInfo.kesif_tarihi).toLocaleDateString(
                          "tr-TR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Kordinat</TableCell>
                  <TableCell>{mevziInfo.kordinat || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rakım</TableCell>
                  <TableCell>{mevziInfo.rakim || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lokasyon</TableCell>
                  <TableCell>{mevziInfo.lokasyon || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ulaşım Şekli</TableCell>
                  <TableCell>{mevziInfo.ulasim || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bakım Sorumlusu</TableCell>
                  <TableCell>{mevziInfo.bakim_sorumlusu || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>İşleten Şube</TableCell>
                  <TableCell>{mevziInfo.sube || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Kurulum Tarihi</TableCell>
                  <TableCell>
                    {mevziInfo.kurulum_tarihi
                      ? new Date(mevziInfo.kurulum_tarihi).toLocaleDateString(
                          "tr-TR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dış Kurum Sistemleri</TableCell>
                  <TableCell>
                    {mevziInfo.d_sistemler && mevziInfo.d_sistemler.length
                      ? mevziInfo.d_sistemler.join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Yazılıma Oluşturulan Sistemler</TableCell>
                  <TableCell>
                    {mevziInfo.y_sistemler && mevziInfo.y_sistemler.length
                      ? mevziInfo.y_sistemler.join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography className="mevzi-bilgi-no-data">
          Görüntülenecek mevzi bilgisi bulunmamaktadır.
        </Typography>
      )}
    </Container>
  );
}

export default MevziBilgi;
