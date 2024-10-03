import "./MalzemeAdd.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import { Container, Typography, Button, IconButton } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import CloseIcon from "@mui/icons-material/Close";

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

function MalzemeAdd({
  isRoleAdmin,
  mevziler,
  fetchAllMevzi,
  systems,
  fetchSystems,
  fetchMalzemeler,
  malzeme,
}) {
  const [malzemeInfo, setMalzemeInfo] = useState({
    arizalar: [],
    bakimlar: [],
    onarimlar: [],
    ip: "",
    frequency: "",
  });
  const [ipRequired, setIpRequired] = useState(false);
  const navigate = useNavigate();
  const [all_types, setAllTypes] = useState([]);
  const [tempType, setTempType] = useState("");
  const [tempMarka, setTempMarka] = useState("");
  const [tempModel, setTempModel] = useState("");
  const [selectedRadioBValue, setSelectedRadioBValue] = useState("b"); // birim depo - yedek depo - mevzi
  const [selectedMevzi, setSelectedMevzi] = useState(null);
  const [markalar, setAllMarkalar] = useState([]);
  const [models, setAllModels] = useState([]);
  const [girisTarihi, setGirisTarihi] = useState(new Date());
  const [errors, setErrors] = useState({
    girisTarihi: "",
  });
  const formRef = useRef();

  const [newChosenDate, setNewChosenDate] = useState(null);
  const [newChosenDate2, setNewChosenDate2] = useState(null);
  const [newChosenDate3, setNewChosenDate3] = useState(null);

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
  const calculateTimeDifference = (startDate, endDate) => {
    const diffInMilliseconds = dayjs(endDate).diff(dayjs(startDate));
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const days = Math.floor(diffInMinutes / (60 * 24));
    const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
    const minutes = diffInMinutes % 60;
    if (days === 0 && hours === 0) {
      return `${minutes} dakika`;
    } else if (days === 0) {
      return `${hours} saat, ${minutes} dakika`;
    } else {
      return `${days} gün, ${hours} saat, ${minutes} dakika`;
    }
  };
  const handleGoruntuleClick = () => {
    if (malzeme?.id) {
      navigate(`/malzeme/${malzeme.id}/bilgi`);
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

  const calculateAdjustedTimeDifference = (startDate, endDate) => {
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).startOf("day");

    const diffInDays = end.diff(start, "day");
    return diffInDays === 0 ? `1 gün` : `${diffInDays} gün`;
  };

  const calculateTotalFaultTime = (arizalar, onarimlar) => {
    let totalArizaDays = 0;

    arizalar.forEach((ariza) => {
      const ilgiliOnarim = onarimlar.find((onarim) =>
        dayjs(onarim).isSame(dayjs(ariza), "day")
      );
      if (ilgiliOnarim) {
        return;
      } else {
        totalArizaDays += dayjs(new Date()).diff(dayjs(ariza), "day");
      }
    });
    return totalArizaDays === 0 ? "1 gün" : `${totalArizaDays} gün`;
  };

  const resetForm = () => {
    formRef.current.reset();
    setTempType("");
    setNewChosenDate(null);
    setNewChosenDate2(null);
    setNewChosenDate3(null);
    setTempMarka("");
    setTempModel("");
    setFolders([]);
    setIpRequired(false);
    setMalzemeInfo({
      name: "",
      system_id: null,
      seri_num: "",
      type_id: null,
      marka_id: null,
      mmodel_id: null,
      description: "",
      mevzi_id: null,
      bakimlar: [],
      arizalar: [],
      onarimlar: [],
      ip: null,
      frequency: null,
    });
    setSelectedRadioBValue("b");
    setGirisTarihi(new Date());
  };

  // TYPE
  const fetchAllTypes = async () => {
    try {
      const response = await axios.get("/api/type/all/");
      setAllTypes(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewType = async (typeName) => {
    try {
      const response = await axios.post("/api/type/add/", { name: typeName });

      fetchAllTypes();
      return response.data.id;
    } catch (error) {
      console.error("Tür eklenirken hata:", error);
      return 0;
    }
  };

  const handleTypeOptionChange = (event, newValue) => {
    if (typeof newValue === "string" && newValue !== "") {
      if (!all_types.some((type) => type.name === newValue)) {
        const type_id = addNewType(newValue);
        setMalzemeInfo((prev) => ({ ...prev, type_id: type_id }));
      }
    } else if (newValue && typeof newValue === "object") {
      setMalzemeInfo((prev) => ({ ...prev, type_id: newValue.id }));
    } else {
      setMalzemeInfo((prev) => ({ ...prev, type_id: 0 }));
    }
  };

  const filterTypeOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.name,
  });

  async function handleAddingStringType() {
    if (
      typeof tempType === "string" &&
      tempType !== "" &&
      !all_types.some((type) => type.name === tempType)
    ) {
      try {
        const type_id = await addNewType(tempType);
        setMalzemeInfo((prev) => ({ ...prev, type_id: type_id }));
      } catch (error) {
        console.error("Error adding new type:", error);
      }
    }
  }

  // MARKA
  const fetchAllMarkalar = async () => {
    try {
      const response = await axios.get("/api/marka/all/");
      setAllMarkalar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewMarka = async (markaName) => {
    try {
      const response = await axios.post("/api/marka/add/", { name: markaName });

      fetchAllMarkalar();
      return response.data.id;
    } catch (error) {
      console.error("Marka eklenirken hata:", error);
      return 0;
    }
  };
  const handleMarkaOptionChange = (event, newValue) => {
    if (typeof newValue === "string" && newValue !== "") {
      if (!markalar.some((ma) => ma.name === newValue)) {
        const marka_id = addNewMarka(newValue);
        setMalzemeInfo((prev) => ({ ...prev, marka_id: marka_id }));
      }
    } else if (newValue && typeof newValue === "object") {
      setMalzemeInfo((prev) => ({ ...prev, marka_id: newValue.id }));
    } else {
      setMalzemeInfo((prev) => ({ ...prev, marka_id: 0 }));
    }
  };

  const filterMarkaOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.name,
  });

  async function handleAddingStringMarka() {
    if (
      typeof tempMarka === "string" &&
      tempMarka !== "" &&
      !markalar.some((m) => m.name === tempMarka)
    ) {
      try {
        const marka_id = await addNewMarka(tempMarka);
        setMalzemeInfo((prev) => ({ ...prev, marka_id: marka_id }));
      } catch (error) {
        console.error("Error adding new type:", error);
      }
    }
  }

  // MODEL
  const fetchAllModels = async () => {
    try {
      const response = await axios.get("/api/model/all/");
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
      const response = await axios.post("/api/model/add/", { name: modelName });

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
        setMalzemeInfo((prev) => ({ ...prev, mmodel_id: model_id }));
      }
    } else if (newValue && typeof newValue === "object") {
      setMalzemeInfo((prev) => ({ ...prev, mmodel_id: newValue.id }));
    } else {
      setMalzemeInfo((prev) => ({ ...prev, mmodel_id: 0 }));
    }
  };

  async function handleAddingStringModel() {
    if (
      typeof tempModel === "string" &&
      tempModel !== "" &&
      !models.some((m) => m.name === tempModel)
    ) {
      try {
        const model_id = await addNewModel(tempModel);
        setMalzemeInfo((prev) => ({ ...prev, mmodel_id: model_id }));
      } catch (error) {
        console.error("Error adding new type:", error);
      }
    }
  }

  // Dates
  const handleArizaDateChange = (newDateTime) => {
    if (newDateTime) {
      setMalzemeInfo((prev) => {
        const exists = prev.arizalar.some((a) =>
          dayjs(a).isSame(dayjs(newDateTime))
        );

        if (!exists) {
          return {
            ...prev,
            arizalar: prev.arizalar
              ? [...prev.arizalar, dayjs(newDateTime).format("YYYY-MM-DD")]
              : [dayjs(newDateTime).format("YYYY-MM-DD")],
          };
        } else {
          return prev;
        }
      });
      setNewChosenDate(null);
    } else {
      message.error("Geçersiz tarih veya saat!");
    }
  };
  const handleDeleteAriza = (indexToRemove) => {
    setMalzemeInfo((prev) => ({
      ...prev,
      arizalar: prev.arizalar.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleBakimDateChange = (newDateTime) => {
    // if (newDateTime && isValid(newDateTime)) {
    if (newDateTime) {
      setMalzemeInfo((prev) => {
        const exists = prev.bakimlar.some((bakim) =>
          dayjs(bakim).isSame(dayjs(newDateTime))
        );

        if (!exists) {
          return {
            ...prev,
            bakimlar: prev.bakimlar
              ? [...prev.bakimlar, dayjs(newDateTime).format("YYYY-MM-DD")]
              : [dayjs(newDateTime).format("YYYY-MM-DD")],
          };
        } else {
          return prev;
        }
      });
      setNewChosenDate3(null);
    } else {
      message.error("Geçersiz tarih veya saat!");
    }
  };
  const handleDeleteBakim = (indexToRemove) => {
    setMalzemeInfo((prev) => ({
      ...prev,
      bakimlar: prev.bakimlar.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleOnarimDateChange = (newDateTime) => {
    // if (newDateTime && isValid(newDateTime)) {
    if (newDateTime) {
      setMalzemeInfo((prev) => {
        const exists = prev.onarimlar.some((onarim) =>
          dayjs(onarim).isSame(dayjs(newDateTime))
        );

        if (!exists) {
          return {
            ...prev,
            onarimlar: prev.onarimlar
              ? [...prev.onarimlar, dayjs(newDateTime).format("YYYY-MM-DD")]
              : [dayjs(newDateTime).format("YYYY-MM-DD")],
          };
        } else {
          return prev;
        }
      });
      setNewChosenDate2(null);
    } else {
      message.error("Geçersiz tarih veya saat!");
    }
  };
  const handleDeleteOnarim = (indexToRemove) => {
    setMalzemeInfo((prev) => ({
      ...prev,
      onarimlar: prev.onarimlar.filter((_, index) => index !== indexToRemove),
    }));
  };

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
      setMalzemeInfo((prev) => ({ ...prev, mevzi_id: newValue.id, depo: 2 }));
    } else if (typeof newValue === "string") {
      const mevzi_id = addNewMevzi(newValue);
      setMalzemeInfo((prev) => ({ ...prev, mevzi_id: mevzi_id, depo: 2 }));
      setSelectedMevzi({ name: newValue });
    } else {
      setSelectedMevzi(null);
      setMalzemeInfo((prev) => ({ ...prev, mevzi_id: null }));
    }
  };

  // EKLE
  const handleAddMalzeme = async (event) => {
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

    if (newChosenDate) {
      handleArizaDateChange(newChosenDate);
    }

    if (newChosenDate2) {
      handleOnarimDateChange(newChosenDate2);
    }

    if (newChosenDate3) {
      handleBakimDateChange(newChosenDate3);
    }

    const malzemeData = {
      name: malzemeInfo?.name || null,
      seri_num: malzemeInfo?.seri_num || null,
      description: malzemeInfo?.description || null,
      type_id: malzemeInfo?.type_id || null,
      marka_id: malzemeInfo?.marka_id || null,
      mmodel_id: malzemeInfo?.mmodel_id || null,
      depo: lok !== undefined ? lok : null,
      mevzi_id:
        selectedRadioBValue === "m" && malzemeInfo.mevzi_id
          ? malzemeInfo.mevzi_id
          : undefined,
      giris_tarihi: girisTarihi.toISOString().split("T")[0] || null,
      arizalar: malzemeInfo?.arizalar || [],
      bakimlar: malzemeInfo?.bakimlar || [],
      onarimlar: malzemeInfo?.onarimlar || [],
      system_id: malzemeInfo?.system_id || null,
      frequency:
        malzemeInfo?.system_id && malzemeInfo?.ip
          ? malzemeInfo?.frequency || null
          : null,
      ip: malzemeInfo?.system_id ? malzemeInfo?.ip || null : null,
    };

    const formData = new FormData();
    formData.append("malzeme", JSON.stringify(malzemeData));

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

      if (malzeme) {
        response = await axios.put(
          `/api/malzeme/update/${malzeme.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          message.success("Malzeme güncellendi!");
          fetchMalzemeler();
          fetchAllMevzi();
        }
      } else {
        response = await axios.post("/api/malzeme/add/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200 || response.status === 201) {
          message.success("Malzeme eklendi!");
        }
      }

      setSelectedRadioBValue("b");
      fetchAllMarkalar();
      fetchAllMevzi();
      fetchAllModels();
      fetchAllTypes();
      setMalzemeInfo({ arizalar: [], bakimlar: [], onarimlar: [] });
      resetForm();
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };
  useEffect(() => {
    fetchAllTypes();
    fetchAllModels();
    fetchAllMevzi();
    fetchAllMarkalar();
    fetchSystems();
  }, []);

  useEffect(() => {
    resetForm();
    if (malzeme) {
      setMalzemeInfo({
        name: malzeme.name,
        seri_num: malzeme.seri_num,
        marka_id: malzeme.marka_id,
        mmodel_id: malzeme.mmodel_id,
        description: malzeme.description,
        type_id: malzeme.type_id,
        mevzi_id: malzeme.mevzi_id || null,
        arizalar: malzeme.arizalar || [],
        bakimlar: malzeme.bakimlar || [],
        onarimlar: malzeme.onarimlar || [],
        system_id: malzeme.system_id || null,
        ip: malzeme.ip,
        frequency: malzeme.ip ? malzeme.frequency : null,
      });
      if (malzeme.system_id) {
        setIpRequired(true);
      } else {
        setIpRequired(false);
      }
      const depoValue =
        malzeme.depo === 0 ? "b" : malzeme.depo === 1 ? "y" : "m";
      setSelectedRadioBValue(depoValue);

      const selectedMevziFromMalzeme = mevziler.find(
        (mevzi) => mevzi.id === malzeme.mevzi_id
      );
      setSelectedMevzi(selectedMevziFromMalzeme || null);

      if (selectedMevziFromMalzeme) {
        setMalzemeInfo((prev) => ({
          ...prev,
          mevzi_id: selectedMevziFromMalzeme.id,
        }));
      }

      if (malzeme.giris_tarihi) {
        setGirisTarihi(new Date(malzeme.giris_tarihi));
      }
      if (malzeme.photos) {
        const foldersFromSystem = malzeme.photos?.reduce((acc, photoUrl) => {
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
  }, [malzeme, mevziler]);

  const mevziAdi = selectedMevzi?.name || "Bilinmeyen Mevzi";

  useEffect(() => {
    if (malzemeInfo.mevzi_id) {
      const selectedMevzi = mevziler.find(
        (mevzi) => mevzi.id === malzemeInfo.mevzi_id
      );
      setSelectedMevzi(selectedMevzi || null);
    }
  }, [malzemeInfo.mevzi_id, mevziler]);

  return (
    <Container className="malzeme-add-container">
      {!malzeme && (
        <Typography
          className="malzeme-add-big-header"
          variant="h6"
          gutterBottom
          component="div"
        >
          Malzeme Ekle
        </Typography>
      )}
      <div className="malzeme-add-main-div-class">
        <form
          ref={formRef}
          onSubmit={handleAddMalzeme}
          className="malzeme-add-form"
        >
          <div className="malzeme-add-direction-row">
            <div
              className="malzeme-add-to-the-left"
              style={{ width: malzeme ? "27vw" : "40vw" }}
            >
              <CustomTextField
                autoComplete="off"
                label="Malzeme Adı"
                required
                fullWidth
                variant="filled"
                value={malzemeInfo?.name}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMalzemeInfo({ ...malzemeInfo, name: e.target.value });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />

              {isRoleAdmin ? (
                <>
                  <Autocomplete
                    fullWidth
                    placeholder="İlişkili Sistem"
                    options={systems}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => {
                      setMalzemeInfo({
                        ...malzemeInfo,
                        system_id: value ? value.id : null,
                      });
                      setIpRequired(!!value);
                    }}
                    value={
                      systems.find(
                        (system) => system.id === malzemeInfo?.system_id
                      ) || null
                    }
                    renderInput={(params) => (
                      <CustomAutocompleteTextField
                        {...params}
                        label="İlişkili Sistem"
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
                  {ipRequired && (
                    <>
                      <CustomTextField
                        label="IP"
                        fullWidth
                        value={malzemeInfo?.ip || ""}
                        onChange={(e) =>
                          setMalzemeInfo((prev) => ({
                            ...prev,
                            ip: e.target.value,
                          }))
                        }
                        variant="filled"
                        margin="normal"
                        autoComplete="off"
                      />
                      <CustomTextField
                        autoComplete="off"
                        label="Ping Sıklığı (Dakika)"
                        fullWidth
                        type="number"
                        inputProps={{ step: "0.01", min: 1 }}
                        variant="filled"
                        value={malzemeInfo?.frequency || ""}
                        onChange={(e) => {
                          if (isRoleAdmin) {
                            setMalzemeInfo({
                              ...malzemeInfo,
                              frequency: e.target.value,
                            });
                          }
                        }}
                        margin="normal"
                        disabled={!isRoleAdmin}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <CustomTextField
                    label="İlişkili Sistem"
                    value={
                      systems.find(
                        (system) => system.id === malzemeInfo?.system_id
                      )?.name || ""
                    }
                    variant="filled"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  {malzemeInfo?.ip && (
                    <>
                      <CustomTextField
                        label="IP"
                        value={malzemeInfo?.ip || ""}
                        variant="filled"
                        fullWidth
                        margin="normal"
                        disabled
                      />
                      <CustomTextField
                        label="Ping Sıklığı (Dakika)"
                        value={malzemeInfo?.frequency || ""}
                        variant="filled"
                        fullWidth
                        margin="normal"
                        disabled
                      />
                    </>
                  )}
                </>
              )}

              <CustomTextField
                autoComplete="off"
                label="Seri Numara"
                required
                fullWidth
                variant="filled"
                value={malzemeInfo?.seri_num}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMalzemeInfo({
                      ...malzemeInfo,
                      seri_num: e.target.value,
                    });
                  }
                }}
                margin="normal"
                disabled={!isRoleAdmin}
              />

              <CustomTextField
                autoComplete="off"
                label="Açıklama"
                fullWidth
                multiline
                rows={2}
                variant="filled"
                value={malzemeInfo?.description}
                onChange={(e) => {
                  if (isRoleAdmin) {
                    setMalzemeInfo({
                      ...malzemeInfo,
                      description: e.target.value,
                    });
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
                    fullWidth
                    placeholder="Tür"
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
                        (type) => type.id === malzemeInfo?.type_id
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
                      all_types.find((type) => type.id === malzemeInfo?.type_id)
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
            </div>

            <div
              className="malzeme-add-to-the-right"
              style={{
                width: malzeme ? "27vw" : "40vw",
                marginTop: "23px",
                marginBottom: "15px",
              }}
            >
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
                    <CustomTextField
                      label="Mevzi"
                      value={
                        mevziler.find((mevzi) => mevzi.id === selectedMevzi?.id)
                          ?.name || ""
                      }
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
                    placeholder="Marka"
                    options={markalar}
                    getOptionLabel={(option) => option.name}
                    onChange={handleMarkaOptionChange}
                    onInputChange={(event, newInputValue) => {
                      setTempMarka(newInputValue);
                    }}
                    filterOptions={filterMarkaOptions}
                    value={
                      markalar.find(
                        (marka) => marka.id === malzemeInfo?.marka_id
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
                  <CustomTextField
                    label="Marka"
                    value={
                      markalar.find(
                        (marka) => marka.id === malzemeInfo?.marka_id
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
                    placeholder="Model"
                    options={models}
                    getOptionLabel={(option) => option.name}
                    onChange={handleModelOptionChange}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue) {
                        setTempModel(newInputValue);
                      }
                    }}
                    filterOptions={filterModelOptions}
                    value={
                      models.find(
                        (model) => model.id === malzemeInfo?.mmodel_id
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
                  <CustomTextField
                    label="Model"
                    value={
                      models.find(
                        (model) => model.id === malzemeInfo?.mmodel_id
                      )?.name || ""
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
              <LocalizationProvider
                className="malzeme-add-calender"
                style={{ marginTop: "30px" }}
                dateAdapter={AdapterDayjs}
                adapterLocale="tr"
              >
                {isRoleAdmin ? (
                  <DatePicker
                    autoComplete="off"
                    label="Envantere Giriş Tarihi"
                    className="malzeme-add-calender"
                    value={girisTarihi}
                    onChange={(newValue) => {
                      setGirisTarihi(newValue);
                      setErrors((prev) => ({ ...prev, girisTarihi: "" }));
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        className="malzeme-add-calender"
                        label="Envantere Giriş Tarihi"
                        error={!!errors.girisTarihi}
                        helperText={errors.girisTarihi ? "Geçersiz tarih!" : ""}
                      />
                    )}
                  />
                ) : (
                  <CustomTextField
                    className="malzeme-add-calender"
                    label="Envantere Giriş Tarihi"
                    value={girisTarihi?.toLocaleDateString() || ""}
                    variant="filled"
                    fullWidth
                    disabled
                  />
                )}
              </LocalizationProvider>

              {malzeme && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    width: "inherit",
                    marginTop: "20px",
                  }}
                >
                  <LocalizationProvider
                    className="malzeme-add-calender"
                    dateAdapter={AdapterDayjs}
                    adapterLocale="tr"
                  >
                    {isRoleAdmin ? (
                      <DatePicker
                        autoComplete="off"
                        label="Arıza Kaydı Ekle"
                        className="malzeme-add-calender"
                        value={newChosenDate}
                        onChange={(newValue) => setNewChosenDate(newValue)}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            className="malzeme-add-calender"
                            label="Arıza Kaydı Ekle"
                          />
                        )}
                      />
                    ) : (
                      <CustomTextField
                        className="malzeme-add-calender"
                        label="Arıza Kaydı Ekle"
                        value={newChosenDate?.toLocaleDateString() || ""}
                        variant="filled"
                        fullWidth
                        disabled
                      />
                    )}
                  </LocalizationProvider>
                  {isRoleAdmin && (
                    <Tooltip title="Arıza Kaydı Ekle" placement="right">
                      <IconButton
                        onClick={() => handleArizaDateChange(newChosenDate)}
                      >
                        <AddCircleIcon
                          style={{ color: "white", marginLeft: "8px" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )}
              <div>
                {malzemeInfo.arizalar && malzemeInfo.arizalar.length > 0 && (
                  <ul>
                    {malzemeInfo.arizalar.map((ariza, index) => (
                      <li key={index}>
                        {dayjs(ariza).locale("tr").format("DD/MM/YYYY")}
                        {isRoleAdmin && (
                          <Tooltip title="Kaldır">
                            <IconButton
                              style={{
                                paddingTop: "0px",
                                paddingRight: "0px",
                                paddingLeft: "0px",
                                paddingButtom: "0px",
                              }}
                              onClick={() => handleDeleteAriza(index)}
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
              {malzeme && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    width: "inherit",
                    marginTop: "20px",
                  }}
                >
                  <LocalizationProvider
                    className="malzeme-add-calender"
                    dateAdapter={AdapterDayjs}
                    adapterLocale="tr"
                  >
                    {isRoleAdmin ? (
                      <DatePicker
                        autoComplete="off"
                        label="Onarım Kaydı Ekle"
                        className="malzeme-add-calender"
                        value={newChosenDate2}
                        onChange={(newValue) => setNewChosenDate2(newValue)}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            className="malzeme-add-calender"
                            label="Onarım Kaydı Ekle"
                          />
                        )}
                      />
                    ) : (
                      <CustomTextField
                        className="malzeme-add-calender"
                        label="Onarım Kaydı Ekle"
                        value={newChosenDate2?.toLocaleDateString() || ""}
                        variant="filled"
                        fullWidth
                        disabled
                      />
                    )}
                  </LocalizationProvider>
                  {isRoleAdmin && (
                    <Tooltip title="Onarım Kaydı Ekle" placement="right">
                      <IconButton
                        onClick={() => handleOnarimDateChange(newChosenDate2)}
                      >
                        <AddCircleIcon
                          style={{ color: "white", marginLeft: "8px" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )}
              <div>
                {malzemeInfo.onarimlar && malzemeInfo.onarimlar.length > 0 && (
                  <ul>
                    {malzemeInfo.onarimlar.map((onarim, index) => (
                      <li key={index}>
                        {dayjs(onarim).locale("tr").format("DD/MM/YYYY")}
                        {isRoleAdmin && (
                          <Tooltip title="Kaldır">
                            <IconButton
                              onClick={() => handleDeleteOnarim(index)}
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
              {malzeme && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                    width: "inherit",
                    marginTop: "20px",
                  }}
                >
                  <LocalizationProvider
                    className="malzeme-add-calender"
                    dateAdapter={AdapterDayjs}
                    adapterLocale="tr"
                  >
                    {isRoleAdmin ? (
                      <DatePicker
                        autoComplete="off"
                        label="Bakım Kaydı Ekle"
                        className="malzeme-add-calender"
                        value={newChosenDate3}
                        onChange={(newValue) => setNewChosenDate3(newValue)}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            className="malzeme-add-calender"
                            label="Bakım Kaydı Ekle"
                          />
                        )}
                      />
                    ) : (
                      <CustomTextField
                        className="malzeme-add-calender"
                        label="Bakım Kaydı Ekle"
                        value={newChosenDate3?.toLocaleDateString() || ""}
                        variant="filled"
                        fullWidth
                        disabled
                      />
                    )}
                  </LocalizationProvider>
                  {isRoleAdmin && (
                    <Tooltip title="Bakım Kaydı Ekle" placement="right">
                      <IconButton
                        onClick={() => handleBakimDateChange(newChosenDate3)}
                      >
                        <AddCircleIcon
                          style={{ color: "white", marginLeft: "8px" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              )}
              <div>
                {malzemeInfo.bakimlar && malzemeInfo.bakimlar.length > 0 && (
                  <ul>
                    {malzemeInfo.bakimlar.map((bakim, index) => (
                      <li key={index}>
                        {dayjs(bakim).locale("tr").format("DD/MM/YYYY")}
                        {isRoleAdmin && (
                          <Tooltip title="Kaldır">
                            <IconButton
                              onClick={() => handleDeleteBakim(index)}
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
              <div>
                {malzeme && (
                  <>
                    <h3>Arıza Bilgileri:</h3>
                    <ul>
                      {malzemeInfo.arizalar &&
                      malzemeInfo.arizalar.length > 0 ? (
                        malzemeInfo.arizalar.map((ariza, index) => {
                          const ilgiliOnarim =
                            malzemeInfo.onarimlar &&
                            malzemeInfo.onarimlar.find((onarim) =>
                              dayjs(onarim).isSame(dayjs(ariza), "day")
                            );

                          return (
                            <li key={index}>
                              {`Mevzi Adı: ${mevziAdi}`} <br />
                              {`Arıza Tarihi: ${dayjs(ariza)
                                .locale("tr")
                                .format("DD/MM/YYYY")}`}{" "}
                              <br />
                              {!ilgiliOnarim && (
                                <>
                                  {`${calculateAdjustedTimeDifference(
                                    ariza,
                                    new Date()
                                  )}dür arızalı`}
                                </>
                              )}
                            </li>
                          );
                        })
                      ) : (
                        <li>Hiçbir arıza kaydı bulunamadı.</li>
                      )}
                    </ul>

                    <h3>Toplam Arıza Bilgisi:</h3>
                    <p>
                      {malzemeInfo.arizalar && malzemeInfo.onarimlar
                        ? `${calculateTotalFaultTime(
                            malzemeInfo.arizalar,
                            malzemeInfo.onarimlar
                          )}`
                        : "Veri bulunamadı"}
                    </p>

                    <h3>Onarım Bilgileri:</h3>
                    <ul>
                      {malzemeInfo.onarimlar &&
                      malzemeInfo.onarimlar.length > 0 ? (
                        malzemeInfo.onarimlar.map((onarim, index) => (
                          <li key={index}>
                            {`Mevzi Adı: ${mevziAdi}`} <br />
                            {`Onarım Tarihi: ${dayjs(onarim)
                              .locale("tr")
                              .format("DD/MM/YYYY HH:mm")}`}
                            <br />
                          </li>
                        ))
                      ) : (
                        <li>Hiçbir onarım kaydı bulunamadı.</li>
                      )}
                    </ul>

                    <h3>Bakım Bilgileri:</h3>
                    <ul>
                      {malzemeInfo.bakimlar &&
                      malzemeInfo.bakimlar.length > 0 ? (
                        malzemeInfo.bakimlar.map((bakim, index) => (
                          <li key={index}>
                            {`Mevzi Adı: ${mevziAdi}`} <br />
                            {`Bakım Tarihi: ${dayjs(bakim)
                              .locale("tr")
                              .format("DD/MM/YYYY HH:mm")}`}
                          </li>
                        ))
                      ) : (
                        <li>Hiçbir bakım kaydı bulunamadı.</li>
                      )}
                    </ul>
                  </>
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
            {malzeme && (
              <CustomOutlinedButton
                variant="outlined"
                onClick={handleGoruntuleClick}
              >
                Görüntüle
              </CustomOutlinedButton>
            )}
            {isRoleAdmin && (
              <CustomOutlinedButton variant="outlined" type="submit">
                {malzeme ? "Güncelle" : "Kaydet"}
              </CustomOutlinedButton>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}

export default MalzemeAdd;
