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
import "./SystemBilgi.css";
import CollectionsIcon from "@mui/icons-material/Collections";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { message } from "antd";

function SystemBilgi({ isRoleAdmin }) {
  const { id } = useParams();
  const [systemInfo, setSystemInfo] = useState(null);
  const [malzemeler, setMalzemeler] = useState([]);
  const [unsurlar, setUnsurlar] = useState([]);
  const navigate = useNavigate();
  const stateIntervalIds = useRef([]);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(`/api/system/get/${id}`);
        const [mevziler, markalar, modeller, turler] = await Promise.all([
          axios.get("/api/mevzi/all/"),
          axios.get("/api/sys_marka/all/"),
          axios.get("/api/sys_model/all/"),
          axios.get("/api/systype/all/"),
        ]);

        const system = response.data;
        const updatedSystem = {
          ...system,
          mevzi_name:
            mevziler.data.find((mevzi) => mevzi.id === system.mevzi_id)?.name ||
            null,
          marka_name:
            markalar.data.find((marka) => marka.id === system.marka_id)?.name ||
            null,
          model_name:
            modeller.data.find((model) => model.id === system.mmodel_id)
              ?.name || null,
          type_name:
            turler.data.find((tur) => tur.id === system.type_id)?.name || null,
        };

        setSystemInfo(updatedSystem);

        const malzemeResponse = await axios.get("/api/malzeme/all/");
        const filteredMalzemeler = malzemeResponse.data.filter(
          (malzeme) => malzeme.system_id === id
        );
        setMalzemeler(filteredMalzemeler);

        fetchUnsurlar(response.data.ilskili_unsur);
      } catch (error) {
        console.error("Sistem bilgisi alınırken hata oluştu: ", error);
      }
    };

    const fetchUnsurlar = async (systemUnsurlar) => {
      try {
        const response = await axios.get("/api/unsur/all/");
        const allUnsurlar = response.data;
        const matchedUnsurlar = allUnsurlar.filter((unsur) =>
          systemUnsurlar.includes(unsur.id)
        );
        setUnsurlar(matchedUnsurlar);
      } catch (error) {
        console.error("Unsurlar alınırken hata oluştu: ", error);
      }
    };

    fetchSystemInfo();
  }, [id]);

  const updateState = async (systemId) => {
    try {
      const response = await axios.get(`/api/system/update-state/${systemId}`);
      if (systemInfo && systemInfo.id === systemId) {
        setSystemInfo({
          ...systemInfo,
          state: response.data.state,
        });
      }
    } catch (error) {
      console.error(
        `Durum güncellenirken hata alındı (System ID: ${systemId}):`,
        error
      );
    }
  };

  const startOrUpdateInterval = (system) => {
    const existingInterval = stateIntervalIds.current.find(
      (item) => item.systemId === system.id
    );

    if (existingInterval) {
      if (existingInterval.frequency !== system.frequency) {
        clearInterval(existingInterval.intervalId);
        stateIntervalIds.current = stateIntervalIds.current.filter(
          (item) => item.systemId !== system.id
        );
      } else {
        return;
      }
    }

    const intervalTime = system.frequency * 60000;
    const intervalId = setInterval(() => {
      updateState(system.id);
    }, intervalTime);

    stateIntervalIds.current.push({
      systemId: system.id,
      intervalId: intervalId,
      frequency: system.frequency,
    });
  };

  useEffect(() => {
    if (systemInfo && systemInfo.frequency) {
      startOrUpdateInterval(systemInfo);
    }
  }, [systemInfo, id]);

  const handleSystemPhotoClick = async (name) => {
    navigate(`/system/gallery/${name}`);
  };
  const handleEditSystemClick = async (id) => {
    navigate(`/sistemler/${id}`);
  };
  const handleDeleteSystemClick = async (id) => {
    try {
      const response = await axios.delete(`/api/system/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Sistem silindi!");
        setSystemInfo(null);
        setTimeout(() => {
          navigate(`/sistemler`);
        }, 2000);
      } else {
        message.error("Sistem silinemedi'");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };
  return (
    <Container className="system-bilgi-main-container">
      {systemInfo ? (
        <>
          <div className="system-bilgi-system-page-header-container">
            <div className="system-bilgi-system-page-header-add">
              <Typography
                className="system-bilgi-system-main-big-header"
                variant="h4"
                gutterBottom
                component="div"
              >
                Sistem: {systemInfo?.name || "Bilinmiyor"}
              </Typography>
              <div className="system-bilgi-icons-container">
                <IconButton
                  aria-label="photo-gallery"
                  size="small"
                  className="system-bilgi-photo-gallery-icon"
                  onClick={() => handleSystemPhotoClick(systemInfo?.name)}
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
                      className="system-bilgi-edit-icon"
                      onClick={() => handleEditSystemClick(systemInfo?.id)}
                    >
                      <Tooltip title="Düzenle">
                        <EditIcon />
                      </Tooltip>
                    </IconButton>

                    <IconButton
                      aria-label="delete"
                      size="small"
                      className="system-bilgi-delete-icon"
                      onClick={() => handleDeleteSystemClick(systemInfo?.id)}
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

          <TableContainer
            className="system-bilgi-system-table-main-container"
            component={Paper}
          >
            <Table stickyHeader aria-label="system table">
              <TableHead>
                <TableRow className="system-bilgi-system-sticky-header">
                  <TableCell style={{ fontWeight: "bold" }}>Özellik</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Değer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Seri Numarası</TableCell>
                  <TableCell>{systemInfo.seri_num || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IP Adresi</TableCell>
                  <TableCell>
                    {systemInfo.ip ? (
                      systemInfo.state !== null &&
                      systemInfo.state !== undefined ? (
                        <>
                          {systemInfo.state < 1 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowDownIcon
                                  style={{ color: "red" }}
                                />
                                <span style={{ fontSize: "1rem" }}>
                                  İnaktif / Ip: {systemInfo.ip}
                                </span>
                              </IconButton>
                            </>
                          )}
                          {systemInfo.state === 2 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowUpIcon
                                  style={{ color: "green" }}
                                />
                                <span style={{ fontSize: "1rem" }}>
                                  Aktif / Ip: {systemInfo.ip}
                                </span>
                              </IconButton>
                            </>
                          )}
                          {systemInfo.state === 1 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <RemoveIcon style={{ color: "yellow" }} />
                                <span style={{ fontSize: "1rem" }}>
                                  Bilinmiyor / Ip: {systemInfo.ip}
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
                  <TableCell>Lokasyon</TableCell>
                  <TableCell>
                    {systemInfo.depo === 0
                      ? "Birim Depo"
                      : systemInfo.depo === 1
                      ? "Yedek Depo"
                      : systemInfo.mevzi_name || "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tür</TableCell>
                  <TableCell>{systemInfo.type_name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marka</TableCell>
                  <TableCell>{systemInfo.marka_name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>{systemInfo.model_name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Giriş Tarihi</TableCell>
                  <TableCell>
                    {systemInfo.giris_tarihi
                      ? new Date(systemInfo.giris_tarihi).toLocaleDateString(
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
                  <TableCell>İlişkili Unsurlar</TableCell>
                  <TableCell>
                    {unsurlar.map((unsur) => unsur.name).join(", ") || "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>{systemInfo.description || "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="h5"
            gutterBottom
            className="system-bilgi-system-section-title"
          >
            Sistemi Oluşturan Malzemeler
          </Typography>
          <TableContainer
            component={Paper}
            className="system-bilgi-system-table-main-container"
          >
            <Table stickyHeader aria-label="malzeme table">
              {malzemeler.length > 0 ? (
                <>
                  <TableHead>
                    <TableRow className="system-bilgi-system-sticky-header">
                      <TableCell style={{ fontWeight: "bold" }}>
                        Malzeme Adı
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        Seri Numarası
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        IP Adresi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {malzemeler.map((malzeme) => (
                      <TableRow key={malzeme.id}>
                        <TableCell>{malzeme.name || "-"}</TableCell>
                        <TableCell>{malzeme.seri_num || "-"}</TableCell>
                        <TableCell>
                          {malzeme.ip ? (
                            malzeme.state !== null &&
                            malzeme.state !== undefined ? (
                              <>
                                {malzeme.state < 1 && (
                                  <>
                                    <IconButton
                                      className="noHighlight"
                                      disableRipple
                                    >
                                      <KeyboardDoubleArrowDownIcon
                                        style={{ color: "red" }}
                                      />
                                      <span style={{ fontSize: "1rem" }}>
                                        İnaktif / IP: {malzeme.ip}
                                      </span>
                                    </IconButton>
                                  </>
                                )}
                                {malzeme.state === 2 && (
                                  <>
                                    <IconButton
                                      className="noHighlight"
                                      disableRipple
                                    >
                                      <KeyboardDoubleArrowUpIcon
                                        style={{ color: "green" }}
                                      />
                                      <span style={{ fontSize: "1rem" }}>
                                        Aktif / IP: {malzeme.ip}
                                      </span>
                                    </IconButton>
                                  </>
                                )}
                                {malzeme.state === 1 && (
                                  <>
                                    <IconButton
                                      className="noHighlight"
                                      disableRipple
                                    >
                                      <RemoveIcon style={{ color: "yellow" }} />
                                      <span style={{ fontSize: "1rem" }}>
                                        Bilinmiyor / IP: {malzeme.ip}
                                      </span>
                                    </IconButton>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <IconButton
                                  className="noHighlight"
                                  disableRipple
                                >
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
                    ))}
                  </TableBody>
                </>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Sisteme ait malzeme bulunmamaktadır.
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography className="system-bilgi-no-system-empty-message">
          Görüntülenecek sistem bilgisi bulunmamaktadır.
        </Typography>
      )}
    </Container>
  );
}

export default SystemBilgi;
