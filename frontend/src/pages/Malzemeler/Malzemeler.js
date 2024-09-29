import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import axios from "axios";
import { message } from "antd";
import AddIcon from "@mui/icons-material/Add";
import "./Malzemeler.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@mui/material/styles/styled";
import CollectionsIcon from "@mui/icons-material/Collections";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RemoveIcon from "@mui/icons-material/Remove";
import InfoIcon from "@mui/icons-material/Info";

const CustomTextField = styled(TextField)({
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white !important",
    },
    "& input:valid:focus + fieldset": {
      borderColor: "white !important",
    },
  },
  "& .MuiFilledInput-root": {
    "&:before": {
      borderBottomColor: "white",
    },
    "&:hover:before": {
      borderBottomColor: "white",
    },
    "&:after": {
      borderBottomColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& label": {
    color: "white",
  },
  "& .MuiInputBase-root": {
    "&::selection": {
      backgroundColor: "rgba(255, 255, 255, 0.99)",
      color: "#241b19",
    },
    "& input": {
      caretColor: "white",
    },
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white !important",
  },
  "& .MuiInputBase-input::selection": {
    backgroundColor: "rgba(255, 255, 255, 0.99)",
    color: "#241b19",
  },
});

function Malzemeler({
  isRoleAdmin,
  initialMalzemeler,
  fetchMalzemeler,
  malzMatch,
  fetchMalzMatch,
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [malzemeler, setMalzemeler] = useState([]);
  const [searchMalzeme, setSearchMalzeme] = useState("");

  const updateDetails = async (malzemeler) => {
    const fetchMevzi = async () => {
      const response = await axios.get("/api/mevzi/all/");
      return response.data;
    };

    const fetchMModels = async () => {
      const response = await axios.get("/api/model/all/");
      return response.data;
    };

    const fetchMMarkalar = async () => {
      const response = await axios.get("/api/marka/all/");
      return response.data;
    };

    const fetchMTypes = async () => {
      const response = await axios.get("/api/type/all/");
      return response.data;
    };

    const fetchSystems = async () => {
      const response = await axios.get("/api/system/all/");
      return response.data;
    };

    // Execute all fetches concurrently
    const [models, markalar, types, mevziler, systems] = await Promise.all([
      fetchMModels(),
      fetchMMarkalar(),
      fetchMTypes(),
      fetchMevzi(),
      fetchSystems(),
    ]);

    // Update systems with mapped values
    return malzemeler.map((malzeme) => {
      const matchedMalzeme = malzMatch.find(
        (m) => m.malzeme_name === malzeme.name
      );

      return {
        ...malzeme,
        mmodel_name:
          models.find((m) => m.id === malzeme.mmodel_id)?.name ||
          malzeme.mmodel_id,
        marka_name:
          markalar.find((m) => m.id === malzeme.marka_id)?.name ||
          malzeme.marka_id,
        type_name:
          types.find((t) => t.id === malzeme.type_id)?.name || malzeme.type_id,
        mevzi_name:
          mevziler.find((m) => m.id === malzeme.mevzi_id)?.name ||
          malzeme.mevzi_id,
        system_name:
          systems.find((m) => m.id === malzeme.system_id)?.name ||
          malzeme.system_id,
        ...(matchedMalzeme && {
          state: matchedMalzeme.state,
          ip: matchedMalzeme.ip,
        }),
      };
    });
  };

  useEffect(() => {
    const updateData = async () => {
      if (initialMalzemeler.length > 0) {
        const updatedMalzemeler = await updateDetails(initialMalzemeler);
        setMalzemeler(updatedMalzemeler);
      }
    };
    updateData();
  }, [initialMalzemeler]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditMalzemeClick = async (id) => {
    navigate(`/malzemeler/${id}`);
  };

  const handleSMalzemePhotoClick = async (name) => {
    navigate(`/malzeme/gallery/${name}`);
  };

  const handleDeleteMalzemeClick = async (id, event) => {
    try {
      const response = await axios.delete(`/api/malzeme/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Malzeme silindi!");
        setMalzemeler((prevMalzemeler) =>
          prevMalzemeler.filter((malzeme) => malzeme.id !== id)
        );
        fetchMalzemeler();
      } else {
        message.error("Malzeme silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  useEffect(() => {
    fetchMalzemeler();
    fetchMalzMatch();
  }, []);

  useEffect(() => {
    const updateStateAndIp = async () => {
      await fetchMalzMatch();

      if (filteredMalzemeler.length > 0) {
        const updatedMalzemeler = filteredMalzemeler.map((malzeme) => {
          const matchedMalzeme = malzMatch.find(
            (m) => m.malzeme_name === malzeme.name
          );

          return {
            ...malzeme,
            ...(matchedMalzeme && {
              state: matchedMalzeme.state,
              ip: matchedMalzeme.ip,
            }),
          };
        });
        setMalzemeler(updatedMalzemeler);
      }
    };

    const intervalId = setInterval(() => {
      updateStateAndIp();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [initialMalzemeler, malzMatch]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortArray = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  // const filteredMalzemeler = malzemeler.filter((m) =>
  //   m.name.toLowerCase().includes(searchMalzeme.toLowerCase())
  // );
  const filteredMalzemeler = useMemo(() => {
    return malzemeler.filter((m) =>
      m.name.toLowerCase().includes(searchMalzeme.toLowerCase())
    );
  }, [malzemeler, searchMalzeme]);

  const handleViewMalzemeClick = async (id) => {
    navigate(`/malzeme/${id}/bilgi`);
  };
  return (
    <Container className="malzemeler-main-container">
      <div className="malzemeler-page-header-container">
        <div className="malzemeler-page-header-add">
          <Typography
            className="malzemeler-main-big-header"
            variant="h6"
            gutterBottom
            component="div"
          >
            Malzemeler
            {isRoleAdmin && (
              <IconButton
                className="malzemeler-add-button-in-header"
                size="large"
                onClick={() => navigate("/malzeme-ekle")}
              >
                <Tooltip title="Ekle">
                  <AddIcon />
                </Tooltip>
              </IconButton>
            )}
          </Typography>
        </div>
        <div className="malzemeler-page-search-bar">
          <CustomTextField
            autoComplete="off"
            fullWidth
            variant="outlined"
            placeholder="Ara..."
            value={searchMalzeme}
            onChange={(e) => setSearchMalzeme(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton disabled={!searchMalzeme}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      {filteredMalzemeler && filteredMalzemeler.length > 0 ? (
        <TableContainer
          className="malzemeler-table-main-container"
          component={Paper}
        >
          <Table stickyHeader aria-label="malzeme table">
            <TableHead>
              <TableRow className="malzemeler-sticky-header">
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("name")}
                    >
                      Adı
                      {orderBy && orderBy === "name" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("system_name")}
                    >
                      İlişkili Sistem
                      {orderBy && orderBy === "system_name" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("type_name")}
                    >
                      Tür
                      {orderBy && orderBy === "type_name" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("marka_name")}
                    >
                      Marka
                      {orderBy && orderBy === "marka_name" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("mmodel_name")}
                    >
                      Model
                      {orderBy && orderBy === "mmodel_name" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("seri_num")}
                    >
                      Seri No
                      {orderBy && orderBy === "seri_num" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("depo")}
                    >
                      Lokasyon
                      {orderBy && orderBy === "depo" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("giris_tarihi")}
                    >
                      Envantere Giriş Tarihi
                      {orderBy && orderBy === "giris_tarihi" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("description")}
                    >
                      Açıklama
                      {orderBy && orderBy === "description" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "pointer" }}>
                    Arıza Tarihleri
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "pointer" }}>
                    Onarım Tarihleri
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "pointer" }}>
                    Bakım Tarihleri
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "pointer" }}>
                    Durum
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "pointer" }}>
                    Fotoğraflar
                  </Typography>
                </TableCell>
                <Tooltip title="Detaylı Bilgi">
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Görüntüle
                  </TableCell>
                </Tooltip>
                {isRoleAdmin && (
                  <>
                    <TableCell style={{ textAlign: "center" }}>
                      <Typography style={{ fontWeight: "bold" }}>
                        Düzenle & Sil
                      </Typography>
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortArray(
                filteredMalzemeler.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ),
                getComparator(order, orderBy)
              ).map((malz) => (
                <TableRow key={malz.id}>
                  <TableCell
                    style={{ textAlign: "center" }}
                    component="th"
                    scope="row"
                  >
                    {malz.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.system_id ? `${malz.system_name}` : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.type_name ? malz.type_name : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.marka_name ? malz.marka_name : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.mmodel_name ? malz.mmodel_name : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.seri_num ? malz.seri_num : "-"}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    {malz.depo === 0
                      ? "Birim Depo"
                      : malz.depo === 1
                      ? "Yedek Depo"
                      : malz.depo === 2
                      ? malz.mevzi_name
                        ? malz.mevzi_name
                        : "Bilinmeyen Mevzi"
                      : "-"}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    {malz.giris_tarihi ? malz.giris_tarihi : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.description ? malz.description : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {(malz.arizalar && malz.arizalar.length) > 0
                      ? malz.arizalar.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {(malz.onarimlar && malz.onarimlar.length) > 0
                      ? malz.onarimlar.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {(malz.bakimlar && malz.bakimlar.length) > 0
                      ? malz.bakimlar.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell
                    style={{ textAlign: "center" }}
                    component="th"
                    scope="row"
                  >
                    {malz.state !== null && malz.state !== undefined ? (
                      <>
                        {malz.state < 1 && (
                          <>
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
                            <br />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "white",
                                justifyContent: "center",
                                display: "flex",
                              }}
                            >
                              Sistem Mevzisinde Ip: {malz.ip}
                            </span>
                          </>
                        )}
                        {malz.state === 2 && (
                          <>
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
                            <br />
                            <span
                              style={{
                                fontSize: "14px",
                                color: "white",
                                justifyContent: "center",
                                display: "flex",
                              }}
                            >
                              Sistem Mevzisinde Ip: {malz.ip}
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <IconButton className="noHighlight" disableRipple>
                          <RemoveIcon style={{ color: "yellow" }} />
                        </IconButton>
                        <br />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "white",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          Bilinmiyor
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton
                      aria-label="photo-gallery"
                      size="small"
                      className="malzeme-edit-icon"
                      onClick={() => handleSMalzemePhotoClick(malz.name)}
                    >
                      <Tooltip title="Fotoğraflar">
                        <CollectionsIcon />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      className="system-edit-icon"
                      onClick={() => handleViewMalzemeClick(malz.id)}
                    >
                      <Tooltip title="Detaylı Bilgi">
                        <InfoIcon />
                      </Tooltip>
                    </IconButton>
                  </TableCell>

                  {isRoleAdmin && (
                    <>
                      <TableCell style={{ textAlign: "center" }}>
                        <IconButton
                          aria-label="edit"
                          size="small"
                          className="malzeme-edit-icon"
                          onClick={() => handleEditMalzemeClick(malz.id)}
                        >
                          <Tooltip title="Düzenle">
                            <EditIcon />
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          className="malzeme-delete-icon"
                          onClick={() => handleDeleteMalzemeClick(malz.id)}
                        >
                          <Tooltip title="Sil">
                            <DeleteIcon />
                          </Tooltip>
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            className="sticky-pagination"
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={filteredMalzemeler.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <Typography className="no-malzeme-empty-message">
          Görüntülenecek Malzeme bulunmamaktadır.
        </Typography>
      )}
    </Container>
  );
}

export default Malzemeler;
