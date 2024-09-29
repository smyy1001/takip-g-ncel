import React, { useEffect, useState } from "react";
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
  const [ips, setIps] = useState([]);
  const [unsurlar, setUnsurlar] = useState([]);
  const [markalar, setMarkalar] = useState([]);
  const [modeller, setModeller] = useState([]);
  const [turler, setTurler] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let ipsIntervalId; // Store interval ID for fetching IPs
    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(`/api/system/get/${id}`);
        setSystemInfo(response.data);

        const malzemeResponse = await axios.get("/api/malzeme/all/");
        const filteredMalzemeler = malzemeResponse.data.filter(
          (malzeme) => malzeme.system_id === id
        );
        setMalzemeler(filteredMalzemeler);

        if (response.data.mevzi_id) {
          await fetchIps(response.data.mevzi_id);
          // Start the interval for fetching IPs every 30 seconds
          ipsIntervalId = startIpsInterval(response.data.mevzi_id);
        }

        fetchMarkaModelAndTur();
        fetchUnsurlar(response.data.ilskili_unsur);
      } catch (error) {
        console.error("Sistem bilgisi alınırken hata oluştu: ", error);
      }
    };

    const fetchMarkaModelAndTur = async () => {
      try {
        const markaResponse = await axios.get("/api/sys_marka/all/");
        const modelResponse = await axios.get("/api/sys_model/all/");
        const turResponse = await axios.get("/api/systype/all/");
        setMarkalar(markaResponse.data);
        setModeller(modelResponse.data);
        setTurler(turResponse.data);
      } catch (error) {
        console.error(
          "Marka, model ve tür bilgisi alınırken hata oluştu: ",
          error
        );
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

    const fetchIps = async (mevziId) => {
      try {
        const response = await axios.get(
          `/api/malzeme/malzmatches/state?mevzi_id=${mevziId}&s_id=${id}`
        );
        const fetchedIps = response.data.map(
          ({ malzeme_name, mevzi_id, ip, state }) => ({
            malzeme_name,
            mevzi_id,
            ip,
            state,
          })
        );
        setIps(fetchedIps);
      } catch (error) {
        console.error("IP'ler çekilirken hata oluştu:", error);
      }
    };

    // Start an interval for fetching IPs
    const startIpsInterval = (mevziId) => {
      const intervalId = setInterval(() => {
        fetchIps(mevziId);
      }, 60000);
      return intervalId;
    };

    fetchSystemInfo();

    // Cleanup function to clear the IP fetch interval
    return () => {
      if (ipsIntervalId) {
        clearInterval(ipsIntervalId);
      }
    };
  }, [id]);

  useEffect(() => {
    let stateIntervalId; // Store interval ID for updating state

    const updateState = async (id) => {
      try {
        const response = await axios.get(
          `/api/system/update-state/${id}`
        );
        setSystemInfo({ ...systemInfo, state: response.data.state });
      } catch (error) {
        console.error("Durum güncellenirken hata alındı:", error);
      }
    };

    // Start an interval for updating the system state
    const startStateInterval = (id) => {
      const intervalId = setInterval(() => {
        updateState(id);
      }, systemInfo.frequency * 60000); // Convert minutes to milliseconds
      return intervalId;
    };

    if (systemInfo && systemInfo.frequency) {
      stateIntervalId = startStateInterval(id); // Start the state update interval
    }

    // Cleanup function to clear the state update interval
    return () => {
      if (stateIntervalId) {
        clearInterval(stateIntervalId);
      }
    };
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
                    {systemInfo.state !== null && systemInfo.state !== undefined ? (
                      <>
                        {systemInfo.state < 1 && (
                          <>
                            <IconButton className="noHighlight" disableRipple>
                              <KeyboardDoubleArrowDownIcon
                                style={{ color: "red" }}
                              />
                              <span
                                style={{ fontSize: '1rem'}}>
                                Kapalı  /  Ip: {systemInfo.ip}
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
                              <span
                                style={{ fontSize: '1rem' }}>
                                Açık  /  Ip: {systemInfo.ip}
                              </span>
                            </IconButton>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <IconButton className="noHighlight" disableRipple>
                            <RemoveIcon style={{ color: "yellow" }} />
                            <span
                              style={{ fontSize: '0.875rem' }}>
                              Bilinmiyor
                            </span>
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lokasyon</TableCell>
                  <TableCell>{systemInfo.depo ? (systemInfo.depo === 0 && 'Birim Depo') :  '-'}</TableCell> 
                </TableRow>
                <TableRow>
                  <TableCell>Tür</TableCell>
                  <TableCell>
                    {turler.find((tur) => tur.id === systemInfo.type_id)
                      ?.name || "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marka</TableCell>
                  <TableCell>
                    {markalar.find((marka) => marka.id === systemInfo.marka_id)
                      ?.name || "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>
                    {modeller.find((model) => model.id === systemInfo.mmodel_id)
                      ?.name || "-"}
                  </TableCell>
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
              <TableHead>
                <TableRow className="system-bilgi-system-sticky-header">
                  <TableCell style={{ fontWeight: "bold" }}>
                    Malzeme Adı
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Seri Numarası
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {malzemeler.length > 0 ? (
                  malzemeler.map((malzeme) => (
                    <TableRow key={malzeme.id}>
                      <TableCell>{malzeme.name || "-"}</TableCell>
                      <TableCell>{malzeme.seri_num || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Sisteme ait malzeme bulunmamaktadır.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="h5"
            gutterBottom
            className="system-bilgi-system-section-title"
          >
            Sistem IP Listeleri
          </Typography>
          <TableContainer
            component={Paper}
            className="system-bilgi-system-table-main-container"
          >
            <Table stickyHeader aria-label="ip table">
              <TableHead>
                <TableRow className="system-bilgi-system-sticky-header">
                  <TableCell style={{ fontWeight: "bold" }}>
                    IP Adresi
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ips.length > 0 ? (
                  ips.map((ip, index) => (
                    <TableRow key={index}>
                      <TableCell>{ip.ip || "-"}</TableCell>
                      <TableCell style={{ textAlign: "left" }}>
                        {ip.state !== null && ip.state !== undefined && (
                          <>
                            {ip.state < 1 && (
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowDownIcon
                                  style={{ color: "red" }}
                                />
                                <span
                                  style={{ fontSize: "16px", color: "white" }}
                                >
                                  Kapalı
                                </span>
                              </IconButton>
                            )}
                            {ip.state === 2 && (
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowUpIcon
                                  style={{ color: "green" }}
                                />
                                <span
                                  style={{ fontSize: "16px", color: "white" }}
                                >
                                  Açık
                                </span>
                              </IconButton>
                            )}
                            {ip.state === 1 && (
                              <IconButton className="noHighlight" disableRipple>
                                <RemoveIcon style={{ color: "yellow" }} />
                                <span
                                  style={{ fontSize: "16px", color: "white" }}
                                >
                                  Bilinmiyor
                                </span>
                              </IconButton>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Sisteme ait IP bilgisi bulunmamaktadır.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
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
