import "./PhotoGallery.css";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button,
  TextField,
  Tooltip,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const CustomOutlinedButton = styled(Button)({
  "&.MuiButton-outlined": {
    color: "white", // Text color
    borderColor: "white", // Border color
    "&:hover": {
      borderColor: "white", // Border color on hover
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight background color on hover
    },
    "&.Mui-focused": {
      borderColor: "white !important", // Border color when focused
    },
    "&.Mui-disabled": {
      borderColor: "rgba(255, 255, 255, 0.3)", // Border color when disabled
      color: "rgba(255, 255, 255, 0.3)", // Text color when disabled
    },
  },
});
function PhotoGallery({ isRoleAdmin }) {
  const { "sis-malz-mev": sisMalzMev, name } = useParams();
  const [photos, setPhotos] = useState({});
  const [deletedImagesData, setDeletedImagesData] = useState([]);
  const [systemId, setSystemId] = useState(null);
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const [folders, setFolders] = useState([]);

  const groupPhotosByFolder = (photoUrls) => {
    if (!Array.isArray(photoUrls)) {
      return {};
    }
    return photoUrls.reduce((acc, photoUrl) => {
      const folderName = photoUrl.split("/").slice(-2, -1)[0];
      if (!acc[folderName]) {
        acc[folderName] = [];
      }
      acc[folderName].push(photoUrl);
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchSystemId = async () => {
      try {
        const response = await axios.get(
          `/api/${sisMalzMev}/get-id-by-name/${name}`
        );
        setSystemId(response.data);
      } catch (error) {
        console.error("Sistem ID'si alınırken hata oluştu:", error);
      }
    };

    fetchSystemId();
  }, [name]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`/api/${sisMalzMev}/${name}/photos`);
        const data = response.data;
        if (data) {
          const groupedPhotos = groupPhotosByFolder(data);
          const foldersWithOldName = Object.keys(groupedPhotos).map(
            (folderName) => ({
              folderName,
              oldFolderName: null,
              photos: groupedPhotos[folderName],
            })
          );
          setFolders(foldersWithOldName);
        }
      } catch (error) {
        console.error("Fotoğraf bilgisi çekilemedi:", error);
      }
    };

    fetchPhotos();
  }, [sisMalzMev, name]);

  const handleDeleteImage = async (folderName, imageName) => {
    try {
      const formData = new FormData();
      for (const folder of folders) {
        if (!folder.folderName || folder.folderName.trim() === "") {
          message.warning("Klasör ismi boş olamaz");
          return;
        }
        formData.append("folderNames", folder.folderName);
        if (folder.oldFolderName) {
          formData.append("oldFolderNames", folder.oldFolderName);
        } else {
          formData.append("oldFolderNames", null);
        }
      }
      const updatedDeletedImagesData = [
        ...deletedImagesData,
        { folderName, deletedImages: [imageName] },
      ];
      formData.append(
        "deletedImagesData",
        JSON.stringify(updatedDeletedImagesData)
      );

      const response = await axios.put(
        `/api/${sisMalzMev}/update/${systemId}`,
        formData
      );

      if (response.status === 200) {
        const groupedPhotos = groupPhotosByFolder(response.data.photos);
        setFolders(
          Object.keys(groupedPhotos).map((folderName) => ({
            folderName,
            oldFolderName: null,
            photos: groupedPhotos[folderName],
          }))
        );

        message.success("Fotoğraf başarıyla silindi");
      } else {
        throw new Error("Fotoğraf silinemedi.");
      }
    } catch (error) {
      message.error("Fotoğraf silinirken hata oluştu");
    }
  };

  const handleDeleteFolder = async (folderName) => {
    try {
      const folderToDelete = folders.find(
        (folder) => folder.folderName === folderName
      );

      if (!folderToDelete) {
        throw new Error("Silinecek klasör bulunamadı");
      }
      const formData = new FormData();
      const deletedImages = folderToDelete.photos.map((photo) =>
        photo.split("/").pop()
      );
      formData.append("folderNames", folderName);
      formData.append(
        "deletedImagesData",
        JSON.stringify([{ folderName, deletedImages }])
      );

      const response = await axios.put(
        `/api/${sisMalzMev}/update/${systemId}`,
        formData
      );

      if (response.status === 200) {
        const groupedPhotos = groupPhotosByFolder(response.data.photos);
        setFolders(
          Object.keys(groupedPhotos).map((folderName) => ({
            folderName,
            oldFolderName: null,
            photos: groupedPhotos[folderName],
          }))
        );
        message.success("Klasör başarıyla silindi");
      } else {
        throw new Error("Klasör silinemedi.");
      }
    } catch (error) {
      message.error("Klasör silinirken hata oluştu: " + error.message);
    }
  };

  const handleFolderNameSubmit = async (index) => {
    try {
      const folder = folders[index];

      if (!folder.folderName || folder.folderName.trim() === "") {
        message.warning("Klasör ismi boş olamaz");
        return;
      }
      const formData = new FormData();
      formData.append("folderNames", folder.folderName);
      if (folder.oldFolderName) {
        formData.append("oldFolderNames", folder.oldFolderName);
      } else {
        formData.append("oldFolderNames", null);
      }

      const response = await axios.put(
        `/api/${sisMalzMev}/update/${systemId}`,
        formData
      );

      if (response.status === 200) {
        const groupedPhotos = groupPhotosByFolder(response.data.photos);
        setFolders(
          Object.keys(groupedPhotos).map((folderName) => ({
            folderName,
            oldFolderName: null,
            photos: groupedPhotos[folderName],
          }))
        );
        message.success("Klasör ismi başarıyla güncellendi");
      } else {
        throw new Error("Klasör ismi güncellenemedi.");
      }
    } catch (error) {
      message.error("Klasör ismi güncellenirken hata oluştu: " + error.message);
    }
  };

  const handleFolderNameChange = (index, newFolderName) => {
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];
      const currentFolder = updatedFolders[index];

      if (
        !currentFolder.oldFolderName &&
        currentFolder.folderName !== newFolderName
      ) {
        updatedFolders[index].oldFolderName = currentFolder.folderName;
      }

      updatedFolders[index].folderName = newFolderName;
      return updatedFolders;
    });
  };

  const handleAccordionChange = (folderName) => (event, isExpanded) => {
    setExpandedAccordions((prevExpanded) =>
      isExpanded
        ? [...prevExpanded, folderName]
        : prevExpanded.filter((name) => name !== folderName)
    );
  };

  return (
    <Container className="photo-gallery-container">
      <Typography
        className="photo-gallery-header"
        variant="h6"
        gutterBottom
        component="div"
        style={{ fontSize: "xx-large", fontWeight: "600" }}
      >
        {`${name}`}
      </Typography>

      {folders.length > 0 ? (
        <div className="photo-gallery">
          {folders.map((folder, index) => (
            <Accordion
              key={index}
              expanded={expandedAccordions.includes(folder.folderName)}
              onChange={handleAccordionChange(folder.folderName)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <div className="photo-gallery-folder-header">
                  <Tooltip title="Klasör ismini değiştir">
                    <TextField
                      value={folder.folderName}
                      onChange={(e) => {
                        if (isRoleAdmin) {
                          e.stopPropagation();
                          handleFolderNameChange(index, e.target.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && isRoleAdmin) {
                          handleFolderNameSubmit(index);
                        }
                      }}
                      onClick={(event) => event.stopPropagation()}
                      variant="outlined"
                      className="photo-gallery-custom-textfield"
                      onFocus={(event) => event.stopPropagation()}
                      disabled={!isRoleAdmin}
                    />
                  </Tooltip>
                  {expandedAccordions.includes(folder.folderName) &&
                    isRoleAdmin && (
                      <Tooltip title="Klasörü sil">
                        <IconButton
                          aria-label="delete-folder"
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteFolder(folder.folderName);
                          }}
                          className="photo-gallery-delete-folder-button"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <div className="photo-gallery-folder">
                  {folder.photos.map((photo, photoIndex) => {
                    const imageName = photo.split("/").pop();
                    return (
                      <div
                        key={photoIndex}
                        className="photo-gallery-photo-container"
                      >
                        <img
                          src={encodeURI(photo)}
                          alt={`Photo ${photoIndex}`}
                          className="photo-gallery-photo-item"
                        />
                        {isRoleAdmin && (
                          <Tooltip title="Fotoğrafı sil">
                            <IconButton
                              aria-label="delete-image"
                              size="small"
                              onClick={() =>
                                handleDeleteImage(folder.folderName, imageName)
                              }
                              className="photo-gallery-delete-image-button"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ) : (
        <Typography
          className="photo-gallery-no-content"
          variant="body1"
          color="textSecondary"
          align="center"
        >
          İçerik bulunamamıştır
        </Typography>
      )}
    </Container>
  );
}

export default PhotoGallery;
