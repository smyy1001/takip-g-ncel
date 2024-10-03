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
import RemoveIcon from "@mui/icons-material/Remove";
import { FormControlLabel, Radio } from '@mui/material';
import { Checkbox, FormGroup } from '@mui/material';



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



const SearchFilterPanel = ({ searchContent, setSearchContent, searchLocation, setSearchLocation, searchRakimL, setSearchRakimL, searchRakimH, setSearchRakimH, state, handleChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
        if (!isOpen) { setSearchContent(''); }
    };

    const handleMevziRadioBChange = (event) => {
        setSearchLocation(event.target.value);
    };

    const controlProps = (item) => ({
        checked: searchLocation === item,
        onChange: handleMevziRadioBChange,
        value: item,
        name: "depo-mevzi-radio-button",
        inputProps: { "aria-label": item },
    });

    // const handleChange = (event) => {
    //     const { name, checked } = event.target;
    //     setState(prevState => ({ ...prevState, [name]: checked }));

    //     if (checked) {
    //         if (state.aktif) activeStates.push(2);
    //         if (state.inaktif) activeStates.push(0);
    //         if (state.bilinmeyen) activeStates.push(1);
    //     }
    //     console.log("State: ", state);
    // };


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

                    <div style={{ display: "flex", alignItems: "center", flexDirection: 'row', marginTop: '10px', gap: '5px' }}>
                        <div >Aktiflik Durumu:</div>
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox checked={state.aktif} onChange={handleChange} name="aktif" />}
                                label="Aktif"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={state.inaktif} onChange={handleChange} name="inaktif" />}
                                label="İnaktif"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={state.bilinmeyen} onChange={handleChange} name="bilinmeyen" />}
                                label="Bilinmeyen"
                            />
                        </FormGroup>
                    </div>


                    <div style={{ display: "flex", alignItems: "center", flexDirection: 'row' }}>
                        <div>Lokasyon:</div>
                        <div style={{ marginLeft: "10px" }}>
                            <FormControlLabel
                                control={<Radio {...controlProps("a")} color="default" />}
                                label="Hepsi"
                            />

                            <FormControlLabel
                                control={<Radio {...controlProps("i")} color="default" />}
                                label="Yurt İçi"
                            />

                            <FormControlLabel
                                control={<Radio {...controlProps("d")} color="default" />}
                                label="Yurt Dışı"
                            />
                        </div>
                    </div>


                    <div
                        style={{
                            display: "flex",
                            marginTop: "10px",
                            flexDirection: "column",
                        }}
                    >
                        <div>Rakım (metre):</div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <CustomTextField
                                autoComplete="off"
                                label="Alt Sınır"
                                variant="filled"
                                type="number"
                                inputProps={{ step: "10" }}
                                value={searchRakimL}
                                onChange={(e) => setSearchRakimL(e.target.value)}
                                margin="normal"
                            />

                            <div style={{ marginTop: "35px" }}>
                                <RemoveIcon />
                            </div>

                            <CustomTextField
                                autoComplete="off"
                                label="Üst Sınır"
                                variant="filled"
                                type="number"
                                inputProps={{ step: "10" }}
                                value={searchRakimH}
                                onChange={(e) => setSearchRakimH(e.target.value)}
                                margin="normal"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilterPanel;
