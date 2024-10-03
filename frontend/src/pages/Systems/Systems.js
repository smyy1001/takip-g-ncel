import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { message } from "antd";
import "./Systems.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@mui/material/styles/styled";
import CollectionsIcon from "@mui/icons-material/Collections";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Autocomplete from '@mui/material/Autocomplete';


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

function CollapsibleRow({
  system,
  fetchSystems,
  isRoleAdmin,
  page,
  rowsPerPage,
  setSystems,
  searchSistem
}) {
  const [open, setOpen] = useState(false);
  const [malzemePage, setMalzemePage] = useState(0);
  const [malzemeRowsPerPage, setMalzemeRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [order2, setOrder2] = useState("asc");
  const [orderBy2, setOrderBy2] = useState("name");

  const handleEditSystemClick = async (id) => {
    navigate(`/sistemler/${id}`);
  };

  const handleSystemPhotoClick = async (name) => {
    navigate(`/system/gallery/${name}`);
  };

  const handleDeleteSystemClick = async (id) => {
    try {
      const response = await axios.delete(`/api/system/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Sistem silindi!");
        setSystems((prevSystems) =>
          prevSystems.filter((system) => system.id !== id)
        );
        fetchSystems();
      } else {
        message.error("Sistem silinemedi'");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleEditMalzemeClick = async (id) => {
    navigate(`/malzemeler/${id}`);
  };

  const handleDeleteMalzemeClick = async (id) => {
    try {
      const response = await axios.delete(`/api/malzeme/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Malzeme silindi!");
        fetchSystems();
      } else {
        message.error("Malzeme silinemedi'");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleChangeMalzemePage = (event, newPage) => {
    setMalzemePage(newPage);
  };

  const handleMalzemePhotoClick = async (name) => {
    navigate(`/malzeme/gallery/${name}`);
  };

  const handleChangeMalzemeRowsPerPage = (event) => {
    setMalzemeRowsPerPage(parseInt(event.target.value, 10));
    setMalzemePage(0);
  };

  const handleRequestSort2 = (property) => {
    const isAsc = orderBy2 === property && order2 === "asc";
    setOrder2(isAsc ? "desc" : "asc");
    setOrderBy2(property);
  };

  const sortArray2 = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator2 = (order2, orderBy2) => {
    return order2 === "desc"
      ? (a, b) => (b[orderBy2] < a[orderBy2] ? -1 : 1)
      : (a, b) => (a[orderBy2] < b[orderBy2] ? -1 : 1);
  };

  const handleViewSystemClick = async (id) => {
    navigate(`/sistem/${id}/bilgi`);
  };

  const handleViewMalzClick = async (id) => {
    navigate(`/malzeme/${id}/bilgi`);
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className={`sys-malz-icon-cell ${open ? "open" : ""}`}>
          {open ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={
                system.malzemeler.length > 0 ? () => setOpen(!open) : null
              }
            >
              <Tooltip title="Kapat">
                <KeyboardArrowDownIcon />
              </Tooltip>
            </IconButton>
          ) : system.malzemeler.length > 0 ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={
                system.malzemeler.length > 0 ? () => setOpen(!open) : null
              }
            >
              <Tooltip title="Aç">
                <KeyboardArrowRightIcon />
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={
                system.malzemeler.length > 0 ? () => setOpen(!open) : null
              }
              style={{ cursor: "default", backgroundColor: "transparent" }}
            >
              <Tooltip title="Malzeme Bulunmamaktadır!">
                <HorizontalRuleIcon />
              </Tooltip>
            </IconButton>
          )}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>{highlightText(system.name, searchSistem)}</TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.type_id ? highlightText(system.type_id, searchSistem) : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.marka_id ? highlightText(system.marka_id, searchSistem) : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.mmodel_id ? highlightText(system.mmodel_id, searchSistem) : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.seri_num ? highlightText(system.seri_num, searchSistem) : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.ilskili_unsur ? highlightText(system.ilskili_unsur.join(", "), searchSistem) : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.depo === 0
            ? highlightText("Birim Depo", searchSistem)
            : system.depo === 1
              ? highlightText("Yedek Depo", searchSistem)
              : system.depo === 2 && system.mevzi_name
                ? highlightText(system.mevzi_name, searchSistem)
                : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.giris_tarihi ? highlightText(system.giris_tarihi, searchSistem) : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.ip ? (
            system.state !== null && system.state !== undefined ? (
              <>
                {system.state < 1 && (
                  <>
                    <IconButton className="noHighlight" disableRipple>
                      <KeyboardDoubleArrowDownIcon style={{ color: "red" }} />
                      <span style={{ fontSize: "16px", color: "white" }}>
                        {highlightText('Inaktif', searchSistem)}
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
                      Ip: {highlightText(system.ip, searchSistem)}
                    </span>
                  </>
                )}
                {system.state === 2 && (
                  <>
                    <IconButton className="noHighlight" disableRipple>
                      <KeyboardDoubleArrowUpIcon style={{ color: "green" }} />
                      <span style={{ fontSize: "16px", color: "white" }}>
                        {highlightText('Aktif', searchSistem)}
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
                      Ip: {highlightText(system.ip, searchSistem)}
                    </span>
                  </>
                )}
                {system.state === 1 && (
                  <>
                    <IconButton className="noHighlight" disableRipple>
                      <RemoveIcon style={{ color: "yellow" }} />
                      <span style={{ fontSize: "16px", color: "white" }}>
                        {highlightText('Bilinmiyor', searchSistem)}
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
                      Ip: {highlightText(system.ip, searchSistem)}
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
                  {highlightText('Bilinmiyor', searchSistem)}
                </span>
              </>
            )
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.description ? highlightText(system.description, searchSistem): "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          <IconButton
            aria-label="photo-gallery"
            size="small"
            className="system-photo-gallery-icon"
            onClick={() => handleSystemPhotoClick(system.name)}
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
            onClick={() => handleViewSystemClick(system.id)}
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
                className="system-edit-icon"
                onClick={() => handleEditSystemClick(system.id)}
              >
                <Tooltip title="Düzenle">
                  <EditIcon />
                </Tooltip>
              </IconButton>
              {/* </TableCell>
                        <TableCell style={{ textAlign: 'center' }}> */}
              <IconButton
                aria-label="delete"
                size="small"
                className="system-delete-icon"
                onClick={() => handleDeleteSystemClick(system.id)}
              >
                <Tooltip title="Sil">
                  <DeleteIcon />
                </Tooltip>
              </IconButton>
            </TableCell>
          </>
        )}
      </TableRow>
      <TableRow
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))",
          backgroundColor: "transparent",
        }}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={14}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="malzemeler">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#282828" }}>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("name")}
                      >
                        İsim
                        {orderBy2 && orderBy2 === "name" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("type_id")}
                      >
                        Tür
                        {orderBy2 && orderBy2 === "type_id" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("marka_id")}
                      >
                        Marka
                        {orderBy2 && orderBy2 === "marka_id" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("mmodel_id")}
                      >
                        Model
                        {orderBy2 && orderBy2 === "mmodel_id" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("seri_num")}
                      >
                        Seri No
                        {orderBy2 && orderBy2 === "seri_num" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("depo")}
                      >
                        Lokasyon
                        {orderBy2 && orderBy2 === "depo" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("giris_tarihi")}
                      >
                        Envantere Giriş Tarihi
                        {orderBy2 && orderBy2 === "giris_tarihi" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("description")}
                      >
                        Açıklama
                        {orderBy2 && orderBy2 === "description" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("arizalar")}
                      >
                        Arıza Tarihleri
                        {orderBy2 && orderBy2 === "arizalar" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("onarimlar")}
                      >
                        Onarım Tarihleri
                        {orderBy2 && orderBy2 === "onarimlar" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title="Sıralamak için tıklayınız">
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "small",
                        }}
                        onClick={() => handleRequestSort2("bakimlar")}
                      >
                        Bakım Tarihleri
                        {orderBy2 && orderBy2 === "bakimlar" && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            style={{ margin: "0px", padding: "0px" }}
                          >
                            <SwapVertIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </Tooltip>

                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
                    >
                      Fotoğraflar
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
                        <TableCell
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "medium",
                          }}
                        >
                          Düzenle & Sil
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortArray2(
                    system.malzemeler.slice(
                      malzemePage * malzemeRowsPerPage,
                      (malzemePage + 1) * malzemeRowsPerPage
                    ),
                    getComparator2(order2, orderBy2)
                  ).map((malzeme, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ textAlign: "center" }}>
                        {highlightText(malzeme.name, searchSistem)}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {malzeme.type_id ? highlightText(malzeme.type_id, searchSistem) : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {malzeme.marka_id ? highlightText(malzeme.marka_id, searchSistem) : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {malzeme.mmodel_id ? highlightText(malzeme.mmodel_id, searchSistem) : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {malzeme.seri_num ? highlightText(malzeme.seri_num, searchSistem) : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {malzeme.depo === 0
                          ? highlightText("Birim Depo", searchSistem)
                          : malzeme.depo === 1
                            ? highlightText("Yedek Depo", searchSistem)
                            : malzeme.depo === 2 && malzeme.mevzi_name ?
                              highlightText(malzeme.mevzi_name, searchSistem)
                              : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {malzeme.giris_tarihi ? highlightText(malzeme.giris_tarihi, searchSistem) : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {malzeme.description ? highlightText(malzeme.description, searchSistem) : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {(malzeme.arizalar && malzeme.arizalar.length > 0) > 0
                          ? malzeme.arizalar.join(", ")
                          : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {(malzeme.onarimlar && malzeme.onarimlar.length > 0) > 0
                          ? malzeme.onarimlar.join(", ")
                          : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        {(malzeme.bakimlar && malzeme.bakimlar.length > 0) > 0
                          ? malzeme.bakimlar.join(", ")
                          : "-"}
                      </TableCell>
                      <TableCell style={{ textAlign: "center" }}>
                        <IconButton
                          aria-label="photo-gallery"
                          size="small"
                          className="system-photo-gallery-icon"
                          onClick={() => handleMalzemePhotoClick(malzeme.name)}
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
                          onClick={() => handleViewMalzClick(malzeme.id)}
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
                              className="system-edit-icon"
                              onClick={() => handleEditMalzemeClick(malzeme.id)}
                            >
                              <Tooltip title="Düzenle">
                                <EditIcon />
                              </Tooltip>
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              className="system-delete-icon"
                              onClick={() =>
                                handleDeleteMalzemeClick(malzeme.id)
                              }
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
                count={system.malzemeler.length}
                rowsPerPage={malzemeRowsPerPage}
                page={malzemePage}
                onPageChange={handleChangeMalzemePage}
                onRowsPerPageChange={handleChangeMalzemeRowsPerPage}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}



function Systems({ isRoleAdmin, initialSystems, fetchSystems }) {
  const [models, setModels] = useState([]);
  const [markalar, setMarkalar] = useState([]);
  const [types, setTypes] = useState([]);
  const [unsurlar, setUnsurlar] = useState([]);
  const [mevziler, setMevziler] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [systems, setSystems] = useState([]);
  const [searchSistem, setSearchSistem] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const stateIntervalIds = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
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

  const handleLocationChange = (event, newValue) => {
    setSelectedLocationIds(newValue.map((option) => option.id));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleAddSystemClick = () => {
    navigate("/sistem-ekle");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateSystemDetails = async (systems) => {
    const fetchModels = async () => {
      const response = await axios.get("/api/sys_model/all/");
      return response.data;
    };

    const fetchMarkalar = async () => {
      const response = await axios.get("/api/sys_marka/all/");
      return response.data;
    };

    const fetchTypes = async () => {
      const response = await axios.get("/api/systype/all/");
      return response.data;
    };

    const fetchUnsur = async () => {
      const response = await axios.get("/api/unsur/all/");
      return response.data;
    };

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

    try {
      const [fetchedModels, fetchedMarkalar, fetchedTypes, fetchedUnsurlar, fetchedMevziler] = await Promise.all([
        fetchModels(),
        fetchMarkalar(),
        fetchTypes(),
        fetchUnsur(),
        fetchMevzi(),
      ]);

      // Update state with the fetched data
      setModels(fetchedModels);
      setMarkalar(fetchedMarkalar);
      setTypes(fetchedTypes);
      setUnsurlar(fetchedUnsurlar);
      setMevziler(fetchedMevziler);

      // Fetch additional details for `malzemeler`
      const [models2, markalar2, types2] = await Promise.all([
        fetchMModels(),
        fetchMMarkalar(),
        fetchMTypes(),
      ]);

      // Map through the systems and attach the fetched details
      return systems.map((system) => ({
        ...system,
        // Map system level details
        mmodel_id: fetchedModels.find((m) => m.id === system.mmodel_id)?.name || null,
        marka_id: fetchedMarkalar.find((m) => m.id === system.marka_id)?.name || null,
        type_id: fetchedTypes.find((t) => t.id === system.type_id)?.name || null,
        mevzi_name: fetchedMevziler.find((m) => m.id === system.mevzi_id)?.name || null,
        ilskili_unsur:
          Array.isArray(system.ilskili_unsur) && system.ilskili_unsur.length > 0
            ? system.ilskili_unsur.map(
              (id) => fetchedUnsurlar.find((u) => u.id === id)?.name || id
            )
            : null,

        // Map malzemeler details
        malzemeler: system.malzemeler.map((malzeme) => ({
          ...malzeme,
          mmodel_id: models2.find((m) => m.id === malzeme.mmodel_id)?.name || null,
          marka_id: markalar2.find((m) => m.id === malzeme.marka_id)?.name || null,
          type_id: types2.find((t) => t.id === malzeme.type_id)?.name || null,
          mevzi_name: fetchedMevziler.find((m) => m.id === malzeme.mevzi_id)?.name || null,
        })),
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; // Return an empty array in case of error
    }
  };



  useEffect(() => {
    const updateData = async () => {
      if (initialSystems.length > 0) {
        const updatedSystems = await updateSystemDetails(initialSystems);
        setSystems(updatedSystems);
      }
    };
    updateData();
  }, [initialSystems]);

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

  const filteredSystems = useMemo(() => {
    const searchTerm = normalizeString(searchSistem);

    return systems
      .map((sys) => {
        const filteredMalzemeler = sys.malzemeler.filter((malz) => {
          const depoName = getDepoName(malz.depo);
          return (
            (malz.name && normalizeString(malz.name).includes(searchTerm)) ||
            (malz.marka_id &&
              normalizeString(malz.marka_id).includes(searchTerm)) ||
            (malz.mmodel_id &&
              normalizeString(malz.mmodel_id).includes(searchTerm)) ||
            (malz.seri_num &&
              normalizeString(malz.seri_num.toString()).includes(searchTerm)) ||
            (malz.type_id &&
              normalizeString(malz.type_id).includes(searchTerm)) ||
            (malz.description &&
              normalizeString(malz.description).includes(searchTerm)) ||
            (malz.giris_tarihi &&
              normalizeString(malz.giris_tarihi).includes(searchTerm)) ||
            (malz.arizalar &&
              normalizeString(malz.arizalar.join(",")).includes(searchTerm)) ||
            (malz.onarimlar &&
              normalizeString(malz.onarimlar.join(",")).includes(searchTerm)) ||
            (malz.bakimlar &&
              normalizeString(malz.bakimlar.join(",")).includes(searchTerm)) ||
            (malz.depo &&
              normalizeString(malz.depo.toString()).includes(searchTerm)) ||
            (depoName && normalizeString(depoName).includes(searchTerm)) ||
            (malz.mevzi_name &&
              normalizeString(malz.mevzi_name).includes(searchTerm))
          );
        });
        const systemDepoName = getDepoName(sys.depo);
        const systemStateName = getStateName(sys.state);
        const systemMatches =
          (sys.name && normalizeString(sys.name).includes(searchTerm)) ||
          (sys.marka_id &&
            normalizeString(sys.marka_id).includes(searchTerm)) ||
          (sys.mmodel_id &&
            normalizeString(sys.mmodel_id).includes(searchTerm)) ||
          (sys.seri_num &&
            normalizeString(sys.seri_num.toString()).includes(searchTerm)) ||
          (sys.ilskili_unsur &&
            normalizeString(sys.ilskili_unsur.join(",")).includes(searchTerm)) ||
          (sys.type_id && normalizeString(sys.type_id).includes(searchTerm)) ||
          (sys.description &&
            normalizeString(sys.description).includes(searchTerm)) ||
          (sys.giris_tarihi &&
            normalizeString(sys.giris_tarihi).includes(searchTerm)) ||
          (systemDepoName &&
            normalizeString(systemDepoName).includes(searchTerm)) ||
          (sys.mevzi_name &&
            normalizeString(sys.mevzi_name).includes(searchTerm)) ||
          (systemStateName &&
            normalizeString(systemStateName).includes(searchTerm)) ||
          (sys.ip && normalizeString(sys.ip).includes(searchTerm));

        // Apply State Filtering
        const stateFilterMatch =
          (sys.state === 2 && state.aktif) ||
          (sys.state === 0 && state.inaktif) ||
          (sys.state === 1 && state.bilinmeyen);

        // Apply Location Filtering
        const locationMatch = selectedLocationIds.length === 0 || selectedLocationIds.some((selectedId) => {
          if (selectedId === 0 || selectedId === 1) {
            return sys.depo === selectedId;
          }
          return sys.mevzi_id === selectedId;
        });

        // If system matches the state and location filters, and search term, include it
        if (systemMatches || filteredMalzemeler.length > 0) {
          if (stateFilterMatch && locationMatch) {
            return {
              ...sys,
              filteredMalzemeler,
            };
          }
        }

        return null;
      })
      .filter((sys) => sys !== null);
  }, [systems, searchSistem, state, selectedLocationIds]);



  // const filteredSystems = useMemo(() => {
  //   const searchTerm = normalizeString(searchSistem);

  //   return systems
  //     .map((sys) => {
  //       const filteredMalzemeler = sys.malzemeler.filter((malz) => {
  //         const depoName = getDepoName(malz.depo);
  //         return (
  //           (malz.name && normalizeString(malz.name).includes(searchTerm)) ||
  //           (malz.marka_id &&
  //             normalizeString(malz.marka_id).includes(searchTerm)) ||
  //           (malz.mmodel_id &&
  //             normalizeString(malz.mmodel_id).includes(searchTerm)) ||
  //           (malz.seri_num &&
  //             normalizeString(malz.seri_num.toString()).includes(searchTerm)) ||
  //           (malz.type_id &&
  //             normalizeString(malz.type_id).includes(searchTerm)) ||
  //           (malz.description &&
  //             normalizeString(malz.description).includes(searchTerm)) ||
  //           (malz.giris_tarihi &&
  //             normalizeString(malz.giris_tarihi).includes(searchTerm)) ||
  //           (malz.arizalar &&
  //             normalizeString(malz.arizalar.join(",")).includes(searchTerm)) ||
  //           (malz.onarimlar &&
  //             normalizeString(malz.onarimlar.join(",")).includes(searchTerm)) ||
  //           (malz.bakimlar &&
  //             normalizeString(malz.bakimlar.join(",")).includes(searchTerm)) ||
  //           (malz.depo &&
  //             normalizeString(malz.depo.toString()).includes(searchTerm)) ||
  //           (depoName && normalizeString(depoName).includes(searchTerm)) ||
  //           (malz.mevzi_id &&
  //             normalizeString(malz.mevzi_id).includes(searchTerm))
  //         );
  //       });
  //       const systemDepoName = getDepoName(sys.depo);
  //       const systemStateName = getStateName(sys.state);
  //       const systemMatches =
  //         (sys.name && normalizeString(sys.name).includes(searchTerm)) ||
  //         (sys.marka_id &&
  //           normalizeString(sys.marka_id).includes(searchTerm)) ||
  //         (sys.mmodel_id &&
  //           normalizeString(sys.mmodel_id).includes(searchTerm)) ||
  //         (sys.seri_num &&
  //           normalizeString(sys.seri_num.toString()).includes(searchTerm)) ||
  //         (sys.ilskili_unsur &&
  //           normalizeString(sys.ilskili_unsur.join(",")).includes(
  //             searchTerm
  //           )) ||
  //         (sys.type_id && normalizeString(sys.type_id).includes(searchTerm)) ||
  //         (sys.description &&
  //           normalizeString(sys.description).includes(searchTerm)) ||
  //         (sys.giris_tarihi &&
  //           normalizeString(sys.giris_tarihi).includes(searchTerm)) ||
  //         (systemDepoName &&
  //           normalizeString(systemDepoName).includes(searchTerm)) ||
  //         (sys.mevzi_id &&
  //           normalizeString(sys.mevzi_id).includes(searchTerm)) ||
  //         (systemStateName &&
  //           normalizeString(systemStateName).includes(searchTerm)) ||
  //         (sys.ip && normalizeString(sys.ip).includes(searchTerm));

  //       if (systemMatches || filteredMalzemeler.length > 0) {
  //         return {
  //           ...sys,
  //           filteredMalzemeler,
  //         };
  //       }

  //       return null;
  //     })
  //     .filter((sys) => sys !== null);
  // }, [systems, searchSistem]);

  const updateState = async (systemId) => {
    try {
      const response = await axios.get(`/api/system/update-state/${systemId}`);
      setSystems((prevSystems) =>
        prevSystems.map((system) =>
          system.id === systemId
            ? { ...system, state: response.data.state }
            : system
        )
      );
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
    if (systems && systems.length > 0) {
      systems.forEach((system) => {
        if (system && system.frequency) {
          startOrUpdateInterval(system);
        }
      });
    }
  }, [systems]);

  useEffect(() => {
    fetchSystems();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (mevziler && mevziler.length > 0) {
      const newOptions = [
        { id: 0, title: "Birim Depo" },
        { id: 1, title: "Yedek Depo" },
        ...mevziler.map((m) => ({ id: m.id, title: m.name }))
      ];
      setOptions(newOptions);
    }
  }, [mevziler]);

  const selectedLocations = options.filter((option) =>
    selectedLocationIds.includes(option.id)
  );

  return (
    <Container className="system-main-container">
      <div className="systems-page-header-container">
        <div className="systems-page-header-add">
          <Typography
            className="systems-main-big-header"
            variant="h6"
            gutterBottom
            component="div"
          >
            Sistemler
            {isRoleAdmin && (
              <IconButton
                className="systems-add-button-in-header"
                size="large"
                onClick={() => handleAddSystemClick()}
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
                <FilterAltIcon style={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Tooltip>
          </Typography>
        </div>
        <div className="systems-page-search-bar">
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
                  value={searchSistem}
                  onChange={(e) => { if (modalOpen) setSearchSistem(e.target.value); }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton disabled={!searchSistem}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Tooltip>

              <div style={{ display: "flex", alignItems: "center", flexDirection: 'row', marginTop: '15px', gap: '5px' }}>
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


              <div style={{ display: "flex", alignItems: "center", flexDirection: 'row', marginTop: '10px' }}>
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
                      <CustomTextField {...params} label="Lokasyon" placeholder="Lokasyonlar Seçiniz" />
                    )}
                  />
                </div>
              </div>

            </Box>
          </Modal>
        </div>
      </div>

      {filteredSystems && filteredSystems.length > 0 ? (
        <>
          <TableContainer
            className="systems-table-main-container"
            component={Paper}
          >
            <Table stickyHeader aria-label="collapsible table">
              <TableHead>
                <TableRow className="systems-sticky-header">
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                      minWidth: "100px",
                      maxWidth: "100px",
                    }}
                  >
                    Sistemdeki Malzemeler
                  </TableCell>

                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
                      onClick={() => handleRequestSort("name")}
                    >
                      İsim
                      {orderBy && orderBy === "name" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
                      onClick={() => handleRequestSort("type_id")}
                    >
                      Tür
                      {orderBy && orderBy === "type_id" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
                      onClick={() => handleRequestSort("marka_id")}
                    >
                      Marka
                      {orderBy && orderBy === "marka_id" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
                      onClick={() => handleRequestSort("mmodel_id")}
                    >
                      Model
                      {orderBy && orderBy === "mmodel_id" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
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
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
                      onClick={() => handleRequestSort("ilskili_unsur")}
                    >
                      İlişkili Unsurlar
                      {orderBy && orderBy === "ilskili_unsur" && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          style={{ margin: "0px", padding: "0px" }}
                        >
                          <SwapVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
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
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
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
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
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
                    </TableCell>
                  </Tooltip>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
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
                    </TableCell>
                  </Tooltip>

                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Fotoğraflar
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
                      <TableCell
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "medium",
                        }}
                      >
                        Düzenle & Sil
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortArray(
                  filteredSystems.slice(
                    page * rowsPerPage,
                    (page + 1) * rowsPerPage
                  ),
                  getComparator(order, orderBy)
                ).map((system) => (
                  <CollapsibleRow
                    key={system.id}
                    system={system}
                    fetchSystems={fetchSystems}
                    isRoleAdmin={isRoleAdmin}
                    setSystems={setSystems}
                    searchSistem={searchSistem}
                  />
                ))}
              </TableBody>
            </Table>
            <TablePagination
              className="sticky-pagination"
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={filteredSystems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      ) : (
        <Typography className="no-systems-empty-message">
          Görüntülenecek Sistem bulunmamaktadır.
        </Typography>
      )}
    </Container>
  );
}

export default Systems;
