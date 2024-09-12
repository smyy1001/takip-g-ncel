import React, { useState } from 'react';
import './SystemPanel.css';
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
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Axios from '../../Axios';
import { message } from 'antd';

const SystemPanel = ({ systems, fetchSystems, isOpen, togglePanel, isRoleAdmin }) => {
    const [openSystem, setOpenSystem] = useState({});
    const navigate = useNavigate();

    const handleEditSystemClick = async (system) => {
        navigate(`/sistemler/${system.id}`)
    };

    const handleEditMalzemeClick = async (malzeme) => {
        navigate(`/malzemeler/${malzeme.id}`)
    };

    const toSystems = async () => {
        navigate('/sistemler')
    };

    const toggleSystemOpen = (id, event) => {
        event.stopPropagation();
        setOpenSystem((prevOpenSystem) => ({
            ...prevOpenSystem,
            [id]: !prevOpenSystem[id],
        }));
    };

    return (
        <div className={`sys-sliding-panel ${isOpen ? 'open' : ''}`}>
            <div className={`sys-sliding-panel-header ${isOpen ? 'open' : ''}`} onClick={togglePanel} >
                <IconButton className="sys-toggle-button" >
                    {isOpen ? <CloseIcon /> : <KeyboardArrowLeftIcon />}
                </IconButton>
                <div className="sys-panel-content">Sistemler&Malzemeler</div>
            </div>

            <div className='sys-panel-scroll'>
                {isOpen && (
                    <Tooltip title="Tabular Görünüm ve Sistem Ekleme" >
                        <Typography variant="h6" className="system-hover-effect-link" onClick={toSystems}>
                            Tüm Sistemler ve Malzemeleri
                            <IconButton className="system-directing-icon-style">
                                <ArrowOutwardIcon />
                            </IconButton>
                        </Typography>
                    </Tooltip>
                )}
                {systems.length > 0 && (
                    systems.map(sys => (
                        <div key={sys.id}>
                            <div className="sys-panel-all-list">
                                <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                                    <Grid item xs={12} md={6}>
                                        <List>
                                            <ListItem disablePadding
                                            // secondaryAction={
                                            //     isRoleAdmin & (
                                            //         <Tooltip title="Sil">
                                            //             <IconButton edge="end" onClick={(event) => handleDeleteSystemClick(sys.id, event)} aria-label="delete">
                                            //                 <DeleteIcon />
                                            //             </IconButton>
                                            //         </Tooltip>
                                            //     )
                                            // }
                                            >
                                                <ListItemButton onClick={() => handleEditSystemClick(sys)}>
                                                    <ListItemText sx={{
                                                        '.MuiListItemText-primary': { fontSize: '1.3rem', color: 'white', fontWeight: 'bold' }
                                                    }} primary={sys.name} />
                                                    <Tooltip title="Sistemdeki Malzemeler">
                                                        {sys.malzemeler && sys.malzemeler.length > 0 ? (
                                                            openSystem[sys.id] ? <ExpandLess className='sys-panel-expand-more-less' onClick={(e) => toggleSystemOpen(sys.id, e)} /> : <ExpandMore className='sys-panel-expand-more-less' onClick={(e) => toggleSystemOpen(sys.id, e)} />
                                                        ) : null}
                                                    </Tooltip>
                                                </ListItemButton>
                                            </ListItem>
                                            <Collapse in={openSystem[sys.id]} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {sys.malzemeler && sys.malzemeler.map((malzeme, index) => (
                                                        <React.Fragment key={index}>
                                                            <ListItem className='sys-panel-sub-malz-list-class' sx={{ pl: 4 }} onClick={() => handleEditMalzemeClick(malzeme)}>
                                                                <ListItemText sx={{
                                                                    '.MuiListItemText-primary': { fontSize: '1rem', color: 'white', fontWeight: 'bold' }
                                                                }}
                                                                    primary={malzeme.name}
                                                                    secondary={`Seri No: ${malzeme.seri_num}`}
                                                                />
                                                            </ListItem>
                                                            {index < sys.malzemeler.length - 1 && (
                                                                <Divider
                                                                    variant="inset"
                                                                    sx={{ marginLeft: 4 }}
                                                                />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            </Collapse>
                                            <Divider variant="inset" component="li" />
                                        </List>
                                    </Grid>
                                </Box>
                            </div>
                        </div>
                    ))
                )}
                {systems.length === 0 && isOpen && (
                    <Typography className='sys-panel-empty-message'>
                        Görüntülenecek Sistem bulunmamaktadır.
                    </Typography>
                )}
            </div>
        </div >
    );
};

export default SystemPanel;