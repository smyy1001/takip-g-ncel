import InsightsIcon from "@mui/icons-material/Insights";
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
import "./MevziIp.css";
import { useParams } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";

function MevziIp({
  isRoleAdmin,
  mevziler,
  fetchAllMevzi,
  malzMatch,
  fetchMalzMatch,
}) {
  const { id } = useParams();
  const [chosenMalzMatch, setChosenMalzMatch] = useState([]);
  const [mevzi, setMevzi] = useState(null);

    useEffect(() => {
        fetchMalzMatch();
        fetchAllMevzi();
    }, [id]);
    
  useEffect(() => {
    if (mevziler) {
      const mevzi = mevziler.find((mevzi) => mevzi.id === id);
      setMevzi(mevzi);
    }
  }, [mevziler, id]);

  // IP
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("malzeme_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (Array.isArray(malzMatch)) {
      const chosenMalzMatchtemp = malzMatch.filter(
        (m) => m.mevzi_id.toString() === id.toString()
      );
        setChosenMalzMatch(chosenMalzMatchtemp);
    }
  }, [malzMatch, id]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  return (
    <Container className="mevziler-main-container">
      <div className="mevziler-page-header-container">
        <div className="mevziler-page-header-add">
          <Typography
            className="mevziler-main-big-header"
            variant="h4"
            gutterBottom
            component="div"
          >
            Mevzi: {mevzi?.name}
          </Typography>
        </div>
      </div>
      {chosenMalzMatch && chosenMalzMatch.length > 0 ? (
        <>
          {/* ALTY */}
          <TableContainer
            className="mevziler-table-main-container"
            component={Paper}
          >
            <>
              <div className="meviz-alty-tables">
                <Table stickyHeader aria-label="mevzi table">
                  <TableHead>
                    <TableRow className="mevziler-sticky-header">
                      <TableCell
                        style={{
                          textAlign: "left",
                          minWidth: "400px",
                          maxWidth: "400px",
                          width: "400px",
                          fontWeight: "bold",
                        }}
                      >
                        Mevzideki Sistemlerin Malzemelerine atanan IP Adresleri
                      </TableCell>
                      {/* <TableCell style={{ textAlign: "left" }}>
                                            <Typography style={{ fontWeight: "bold" }}>
                                                Sistem Adı
                                            </Typography>
                                        </TableCell> */}
                      <TableCell style={{ textAlign: "left" }}>
                        <Typography
                          style={{ fontWeight: "bold" }}
                          onClick={() => handleRequestSort("malzeme_name")}
                        >
                          Malzeme Adı
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "left" }}>
                        <Typography
                          style={{ fontWeight: "bold" }}
                          onClick={() => handleRequestSort("ip")}
                        >
                          Ip Adresi
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortArray(
                      chosenMalzMatch.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ),
                      getComparator(order, orderBy)
                    ).map((malz) => (
                      <TableRow key={malz?.malzeme_name || "name"}>
                        <TableCell
                          style={{
                            textAlign: "left",
                            backgroundColor: "#1f1f1f",
                          }}
                        ></TableCell>
                        <TableCell
                          style={{ textAlign: "left" }}
                          component="th"
                          scope="row"
                        >
                          {malz?.malzeme_name ? malz.malzeme_name : "-"}
                        </TableCell>
                        <TableCell
                          style={{ textAlign: "left" }}
                          component="th"
                          scope="row"
                        >
                          {malz?.ip ? malz.ip : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  className="sticky-pagination"
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={chosenMalzMatch.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </>
          </TableContainer>
        </>
      ) : (
        <Typography className="no-mevzi-empty-message">
          Görüntülenecek IP bilgisi bulunmamaktadır.
        </Typography>
      )}
    </Container>
  );
}

export default MevziIp;
