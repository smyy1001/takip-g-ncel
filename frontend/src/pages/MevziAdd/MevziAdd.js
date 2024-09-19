import "./MevziAdd.css";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import Axios from "../../Axios";
import {
  Container,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Tooltip,
  TextField,
  styled,
  Autocomplete,
  createFilterOptions,
  Radio,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { message } from "antd";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveIcon from "@mui/icons-material/Remove";
import InfoIcon from "@mui/icons-material/Info";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import { ListItemIcon, ListItemText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Switch } from "@mui/material";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

const CustomAutocompleteTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white !important",
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
    '&[aria-selected="true"]': {
      backgroundColor: "#423532",
    },
    "&:hover": {
      backgroundColor: "#332725",
    },
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

function MevziAdd({ isRoleAdmin, systems, fetchSystems, mevzi }) {
  const options =
    mevzi && systems && systems.length > 0
      ? systems.flatMap((system) =>
          system.mevzi_id === mevzi.id && system.malzemeler.length > 0
            ? system.malzemeler.map((malz) => ({
                firstLetter: system.name,
                malzName: malz.name,
                malzId: malz.id,
              }))
            : []
        )
      : [];

  const [ips, setIps] = useState([]);
  const [selectedIp, setSelectedIp] = useState("");
  const [malzeme, setMalzeme] = useState(null);
  const [mevziInfo, setMevziInfo] = useState({ d_sistemler: [] });
  const [sistemInfo, setSistemInfo] = useState(null);
  const [selectedRadioBValue, setSelectedRadioBValue] = useState("i");
  const [b_sorumlulari, setB_sorumlulari] = useState([]);
  const [subeler, setSubeler] = useState([]);
  const [selectedSistemler, setSelectedSistemler] = useState([]);
  const [sistemler, setSistemler] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [kesifTarihi, setKesifTarihi] = useState(new Date());
  const [kurulumTraihi, setKurulumTarihi] = useState(new Date());
  const [kurulumTraihi2, setKurulumTraihi2] = useState(new Date());
  const [folders, setFolders] = useState([
    {
      folderName: "",
      selectedImages: [],
      deletedImages: [],
      existingImages: [],
    },
  ]);
  // ALT Y
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [iklimKlima, setIklimKlima] = useState(false);
  const handleIklimKlimaChange = (event) => {
    setIklimKlima(event.target.checked);
  };
  const [modalOpen2, setModalOpen2] = useState(false);
  const [altY, setAltY] = useState([
    { klima: "" },
    { rack_kabin: "" },
    { konteyner: "" },
    { voltaj: 0, jenerator: "", guc_k: "", regulator: "" },
    { t: "", r_l: "", uydu: "", telekom: "", g_modem: "" },
  ]);
  const [altYMessage, setAltYMessage] = useState("");
  const handleKlimaChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[0].klima = event.target.value;
    setAltY(updatedAltY);
  };
  const [kabinRack, setKabinRack] = useState(false);
  const handleKabinChange = (event) => {
    setKabinRack(event.target.checked);
  };
  const handleRackKabinChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[1].rack_kabin = event.target.value;
    setAltY(updatedAltY);
  };
  const [konteyner, setKonteyner] = useState(false);
  const handleKAlanChange = (event) => {
    setKonteyner(event.target.checked);
  };
  const handleKonteynerChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[2].konteyner = event.target.value;
    setAltY(updatedAltY);
  };

  const [jenerator, setJenerator] = useState(false);
  const handleEnerjiJeChange = (event) => {
    setJenerator(event.target.checked);
  };
  const handleJeneratorChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[3].jenerator = event.target.value;
    setAltY(updatedAltY);
  };
  const [guc_k, setGuc_k] = useState(false);
  const handleEnerjiGKChange = (event) => {
    setGuc_k(event.target.checked);
  };
  const handleGuc_KChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[3].guc_k = event.target.value;
    setAltY(updatedAltY);
  };
  const [regulator, setRegulator] = useState(false);
  const handleEnerjiRegChange = (event) => {
    setRegulator(event.target.checked);
  };
  const handleRegulatorChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[3].regulator = event.target.value;
    setAltY(updatedAltY);
  };
  const [voltaj, setVoltaj] = useState(false);
  const handleEnerjiVoChange = (event) => {
    setVoltaj(event.target.checked);
  };
  const handleVoltajChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[3].voltaj = event.target.value;
    setAltY(updatedAltY);
  };

  const [HaberT, setHaberT] = useState(false);
  const handleHaberTChange = (event) => {
    setHaberT(event.target.checked);
  };
  const handleTChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[4].t = event.target.value;
    setAltY(updatedAltY);
  };

  const [HaberRL, setHaberRL] = useState(false);
  const handleHaberRLChange = (event) => {
    setHaberRL(event.target.checked);
  };
  const handleRLChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[4].r_l = event.target.value;
    setAltY(updatedAltY);
  };

  const [uydu, setUydu] = useState(false);
  const handleHaberUyduChange = (event) => {
    setUydu(event.target.checked);
  };
  const handleUyduChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[4].uydu = event.target.value;
    setAltY(updatedAltY);
  };

  const [telekom, setTelekom] = useState(false);
  const handleHaberTelekomChange = (event) => {
    setTelekom(event.target.checked);
  };
  const handleTelekomChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[4].telekom = event.target.value;
    setAltY(updatedAltY);
  };

  const [g_modem, setg_modem] = useState(false);
  const handleHaberg_modemChange = (event) => {
    setg_modem(event.target.checked);
  };
  const handleg_modemChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[4].g_modem = event.target.value;
    setAltY(updatedAltY);
  };
  const isAltYEmpty = () => {
    return altY.every((item) => {
      return Object.values(item).every((value) => value === "" || value === 0);
    });
  };
  const [deletedIps, setDeletedIps] = useState([]);
  const turkey_cities = [
    "ADANA",
    "ADIYAMAN",
    "AFYONKARAHİSAR",
    "AĞRI",
    "AMASYA",
    "ANKARA",
    "ANTALYA",
    "ARTVİN",
    "AYDIN",
    "BALIKESİR",
    "BİLECİK",
    "BİNGÖL",
    "BİTLİS",
    "BOLU",
    "BURDUR",
    "BURSA",
    "ÇANAKKALE",
    "ÇANKIRI",
    "ÇORUM",
    "DENİZLİ",
    "DİYARBAKIR",
    "EDİRNE",
    "ELAZIĞ",
    "ERZİNCAN",
    "ERZURUM",
    "ESKİŞEHIR",
    "GAZİANTEP",
    "GİRESUN",
    "GÜMÜŞHANE",
    "HAKKARİ",
    "HATAY",
    "ISPARTA",
    "MERSİN",
    "İSTANBUL",
    "İZMİR",
    "KARS",
    "KASTAMONU",
    "KAYSERİ",
    "KIRKLARELİ",
    "KIRŞEHİR",
    "KOCAELİ",
    "KONYA",
    "KÜTAHYA",
    "MALATYA",
    "MANİSA",
    "KAHRAMANMARAŞ",
    "MARDİN",
    "MUĞLA",
    "MUŞ",
    "NEVŞEHİR",
    "NİĞDE",
    "ORDU",
    "RİZE",
    "SAKARYA",
    "SAMSUN",
    "SİİRT",
    "SİNOP",
    "SİVAS",
    "TEKİRDAĞ",
    "TOKAT",
    "TRABZON",
    "TUNCELİ",
    "ŞANLIURFA",
    "UŞAK",
    "VAN",
    "YOZGAT",
    "ZONGULDAK",
    "AKSARAY",
    "BAYBURT",
    "KARAMAN",
    "KIRIKKALE",
    "BATMAN",
    "ŞIRNAK",
    "BARTIN",
    "ARDAHAN",
    "IĞDIR",
    "YALOVA",
    "KARABÜK",
    "KİLİS",
    "OSMANİYE",
    "DÜZCE",
  ];

  const countries = [
    "AFGANİSTAN",
    "ALMANYA",
    "AMERİKA BİRLEŞİK DEVLETLERİ",
    "ANDORRA",
    "ANGOLA",
    "ANTİGUA VE BARBUDA",
    "ARJANTİN",
    "ARNAVUTLUK",
    "AVUSTRALYA",
    "AVUSTURYA",
    "AZERBAYCAN",
    "BAHAMALAR",
    "BAHREYN",
    "BANGLADEŞ",
    "BARBADOS",
    "BATI SAHRA",
    "BELARUS",
    "BELÇİKA",
    "BELİZE",
    "BENİN",
    "BHUTAN",
    "BİRLEŞİK ARAP EMİRLİKLERİ",
    "BOLİVYA",
    "BOSNA-HERSEK",
    "BOTSUANA",
    "BREZİLYA",
    "BRUNEİ",
    "BULGARİSTAN",
    "BURKİNA FASO",
    "BURUNDİ",
    "CEZAYİR",
    "CİBUTİ",
    "ÇAD",
    "ÇEKYA",
    "ÇİN",
    "DANİMARKA",
    "DOMİNİKA",
    "DOMİNİK CUMHURİYETİ",
    "DOĞU TİMOR",
    "EKVADOR",
    "EKVATOR GİNESİ",
    "EL SALVADOR",
    "ENDONEZYA",
    "ERMENİSTAN",
    "ERİTRE",
    "ESTONYA",
    "ETİYOPYA",
    "FAS",
    "FİJİ",
    "FİLDİŞİ SAHİLİ",
    "FİLİPİNLER",
    "FİNLANDİYA",
    "FRANSA",
    "GABON",
    "GAMBİYA",
    "GANA",
    "GİNE",
    "GİNE-BİSSAU",
    "GRANADA",
    "GRENADA",
    "GÜNEY AFRİKA CUMHURİYETİ",
    "GÜNEY KORE",
    "GÜNEY SUDAN",
    "GUYANA",
    "HAİTİ",
    "HINDİSTAN",
    "HIRVATİSTAN",
    "HOLLANDA",
    "HONDURAS",
    "IRAK",
    "İRAN",
    "İRLANDA",
    "İSPANYA",
    "İSRAİL",
    "İSVEÇ",
    "İSVİÇRE",
    "İTALYA",
    "İZLANDA",
    "JAMAİKA",
    "JAPONYA",
    "KAMBOÇYA",
    "KAMERUN",
    "KANADA",
    "KARADAĞ",
    "KATAR",
    "KAZAKİSTAN",
    "KENYA",
    "KIBRIS CUMHURİYETİ",
    "KİRİBATİ",
    "KOLOMBİYA",
    "KOMORLAR",
    "KONGO CUMHURİYETİ",
    "KONGO DEMOKRATİK CUMHURİYETİ",
    "KOSOVA",
    "KOSTA RİKA",
    "KUVEYT",
    "KUZEY KORE",
    "KÜBA",
    "KIRGIZİSTAN",
    "LAOS",
    "LESOTO",
    "LETONYA",
    "LİBERYA",
    "LİBYA",
    "LİHTENŞTAYN",
    "LİTVANYA",
    "LÜBNAN",
    "LÜKSEMBURG",
    "MACARİSTAN",
    "MADAGASKAR",
    "MAKEDONYA",
    "MALAVİ",
    "MALDİVLER",
    "MALEZYA",
    "MALİ",
    "MALTA",
    "MARSHALL ADALARI",
    "MAURİTİUS",
    "MEKSİKA",
    "MİKRONEZYA",
    "MISIR",
    "MOĞOLİSTAN",
    "MOLDOVA",
    "MONAKO",
    "MORİTANYA",
    "MOZAMBİK",
    "MYANMAR",
    "NAMİBYA",
    "NAURU",
    "NEPAL",
    "NİJER",
    "NİJERYA",
    "NİKARAGUA",
    "NORVEÇ",
    "ORTA AFRİKA CUMHURİYETİ",
    "ÖZBEKİSTAN",
    "PAKİSTAN",
    "PALAU",
    "PANAMA",
    "PAPUA YENİ GİNE",
    "PARAGUAY",
    "PERU",
    "POLONYA",
    "PORTEKİZ",
    "ROMANYA",
    "RUANDA",
    "RUSYA",
    "SAİNT KİTTS VE NEVİS",
    "SAİNT LUCİA",
    "SAİNT VİNCENT VE GRENADİNLER",
    "SAMOA",
    "SAN MARİNO",
    "SAO TOME VE PRİNCİPE",
    "SENEGAL",
    "SEYŞELLER",
    "SIRBİSTAN",
    "SİERRA LEONE",
    "SİNGAPUR",
    "SLOVAKYA",
    "SLOVENYA",
    "SOLOMON ADALARI",
    "SOMALİ",
    "SRİ LANKA",
    "SUDAN",
    "SURİNAM",
    "SURİYE",
    "SUUDİ ARABİSTAN",
    "SVAZİLAND",
    "ŞİLİ",
    "TACİKİSTAN",
    "TANZANYA",
    "TAYLAND",
    "TAYVAN",
    "TOGO",
    "TONGA",
    "TRİNİDAD VE TOBAGO",
    "TUNUS",
    "TÜRKMENİSTAN",
    "TUVALU",
    "TÜRKİYE",
    "UGANDA",
    "UKRAYNA",
    "UMMAN",
    "URUGUAY",
    "ÜRDÜN",
    "VANUATU",
    "VATİKAN",
    "VENEZUELA",
    "VİETNAM",
    "YEMEN",
    "YENİ ZELANDA",
    "YUNANİSTAN",
    "ZAMBİYA",
    "ZİMBABVE",
  ];

  const ulasim = ["Karayolu", "Helikopter", "Destekli Ulaşım"];

  const [errors, setErrors] = useState({
    kesifTarihi: "",
    kurulumTraihi: "",
  });

  const [d_sis, setD_Sis] = useState("");

  const formRef = useRef();

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
    name: "depo-mevzi-radio-button",
    inputProps: { "aria-label": item },
  });

  // DIŞ SISTEMLER
  const handleDSistemlerChange = (newValue) => {
    if (newValue) {
      setMevziInfo((prev) => {
        const exists = prev.d_sistemler.some((a) => a === newValue); // Use simple equality for strings

        if (!exists) {
          setD_Sis("");
          return {
            ...prev,
            d_sistemler: prev.d_sistemler
              ? [...prev.d_sistemler, newValue]
              : [newValue],
          };
        } else {
          setD_Sis("");
          return prev;
        }
      });
    } else {
      message.error("Lütfen geçerli bir değer giriniz!"); // Adjusted error message for clarity
    }
  };
  const handleDeleteDSis = (indexToRemove) => {
    setMevziInfo((prev) => ({
      ...prev,
      d_sistemler: prev.d_sistemler.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };
  const handleImageChange = (event, folderIndex) => {
    const files = Array.from(event.target.files);
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];
      updatedFolders[folderIndex].selectedImages = [
        ...updatedFolders[folderIndex].selectedImages,
        ...files,
      ];
      // console.log("Güncellenmiş Klasörler:", updatedFolders);
      return updatedFolders;
    });
  };

  const handleDeleteImage = (folderIndex, imageName) => {
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];
      updatedFolders[folderIndex].existingImages = updatedFolders[
        folderIndex
      ].existingImages.filter((img) => img.name !== imageName);
      updatedFolders[folderIndex].deletedImages.push(imageName);
      return updatedFolders;
    });
  };

  const handleFolderNameChange = (index, value) => {
    const updatedFolders = [...folders];
    updatedFolders[index].folderName = value;
    setFolders(updatedFolders);
  };

  const handleAddFolder = () => {
    setFolders((prevFolders) => [
      ...prevFolders,
      {
        folderName: "",
        selectedImages: [],
        existingImages: [],
        deletedImages: [],
      },
    ]);
  };

  const handleDeleteFolder = (folderIndex) => {
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];

      updatedFolders[folderIndex].existingImages.forEach((img) => {
        updatedFolders[folderIndex].deletedImages.push(img.name);
      });
      updatedFolders[folderIndex].existingImages = [];
      updatedFolders[folderIndex].selectedImages = [];
      return updatedFolders;
    });
  };

  // SISTEMLER
  const fetchSistemler = async () => {
    try {
      const response = await Axios.get("/api/sistem/all/");
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
    if (
      sistemInfo.frekans_b >= sistemInfo.frekans_k ||
      (!sistemInfo.frekans_b && !sistemInfo.frekans_k)
    ) {
      const formattedData = {
        ...sistemInfo,
        kurulum_tarihi: kurulumTraihi2.toISOString().split("T")[0],
      };
      try {
        const response = await Axios.post("/api/sistem/add/", formattedData);
        if (response.status === 200 || response.status === 201) {
          message.success("Sistem eklendi!");
          handleCloseModal();
        } else {
          message.error("Sistem eklenemedi'");
        }
      } catch (error) {
        console.error(
          "Error during form submission:",
          error.response?.data?.detail || error.message
        );
        message.error(error.response?.data?.detail || "An error occurred");
      }
      fetchSistemler();
      setSistemInfo(null);
    } else {
      message.error("Frekans bir aralık olmalıdır!");
    }
  };

  const handleDeleteYSis = async (id, event) => {
    try {
      const response = await Axios.delete(`/api/sistem/delete/${id}`);
      if (response.status === 200 || response.status === 204) {
        setSelectedSistemler(
          selectedSistemler.filter((item) => item.id !== id)
        );
        message.success("Sistem silindi!");
        fetchSistemler();
      } else {
        message.error("Sistem silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  // ALT YAPI

  const handleOpenModal2 = () => setModalOpen2(true);
  const handleCloseModal2 = () => {
    setModalOpen2(false);
    setIsSwitchOn(false);
  };
  const handleCloseModal3 = () => {
    setModalOpen2(false);
  };

  const handleSwitchChange = (event) => {
    setIsSwitchOn(event.target.checked);
    if (event.target.checked) {
      handleOpenModal2();
    } else {
      handleCloseModal2();
    }
  };

  // IP BILGILERI
  const handleIpChange = () => {
    if (malzeme && selectedIp) {
      const newEntry = [malzeme, mevzi.id, selectedIp];
      setIps([...ips, newEntry]);
      setSelectedIp("");
    } else {
      console.error("Malzeme name or IP is missing");
    }
  };

  const handleDeleteIp = (malzemeName) => {
    setDeletedIps((prev) => [...prev, malzemeName]);
    const updatedIps = ips.filter((item) => item[0] !== malzemeName);
    setIps(updatedIps);
  };

  // FETCH
  useEffect(() => {
    const fetchBS = async () => {
      try {
        const response = await Axios.get("/api/bakimsorumlulari/all");
        if (response.status === 200) {
          setB_sorumlulari(response.data);
        } else {
          message.error("Bakım sorumluları getirilemedi!");
        }
      } catch (error) {
        console.error(
          "Error during data fetching:",
          error.response?.data?.detail || error.message
        );
        message.error(error.response?.data?.detail || "An error occurred");
      }
    };
    const fetchSube = async () => {
      try {
        const response = await Axios.get("/api/sube/all");
        if (response.status === 200) {
          setSubeler(response.data);
        } else {
          message.error("Subeler getirilemedi!");
        }
      } catch (error) {
        console.error(
          "Error during data fetching:",
          error.response?.data?.detail || error.message
        );
        message.error(error.response?.data?.detail || "An error occurred");
      }
    };
    fetchBS();
    fetchSube();
    fetchSistemler();
  }, []);

  useEffect(() => {
    resetForm();
    if (mevzi) {
      setMevziInfo({
        name: mevzi.name || "",
        isim: mevzi.isim || "",
        kordinat: mevzi.kordinat || "",
        rakim: mevzi.rakim || "",
        ulasim: mevzi.ulasim || "",
        lokasyon: mevzi.lokasyon || "",
        kesif_tarihi: mevzi.kesif_tarihi
          ? dayjs(mevzi.kesif_tarihi)
          : new Date(),
        kurulum_tarihi: mevzi.kurulum_tarihi
          ? dayjs(mevzi.kurulum_tarihi)
          : new Date(),
        bakim_sorumlusu_id: mevzi.bakim_sorumlusu_id || null,
        d_sistemler: mevzi.d_sistemler || [],
        sube_id: mevzi.sube_id || null,
      });

      const selectedSistemlerData = mevzi.y_sistemler
        ? sistemler.filter((sistem) => mevzi.y_sistemler.includes(sistem.id))
        : [];
      if (mevzi.photos) {
        const foldersFromSystem = mevzi.photos?.reduce((acc, photoUrl) => {
          const folderName = photoUrl.split("/")[4];
          const photoName = photoUrl.split("/").pop();

          if (!acc[folderName]) {
            acc[folderName] = {
              folderName: folderName,
              selectedImages: [],
              existingImages: [{ name: photoName, url: photoUrl }],
              deletedImages: [],
            };
          } else {
            acc[folderName].existingImages.push({
              name: photoName,
              url: photoUrl,
            });
          }
          return acc;
        }, {});
        setFolders(Object.values(foldersFromSystem));
      }
      setSelectedSistemler(selectedSistemlerData);
      fetchSystems();
      if (mevzi?.alt_y_id) {
        fetchAltY();
      }
      fetchIps();
    }
  }, [mevzi]);

  const fetchIps = async () => {
    try {
      const response = await Axios.get(
        `/api/malzeme/malzmatches/get?mevzi_id=${mevzi.id}`
      );
      if (response.data.status === "success") {
        // Gelen veriyi doğrudan ips state'ine ata
        const fetchedIps = response.data.data.map(
          ({ malzeme_name, mevzi_id, ip }) => [malzeme_name, mevzi_id, ip]
        );

        setIps(fetchedIps); // Tüm IP'leri ips'e set et
      }
    } catch (error) {
      console.error("Error fetching IPs:", error);
    }
  };

  const fetchAltY = async () => {
    if (mevzi?.alt_y_id) {
      try {
        const response = await Axios.get(`/api/alt_y/${mevzi.alt_y_id}`);
        const data = response.data;

        // İlgili altyapı bileşenlerini alma
        const iklimResponse = data.iklim_alty
          ? await Axios.get(`/api/alt_y/iklim/${data.iklim_alty}`)
          : null;
        const kabinResponse = data.kabin_alty
          ? await Axios.get(`/api/alt_y/kabin/${data.kabin_alty}`)
          : null;
        const enerjiResponse = data.enerji_alty
          ? await Axios.get(`/api/alt_y/enerji/${data.enerji_alty}`)
          : null;
        const haberResponse = data.haberlesme_alty
          ? await Axios.get(`/api/alt_y/haber/${data.haberlesme_alty}`)
          : null;
        const kAlanResponse = data.kapali_alan_alty
          ? await Axios.get(`/api/alt_y/k_alan/${data.kapali_alan_alty}`)
          : null;

        // Alınan verileri doğru indekslere yerleştiriyoruz
        setAltY([
          { klima: iklimResponse?.data?.klima || "" },
          { rack_kabin: kabinResponse?.data?.rack_kabin || "" },
          { konteyner: kAlanResponse?.data?.konteyner || "" },
          {
            voltaj: enerjiResponse?.data?.voltaj || 0,
            jenerator: enerjiResponse?.data?.jenerator || "",
            guc_k: enerjiResponse?.data?.guc_k || "",
            regulator: enerjiResponse?.data?.regulator || "",
          },
          {
            t: haberResponse?.data?.t || "",
            r_l: haberResponse?.data?.r_l || "",
            uydu: haberResponse?.data?.uydu || "",
            telekom: haberResponse?.data?.telekom || "",
            g_modem: haberResponse?.data?.g_modem || "",
          },
        ]);
      } catch (error) {
        console.error("Alt yapı bilgileri çekilirken hata oluştu:", error);
      }
    }
  };

  const resetForm = () => {
    setMevziInfo({
      name: "",
      isim: "",
      kordinat: "",
      rakim: "",
      ulasim: "",
      kesif_tarihi: new Date(),
      kurulum_tarihi: new Date(),
      bakim_sorumlusu_id: null,
      d_sistemler: [],
      sube_id: null,
      lokasyon: "",
    });

    setSelectedSistemler([]);
    setSelectedRadioBValue("i");
    setIps([]);
    setSelectedIp("");
    setKesifTarihi(new Date());
    setKurulumTarihi(new Date());
    setFolders([]);
    setAltY([
      { klima: "" },
      { rack_kabin: "" },
      { konteyner: "" },
      { voltaj: 0, jenerator: "", guc_k: "", regulator: "" },
      { t: "", r_l: "", uydu: "", telekom: "", g_modem: "" },
    ]);
    setIklimKlima(false);
    setKabinRack(false);
    setKonteyner(false);
    setJenerator(false);
    setGuc_k(false);
    setRegulator(false);
    setTelekom(false);
    setHaberT(false);
    setHaberRL(false);
    setUydu(false);
    setg_modem(false);
    setIsSwitchOn(false);
  };

  // ALT YAPI BILGISI EKLE
  const handleSaveAltY = async () => {
    // console.log(altY);
    try {
      // Add Iklim (index 0)
      let haberID;
      let enerjiID;
      let kabinID;
      let kalanID;
      let iklimID;
      if (altY[0].klima !== "") {
        iklimID = await Axios.post("/api/alt_y/iklim/add/", {
          klima: altY[0].klima,
        });
        // console.log("Iklim added successfully", iklimID.data.id);
      }

      // Add Kabin (index 1)
      if (altY[1].rack_kabin !== "") {
        kabinID = await Axios.post("/api/alt_y/kabin/add/", {
          rack_kabin: altY[1].rack_kabin,
        });
        // console.log("Kabin added successfully");
      }

      // Add KAlan (index 4)
      if (altY[2].konteyner !== "") {
        kalanID = await Axios.post("/api/alt_y/k_alan/add/", {
          konteyner: altY[2].konteyner,
        });
        // console.log("Kalan added successfully");
      }

      // Add Enerji (index 3)
      if (
        altY[3].voltaj !== 0 ||
        altY[3].jenerator !== "" ||
        altY[3].guc_k !== "" ||
        altY[3].regulator !== ""
      ) {
        enerjiID = await Axios.post("/api/alt_y/enerji/add/", {
          ...altY[3],
        });
        // console.log("Enerji added successfully");
      }

      // Add Haber (index 2)
      if (
        altY[4].t !== "" ||
        altY[4].r_l !== "" ||
        altY[4].uydu !== "" ||
        altY[4].telekom !== "" ||
        altY[4].g_modem !== ""
      ) {
        haberID = await Axios.post("/api/alt_y/haber/add/", {
          ...altY[4],
        });
        // console.log("Haber added successfully");
      }

      const altYData = {
        enerji_alty: enerjiID?.data?.id || null,
        iklim_alty: iklimID?.data?.id || null,
        haberlesme_alty: haberID?.data?.id || null,
        kabin_alty: kabinID?.data?.id || null,
        kapali_alan_alty: kalanID?.data?.id || null,
      };

      // console.log("altyyyyyyyyyyyyyyy", altYData);
      const addedAltY = await Axios.post("/api/alt_y/add/", altYData);
      // console.log("alt id:     ", addedAltY.data.id);
      setMevziInfo({ ...mevziInfo, alt_y_id: addedAltY.data.id });
      // console.log("AltY entry added successfully");
      setAltYMessage("Alt Yapı bilgileri eklendi!");
    } catch (error) {
      console.error("Error adding items:", error);
      message.error("Hata alındı!");
    }
    handleCloseModal3();
  };

  // EKLE
  const handleAddMevzi = async (event) => {
    event.preventDefault();

    // Mevzi verilerini formData için hazırlıyoruz
    const mevziData = {
      name: mevziInfo?.name || null,
      isim: mevziInfo?.isim || null,
      kordinat: mevziInfo?.kordinat || null,
      rakim: mevziInfo?.rakim || null,
      ulasim: mevziInfo?.ulasim || null,
      lokasyon: mevziInfo?.lokasyon || null,
      kesif_tarihi: kesifTarihi
        ? kesifTarihi.toISOString().split("T")[0]
        : null,
      kurulum_tarihi: kurulumTraihi
        ? kurulumTraihi.toISOString().split("T")[0]
        : null,
      yurt_i: selectedRadioBValue === "i" ? true : false,
      bakim_sorumlusu_id: mevziInfo?.bakim_sorumlusu_id || null,
      d_sistemler: mevziInfo?.d_sistemler || [],
      sube_id: mevziInfo?.sube_id || null,
      y_sistemler: selectedSistemler.map((item) => item.id),
      alt_y_id: mevziInfo?.alt_y_id || null,
    };

    const formData = new FormData();
    formData.append("mevzi", JSON.stringify(mevziData));

    const folderImageCounts = [];
    const deletedImagesData = [];

    folders.forEach((folder, folderIndex) => {
      formData.append("folderNames", folder.folderName);

      folderImageCounts.push(folder.selectedImages.length);

      folder.selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      if (folder.deletedImages && folder.deletedImages.length > 0) {
        deletedImagesData.push({
          folderName: folder.folderName,
          deletedImages: folder.deletedImages,
        });
      }
    });

    formData.append("folderImageCounts", JSON.stringify(folderImageCounts));

    if (deletedImagesData.length > 0) {
      formData.append("deletedImagesData", JSON.stringify(deletedImagesData));
    }

    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      if (mevzi) {
        const formattedIps = ips.map(([malzemeName, mevziId, ip]) => ({
          malzeme_name: malzemeName,
          mevzi_id: mevziId,
          ip: ip,
        }));

        if (formattedIps.length > 0) {
          await Axios.put("/api/malzeme/malzmatches/add", formattedIps);
        }

        if (deletedIps.length > 0) {
          await Promise.all(
            deletedIps.map((malzemeName) =>
              Axios.delete(`/api/malzeme/malzmatches/delete/${malzemeName}`)
            )
          );
          setDeletedIps([]);
        }

        const response = await Axios.put(
          `/api/mevzi/update/${mevzi.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          message.success("Mevzi güncellendi!");
          resetForm();
        }
      } else {
        // Yeni mevzi ekleme isteği
        const response = await Axios.post("/api/mevzi/add/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200 || response.status === 201) {
          message.success("Mevzi eklendi!");
          resetForm();
        }
      }

      fetchSystems();
    } catch (error) {
      console.error("Error during form submission:", error);
      message.error(error.response?.data?.detail || "Bir hata oluştu.");
    }
  };

  return (
    <Container className="mevzi-add-container">
      {!mevzi && (
        <Typography
          className="mevzi-add-big-header"
          variant="h6"
          gutterBottom
          component="div"
        >
          Mevzi Ekle
        </Typography>
      )}
      <div className="mevzi-add-main-div-class">
        <form
          ref={formRef}
          onSubmit={handleAddMevzi}
          className="mevzi-add-form"
        >
          <div className="mevzi-add-direction-row">
            {/* LEFT */}
            <div
              className="mevzi-add-to-the-left"
              style={{ width: mevzi ? "27vw" : "40vw" }}
            >
              <CustomTextField
                autoComplete="off"
                label="Mevzi Adı"
                required
                fullWidth
                variant="filled"
                value={mevziInfo?.name}
                onChange={(e) => {
                  setMevziInfo({ ...mevziInfo, name: e.target.value });
                }}
                margin="normal"
              />

              <CustomTextField
                autoComplete="off"
                label="İsmi"
                fullWidth
                variant="filled"
                value={mevziInfo?.isim}
                onChange={(e) => {
                  setMevziInfo({ ...mevziInfo, isim: e.target.value });
                }}
                name
                margin="normal"
              />

              <CustomTextField
                autoComplete="off"
                label="Kordinat (MGRS)"
                fullWidth
                variant="filled"
                value={mevziInfo?.kordinat}
                // onChange={handleMGRSChange}
                onChange={(e) => {
                  setMevziInfo({ ...mevziInfo, kordinat: e.target.value });
                }}
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
                onChange={(e) => {
                  setMevziInfo({ ...mevziInfo, rakim: e.target.value });
                }}
                margin="normal"
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margiTop: "15px",
                }}
              >
                <div>Lokasyon:</div>
                <div style={{ marginLeft: "10px" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        {...controlProps("i")}
                        color="default"
                        checked={selectedRadioBValue === "i"}
                      />
                    }
                    label="Yurt İçi"
                  />

                  <FormControlLabel
                    control={
                      <Radio
                        {...controlProps("d")}
                        color="default"
                        hecked={selectedRadioBValue === "d"}
                      />
                    }
                    label="Yurt Dışı"
                  />
                </div>
              </div>

              {selectedRadioBValue === "i" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    options={turkey_cities}
                    getOptionLabel={(option) => option}
                    value={
                      turkey_cities.find(
                        (city) => city === mevziInfo?.lokasyon
                      ) || null
                    }
                    onChange={(event, value) =>
                      setMevziInfo({ ...mevziInfo, lokasyon: value })
                    }
                    clearOnEscape
                    renderInput={(params) => (
                      <CustomAutocompleteTextField
                        {...params}
                        label="Türkiye"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    options={countries}
                    getOptionLabel={(option) => option}
                    value={
                      countries.find((city) => city === mevziInfo?.lokasyon) ||
                      null
                    }
                    onChange={(event, value) =>
                      setMevziInfo({ ...mevziInfo, lokasyon: value })
                    }
                    clearOnEscape
                    renderInput={(params) => (
                      <CustomAutocompleteTextField
                        {...params}
                        label="Yurt Dışı"
                        variant="filled"
                        fullWidth
                        margin="normal"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Autocomplete
                  clearOnEscape
                  fullWidth
                  options={ulasim}
                  getOptionLabel={(option) => option}
                  onChange={(event, value) =>
                    setMevziInfo({ ...mevziInfo, ulasim: value })
                  }
                  value={
                    ulasim.find((option) => option === mevziInfo?.ulasim) ||
                    null
                  }
                  renderInput={(params) => (
                    <CustomAutocompleteTextField
                      {...params}
                      label="Ulaşım Şekli"
                      variant="filled"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="mevzi-add-to-the-right "
              style={{ width: mevzi ? "27vw" : "40vw" }}
            >
              <div style={{ marginTop: "18px", width: "inherit" }}>
                <LocalizationProvider
                  className="mevzi-add-calender"
                  dateAdapter={AdapterDayjs}
                  adapterLocale="tr"
                >
                  <DatePicker
                    label="Keşif Tarihi"
                    clearOnEscape
                    className="mevzi-add-calender"
                    value={kesifTarihi}
                    onChange={(newValue) => {
                      setKesifTarihi(newValue);
                      setErrors((prev) => ({ ...prev, kesifTarihi: "" }));
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        className="mevzi-add-calender"
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
                value={
                  b_sorumlulari.find(
                    (sorumlu) => sorumlu.id === mevziInfo?.bakim_sorumlusu_id
                  ) || null
                }
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  setMevziInfo({ ...mevziInfo, bakim_sorumlusu_id: value.id })
                }
                renderInput={(params) => (
                  <CustomAutocompleteTextField
                    {...params}
                    label="Bakım Sorumlusu"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />

              <div style={{ marginTop: "18px", width: "inherit" }}>
                <LocalizationProvider
                  className="mevzi-add-calender"
                  dateAdapter={AdapterDayjs}
                  adapterLocale="tr"
                >
                  <DatePicker
                    label="İlk Sistem Kurulum Tarihi"
                    clearOnEscape
                    className="mevzi-add-calender"
                    value={kurulumTraihi}
                    onChange={(newValue) => {
                      setKurulumTarihi(newValue);
                      setErrors((prev) => ({ ...prev, kurulumTraihi: "" }));
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        className="mevzi-add-calender"
                        label="İlk Sistem Kurulum Tarihi"
                        error={!!errors.kurulumTraihi}
                        helperText={
                          errors.kurulumTraihi ? "Geçersiz tarih!" : ""
                        }
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>

              <Autocomplete
                fullWidth
                clearOnEscape
                placeholder="Şube"
                value={
                  subeler.find((sube) => sube.id === mevziInfo?.sube_id) || null
                }
                options={subeler}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) =>
                  setMevziInfo({ ...mevziInfo, sube_id: value.id })
                }
                renderInput={(params) => (
                  <CustomAutocompleteTextField
                    {...params}
                    label="İşleten Şube"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  width: "inherit",
                }}
              >
                <CustomTextField
                  autoComplete="off"
                  label="Mevzide Bulunan Dış Kurum Sistemleri"
                  fullWidth
                  variant="filled"
                  value={d_sis}
                  onChange={(e) => setD_Sis(e.target.value)}
                  margin="normal"
                />

                <Tooltip title="Dış Sistem Ekle" placement="right">
                  <IconButton onClick={() => handleDSistemlerChange(d_sis)}>
                    <AddCircleIcon
                      style={{ color: "white", marginLeft: "8px" }}
                    />
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
                          <IconButton
                            onClick={() => handleDeleteDSis(index)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  width: "inherit",
                  marginTop: "10px",
                }}
              >
                <Autocomplete
                  multiple
                  fullWidth
                  id="tags-filled"
                  options={sistemler}
                  getOptionLabel={(option) => option.name}
                  value={selectedSistemler}
                  onChange={handleChosenSistemlerChange}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <ListItemIcon>
                        <Tooltip title="Sistemi kalıcı olarak siler!">
                          <DeleteIcon
                            onClick={() => handleDeleteYSis(option.id)}
                          />
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemText
                        primary={option.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: "text.primary", display: "inline" }}
                            >
                              {option.kurulum_tarihi}
                            </Typography>
                            {`  |  Frekans Bandı: ${option.frekans_k}-${option.frekans_b}`}
                            <br />
                            {`Kullanım amacı: ${option.kullanma_amaci}`}
                          </React.Fragment>
                        }
                      />
                    </li>
                  )}
                  renderInput={(params) => (
                    <CustomAutocompleteTextField
                      {...params}
                      variant="filled"
                      label="Mevzideki Sistemler"
                      placeholder="Sistem Seç"
                    />
                  )}
                />

                <Tooltip title="Sistem Ekle" placement="right">
                  <IconButton onClick={handleOpenModal}>
                    <AddCircleIcon
                      style={{ color: "white", marginLeft: "8px" }}
                    />
                  </IconButton>
                </Tooltip>
              </div>

              <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="Sistem Ekle"
                aria-describedby="Yazılıma oluşturulan sistem ekle"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    outline: "none",
                  }}
                >
                  <CustomTextField
                    autoComplete="off"
                    label="Adı"
                    required
                    fullWidth
                    variant="filled"
                    value={sistemInfo?.name}
                    onChange={(e) => {
                      setSistemInfo({ ...sistemInfo, name: e.target.value });
                    }}
                    margin="normal"
                  />

                  <CustomTextField
                    autoComplete="off"
                    label="Kullanım Amacı"
                    fullWidth
                    variant="filled"
                    value={sistemInfo?.kullanma_amaci}
                    onChange={(e) => {
                      setSistemInfo({
                        ...sistemInfo,
                        kullanma_amaci: e.target.value,
                      });
                    }}
                    margin="normal"
                  />

                  <div style={{ marginTop: "20px", width: "100%" }}>
                    <LocalizationProvider
                      className="mevzi-add-calender"
                      dateAdapter={AdapterDayjs}
                      adapterLocale="tr"
                    >
                      <DatePicker
                        label="Sistem Kurulum Tarihi"
                        clearOnEscape
                        className="mevzi-add-calender"
                        value={kurulumTraihi2}
                        onChange={(newValue) => {
                          setKurulumTraihi2(newValue);
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            className="mevzi-add-calender"
                            label="Sistem Kurulum Tarihi"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      margiTop: "20px",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ marginTop: "20px" }}>Frekans Bandı:</div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <CustomTextField
                        autoComplete="off"
                        label="Alt Sınır"
                        variant="filled"
                        type="number"
                        inputProps={{ step: "0.01" }}
                        value={sistemInfo?.frekans_k}
                        onChange={(e) => {
                          setSistemInfo({
                            ...sistemInfo,
                            frekans_k: e.target.value,
                          });
                        }}
                        margin="normal"
                      />

                      <div style={{ marginTop: "35px" }}>
                        <RemoveIcon />
                      </div>

                      <CustomTextField
                        autoComplete="off"
                        label="Üst sınır"
                        variant="filled"
                        type="number"
                        inputProps={{ step: "0.01" }}
                        value={sistemInfo?.frekans_b}
                        onChange={(e) => {
                          setSistemInfo({
                            ...sistemInfo,
                            frekans_b: e.target.value,
                          });
                        }}
                        margin="normal"
                      />
                    </div>
                  </div>

                  <CustomOutlinedButton
                    variant="outlined"
                    onClick={handleSaveSistem}
                    color="primary"
                  >
                    Ekle
                  </CustomOutlinedButton>
                </Box>
              </Modal>

              <div style={{ margin: "25px 0px 5px" }}>
                <>
                  {altY && (
                    <div
                      class="mevzi-add-alt-yapi-div"
                      onClick={() => setModalOpen2(true)}
                    >
                      Alt Yapı Bilgisi
                      <Tooltip title="Alt Yapı">
                        <AnalyticsOutlinedIcon />
                      </Tooltip>
                    </div>
                  )}
                  {altYMessage && altYMessage !== "" && (
                    <div>{altYMessage}</div>
                  )}
                </>
              </div>

              <Modal
                open={modalOpen2}
                onClose={handleCloseModal2}
                aria-labelledby="Alt Yapı Bilgileri"
                aria-describedby="İklim - Kabin - Kapalı Alan - Enerji - Haberleşme"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60vw",
                    maxHeight: "80vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    outline: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "calc(60vw - 64px)",
                      justifyContent: "space-evenly",
                      width: "inherit",
                    }}
                  >
                    <div style={{ width: "15vw" }}>
                      {/* HABER */}
                      <div
                        style={{
                          display: "flex",
                          margiTop: "20px",
                          marginRight: "5px",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "20px",
                              fontWeight: "600",
                              fontSize: "larger",
                            }}
                          >
                            Haberleşme Alt Yapısı:
                          </div>

                          {/*  Haber T */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {HaberT && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="T. Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[4]?.t || ""}
                              onChange={handleTChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>

                          {/* HABER RL  */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {HaberRL && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="R/L Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[4]?.r_l || ""}
                              onChange={handleRLChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>

                          {/* UYDU */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {uydu && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="Uydu Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[4]?.uydu || ""}
                              onChange={handleUyduChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>

                          {/* TELEKOM */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {telekom && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="Telekom Alt Yapısı Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[4]?.telekom || ""}
                              onChange={handleTelekomChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>

                          {/* G_Modem */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {g_modem && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="3G - 4G Modem Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[4]?.g_modem || ""}
                              onChange={handleg_modemChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ width: "15vw" }}>
                      {/* ENERJI */}
                      <div
                        style={{
                          display: "flex",
                          margiTop: "20px",
                          marginRight: "5px",
                          // flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "20px",
                              fontWeight: "600",
                              fontSize: "larger",
                            }}
                          >
                            Enerji Alt Yapısı:
                          </div>

                          {/* VOLTAJ */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {voltaj && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="Ölçülen Şebeke Elektriği Voltajı"
                              variant="filled"
                              type="number"
                              inputProps={{ step: "0.01" }}
                              value={altY[3]?.voltaj || ""}
                              onChange={handleVoltajChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>

                          {/* Jenerator */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {jenerator && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="Jeneratör Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[3]?.jenerator || ""}
                              onChange={handleJeneratorChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>

                          {/* GUC KAYNAGI */}

                          {/* {guc_k && ( */}
                          <CustomTextField
                            fullWidth
                            autoComplete="off"
                            label="Kesintisiz Güç Kaynağı Durumları"
                            variant="filled"
                            multiline
                            rows={2}
                            value={altY[3]?.guc_k || ""}
                            onChange={handleGuc_KChange}
                            margin="normal"
                          />

                          {/* REGULATOR */}

                          <CustomTextField
                            fullWidth
                            autoComplete="off"
                            label="Regülatör Durumları"
                            variant="filled"
                            multiline
                            rows={2}
                            value={altY[3]?.regulator || ""}
                            onChange={handleRegulatorChange}
                            margin="normal"
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ width: "15vw" }}>
                      {/* IKLIM */}
                      <div
                        style={{
                          display: "flex",
                          margiTop: "20px",
                          marginRight: "5px",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "20px",
                              fontWeight: "600",
                              fontSize: "larger",
                            }}
                          >
                            İklimlendirme Alt Yapısı:
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {iklimKlima && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="Klima Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[0]?.klima || ""}
                              onChange={handleKlimaChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>
                        </div>
                      </div>

                      {/* KAPALI ALAN  */}
                      <div
                        style={{
                          display: "flex",
                          margiTop: "20px",
                          marginRight: "5px",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "20px",
                              fontWeight: "600",
                              fontSize: "larger",
                            }}
                          >
                            Kapalı Alan Alt Yapısı:
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {konteyner && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="Konteyner Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[2]?.konteyner || ""}
                              onChange={handleKonteynerChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>
                        </div>
                      </div>

                      {/* KABIN */}
                      <div
                        style={{
                          display: "flex",
                          margiTop: "20px",
                          marginRight: "5px",
                          flexDirection: "row",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              marginTop: "20px",
                              fontWeight: "600",
                              fontSize: "larger",
                            }}
                          >
                            Kabin Alt Yapısı:
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                            }}
                          >
                            {/* {kabinRack && ( */}
                            <CustomTextField
                              fullWidth
                              autoComplete="off"
                              label="Rack Kabin Durumları"
                              variant="filled"
                              multiline
                              rows={2}
                              value={altY[1]?.rack_kabin || ""}
                              onChange={handleRackKabinChange}
                              margin="normal"
                            />
                            {/* )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CustomOutlinedButton
                    variant="outlined"
                    onClick={handleSaveAltY}
                    color="primary"
                  >
                    {isAltYEmpty() ? "Ekle" : "Güncelle"}
                  </CustomOutlinedButton>
                </Box>
              </Modal>

              {mevzi && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <Autocomplete
                    options={options}
                    fullWidth
                    autoComplete="off"
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.malzName}
                    value={
                      options.find(
                        (option) =>
                          option.malzName && option.malzName === malzeme
                      ) || null
                    }
                    onChange={(event, value) => {
                      setMalzeme(value ? value.malzName : "");
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Mevzideki Sistem Malzemeleri"
                      />
                    )}
                  />

                  <div style={{ marginTop: "10px" }}>
                    <RemoveIcon />
                  </div>

                  <CustomTextField
                    style={{ marginBottom: "20px" }}
                    autoComplete="off"
                    fullWidth
                    label="IP"
                    variant="filled"
                    value={selectedIp}
                    onChange={(event) => setSelectedIp(event.target.value)}
                    margin="normal"
                  />

                  <Tooltip title="IP" placement="right">
                    <IconButton onClick={() => handleIpChange()}>
                      <AddCircleIcon
                        style={{ color: "white", marginLeft: "8px" }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              )}

              <div>
                {ips.length > 0 && (
                  <ul>
                    {ips.map(([malzemeName, mevziId, ip], index) => (
                      <li key={index}>
                        {/* Display the malzemeName and IP, excluding mevzi_id */}
                        <span>
                          <strong>{malzemeName}:</strong> {ip}
                        </span>

                        <Tooltip title="Kaldır">
                          <IconButton
                            style={{
                              paddingTop: "0px",
                              paddingRight: "0px",
                              paddingLeft: "0px",
                              paddingBottom: "0px",
                            }}
                            onClick={() => handleDeleteIp(malzemeName)} // Use the malzemeName for deletion
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ marginTop: "20px" }}>
                {folders.map((folder, folderIndex) => (
                  <div key={folderIndex} style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        label="Klasör Adı"
                        value={folder.folderName}
                        onChange={(e) =>
                          handleFolderNameChange(folderIndex, e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      />

                      <IconButton
                        aria-label="delete"
                        size="medium"
                        onClick={() => handleDeleteFolder(folderIndex)}
                        style={{ marginLeft: "10px" }}
                      >
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </div>
                    {folder.folderName && (
                      <>
                        <CustomOutlinedButton
                          variant="outlined"
                          component="label"
                        >
                          Fotoğraf Seç
                          <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={(event) =>
                              handleImageChange(event, folderIndex)
                            }
                          />
                        </CustomOutlinedButton>

                        {folder.selectedImages.length > 0 && (
                          <Accordion style={{ marginTop: "10px" }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="subtitle1">
                                Seçilen Fotoğraflar
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <ul style={{ listStyle: "none", padding: 0 }}>
                                {folder.selectedImages.map(
                                  (image, imageIndex) => (
                                    <li
                                      key={imageIndex}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <span>{image.name}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </AccordionDetails>
                          </Accordion>
                        )}
                        {folder.existingImages.length > 0 && (
                          <Accordion style={{ marginTop: "10px" }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="subtitle1">
                                Mevcut Fotoğraflar
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <ul style={{ listStyle: "none", padding: 0 }}>
                                {folder.existingImages.map(
                                  (image, imageIndex) => (
                                    <li
                                      key={imageIndex}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <span>{image.name}</span>
                                      <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() =>
                                          handleDeleteImage(
                                            folderIndex,
                                            image.name
                                          )
                                        }
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </li>
                                  )
                                )}
                              </ul>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <CustomOutlinedButton
                  onClick={handleAddFolder}
                  variant="outlined"
                  style={{ marginTop: "20px" }}
                >
                  Yeni Klasör Ekle
                </CustomOutlinedButton>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <CustomOutlinedButton variant="outlined" type="submit">
              {mevzi ? "Güncelle" : "Kaydet"}
            </CustomOutlinedButton>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default MevziAdd;
