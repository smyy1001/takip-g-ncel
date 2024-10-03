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
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CustomAutocompleteTextField = styled(Autocomplete)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white !important",
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
    '&[aria-selected="true"]': {
      backgroundColor: "#423532",
    },
    "&:hover": {
      backgroundColor: "#332725",
    },
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

function Malzemeler({ isRoleAdmin, initialMalzemeler, fetchMalzemeler }) {
  const [models, setModels] = useState([]);
  const [markalar, setMarkalar] = useState([]);
  const [types, setTypes] = useState([]);
  const [systems, setSystems] = useState([]);
  const [mevziler, setMevziler] = useState([]);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [malzemeler, setMalzemeler] = useState([]);
  const [searchMalzeme, setSearchMalzeme] = useState("");
  const stateIntervalIds = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [selectedSistemIds, setSelectedSistemIds] = useState([]);
  const [state, setState] = useState({
    aktif: true,
    inaktif: true,
    bilinmeyen: true,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const handleLocationChange = (event, newValue) => {
    setSelectedLocationIds(newValue.map((option) => option.id));
  };

  const handleSistemChange = (event, newValue) => {
    setSelectedSistemIds(newValue.map((option) => option.id));
  };

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

    try {
      // Execute all fetches concurrently
      const [
        fetchedModels,
        fetchedMarkalar,
        fetchedTypes,
        fetchedMevziler,
        fetchedSystems,
      ] = await Promise.all([
        fetchMModels(),
        fetchMMarkalar(),
        fetchMTypes(),
        fetchMevzi(),
        fetchSystems(),
      ]);

      // Update state with the fetched data
      setModels(fetchedModels);
      setMarkalar(fetchedMarkalar);
      setTypes(fetchedTypes);
      setSystems(fetchedSystems);
      setMevziler(fetchedMevziler);

      return malzemeler.map((malzeme) => {
        return {
          ...malzeme,
          mmodel_name:
            fetchedModels.find((m) => m.id === malzeme.mmodel_id)?.name || null,
          marka_name:
            fetchedMarkalar.find((m) => m.id === malzeme.marka_id)?.name ||
            null,
          type_name:
            fetchedTypes.find((t) => t.id === malzeme.type_id)?.name || null,
          mevzi_name:
            fetchedMevziler.find((m) => m.id === malzeme.mevzi_id)?.name ||
            null,
          system_name:
            fetchedSystems.find((m) => m.id === malzeme.system_id)?.name ||
            null,
        };
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const updateData = async () => {
      console.log("Initial Malzemeler:", initialMalzemeler);
      if (initialMalzemeler.length > 0) {
        const updatedMalzemeler = await updateDetails(initialMalzemeler);
        setMalzemeler(updatedMalzemeler);
        console.log("updatedMalzemeler", updatedMalzemeler);
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

  const getDepoName = (depo) => {
    if (depo === 0) return "Birim Depo";
    if (depo === 1) return "Yedek Depo";
    return null;
  };

  const getStateName = (state) => {
    if (state < 1) return "İnaktif";
    if (state === 2) return "Aktif";
    return "Bilinmiyor";
  };

  function highlightText(text, highlight) {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            className={
              part.toLowerCase() === highlight.toLowerCase() ? "highlight" : ""
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  }

  const filteredMalzemeler = useMemo(() => {
    const searchTerm = normalizeString(searchMalzeme);

    return malzemeler.filter((m) => {
      const malzemeDepoName = getDepoName(m.depo);
      const malzemeStateName = getStateName(m.state);

      // Apply State Filtering
      const stateFilterMatch =
        (m.state === 2 && state.aktif) ||
        (m.state === 0 && state.inaktif) ||
        (m.state === 1 && state.bilinmeyen);

      // Apply Location Filtering
      const locationMatch =
        selectedLocationIds.length === 0 ||
        selectedLocationIds.some((selectedId) => {
          if (selectedId === 0 || selectedId === 1) {
            return m.depo === selectedId;
          }
          return m.mevzi_id === selectedId;
        });

      const sistemMatch =
        selectedSistemIds.length === 0 ||
        selectedSistemIds.some((selectedId) => {
          return m.system_id === selectedId;
        });

      // Check if the malzeme matches the search term or any other filter
      const searchMatch =
        (m.name && normalizeString(m.name).includes(searchTerm)) ||
        (m.system_name &&
          normalizeString(m.system_name).includes(searchTerm)) ||
        (m.type_name && normalizeString(m.type_name).includes(searchTerm)) ||
        (m.marka_name && normalizeString(m.marka_name).includes(searchTerm)) ||
        (m.mmodel_name &&
          normalizeString(m.mmodel_name).includes(searchTerm)) ||
        (m.seri_num &&
          normalizeString(m.seri_num.toString()).includes(searchTerm)) ||
        (m.mevzi_name && normalizeString(m.mevzi_name).includes(searchTerm)) ||
        (malzemeDepoName &&
          normalizeString(malzemeDepoName).includes(searchTerm)) ||
        (m.giris_tarihi &&
          normalizeString(m.giris_tarihi).includes(searchTerm)) ||
        (m.description &&
          normalizeString(m.description).includes(searchTerm)) ||
        (m.arizalar &&
          m.arizalar.length > 0 &&
          normalizeString(m.arizalar.join(", ")).includes(searchTerm)) ||
        (m.onarimlar &&
          m.onarimlar.length > 0 &&
          normalizeString(m.onarimlar.join(", ")).includes(searchTerm)) ||
        (m.bakimlar &&
          m.bakimlar.length > 0 &&
          normalizeString(m.bakimlar.join(", ")).includes(searchTerm)) ||
        (malzemeStateName &&
          normalizeString(malzemeStateName).includes(searchTerm)) ||
        (m.ip && normalizeString(m.ip).includes(searchTerm));

      // Return only if both state and location filters match
      return searchMatch && stateFilterMatch && locationMatch && sistemMatch;
    });
  }, [
    malzemeler,
    searchMalzeme,
    state,
    selectedLocationIds,
    selectedSistemIds,
  ]);

  const updateState = async (malzemeId) => {
    try {
      const response = await axios.get(
        `/api/malzeme/update-state/${malzemeId}`
      );
      setMalzemeler((prevMalzemeler) =>
        prevMalzemeler.map((malzeme) =>
          malzeme.id === malzemeId
            ? { ...malzeme, state: response.data.state }
            : malzeme
        )
      );
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
    if (malzemeler && malzemeler.length > 0) {
      malzemeler.forEach((malzeme) => {
        if (malzeme && malzeme.frequency) {
          startOrUpdateInterval(malzeme);
        }
      });
    }
  }, [malzemeler]);

  const handleViewMalzemeClick = async (id) => {
    navigate(`/malzeme/${id}/bilgi`);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);

  useEffect(() => {
    if (mevziler && mevziler.length > 0) {
      const newOptions = [
        { id: 0, title: "Birim Depo" },
        { id: 1, title: "Yedek Depo" },
        ...mevziler.map((m) => ({ id: m.id, title: m.name })),
      ];
      setOptions(newOptions);
    }
  }, [mevziler]);

  useEffect(() => {
    if (systems && systems.length > 0) {
      const newOptions = [...systems.map((m) => ({ id: m.id, title: m.name }))];
      setOptions2(newOptions);
    }
  }, [systems]);

  const selectedLocations = options.filter((option) =>
    selectedLocationIds.includes(option.id)
  );

  const selectedSistems = options2.filter((option) =>
    selectedSistemIds.includes(option.id)
  );

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
            <Tooltip title="Arama & Filtreleme">
              <IconButton
                size="large"
                // style={{ margin: "0px", padding: "0px" }}
                className="mevzi-add-button-in-header"
                onClick={handleOpenModal}
              >
                <FilterAltIcon style={{ fontSize: "1.5rem" }} />
              </IconButton>
            </Tooltip>
          </Typography>
        </div>
        <div className="malzemeler-page-search-bar">
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
              <Tooltip title="Tüm alanlarda arama yapılabilir (Sistemlerdeki Malzemeler Dahil)!">
                <CustomTextField
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  placeholder="Ara..."
                  value={searchMalzeme}
                  onChange={(e) => {
                    if (modalOpen) setSearchMalzeme(e.target.value);
                  }}
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
              </Tooltip>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: "10px",
                }}
              >
                <div>Ekli Olduğu Sistem:</div>
                <div style={{ marginLeft: "15px" }}>
                  <CustomAutocompleteTextField
                    multiple
                    fullWidth
                    id="checkboxes-tags"
                    options={options2}
                    disableCloseOnSelect
                    value={selectedSistems}
                    getOptionLabel={(option) => option.title}
                    onChange={handleSistemChange}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.title}
                      </li>
                    )}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Sistem"
                        placeholder="Sistemler Seçiniz"
                      />
                    )}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: "15px",
                  gap: "5px",
                }}
              >
                <div>Aktiflik Durumu:</div>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.aktif}
                        onChange={handleChange}
                        name="aktif"
                      />
                    }
                    label="Aktif"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.inaktif}
                        onChange={handleChange}
                        name="inaktif"
                      />
                    }
                    label="İnaktif"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.bilinmeyen}
                        onChange={handleChange}
                        name="bilinmeyen"
                      />
                    }
                    label="Bilinmeyen"
                  />
                </FormGroup>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: "10px",
                }}
              >
                <div>Lokasyon:</div>
                <div style={{ marginLeft: "15px" }}>
                  <CustomAutocompleteTextField
                    multiple
                    fullWidth
                    id="checkboxes-tags"
                    options={options}
                    disableCloseOnSelect
                    value={selectedLocations}
                    getOptionLabel={(option) => option.title}
                    onChange={handleLocationChange}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.title}
                      </li>
                    )}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Lokasyon"
                        placeholder="Lokasyonlar Seçiniz"
                      />
                    )}
                  />
                </div>
              </div>
            </Box>
          </Modal>
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

                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "medium",
                  }}
                  onClick={() => handleRequestSort("ip")}
                >
                  <Tooltip title="Sıralamak için tıklayınız">
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
                    {malz.name ? highlightText(malz.name, searchMalzeme) : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.system_name
                      ? highlightText(malz.system_name, searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.type_name
                      ? highlightText(malz.type_name, searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.marka_name
                      ? highlightText(malz.marka_name, searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.mmodel_name
                      ? highlightText(malz.mmodel_name, searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.seri_num
                      ? highlightText(malz.seri_num, searchMalzeme)
                      : "-"}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    {malz.depo === 0
                      ? highlightText("Birim Depo", searchMalzeme)
                      : malz.depo === 1
                      ? highlightText("Yedek Depo", searchMalzeme)
                      : malz.depo === 2
                      ? malz.mevzi_name
                        ? highlightText(malz.mevzi_name, searchMalzeme)
                        : highlightText("Bilinmeyen Mevzi", searchMalzeme)
                      : "-"}
                  </TableCell>

                  <TableCell style={{ textAlign: "center" }}>
                    {malz.giris_tarihi
                      ? highlightText(malz.giris_tarihi, searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.ip ? (
                      malz.state !== null && malz.state !== undefined ? (
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
                                  {highlightText("Inaktif", searchMalzeme)}
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
                                Ip: {highlightText(malz.ip, searchMalzeme)}
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
                                  {highlightText("Aktif", searchMalzeme)}
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
                                Ip: {highlightText(malz.ip, searchMalzeme)}
                              </span>
                            </>
                          )}
                          {malz.state === 1 && (
                            <>
                              <IconButton className="noHighlight" disableRipple>
                                <RemoveIcon style={{ color: "yellow" }} />
                                <span
                                  style={{ fontSize: "16px", color: "white" }}
                                >
                                  {highlightText("Bilinmiyor", searchMalzeme)}
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
                                Ip: {highlightText(malz.ip, searchMalzeme)}
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
                            {highlightText("Bilinmiyor", searchMalzeme)}
                          </span>
                        </>
                      )
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.description
                      ? highlightText(malz.description, searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {(malz.arizalar && malz.arizalar.length) > 0
                      ? highlightText(malz.arizalar.join(", "), searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {(malz.onarimlar && malz.onarimlar.length) > 0
                      ? highlightText(malz.onarimlar.join(", "), searchMalzeme)
                      : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {(malz.bakimlar && malz.bakimlar.length) > 0
                      ? highlightText(malz.bakimlar.join(", "), searchMalzeme)
                      : "-"}
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
