import React, { useState, useEffect } from 'react';
import Axios from '../../Axios';
import './Main.css';
import { Container, Typography, Paper, Button, Modal, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton, Tooltip, TextField, styled, Autocomplete, createFilterOptions, Radio, FormControlLabel, InputAdornment, Switch } from '@mui/material';
import { message } from 'antd';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { isValid } from 'dayjs';
import 'dayjs/locale/tr';
// import { DateTimeField, DateField } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';


// const CustomDateTimeField = styled(DateTimeField)({
//     '& label.Mui-focused': {
//         color: 'white',
//     },
//     '& .MuiInput-underline:after': {
//         borderBottomColor: 'white !important',
//     },
//     '& .MuiOutlinedInput-root': {
//         '& fieldset': {
//             borderColor: 'white',
//         },
//         '&:hover fieldset': {
//             borderColor: 'white',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: 'white !important',
//         },
//         '& input:valid:focus + fieldset': {
//             borderColor: 'white !important',
//         }
//     },
//     '& .MuiFilledInput-root': {
//         '&:before': {
//             borderBottomColor: 'white',
//         },
//         '&:hover:before': {
//             borderBottomColor: 'white',
//         },
//         '&:after': {
//             borderBottomColor: 'white',
//         },
//         '&:hover fieldset': {
//             borderColor: 'white',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: 'white',
//         },
//     },
//     '& label.Mui-focused': {
//         color: 'white',
//     },
//     '& label': {
//         color: 'white',
//         '&[aria-selected="true"]': {
//             backgroundColor: '#423532',
//         },
//         '&:hover': {
//             backgroundColor: '#332725',
//         },
//     },
//     '& .MuiInputBase-root': {
//         '&::selection': {
//             backgroundColor: 'rgba(255, 255, 255, 0.99) !important',
//             color: '#241b19 !important',
//         },
//         '& input': {
//             caretColor: 'white'
//         }
//     },
//     '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'white !important',
//     },
//     '& .MuiInputBase-input::selection': {
//         backgroundColor: 'rgba(255, 255, 255, 0.99) !important',
//         color: '#241b19 !important',
//     },
// });

// const CustomDateField = styled(DateField)({
//     '& label.Mui-focused': {
//         color: 'white',
//     },
//     '& .MuiInput-underline:after': {
//         borderBottomColor: 'white !important',
//     },
//     '& .MuiOutlinedInput-root': {
//         '& fieldset': {
//             borderColor: 'white',
//         },
//         '&:hover fieldset': {
//             borderColor: 'white',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: 'white !important',
//         },
//         '& input:valid:focus + fieldset': {
//             borderColor: 'white !important',
//         }
//     },
//     '& .MuiFilledInput-root': {
//         '&:before': {
//             borderBottomColor: 'white',
//         },
//         '&:hover:before': {
//             borderBottomColor: 'white',
//         },
//         '&:after': {
//             borderBottomColor: 'white',
//         },
//         '&:hover fieldset': {
//             borderColor: 'white',
//         },
//         '&.Mui-focused fieldset': {
//             borderColor: 'white',
//         },
//     },
//     '& label.Mui-focused': {
//         color: 'white',
//     },
//     '& label': {
//         color: 'white',
//         '&[aria-selected="true"]': {
//             backgroundColor: '#423532',
//         },
//         '&:hover': {
//             backgroundColor: '#332725',
//         },
//     },
//     '& .MuiInputBase-root': {
//         '&::selection': {
//             backgroundColor: 'rgba(255, 255, 255, 0.99) !important',
//             color: '#241b19 !important',
//         },
//         '& input': {
//             caretColor: 'white'
//         }
//     },
//     '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'white !important',
//     },
//     '& .MuiInputBase-input::selection': {
//         backgroundColor: 'rgba(255, 255, 255, 0.99) !important',
//         color: '#241b19 !important',
//     },
// });

const CustomAutocompleteTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white !important',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white !important',
        },
        '& input:valid:focus + fieldset': {
            borderColor: 'white !important',
        }
    },
    '& .MuiFilledInput-root': {
        '&:before': {
            borderBottomColor: 'white',
        },
        '&:hover:before': {
            borderBottomColor: 'white',
        },
        '&:after': {
            borderBottomColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& label': {
        color: 'white',
        '&[aria-selected="true"]': {
            backgroundColor: '#423532',
        },
        '&:hover': {
            backgroundColor: '#332725',
        },
    },
    '& .MuiInputBase-root': {
        '&::selection': {
            backgroundColor: 'rgba(255, 255, 255, 0.99)',
            color: '#241b19',
        },
        '& input': {
            caretColor: 'white'
        }
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white !important',
    },
    '& .MuiInputBase-input::selection': {
        backgroundColor: 'rgba(255, 255, 255, 0.99)',
        color: '#241b19',
    },
});

