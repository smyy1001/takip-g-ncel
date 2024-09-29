import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
// import CategoryIcon from '@mui/icons-material/Category';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { useAuth } from "../../AuthContext";

const Navigation = ({ isRoleAdmin }) => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  // const [editInvDialogOpen, setEditInvDialogOpen] = useState(false);
  // const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTableMenuClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleTableMenuClose = () => {
    setAnchorEl2(null);
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
      {isAuthenticated && (
        <>
          <Tooltip title="Tabular Görünüm Menüsü">
            <IconButton onClick={handleTableMenuClick}>
              <MenuIcon style={{ fontSize: "1.8rem" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={handleTableMenuClose}
          >
            <MenuItem onClick={() => navigate("/sistemler")}>
              <BackupTableIcon style={{ marginRight: "5px" }} /> Tüm
              Sistemler
            </MenuItem>
            <MenuItem onClick={() => navigate("/malzemeler")}>
              <BackupTableIcon style={{ marginRight: "5px" }} /> Tüm
              Malzemeler
            </MenuItem>
            <MenuItem onClick={() => navigate("/mevziler")}>
              <BackupTableIcon style={{ marginRight: "5px" }} /> Tüm
              Mevziler
            </MenuItem>
          </Menu>
          {isRoleAdmin && (
            <>
              <Tooltip title="Yeni Veri Ekleme Menüsü">
                <IconButton onClick={handleMenuClick}>
                  <PlaylistAddIcon style={{ fontSize: "2rem" }} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate("/sistem-ekle")}>
                  <AddIcon style={{ marginRight: "5px" }} /> Sistem Ekle
                </MenuItem>
                <MenuItem onClick={() => navigate("/malzeme-ekle")}>
                  <AddIcon style={{ marginRight: "5px" }} /> Malzeme Ekle
                </MenuItem>
                <MenuItem onClick={() => navigate("/mevzi-ekle")}>
                  <AddIcon style={{ marginRight: "5px" }} /> Mevzi Ekle
                </MenuItem>
              </Menu>
            </>
          )}

          <Tooltip title="Çıkış Yap">
            <IconButton onClick={logout}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </>
  );
};

export default Navigation;
