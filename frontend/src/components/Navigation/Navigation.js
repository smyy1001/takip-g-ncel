import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
// import CategoryIcon from '@mui/icons-material/Category';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Navigation = ({isRoleAdmin}) => {
    const navigate = useNavigate();
    // const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    // const [editInvDialogOpen, setEditInvDialogOpen] = useState(false);
    // const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);

    const handleLogout = () => {
        // logout();
        console.log("log out");
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    // const handleEditInvDialogOpen = () => {
    //     setEditInvDialogOpen(true);
    //     handleMenuClose();
    // };

    // const handleEditInvDialogClose = () => {
    //     setEditInvDialogOpen(false);
    //     navigate('/home');
    // };

    return (
        <>
            {/* {isLoggedIn && ( */}
            <>
                {/* {(location.pathname === '/home') && (
                    <>
                        <Tooltip title="Tabular Görünüm">
                            <IconButton onClick={() => navigate('/items')}>
                                <CategoryIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )} */}

                {isRoleAdmin && (
                    <>
                        <Tooltip title="Menü">
                            <IconButton onClick={handleMenuClick}>
                                <PlaylistAddIcon style={{ fontSize: '1.8rem' }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => navigate('/sistem-ekle')}>
                                <AddIcon style={{ marginRight: '5px' }} />  Sistem Ekle
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/malzeme-ekle')}>
                                <AddIcon style={{ marginRight: '5px' }} />  Malzeme Ekle
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/mevzi-ekle')}>
                                <AddIcon style={{ marginRight: '5px' }} />  Mevzi Ekle
                            </MenuItem>
                        </Menu>
                    </>
                )}

                <Tooltip title="Çıkış Yap">
                    <IconButton onClick={handleLogout}>
                        <ExitToAppIcon />
                    </IconButton>
                </Tooltip>
            </>
        </>
    );
};

export default Navigation;
