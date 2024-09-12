import React, { useState } from 'react';
import './SearchFilterPanel.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const SearchFilterPanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sfp-sliding-panel ${isOpen ? 'open' : ''}`}>
            <div className={`sfp-sliding-panel-header ${isOpen ? 'open' : ''}`} onClick={togglePanel} >
                <IconButton className="sfp-toggle-button" >
                    {isOpen ? <CloseIcon /> : <KeyboardArrowUpIcon />}
                </IconButton>
                <div className="sfp-panel-content">Arama & Filtreleme</div>
            </div>
        </div>
    );
};

export default SearchFilterPanel;
