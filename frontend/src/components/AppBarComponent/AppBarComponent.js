import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Navigation from '../Navigation/Navigation';
import './AppBarComponent.css';
import { Link, Typography } from '@mui/material';
import { Tooltip } from '@mui/material';

const AppBarComponent = ({ isRoleAdmin }) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <AppBar position="fixed" className="app-bar">
            <Toolbar className="styled-toolbar">
                {(location.pathname === '/home') ? (
                    <Tooltip title="Anasayfa">
                        <Link color="inherit" underline="none">
                            <Typography variant="p" className="search-bar-search-logo">takip</Typography>
                        </Link>
                    </Tooltip>
                ) : (
                    <Tooltip title="Anasayfa">
                        <Link color="inherit" underline="none" onClick={() => navigate('/home')}>
                            <Typography variant="p" className="search-bar-search-logo">takip</Typography>
                        </Link>
                    </Tooltip>
                )}
                <Toolbar className="styled-right-toolbar">
                    <Navigation isRoleAdmin={isRoleAdmin} />
                </Toolbar>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarComponent;