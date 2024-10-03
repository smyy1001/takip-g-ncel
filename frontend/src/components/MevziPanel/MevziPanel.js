import React, { useState } from 'react';
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
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import styled from '@mui/material/styles/styled';

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


const MevziPanel = ({ mevziler, fetchAllMevzi, isOpen, togglePanel, isRoleAdmin }) => {
    const navigate = useNavigate();
    const [searchMevzi, setSearchMevzi] = useState('');


    //NAVIGATE 
    const toMevziler = async () => {
        navigate('/mevziler')
    };


    const handleViewMevziClick = async (mevzi) => {
        navigate(`/mevzi/${mevzi.id}/bilgi`)
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

    // filer mevziler regarding their names and searchMevzi keyword. if the keyword is empty, return all mevziler
    const filteredMevziler = mevziler.filter(mvz => mvz.name.toLowerCase().includes(searchMevzi.toLowerCase()));

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
                <Typography className="mevzi-panel-content">
                    Mevziler
                </Typography>              
            </div>

            <div className='mevzi-panel-scroll'>
                {isOpen && (
                    <div>
                        <Tooltip title="Tabular Görünüm" >
                            <Typography variant="h6" className="mevzi-hover-effect-link" onClick={toMevziler}>
                                Tüm Mevziler
                                <IconButton className="mevzi-directing-icon-style">
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
                            value={searchMevzi}
                            onChange={(e) => { if (isOpen) setSearchMevzi(e.target.value); }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton disabled={!searchMevzi}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                )}

                {filteredMevziler.length > 0 && (
                    filteredMevziler.map(mvz => (
                        <div key={mvz.id}>
                            <div className="mevzi-panel-all-list">
                                <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                                    <Grid item xs={12} md={6}>
                                        <List>
                                            <ListItem disablePadding >
                                                <ListItemButton onClick={() => handleViewMevziClick(mvz)}>
                                                    <ListItemText sx={{
                                                        '.MuiListItemText-primary': { fontSize: '1.3rem', color: 'white', fontWeight: 'bold' }
                                                    }} primary={highlightText(mvz.name, searchMevzi)} />
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
                {filteredMevziler.length === 0 && isOpen && (
                    <Typography className='mevzi-panel-empty-message'>
                        Görüntülenecek Mevzi bulunmamaktadır.
                    </Typography>
                )}

            </div>

        </div >
    );
};

export default MevziPanel;