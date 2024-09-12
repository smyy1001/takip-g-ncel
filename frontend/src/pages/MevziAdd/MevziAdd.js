import './MevziAdd.css';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import Axios from '../../Axios';
import { Container, Typography, Button } from '@mui/material';
import { Tooltip, TextField, styled, Autocomplete, createFilterOptions, Radio, FormControlLabel, InputAdornment } from '@mui/material';
import { message } from 'antd';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
import InfoIcon from '@mui/icons-material/Info';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';


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

const CustomOutlinedButton = styled(Button)({
    '&.MuiButton-outlined': {
        color: 'white', // Text color
        borderColor: 'white', // Border color
        '&:hover': {
            borderColor: 'white', // Border color on hover
            backgroundColor: 'rgba(255, 255, 255, 0.1)' // Slight background color on hover
        },
        '&.Mui-focused': {
            borderColor: 'white !important', // Border color when focused
        },
        '&.Mui-disabled': {
            borderColor: 'rgba(255, 255, 255, 0.3)', // Border color when disabled
            color: 'rgba(255, 255, 255, 0.3)' // Text color when disabled
        }
    }
});



function MevziAdd({ isRoleAdmin }) {
    const [mevziInfo, setMevziInfo] = useState({ d_sistemler: [] });
    const [sistemInfo, setSistemInfo] = useState(null);
    const [selectedRadioBValue, setSelectedRadioBValue] = useState('i');
    const [b_sorumlulari, setB_sorumlulari] = useState([]);
    const [subeler, setSubeler] = useState([]);
    const [selectedSistemler, setSelectedSistemler] = useState([]);
    const [sistemler, setSistemler] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [kesifTarihi, setKesifTarihi] = useState(new Date());
    const [kurulumTraihi, setKurulumTarihi] = useState(new Date());
    const [kurulumTraihi2, setKurulumTraihi2] = useState(new Date());

    const turkey_cities = ["ADANA", "ADIYAMAN", "AFYONKARAHİSAR", "AĞRI", "AMASYA", "ANKARA",
        "ANTALYA", "ARTVİN", "AYDIN", "BALIKESİR", "BİLECİK", "BİNGÖL", "BİTLİS",
        "BOLU", "BURDUR", "BURSA", "ÇANAKKALE", "ÇANKIRI", "ÇORUM", "DENİZLİ", "DİYARBAKIR",
        "EDİRNE", "ELAZIĞ", "ERZİNCAN", "ERZURUM", "ESKİŞEHIR", "GAZİANTEP", "GİRESUN", "GÜMÜŞHANE",
        "HAKKARİ", "HATAY", "ISPARTA", "MERSİN", "İSTANBUL", "İZMİR", "KARS", "KASTAMONU",
        "KAYSERİ", "KIRKLARELİ", "KIRŞEHİR", "KOCAELİ", "KONYA", "KÜTAHYA", "MALATYA", "MANİSA",
        "KAHRAMANMARAŞ", "MARDİN", "MUĞLA", "MUŞ", "NEVŞEHİR", "NİĞDE", "ORDU", "RİZE", "SAKARYA",
        "SAMSUN", "SİİRT", "SİNOP", "SİVAS", "TEKİRDAĞ", "TOKAT", "TRABZON", "TUNCELİ", "ŞANLIURFA",
        "UŞAK", "VAN", "YOZGAT", "ZONGULDAK", "AKSARAY", "BAYBURT", "KARAMAN", "KIRIKKALE", "BATMAN",
        "ŞIRNAK", "BARTIN", "ARDAHAN", "IĞDIR", "YALOVA", "KARABÜK", "KİLİS", "OSMANİYE", "DÜZCE"];

    const countries = ["AFGANİSTAN", "ALMANYA", "AMERİKA BİRLEŞİK DEVLETLERİ", "ANDORRA", "ANGOLA", "ANTİGUA VE BARBUDA",
        "ARJANTİN", "ARNAVUTLUK", "AVUSTRALYA", "AVUSTURYA", "AZERBAYCAN", "BAHAMALAR", "BAHREYN", "BANGLADEŞ", "BARBADOS",
        "BATI SAHRA", "BELARUS", "BELÇİKA", "BELİZE", "BENİN", "BHUTAN", "BİRLEŞİK ARAP EMİRLİKLERİ", "BOLİVYA", "BOSNA-HERSEK",
        "BOTSUANA", "BREZİLYA", "BRUNEİ", "BULGARİSTAN", "BURKİNA FASO", "BURUNDİ", "CEZAYİR", "CİBUTİ", "ÇAD", "ÇEKYA", "ÇİN",
        "DANİMARKA", "DOMİNİKA", "DOMİNİK CUMHURİYETİ", "DOĞU TİMOR", "EKVADOR", "EKVATOR GİNESİ", "EL SALVADOR", "ENDONEZYA",
        "ERMENİSTAN", "ERİTRE", "ESTONYA", "ETİYOPYA", "FAS", "FİJİ", "FİLDİŞİ SAHİLİ", "FİLİPİNLER", "FİNLANDİYA", "FRANSA",
        "GABON", "GAMBİYA", "GANA", "GİNE", "GİNE-BİSSAU", "GRANADA", "GRENADA", "GÜNEY AFRİKA CUMHURİYETİ", "GÜNEY KORE", "GÜNEY SUDAN",
        "GUYANA", "HAİTİ", "HINDİSTAN", "HIRVATİSTAN", "HOLLANDA", "HONDURAS", "IRAK", "İRAN", "İRLANDA", "İSPANYA", "İSRAİL",
        "İSVEÇ", "İSVİÇRE", "İTALYA", "İZLANDA", "JAMAİKA", "JAPONYA", "KAMBOÇYA", "KAMERUN", "KANADA", "KARADAĞ", "KATAR", "KAZAKİSTAN",
        "KENYA", "KIBRIS CUMHURİYETİ", "KİRİBATİ", "KOLOMBİYA", "KOMORLAR", "KONGO CUMHURİYETİ", "KONGO DEMOKRATİK CUMHURİYETİ", "KOSOVA",
        "KOSTA RİKA", "KUVEYT", "KUZEY KORE", "KÜBA", "KIRGIZİSTAN", "LAOS", "LESOTO", "LETONYA", "LİBERYA", "LİBYA", "LİHTENŞTAYN",
        "LİTVANYA", "LÜBNAN", "LÜKSEMBURG", "MACARİSTAN", "MADAGASKAR", "MAKEDONYA", "MALAVİ", "MALDİVLER", "MALEZYA", "MALİ", "MALTA",
        "MARSHALL ADALARI", "MAURİTİUS", "MEKSİKA", "MİKRONEZYA", "MISIR", "MOĞOLİSTAN", "MOLDOVA", "MONAKO", "MORİTANYA", "MOZAMBİK",
        "MYANMAR", "NAMİBYA", "NAURU", "NEPAL", "NİJER", "NİJERYA", "NİKARAGUA", "NORVEÇ", "ORTA AFRİKA CUMHURİYETİ", "ÖZBEKİSTAN",
        "PAKİSTAN", "PALAU", "PANAMA", "PAPUA YENİ GİNE", "PARAGUAY", "PERU", "POLONYA", "PORTEKİZ", "ROMANYA", "RUANDA", "RUSYA",
        "SAİNT KİTTS VE NEVİS", "SAİNT LUCİA", "SAİNT VİNCENT VE GRENADİNLER", "SAMOA", "SAN MARİNO", "SAO TOME VE PRİNCİPE", "SENEGAL",
        "SEYŞELLER", "SIRBİSTAN", "SİERRA LEONE", "SİNGAPUR", "SLOVAKYA", "SLOVENYA", "SOLOMON ADALARI", "SOMALİ", "SRİ LANKA", "SUDAN",
        "SURİNAM", "SURİYE", "SUUDİ ARABİSTAN", "SVAZİLAND", "ŞİLİ", "TACİKİSTAN", "TANZANYA", "TAYLAND", "TAYVAN", "TOGO", "TONGA",
        "TRİNİDAD VE TOBAGO", "TUNUS", "TÜRKMENİSTAN", "TUVALU", "TÜRKİYE", "UGANDA", "UKRAYNA", "UMMAN", "URUGUAY", "ÜRDÜN", "VANUATU",
        "VATİKAN", "VENEZUELA", "VİETNAM", "YEMEN", "YENİ ZELANDA", "YUNANİSTAN", "ZAMBİYA", "ZİMBABVE"];

    const ulasim = ["Karayolu", "Helikopter", "Destekli Ulaşım"];

    const [errors, setErrors] = useState({
        kesifTarihi: '',
        kurulumTraihi: ''
    });

    const [d_sis, setD_Sis] = useState('');

    const formRef = useRef();

    const resetForm = () => {
        formRef.current.reset();
    };


    // MGRS 
    const isValidMGRS = (mgrs) => {
        // Basic regex pattern for MGRS validation (adjust as needed)
        const mgrsPattern = /^[0-9]{1,2}[C-X][A-HJ-NP-Z]{2}\d{1,5}\d{0,5}$/i;
        return mgrsPattern.test(mgrs);
    };


    // LOKASYON
    const handleMevziRadioBChange = (event) => {
        setSelectedRadioBValue(event.target.value);
    };

    const controlProps = (item) => ({
        checked: selectedRadioBValue === item,
        onChange: handleMevziRadioBChange,
        value: item,
        name: 'depo-mevzi-radio-button',
        inputProps: { 'aria-label': item },
    });



    // DIŞ SISTEMLER
    const handleDSistemlerChange = (newValue) => {
        if (newValue) {
            setMevziInfo((prev) => {
                const exists = prev.d_sistemler.some((a) => a === newValue);  // Use simple equality for strings

                if (!exists) {
                    setD_Sis("");
                    return {
                        ...prev,
                        d_sistemler: prev.d_sistemler ? [...prev.d_sistemler, newValue] : [newValue],
                    };
                } else {
                    setD_Sis("");
                    return prev;
                }
            });
        } else {
            message.error("Lütfen geçerli bir değer giriniz!");  // Adjusted error message for clarity
        }
    };
    const handleDeleteDSis = (indexToRemove) => {
        setMevziInfo(prev => ({
            ...prev,
            d_sistemler: prev.d_sistemler.filter((_, index) => index !== indexToRemove)
        }));
    };


    // SISTEMLER
    const fetchSistemler = async () => {
        try {
            const response = await Axios.get('/api/sistem/all/');
            setSistemler(response.data);
        } catch (error) {
            message.error(error.response?.data?.detail || error.message);
        }
    };

    const handleChosenSistemlerChange = (event, newValue) => {
        setSelectedSistemler(newValue);
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSaveSistem = async (event) => {
        event.preventDefault();
        const formattedData = {
            ...sistemInfo,
            kurulum_tarihi: kurulumTraihi2.toISOString().split('T')[0]
        };
        try {
            const response = await Axios.post('/api/sistem/add/', formattedData);
            if (response.status === 200 || response.status === 201) {
                message.success('Sistem eklendi!');
            } else {
                message.error("Sistem eklenemedi'");
            }
        } catch (error) {
            console.error("Error during form submission:", error.response?.data?.detail || error.message);
            message.error(error.response?.data?.detail || "An error occurred");
        }
        fetchSistemler();
        handleCloseModal();
        setSistemInfo(null);
    };


    // FETCH
    useEffect(() => {
        const fetchBS = async () => {
            try {
                const response = await Axios.get('/api/bakimsorumlulari/all');
                if (response.status === 200) {
                    setB_sorumlulari(response.data);
                } else {
                    message.error("Bakım sorumluları getirilemedi!");
                }
            } catch (error) {
                console.error("Error during data fetching:", error.response?.data?.detail || error.message);
                message.error(error.response?.data?.detail || "An error occurred");
            }
        };
        const fetchSube = async () => {
            try {
                const response = await Axios.get('/api/sube/all');
                if (response.status === 200) {
                    setSubeler(response.data);
                } else {
                    message.error("Subeler getirilemedi!");
                }
            } catch (error) {
                console.error("Error during data fetching:", error.response?.data?.detail || error.message);
                message.error(error.response?.data?.detail || "An error occurred");
            }
        };
        fetchBS();
        fetchSube();
        fetchSistemler();
    }, []);


    // EKLE
    const handleAddMevzi = async (event) => {
        event.preventDefault();
        if (isValidMGRS(mevziInfo.kordinat)) {
            const formattedData = {
                ...mevziInfo,
                kesif_tarihi: kesifTarihi.toISOString().split('T')[0],
                kurulum_tarihi: kurulumTraihi.toISOString().split('T')[0],
                yurt_i: selectedRadioBValue === 'i' ? true : false,
                y_sistemler: selectedSistemler.map(item => item.id)
            };
            console.log("Submitting the following data:", formattedData);
            try {
                const response = await Axios.post('/api/mevzi/add/', formattedData);
                if (response.status === 200 || response.status === 201) {
                    message.success('Mevzi eklendi!');
                    resetForm();
                } else {
                    message.error("Mevzi eklenemedi'");
                }
            } catch (error) {
                console.error("Error during form submission:", error.response?.data?.detail || error.message);
                message.error(error.response?.data?.detail || "An error occurred");
            }
        } else {
            message.error('Geçersiz MGRS');
        }
    };

    return (
        <Container className="mevzi-add-container">
            <Typography className='mevzi-add-big-header' variant="h6" gutterBottom component="div">
                Mevzi Ekle
            </Typography>
            <div className='mevzi-add-main-div-class'>
                <form ref={formRef} onSubmit={handleAddMevzi} className='mevzi-add-form'>
                    <div className='mevzi-add-direction-row'>

                        {/* LEFT */}
                        <div className='mevzi-add-to-the-left'>

                            <CustomTextField
                                autoComplete="off"
                                label="Mevzi Adı"
                                required
                                fullWidth
                                variant="filled"
                                value={mevziInfo?.name}
                                onChange={(e) => { setMevziInfo({ ...mevziInfo, name: e.target.value }) }}
                                margin="normal"
                            />

                            <CustomTextField
                                autoComplete="off"
                                label="İsmi"
                                fullWidth
                                variant="filled"
                                value={mevziInfo?.isim}
                                onChange={(e) => { setMevziInfo({ ...mevziInfo, isim: e.target.value }) }} name
                                margin="normal"
                            />



                            <CustomTextField
                                autoComplete="off"
                                label="Kordinat (MGRS)"
                                fullWidth
                                variant="filled"
                                value={mevziInfo?.kordinat}
                                // onChange={handleMGRSChange}
                                onChange={(e) => { setMevziInfo({ ...mevziInfo, kordinat: e.target.value }) }}
                                margin="normal"
                            />

                            <CustomTextField
                                autoComplete="off"
                                label="Rakım (Metre)"
                                fullWidth
                                variant="filled"
                                type="number"
                                inputProps={{ step: "0.01" }}
                                value={mevziInfo?.rakim}
                                onChange={(e) => { setMevziInfo({ ...mevziInfo, rakim: e.target.value }) }}
                                margin="normal"
                            />


                            <div style={{ display: 'flex', alignItems: 'center', margiTop: '15px' }}>
                                <div>
                                    Lokasyon:
                                </div>
                                <div style={{ marginLeft: '10px' }} >
                                    <FormControlLabel
                                        control={<Radio {...controlProps('i')} color="default" />}
                                        label="Yurt İçi"
                                    />

                                    <FormControlLabel
                                        control={<Radio {...controlProps('d')} color="default" />}
                                        label="Yurt Dışı"
                                    />
                                </div>
                            </div>

                            {selectedRadioBValue === 'i' ? (
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                    <Autocomplete
                                        fullWidth
                                        options={turkey_cities}
                                        getOptionLabel={(option) => option}
                                        onChange={(event, value) => setMevziInfo({ ...mevziInfo, lokasyon: value })}
                                        clearOnEscape
                                        renderInput={(params) => (
                                            <CustomAutocompleteTextField {...params} label="Türkiye" variant="filled" fullWidth margin="normal"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                    <Autocomplete
                                        fullWidth
                                        options={countries}
                                        getOptionLabel={(option) => option}
                                        onChange={(event, value) => setMevziInfo({ ...mevziInfo, lokasyon: value })}
                                        clearOnEscape
                                        renderInput={(params) => (
                                            <CustomAutocompleteTextField {...params} label="Yurt Dışı" variant="filled" fullWidth margin="normal"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            )}


                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                <Autocomplete
                                    clearOnEscape
                                    fullWidth
                                    options={ulasim}
                                    getOptionLabel={(option) => option}
                                    onChange={(event, value) => setMevziInfo({ ...mevziInfo, ulasim: value })}
                                    renderInput={(params) => (
                                        <CustomAutocompleteTextField {...params} label="Ulaşım Şekli" variant="filled" fullWidth margin="normal"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </div>


                        </div>


                        {/* RIGHT */}
                        <div className='mevzi-add-to-the-right' >

                            <div style={{ marginTop: '18px', width: 'inherit' }} >
                                <LocalizationProvider className='mevzi-add-calender' dateAdapter={AdapterDayjs} adapterLocale="tr">
                                    <DatePicker
                                        label="Keşif Tarihi"
                                        clearOnEscape
                                        className='mevzi-add-calender'
                                        value={kesifTarihi}
                                        onChange={(newValue) => {
                                            setKesifTarihi(newValue);
                                            setErrors((prev) => ({ ...prev, kesifTarihi: "" }));
                                        }}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                className='mevzi-add-calender'
                                                label="Keşif Tarihi"
                                                error={!!errors.kesifTarihi}
                                                helperText={errors.kesifTarihi ? "Geçersiz tarih!" : ""}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </div>



                            <Autocomplete
                                fullWidth
                                clearOnEscape
                                placeholder="Bakım Sorumlusu"
                                options={b_sorumlulari}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => setMevziInfo({ ...mevziInfo, bakim_sorumlusu_id: value.id })}
                                renderInput={(params) => (
                                    <CustomAutocompleteTextField {...params} label="Bakım Sorumlusu" variant="filled" fullWidth margin="normal"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }}
                                    />
                                )}
                            />

                            <div style={{ marginTop: '18px', width: 'inherit' }} >
                                <LocalizationProvider className='mevzi-add-calender' dateAdapter={AdapterDayjs} adapterLocale="tr">
                                    <DatePicker
                                        label="İlk Sistem Kurulum Tarihi"
                                        clearOnEscape
                                        className='mevzi-add-calender'
                                        value={kurulumTraihi}
                                        onChange={(newValue) => {
                                            setKurulumTarihi(newValue);
                                            setErrors((prev) => ({ ...prev, kurulumTraihi: "" }));
                                        }}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                className='mevzi-add-calender'
                                                label="İlk Sistem Kurulum Tarihi"
                                                error={!!errors.kurulumTraihi}
                                                helperText={errors.kurulumTraihi ? "Geçersiz tarih!" : ""}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </div>


                            <Autocomplete
                                fullWidth
                                clearOnEscape
                                placeholder="Şube"
                                options={subeler}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => setMevziInfo({ ...mevziInfo, sube_id: value.id })}
                                renderInput={(params) => (
                                    <CustomAutocompleteTextField {...params} label="İşleten Şube" variant="filled" fullWidth margin="normal"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            )
                                        }}
                                    />
                                )}
                            />


                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', width: 'inherit' }}>
                                <CustomTextField
                                    autoComplete="off"
                                    label="Mevzide Bulunan Dış Kurum Sistemleri"
                                    fullWidth
                                    variant="filled"
                                    value={d_sis}
                                    onChange={(e) => setD_Sis(e.target.value)}
                                    margin="normal"
                                />

                                <Tooltip title="Dış Sistem Ekle" placement='right'>
                                    <IconButton onClick={() => handleDSistemlerChange(d_sis)}>
                                        <AddCircleIcon style={{ color: 'white', marginLeft: '8px' }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div>
                                {mevziInfo.d_sistemler && mevziInfo.d_sistemler.length > 0 && (
                                    <ul>
                                        {mevziInfo.d_sistemler.map((dS, index) => (
                                            <li key={index}>
                                                {dS}
                                                <Tooltip title="Kaldır">
                                                    <IconButton onClick={() => handleDeleteDSis(index)} aria-label="delete">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', width: 'inherit', marginTop:'10px' }}>
                                <Autocomplete
                                    multiple
                                    fullWidth
                                    id="tags-filled"
                                    options={sistemler}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedSistemler}
                                    onChange={handleChosenSistemlerChange}
                                    renderInput={(params) => (
                                        <CustomAutocompleteTextField
                                            {...params}
                                            variant="filled"
                                            label="Mevzideki Sistemler"
                                            placeholder="Sistem Seç"
                                        />
                                    )}
                                />

                                <Tooltip title="Sistem Ekle" placement='right'>
                                    <IconButton onClick={handleOpenModal}>
                                        <AddCircleIcon style={{ color: 'white', marginLeft: '8px' }} />
                                    </IconButton>
                                </Tooltip>
                            </div>

                            <Modal
                                open={modalOpen}
                                onClose={handleCloseModal}
                                aria-labelledby="Sistem Ekle"
                                aria-describedby="Yazılıma oluşturulan sistem ekle"
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                    outline: 'none'
                                }}>
                                    <CustomTextField
                                        autoComplete="off"
                                        label="Adı"
                                        required
                                        fullWidth
                                        variant="filled"
                                        value={sistemInfo?.name}
                                        onChange={(e) => { setSistemInfo({ ...sistemInfo, name: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <CustomTextField
                                        autoComplete="off"
                                        label="Kullanım Amacı"
                                        fullWidth
                                        variant="filled"
                                        value={sistemInfo?.kullanma_amaci}
                                        onChange={(e) => { setSistemInfo({ ...sistemInfo, kullanma_amaci: e.target.value }) }}
                                        margin="normal"
                                    />

                                    <div style={{ marginTop: '20px', width: '100%' }}>
                                        <LocalizationProvider className='mevzi-add-calender' dateAdapter={AdapterDayjs} adapterLocale="tr">
                                            <DatePicker
                                                label="Sistem Kurulum Tarihi"
                                                clearOnEscape
                                                className='mevzi-add-calender'
                                                value={ kurulumTraihi2 }
                                                onChange={(newValue) => {
                                                    setKurulumTraihi2(newValue);
                                                }}
                                                renderInput={(params) => (
                                                    <CustomTextField
                                                        {...params}
                                                        className='mevzi-add-calender'
                                                        label="Sistem Kurulum Tarihi"
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </div>

                                    <div style={{ display: 'flex', margiTop: '20px', flexDirection: 'column' }}>
                                        <div style={{ marginTop: '20px' }}>
                                            Frekans Bandı:
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row' }} >
                                            <CustomTextField
                                                autoComplete="off"
                                                label="Alt Sınır"
                                                variant="filled"
                                                type="number"
                                                inputProps={{ step: "0.01" }}
                                                value={sistemInfo?.frekans_k}
                                                onChange={(e) => { setSistemInfo({ ...sistemInfo, frekans_k: e.target.value }) }}
                                                margin="normal"
                                            />
                                            <div style={{ marginTop: '35px' }}>
                                                <RemoveIcon />
                                            </div>

                                            <CustomTextField
                                                autoComplete="off"
                                                label="Üst sınır"
                                                variant="filled"
                                                type="number"
                                                inputProps={{ step: "0.01" }}
                                                value={sistemInfo?.frekans_b}
                                                onChange={(e) => { setSistemInfo({ ...sistemInfo, frekans_b: e.target.value }) }}
                                                margin="normal"
                                            />
                                        </div>
                                    </div>


                                    <Button onClick={handleSaveSistem} color="primary">
                                        Ekle
                                    </Button>
                                </Box>
                            </Modal>

                        </div>

                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CustomOutlinedButton variant="outlined" type="submit">
                            Kaydet
                        </CustomOutlinedButton>
                    </div>

                </form>
            </div>
        </ Container>

    );
}

export default MevziAdd;
