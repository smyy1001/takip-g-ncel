import React, { useEffect, useState, useMemo, useRef } from "react";
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
import "./Mevziler.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@mui/material/styles/styled";
import CollectionsIcon from "@mui/icons-material/Collections";
import ConstructionIcon from "@mui/icons-material/Construction";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GetAppIcon from "@mui/icons-material/GetApp";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RemoveIcon from "@mui/icons-material/Remove";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FormControlLabel, Radio } from '@mui/material';
import { Checkbox, FormGroup } from '@mui/material';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

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

function Mevziler({ isRoleAdmin, initialMevziler, fetchAllMevzi }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [mevziler, setMevziler] = useState([]);
  const [searchMevzi, setSearchMevzi] = useState("");
  const stateIntervalIds = useRef([]);
  const [searchLocation, setSearchLocation] = useState("a");
  const [searchRakimL, setSearchRakimL] = useState(null);
  const [searchRakimH, setSearchRakimH] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleMevziRadioBChange = (event) => {
    setSearchLocation(event.target.value);
  };

  const controlProps = (item) => ({
    checked: searchLocation === item,
    onChange: handleMevziRadioBChange,
    value: item,
    name: "depo-mevzi-radio-button",
    inputProps: { "aria-label": item },
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const updateDetails = async (mevziler) => {
    const fetchSube = async () => {
      const response = await axios.get("/api/sube/all/");
      return response.data;
    };

    const fetchBS = async () => {
      const response = await axios.get("/api/bakimsorumlulari/all/");
      return response.data;
    };

    const fetchSistemler = async () => {
      const response = await axios.get("/api/sistem/all/");
      return response.data;
    };

    // Execute all fetches concurrently
    const [subeler, bakimS, sistemler] = await Promise.all([
      fetchSube(),
      fetchBS(),
      fetchSistemler(),
    ]);

    return mevziler.map((mevzi) => ({
      ...mevzi,
      sube_id:
        subeler.find((m) => m.id === mevzi.sube_id)?.name || mevzi.sube_id,
      bakim_sorumlusu_id:
        bakimS.find((m) => m.id === mevzi.bakim_sorumlusu_id)?.name ||
        mevzi.bakim_sorumlusu_id,
      y_sistemler: mevzi.y_sistemler.map(
        (id) => sistemler.find((u) => u.id === id)?.name || id
      ),
    }));
  };

  useEffect(() => {
    const updateData = async () => {
      if (initialMevziler.length > 0) {
        const updatedMevziler = await updateDetails(initialMevziler);
        setMevziler(updatedMevziler);
      }
    };
    updateData();
  }, [initialMevziler]);

  const handlePhotoClick = async (name) => {
    navigate(`/mevzi/gallery/${name}`);
  };

  const handleViewMevziClick = async (mevzi) => {
    navigate(`/mevzi/${mevzi.id}/bilgi`);
  };

  const handleAltyClick = async (id) => {
    navigate(`/mevziler/${id}/altyapi`);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditMevziClick = async (mevzi) => {
    navigate(`/mevziler/${mevzi.id}`);
  };

  const handleDeleteMevziClick = async (id, event) => {
    try {
      const response = await axios.delete(`/api/mevzi/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Mevzi silindi!");
        setMevziler((prevMevziler) =>
          prevMevziler.filter((mevzi) => mevzi.id !== id)
        );
        fetchAllMevzi();
      } else {
        message.error("Mevzi silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  useEffect(() => {
    fetchAllMevzi();
  }, []);

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

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/i̇/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/Ç/g, "c")
      .replace(/Ğ/g, "g")
      .replace(/İ/g, "i")
      .replace(/Ö/g, "o")
      .replace(/Ş/g, "s")
      .replace(/Ü/g, "u");
  };

  const getStateName = (state) => {
    if (state < 1) return "İnaktif";
    if (state === 2) return "Aktif";
    return "Bilinmiyor";
  };

  const filteredMevziler = useMemo(() => {
    const searchTerm = normalizeString(searchMevzi);

    return mevziler.filter((mevzi) => {
      // Filter by search term
      const mevziStateName = getStateName(mevzi.state);
      const searchTermMatch =
        (mevzi.name && normalizeString(mevzi.name).includes(searchTerm)) ||
        (mevzi.isim && normalizeString(mevzi.isim).includes(searchTerm)) ||
        (mevzi.ip && normalizeString(mevzi.ip).includes(searchTerm)) ||
        (mevzi.kesif_tarihi &&
          normalizeString(mevzi.kesif_tarihi).includes(searchTerm)) ||
        (mevzi.kordinat &&
          normalizeString(mevzi.kordinat).includes(searchTerm)) ||
        (mevzi.rakim &&
          normalizeString(mevzi.rakim.toString()).includes(searchTerm)) ||
        (mevzi.lokasyon && normalizeString(mevzi.lokasyon).includes(searchTerm)) ||
        (mevzi.ulasim && normalizeString(mevzi.ulasim).includes(searchTerm)) ||
        (mevzi.bakim_sorumlusu_id &&
          normalizeString(mevzi.bakim_sorumlusu_id).includes(searchTerm)) ||
        (mevzi.sube_id && normalizeString(mevzi.sube_id).includes(searchTerm)) ||
        (mevzi.kurulum_tarihi &&
          normalizeString(mevzi.kurulum_tarihi).includes(searchTerm)) ||
        (mevzi.d_sistemler &&
          mevzi.d_sistemler.length > 0 &&
          normalizeString(mevzi.d_sistemler.join(", ")).includes(searchTerm)) ||
        (mevziStateName &&
          normalizeString(mevziStateName).includes(searchTerm)) ||
        (mevzi.y_sistemler &&
          mevzi.y_sistemler.length > 0 &&
          normalizeString(mevzi.y_sistemler.join(", ")).includes(searchTerm));

      // Filter by location type
      let locationMatch = true;
      if (searchLocation === "i") {
        locationMatch = mevzi.yurt_i === true;
      } else if (searchLocation === "d") {
        locationMatch = mevzi.yurt_i === false;
      }

      // Filter by state
      const stateMapping = ["inaktif", "bilinmeyen", "aktif"];
      const stateKey = stateMapping[mevzi.state];
      const stateMatch = state[stateKey] === true;

      // Filter by rakim range
      const lowerBound =
        searchRakimL !== null && searchRakimL !== 0 && searchRakimL !== ""
          ? searchRakimL
          : -Infinity;
      const upperBound =
        searchRakimH !== null && searchRakimH !== 0 && searchRakimH !== ""
          ? searchRakimH
          : Infinity;
      const rakimMatch = mevzi.rakim >= lowerBound && mevzi.rakim <= upperBound;

      // Return final match based on all conditions
      return searchTermMatch && locationMatch && stateMatch && rakimMatch;
    });
  }, [mevziler, searchMevzi, state, searchLocation, searchRakimL, searchRakimH]);



  const updateState = async (mevziId) => {
    try {
      const response = await axios.get(`/api/mevzi/update-state/${mevziId}`);
      setMevziler((prevMevziler) =>
        prevMevziler.map((mevzi) =>
          mevzi.id === mevziId
            ? { ...mevzi, state: response.data.state }
            : mevzi
        )
      );
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
    if (mevziler && mevziler.length > 0) {
      mevziler.forEach((mevzi) => {
        if (mevzi && mevzi.frequency) {
          startOrUpdateInterval(mevzi);
        }
      });
    }
  }, [mevziler]);

  function highlightText(text, highlight) {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span> {
      parts.map((part, i) =>
        <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? 'highlight' : ''}>
          {part}
        </span>
      )
    } </span>;
  }

  return (
    <Container className="mevziler-main-container">
      <div className="mevziler-page-header-container">
        <div className="mevziler-page-header-add">
          <Typography
            className="mevziler-main-big-header"
            variant="h6"
            gutterBottom
            component="div"
          >
            Mevziler
            {isRoleAdmin && (
              <IconButton
                className="mevzi-add-button-in-header"
                size="large"
                onClick={() => navigate("/mevzi-ekle")}
              >
                <Tooltip title="Ekle">
                  <AddIcon />
                </Tooltip>
              </IconButton>
            )}
            <Tooltip title="Arama & Filtreleme">
              <IconButton
                size="large"
                className="mevzi-add-button-in-header"
                onClick={handleOpenModal}
              >
                <FilterAltIcon style={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Tooltip>
          </Typography>
        </div>
        <div className="mevziler-page-search-bar">
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="Ara & Filtrele"
            aria-describedby="Ara & Filtrele"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.4)",
                p: 4,
                outline: "none",
              }}
            >
              <Tooltip title="Tüm alanlarda arama yapılabilir!">
                <CustomTextField
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  placeholder="Ara..."
                  value={searchMevzi}
                  onChange={(e) => { if (modalOpen) setSearchMevzi(e.target.value); }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={!searchMevzi}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} />
              </Tooltip>


              <div style={{ display: "flex", alignItems: "center", flexDirection: 'row', marginTop: '10px', gap: '5px' }}>
                <div >Aktiflik Durumu:</div>
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox checked={state.aktif} onChange={handleChange} name="aktif" />}
                    label="Aktif"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={state.inaktif} onChange={handleChange} name="inaktif" />}
                    label="İnaktif"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={state.bilinmeyen} onChange={handleChange} name="bilinmeyen" />}
                    label="Bilinmeyen"
                  />
                </FormGroup>
              </div>


              <div style={{ display: "flex", alignItems: "center", flexDirection: 'row' }}>
                <div>Lokasyon:</div>
                <div style={{ marginLeft: "10px" }}>
                  <FormControlLabel
                    control={<Radio {...controlProps("a")} color="default" />}
                    label="Hepsi"
                  />

                  <FormControlLabel
                    control={<Radio {...controlProps("i")} color="default" />}
                    label="Yurt İçi"
                  />

                  <FormControlLabel
                    control={<Radio {...controlProps("d")} color="default" />}
                    label="Yurt Dışı"
                  />
                </div>
              </div>


              <div
                style={{
                  display: "flex",
                  marginTop: "10px",
                  flexDirection: "column",
                }}
              >
                <div>Rakım (metre):</div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <CustomTextField
                    autoComplete="off"
                    label="Alt Sınır"
                    variant="filled"
                    type="number"
                    inputProps={{ step: "10" }}
                    value={searchRakimL}
                    onChange={(e) => setSearchRakimL(e.target.value)}
                    margin="normal"
                  />

                  <div style={{ marginTop: "35px" }}>
                    <RemoveIcon />
                  </div>

                  <CustomTextField
                    autoComplete="off"
                    label="Üst Sınır"
                    variant="filled"
                    type="number"
                    inputProps={{ step: "10" }}
                    value={searchRakimH}
                    onChange={(e) => setSearchRakimH(e.target.value)}
                    margin="normal"
                  />
                </div>
              </div>

            </Box>
          </Modal>
        </div>
      </div>

      {filteredMevziler && filteredMevziler.length > 0 ? (
        <TableContainer
          className="mevziler-table-main-container"
          component={Paper}
        >
          <Table stickyHeader aria-label="mevzi table">
            <TableHead>
              <TableRow className="mevziler-sticky-header">
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("name")}
                    >
                      Mevzi Adı
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
                      onClick={() => handleRequestSort("isim")}
                    >
                      Karakol İsmi
                      {orderBy && orderBy === "isim" && (
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
                      onClick={() => handleRequestSort("kesif_tarihi")}
                    >
                      Keşif Tarihi
                      {orderBy && orderBy === "kesif_tarihi" && (
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
                      onClick={() => handleRequestSort("kordinat")}
                    >
                      Kordinat
                      {orderBy && orderBy === "kordinat" && (
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
                      onClick={() => handleRequestSort("rakim")}
                    >
                      Rakım
                      {orderBy && orderBy === "rakim" && (
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
                      onClick={() => handleRequestSort("ulasim")}
                    >
                      Ulaşım Şekli
                      {orderBy && orderBy === "ulasim" && (
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
                      onClick={() => handleRequestSort("bakim_sorumlusu_id")}
                    >
                      Bakım Sorumlusu
                      {orderBy && orderBy === "bakim_sorumlusu_id" && (
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
                      onClick={() => handleRequestSort("sube_id")}
                    >
                      İşleten Şube
                      {orderBy && orderBy === "sube" && (
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
                      onClick={() => handleRequestSort("kurulum_tarihi")}
                    >
                      Kurulum Tarihi
                      {orderBy && orderBy === "kurulum_tarihi" && (
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
                      onClick={() => handleRequestSort("d_sistemler")}
                    >
                      Dış Kurum Sistemleri
                      {orderBy && orderBy === "d_sistemler" && (
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
                      onClick={() => handleRequestSort("y_sistemler")}
                    >
                      Yazılıma Oluşturulan Sistemler
                      {orderBy && orderBy === "y_sistemler" && (
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
                      onClick={() => handleRequestSort("ip")}
                    >
                      IP Adresi
                      {orderBy && orderBy === "ip" && (
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
                  <Typography style={{ fontWeight: "bold", cursor: "default" }}>
                    Alt Yapı Bilgileri & Galeri
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "default" }}>
                    Görüntüle
                  </Typography>
                </TableCell>

                {isRoleAdmin && (
                  <>
                    <TableCell style={{ textAlign: "center" }}>
                      <Typography style={{ fontWeight: "bold" }}>
                        Envanter Çıkar & Düzenle & Sil
                      </Typography>
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortArray(
                filteredMevziler.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ),
                getComparator(order, orderBy)
              ).map((mevzi) => (
                <TableRow key={mevzi.id}>
                  <TableCell
                    style={{ textAlign: "center" }}
                    component="th"
                    scope="row"
                  >
                    {highlightText(mevzi.name, searchMevzi)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.isim ? highlightText(mevzi.isim, searchMevzi) : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.kesif_tarihi
                      ? highlightText(String(mevzi.kesif_tarihi), searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.kordinat
                      ? highlightText(mevzi.kordinat, searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.rakim
                      ? highlightText(String(mevzi.rakim), searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.lokasyon
                      ? highlightText(mevzi.lokasyon, searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.ulasim
                      ? highlightText(mevzi.ulasim, searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.bakim_sorumlusu_id
                      ? highlightText(mevzi.bakim_sorumlusu_id, searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.sube_id
                      ? highlightText(mevzi.sube_id, searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.kurulum_tarihi
                      ? highlightText(String(mevzi.kurulum_tarihi), searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.d_sistemler && mevzi.d_sistemler.length !== 0
                      ? highlightText(mevzi.d_sistemler.join(", "), searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.y_sistemler && mevzi.y_sistemler.length !== 0
                      ? highlightText(mevzi.y_sistemler.join(", "), searchMevzi)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.ip ? (
                      mevzi.state !== null && mevzi.state !== undefined ? (
                        <>
                          {mevzi.state < 1 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowDownIcon
                                  style={{ color: "red" }}
                                />
                                <span
                                  style={{ fontSize: "16px", color: "white" }}
                                >
                                  {highlightText('Inaktif', searchMevzi)}
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
                                Ip: {highlightText(mevzi.ip, searchMevzi)}
                              </span>
                            </>
                          )}
                          {mevzi.state === 2 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <KeyboardDoubleArrowUpIcon
                                  style={{ color: "green" }}
                                />
                                <span
                                  style={{ fontSize: "16px", color: "white" }}
                                >
                                  {highlightText('Aktif', searchMevzi)}
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
                                Ip: {highlightText(mevzi.ip, searchMevzi)}
                              </span>
                            </>
                          )}
                          {mevzi.state === 1 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <RemoveIcon style={{ color: "yellow" }} />
                                <span
                                  style={{ fontSize: "16px", color: "white" }}
                                >
                                  {highlightText('Bilinmiyor', searchMevzi)}
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
                                Ip: {highlightText(mevzi.ip, searchMevzi)}
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
                            {highlightText('Bilinmiyor', searchMevzi)}
                          </span>
                        </>
                      )
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      className="mevzi-alty-icon"
                      onClick={() => handleAltyClick(mevzi.id)}
                    >
                      <Tooltip title="Alt Yapı">
                        <ConstructionIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      className="mevzi-edit-icon"
                      onClick={() => handlePhotoClick(mevzi.name)}
                    >
                      <Tooltip title="Fotoğraflar">
                        <CollectionsIcon />
                      </Tooltip>
                    </IconButton>
                  </TableCell>
                  {/* </TableCell> */}
                  {/* <TableCell style={{ textAlign: "center" }}>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      className="mevzi-ip-icon"
                      onClick={() => handleIpClick(mevzi.id)}
                    >
                      <Tooltip title="Malzeme Ip">
                        <LocationOnIcon />
                      </Tooltip>
                    </IconButton>
                  </TableCell> */}

                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton
                      aria-label="edit"
                      size="small"
                      className="mevzi-export-icon"
                      onClick={() => handleViewMevziClick(mevzi)}
                    >
                      <Tooltip title="Detayları Görüntüle">
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
                          className="mevzi-export-icon"
                          onClick={() => handleExportMevziClick(mevzi)}
                        >
                          <Tooltip title="Envanter Özeti">
                            <GetAppIcon />
                          </Tooltip>
                        </IconButton>
                        {/* </TableCell>
                      <TableCell style={{ textAlign: "center" }}> */}
                        <IconButton
                          aria-label="edit"
                          size="small"
                          className="mevzi-edit-icon"
                          onClick={() => handleEditMevziClick(mevzi)}
                        >
                          <Tooltip title="Düzenle">
                            <EditIcon />
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          className="mevzi-delete-icon"
                          onClick={() => handleDeleteMevziClick(mevzi.id)}
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
            count={filteredMevziler.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <Typography className="no-mevzi-empty-message">
          Görüntülenecek Mevzi bulunmamaktadır.
        </Typography>
      )}
    </Container>
  );
}

export default Mevziler;
