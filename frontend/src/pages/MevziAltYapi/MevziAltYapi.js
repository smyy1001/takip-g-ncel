import InsightsIcon from '@mui/icons-material/Insights';
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
import Axios from "../../Axios";
import "./MevziAltYapi.css";
import { useParams } from "react-router-dom";

function MevziAltYapi({ isRoleAdmin, mevziler, fetchAllMevzi }) {
    const { id } = useParams();
    const [mevzi, setMevzi] = useState(null);

    //ALT Y
    const [iklim, setIklim] = useState(null);
    const [haber, setHaber] = useState(null);
    const [kalan, setKAlan] = useState(null);
    const [enerji, setEnerji] = useState(null);
    const [kabin, setKabin] = useState(null);

    useEffect(() => {
        if (mevziler) {
            const mevzi = mevziler.find((mevzi) => mevzi.id === id);
            setMevzi(mevzi);

            if (mevzi?.alt_y_id) {
                fetchAltYData(mevzi.alt_y_id);
            }
        }
    }, [mevziler, id]);

    useEffect(() => {
        fetchAllMevzi();
    }, [id]);

    const fetchAltYData = async (alt_y_id) => {
        try {
            // Fetch the alt_y data using the alt_y_id
            const altYResponse = await Axios.get(`/api/alt_y/${alt_y_id}`);
            const altYData = altYResponse.data;
            // console.log(altYData);

            // Fetch the individual related info based on the foreign keys
            if (altYData.iklim_alty) {
                const iklimResponse = await Axios.get(`/api/alt_y/iklim/${altYData.iklim_alty}`);
                // console.log(iklimResponse.data);
                setIklim(iklimResponse.data);
            }

            if (altYData.haberlesme_alty) {
                const haberResponse = await Axios.get(`/api/alt_y/haber/${altYData.haberlesme_alty}`);
                // console.log(haberResponse.data);
                setHaber(haberResponse.data);
            }

            if (altYData.kapali_alan_alty) {
                const kalanResponse = await Axios.get(`/api/alt_y/k_alan/${altYData.kapali_alan_alty}`);
                // console.log(kalanResponse.data);
                setKAlan(kalanResponse.data);
            }

            if (altYData.enerji_alty) {
                const enerjiResponse = await Axios.get(`/api/alt_y/enerji/${altYData.enerji_alty}`);
                // console.log(enerjiResponse.data);
                setEnerji(enerjiResponse.data);
            }

            if (altYData.kabin_alty) {
                const kabinResponse = await Axios.get(`/api/alt_y/kabin/${altYData.kabin_alty}`);
                // console.log(kabinResponse.data);
                setKabin(kabinResponse.data);
            }
        } catch (error) {
            console.error("Error fetching ALT Y data: ", error);
        }
    };

    return (
        <Container className="mevziler-main-container">
            <div className='mevziler-page-header-container'>
                <div className='mevziler-page-header-add'>
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
            {mevzi ? (
                <>
                    {/* ALTY */}
                    <TableContainer
                        className="mevziler-table-main-container"
                        component={Paper}
                    >
                        <>
                            <div className='meviz-alty-tables'>
                                {/* IKLIMLENDIRME */}
                                {/* <div className='mevzi-alty-table-title'>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                İklimlendirme Alt Yapısı
                            </Typography>
                        </div> */}

                                <Table stickyHeader aria-label="mevzi table">
                                    <TableHead>
                                        <TableRow className="mevziler-sticky-header">
                                            <TableCell style={{
                                                textAlign: "left",
                                                minWidth: "150px",
                                                maxWidth: "150px",
                                                width: "150px",
                                                fontWeight: "bold"
                                            }}>
                                                İklimlendirme Alt Yapısı:

                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Klima Durumları
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={iklim?.id || 'iklim'}>
                                            <TableCell style={{ textAlign: "left", backgroundColor: '#1f1f1f' }}></TableCell>
                                            <TableCell
                                                style={{ textAlign: "left" }}
                                                component="th"
                                                scope="row"
                                            >
                                                {iklim?.klima ? iklim.klima : "-"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className='meviz-alty-tables'>
                                {/* KABIN */}
                                {/* <div className='mevzi-alty-table-title'>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Kabin Alt Yapısı
                            </Typography>
                        </div> */}
                                <Table stickyHeader aria-label="mevzi table">
                                    <TableHead>
                                        <TableRow className="mevziler-sticky-header">
                                            <TableCell style={{
                                                textAlign: "left",
                                                minWidth: "150px",
                                                maxWidth: "150px",
                                                width: "150px",
                                                fontWeight: "bold"
                                            }}>
                                                Kabin Alt Yapısı:
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Rack Kabin Durumları
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={kabin?.id || 'kabin'}>
                                            <TableCell style={{ textAlign: "left", backgroundColor: '#1f1f1f' }}></TableCell>
                                            <TableCell
                                                style={{ textAlign: "left" }}
                                                component="th"
                                                scope="row"
                                            >
                                                {kabin?.rack_kabin ? kabin.rack_kabin : "-"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className='meviz-alty-tables'>
                                {/* Kapali Alan */}
                                {/* <div className='mevzi-alty-table-title'>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Kapalı Alan Alt Yapısı
                            </Typography>
                        </div> */}
                                <Table stickyHeader aria-label="mevzi table">
                                    <TableHead>
                                        <TableRow className="mevziler-sticky-header">
                                            <TableCell style={{
                                                textAlign: "left",
                                                minWidth: "150px",
                                                maxWidth: "150px",
                                                width: "150px",
                                                fontWeight: "bold"
                                            }}>
                                                Kapalı Alan Alt Yapısı:
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Konteyner Durumları
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={kalan?.id || 'KAlan'}>
                                            <TableCell style={{ textAlign: "left", backgroundColor: '#1f1f1f' }}></TableCell>
                                            <TableCell
                                                style={{ textAlign: "left" }}
                                                component="th"
                                                scope="row"
                                            >
                                                {kalan?.konteyner ? kalan.konteyner : "-"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className='meviz-alty-tables'>
                                {/* Enerji Alan */}
                                {/* <div className='mevzi-alty-table-title'>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Enerji Alt Yapısı
                            </Typography>
                        </div> */}
                                <Table stickyHeader aria-label="mevzi table">
                                    <TableHead>
                                        <TableRow className="mevziler-sticky-header">
                                            <TableCell style={{
                                                textAlign: "left",
                                                minWidth: "150px",
                                                maxWidth: "150px",
                                                width: "150px",
                                                fontWeight: "bold"
                                            }}>
                                                Enerji Alt Yapısı:
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Ölçülen Şebeke Elektriği Voltajı
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Jeneratör Durumlar
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Kesintisiz Güç Kaynağı Durumları
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Regülatör Durumları
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={enerji?.id || 'Enerji'}>
                                            <TableCell style={{ textAlign: "left", backgroundColor: '#1f1f1f' }}></TableCell>
                                            <TableCell
                                                style={{ textAlign: "left" }}
                                                component="th"
                                                scope="row"
                                            >
                                                {enerji?.voltaj ? enerji.voltaj : "-"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                {enerji?.jenerator ? enerji.jenerator : "-"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                {enerji?.guc_k ? enerji.guc_k : "-"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                {enerji?.regulator ? enerji.regulator : "-"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                            <div className='meviz-alty-tables'>
                                {/* Haberleşme */}
                                {/* <div className='mevzi-alty-table-title'>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Haberleşme Alt Yapısı
                            </Typography>
                        </div> */}
                                <Table stickyHeader aria-label="mevzi table">
                                    <TableHead>
                                        <TableRow className="mevziler-sticky-header">
                                            <TableCell style={{
                                                textAlign: "left",
                                                minWidth: "150px",
                                                maxWidth: "150px",
                                                width: "150px",
                                                fontWeight: "bold"
                                            }}>
                                                Haberleşme Alt Yapısı:
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    T. Durumları
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    R/L Durumları
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Uydu Durumları
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    Telekom Alt Yapısı Durumları
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                <Typography style={{ fontWeight: "bold" }}>
                                                    3G-4G Modem Durumları
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow key={haber?.id || 'Haber'}>
                                            <TableCell style={{ textAlign: "left", backgroundColor: '#1f1f1f' }}></TableCell>
                                            <TableCell
                                                style={{ textAlign: "left" }}
                                                component="th"
                                                scope="row"
                                            >
                                                {haber?.t ? haber.t : "-"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                {haber?.r_l ? haber.r_l : "-"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                {haber?.uydu ? haber.uydu : "-"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                {haber?.telekom ? haber.telekom : "-"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "left" }}>
                                                {haber?.g_modem ? haber.g_modem : "-"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                        </>
                    </TableContainer>
                </>
            ) : (
                <Typography className="no-mevzi-empty-message">
                    Görüntülenecek lat yapı bilgisi bulunmamaktadır.
                </Typography>
            )
            }
        </Container >
    );
}

export default MevziAltYapi;


