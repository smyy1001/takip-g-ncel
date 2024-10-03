import "./MevziAdd.css";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import axios from "axios";
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
import ConstructionIcon from "@mui/icons-material/Construction";
import { useNavigate } from "react-router-dom";

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

function MevziAdd({
  isRoleAdmin,
  systems,
  fetchSystems,
  mevzi,
  fetchAllMevzi,
}) {
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

  const [mevziInfo, setMevziInfo] = useState({
    d_sistemler: [],
    y_sistemler: [],
  });
  const navigate = useNavigate();
  const [sistemInfo, setSistemInfo] = useState(null);
  const [selectedRadioBValue, setSelectedRadioBValue] = useState("i");
  const [b_sorumlulari, setB_sorumlulari] = useState([]);
  const [subeler, setSubeler] = useState([]);
  const [selectedSistemler, setSelectedSistemler] = useState([]);
  const [sistemler, setSistemler] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [shouldUpdateMevzi, setShouldUpdateMevzi] = useState(false);

  const [iklimIds, setIklimIds] = useState([]);
  const [jeneratorIds, setJeneratorIds] = useState([]);
  const [gucKIds, setGucKIds] = useState([]);
  const [regulatorIds, setRegulatorIds] = useState([]);

  // klima
  const [klimalar, setKlimalar] = useState([]);
  const [selectedKlimalar, setSelectedKlimalar] = useState([]);
  const [modalKlimaOpen, setModalKlimaOpen] = useState(false);
  const [klimaInfo, setKlimaInfo] = useState(null);

  // jeenrator
  const [jeneratorler, setJeneratorler] = useState([]);
  const [selectedJeneratorler, setSelectedJeneratorler] = useState([]);
  const [modalJeneratorOpen, setModalJeneratorOpen] = useState(false);
  const [jeneratorInfo, setJeneratorInfo] = useState(null);

  // Regulator
  const [regulatorlar, setRegulatorlar] = useState([]);
  const [selectedRegulatorlar, setSelectedRegulatorlar] = useState([]);
  const [modalRegulatorOpen, setModalRegulatorOpen] = useState(false);
  const [regulatorInfo, setRegulatorInfo] = useState(null);

  // Guc K
  const [gucKlar, setGucKlar] = useState([]);
  const [selectedGucKlar, setSelectedGucKlar] = useState([]);
  const [modalGucKOpen, setModalGucKOpen] = useState(false);
  const [gucKInfo, setGucKInfo] = useState(null);

  const [hasJeneratorError, setHasJeneratorError] = useState(false);
  const [hasRegulatorError, setHasRegulatorError] = useState(false);
  const [hasGucKError, setHasGucKError] = useState(false);

  const [kesifTarihi, setKesifTarihi] = useState(new Date());
  const [kurulumTraihi, setKurulumTarihi] = useState(new Date());
  const [kurulumTraihi2, setKurulumTraihi2] = useState(new Date());
  const [folders, setFolders] = useState([
    {
      folderName: "",
      oldFolderName: "",
      selectedImages: [],
      deletedImages: [],
      existingImages: [],
    },
  ]);
  const [originalFolderNames, setOriginalFolderNames] = useState([]);
  // ALT Y
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [iklimKlima, setIklimKlima] = useState(false);
  const handleIklimKlimaChange = (event) => {
    setIklimKlima(event.target.checked);
  };
  const [modalOpen2, setModalOpen2] = useState(false);
  const [altY, setAltY] = useState([
    { rack_kabin: "" },
    { konteyner: "" },
    { t: "", r_l: "", uydu: "", telekom: "", g_modem: "" },
    { voltaj: 0 },
  ]);
  const handleKlimaChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[0].klima = event.target.value;
    setAltY(updatedAltY);
  };
  const [kabinRack, setKabinRack] = useState(false);
  const handleKabinChange = (event) => {
    setKabinRack(event.target.checked);
  };

  const handleGoruntuleClick = () => {
    if (mevzi?.id) {
      navigate(`/mevzi/${mevzi.id}/bilgi`);
    }
  };
  const handleRackKabinChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[0].rack_kabin = event.target.value;
    setAltY(updatedAltY);
  };
  const [konteyner, setKonteyner] = useState(false);
  const handleKAlanChange = (event) => {
    setKonteyner(event.target.checked);
  };
  const handleKonteynerChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[1].konteyner = event.target.value;
    setAltY(updatedAltY);
  };

  const [jenerator, setJenerator] = useState(false);
  const handleEnerjiJeChange = (event) => {
    setJenerator(event.target.checked);
  };
  const handleJeneratorChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[2].jenerator = event.target.value;
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
    updatedAltY[2].t = event.target.value;
    setAltY(updatedAltY);
  };

  const [HaberRL, setHaberRL] = useState(false);
  const handleHaberRLChange = (event) => {
    setHaberRL(event.target.checked);
  };
  const handleRLChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[2].r_l = event.target.value;
    setAltY(updatedAltY);
  };

  const [uydu, setUydu] = useState(false);
  const handleHaberUyduChange = (event) => {
    setUydu(event.target.checked);
  };
  const handleUyduChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[2].uydu = event.target.value;
    setAltY(updatedAltY);
  };

  const [telekom, setTelekom] = useState(false);
  const handleHaberTelekomChange = (event) => {
    setTelekom(event.target.checked);
  };
  const handleTelekomChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[2].telekom = event.target.value;
    setAltY(updatedAltY);
  };

  const [g_modem, setg_modem] = useState(false);
  const handleHaberg_modemChange = (event) => {
    setg_modem(event.target.checked);
  };
  const handleg_modemChange = (event) => {
    const updatedAltY = [...altY];
    updatedAltY[2].g_modem = event.target.value;
    setAltY(updatedAltY);
  };

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
      return updatedFolders;
    });
  };

  const handleDeleteSelectedImage = (folderIndex, imageIndex) => {
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];
      updatedFolders[folderIndex].selectedImages = updatedFolders[
        folderIndex
      ].selectedImages.filter((img, index) => index !== imageIndex);
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

  const handleFolderNameChange = (index, newFolderName) => {
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];
      const currentFolder = updatedFolders[index];

      const originalFolderIndex = originalFolderNames.findIndex(
        (name) => name === currentFolder.folderName
      );

      if (
        originalFolderIndex !== -1 &&
        currentFolder.folderName !== newFolderName
      ) {
        if (!currentFolder.oldFolderName) {
          updatedFolders[index].oldFolderName = currentFolder.folderName;
        }
      }

      updatedFolders[index].folderName = newFolderName;

      return updatedFolders;
    });
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

  // Klimalar
  const fetchKlimalar = async () => {
    try {
      const response = await axios.get("/api/alt_y/iklim/klima/all/");

      setKlimalar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  useEffect(() => {
    if (iklimIds.length > 0 && klimalar.length > 0) {
      const selectedKlimalar = klimalar.filter((i) => iklimIds.includes(i.id));

      setSelectedKlimalar(selectedKlimalar);
    }
  }, [iklimIds, klimalar]);

  useEffect(() => {
    if (jeneratorIds.length > 0 && jeneratorler.length > 0) {
      const selectedJeneratorler = jeneratorler.filter((j) =>
        jeneratorIds.includes(j.id)
      );
      setSelectedJeneratorler(selectedJeneratorler);
    }
  }, [jeneratorIds, jeneratorler]);

  useEffect(() => {
    if (gucKIds.length > 0 && gucKlar.length > 0) {
      const selectedGucKlar = gucKlar.filter((gk) => gucKIds.includes(gk.id));
      setSelectedGucKlar(selectedGucKlar);
    }
  }, [gucKIds, gucKlar]);

  useEffect(() => {
    if (regulatorIds.length > 0 && regulatorlar.length > 0) {
      const selectedRegulatorlar = regulatorlar.filter((r) =>
        regulatorIds.includes(r.id)
      );
      setSelectedRegulatorlar(selectedRegulatorlar);
    }
  }, [regulatorIds, regulatorlar]);

  const handleChosenKlimalarChange = (event, newValue) => {
    setSelectedKlimalar(newValue);
  };

  const handleDeleteKlima = async (id, event) => {
    try {
      const response = await axios.delete(
        `/api/alt_y/iklim/klima/delete/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        setSelectedKlimalar(selectedKlimalar.filter((item) => item.id !== id));
        message.success("Klima silindi!");
        fetchKlimalar();
      } else {
        message.error("Klima silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleOpenKlimaModal = () => setModalKlimaOpen(true);
  const handleCloseKlimaModal = () => setModalKlimaOpen(false);

  const handleSaveKlima = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/api/alt_y/iklim/klima/add/",
        klimaInfo
      );
      if (response.status === 200 || response.status === 201) {
        message.success("Klima eklendi!");
        handleCloseKlimaModal();
      } else {
        message.error("Klima eklenemedi'");
      }
    } catch (error) {
      console.error(
        "Hata alında:",
        error.response?.data?.detail || error.message
      );
      message.error(error.response.data.detail);
    }
    fetchKlimalar();
    setKlimaInfo(null);
  };

  // Jeneratorler
  const fetchJeneratorler = async () => {
    try {
      const response = await axios.get("/api/alt_y/enerji/jenerator/all/");
      setJeneratorler(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleChosenJeneratorChange = (event, newValue) => {
    setSelectedJeneratorler(newValue);
    if (newValue.length >= 2) {
      setHasJeneratorError(false);
    } else {
      setHasJeneratorError(true);
    }
  };

  const handleDeleteJenerator = async (id, event) => {
    try {
      const response = await axios.delete(
        `/api/alt_y/enerji/jenerator/delete/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        setSelectedJeneratorler(
          selectedJeneratorler.filter((item) => item.id !== id)
        );
        message.success("Jeneratör silindi!");
        fetchJeneratorler();
      } else {
        message.error("Jeneratör silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleOpenJeneratorModal = () => setModalJeneratorOpen(true);
  const handleCloseJeneratorModal = () => setModalJeneratorOpen(false);

  const handleSaveJenerator = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/api/alt_y/enerji/jenerator/add/",
        jeneratorInfo
      );
      if (response.status === 200 || response.status === 201) {
        message.success("Jeneratör eklendi!");
        handleCloseJeneratorModal();
      } else {
        message.error("Jeneratör eklenemedi'");
      }
    } catch (error) {
      console.error(
        "Hata alında:",
        error.response?.data?.detail || error.message
      );
      message.error(error.response.data.detail);
    }
    fetchJeneratorler();
    setJeneratorInfo(null);
  };

  // Regulatorler
  const fetchRegulatorler = async () => {
    try {
      const response = await axios.get("/api/alt_y/enerji/regulator/all/");
      setRegulatorlar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleChosenRegulatorChange = (event, newValue) => {
    setSelectedRegulatorlar(newValue);
    if (newValue.length >= 2) {
      setHasRegulatorError(false);
    } else {
      setHasRegulatorError(true);
    }
  };

  const handleDeleteRegulator = async (id, event) => {
    try {
      const response = await axios.delete(
        `/api/alt_y/enerji/regulator/delete/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        setSelectedRegulatorlar(
          selectedRegulatorlar.filter((item) => item.id !== id)
        );
        message.success("Regülatör silindi!");
        fetchRegulatorler();
      } else {
        message.error("Regülatör silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleOpenRegModal = () => setModalRegulatorOpen(true);
  const handleCloseRegModal = () => setModalRegulatorOpen(false);

  const handleSaveRegulator = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/api/alt_y/enerji/regulator/add/",
        regulatorInfo
      );
      if (response.status === 200 || response.status === 201) {
        message.success("Regülatör eklendi!");
        handleCloseRegModal();
      } else {
        message.error("Regülatör eklenemedi'");
      }
    } catch (error) {
      console.error(
        "Hata alında:",
        error.response?.data?.detail || error.message
      );
      message.error(error.response.data.detail);
    }
    fetchRegulatorler();
    setRegulatorInfo(null);
  };

  // Guc K
  const fetchGucK = async () => {
    try {
      const response = await axios.get("/api/alt_y/enerji/guck/all/");
      setGucKlar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleChosenGkChange = (event, newValue) => {
    setSelectedGucKlar(newValue);
    if (newValue.length >= 4) {
      setHasGucKError(false);
    } else {
      setHasGucKError(true);
    }
  };

  const handleDeleteGK = async (id, event) => {
    try {
      const response = await axios.delete(
        `/api/alt_y/enerji/guck/delete/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        setSelectedGucKlar(selectedGucKlar.filter((item) => item.id !== id));
        message.success("Kesintisiz Güç Kaynağı silindi!");
        fetchGucK();
      } else {
        message.error("Kesintisiz Güç Kaynağı silinemedi");
      }
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleOpengkModal = () => setModalGucKOpen(true);
  const handleCloseGkModal = () => setModalGucKOpen(false);

  const handleSaveGK = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "/api/alt_y/enerji/guck/add/",
        gucKInfo
      );
      if (response.status === 200 || response.status === 201) {
        message.success("Kesintisiz Güç Kaynağı eklendi!");
        handleCloseGkModal();
      } else {
        message.error("Kesintisiz Güç Kaynağı eklenemedi'");
      }
    } catch (error) {
      console.error(
        "Hata alında:",
        error.response?.data?.detail || error.message
      );
      message.error(error.response?.data?.detail || "Hata alındı!");
    }
    fetchGucK();
    setGucKInfo(null);
  };

  // SISTEMLER
  const fetchSistemler = async () => {
    try {
      const response = await axios.get("/api/sistem/all/");
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
        const response = await axios.post("/api/sistem/add/", formattedData);
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
      const response = await axios.delete(`/api/sistem/delete/${id}`);
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

  // FETCH
  useEffect(() => {
    const fetchBS = async () => {
      try {
        const response = await axios.get("/api/bakimsorumlulari/all/");
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
        const response = await axios.get("/api/sube/all/");
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
    fetchKlimalar();
    fetchGucK();
    fetchJeneratorler();
    fetchRegulatorler();
  }, []);

  useEffect(() => {
    if (mevzi) {
      const selectedSistemlerData = mevzi.y_sistemler
        ? sistemler.filter((sistem) => mevzi.y_sistemler.includes(sistem.id))
        : [];

      setSelectedSistemler(selectedSistemlerData);
    }
  }, [mevzi, sistemler]);

  useEffect(() => {
    resetForm();
    if (mevzi) {
      fetchSistemler();
      setMevziInfo({
        name: mevzi.name || "",
        isim: mevzi.isim || "",
        kordinat: mevzi.kordinat || "",
        rakim: mevzi.rakim || "",
        ulasim: mevzi.ulasim || "",
        lokasyon: mevzi.lokasyon || "",
        yurt_i: mevzi.yurt_i,
        ip: mevzi.ip || null,
        frequency: mevzi.ip ? mevzi.frequency || null : null,
        kesif_tarihi: mevzi.kesif_tarihi
          ? dayjs(mevzi.kesif_tarihi)
          : new Date(),
        kurulum_tarihi: mevzi.kurulum_tarihi
          ? dayjs(mevzi.kurulum_tarihi)
          : new Date(),
        bakim_sorumlusu_id: mevzi.bakim_sorumlusu_id || null,
        d_sistemler: mevzi.d_sistemler || [],
        sube_id: mevzi.sube_id || null,
        alt_y_id: mevzi.alt_y_id || null,
      });

      if (mevzi.yurt_i) {
        setSelectedRadioBValue("i");
      } else {
        setSelectedRadioBValue("d");
      }

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
        const originalNames = Object.keys(foldersFromSystem);
        setOriginalFolderNames(originalNames);
        setFolders(Object.values(foldersFromSystem));
      }

      fetchSystems();
      if (mevzi?.alt_y_id) {
        fetchAltY();
      }

      setHasJeneratorError(false);
      setHasRegulatorError(false);
      setHasGucKError(false);
    }
  }, [mevzi]);

  const fetchAltY = async () => {
    if (mevzi?.alt_y_id) {
      try {
        const response = await axios.get(`/api/alt_y/${mevzi.alt_y_id}`);
        const data = response.data;

        // İlgili altyapı bileşenlerini alma
        const iklimResponse = data.iklim_alty
          ? await axios.get(`/api/alt_y/iklim/${data.iklim_alty}`)
          : null;
        const kabinResponse = data.kabin_alty
          ? await axios.get(`/api/alt_y/kabin/${data.kabin_alty}`)
          : null;
        const enerjiResponse = data.enerji_alty
          ? await axios.get(`/api/alt_y/enerji/${data.enerji_alty}`)
          : null;
        const haberResponse = data.haberlesme_alty
          ? await axios.get(`/api/alt_y/haber/${data.haberlesme_alty}`)
          : null;
        const kAlanResponse = data.kapali_alan_alty
          ? await axios.get(`/api/alt_y/k_alan/${data.kapali_alan_alty}`)
          : null;

        setIklimIds(iklimResponse?.data?.klima || []);
        setJeneratorIds(enerjiResponse?.data?.jenerator || []);
        setGucKIds(enerjiResponse?.data?.guc_k || []);
        setRegulatorIds(enerjiResponse?.data?.regulator || []);

        // Alınan verileri doğru indekslere yerleştiriyoruz
        setAltY([
          { rack_kabin: kabinResponse?.data?.rack_kabin || "" },
          { konteyner: kAlanResponse?.data?.konteyner || "" },
          {
            t: haberResponse?.data?.t || "",
            r_l: haberResponse?.data?.r_l || "",
            uydu: haberResponse?.data?.uydu || "",
            telekom: haberResponse?.data?.telekom || "",
            g_modem: haberResponse?.data?.g_modem || "",
          },
          {
            voltaj: enerjiResponse?.data?.voltaj || 0,
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
      ip: null,
      frequency: null,
    });

    setSelectedSistemler([]);
    setSelectedRadioBValue("i");
    setKesifTarihi(new Date());
    setKurulumTarihi(new Date());
    setFolders([]);
    setAltY([
      { rack_kabin: "" },
      { konteyner: "" },
      { t: "", r_l: "", uydu: "", telekom: "", g_modem: "" },
      { voltaj: 0 },
    ]);
    setSelectedGucKlar([]);
    setSelectedJeneratorler([]);
    setSelectedRegulatorlar([]);
    setSelectedKlimalar([]);
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
    let isError = false;
    if (selectedJeneratorler.length < 2) {
      setHasJeneratorError(true);
      message.error("En az 2 jeneratör seçmelisiniz.");
      isError = true;
    } else {
      setHasJeneratorError(false);
    }

    if (selectedRegulatorlar.length < 2) {
      setHasRegulatorError(true);
      message.error("En az 2 regülatör seçmelisiniz.");
      isError = true;
    } else {
      setHasRegulatorError(false);
    }

    if (selectedGucKlar.length < 4) {
      setHasGucKError(true);
      message.error("En az 4 güç kaynağı seçmelisiniz.");
      isError = true;
    } else {
      setHasGucKError(false);
    }

    if (isError) {
      return;
    }

    try {
      // Add Iklim (index 0)
      let haberID;
      let enerjiID;
      let kabinID;
      let kalanID;
      let iklimID;
      if (selectedKlimalar.length > 0) {
        iklimID = await axios.post("/api/alt_y/iklim/add/", {
          klima: selectedKlimalar
            ? selectedKlimalar.map((item) => item.id)
            : null,
        });
      }

      // Add Kabin (index 1)
      if (altY[0].rack_kabin !== "") {
        kabinID = await axios.post("/api/alt_y/kabin/add/", {
          rack_kabin: altY[0].rack_kabin,
        });
      }

      // Add KAlan (index 4)
      if (altY[1].konteyner !== "") {
        kalanID = await axios.post("/api/alt_y/k_alan/add/", {
          konteyner: altY[1].konteyner,
        });
      }

      // Add Enerji (index 3)
      if (
        selectedJeneratorler.length > 0 ||
        selectedRegulatorlar.length > 0 ||
        selectedGucKlar.length > 0 ||
        altY[3].voltaj !== 0
      ) {
        enerjiID = await axios.post("/api/alt_y/enerji/add/", {
          jenerator: selectedJeneratorler
            ? selectedJeneratorler.map((item) => item.id)
            : null,
          regulator: selectedRegulatorlar
            ? selectedRegulatorlar.map((item) => item.id)
            : null,
          guc_k: selectedGucKlar
            ? selectedGucKlar.map((item) => item.id)
            : null,
          voltaj: altY[3].voltaj,
        });
      }

      // Add Haber (index 2)
      if (
        altY[2].t !== "" ||
        altY[2].r_l !== "" ||
        altY[2].uydu !== "" ||
        altY[2].telekom !== "" ||
        altY[2].g_modem !== ""
      ) {
        haberID = await axios.post("/api/alt_y/haber/add/", {
          ...altY[2],
        });
      }

      const altYData = {
        enerji_alty: enerjiID?.data?.id || null,
        iklim_alty: iklimID?.data?.id || null,
        haberlesme_alty: haberID?.data?.id || null,
        kabin_alty: kabinID?.data?.id || null,
        kapali_alan_alty: kalanID?.data?.id || null,
      };

      const addedAltY = await axios.post("/api/alt_y/add/", altYData);
      setMevziInfo({ ...mevziInfo, alt_y_id: addedAltY.data.id });
      setShouldUpdateMevzi(true);
      if (mevzi?.alt_y_id) {
        message.success("Alt Yapı bilgileri güncellendi!");
      } else {
        message.success("Alt Yapı bilgileri eklendi!");
      }
    } catch (error) {
      console.error("Error adding items:", error);
      message.error("Hata alındı!");
    }
    handleCloseModal3();
    setHasJeneratorError(false);
    setHasRegulatorError(false);
    setHasGucKError(false);
  };
  useEffect(() => {
    if (mevziInfo?.alt_y_id && shouldUpdateMevzi && mevzi) {
      handleAddMevzi();
      setShouldUpdateMevzi(false);
    }
  }, [mevziInfo?.alt_y_id, shouldUpdateMevzi]);

  // EKLE
  const handleAddMevzi = async (event) => {
    if (event) {
      event.preventDefault();
    }
    const isFolderNameMissing = folders.some(
      (folder) => folder.selectedImages.length > 0 && !folder.folderName.trim()
    );

    if (isFolderNameMissing) {
      message.error("Fotoğraf seçtiyseniz klasör ismi girmelisiniz!");
      return;
    }

    // Mevzi verilerini formData için hazırlıyoruz
    const mevziData = {
      name: mevziInfo?.name || null,
      isim: mevziInfo?.isim || null,
      kordinat: mevziInfo?.kordinat || null,
      rakim: mevziInfo?.rakim || null,
      ulasim: mevziInfo?.ulasim || null,
      frequency: mevziInfo?.ip ? mevziInfo?.frequency || null : null,
      ip: mevziInfo?.ip || null,
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

    Object.keys(mevziData).forEach((key) => {
      if (mevziData[key] !== null && mevziData[key] !== undefined) {
        formData.append(key, mevziData[key]);
      }
    });
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

      if (folder.oldFolderName) {
        formData.append("oldFolderNames", folder.oldFolderName);
      } else {
        formData.append("oldFolderNames", null);
      }
    });

    formData.append("folderImageCounts", JSON.stringify(folderImageCounts));

    if (deletedImagesData.length > 0) {
      formData.append("deletedImagesData", JSON.stringify(deletedImagesData));
    }

    try {
      if (mevzi) {
        const response = await axios.put(
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
          fetchAllMevzi();
        }
      } else {
        // Yeni mevzi ekleme isteği
        const response = await axios.post("/api/mevzi/add/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200 || response.status === 201) {
          message.success("Mevzi eklendi!");
        }
      }
      setMevziInfo(null);
      fetchSystems();
      resetForm();
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
                  if (isRoleAdmin) {
                    setMevziInfo({ ...mevziInfo, name: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />

              <CustomTextField
                autoComplete="off"
                label="Karakol İsmi"
                fullWidth
                variant="filled"
                value={mevziInfo?.isim}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMevziInfo({ ...mevziInfo, isim: e.target.value });
                  }
                }}
                name
                margin="normal"
                disabled={!isRoleAdmin}
              />
              <CustomTextField
                autoComplete="off"
                label="IP"
                fullWidth
                variant="filled"
                value={mevziInfo?.ip || ""}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMevziInfo({ ...mevziInfo, ip: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />
              <CustomTextField
                autoComplete="off"
                label="Ping Sıklığı (Dakika)"
                fullWidth
                type="number"
                inputProps={{ step: "0.01", min: 1 }}
                variant="filled"
                value={mevziInfo?.frequency || ""}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMevziInfo({ ...mevziInfo, frequency: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />

              <CustomTextField
                autoComplete="off"
                label="Kordinat (MGRS)"
                fullWidth
                variant="filled"
                value={mevziInfo?.kordinat}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMevziInfo({ ...mevziInfo, kordinat: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />

              <CustomTextField
                autoComplete="off"
                label="Rakım (Metre)"
                fullWidth
                variant="filled"
                type="number"
                inputProps={{ step: "0.01", min: 0 }}
                value={mevziInfo?.rakim}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMevziInfo({ ...mevziInfo, rakim: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "15px",
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
                    disabled={!isRoleAdmin}
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
                    disabled={!isRoleAdmin}
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
                  {isRoleAdmin ? (
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
                        setMevziInfo({
                          ...mevziInfo,
                          lokasyon: value,
                          yurt_i: true,
                        })
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
                  ) : (
                    <CustomTextField
                      label="Türkiye"
                      value={
                        turkey_cities.find(
                          (city) => city === mevziInfo?.lokasyon
                        ) || ""
                      }
                      variant="filled"
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  )}
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
                  {isRoleAdmin ? (
                    <Autocomplete
                      fullWidth
                      options={countries}
                      getOptionLabel={(option) => option}
                      value={
                        countries.find(
                          (country) => country === mevziInfo?.lokasyon
                        ) || null
                      }
                      onChange={(event, value) =>
                        setMevziInfo({
                          ...mevziInfo,
                          lokasyon: value,
                          yurt_i: false,
                        })
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
                  ) : (
                    <CustomTextField
                      label="Yurt Dışı"
                      value={
                        countries.find(
                          (country) => country === mevziInfo?.lokasyon
                        ) || ""
                      }
                      variant="filled"
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  )}
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
                {isRoleAdmin ? (
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
                ) : (
                  <CustomTextField
                    label="Ulaşım Şekli"
                    value={
                      ulasim.find((option) => option === mevziInfo?.ulasim) ||
                      ""
                    }
                    variant="filled"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                )}
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
                  {isRoleAdmin ? (
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
                          helperText={
                            errors.kesifTarihi ? "Geçersiz tarih!" : ""
                          }
                        />
                      )}
                    />
                  ) : (
                    <CustomTextField
                      className="mevzi-add-calender"
                      label="Keşif Tarihi"
                      value={kesifTarihi?.toLocaleDateString() || ""}
                      variant="filled"
                      fullWidth
                      disabled
                    />
                  )}
                </LocalizationProvider>
              </div>

              {isRoleAdmin ? (
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
                    setMevziInfo({
                      ...mevziInfo,
                      bakim_sorumlusu_id: value?.id,
                    })
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
              ) : (
                <CustomTextField
                  label="Bakım Sorumlusu"
                  value={
                    b_sorumlulari.find(
                      (sorumlu) => sorumlu.id === mevziInfo?.bakim_sorumlusu_id
                    )?.name || ""
                  }
                  variant="filled"
                  fullWidth
                  margin="normal"
                  disabled
                />
              )}

              <div style={{ marginTop: "18px", width: "inherit" }}>
                <LocalizationProvider
                  className="mevzi-add-calender"
                  dateAdapter={AdapterDayjs}
                  adapterLocale="tr"
                >
                  {isRoleAdmin ? (
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
                  ) : (
                    <CustomTextField
                      className="mevzi-add-calender"
                      label="İlk Sistem Kurulum Tarihi"
                      value={kurulumTraihi?.toLocaleDateString() || ""}
                      variant="filled"
                      fullWidth
                      disabled
                    />
                  )}
                </LocalizationProvider>
              </div>

              {isRoleAdmin ? (
                <Autocomplete
                  fullWidth
                  clearOnEscape
                  placeholder="Şube"
                  value={
                    subeler.find((sube) => sube.id === mevziInfo?.sube_id) ||
                    null
                  }
                  options={subeler}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    setMevziInfo({ ...mevziInfo, sube_id: value?.id })
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
              ) : (
                <CustomTextField
                  label="İşleten Şube"
                  value={
                    subeler.find((sube) => sube.id === mevziInfo?.sube_id)
                      ?.name || ""
                  }
                  variant="filled"
                  fullWidth
                  margin="normal"
                  disabled
                />
              )}

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
                  onChange={(e) => {
                    if (isRoleAdmin) {
                      setD_Sis(e.target.value);
                    }
                  }}
                  margin="normal"
                  disabled={!isRoleAdmin}
                />
                {isRoleAdmin && (
                  <Tooltip title="Dış Sistem Ekle" placement="right">
                    <IconButton
                      onClick={() => handleDSistemlerChange(d_sis)}
                      style={{ color: "white", marginLeft: "8px" }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              <div>
                {mevziInfo.d_sistemler && mevziInfo.d_sistemler.length > 0 && (
                  <ul>
                    {mevziInfo.d_sistemler.map((dS, index) => (
                      <li key={index}>
                        {dS}
                        {isRoleAdmin && (
                          <Tooltip title="Kaldır">
                            <IconButton
                              onClick={() => handleDeleteDSis(index)}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
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
                {isRoleAdmin ? (
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
                        {isRoleAdmin && (
                          <ListItemIcon>
                            <Tooltip title="Sistemi kalıcı olarak siler!">
                              <DeleteIcon
                                onClick={() => handleDeleteYSis(option.id)}
                              />
                            </Tooltip>
                          </ListItemIcon>
                        )}
                        <ListItemText
                          primary={option.name}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  color: "text.primary",
                                  display: "inline",
                                }}
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
                        label="Yazılıma Oluşturulan Sistemler"
                        placeholder="Sistem Seç"
                      />
                    )}
                  />
                ) : (
                  <CustomTextField
                    label="Mevzideki Yazılıma Oluşturulan Sistemler"
                    value={
                      selectedSistemler
                        .map((sistem) => sistem.name)
                        .join(", ") || ""
                    }
                    variant="filled"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                )}
                {isRoleAdmin && (
                  <Tooltip title="Sistem Ekle" placement="right">
                    <IconButton
                      onClick={handleOpenModal}
                      style={{ color: "white", marginLeft: "8px" }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                )}
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
                      {" "}
                      {isRoleAdmin ? (
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
                      ) : (
                        <CustomTextField
                          className="mevzi-add-calender"
                          label="Sistem Kurulum Tarihi"
                          value={kurulumTraihi2?.toLocaleDateString() || ""}
                          variant="filled"
                          fullWidth
                          disabled
                        />
                      )}
                    </LocalizationProvider>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      marginTop: "20px",
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
                        inputProps={{ step: "0.01", min: 0 }}
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
                        inputProps={{ step: "0.01", min: 0 }}
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
                    style={{ marginTop: "16px" }}
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
                        <ConstructionIcon />
                      </Tooltip>
                    </div>
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
                          marginTop: "20px",
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
                              value={altY[2]?.t || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleTChange(event, value);
                                }
                              }}
                              margin="normal"
                              disabled={!isRoleAdmin}
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
                              value={altY[2]?.r_l || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleRLChange(event, value);
                                }
                              }}
                              margin="normal"
                              disabled={!isRoleAdmin}
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
                              value={altY[2]?.uydu || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleUyduChange(event, value);
                                }
                              }}
                              disabled={!isRoleAdmin}
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
                              value={altY[2]?.telekom || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleTelekomChange(event, value);
                                }
                              }}
                              margin="normal"
                              disabled={!isRoleAdmin}
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
                              value={altY[2]?.g_modem || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleg_modemChange(event, value);
                                }
                              }}
                              margin="normal"
                              disabled={!isRoleAdmin}
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
                          marginTop: "20px",
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
                              inputProps={{ step: "0.01", min: 0 }}
                              value={altY[3]?.voltaj || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleVoltajChange(event, value);
                                }
                              }}
                              margin="normal"
                              disabled={!isRoleAdmin}
                            />
                            {/* )} */}
                          </div>

                          {/* Jenerator */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                              marginTop: "20px",
                            }}
                          >
                            {isRoleAdmin ? (
                              <Autocomplete
                                multiple
                                fullWidth
                                id="tags-filled"
                                options={jeneratorler}
                                getOptionLabel={(option) => option.name}
                                value={selectedJeneratorler}
                                onChange={handleChosenJeneratorChange}
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {isRoleAdmin && (
                                      <ListItemIcon>
                                        <Tooltip title="Jeneratörü kalıcı olarak siler!">
                                          <DeleteIcon
                                            onClick={() =>
                                              handleDeleteJenerator(option.id)
                                            }
                                          />
                                        </Tooltip>
                                      </ListItemIcon>
                                    )}
                                    <ListItemText
                                      primary={option.name}
                                      secondary={
                                        <React.Fragment>
                                          {`Açıklama: ${option.seri_num}`}
                                        </React.Fragment>
                                      }
                                    />
                                  </li>
                                )}
                                renderInput={(params) => (
                                  <CustomAutocompleteTextField
                                    {...params}
                                    variant="filled"
                                    label="Jeneratörler"
                                    placeholder="Jeneratör Seç"
                                    error={hasJeneratorError}
                                    InputProps={{
                                      ...params.InputProps,
                                      style: hasJeneratorError
                                        ? { borderColor: "red" }
                                        : {},
                                    }}
                                  />
                                )}
                              />
                            ) : (
                              <CustomTextField
                                label="Jeneratörler"
                                value={
                                  selectedJeneratorler
                                    .map((jenerator) => jenerator.name)
                                    .join(", ") || ""
                                }
                                variant="filled"
                                fullWidth
                                margin="normal"
                                disabled
                              />
                            )}
                            {isRoleAdmin && (
                              <Tooltip title="Jeneratör Ekle" placement="right">
                                <IconButton
                                  onClick={handleOpenJeneratorModal}
                                  style={{ color: "white", marginLeft: "8px" }}
                                >
                                  <AddCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>

                          <Modal
                            open={modalJeneratorOpen}
                            onClose={handleCloseJeneratorModal}
                            aria-labelledby="Jeneratör Ekle"
                            aria-describedby="Jeneratör Ekle"
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                padding: "20px",
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
                                value={jeneratorInfo?.name}
                                onChange={(e) => {
                                  setJeneratorInfo({
                                    ...jeneratorInfo,
                                    name: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomTextField
                                autoComplete="off"
                                label="Seri Numara"
                                fullWidth
                                required
                                variant="filled"
                                value={jeneratorInfo?.seri_num}
                                onChange={(e) => {
                                  setJeneratorInfo({
                                    ...jeneratorInfo,
                                    seri_num: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomOutlinedButton
                                variant="outlined"
                                style={{ marginTop: "16px" }}
                                onClick={handleSaveJenerator}
                                color="primary"
                              >
                                Ekle
                              </CustomOutlinedButton>
                            </Box>
                          </Modal>

                          {/* Regulator */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                              marginTop: "20px",
                            }}
                          >
                            {isRoleAdmin ? (
                              <Autocomplete
                                multiple
                                fullWidth
                                id="tags-filled"
                                options={regulatorlar}
                                getOptionLabel={(option) => option.name}
                                value={selectedRegulatorlar}
                                onChange={handleChosenRegulatorChange}
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {isRoleAdmin && (
                                      <ListItemIcon>
                                        <Tooltip title="Regülatörü kalıcı olarak siler!">
                                          <DeleteIcon
                                            onClick={() =>
                                              handleDeleteRegulator(option.id)
                                            }
                                          />
                                        </Tooltip>
                                      </ListItemIcon>
                                    )}
                                    <ListItemText
                                      primary={option.name}
                                      secondary={
                                        <React.Fragment>{`Açıklama: ${option.seri_num}`}</React.Fragment>
                                      }
                                    />
                                  </li>
                                )}
                                renderInput={(params) => (
                                  <CustomAutocompleteTextField
                                    {...params}
                                    variant="filled"
                                    label="Regülatörler"
                                    placeholder="Regülatör Seç"
                                    error={hasRegulatorError}
                                    InputProps={{
                                      ...params.InputProps,
                                      style: hasRegulatorError
                                        ? { borderColor: "red" }
                                        : {},
                                    }}
                                  />
                                )}
                              />
                            ) : (
                              <CustomTextField
                                label="Regülatörler"
                                value={
                                  selectedRegulatorlar
                                    .map((regulator) => regulator.name)
                                    .join(", ") || ""
                                }
                                variant="filled"
                                fullWidth
                                margin="normal"
                                disabled
                              />
                            )}
                            {isRoleAdmin && (
                              <Tooltip title="Regülatör Ekle" placement="right">
                                <IconButton
                                  onClick={handleOpenRegModal}
                                  style={{ color: "white", marginLeft: "8px" }}
                                >
                                  <AddCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>

                          <Modal
                            open={modalRegulatorOpen}
                            onClose={handleCloseRegModal}
                            aria-labelledby="Regülatör Ekle"
                            aria-describedby="Regülatör Ekle"
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 400,
                                padding: "20px",
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
                                value={regulatorInfo?.name}
                                onChange={(e) => {
                                  setRegulatorInfo({
                                    ...regulatorInfo,
                                    name: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomTextField
                                autoComplete="off"
                                label="Seri Numara"
                                fullWidth
                                required
                                variant="filled"
                                value={regulatorInfo?.seri_num}
                                onChange={(e) => {
                                  setRegulatorInfo({
                                    ...regulatorInfo,
                                    seri_num: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomOutlinedButton
                                variant="outlined"
                                style={{ marginTop: "16px" }}
                                onClick={handleSaveRegulator}
                                color="primary"
                              >
                                Ekle
                              </CustomOutlinedButton>
                            </Box>
                          </Modal>

                          {/* Guc k */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "15vw",
                              marginTop: "20px",
                            }}
                          >
                            {isRoleAdmin ? (
                              <Autocomplete
                                multiple
                                fullWidth
                                id="tags-filled"
                                options={gucKlar}
                                getOptionLabel={(option) => option.name}
                                value={selectedGucKlar}
                                onChange={handleChosenGkChange}
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {isRoleAdmin && (
                                      <ListItemIcon>
                                        <Tooltip title="Kesintisiz Güç Kaynağını kalıcı olarak siler!">
                                          <DeleteIcon
                                            onClick={() =>
                                              handleDeleteGK(option.id)
                                            }
                                          />
                                        </Tooltip>
                                      </ListItemIcon>
                                    )}
                                    <ListItemText
                                      primary={option.name}
                                      secondary={
                                        <React.Fragment>{`Açıklama: ${option.seri_num}`}</React.Fragment>
                                      }
                                    />
                                  </li>
                                )}
                                renderInput={(params) => (
                                  <CustomAutocompleteTextField
                                    {...params}
                                    variant="filled"
                                    label="Kesintisiz Güç Kaynakları"
                                    placeholder="Kesintisiz Güç Kaynağı Seç"
                                    error={hasGucKError}
                                    InputProps={{
                                      ...params.InputProps,
                                      style: hasGucKError
                                        ? { borderColor: "red" }
                                        : {},
                                    }}
                                  />
                                )}
                              />
                            ) : (
                              <CustomTextField
                                label="Kesintisiz Güç Kaynakları"
                                value={
                                  selectedGucKlar
                                    .map((gucK) => gucK.name)
                                    .join(", ") || ""
                                }
                                variant="filled"
                                fullWidth
                                margin="normal"
                                disabled
                              />
                            )}
                            {isRoleAdmin && (
                              <Tooltip
                                title="Kesintisiz Güç Kaynağı Ekle"
                                placement="right"
                              >
                                <IconButton
                                  onClick={handleOpengkModal}
                                  style={{ color: "white", marginLeft: "8px" }}
                                >
                                  <AddCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>

                          <Modal
                            open={modalGucKOpen}
                            onClose={handleCloseGkModal}
                            aria-labelledby="Kesintisiz Güç Kaynağı Ekle"
                            aria-describedby="Kesintisiz Güç Kaynağı Ekle"
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 400,
                                padding: "20px",
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
                                value={gucKInfo?.name}
                                onChange={(e) => {
                                  setGucKInfo({
                                    ...gucKInfo,
                                    name: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomTextField
                                autoComplete="off"
                                label="Seri Numara"
                                fullWidth
                                required
                                variant="filled"
                                value={gucKInfo?.seri_num}
                                onChange={(e) => {
                                  setGucKInfo({
                                    ...gucKInfo,
                                    seri_num: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomOutlinedButton
                                variant="outlined"
                                style={{ marginTop: "16px" }}
                                onClick={handleSaveGK}
                                color="primary"
                              >
                                Ekle
                              </CustomOutlinedButton>
                            </Box>
                          </Modal>

                          {/* regulator - guc k */}
                        </div>
                      </div>
                    </div>

                    <div style={{ width: "15vw" }}>
                      {/* IKLIM */}
                      <div
                        style={{
                          display: "flex",
                          marginTop: "20px",
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
                            {isRoleAdmin ? (
                              <Autocomplete
                                multiple
                                fullWidth
                                id="tags-filled"
                                options={klimalar}
                                getOptionLabel={(option) => option.name}
                                value={selectedKlimalar}
                                onChange={handleChosenKlimalarChange}
                                renderOption={(props, option) => (
                                  <li {...props}>
                                    {isRoleAdmin && (
                                      <ListItemIcon>
                                        <Tooltip title="Klimayı kalıcı olarak siler!">
                                          <DeleteIcon
                                            onClick={() =>
                                              handleDeleteKlima(option.id)
                                            }
                                          />
                                        </Tooltip>
                                      </ListItemIcon>
                                    )}
                                    <ListItemText
                                      primary={option.name}
                                      secondary={
                                        <React.Fragment>{`Açıklama: ${option.seri_num}`}</React.Fragment>
                                      }
                                    />
                                  </li>
                                )}
                                renderInput={(params) => (
                                  <CustomAutocompleteTextField
                                    {...params}
                                    variant="filled"
                                    label="Klimalar"
                                    placeholder="Klima Seç"
                                  />
                                )}
                              />
                            ) : (
                              <CustomTextField
                                label="Klimalar"
                                value={
                                  selectedKlimalar
                                    .map((klima) => klima.name)
                                    .join(", ") || ""
                                }
                                variant="filled"
                                fullWidth
                                margin="normal"
                                disabled
                              />
                            )}
                            {isRoleAdmin && (
                              <Tooltip title="Klima Ekle" placement="right">
                                <IconButton
                                  onClick={handleOpenKlimaModal}
                                  style={{ color: "white", marginLeft: "8px" }}
                                >
                                  <AddCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>

                          <Modal
                            open={modalKlimaOpen}
                            onClose={handleCloseKlimaModal}
                            aria-labelledby="Klima Ekle"
                            aria-describedby="Klima Ekle"
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
                                value={klimaInfo?.name}
                                onChange={(e) => {
                                  setKlimaInfo({
                                    ...klimaInfo,
                                    name: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomTextField
                                autoComplete="off"
                                label="Seri Numara"
                                fullWidth
                                required
                                variant="filled"
                                value={klimaInfo?.seri_num}
                                onChange={(e) => {
                                  setKlimaInfo({
                                    ...klimaInfo,
                                    seri_num: e.target.value,
                                  });
                                }}
                                margin="normal"
                              />

                              <CustomOutlinedButton
                                variant="outlined"
                                style={{ marginTop: "16px" }}
                                onClick={handleSaveKlima}
                                color="primary"
                              >
                                Ekle
                              </CustomOutlinedButton>
                            </Box>
                          </Modal>
                        </div>
                      </div>

                      {/* KAPALI ALAN  */}
                      <div
                        style={{
                          display: "flex",
                          marginTop: "20px",
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
                              value={altY[1]?.konteyner || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleKonteynerChange(event, value);
                                }
                              }}
                              margin="normal"
                              disabled={!isRoleAdmin}
                            />
                            {/* )} */}
                          </div>
                        </div>
                      </div>

                      {/* KABIN */}
                      <div
                        style={{
                          display: "flex",
                          marginTop: "20px",
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
                              value={altY[0]?.rack_kabin || ""}
                              onChange={(event, value) => {
                                if (isRoleAdmin) {
                                  handleRackKabinChange(event, value);
                                }
                              }}
                              margin="normal"
                              disabled={!isRoleAdmin}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isRoleAdmin && (
                    <CustomOutlinedButton
                      variant="outlined"
                      onClick={handleSaveAltY}
                      color="primary"
                    >
                      {mevzi?.alt_y_id ? "Güncelle" : "Ekle"}
                    </CustomOutlinedButton>
                  )}
                </Box>
              </Modal>

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
                        onChange={(e) => {
                          if (isRoleAdmin) {
                            handleFolderNameChange(folderIndex, e.target.value);
                          }
                        }}
                        variant="outlined"
                        fullWidth
                        disabled={!isRoleAdmin}
                      />
                      {isRoleAdmin && (
                        <IconButton
                          aria-label="delete"
                          size="medium"
                          onClick={() => handleDeleteFolder(folderIndex)}
                          style={{ marginLeft: "10px" }}
                        >
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      )}
                    </div>

                    {folder.folderName && (
                      <>
                        {isRoleAdmin && (
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
                        )}
                        {folder.selectedImages.length > 0 && isRoleAdmin && (
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
                                      <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() =>
                                          handleDeleteSelectedImage(
                                            folderIndex,
                                            imageIndex
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
                                      {isRoleAdmin && (
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
                                      )}
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
                {isRoleAdmin && (
                  <CustomOutlinedButton
                    onClick={handleAddFolder}
                    variant="outlined"
                    style={{ marginTop: "20px" }}
                  >
                    Yeni Klasör Ekle
                  </CustomOutlinedButton>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {mevzi && (
              <CustomOutlinedButton
                variant="outlined"
                onClick={handleGoruntuleClick}
              >
                Görüntüle
              </CustomOutlinedButton>
            )}
            {isRoleAdmin && (
              <CustomOutlinedButton variant="outlined" type="submit">
                {mevzi ? "Güncelle" : "Kaydet"}
              </CustomOutlinedButton>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}

export default MevziAdd;
