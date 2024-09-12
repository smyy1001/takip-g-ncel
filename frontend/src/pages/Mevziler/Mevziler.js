import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TablePagination from '@mui/material/TablePagination';
import Axios from '../../Axios';
import { message } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import './Mevziler.css';

function Mevziler({ isRoleAdmin, mevziler, fetchAllMevzi }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

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
                message.success('Mevzi silindi!');
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
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
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
        return order === 'desc'
            ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    };

    return (
        <Container className="mevziler-main-container">
            <Typography className='mevziler-main-big-header' variant="h6" gutterBottom component="div">
                Mevziler
                {isRoleAdmin && (
                    <IconButton
                        className="mevzi-add-button-in-header"
                        size="large"
                        onClick={() => navigate('/mevzi-ekle')}
                    >
                        <Tooltip title="Ekle" >
                            <AddIcon />
                        </Tooltip>
                    </IconButton>
                )}
            </Typography>
            {(mevziler && mevziler.length > 0) ? (
                <TableContainer className='mevziler-table-main-container' component={Paper} >
                    <Table stickyHeader aria-label="mevzi table">
                        <TableHead>
                            <TableRow className='mevziler-sticky-header'>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('name')}>
                                            Mevzi Adı
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('isim')}>
                                            İsim
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('kesif_tarihi')}>
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
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('kordinat')}>
                                            Kordinat
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('rakim')}>
                                            Rakım
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('depo')}>
                                            Lokasyon
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('ulasim')}>
                                            Ulaşım Şekli
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('bakim_sorumlusu_id')}>
                                            Bakım Sorumlusu
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('sube_id')}>
                                            İşleten Şube
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('kurulum_tarihi')}>
                                            Kurulum Tarihi
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('d_sistemler')}>
                                            Dış Kurum Sistemleri
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <Tooltip title="Sıralamak için tıklayınız">
                                        <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRequestSort('y_sistemler')}>
                                            Yazılıma Oluşturulan Sistemler
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    {/* <Tooltip title="Sıralamak için tıklayınız"> */}
                                    <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                        IP Bilgileri
                                    </Typography>
                                    {/* </Tooltip> */}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    {/* <Tooltip title="Sıralamak için tıklayınız"> */}
                                    <Typography style={{ fontWeight: 'bold', cursor: 'pointer' }} >
                                        Alt Yapı Bilgileri
                                    </Typography>
                                    {/* </Tooltip> */}
                                </TableCell>

                                {isRoleAdmin && (
                                    <>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Typography style={{ fontWeight: 'bold' }}>
                                                Düzenle
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Typography style={{ fontWeight: 'bold' }}>
                                                Sil
                                            </Typography>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortArray(mevziler.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), getComparator(order, orderBy))
                                .map((mevzi) => (
                                    <TableRow key={mevzi.id}>
                                        <TableCell style={{ textAlign: 'center' }} component="th" scope="row">{mevzi.name}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.isim ? mevzi.isim : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.kesif_tarihi ? mevzi.kesif_tarihi : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.kordinat ? mevzi.kordinat : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.rakim ? mevzi.rakim : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{mevzi.lokasyon ? mevzi.lokasyon : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.ulasim ? mevzi.ulasim : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.bakim_sorumlusu_id ? mevzi.bakim_sorumlusu_id : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.sube_id ? mevzi.sube_id : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.kurulum_tarihi ? mevzi.kurulum_tarihi : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.d_sistemler ? mevzi.d_sistemler.join(', ') : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.y_sistemler ? mevzi.y_sistemler.join(', ') : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.ip_list ? mevzi.ip_list : '-'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }} >{mevzi.alt_y ? mevzi.aly_y : '-'}</TableCell>
                                        {isRoleAdmin && (
                                            <>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    <IconButton
                                                        aria-label="edit"
                                                        size="small"
                                                        className='mevzi-edit-icon'
                                                        onClick={() => handleEditMevziClick(mevzi)}
                                                    >
                                                        <Tooltip title="Düzenle">
                                                            <EditIcon />
                                                        </Tooltip>
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell style={{ textAlign: 'center' }}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        className='mevzi-delete-icon'
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
                        count={mevziler.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            ) : (
                <Typography className='no-mevzi-empty-message'>
                    Görüntülenecek Mevzi bulunmamaktadır.
                </Typography>
            )}

        </Container>
    );
}

export default Mevziler;
