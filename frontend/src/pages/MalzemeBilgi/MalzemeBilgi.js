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
  const [ips, setIps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMalzemeInfo = async () => {
      try {
        const response = await axios.get(`/api/malzeme/malzeme/get/${id}`);
        setMalzemeInfo(response.data);

        if (response.data.name) {
          await fetchIps(response.data.name);
          startInterval(response.data.name);
        }
      } catch (error) {
        console.error("Malzeme bilgisi alınırken hata oluştu: ", error);
      }
    };

    const fetchIps = async (malz_name) => {
      try {
        const response = await axios.get(
          `/api/malzeme/malzmatches/update-state/${malz_name}`
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

    const startInterval = (malzemeName) => {
      const intervalId = setInterval(() => {
        fetchIps(malzemeName);
      }, 60000);
      return () => clearInterval(intervalId);
    };

    fetchMalzemeInfo();

    return () => {
      clearInterval(startInterval);
    };
  }, [id]);

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
                  <TableCell>{malzemeInfo.mmodel_name || "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lokasyon</TableCell>
                  <TableCell>
                    {malzemeInfo.depo === 0
                      ? "Birim Depo"
                      : malzemeInfo.depo === 1
                      ? "Yedek Depo"
                      : malzemeInfo.mevzi_name || "Bilinmiyor"}
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

          <Typography
            variant="h5"
            gutterBottom
            className="malzeme-bilgi-section-title"
          >
            Malzeme IP Listeleri
          </Typography>

          <TableContainer
            component={Paper}
            className="malzeme-bilgi-table-container"
          >
            <Table stickyHeader aria-label="ip table">
              <TableHead>
                <TableRow>
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
                      <TableCell>
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
                    <TableCell colSpan={2} align="center">
                      Sisteme ait IP bilgisi bulunmamaktadır.
                    </TableCell>
                  </TableRow>
                )}
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
