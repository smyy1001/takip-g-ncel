import React, { useEffect, useState } from "react";
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
import Axios from "../../Axios";
import { message } from "antd";
import AddIcon from "@mui/icons-material/Add";
import "./Malzemeler.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@mui/material/styles/styled";
import CollectionsIcon from "@mui/icons-material/Collections";

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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [malzemeler, setMalzemeler] = useState([]);
  const [searchMalzeme, setSearchMalzeme] = useState("");

  const updateDetails = async (malzemeler) => {
    const fetchMevzi = async () => {
      const response = await Axios.get("/api/mevzi/all");
      return response.data;
    };

    const fetchMModels = async () => {
      const response = await Axios.get("/api/model/all");
      return response.data;
    };

    const fetchMMarkalar = async () => {
      const response = await Axios.get("/api/marka/all");
      return response.data;
    };

    const fetchMTypes = async () => {
      const response = await Axios.get("/api/type/all");
      return response.data;
    };

    const fetchSystems = async () => {
      const response = await Axios.get("/api/system/all");
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
    // console.log('systems:', systems);
    

    // Update systems with mapped values
    return malzemeler.map((malzeme) => ({
      ...malzeme,
      mmodel_id:
        models.find((m) => m.id === malzeme.mmodel_id)?.name ||
        malzeme.mmodel_id,
      marka_id:
        markalar.find((m) => m.id === malzeme.marka_id)?.name ||
        malzeme.marka_id,
      type_id:
        types.find((t) => t.id === malzeme.type_id)?.name || malzeme.type_id,
      mevzi_id:
        mevziler.find((m) => m.id === malzeme.mevzi_id)?.name ||
        malzeme.mevzi_id,
      system_id:
        systems.find((m) => m.id === malzeme.system_id)?.name ||
        malzeme.system_id,
    }));
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
      const response = await Axios.delete(`/api/malzeme/delete/${id}`);
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

  const filteredMalzemeler = malzemeler.filter((m) =>
    m.name.toLowerCase().includes(searchMalzeme.toLowerCase())
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
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("system_id")}
                    >
                      İlişkili Sistem
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("type_id")}
                    >
                      Tür
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("marka_id")}
                    >
                      Marka
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("mmodel_id")}
                    >
                      Model
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
                    {malz.system_id ? malz.system_id : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.type_id ? malz.type_id : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.marka_id ? malz.marka_id : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {malz.mmodel_id ? malz.mmodel_id : "-"}
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
                      ? malz.mevzi_id
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
