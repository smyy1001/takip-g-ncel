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
import "./Mevziler.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@mui/material/styles/styled";
import CollectionsIcon from "@mui/icons-material/Collections";
import ConstructionIcon from '@mui/icons-material/Construction';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

  const updateDetails = async (mevziler) => {
    const fetchSube = async () => {
      const response = await Axios.get("/api/sube/all");
      return response.data;
    };

    const fetchBS = async () => {
      const response = await Axios.get("/api/bakimsorumlulari/all");
      return response.data;
    };

    const fetchSistemler = async () => {
      const response = await Axios.get("/api/sistem/all");
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

  const handleAltyClick = async (id) => {
    navigate(`/mevziler/${id}/altyapi`);
  };

  const handleIpClick = async (id) => {
    navigate(`/mevziler/${id}/ip`);
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
      const response = await Axios.delete(`/api/mevzi/delete/${id}`);
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

  const filteredMevziler = mevziler.filter((m) =>
    m.name.toLowerCase().includes(searchMevzi.toLowerCase())
  );

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
          </Typography>
        </div>
        <div className="mevziler-page-search-bar">
          <CustomTextField
            autoComplete="off"
            fullWidth
            variant="outlined"
            placeholder="Ara..."
            value={searchMevzi}
            onChange={(e) => setSearchMevzi(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton disabled={!searchMevzi}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("isim")}
                    >
                      İsim
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
                    </Typography>
                  </Tooltip>
                </TableCell>
                {/* <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('desciption')}>
                                            Açıklama
                                        </Typography>
                                    </Tooltip>
                                </TableCell> */}
                <TableCell style={{ textAlign: "center" }}>
                  <Tooltip title="Sıralamak için tıklayınız">
                    <Typography
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleRequestSort("kordinat")}
                    >
                      Kordinat
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
                      onClick={() => handleRequestSort("ulasim")}
                    >
                      Ulaşım Şekli
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
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "default" }}>
                    Alt Yapı Bilgileri
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "default" }}>
                    Malzeme IP Bilgileri
                  </Typography>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Typography style={{ fontWeight: "bold", cursor: "default" }}>
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
                    {mevzi.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.isim ? mevzi.isim : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.kesif_tarihi ? mevzi.kesif_tarihi : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.kordinat ? mevzi.kordinat : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.rakim ? mevzi.rakim : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.lokasyon ? mevzi.lokasyon : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.ulasim ? mevzi.ulasim : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.bakim_sorumlusu_id ? mevzi.bakim_sorumlusu_id : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.sube_id ? mevzi.sube_id : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.kurulum_tarihi ? mevzi.kurulum_tarihi : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.d_sistemler ? mevzi.d_sistemler.join(", ") : "-"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {mevzi.y_sistemler ? mevzi.y_sistemler.join(", ") : "-"}
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
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
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
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
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
                  {/* <TableCell style={{ textAlign: "center" }}>
                                        {mevzi.ip_list ? mevzi.ip_list : "-"}
                                    </TableCell>
                                    <TableCell style={{ textAlign: "center" }}>
                                        {mevzi.alt_y ? mevzi.aly_y : "-"}
                                    </TableCell> */}
                  {isRoleAdmin && (
                    <>
                      <TableCell style={{ textAlign: "center" }}>
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
