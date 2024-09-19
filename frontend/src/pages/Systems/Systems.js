import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
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
import Axios from "../../Axios";
import { message } from "antd";
import "./Systems.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@mui/material/styles/styled";
import CollectionsIcon from "@mui/icons-material/Collections";

function CollapsibleRow({
  system,
  fetchSystems,
  isRoleAdmin,
  page,
  rowsPerPage,
  setSystems,
}) {
  const [open, setOpen] = useState(false);
  const [malzemePage, setMalzemePage] = useState(0);
  const [malzemeRowsPerPage, setMalzemeRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const handleEditSystemClick = async (id) => {
    navigate(`/sistemler/${id}`);
  };

  const handleSystemPhotoClick = async (name) => {
    navigate(`/system/gallery/${name}`);
  };

  const handleDeleteSystemClick = async (id) => {
    try {
      const response = await Axios.delete(`/api/system/delete/${id}`);
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
      const response = await Axios.delete(`/api/malzeme/delete/${id}`);
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
    setMalzemePage(0); // Reset page to 0 when changing rows per page
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
        {/* <TableCell style={{ textAlign: 'center' }}>{system.id}</TableCell> */}
        <TableCell style={{ textAlign: "center" }}>{system.name}</TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.type_id ? system.type_id : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.marka_id ? system.marka_id : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.mmodel_id ? system.mmodel_id : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.seri_num ? system.seri_num : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.ilskili_unsur ? system.ilskili_unsur.join(", ") : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.depo === 0
            ? "Birim Depo"
            : system.depo === 1
            ? "Yedek Depo"
            : system.depo === 2
            ? system.mevzi_id
            : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.giris_tarihi ? system.giris_tarihi : "-"}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          {system.description ? system.description : "-"}
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="malzemeler">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#282828" }}>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      İsim
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Tür
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Marka
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Model
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Seri No
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Lokasyon
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Envantere Giriş Tarihi
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Açıklama{" "}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Arıza Tarihleri
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Onarım Tarihleri
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "small",
                      }}
                    >
                      Bakım Tarihleri
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "medium",
                      }}
                    >
                      Fotoğraflar
                    </TableCell>
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
                        {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Sil</TableCell> */}
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {system.malzemeler
                    .slice(
                      malzemePage * malzemeRowsPerPage,
                      (malzemePage + 1) * malzemeRowsPerPage
                    )
                    .map((malzeme, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.name}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.type_id ? malzeme.type_id : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.marka_id ? malzeme.marka_id : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.mmodel_id ? malzeme.mmodel_id : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.seri_num ? malzeme.seri_num : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.depo === 0
                            ? "Birim Depo"
                            : malzeme.depo === 1
                            ? "Yedek Depo"
                            : malzeme.depo === 2
                            ? malzeme.mevzi_id
                            : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.giris_tarihi ? malzeme.giris_tarihi : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {malzeme.description ? malzeme.description : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {(malzeme.arizalar && malzeme.arizalar.length > 0) > 0
                            ? malzeme.arizalar.join(", ")
                            : "-"}
                        </TableCell>
                        <TableCell style={{ textAlign: "center" }}>
                          {(malzeme.onarimlar && malzeme.onarimlar.length > 0) >
                          0
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
                            onClick={() =>
                              handleMalzemePhotoClick(malzeme.name)
                            }
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
                                className="system-edit-icon"
                                onClick={() =>
                                  handleEditMalzemeClick(malzeme.id)
                                }
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

function Systems({ isRoleAdmin, initialSystems, fetchSystems }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [systems, setSystems] = useState([]);
  const [searchSistem, setSearchSistem] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleAddSystemClick = () => {
    navigate("/sistem-ekle");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const updateSystemDetails = async (systems) => {
    // Define your fetching functions here
    const fetchModels = async () => {
      const response = await Axios.get("/api/sys_model/all");
      return response.data;
    };

    const fetchMarkalar = async () => {
      const response = await Axios.get("/api/sys_marka/all");
      return response.data;
    };

    const fetchTypes = async () => {
      const response = await Axios.get("/api/systype/all");
      return response.data;
    };

    const fetchUnsur = async () => {
      const response = await Axios.get("/api/unsur/all");
      return response.data;
    };

    const fetchMevzi = async () => {
      const response = await Axios.get("/api/mevzi/all");
      return response.data;
    };

    // Fetch additional models, markalar, and types for malzemeler
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

    // Execute all fetches concurrently
    const [models, markalar, types, unsurlar, mevziler] = await Promise.all([
      fetchModels(),
      fetchMarkalar(),
      fetchTypes(),
      fetchUnsur(),
      fetchMevzi(),
    ]);

    const [models2, markalar2, types2] = await Promise.all([
      fetchMModels(),
      fetchMMarkalar(),
      fetchMTypes(),
    ]);

    // Update systems with mapped values
    return systems.map((system) => ({
      ...system,
      mmodel_id: models.find((m) => m.id === system.mmodel_id)?.name || null,
      marka_id: markalar.find((m) => m.id === system.marka_id)?.name || null,
      type_id: types.find((t) => t.id === system.type_id)?.name || null,
      mevzi_id: mevziler.find((m) => m.id === system.mevzi_id)?.name || null,
      ilskili_unsur:
        Array.isArray(system.ilskili_unsur) && system.ilskili_unsur.length > 0
          ? system.ilskili_unsur.map(
              (id) => unsurlar.find((u) => u.id === id)?.name || id
            )
          : null,

      malzemeler: system.malzemeler.map((malzeme) => ({
        ...malzeme,
        mmodel_id:
          models2.find((m) => m.id === malzeme.mmodel_id)?.name || null,
        marka_id:
          markalar2.find((m) => m.id === malzeme.marka_id)?.name || null,
        type_id: types2.find((t) => t.id === malzeme.type_id)?.name || null,
        mevzi_id: mevziler.find((m) => m.id === malzeme.mevzi_id)?.name || null,
      })),
    }));
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

  useEffect(() => {
    fetchSystems();
  }, []);

  // filter systems reagrding searchSistem keyword. if the keyword is empty, return all systems
  const filteredSystems = systems.filter((sys) =>
    sys.name.toLowerCase().includes(searchSistem.toLowerCase())
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
          </Typography>
        </div>
        <div className="systems-page-search-bar">
          <CustomTextField
            autoComplete="off"
            fullWidth
            variant="outlined"
            placeholder="Ara..."
            value={searchSistem}
            onChange={(e) => setSearchSistem(e.target.value)}
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
                  {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>ID</TableCell> */}
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    İsim
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Tür
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Marka
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Model
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Seri No
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    İlişkili Unsurlar
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Lokasyon
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Envantere Giriş Tarihi
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Açıklama
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "medium",
                    }}
                  >
                    Fotoğraflar
                  </TableCell>
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
                      {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Sil</TableCell> */}
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSystems
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((system) => (
                    <CollapsibleRow
                      key={system.id}
                      system={system}
                      fetchSystems={fetchSystems}
                      isRoleAdmin={isRoleAdmin}
                      setSystems={setSystems}
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
