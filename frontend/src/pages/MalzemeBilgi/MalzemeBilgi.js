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
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import "./MalzemeBilgi.css";
import CollectionsIcon from "@mui/icons-material/Collections";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { message } from "antd";

function MalzemeBilgi({ isRoleAdmin }) {
  const { id } = useParams();
  const [malzemeInfo, setMalzemeInfo] = useState(null);
  const navigate = useNavigate();
  const stateIntervalIds = useRef([]);
  useEffect(() => {
    const fetchMalzemeInfo = async () => {
      try {
        const response = await axios.get(`/api/malzeme/malzeme/get/${id}`);
        const [types, markalar, modeller, sistemler, mevziler] =
          await Promise.all([
            axios.get("/api/type/all/"),
            axios.get("/api/marka/all/"),
            axios.get("/api/model/all/"),
            axios.get("/api/system/all/"),
            axios.get("/api/mevzi/all/"),
          ]);

        const malzeme = response.data;

        const updatedMalzeme = {
          ...malzeme,
          type_name:
            types.data.find((t) => t.id === malzeme.type_id)?.name || null,
          marka_name:
            markalar.data.find((m) => m.id === malzeme.marka_id)?.name || null,
          model_name:
            modeller.data.find((m) => m.id === malzeme.mmodel_id)?.name || null,
          system_name:
            sistemler.data.find((s) => s.id === malzeme.system_id)?.name ||
            null,
          mevzi_name:
            mevziler.data.find((m) => m.id === malzeme.mevzi_id)?.name || null,
        };

        setMalzemeInfo(updatedMalzeme);
      } catch (error) {
        console.error("Malzeme bilgisi alınırken hata oluştu: ", error);
      }
    };

    fetchMalzemeInfo();
  }, [id]);

  const updateState = async (malzemeId) => {
    try {
      const response = await axios.get(
        `/api/malzeme/update-state/${malzemeId}`
      );
      if (malzemeInfo && malzemeInfo.id === malzemeId) {
        setMalzemeInfo({
          ...malzemeInfo,
          state: response.data.state,
        });
      }
    } catch (error) {
      console.error(
        `Durum güncellenirken hata alındı (Malzeme ID: ${malzemeId}):`,
        error
      );
    }
  };

  const startOrUpdateInterval = (malzeme) => {
    const existingInterval = stateIntervalIds.current.find(
      (item) => item.malzemeId === malzeme.id
    );

    if (existingInterval) {
      if (existingInterval.frequency !== malzeme.frequency) {
        clearInterval(existingInterval.intervalId);
        stateIntervalIds.current = stateIntervalIds.current.filter(
          (item) => item.malzemeId !== malzeme.id
        );
      } else {
        return;
      }
    }

    const intervalTime = malzeme.frequency * 60000;
    const intervalId = setInterval(() => {
      updateState(malzeme.id);
    }, intervalTime);

    stateIntervalIds.current.push({
      malzemeId: malzeme.id,
      intervalId: intervalId,
      frequency: malzeme.frequency,
    });
  };

  useEffect(() => {
    if (malzemeInfo && malzemeInfo.frequency) {
      startOrUpdateInterval(malzemeInfo);
    }
  }, [malzemeInfo, id]);

  const handleMalzemePhotoClick = async (name) => {
    navigate(`/malzeme/gallery/${name}`);
  };
  const handleEditMalzemeClick = async (id) => {
    navigate(`/malzemeler/${id}`);
  };
  const handleDeleteMalzemeClick = async (id) => {
    try {
      const response = await axios.delete(`/api/malzeme/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Malzeme silindi!");
        setMalzemeInfo(null);
        setTimeout(() => {
          navigate(`/malzemeler`);
        }, 2000);
      } else {
        message.error("Malzeme silinemedi'");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  return (
    <Container className="malzeme-bilgi-main-container">
      <div className="malzeme-bilgi-page-header-container">
        <div className="malzeme-bilgi-malzeme-page-header-add">
          <Typography
            className="malzeme-bilgi-main-header"
            variant="h4"
            gutterBottom
          >
            Malzeme: {malzemeInfo?.name || "Bilinmiyor"}
          </Typography>
          <div className="malzeme-bilgi-icons-container">
            <IconButton
              aria-label="photo-gallery"
              size="small"
              className="malzeme-bilgi-photo-gallery-icon"
              onClick={() => handleMalzemePhotoClick(malzemeInfo?.name)}
            >
              <Tooltip title="Fotoğraflar">
                <CollectionsIcon />
              </Tooltip>
            </IconButton>
            {isRoleAdmin && (
              <>
                <IconButton
                  aria-label="edit"
                  size="small"
                  className="malzeme-bilgi-edit-icon"
                  onClick={() => handleEditMalzemeClick(malzemeInfo?.id)}
                >
                  <Tooltip title="Düzenle">
                    <EditIcon />
                  </Tooltip>
                </IconButton>

                <IconButton
                  aria-label="delete"
                  size="small"
                  className="malzeme-bilgi-delete-icon"
                  onClick={() => handleDeleteMalzemeClick(malzemeInfo?.id)}
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
      {malzemeInfo ? (
        <>
          <TableContainer
            component={Paper}
            className="malzeme-bilgi-table-container"
          >
            <Table stickyHeader aria-label="malzeme table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>Özellik</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Değer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Seri Numarası</TableCell>
                  <TableCell>{malzemeInfo.seri_num || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>{malzemeInfo.description || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>İlişkili Sistem</TableCell>
                  <TableCell>{malzemeInfo.system_name || "-"}</TableCell>
                </TableRow>
                {malzemeInfo.system_name && (
                  <TableRow>
                    <TableCell>IP Adresi</TableCell>
                    <TableCell>
                      {malzemeInfo.ip ? (
                        malzemeInfo.state !== null &&
                        malzemeInfo.state !== undefined ? (
                          <>
                            {malzemeInfo.state < 1 && (
                              <>
                                <IconButton
                                  className="noHighlight"
                                  disableRipple
                                >
                                  <KeyboardDoubleArrowDownIcon
                                    style={{ color: "red" }}
                                  />
                                  <span style={{ fontSize: "1rem" }}>
                                    İnaktif / Ip: {malzemeInfo.ip}
                                  </span>
                                </IconButton>
                              </>
                            )}
                            {malzemeInfo.state === 2 && (
                              <>
                                <IconButton
                                  className="noHighlight"
                                  disableRipple
                                >
                                  <KeyboardDoubleArrowUpIcon
                                    style={{ color: "green" }}
                                  />
                                  <span style={{ fontSize: "1rem" }}>
                                    Aktif / Ip: {malzemeInfo.ip}
                                  </span>
                                </IconButton>
                              </>
                            )}
                            {malzemeInfo.state === 1 && (
                              <>
                                <IconButton
                                  className="noHighlight"
                                  disableRipple
                                >
                                  <RemoveIcon style={{ color: "yellow" }} />
                                  <span style={{ fontSize: "1rem" }}>
                                    Bilinmiyor / Ip: {malzemeInfo.ip}
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
                )}
                <TableRow>
                  <TableCell>Tür</TableCell>
                  <TableCell>{malzemeInfo.type_name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marka</TableCell>
                  <TableCell>{malzemeInfo.marka_name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>{malzemeInfo.model_name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lokasyon</TableCell>
                  <TableCell>
                    {malzemeInfo.depo === 0
                      ? "Birim Depo"
                      : malzemeInfo.depo === 1
                      ? "Yedek Depo"
                      : malzemeInfo.mevzi_name || "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Giriş Tarihi</TableCell>
                  <TableCell>
                    {malzemeInfo.giris_tarihi
                      ? new Date(malzemeInfo.giris_tarihi).toLocaleDateString(
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
                  <TableCell>Arıza Tarihleri</TableCell>
                  <TableCell>
                    {(malzemeInfo.arizalar && malzemeInfo.arizalar.length) > 0
                      ? malzemeInfo.arizalar
                          .map((ariza) =>
                            new Date(ariza).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          )
                          .join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Onarım Tarihleri</TableCell>
                  <TableCell>
                    {(malzemeInfo.onarimlar && malzemeInfo.onarimlar.length) > 0
                      ? malzemeInfo.onarimlar
                          .map((onarim) =>
                            new Date(onarim).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          )
                          .join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bakım Tarihleri</TableCell>
                  <TableCell>
                    {(malzemeInfo.bakimlar && malzemeInfo.bakimlar.length) > 0
                      ? malzemeInfo.bakimlar
                          .map((bakim) =>
                            new Date(bakim).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          )
                          .join(", ")
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography className="malzeme-bilgi-no-data-message">
          Görüntülenecek malzeme bilgisi bulunmamaktadır.
        </Typography>
      )}
    </Container>
  );
}

export default MalzemeBilgi;
