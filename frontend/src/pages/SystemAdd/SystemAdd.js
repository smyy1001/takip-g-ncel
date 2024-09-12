import "./SystemAdd.css";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import Axios from "../../Axios";
import { Container, Typography, Button } from "@mui/material";
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoIcon from "@mui/icons-material/Info";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs"; // This is fine, but no need to directly use `isValid` here
import "dayjs/locale/tr"; // For Turkish locale

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
  const [errors, setErrors] = useState({
    girisTarihi: "",
  });
  const formRef = useRef();

  const resetForm = () => {
    formRef.current.reset();
    setTempType("");
    setTempMarka("");
    setTempModel("");
    setSelectedUnsurlar([]);
    setSelectedMalzemeler([]);
    setSelectedRadioBValue("b");
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
    setSelectedMalzemeler(newValue);
    setSystemInfo((prev) => ({
      ...prev,
      selectedMalzemeler: newValue.map((malzeme) => malzeme.id),
    }));
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
    const malzemeIds = selectedMalzemeler.map((malzeme) => malzeme.id);
    const requestBody = {
      malzeme_ids: malzemeIds,
      system_id: system_idd,
    };
    try {
      const response = await Axios.post(
        "/api/malzeme/reg-system/",
        requestBody
      );
      console.log("Response:", response.data);
      message.success("Malzemeler güncellendi!");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      message.error("Malzemeler güncellenemedi'");
    }
  };

  // EKLE
  const handleAddSystem = async (event) => {
    event.preventDefault();
    let lok =
      selectedRadioBValue === "b" ? 0 : selectedRadioBValue === "y" ? 1 : 2;

    handleAddingStringType();
    handleAddingStringMarka();
    handleAddingStringModel();

    const formattedData = {
      ...systemInfo,
      ilskili_unsur: selectedUnsurlar.map((item) => item.id),
      mmodel_id: systemInfo?.mmodel_id || null,
      depo: lok,
      mevzi_id:
        selectedRadioBValue === "m" && systemInfo.mevzi_id
          ? systemInfo.mevzi_id
          : undefined,
      giris_tarihi: girisTarihi.toISOString().split("T")[0],
    };

    try {
      let response;

      // Eğer bir system varsa güncelleme yap
      if (system) {
        response = await Axios.put(
          `/api/system/update/${system.id}`,
          formattedData
        );
        if (response.status === 200) {
          message.success("Sistem güncellendi!");
          await handleUpdateMalzeme(system.id);
          fetchSystems();
        }
      }
      // Eğer system yoksa yeni ekleme yap
      else {
        response = await Axios.post("/api/system/add/", formattedData);
        if (response.status === 200 || response.status === 201) {
          await handleUpdateMalzeme(response.data.id);
          message.success("Sistem eklendi!");
        }
      }

      // Formu sıfırla ve verileri yeniden yükle
      setSelectedUnsurlar([]);
      setSelectedMalzemeler([]);
      setSelectedRadioBValue("b");
      fetchAllMarkalar();
      fetchAllMevzi();
      fetchAllModels();
      fetchAllTypes();
      fetchFreeMalzemeler();
      setSystemInfo(null);
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
  }, []);

  useEffect(() => {
    if (system) {
      // Gelen system verisini state'e atıyoruz
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

      const selectedMevziFromMalzeme = mevziler.find(
        (mevzi) => mevzi.id === system.mevzi_id
      );
      setSelectedMevzi(selectedMevziFromMalzeme || null);

      if (system.giris_tarihi) {
        setGirisTarihi(new Date(system.giris_tarihi));
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
                type="number"
                inputProps={{ step: "1" }}
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
