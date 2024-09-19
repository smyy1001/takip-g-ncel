import React, { useState } from 'react';
import './SearchFilterPanel.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@mui/material/styles/styled';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';



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



const SearchFilterPanel = ({searchContent, setSearchContent}) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
        if (!isOpen) { setSearchContent(''); }
    };

    return (
        <div className={`sfp-sliding-panel ${isOpen ? 'open' : ''}`}>
            <div className={`sfp-sliding-panel-header ${isOpen ? 'open' : ''}`} onClick={togglePanel} >
                <IconButton className="sfp-toggle-button" >
                    {isOpen ? <CloseIcon /> : <KeyboardArrowUpIcon />}
                </IconButton>
                <div className="sfp-panel-content">
                    <Typography variant="h6">
                        Haritada Ara
                    </Typography>
                </div>
            </div>

            <div className='sfp-panel-content-body'>
                <div className='sfp-panel-search-bar'>
                    <Tooltip title="Arama sonuçları haritadan görüntülenebilir!">
                        <CustomTextField
                            autoComplete="off"
                            fullWidth
                            variant="outlined"
                            placeholder="Ara..."
                            value={searchContent}
                            onChange={(e) => { if (isOpen) setSearchContent(e.target.value); }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton disabled={!searchContent}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Tooltip>
                </div>

            </div>

        </div>
    );
};

export default SearchFilterPanel;
