import "./SystemAdd.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
  const [malzemeInfo, setMalzemeInfo] = useState([]);
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
  const [errors, setErrors] = useState({
    girisTarihi: "",
  });
  const formRef = useRef();
  const handleGoruntuleClick = () => {
    if (system?.id) {
      navigate(`/sistem/${system.id}/bilgi`);
    }
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

  const resetForm = () => {
    formRef.current.reset();
    setTempType("");
    setTempMarka("");
    setTempModel("");
    setSelectedUnsurlar([]);
    setSelectedMalzemeler([]);
    setSelectedRadioBValue("b");
    setFolders([]);
    setMalzemeInfo([]);
    setSystemInfo({
      type_id: null,
      marka_id: null,
      mmodel_id: null,
      mevzi_id: null,
      depo: selectedRadioBValue,
      ip: null,
      frequency: null,
    });
  };

  // TYPE
  const fetchAllTypes = async () => {
    try {
      const response = await axios.get("/api/systype/all/");
      setAllTypes(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewType = async (typeName) => {
    try {
      const response = await axios.post("/api/systype/add/", {
        name: typeName,
      });
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
      const response = await axios.get("/api/sys_marka/all/");
      setAllMarkalar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewMarka = async (markaName) => {
    try {
      const response = await axios.post("/api/sys_marka/add/", {
        name: markaName,
      });
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
      const response = await axios.get("/api/unsur/all/");
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
    if (newValue.length === 0) {
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
    setSelectedMalzemeler(newValue);
  };

  // MODEL
  const fetchAllModels = async () => {
    try {
      const response = await axios.get("/api/sys_model/all/");
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
      const response = await axios.post("/api/sys_model/add/", {
        name: modelName,
      });
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
      const response = await axios.post("/api/mevzi/add/", { name: MevziName });
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
    const malzemeIds = selectedMalzemeler
      ?.map((malzeme) => (typeof malzeme === "string" ? malzeme : malzeme.id))
      .filter((id) => id !== undefined && id !== null);

    const previouslySelectedMalzemeler =
      malzemeler?.filter((malzeme) => malzeme.system_id === system_idd) || [];

    const malzemelerToBeUnset = previouslySelectedMalzemeler.filter(
      (malzeme) => !malzemeIds.includes(malzeme.id)
    );

    if (malzemeIds.length === 0 && malzemelerToBeUnset.length === 0) {
      return;
    }

    const requestBody = {
      malzeme_ids: malzemeIds,
      system_id: system_idd,
    };

    try {
      const response = await axios.post("/api/malzeme/reg-system", requestBody);

      await Promise.all(
        malzemelerToBeUnset.map(async (malzeme) => {
          try {
            await axios.put(`/api/malzeme/unset-system/${malzeme.id}`);
          } catch (error) {
            console.error(`Error updating malzeme ${malzeme.id}`, error);
          }
        })
      );

      await Promise.all(
        malzemeInfo.map(async (malzeme) => {
          try {
            const formData = new FormData();
            formData.append("ip", malzeme.ip);
            if (malzeme.ip && malzeme.frequency) {
              formData.append("frequency", malzeme.frequency);
            }

            await axios.put(
              `/api/malzeme/update-ip-frequency/${malzeme.id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (error) {
            console.error(
              `Malzeme IP ve frequency güncellenirken hata oluştu: ${malzeme.id}`,
              error
            );
            message.error(`Malzeme ${malzeme.id} güncellenemedi.`);
          }
        })
      );

      message.success("Malzemeler güncellendi!");
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

    const isFolderNameMissing = folders.some(
      (folder) => folder.selectedImages.length > 0 && !folder.folderName.trim()
    );

    if (isFolderNameMissing) {
      message.error("Fotoğraf seçtiyseniz klasör ismi girmelisiniz!");
      return;
    }

    let lok =
      selectedRadioBValue === "b" ? 0 : selectedRadioBValue === "y" ? 1 : 2;

    handleAddingStringType();
    handleAddingStringMarka();
    handleAddingStringModel();

    const systemData = {
      name: systemInfo?.name || null,
      frequency: systemInfo?.ip ? systemInfo?.frequency || null : null,
      ip: systemInfo?.ip || null,
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
      let response;

      if (system) {
        response = await axios.put(
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
          await handleUpdateMalzeme(response.data.id);
          fetchSystems();
        }
      } else {
        response = await axios.post("/api/system/add/", formData, {
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
      const selectedMalzemeler = malzemeler
        .filter((malzeme) => malzeme.system_id === system.id)
        .map((malzeme) => malzeme.id);
      setSystemInfo({
        name: system.name,
        seri_num: system.seri_num,
        marka_id: system.marka_id,
        mmodel_id: system.mmodel_id,
        ip: system.ip,
        frequency: system.ip ? system.frequency : null,
        description: system.description,
        type_id: system.type_id,
        selectedUnsurlar: system.ilskili_unsur || [],
        selectedMalzemeler: selectedMalzemeler || [],
        mevzi_id: system.mevzi_id || null,
      });
      if (selectedMalzemeler.length > 0) {
        const filledMalzemeInfo = malzemeler
          .filter((malzeme) => selectedMalzemeler.includes(malzeme.id))
          .map((malzeme) => ({
            id: malzeme.id,
            name: malzeme.name,
            ip: malzeme.ip || null,
            frequency: malzeme.ip ? malzeme.frequency || null : null,
          }));

        setMalzemeInfo(filledMalzemeInfo);
      } else {
        // Eğer seçili malzeme yoksa malzemeInfo'yu boş bırak
        setMalzemeInfo([]);
      }
      const depoValue = system.depo === 0 ? "b" : system.depo === 1 ? "y" : "m";
      setSelectedRadioBValue(depoValue);
      setSelectedUnsurlar(system.ilskili_unsur || []);
      setSelectedMalzemeler(selectedMalzemeler);
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

        const originalNames = Object.keys(foldersFromSystem);
        setOriginalFolderNames(originalNames);
        setFolders(Object.values(foldersFromSystem));
      }
    }
  }, [system, mevziler, malzemeler]);
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
                  if (isRoleAdmin) {
                    setSystemInfo({ ...systemInfo, name: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />
              <CustomTextField
                autoComplete="off"
                label="Seri Numara"
                required
                fullWidth
                variant="filled"
                value={systemInfo?.seri_num}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setSystemInfo({ ...systemInfo, seri_num: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />
              <CustomTextField
                autoComplete="off"
                label="IP"
                fullWidth
                variant="filled"
                value={systemInfo?.ip}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setSystemInfo({ ...systemInfo, ip: e.target.value });
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
                value={systemInfo?.frequency || ""}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setSystemInfo({ ...systemInfo, frequency: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />
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
                    freeSolo
                    clearOnEscape
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
                      all_types.find(
                        (type) => type.id === systemInfo?.type_id
                      ) || null
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
                ) : (
                  <CustomTextField
                    label="Türü"
                    value={
                      all_types.find((type) => type.id === systemInfo?.type_id)
                        ?.name || ""
                    }
                    variant="filled"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                )}

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
                {isRoleAdmin ? (
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
                ) : (
                  <CustomAutocompleteTextField
                    label="Marka"
                    value={
                      markalar.find(
                        (marka) => marka.id === systemInfo?.marka_id
                      )?.name || ""
                    }
                    variant="filled"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                )}

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
                {isRoleAdmin ? (
                  <Autocomplete
                    freeSolo
                    fullWidth
                    placeHolder="Model"
                    options={models}
                    getOptionLabel={(option) => option.name}
                    onChange={handleModelOptionChange}
                    onInputChange={(event, newInputValue) => {
                      setTempModel(newInputValue);
                    }}
                    filterOptions={filterModelOptions}
                    value={
                      models.find(
                        (model) => model.id === systemInfo?.mmodel_id
                      ) || null
                    }
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
                ) : (
                  <CustomAutocompleteTextField
                    label="Model"
                    value={
                      models.find((model) => model.id === systemInfo?.mmodel_id)
                        ?.name || ""
                    }
                    variant="filled"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                )}

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
                {isRoleAdmin ? (
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
                ) : (
                  <CustomTextField
                    className="system-add-calender"
                    label="Envantere Giriş Tarihi"
                    value={girisTarihi?.toLocaleDateString() || ""}
                    variant="filled"
                    fullWidth
                    disabled
                  />
                )}
              </LocalizationProvider>

              <div style={{ marginTop: "15px" }}>
                {isRoleAdmin ? (
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
                ) : (
                  <CustomAutocompleteTextField
                    label="İlişkili Unsurlar"
                    value={unsurlar
                      .filter((unsur) =>
                        systemInfo?.selectedUnsurlar.includes(unsur.id)
                      )
                      .map((unsur) => unsur.name)
                      .join(", ")}
                    variant="filled"
                    fullWidth
                    disabled
                  />
                )}
              </div>

              <div style={{ marginTop: "15px" }}>
                {isRoleAdmin ? (
                  <>
                    <Autocomplete
                      multiple
                      id="tags-filled"
                      options={freeMalzemeler}
                      getOptionLabel={(option) => option.name}
                      value={
                        Array.isArray(systemInfo?.selectedMalzemeler) &&
                        malzemeler.length > 0
                          ? malzemeler.filter((malzeme) =>
                              systemInfo.selectedMalzemeler.includes(malzeme.id)
                            )
                          : []
                      }
                      onChange={(event, newValue) => {
                        setSelectedMalzemeler(newValue);
                        setSystemInfo((prev) => ({
                          ...prev,
                          selectedMalzemeler: newValue.map(
                            (malzeme) => malzeme.id
                          ),
                        }));
                        setMalzemeInfo(
                          newValue.map((malzeme) => ({
                            id: malzeme.id,
                            name: malzeme.name,
                            ip: malzeme.ip || "",
                            frequency: malzeme.frequency || "",
                          }))
                        );
                      }}
                      renderInput={(params) => (
                        <CustomAutocompleteTextField
                          {...params}
                          variant="filled"
                          label={
                            system
                              ? "Sistemdeki Malzemeler"
                              : "Sistemi Olmayan Malzemeler"
                          }
                          placeholder="Malzeme Seç"
                        />
                      )}
                    />
                    {malzemeInfo.map((malzeme, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        <CustomTextField
                          label={`${malzeme.name} için IP`}
                          value={malzeme.ip || ""}
                          onChange={(e) => {
                            const updatedMalzemeInfo = [...malzemeInfo];
                            updatedMalzemeInfo[index].ip = e.target.value;
                            setMalzemeInfo(updatedMalzemeInfo);
                          }}
                          variant="filled"
                          fullWidth
                          autoComplete="off"
                        />

                        <CustomTextField
                          autoComplete="off"
                          label={`${malzeme.name} için Ping Sıklığı (Dakika)`}
                          fullWidth
                          type="number"
                          inputProps={{ step: "0.01", min: 1 }}
                          variant="filled"
                          value={malzeme.frequency || ""}
                          onChange={(e) => {
                            const updatedMalzemeInfo = [...malzemeInfo];
                            updatedMalzemeInfo[index].frequency =
                              e.target.value;
                            setMalzemeInfo(updatedMalzemeInfo);
                          }}
                          disabled={!isRoleAdmin}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <CustomTextField
                      label="Sistemdeki Malzemeler"
                      value={
                        malzemeler
                          .filter((malzeme) =>
                            systemInfo?.selectedMalzemeler.includes(malzeme.id)
                          )
                          .map((malzeme) => malzeme.name)
                          .join(", ") || ""
                      }
                      variant="filled"
                      fullWidth
                      disabled
                    />
                    {malzemeInfo.map((malzeme, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        {malzeme.ip && (
                          <>
                            <CustomTextField
                              label={`${malzeme.name} için IP`}
                              value={malzeme.ip || ""}
                              variant="filled"
                              fullWidth
                              disabled
                            />
                            <CustomTextField
                              label={`${malzeme.name} için Ping Sıklığı (Dakika)`}
                              value={malzeme.frequency || ""}
                              variant="filled"
                              fullWidth
                              disabled
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
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
                  if (isRoleAdmin) {
                    setSystemInfo({
                      ...systemInfo,
                      description: e.target.value,
                    });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />

              <div style={{ display: "flex", alignItems: "center" }}>
                <div>Bulunduğu yer:</div>
                <div style={{ marginLeft: "10px" }}>
                  <FormControlLabel
                    control={<Radio {...controlProps("b")} color="default" />}
                    label="Birim Depo"
                    disabled={!isRoleAdmin}
                  />

                  <FormControlLabel
                    control={<Radio {...controlProps("y")} color="default" />}
                    label="Yedek Depo"
                    disabled={!isRoleAdmin}
                  />

                  <FormControlLabel
                    control={<Radio {...controlProps("m")} color="default" />}
                    label="Mevzi"
                    disabled={!isRoleAdmin}
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
                  {isRoleAdmin ? (
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
                  ) : (
                    <CustomAutocompleteTextField
                      label="Mevzi"
                      value={selectedMevzi?.name || ""}
                      variant="filled"
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  )}

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
            {system && (
              <CustomOutlinedButton
                variant="outlined"
                onClick={handleGoruntuleClick}
              >
                Görüntüle
              </CustomOutlinedButton>
            )}
            {isRoleAdmin && (
              <CustomOutlinedButton variant="outlined" type="submit">
                {system ? "Güncelle" : "Kaydet"}
              </CustomOutlinedButton>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}

export default SystemAdd;
