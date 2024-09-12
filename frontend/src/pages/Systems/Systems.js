import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Axios from '../../Axios';
import { message } from 'antd';
import './Systems.css';


function CollapsibleRow({ system, fetchSystems, isRoleAdmin, page, rowsPerPage }) {
    const [open, setOpen] = useState(false);
    const [malzemePage, setMalzemePage] = useState(0);
    const [malzemeRowsPerPage, setMalzemeRowsPerPage] = useState(5);
    const navigate = useNavigate();

    const handleEditSystemClick = async (id) => {
        navigate(`/sistemler/${id}`)
    };

    const handleDeleteSystemClick = async (id) => {
        try {
            const response = await Axios.delete(`/api/system/delete/${id}`);
            if (response.status === 200 || response.status === 204) {
                message.success('Sistem silindi!');
                fetchSystems();
            } else {
                message.error("Sistem silinemedi'");
            }
        } catch (error) {
            message.error(error.response?.data?.detail || error.message);
        }
    };

    const handleEditMalzemeClick = async (id) => {
        navigate(`/malzemeler/${id}`)
    };

    const handleDeleteMalzemeClick = async (id) => {
        try {
            const response = await Axios.delete(`/api/malzeme/delete/${id}`);
            if (response.status === 200 || response.status === 204) {
                message.success('Malzeme silindi!');
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

    const handleChangeMalzemeRowsPerPage = (event) => {
        setMalzemeRowsPerPage(parseInt(event.target.value, 10));
        setMalzemePage(0);  // Reset page to 0 when changing rows per page
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell className={`sys-malz-icon-cell ${open ? 'open' : ''}`} >
                    {open ? (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={system.malzemeler.length > 0 ? () => setOpen(!open) : null}
                        >
                            <Tooltip title="Kapat">
                                <KeyboardArrowDownIcon />
                            </Tooltip>
                        </IconButton>
                    ) : (
                        system.malzemeler.length > 0 ? (
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={system.malzemeler.length > 0 ? () => setOpen(!open) : null}
                            >
                                <Tooltip title="Aç">
                                    <KeyboardArrowRightIcon />
                                </Tooltip>
                            </IconButton>
                        ) : (
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={system.malzemeler.length > 0 ? () => setOpen(!open) : null}
                                style={{ cursor: 'default', backgroundColor: 'transparent' }}
                            >
                                <Tooltip title="Malzeme Bulunmamaktadır!">
                                    <HorizontalRuleIcon />
                                </Tooltip>
                            </IconButton>
                        )
                    )}

                </TableCell>
                {/* <TableCell style={{ textAlign: 'center' }}>{system.id}</TableCell> */}
                <TableCell style={{ textAlign: 'center' }}>{system.name}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.type_id ? system.type_id : '-'}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.marka_id ? system.marka_id : '-'}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.mmodel_id ? system.mmodel_id : '-'}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.seri_num ? system.seri_num : '-'}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.ilskili_unsur ? system.ilskili_unsur.join(', ') : '-'}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.depo === 0 ? 'Birim Depo' : system.depo === 1 ? 'Yedek Depo' : system.depo === 2 ? system.mevzi_id : '-'}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.giris_tarihi ? system.giris_tarihi : '-'}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{system.description ? system.description : '-'}</TableCell>
                {isRoleAdmin && (
                    <>
                        <TableCell style={{ textAlign: 'center' }}>
                            <IconButton
                                aria-label="edit"
                                size="small"
                                className='system-edit-icon'
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
                                className='system-delete-icon'
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
            <TableRow style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07))', backgroundColor: 'transparent' }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="malzemeler">
                                <TableHead>
                                    <TableRow style={{ backgroundColor: '#282828' }} >
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>İsim</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Tür</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Marka</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Model</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Seri No</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Lokasyon</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Envantere Giriş Tarihi</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Açıklama </TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Arıza Tarihleri</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Onarım Tarihleri</TableCell>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'small' }}>Bakım Tarihleri</TableCell>
                                        {isRoleAdmin && (
                                            <>
                                                <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Düzenle & Sil</TableCell>
                                                {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Sil</TableCell> */}
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {system.malzemeler
                                        .slice(malzemePage * malzemeRowsPerPage, (malzemePage + 1) * malzemeRowsPerPage)
                                        .map((malzeme, index) => (
                                            <TableRow key={index}>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.name}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.type_id ? malzeme.type : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.marka_id ? malzeme.marka : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.mmodel_id ? malzeme.model : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.seri_num ? malzeme.seri_num : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.depo === 0 ? 'Birim Depo' : malzeme.depo === 1 ? 'Yedek Depo' : malzeme.depo === 2 ? malzeme.mevzi_id : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.giris_tarihi ? malzeme.giris_tarihi : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.description ? malzeme.description : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.arizalar.length > 0 ? malzeme.arizalar.join(', ') : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.onarimlar.length > 0 ? malzeme.onarimlar.join(', ') : '-'}</TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>{malzeme.bakimlar.length > 0 ? malzeme.bakimlar.join(', ') : '-'}</TableCell>
                                                {isRoleAdmin && (
                                                    <>
                                                        <TableCell style={{ textAlign: 'center' }}>
                                                            <IconButton
                                                                aria-label="edit"
                                                                size="small"
                                                                className='system-edit-icon'
                                                                onClick={() => handleEditMalzemeClick(malzeme.id)}
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
                                                                className='system-delete-icon'
                                                                onClick={() => handleDeleteMalzemeClick(malzeme.id)}
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

function Systems({ isRoleAdmin, systems, fetchSystems }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleAddSystemClick = () => {
        navigate('/sistem-ekle');
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);  // Reset page to 0 when changing rows per page
    };

    useEffect(() => {
        fetchSystems();
    }, []);

    return (
        <Container className="system-main-container">
            <Typography className="systems-main-big-header" variant="h6" gutterBottom component="div">
                Sistemler
                {isRoleAdmin && (<IconButton
                    className="systems-add-button-in-header"
                    size="large"
                    onClick={() => handleAddSystemClick()}
                >
                    <Tooltip title="Ekle" >
                        <AddIcon />
                    </Tooltip>
                </IconButton>)
                }

            </Typography>
            {(systems && systems.length > 0) ? (
                <>
                    <TableContainer className='systems-table-main-container' component={Paper}>
                        <Table stickyHeader aria-label="collapsible table">
                            <TableHead>
                                <TableRow className='systems-sticky-header' >
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium', maxWidth: '50px' }}>Sistemdeki Malzemeler</TableCell>
                                    {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>ID</TableCell> */}
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>İsim</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Tür</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Marka</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Model</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Seri No</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>İlişkili Unsurlar</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Lokasyon</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Envantere Giriş Tarihi</TableCell>
                                    <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Açıklama</TableCell>
                                    {isRoleAdmin && (
                                        <>
                                            <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Düzenle & Sil</TableCell>
                                            {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 'medium' }}>Sil</TableCell> */}
                                        </>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {systems.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((system) => (
                                    <CollapsibleRow key={system.id} system={system} fetchSystems={fetchSystems} isRoleAdmin={isRoleAdmin} />
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="sticky-pagination"
                            rowsPerPageOptions={[5, 10]}
                            component="div"
                            count={systems.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </>
            ) : (
                <Typography className='no-systems-empty-message'>
                    Görüntülenecek Sistem bulunmamaktadır.
                </Typography>
            )}
        </Container>
    );
}

export default Systems;
