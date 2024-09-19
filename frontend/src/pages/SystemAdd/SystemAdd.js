import "./SystemAdd.css";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { message } from "antd";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoIcon from "@mui/icons-material/Info";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // This is fine, but no need to directly use `isValid` here
import "dayjs/locale/tr"; // For Turkish locale
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
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

function SystemAdd({
  isRoleAdmin,
  mevziler,
  fetchAllMevzi,
  freeMalzemeler,
  fetchFreeMalzemeler,
  system,
  fetchSystems,
  malzemeler,
  fetchMalzemeler,
}) {
  const [systemInfo, setSystemInfo] = useState(null);

  const [all_types, setAllTypes] = useState([]);
  const [tempType, setTempType] = useState("");
  const [tempMarka, setTempMarka] = useState("");
  const [tempModel, setTempModel] = useState("");
  const [selectedRadioBValue, setSelectedRadioBValue] = useState("b"); // birim depo - yedek depo - mevzi
  const [selectedMevzi, setSelectedMevzi] = useState(null);
  const [markalar, setAllMarkalar] = useState([]);
  const [models, setAllModels] = useState([]);
  const [unsurlar, setUnsurlar] = useState([]);
  const [selectedUnsurlar, setSelectedUnsurlar] = useState([]);
  const [selectedMalzemeler, setSelectedMalzemeler] = useState([]);
  const [girisTarihi, setGirisTarihi] = useState(new Date());
  const [folders, setFolders] = useState([
    {
      folderName: "",
      selectedImages: [],
      deletedImages: [],
      existingImages: [],
    },
  ]);

  const [errors, setErrors] = useState({
    girisTarihi: "",
  });
  const formRef = useRef();

  const handleImageChange = (event, folderIndex) => {
    const files = Array.from(event.target.files);
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];
      updatedFolders[folderIndex].selectedImages = [
        ...updatedFolders[folderIndex].selectedImages,
        ...files,
      ];
      console.log("Güncellenmiş Klasörler:", updatedFolders);
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

  const resetForm = () => {
    formRef.current.reset();
    setTempType("");
    setTempMarka("");
    setTempModel("");
    setSelectedUnsurlar([]);
    setSelectedMalzemeler([]);
    setSelectedRadioBValue("b");
    setFolders([]);
    setSystemInfo({
      type_id: null,
      marka_id: null,
      mmodel_id: null,
      mevzi_id: null,
      depo: selectedRadioBValue,
    });
  };

  // TYPE
  const fetchAllTypes = async () => {
    try {
      const response = await Axios.get("/api/systype/all/");
      setAllTypes(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewType = async (typeName) => {
    try {
      const response = await Axios.post("/api/systype/add", { name: typeName });
      console.log("Yeni tür eklendi:", response.data);
      fetchAllTypes();
      return response.data.id;
    } catch (error) {
      console.error("Tür eklenirken hata:", error);
      return 0;
    }
  };

  const handleTypeOptionChange = (event, newValue) => {
    if (typeof newValue === "string") {
      if (!all_types.some((type) => type.name === newValue)) {
        const type_id = addNewType(newValue);
        setSystemInfo((prev) => ({ ...prev, type_id: type_id }));
      }
    } else if (newValue && typeof newValue === "object") {
      setSystemInfo((prev) => ({ ...prev, type_id: newValue.id }));
    } else {
      setSystemInfo((prev) => ({ ...prev, type_id: 0 }));
    }
  };

  const filterTypeOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.name,
  });

  async function handleAddingStringType() {
    if (
      typeof tempType === "string" &&
      !all_types.some((type) => type.name === tempType)
    ) {
      try {
        const type_id = await addNewType(tempType);
        setSystemInfo((prev) => ({ ...prev, type_id: type_id }));
      } catch (error) {
        console.error("Error adding new type:", error);
      }
    }
  }

  // MARKA
  const fetchAllMarkalar = async () => {
    try {
      const response = await Axios.get("/api/sys_marka/all/");
      setAllMarkalar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewMarka = async (markaName) => {
    try {
      const response = await Axios.post("/api/sys_marka/add", {
        name: markaName,
      });
      console.log("Yeni marka eklendi:", response.data);
      fetchAllMarkalar();
      return response.data.id;
    } catch (error) {
      console.error("Marka eklenirken hata:", error);
      return 0;
    }
  };

  const handleMarkaOptionChange = (event, newValue) => {
    if (typeof newValue === "string") {
      if (!markalar.some((ma) => ma.name === newValue)) {
        const marka_id = addNewMarka(newValue);
        setSystemInfo((prev) => ({ ...prev, marka_id: marka_id }));
      }
    } else if (newValue && typeof newValue === "object") {
      setSystemInfo((prev) => ({ ...prev, marka_id: newValue.id }));
    } else {
      setSystemInfo((prev) => ({ ...prev, marka_id: 0 }));
    }
  };

  const filterMarkaOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.name,
  });

  async function handleAddingStringMarka() {
    if (
      typeof tempMarka === "string" &&
      !markalar.some((m) => m.name === tempMarka)
    ) {
      try {
        const marka_id = await addNewMarka(tempMarka);
        setSystemInfo((prev) => ({ ...prev, marka_id: marka_id }));
      } catch (error) {
        console.error("Error adding new type:", error);
      }
    }
  }

  // ILISKILI UNSUR
  const fetchAllUnsurlar = async () => {
    try {
      const response = await Axios.get("/api/unsur/all/");
      setUnsurlar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const handleChosenUnsurlarChange = (event, newValue) => {
    setSelectedUnsurlar(newValue);
  };

  // FREE MALZEMELER
  const handleChosenMalzemelerChange = (event, newValue) => {
    console.log("malzemeler add:" + malzemeler);
    console.log("selectedMalzemeler add:" + selectedMalzemeler);
    if (newValue.length === 0) {
      console.log("içerisi boş");
      setSystemInfo((prev) => ({
        ...prev,
        selectedMalzemeler: [],
      }));
    } else {
      setSystemInfo((prev) => ({
        ...prev,
        selectedMalzemeler: newValue.map((malzeme) => malzeme.id),
      }));
    }
    console.log("onchange new value: " + newValue);
    setSelectedMalzemeler(newValue);
  };

  // MODEL
  const fetchAllModels = async () => {
    try {
      const response = await Axios.get("/api/sys_model/all/");
      setAllModels(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const filterModelOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.name,
  });

  const addNewModel = async (modelName) => {
    try {
      const response = await Axios.post("/api/sys_model/add", {
        name: modelName,
      });
      console.log("Yeni model eklendi:", response.data);
      fetchAllModels();
      return response.data.id;
    } catch (error) {
      console.error("Model eklenirken hata:", error);
      return 0;
    }
  };

  const handleModelOptionChange = (event, newValue) => {
    if (typeof newValue === "string") {
      if (!models.some((m) => m.name === newValue)) {
        const model_id = addNewModel(newValue);
        setSystemInfo((prev) => ({ ...prev, mmodel_id: model_id }));
      }
    } else if (newValue && typeof newValue === "object") {
      setSystemInfo((prev) => ({ ...prev, mmodel_id: newValue.id }));
    } else {
      setSystemInfo((prev) => ({ ...prev, mmodel_id: 0 }));
    }
  };

  async function handleAddingStringModel() {
    if (
      typeof tempModel === "string" &&
      !models.some((m) => m.name === tempModel)
    ) {
      try {
        const model_id = await addNewModel(tempModel);
        setSystemInfo((prev) => ({ ...prev, mmodel_id: model_id }));
      } catch (error) {
        console.error("Error adding new type:", error);
      }
    }
  }

  // BULUNDUĞU YER
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

  const addNewMevzi = async (MevziName) => {
    try {
      const response = await Axios.post("/api/mevzi/add", { name: MevziName });
      console.log("Yeni mevzi eklendi:", response.data);
      fetchAllMevzi();
      return response.data.id;
    } catch (error) {
      console.error("Mevzi eklenirken hata:", error);
      return 0;
    }
  };

  const handleMevziOptionChange = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      setSelectedMevzi(newValue);
      setSystemInfo((prev) => ({ ...prev, mevzi_id: newValue.id, depo: 2 }));
    } else if (typeof newValue === "string") {
      const mevzi_id = addNewMevzi(newValue);
      setSystemInfo((prev) => ({ ...prev, mevzi_id: mevzi_id, depo: 2 }));
      setSelectedMevzi({ name: newValue });
    } else {
      setSelectedMevzi(null);
      setSystemInfo((prev) => ({ ...prev, mevzi_id: null }));
    }
  };
  // UPDATE MALZEME
  const handleUpdateMalzeme = async (system_idd) => {
    const malzemeIds = selectedMalzemeler?.map((malzeme) => malzeme.id) || [];
    console.log("update malzeme malzemeIds:" + malzemeIds);
    console.log("malzemeler" + malzemeler);
    const previouslySelectedMalzemeler =
      malzemeler?.filter((malzeme) => malzeme.system_id === system_idd) || [];

    console.log("önceden seçilen malzemeler: " + previouslySelectedMalzemeler);
    if (malzemeIds.length === 0) {
      console.log("update malzeme id boş");
      console.log(
        "önceden seçilen malzemeler 2 : " + previouslySelectedMalzemeler
      );
      try {
        await Promise.all(
          previouslySelectedMalzemeler.map(async (malzeme) => {
            try {
              await Axios.put(`/api/malzeme/update/${malzeme.id}`, {
                ...malzeme,
                system_id: null,
              });
            } catch (error) {
              console.error(`Error updating malzeme ${malzeme.id}`, error);
            }
          })
        );

        // message.success("Tüm malzemeler boşa çıkarıldı.");
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        message.error("Malzemeler boşa çıkarılamadı.");
      }
      return;
    }

    const malzemelerToBeUnset = previouslySelectedMalzemeler.filter(
      (malzeme) => !malzemeIds.includes(malzeme.id)
    );

    const requestBody = {
      malzeme_ids: malzemeIds,
      system_id: system_idd,
    };

    try {
      const response = await Axios.post(
        "/api/malzeme/reg-system/",
        requestBody
      );
      console.log("Response:", response?.data);
      message.success("Malzemeler güncellendi!");

      await Promise.all(
        malzemelerToBeUnset.map(async (malzeme) => {
          try {
            await Axios.put(`/api/malzeme/update/${malzeme.id}`, {
              system_id: null,
            });
          } catch (error) {
            console.error(`Error updating malzeme ${malzeme.id}`, error);
          }
        })
      );

      if (malzemelerToBeUnset.length > 0) {
        message.success("İlişkilendirilmemiş malzemeler boşa çıkarıldı.");
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      message.error("Malzemeler güncellenemedi.");
    }
  };

  // EKLE
  const handleAddSystem = async (event) => {
    event.preventDefault();
    console.log("Gönderilecek Unsurlar: ", selectedUnsurlar);

    let lok =
      selectedRadioBValue === "b" ? 0 : selectedRadioBValue === "y" ? 1 : 2;

    handleAddingStringType();
    handleAddingStringMarka();
    handleAddingStringModel();

    const systemData = {
      name: systemInfo?.name || null,
      seri_num: systemInfo?.seri_num || null,
      description: systemInfo?.description || null,
      type_id: systemInfo?.type_id || null,
      marka_id: systemInfo?.marka_id || null,
      mmodel_id: systemInfo?.mmodel_id || null,
      depo: lok !== undefined ? lok : null,
      mevzi_id:
        selectedRadioBValue === "m" && systemInfo.mevzi_id
          ? systemInfo.mevzi_id
          : undefined,
      giris_tarihi: girisTarihi.toISOString().split("T")[0] || null,
      ilskili_unsur: selectedUnsurlar
        .map((item) => (typeof item === "object" ? item.id : item))
        .filter((id) => id !== null && id !== undefined),
    };
    console.log("systemData.ilskili_unsur" + systemData.ilskili_unsur);

    const formData = new FormData();
    formData.append("system", JSON.stringify(systemData));

    selectedMalzemeler.forEach((malzeme, index) => {
      formData.append(`selectedMalzemeler[${index}]`, malzeme.id);
    });

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

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      let response;

      if (system) {
        response = await Axios.put(
          `/api/system/update/${system.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          message.success("Sistem güncellendi!");
          await handleUpdateMalzeme(system.id);
          fetchSystems();
        }
      } else {
        response = await Axios.post("/api/system/add/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200 || response.status === 201) {
          await handleUpdateMalzeme(response.data.id);
          message.success("Sistem eklendi!");
        }
      }

      setSelectedUnsurlar([]);
      setSelectedMalzemeler([]);
      setSelectedRadioBValue("b");
      fetchAllMarkalar();
      fetchAllMevzi();
      fetchAllModels();
      fetchAllTypes();
      fetchFreeMalzemeler();
      setSystemInfo(null);
      fetchMalzemeler();

      resetForm();
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  useEffect(() => {
    fetchAllTypes();
    fetchAllModels();
    fetchAllMevzi();
    fetchFreeMalzemeler();
    fetchAllMarkalar();
    fetchAllUnsurlar();
    fetchMalzemeler();
  }, []);

  useEffect(() => {
    resetForm();
    if (system) {
      console.log("sysytem veirleri  : ", system);
      setSystemInfo({
        name: system.name,
        seri_num: system.seri_num,
        marka_id: system.marka_id,
        mmodel_id: system.mmodel_id,
        description: system.description,
        type_id: system.type_id,
        selectedUnsurlar: system.ilskili_unsur || [],
        selectedMalzemeler: system.malzemeler || [],
        mevzi_id: system.mevzi_id || null,
      });
      const depoValue = system.depo === 0 ? "b" : system.depo === 1 ? "y" : "m";
      setSelectedRadioBValue(depoValue);
      setSelectedUnsurlar(system.ilskili_unsur || []);
      console.log("Selected Unsurlar useEffect içinde: ", system.ilskili_unsur);

      const selectedMevziFromMalzeme = mevziler.find(
        (mevzi) => mevzi.id === system.mevzi_id
      );
      setSelectedMevzi(selectedMevziFromMalzeme || null);

      if (system.giris_tarihi) {
        setGirisTarihi(new Date(system.giris_tarihi));
      }
      setSelectedUnsurlar(system.ilskili_unsur || []);

      if (system.photos) {
        const foldersFromSystem = system.photos?.reduce((acc, photoUrl) => {
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
    }
  }, [system, mevziler]);
  return (
    <Container className="system-add-container">
      {!system && (
        <Typography
          className="system-add-big-header"
          variant="h6"
          gutterBottom
          component="div"
        >
          Sistem Ekle
        </Typography>
      )}
      <div className="system-add-main-div-class">
        <form
          ref={formRef}
          onSubmit={handleAddSystem}
          className="system-add-form"
        >
          <div className="system-add-direction-row">
            <div
              className="system-add-to-the-left"
              style={{ width: system ? "27vw" : "40vw" }}
            >
              <CustomTextField
                autoComplete="off"
                label="Sistemin Adı"
                required
                fullWidth
                variant="filled"
                value={systemInfo?.name}
                onChange={(e) => {
                  setSystemInfo({ ...systemInfo, name: e.target.value });
                }}
                margin="normal"
              />

              <CustomTextField
                autoComplete="off"
                label="Seri Numara"
                required
                fullWidth
                variant="filled"
                value={systemInfo?.seri_num}
                onChange={(e) => {
                  setSystemInfo({ ...systemInfo, seri_num: e.target.value });
                }}
                margin="normal"
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Autocomplete
                  freeSolo
                  clearOnEscape //çarpı işareti çıkaramlıdır. temizlemke için
                  fullWidth
                  placeHolder="Tür"
                  options={all_types}
                  getOptionLabel={(option) => option.name}
                  onChange={handleTypeOptionChange}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue) {
                      setTempType(newInputValue);
                    }
                  }}
                  filterOptions={filterTypeOptions}
                  value={
                    all_types.find((type) => type.id === systemInfo?.type_id) ||
                    null
                  }
                  renderInput={(params) => (
                    <CustomAutocompleteTextField
                      {...params}
                      label="Türü"
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
                <Tooltip
                  title="Yeni bir Tür ismi girebilirsiniz."
                  placement="right"
                >
                  <InfoIcon style={{ color: "white", marginLeft: "8px" }} />
                </Tooltip>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Autocomplete
                  freeSolo
                  fullWidth
                  placeHolder="Marka"
                  options={markalar}
                  getOptionLabel={(option) => option.name}
                  onChange={handleMarkaOptionChange}
                  onInputChange={(event, newInputValue) => {
                    setTempMarka(newInputValue);
                  }}
                  filterOptions={filterMarkaOptions}
                  value={
                    markalar.find(
                      (marka) => marka.id === systemInfo?.marka_id
                    ) || null
                  }
                  renderInput={(params) => (
                    <CustomAutocompleteTextField
                      {...params}
                      label="Marka"
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

                <Tooltip
                  title="Yeni bir Marka ismi girebilirsiniz."
                  placement="right"
                >
                  <InfoIcon style={{ color: "white", marginLeft: "8px" }} />
                </Tooltip>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Autocomplete
                  freeSolo
                  fullWidth
                  placeHolder="Model"
                  options={models}
                  getOptionLabel={(option) => option.name}
                  onChange={handleModelOptionChange}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue) {
                      setTempModel(newInputValue);
                    }
                  }}
                  value={
                    models.find(
                      (model) => model.id === systemInfo?.mmodel_id
                    ) || null
                  }
                  filterOptions={filterModelOptions}
                  renderInput={(params) => (
                    <CustomAutocompleteTextField
                      {...params}
                      label="Model"
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

                <Tooltip
                  title="Yeni bir Model ismi girebilirsiniz."
                  placement="right"
                >
                  <InfoIcon style={{ color: "white", marginLeft: "8px" }} />
                </Tooltip>
              </div>
            </div>

            <div
              className="system-add-to-the-right"
              style={{ width: system ? "27vw" : "40vw" }}
            >
              <LocalizationProvider
                className="system-add-calender"
                dateAdapter={AdapterDayjs}
                adapterLocale="tr"
              >
                <DatePicker
                  label="Envantere Giriş Tarihi"
                  className="system-add-calender"
                  value={girisTarihi}
                  onChange={(newValue) => {
                    setGirisTarihi(newValue);
                    setErrors((prev) => ({ ...prev, girisTarihi: "" }));
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      className="system-add-calender"
                      label="Envantere Giriş Tarihi"
                      error={!!errors.girisTarihi}
                      helperText={errors.girisTarihi ? "Geçersiz tarih!" : ""}
                    />
                  )}
                />
              </LocalizationProvider>

              <div style={{ marginTop: "15px" }}>
                <Autocomplete
                  multiple
                  id="tags-filled"
                  options={unsurlar}
                  getOptionLabel={(option) => option.name}
                  value={
                    Array.isArray(systemInfo?.selectedUnsurlar) &&
                    unsurlar.length
                      ? unsurlar.filter((unsur) =>
                          systemInfo.selectedUnsurlar.includes(unsur.id)
                        )
                      : []
                  }
                  onChange={(event, newValue) => {
                    setSelectedUnsurlar(newValue);
                    setSystemInfo((prev) => ({
                      ...prev,
                      selectedUnsurlar: newValue.map((item) => item.id),
                    }));
                  }}
                  renderInput={(params) => (
                    <CustomAutocompleteTextField
                      {...params}
                      variant="filled"
                      label="İlişkili Unsurlar"
                      placeholder="Unsur Seç"
                    />
                  )}
                />
              </div>

              <div style={{ marginTop: "15px" }}>
                <Autocomplete
                  multiple
                  id="tags-filled"
                  options={freeMalzemeler}
                  getOptionLabel={(option) => option.name}
                  value={
                    Array.isArray(systemInfo?.selectedMalzemeler)
                      ? [
                          ...freeMalzemeler.filter((malzeme) =>
                            systemInfo.selectedMalzemeler.includes(malzeme.id)
                          ),
                          ...systemInfo.selectedMalzemeler.filter(
                            (selectedMalzeme) =>
                              !freeMalzemeler.some(
                                (malzeme) => malzeme.id === selectedMalzeme
                              )
                          ),
                        ]
                      : []
                  }
                  onChange={handleChosenMalzemelerChange}
                  renderInput={(params) => (
                    <CustomAutocompleteTextField
                      {...params}
                      variant="filled"
                      label={
                        system
                          ? "Sistemideki Malzemeler"
                          : "Sistemi Olmayan Malzemeler"
                      }
                      placeholder="Malzeme Seç"
                    />
                  )}
                />
              </div>

              <CustomTextField
                autoComplete="off"
                label="Açıklama"
                fullWidth
                multiline
                rows={2}
                variant="filled"
                value={systemInfo?.description}
                onChange={(e) => {
                  setSystemInfo({ ...systemInfo, description: e.target.value });
                }}
                margin="normal"
              />

              <div style={{ display: "flex", alignItems: "center" }}>
                <div>Bulunduğu yer:</div>
                <div style={{ marginLeft: "10px" }}>
                  <FormControlLabel
                    control={<Radio {...controlProps("b")} color="default" />}
                    label="Birim Depo"
                  />

                  <FormControlLabel
                    control={<Radio {...controlProps("y")} color="default" />}
                    label="Yedek Depo"
                  />

                  <FormControlLabel
                    control={<Radio {...controlProps("m")} color="default" />}
                    label="Mevzi"
                  />
                </div>
              </div>

              {selectedRadioBValue === "m" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Autocomplete
                    freeSolo
                    fullWidth
                    options={mevziler}
                    getOptionLabel={(option) => option.name}
                    value={selectedMevzi}
                    onChange={handleMevziOptionChange}
                    filterOptions={filterTypeOptions}
                    renderInput={(params) => (
                      <CustomAutocompleteTextField
                        {...params}
                        label="Mevzi"
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
                  <Tooltip
                    title="Sadece isim belirleyerek boş bir mevzi oluşturabilirsiniz. Daha sonra Mevzi'nizin detaylarını güncelleyebilirsiniz."
                    placement="right"
                  >
                    <InfoIcon style={{ color: "white", marginLeft: "8px" }} />
                  </Tooltip>
                </div>
              )}

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
              {system ? "Güncelle" : "Kaydet"}
            </CustomOutlinedButton>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default SystemAdd;
