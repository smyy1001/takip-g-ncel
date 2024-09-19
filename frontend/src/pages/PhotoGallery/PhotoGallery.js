import "./PhotoGallery.css";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";

function PhotoGallery({ isRoleAdmin }) {
  const { "sis-malz-mev": sisMalzMev, name } = useParams();
  const [photos, setPhotos] = useState({});

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
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`/api/${sisMalzMev}/${name}/photos`);
        const data = await response.json();
        if (data) {
          const groupedPhotos = groupPhotosByFolder(data);
          setPhotos(groupedPhotos);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [sisMalzMev, name]);

  return (
    <Container className="photo-gallery-container">
      <Typography
        className="photo-gallery-header"
        variant="h6"
        gutterBottom
        component="div"
        style={{ fontSize: 'xx-large', fontWeight: '600'}}
      >
        {`${name}`}
      </Typography>

      {Object.keys(photos).length > 0 ? (
        <div className="photo-gallery">
          {Object.keys(photos).map((folderName, index) => (
            <Accordion key={index} defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography>{folderName}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="photo-gallery-folder">
                  {photos[folderName].map((photo, photoIndex) => (
                    <img
                      key={photoIndex}
                      src={encodeURI(photo)}
                      alt={`Photo ${photoIndex}`}
                      className="photo-gallery-photo-item"
                    />
                  ))}
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