const CustomTextField = styled(TextField)({
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white !important',
        },
        '& input:valid:focus + fieldset': {
            borderColor: 'white !important',
        }
    },
    '& .MuiFilledInput-root': {
        '&:before': {
            borderBottomColor: 'white',
        },
        '&:hover:before': {
            borderBottomColor: 'white',
        },
        '&:after': {
            borderBottomColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& label': {
        color: 'white',
    },
    '& .MuiInputBase-root': {
        '&::selection': {
            backgroundColor: 'rgba(255, 255, 255, 0.99)',
            color: '#241b19',
        },
        '& input': {
            caretColor: 'white'
        }
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white !important',
    },
    '& .MuiInputBase-input::selection': {
        backgroundColor: 'rgba(255, 255, 255, 0.99)',
        color: '#241b19',
    },
});

function Main({ mevziler, fetchAllMevzi, isRoleAdmin }) {

    const [systems, setSystems] = useState([]);
    const [malzemeler, setMalzemeler] = useState([]);
    const [ips, setIps] = useState({});
    const [ipBasligi, setIpBasligi] = useState('');
    const [ipAdresi, setIpAdresi] = useState('');

    const [altYInfo, setAltYInfo] = useState(["Klima", "Kabin", "Jenarator", "Regulator", "Enerji Alt Yapısı", "Haberleşme Alt Yapısı", "KGK", "Kamera", "Şebeke Alt Yapısı"]);
    const [chosenAltYInfo, setChosenaltYInfo] = useState({});
    const [altyBas, setAltYBas] = useState('');
    const [altyAc, setAltYAc] = useState('');

    const [gorevler, setGorevler] = useState(["Kurulum", "Bakım", "Onarım"]);
    const [selectedGorevler, setSelectedGorevler] = useState([]);
    const [sistemler, setsistemler] = useState([]);
    const [selectedSistemler, setSelectedSistemler] = useState([]);
    const [displayedSystem, setDisplayedSystem] = useState(null);
    const [displayedMalzeme, setDisplayedMalzeme] = useState({
        arizalar: [],
        bakimlar: [],
        onarimlar: []
    });
    const [altySwitchOpen, setaltySwitchOpen] = useState(false);
    const [displayedMevzi, setDisplayedMevzi] = useState(null);
    const [systemNameInput] = useState(false);
    const [createSistemAdi, setCreateSistemAdi] = useState('');
    const [addMalzemePanel, setAddMalzemePanel] = useState(false);
    const [addMevziPanel, setAddMevziPanel] = useState(false);
    const [all_types, setAllTypes] = useState([]);
    const [selectedRadioBValue, setSelectedRadioBValue] = useState('d'); //depo
    const [tempType, setTempType] = useState('');
    const [newChosenDate, setNewChosenDate] = useState(null);
    // const [folders, setFolders] = useState([]);
    const [albumler, setAlbumler] = useState([]);
    // const [folderName, setFolderName] = useState('');
    // const [images, setImages] = useState([]);

    // const handleFolderNameChange = (event) => {
    //     setFolderName(event.target.value);
    // };

    // const handleImagesChange = (event) => {
    //     setImages([...event.target.files]);
    // };

    // const addFolder = () => {
    //     setFolders([...folders, { folderName, images }]);
    //     setAlbumler([...albumler, folderName]);
    //     setFolderName('');
    //     setImages([]);
    // };

    // const handleImageUpload = async (bucket_name) => {
    //     const formData = new FormData();

    //     // Simplified structure: [{ name: folderName, image: imageFile }]
    //     folders.forEach((folder) => {
    //         folder.images.forEach((image) => {
    //             formData.append('files', image);  // Append each image file
    //             formData.append('names', folder.folderName);  // Append corresponding folder name
    //             console.log(`Appending file: ${image.name} with folder name: ${folder.folderName}`);
    //         });
    //     });

    //     try {
    //         const response = await Axios.post(`/api/mevzi/upload/${bucket_name}`, formData);
    //         console.log('Upload successful:', response.data);
    //     } catch (error) {
    //         console.error('Error uploading files:', error.response?.data || error.message);
    //     }
    // };



    const handleArizaDateChange = (newDateTime) => {
        // if (newDateTime && isValid(newDateTime)) {
        if (newDateTime) {
            setDisplayedMalzeme((prev) => {
                const exists = prev.arizalar.some((a) => a.isSame(newDateTime));

                if (!exists) {
                    return {
                        ...prev,
                        arizalar: prev.arizalar ? [...prev.arizalar, newDateTime] : [newDateTime],
                    };
                } else {
                    return prev;
                }
            });
        } else {
            message.error("Geçersiz tarih veya saat!");
        }
    };
    const handleDeleteAriza = (indexToRemove) => {
        setDisplayedMalzeme(prev => ({
            ...prev,
            arizalar: prev.arizalar.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleBakimDateChange = (newDateTime) => {
        // if (newDateTime && isValid(newDateTime)) {
        if (newDateTime) {
            setDisplayedMalzeme((prev) => {
                const exists = prev.bakimlar.some((bakim) => bakim.isSame(newDateTime));

                if (!exists) {
                    return {
                        ...prev,
                        bakimlar: prev.bakimlar ? [...prev.bakimlar, newDateTime] : [newDateTime],
                    };
                } else {
                    return prev;
                }
            });
        } else {
            message.error("Geçersiz tarih veya saat!");
        }
    };
    const handleDeleteBakim = (indexToRemove) => {
        setDisplayedMalzeme(prev => ({
            ...prev,
            bakimlar: prev.bakimlar.filter((_, index) => index !== indexToRemove)
        }));
    };


    const handleOnarimDateChange = (newDateTime) => {
        // if (newDateTime && isValid(newDateTime)) {
        if (newDateTime) {
            setDisplayedMalzeme((prev) => {
                const exists = prev.onarimlar.some((onarim) => onarim.isSame(newDateTime));

                if (!exists) {
                    return {
                        ...prev,
                        onarimlar: prev.onarimlar ? [...prev.onarimlar, newDateTime] : [newDateTime],
                    };
                } else {
                    return prev;
                }
            });
        } else {
            message.error("Geçersiz tarih veya saat!");
        }
    };
    const handleDeleteOnarim = (indexToRemove) => {
        setDisplayedMalzeme(prev => ({
            ...prev,
            onarimlar: prev.onarimlar.filter((_, index) => index !== indexToRemove)
        }));
    };


    const handleKesifTarihChange = (newValue) => {
        if (newValue) {
            const exactDate = dayjs(newValue).format('YYYY-MM-DD');
            setDisplayedMevzi(prev => ({
                ...prev,
                kesif_tarihi: exactDate
            }));
        }
    };

    const handleKurulumTarihChange = (newValue) => {
        if (newValue) {
            const exactDate = dayjs(newValue).format('YYYY-MM-DD');
            setDisplayedMevzi(prev => ({
                ...prev,
                kurulum_tarihi: exactDate
            }));
        }
    };


    const handleSistemClick = (system) => {
        setDisplayedSystem(system);
    };


    const handleMalzemeClick = (malzeme) => {
        setDisplayedMalzeme(malzeme);
    }

    const handleMevziClick = (mevzi) => {
        setDisplayedMevzi(mevzi);
    }


    const handleAddMalzemeClick = () => {
        setAddMalzemePanel(true);
        setDisplayedMalzeme(null);
        setDisplayedMalzeme({
            ...displayedMalzeme,
            arizalar: [],
            bakimlar: [],
            onarimlar: []
        });
        fetchAllTypes();
        fetchAllMevzi();
    };

    const handleAddMevziClick = () => {
        setAddMevziPanel(true);
        setDisplayedMevzi(null);
        fetchAllMevzi();
    };

    const handleTypeOptionChange = (event, newValue) => {
        if (typeof newValue === 'string') {
            if (!all_types.some(type => type.name === newValue)) {
                const type_id = addNewType(newValue);
                setDisplayedMalzeme(prev => ({ ...prev, type: type_id }));
            }
        } else if (newValue && typeof newValue === 'object') {
            setDisplayedMalzeme(prev => ({ ...prev, type: newValue.id }));
        } else {
            setDisplayedMalzeme(prev => ({ ...prev, type: 0 }));
        }
    };

    const handleMevziOptionChange = (event, newValue) => {
        if (typeof newValue === 'string') {
            if (!mevziler.some(mev => mev.name === newValue)) {
                const mevzi_id = addNewMevzi(newValue);
                setDisplayedMalzeme(prev => ({ ...prev, lok: mevzi_id }));
            }
        } else if (newValue && typeof newValue === 'object') {
            setDisplayedMalzeme(prev => ({ ...prev, lok: newValue.id }));
        } else {
            setDisplayedMalzeme(prev => ({ ...prev, lok: 0 }));
        }
    };

    const filterTypeOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: option => option.name
    });


    const handleMevziRadioBChange = (event) => {
        setSelectedRadioBValue(event.target.value);

        if (event.target.value === 'm') {
            setAddMevziPanel(true);
        } else {
            setAddMevziPanel(false);
        }

    };

    const controlProps = (item) => ({
        checked: selectedRadioBValue === item,
        onChange: handleMevziRadioBChange,
        value: item,
        name: 'depo-mevzi-radio-button',
        inputProps: { 'aria-label': item },
    });



    // Sistemler Metods
    const handleChosenSistemlerChange = (event, newValue) => {
        setSelectedSistemler(newValue);
    };





    // Gorevler Metods
    const handleGorevOptionChange = (event, newValue) => {
        setSelectedGorevler(newValue);
    };



    // Alt Yapi Bilgisi
    const handleAltYBasChange = (event, newValue) => {
        setAltYBas(newValue);
    };


    const handleAltYAcChange = (event) => {
        setAltYAc(event.target.value);
    }


    const handleAddAltYInfo = () => {
        console.log(altyBas, altyAc);
        if (altyBas && altyAc) {
            setChosenaltYInfo(prevInfo => ({
                ...prevInfo,
                [altyBas]: altyAc
            }));
            const updatedList = altYInfo.filter(i => i !== altyBas);
            setAltYInfo(updatedList);
            setAltYBas('');
            setAltYAc('');
        } else {
            message.error('Lütfen iki alanı da doldurunuz!');
        }
    };

    const handleDeleteAltYInfo = (altYKey) => {
        const updatedList = { ...chosenAltYInfo };
        delete updatedList[altYKey];
        setChosenaltYInfo(updatedList);
        setAltYInfo(prevInfo => ([...prevInfo, altYKey]));
    };


    // Ip Methods
    const handleIpBasligiChange = (event) => {
        setIpBasligi(event.target.value);
    };

    const handleIpAdresiChange = (event) => {
        setIpAdresi(event.target.value);
    };

    const handleAddIp = () => {
        if (ipBasligi && ipAdresi) {
            setIps(prevIps => ({
                ...prevIps,
                [ipBasligi]: ipAdresi
            }));
            setIpBasligi('');
            setIpAdresi('');
        } else {
            alert('Lütfen iki alanı da doldurunuz!');
        }
    };

    const handleDeleteIp = (ipKey) => {
        const updatedIps = { ...ips };
        delete updatedIps[ipKey];
        setIps(updatedIps);
    };



    // useEffects()
    useEffect(() => {
        if (displayedSystem !== null) { fetchMalzemeler(displayedSystem.id); }
    }, [displayedSystem]);

    useEffect(() => {
        fetchAllTypes();
        fetchAllMevzi();
        fetchSystems();
        fetchSistems();
    }, []);





    // Fecth and set
    const fetchSystems = async () => {
        try {
            const response = await Axios.get('/api/system/all/');
            setSystems(response.data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchSistems = async () => {
        try {
            const response = await Axios.get('/api/sistem/all/');
            setsistemler(response.data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchMalzemeler = async (id) => {
        try {
            const response = await Axios.get(`/api/malzeme/get/${id}`);
            setMalzemeler(response.data);
        } catch (error) {
            setMalzemeler([]);
            console.error('Error:', error);
            message.error(error.response?.data?.detail || error.message);
        }
    };

    const fetchAllTypes = async () => {
        try {
            const response = await Axios.get('/api/type/all/');
            setAllTypes(response.data);
        } catch (error) {
            message.error(error.response?.data?.detail || error.message);
        }
    };





    // DELETE METHODS
    const handleDeleteSystemClick = async (system, event) => {
        event.stopPropagation();
        try {
            const response = await Axios.delete(`/api/system/delete/${system.id}`);
            if (response.status === 200 || response.status === 204) {
                message.success('Sistem silindi!');
                fetchSystems();
                fetchMalzemeler(displayedSystem.id);
            } else {
                message.error("Sistem silinemedi'");
            }
        } catch (error) {
            message.error(error.response?.data?.detail || error.message);
        }
    }






    // ADD METHODS
    const addNewMevzi = async (MevziName) => {
        try {
            const response = await Axios.post('/api/mevzi/add', { name: MevziName });
            console.log('Yeni mevzi eklendi:', response.data);
            fetchAllMevzi();
            return response.data.id;
        } catch (error) {
            console.error('Mevzi eklenirken hata:', error);
            return 0;
        }
    };

    const addNewType = async (typeName) => {
        try {
            const response = await Axios.post('/api/type/add', { name: typeName });
            console.log('Yeni tür eklendi:', response.data);
            fetchAllTypes();
            return response.data.id;
        } catch (error) {
            console.error('Tür eklenirken hata:', error);
            return 0;
        }
    };

    const handleAddSistem = async (event) => {
        if (systemNameInput !== '') {
            try {
                const response = await Axios.post('/api/system/add/', {
                    name: createSistemAdi,
                });

                if (response.status === 200 || response.status === 201) {
                    message.success('Sistem eklendi!');
                    fetchSystems();
                } else {
                    message.error("Sistem eklenemedi'");
                }
            } catch (error) {
                message.error(error.response?.data?.detail || error.message);
            }
            setCreateSistemAdi('');
        }
    };

    const handleAddMalzeme = async (event) => {
        event.preventDefault();
        let today = new Date();
        today.setUTCHours(today.getUTCHours() + 3);
        let lok = selectedRadioBValue === 'd' ? null : displayedMalzeme.lok;

        handleAddingStringType();

        const formattedData = {
            ...displayedMalzeme,
            giris_tarihi: today.toISOString(),
            system_id: displayedSystem.id,
            mevzi_id: lok
        };

        try {
            const response = await Axios.post('/api/malzeme/add/', formattedData, {
            });

            if (response.status === 200 || response.status === 201) {
                message.success('Malzeme eklendi!');
                fetchMalzemeler(displayedSystem.id);
            } else {
                message.error("Malzeme eklenemedi'");
            }
        } catch (error) {
            message.error(error.response?.data?.detail || error.message);
        }
        setAddMalzemePanel(false);
        setAddMevziPanel(false);
    };


    async function handleAddingStringType() {
        if (typeof tempType === 'string' && !all_types.some(type => type.name === tempType)) {
            try {
                const type_id = await addNewType(tempType);
                setDisplayedMalzeme(prev => ({ ...prev, type: type_id }));
            } catch (error) {
                console.error("Error adding new type:", error);
            }
        }
    }

    const handleAddMevzi = async (event) => {
        event.preventDefault();

        // handleImageUpload(displayedMevzi.name);

        const formattedData = {
            ...displayedMevzi,
            ip_list: ips,
            sistemler: selectedSistemler.map(item => item.id),
            foto_albums: albumler,
            gorevler: selectedGorevler,
            alt_y: altySwitchOpen ? chosenAltYInfo : {}
            //foto_albums: albumler
        };

        try {
            const response = await Axios.post('/api/mevzi/add/', formattedData, {});
            if (response.status === 200 || response.status === 201) {
                message.success('Mevzi eklendi!');
                fetchMalzemeler(displayedSystem.id);
            } else {
                message.error("Mevzi eklenemedi'");
            }
        } catch (error) {
            message.error(error.response?.data?.detail || error.message);
        }
        setAddMevziPanel(false);
        fetchAllMevzi();
        setSelectedGorevler([]);
        setGorevler(["Kurulum", "Onarım", "Bakım"]);
        setSelectedSistemler([]);
        setChosenaltYInfo({});
        setAltYInfo(["Klima", "Kabin", "Jenarator", "Regulator", "Enerji Alt Yapısı", "Haberleşme Alt Yapısı", "KGK", "Kamera", "Şebeke Alt Yapısı"]);
        setIps({});
    };






    const toggleSwitch = () => {
        setaltySwitchOpen(!altySwitchOpen);
    };


    return (
        <Container className="main-main-container">
            {/* <Typography className="main-big-heading" variant="h5" component="h1" gutterBottom>
                <strong>Takip Sistemine Hoş Geldiniz!</strong>
            </Typography> */}
            <div className='main-content-main'>
                <div className='main-left-cont'>
                    <Typography variant="h5" component="h2" gutterBottom>
                        <strong>Sistemler</strong>
                        {isRoleAdmin && (
                            <>
                                <div>
                                    <CustomTextField id="standard-basic"
                                        autoComplete="off"
                                        label="Sistem Adı"
                                        variant="standard"
                                        value={createSistemAdi}
                                        onChange={(e) => setCreateSistemAdi(e.target.value)}
                                    />
                                    <Tooltip title="Sistem Ekle" >
                                        <IconButton onClick={(event) => handleAddSistem(event)} >
                                            <AddCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </>
                        )}
                    </Typography>
                    <div className='main-scroll'>
                        {systems.length > 0 ? (
                            systems.map(sys => (
                                <div key={sys.id}>
                                    <div className="main-all-list">
                                        <Paper key={sys.id} className="main-single-item" onClick={() => handleSistemClick(sys)} elevation={2}>
                                            <Typography className="main-in-box-heading" variant="subtitle1" gutterBottom alignItems='center'>
                                                {sys.name}
                                            </Typography>
                                        </Paper>
                                        <Tooltip title="Sil">
                                            <IconButton onClick={(event) => handleDeleteSystemClick(sys, event)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>

                                </div>
                            )
                            )) : (
                            <Typography>Görüntülenecek Sistem bulunmamaktadır.</Typography>
                        )}
                    </div>
                </div>


                <div className='main-mid-cont'>
                    {addMalzemePanel ? (
                        <div>
                            <Typography variant="h5" component="h2" gutterBottom>
                                <strong>Malzeme Ekle</strong>
                            </Typography>
                            <div className='main-scroll-mid'>
                                <form>
                                    <CustomTextField
                                        autoComplete="off"
                                        label="Isim"
                                        required
                                        fullWidth
                                        variant="filled"
                                        value={displayedMalzeme?.name}
                                        onChange={(e) => { setDisplayedMalzeme({ ...displayedMalzeme, name: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <CustomTextField
                                        autoComplete="off"
                                        label="Seri Numara"
                                        required
                                        fullWidth
                                        variant="filled"
                                        value={displayedMalzeme?.seri_num}
                                        onChange={(e) => { setDisplayedMalzeme({ ...displayedMalzeme, seri_num: e.target.value }) }}
                                        margin="normal"
                                    />
                                    
                                    <CustomTextField
                                        autoComplete="off"
                                        label="Açıklama"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        variant="filled"
                                        value={displayedMalzeme?.description}
                                        onChange={(e) => { setDisplayedMalzeme({ ...displayedMalzeme, description: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                        <Autocomplete
                                            freeSolo
                                            fullWidth
                                            placeHolder="Tür"
                                            options={all_types}
                                            getOptionLabel={(option) => option.name}
                                            onChange={handleTypeOptionChange}
                                            onInputChange={(e) => { setTempType(e.target.value) }}
                                            filterOptions={filterTypeOptions}
                                            renderInput={(params) => (
                                                <CustomAutocompleteTextField {...params} label="Türü" variant="filled" fullWidth margin="normal"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <InputAdornment position="end" style={{ alignItems: 'end' }}>
                                                                <ArrowDropDownIcon style={{ color: 'white' }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                        <Tooltip
                                            title="Yeni Tür eklemek için yeni bir tür isimi girebilirsiniz."
                                            placement="right"
                                        >
                                            <InfoIcon style={{ color: 'white', marginLeft: '8px' }} />
                                        </Tooltip>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div>
                                            Lokasyon:
                                        </div>
                                        <div style={{ marginLeft: '10px' }} >
                                            <FormControlLabel
                                                control={<Radio {...controlProps('d')} color="default" />}
                                                label="Depo"
                                            />

                                            <FormControlLabel
                                                control={<Radio {...controlProps('m')} color="default" />}
                                                label="Mevzi"
                                            />
                                        </div>
                                    </div>

                                    {selectedRadioBValue === 'm' && (
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                            <Autocomplete
                                                freeSolo
                                                fullWidth
                                                options={mevziler}
                                                getOptionLabel={(option) => option.name}
                                                onChange={handleMevziOptionChange}
                                                filterOptions={filterTypeOptions}
                                                renderInput={(params) => (
                                                    <CustomAutocompleteTextField {...params} label="Mevzi" variant="filled" fullWidth margin="normal"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <InputAdornment position="end" style={{ alignItems: 'end' }}>
                                                                    <ArrowDropDownIcon style={{ color: 'white' }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Tooltip
                                                title="Yeni Mevzi eklemek için sağdaki paneli kullanabilir veya aşağıda sadece yeni Mevzi için isim belirleyerek boş bir mevzi ekleyebilirsiniz. Daha sonra Mevzi'nizin detaylarını güncelleyebilirsiniz."
                                                placement="right"
                                            >
                                                <InfoIcon style={{ color: 'white', marginLeft: '8px' }} />
                                            </Tooltip>
                                        </div>
                                    )}

                                    {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <CustomDateTimeField label="Arıza Tarihi ve Saati" format="DD/MM/YYYY HH:mm" onChange={(newValue) => setNewChosenDate(newValue)} />
                                            </LocalizationProvider>
                                            <Button onClick={() => handleArizaDateChange(newChosenDate)}>
                                                Arıza Kaydı Ekle
                                            </Button>
                                        </div>
                                        <div>
                                            {displayedMalzeme.arizalar && displayedMalzeme.arizalar.length > 0 && (
                                                <ul>
                                                    {displayedMalzeme.arizalar.map((ariza, index) => (
                                                        <li key={index}>
                                                            {dayjs(ariza).locale('tr').format('DD/MM/YYYY HH:mm')}
                                                            <Tooltip title="Kaldır">
                                                                <IconButton style={{ paddingTop: '0px', paddingRight: '0px', paddingLeft: '0px', paddingButtom: '0px' }} onClick={() => handleDeleteAriza(index)} aria-label="delete">
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <CustomDateTimeField label="Onarım Tarihi ve Saati" format="DD/MM/YYYY HH:mm" onChange={(newValue) => setNewChosenDate(newValue)} />
                                            </LocalizationProvider>
                                            <Button onClick={() => handleOnarimDateChange(newChosenDate)}>
                                                Onarım Kaydı Ekle
                                            </Button>
                                        </ div>
                                        <div>
                                            {displayedMalzeme.onarimlar && displayedMalzeme.onarimlar.length > 0 && (
                                                <ul>
                                                    {displayedMalzeme.onarimlar.map((onarim, index) => (
                                                        <li key={index}>
                                                            {dayjs(onarim).locale('tr').format('DD/MM/YYYY HH:mm')}
                                                            <Tooltip title="Kaldır">
                                                                <IconButton onClick={() => handleDeleteOnarim(index)} aria-label="delete">
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <CustomDateTimeField label="Bakım Tarihi ve Saati" format="DD/MM/YYYY HH:mm" onChange={(newValue) => setNewChosenDate(newValue)} />
                                            </LocalizationProvider>
                                            <Button onClick={() => handleBakimDateChange(newChosenDate)}>
                                                Bakım Kaydı Ekle
                                            </Button>
                                        </div>

                                        <div>
                                            {displayedMalzeme.bakimlar && displayedMalzeme.bakimlar.length > 0 && (
                                                <ul>
                                                    {displayedMalzeme.bakimlar.map((bakim, index) => (
                                                        <li key={index}>
                                                            {dayjs(bakim).locale('tr').format('DD/MM/YYYY HH:mm')}
                                                            <Tooltip title="Kaldır">
                                                                <IconButton onClick={() => handleDeleteBakim(index)} aria-label="delete">
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div> */}

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button onClick={(event) => handleAddMalzeme(event)}>
                                            Kaydet
                                        </Button>
                                    </div>

                                </form>
                            </div>

                        </div>
                    ) : (
                        <>
                            <Typography variant="h5" component="h2" gutterBottom>
                                <strong>Malzemeler</strong>
                                {isRoleAdmin && (
                                    <Tooltip title="Malzeme Ekle" >
                                        <IconButton onClick={(event) => handleAddMalzemeClick(event)} style={{ marginRight: '6px' }}>
                                            <AddCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Typography>
                            <div className='main-scroll-right'>
                                {malzemeler.length > 0 ? (
                                    malzemeler.map(malz => (
                                        <div key={malz.id}>
                                            <div className="main-all-list">
                                                <Paper key={malz.id} className="main-single-item" onClick={() => handleMalzemeClick(malz)} elevation={2}>
                                                    <Typography className="main-in-box-heading" variant="subtitle1" gutterBottom alignItems='center'>
                                                        {malz.name}
                                                    </Typography>
                                                </Paper>
                                            </div>

                                        </div>
                                    )
                                    )) : (
                                    <Typography>Sistemde Malzeme bulunmamaktadır.</Typography>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className='main-right-cont'>
                    {addMevziPanel ? (
                        <div>
                            <Typography variant="h5" component="h2" gutterBottom>
                                <strong>Mevzi Ekle</strong>
                            </Typography>
                            <div className='main-scroll'>
                                <form>
                                    <CustomTextField
                                        autoComplete="off"
                                        label="Isim"
                                        required
                                        fullWidth
                                        variant="filled"
                                        value={displayedMevzi?.name}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, name: e.target.value }) }}
                                        margin="normal"
                                    />
                                    <CustomTextField
                                        autoComplete="off"
                                        label="Açıklama"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        variant="filled"
                                        value={displayedMevzi?.description}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, description: e.target.value }) }}
                                        margin="normal"
                                    />

                                    {/* <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', alignItems: 'flex-start', marginTop: '10px' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <CustomDateField variant="filled" fullWidth label="Keşif Tarih" format="DD/MM/YYYY" onChange={handleKesifTarihChange} />
                                        </LocalizationProvider>

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <CustomDateField variant="filled" fullWidth label="Kurulum Tarih" format="DD/MM/YYYY" onChange={handleKurulumTarihChange} />
                                        </LocalizationProvider>
                                    </div> */}

                                    <CustomTextField
                                        autoComplete="off"
                                        label="Bakım Sorumlusu"
                                        fullWidth
                                        variant="filled"
                                        value={displayedMevzi?.bakim_sorumlusu}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, bakim_sorumlusu: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <CustomTextField
                                        autoComplete="off"
                                        label="Kordinat (MGRS)"
                                        fullWidth
                                        variant="filled"
                                        value={displayedMevzi?.kordinat}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, kordinat: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <CustomTextField
                                        autoComplete="off"
                                        label="Adres"
                                        fullWidth
                                        variant="filled"
                                        value={displayedMevzi?.address}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, address: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <CustomTextField
                                        autoComplete="off"
                                        label="Ulaşım Şekli"
                                        fullWidth
                                        variant="filled"
                                        value={displayedMevzi?.ulasim}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, ulasim: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <CustomTextField
                                        autoComplete="off"
                                        label="İşleten / Şube"
                                        fullWidth
                                        variant="filled"
                                        value={displayedMevzi?.sube}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, sube: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <CustomTextField
                                        autoComplete="off"
                                        label="Rakım"
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        inputProps={{ step: "0.01" }}
                                        value={displayedMevzi?.rakim}
                                        onChange={(e) => { setDisplayedMevzi({ ...displayedMevzi, rakim: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                                        <Autocomplete
                                            freeSolo
                                            multiple
                                            id="tags-filled"
                                            options={gorevler}
                                            // getOptionLabel={(option) => option}
                                            value={selectedGorevler}
                                            onChange={handleGorevOptionChange}
                                            renderInput={(params) => (
                                                <CustomAutocompleteTextField
                                                    {...params}
                                                    variant="filled"
                                                    label="Görevler"
                                                    placeholder="Görev Ekle"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <InputAdornment position="end" style={{ alignItems: 'end' }}>
                                                                <ArrowDropDownIcon style={{ color: 'white' }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div style={{ marginTop: '15px' }}>
                                        <Autocomplete
                                            multiple
                                            id="tags-filled"
                                            options={sistemler}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedSistemler}
                                            onChange={handleChosenSistemlerChange}
                                            renderInput={(params) => (
                                                <CustomAutocompleteTextField
                                                    {...params}
                                                    variant="filled"
                                                    label="Sistemler"
                                                    placeholder="Sistem Seç"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '10px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}>
                                                <CustomTextField
                                                    autoComplete="off"
                                                    label="Ip Başlığı"
                                                    fullWidth
                                                    variant="filled"
                                                    value={ipBasligi}
                                                    onChange={handleIpBasligiChange}
                                                    margin="normal"
                                                />
                                                <CustomTextField
                                                    autoComplete="off"
                                                    label="Ip Adresi"
                                                    fullWidth
                                                    variant="filled"
                                                    value={ipAdresi}
                                                    onChange={handleIpAdresiChange}
                                                    margin="normal"
                                                />
                                            </div>

                                            <Button onClick={handleAddIp}>
                                                Ekle
                                            </Button>
                                            <Tooltip
                                                title="Eklenecek IP adresi sayı sınırı yoktur."
                                                placement="right"
                                            >
                                                <InfoIcon style={{ color: 'white', marginLeft: '6px' }} />
                                            </Tooltip>
                                        </div>
                                        <div>
                                            {Object.keys(ips).length > 0 && (
                                                <ul>
                                                    {Object.entries(ips).map(([key, value], index) => (
                                                        <li key={index}>
                                                            {key}: {value}
                                                            <Tooltip title="Kaldır">
                                                                <IconButton onClick={() => handleDeleteIp(key)} aria-label="delete">
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Switch
                                                checked={altySwitchOpen}
                                                onChange={toggleSwitch}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            Alt Yapı Bilgisi Ekle
                                        </div>

                                        {altySwitchOpen && (
                                            <>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        freeSolo
                                                        id="tags-filled"
                                                        options={altYInfo}
                                                        value={altyBas}
                                                        onInputChange={(event, newValue) => handleAltYBasChange(event, newValue)}
                                                        renderInput={(params) => (
                                                            <CustomAutocompleteTextField
                                                                {...params}
                                                                variant="filled"
                                                                label="Alt Yapı Bilgisi"
                                                                placeholder="Alt Yapı Bilgisi Seç"
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <InputAdornment position="end" style={{ alignItems: 'end' }}>
                                                                            <ArrowDropDownIcon style={{ color: 'white' }} />
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    <Tooltip
                                                        title="Alt Yapı bilgilerini listeden seçebilir veya yeni ekleyebilirsiniz."
                                                        placement="right"
                                                    >
                                                        <InfoIcon style={{ color: 'white', marginLeft: '5px' }} />
                                                    </Tooltip>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <CustomTextField
                                                        multiline
                                                        rows={2}
                                                        fullWidth
                                                        autoComplete="off"
                                                        label="Detay"
                                                        variant="filled"
                                                        value={altyAc}
                                                        onChange={handleAltYAcChange}
                                                        margin="normal"
                                                    />

                                                    <Button onClick={handleAddAltYInfo}>
                                                        Alt Yapı Bilgis Ekle
                                                    </Button>
                                                </div>
                                                <div>
                                                    {Object.keys(chosenAltYInfo).length > 0 && (
                                                        <ul>
                                                            {Object.entries(chosenAltYInfo).map(([key, value], index) => (
                                                                <li key={index}>
                                                                    {key}: {value}
                                                                    <Tooltip title="Kaldır">
                                                                        <IconButton onClick={() => handleDeleteAltYInfo(key)} aria-label="delete">
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>


                                    {/*<div>
                                        <TextField
                                            label="Folder Name"
                                            value={folderName}
                                            onChange={handleFolderNameChange}
                                            variant="filled"
                                        />
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleImagesChange}
                                        />
                                        <Button onClick={addFolder}>Add Folder and Images</Button>
                                        <div>
                                            {folders.map((folder, index) => (
                                                <div key={index}>
                                                    <h4>{folder.folderName}</h4>
                                                    {folder.images.map((image, fileIndex) => (
                                                        <p key={fileIndex}>{image.name}</p>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
                                    



                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Button onClick={(event) => handleAddMevzi(event)}>
                                            Kaydet
                                        </Button>
                                    </div>

                                </form>
                            </div>

                        </div>
                    ) : (
                        <>
                            <Typography variant="h5" component="h2" gutterBottom>
                                <strong>Mevziler</strong>
                                {isRoleAdmin && (
                                    <Tooltip title="Mevzi Ekle" >
                                        <IconButton onClick={(event) => handleAddMevziClick(event)} style={{ marginRight: '6px' }}>
                                            <AddCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Typography>
                            <div className='main-scroll'>
                                {mevziler.length > 0 ? (
                                    mevziler.map(mevzi => (
                                        <div key={mevzi.id}>
                                            <div className="main-all-list">
                                                <Paper key={mevzi.id} className="main-single-item" onClick={() => handleMevziClick(mevzi)} elevation={2}>
                                                    <Typography className="main-in-box-heading" variant="subtitle1" gutterBottom alignItems='center'>
                                                        {mevzi.name}
                                                    </Typography>
                                                </Paper>
                                            </div>

                                        </div>
                                    )
                                    )) : (
                                    <Typography>Sistemde Malzeme bulunmamaktadır.</Typography>
                                )}
                            </div>
                        </>
                    )
                    }


                </div >

            </div >
        </Container >
    );
}
export default Main;