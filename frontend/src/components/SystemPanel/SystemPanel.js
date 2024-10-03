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
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import styled from '@mui/material/styles/styled';


const CustomAutocompleteTextField = styled(TextField)({
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


const SystemPanel = ({ systems, fetchSystems, isOpen, togglePanel, isRoleAdmin }) => {
    const [openSystem, setOpenSystem] = useState({});
    const navigate = useNavigate();
    const [searchSistem, setSearchSistem] = useState('');

    const handleViewSystemClick = async (system) => {
        navigate(`/sistem/${system.id}/bilgi`);
    };

    const handleViewMalzemeClick = async (malzeme) => {
        navigate(`/malzeme/${malzeme.id}/bilgi`);
    };

    const toSystems = async () => {
        navigate('/sistemler');
    };

    const toggleSystemOpen = (id, event) => {
        event.stopPropagation();
        setOpenSystem((prevOpenSystem) => ({
            ...prevOpenSystem,
            [id]: !prevOpenSystem[id],
        }));
    };

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


    //filter systems reagrding therir names and searchSiste keyword. if the keyword is empty, return all systems
    // const filteredSystems = systems.filter(sys => sys.name.toLowerCase().includes(searchSistem.toLowerCase()));
    // const filteredSystems = systems.filter(sys =>
    //     sys.name.toLowerCase().includes(searchSistem.toLowerCase()) ||
    //     sys.malzemeler.some(malzeme => malzeme.name.toLowerCase().includes(searchSistem.toLowerCase()))
    // );
    const filteredSystems = systems.filter(sys =>
        sys.name.toLowerCase().includes(searchSistem.toLowerCase()) ||
        sys.malzemeler.some(malzeme =>
            malzeme.name.toLowerCase().includes(searchSistem.toLowerCase()) ||
            malzeme.seri_num.toLowerCase().includes(searchSistem.toLowerCase())
        )
    );

    return (
        <div className={`sys-sliding-panel ${isOpen ? 'open' : ''}`}>
            <div className={`sys-sliding-panel-header ${isOpen ? 'open' : ''}`} onClick={togglePanel} >
                <IconButton className="sys-toggle-button" >
                    {isOpen ? <CloseIcon /> : <KeyboardArrowLeftIcon />}
                </IconButton>
                <Typography className="sys-panel-content">
                    Sistemler & Malzemeleri
                </Typography>
            </div>

            <div className='sys-panel-scroll'>
                {isOpen && (
                    <div>
                        <Tooltip title="Tabular Görünüm" >
                            <Typography variant="h6" className="system-hover-effect-link" onClick={toSystems}>
                                Tüm Sistemler ve Malzemeleri
                                <IconButton className="system-directing-icon-style">
                                    <ArrowOutwardIcon />
                                </IconButton>
                            </Typography>
                        </Tooltip>

                        <CustomTextField
                            style={{ paddingLeft: '10px', marginBottom: '5px' }}
                            autoComplete="off"
                            fullWidth
                            variant="outlined"
                            placeholder="Ara..."
                            value={searchSistem}
                            onChange={(e) => { if (isOpen) setSearchSistem(e.target.value); }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton disabled={!searchSistem}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                )}
                {filteredSystems.length > 0 && (
                    filteredSystems.map(sys => (
                        <div key={sys.id}>
                            <div className="sys-panel-all-list">
                                <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                                    <Grid item xs={12} md={6}>
                                        <List>
                                            <ListItem disablePadding>
                                                <ListItemButton onClick={() => handleViewSystemClick(sys)}>
                                                    <ListItemText sx={{
                                                        '.MuiListItemText-primary': { fontSize: '1.3rem', color: 'white', fontWeight: 'bold' }
                                                    }} primary={ highlightText(sys.name, searchSistem) } />
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
                                                            <ListItem className='sys-panel-sub-malz-list-class' sx={{ pl: 4 }} onClick={() => handleViewMalzemeClick(malzeme)}>
                                                                <ListItemText sx={{
                                                                    '.MuiListItemText-primary': { fontSize: '1rem', color: 'white', fontWeight: 'bold' }
                                                                }}
                                                                    primary={highlightText(malzeme.name, searchSistem)}
                                                                    secondary={highlightText(`Seri No: ${malzeme.seri_num}`, searchSistem)}
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
                {filteredSystems.length === 0 && isOpen && (
                    <Typography className='sys-panel-empty-message'>
                        Görüntülenecek Sistem bulunmamaktadır.
                    </Typography>
                )}
            </div>
        </div >
    );
};

export default SystemPanel;