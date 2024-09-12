// import React, { useState, useEffect, useRef } from 'react';
// import { createRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Axios from '../../Axios';
// import {
//     Container,
//     Typography,
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemText,
//     Grid,
//     Box,
//     Collapse,
//     IconButton,
//     Tooltip
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import { message } from 'antd';
// import './Edit.css';

// function MevziEdit({ systems, fetchSystems, isRoleAdmin }) {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const itemRefs = useRef([]);

//     const [openSystem, setOpenSystem] = useState({});
//     const [system, setSystem] = useState(null);
//     const [malzemeler, setMalzemeler] = useState([]);

//     useEffect(() => {
//         itemRefs.current = systems.map((_, index) => itemRefs.current[index] ?? createRef());
//     }, [systems]);

//     useEffect(() => {
//         const fetchCurrentSystem = async () => {
//             try {
//                 const response = await Axios.get(`/api/system/get/${id}`);
//                 setSystem(response.data);

//                 const malzemeResponse = await Axios.get(`/api/malzeme/get/${id}`);
//                 setMalzemeler(malzemeResponse.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchCurrentSystem();
//         fetchSystems();
//     }, [id]);

//     useEffect(() => {
//         console.log(itemRefs.current);

//         if (systems.length > 0 && id) {
//             const index = systems.findIndex(sys => sys.id === id);
//             const ref = itemRefs.current[index];

//             console.log(ref);

//             if (ref && ref.current) {
//                 ref.current.scrollIntoView({
//                     behavior: 'smooth',
//                     block: 'start'
//                 });
//             } else {
//                 console.error('Ref not found or not attached to a DOM element');
//             }
//         }
//     }, [systems, id]);

//     const toggleSystemOpen = (id, event) => {
//         event.stopPropagation();
//         setOpenSystem((prevOpenSystem) => ({
//             ...prevOpenSystem,
//             [id]: !prevOpenSystem[id],
//         }));
//     };

//     const handleDeleteSystemClick = async (systemId, event) => {
//         event.stopPropagation();
//         try {
//             const response = await Axios.delete(`/api/system/delete/${systemId}`);
//             if (response.status === 200 || response.status === 204) {
//                 message.success('Sistem silindi!');
//                 fetchSystems();
//             } else {
//                 message.error("Sistem silinemedi'");
//             }
//         } catch (error) {
//             message.error(error.response?.data?.detail || error.message);
//         }
//     };

//     const handleEditMalzemeClick = (malzeme) => {
//         navigate(`/malzemeler/${malzeme.id}`);
//     };

//     const handleEditSystemClick = (system) => {
//         navigate(`/sistemler/${system.id}`);
//     };

//     return (
//         <Container className="system-edit-container">
//             <div className='system-edit-main-div-class'>
//                 <div className='system-edit-left-div'>
//                     <div className='system-edit-scroll'>
//                         {systems.length > 0 ? systems.map((sys, index) => (
//                             <div key={sys.id} className={`sys-edit-all-list ${sys.id === id ? 'chosen' : ''}`}>
//                                 <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
//                                     <Grid item xs={12} md={6}>
//                                         <List>
//                                             <ListItem disablePadding ref={itemRefs.current[index]}
//                                                 secondaryAction={
//                                                     <Tooltip title="Sil">
//                                                         <IconButton edge="end" onClick={(event) => handleDeleteSystemClick(sys.id, event)} aria-label="delete">
//                                                             <DeleteIcon />
//                                                         </IconButton>
//                                                     </Tooltip>
//                                                 }
//                                             >
//                                                 <ListItemButton className={`system-edit-list-item ${sys.id === id ? 'chosen' : ''}`} onClick={() => handleEditSystemClick(sys)}>
//                                                     <ListItemText sx={{ '.MuiListItemText-primary': { fontSize: '1.3rem', color: 'white', fontWeight: 'bold' } }} primary={sys.name} />
//                                                     {sys.malzemeler && sys.malzemeler.length > 0 && (
//                                                         <Tooltip title="Sistemdeki Malzemeler">
//                                                             {openSystem[sys.id] ? <ExpandLess onClick={(e) => toggleSystemOpen(sys.id, e)} /> : <ExpandMore onClick={(e) => toggleSystemOpen(sys.id, e)} />}
//                                                         </Tooltip>
//                                                     )}
//                                                 </ListItemButton>
//                                             </ListItem>
//                                             <Collapse in={openSystem[sys.id]} timeout="auto" unmountOnExit>
//                                                 <List component="div" disablePadding>
//                                                     {sys.malzemeler?.map((malzeme, index) => (
//                                                         <>
//                                                             <ListItem key={index} className='sys-edit-sub-malz-list-class' sx={{ pl: 4 }} onClick={() => handleEditMalzemeClick(malzeme)}>
//                                                                 <ListItemText primary={malzeme.name} secondary={`Seri No: ${malzeme.seri_num}`} sx={{ '.MuiListItemText-primary': { fontSize: '1rem', color: 'white', fontWeight: 'bold' } }} />
//                                                             </ListItem>
//                                                             {index < sys.malzemeler.length - 1 && (
//                                                                 <Divider
//                                                                     variant="inset"
//                                                                     sx={{ marginLeft: 4 }}
//                                                                 />
//                                                             )}
//                                                         </>
//                                                     ))}
//                                                 </List>
//                                             </Collapse>
//                                         </List>
//                                     </Grid>
//                                 </Box>
//                             </div>
//                         )) : (
//                             <Typography className='sys-edit-empty-message'>Görüntülenecek Sistem bulunmamaktadır.</Typography>
//                         )}
//                     </div>
//                 </div>
//                 <div className='system-edit-right-div'>
//                     {/* Additional details or actions can be placed here */}
//                 </div>
//             </div>
//         </Container>
//     );
// }

// export default MevziEdit;
