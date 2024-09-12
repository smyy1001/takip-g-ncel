import React from 'react';
import './MevziPanel.css';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Axios from '../../Axios';
import { message } from 'antd';


const MevziPanel = ({ mevziler, fetchAllMevzi, isOpen, togglePanel, isRoleAdmin }) => {
    const navigate = useNavigate();


    // // DELETE METHODS
    // const handleDeleteMevziClick = async (id, event) => {
    //     event.stopPropagation();
    //     try {
    //         const response = await Axios.delete(`/api/mevzi/delete/${id}`);
    //         if (response.status === 200 || response.status === 204) {
    //             message.success('Mevzi silindi!');
    //             fetchAllMevzi();
    //         } else {
    //             message.error("Mevzş silinemedi'");
    //         }
    //     } catch (error) {
    //         message.error(error.response?.data?.detail || error.message);
    //     }
    // }


    //NAVIGATE 
    const toMevziler = async () => {
        navigate('/mevziler')
    };


    const handleEditMevziClick = async (mevzi) => {
        navigate(`/mevziler/${mevzi.id}`)
    };

    return (
        <div className={`mevzi-sliding-panel ${isOpen ? 'open' : ''}`}>
            <div className={`mevzi-sliding-panel-header ${isOpen ? 'open' : ''}`} onClick={togglePanel}>
                <IconButton className="mevzi-toggle-button" >
                    {isOpen ? (
                        <CloseIcon />
                    ) : (
                        <KeyboardArrowLeftIcon />
                    )}
                </IconButton>
                <div className="mevzi-panel-content">
                    Mevziler
                </div>
            </div>

            <div className='mevzi-panel-scroll'>
                {isOpen && (
                    <Tooltip title="Tabular Görünüm ve Mevzi Ekleme" >
                        <Typography variant="h6" className="mevzi-hover-effect-link" onClick={toMevziler}>
                            Tüm Mevziler
                            <IconButton className="mevzi-directing-icon-style">
                                <ArrowOutwardIcon />
                            </IconButton>
                        </Typography>
                    </Tooltip>
                )}

                {mevziler.length > 0 && (
                    mevziler.map(mvz => (
                        <div key={mvz.id}>
                            <div className="mevzi-panel-all-list">
                                <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                                    <Grid item xs={12} md={6}>
                                        <List>
                                            <ListItem disablePadding
                                            // secondaryAction={
                                            //     isRoleAdmin && (
                                            //         <Tooltip title="Sil">
                                            //             <IconButton edge="end" onClick={(event) => handleDeleteMevziClick(mvz.id, event)} aria-label="delete">
                                            //                 <DeleteIcon />
                                            //             </IconButton>
                                            //         </Tooltip>
                                            //     )
                                            // }
                                            >
                                                <ListItemButton onClick={() => handleEditMevziClick(mvz)}>
                                                    <ListItemText sx={{
                                                        '.MuiListItemText-primary': { fontSize: '1.3rem', color: 'white', fontWeight: 'bold' }
                                                    }} primary={mvz.name} />
                                                </ListItemButton>
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </List>
                                    </Grid>
                                </Box>
                            </div>

                        </div>
                    ))
                )}
                {mevziler.length === 0 && isOpen && (
                    <Typography className='mevzi-panel-empty-message'>
                        Görüntülenecek Mevzi bulunmamaktadır.
                    </Typography>
                )}

            </div>

        </div>
    );
};

export default MevziPanel;