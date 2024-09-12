import "./MalzemeAdd.css";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import Axios from "../../Axios";
import { Container, Typography, Button, IconButton } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/tr";

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
  });

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

  const resetForm = () => {
    formRef.current.reset();
    setTempType("");
    setNewChosenDate(null);
    setNewChosenDate2(null);
    setNewChosenDate3(null);
    setTempMarka("");
    setTempModel("");
    setMalzemeInfo({
      name: "",
      system_id: null,
      seri_num: "",
      type_id: null,
      marka_id: null,
      mmodel_id: null,
      description: "",
      mevzi_id: null,
    });
    setSelectedRadioBValue("b");
    setGirisTarihi(new Date());
  };

  // TYPE
  const fetchAllTypes = async () => {
    try {
      const response = await Axios.get("/api/type/all/");
      setAllTypes(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewType = async (typeName) => {
    try {
      const response = await Axios.post("/api/type/add", { name: typeName });
      console.log("Yeni tür eklendi:", response.data);
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
      const response = await Axios.get("/api/marka/all/");
      setAllMarkalar(response.data);
    } catch (error) {
      message.error(error.response?.data?.detail || error.message);
    }
  };

  const addNewMarka = async (markaName) => {
    try {
      const response = await Axios.post("/api/marka/add", { name: markaName });
      console.log("Yeni marka eklendi:", response.data);
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
      const response = await Axios.get("/api/model/all/");
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
      const response = await Axios.post("/api/model/add", { name: modelName });
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
        const exists = prev.arizalar.some((a) => a.isSame(newDateTime));

        if (!exists) {
          return {
            ...prev,
            arizalar: prev.arizalar
              ? [...prev.arizalar, newDateTime]
              : [newDateTime],
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
        const exists = prev.bakimlar.some((bakim) => bakim.isSame(newDateTime));

        if (!exists) {
          return {
            ...prev,
            bakimlar: prev.bakimlar
              ? [...prev.bakimlar, newDateTime]
              : [newDateTime],
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
          onarim.isSame(newDateTime)
        );

        if (!exists) {
          return {
            ...prev,
            onarimlar: prev.onarimlar
              ? [...prev.onarimlar, newDateTime]
              : [newDateTime],
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
    let lok =
      selectedRadioBValue === "b" ? 0 : selectedRadioBValue === "y" ? 1 : 2;

    handleAddingStringType();
    handleAddingStringMarka();
    handleAddingStringModel();


    if (newChosenDate) {
      handleArizaDateChange(newChosenDate);
    }

    if (newChosenDate2) {
      handleBakimDateChange(newChosenDate2);
    }

    if (newChosenDate3) {
      handleBakimDateChange(newChosenDate3);
    }

    const formattedData = {
      ...malzemeInfo,
      depo: lok,
      mevzi_id:
        selectedRadioBValue === "m" && malzemeInfo.mevzi_id
          ? malzemeInfo.mevzi_id
          : undefined,
      giris_tarihi: girisTarihi.toISOString().split("T")[0],
    };

    try {
      let response;

      if (malzeme) {
        response = await Axios.put(
          `/api/malzeme/update/${malzeme.id}`,
          formattedData
        );
        if (response.status === 200) {
          message.success("Malzeme güncellendi!");
          fetchMalzemeler();
        }
      } else {
        response = await Axios.post("/api/malzeme/add/", formattedData);
        if (response.status === 200) {
          message.success("Malzeme eklendi!");
        }
      }

      setSelectedRadioBValue("b");
      fetchAllMarkalar();
      fetchAllMevzi();
      fetchAllModels();
      fetchAllTypes();
      setMalzemeInfo(null);
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
      });

      const depoValue =
        malzeme.depo === 0 ? "b" : malzeme.depo === 1 ? "y" : "m";
      setSelectedRadioBValue(depoValue);
      const selectedMevziFromMalzeme = mevziler.find(
        (mevzi) => mevzi.id === malzeme.mevzi_id
      );
      setSelectedMevzi(selectedMevziFromMalzeme || null);
      if (malzeme.giris_tarihi) {
        setGirisTarihi(new Date(malzeme.giris_tarihi));
      }
    }
  }, [malzeme, mevziler]);

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
                  setMalzemeInfo({ ...malzemeInfo, name: e.target.value });
                }}
                margin="normal"
              />

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

              <CustomTextField
                autoComplete="off"
                label="Seri Numara"
                required
                fullWidth
                type="number"
                inputProps={{ step: "1" }}
                variant="filled"
                value={malzemeInfo?.seri_num}
                onChange={(e) => {
                  setMalzemeInfo({ ...malzemeInfo, seri_num: e.target.value });
                }}
                margin="normal"
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
                  setMalzemeInfo({
                    ...malzemeInfo,
                    description: e.target.value,
                  });
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
                  placeholder="Model"
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
                      (model) => model.id === malzemeInfo?.mmodel_id
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
              className="malzeme-add-to-the-right"
              style={{ width: malzeme ? "27vw" : "40vw", marginTop: "23px" }}
            >
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

              <LocalizationProvider
                className="malzeme-add-calender"
                style={{ marginTop: "30px" }}
                dateAdapter={AdapterDayjs}
                adapterLocale="tr"
              >
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
              </LocalizationProvider>

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
                </LocalizationProvider>

                <Tooltip title="Arıza Kaydı Ekle" placement="right">
                  <IconButton
                    onClick={() => handleArizaDateChange(newChosenDate)}
                  >
                    <AddCircleIcon
                      style={{ color: "white", marginLeft: "8px" }}
                    />
                  </IconButton>
                </Tooltip>
              </div>

              <div>
                {malzemeInfo.arizalar && malzemeInfo.arizalar.length > 0 && (
                  <ul>
                    {malzemeInfo.arizalar.map((ariza, index) => (
                      <li key={index}>
                        {dayjs(ariza).locale("tr").format("DD/MM/YYYY")}
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
                  marginTop: "20px",
                }}
              >
                <LocalizationProvider
                  className="malzeme-add-calender"
                  dateAdapter={AdapterDayjs}
                  adapterLocale="tr"
                >
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
                </LocalizationProvider>

                {/* <CustomOutlinedButton variant="outlined" onClick={() => handleOnarimDateChange(newChosenDate)}>
                                Onarım Kaydı Ekle
                            </CustomOutlinedButton> */}

                <Tooltip title="Onarım Kaydı Ekle" placement="right">
                  <IconButton
                    onClick={() => handleOnarimDateChange(newChosenDate2)}
                  >
                    <AddCircleIcon
                      style={{ color: "white", marginLeft: "8px" }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div>
                {malzemeInfo.onarimlar && malzemeInfo.onarimlar.length > 0 && (
                  <ul>
                    {malzemeInfo.onarimlar.map((onarim, index) => (
                      <li key={index}>
                        {dayjs(onarim).locale("tr").format("DD/MM/YYYY")}
                        <Tooltip title="Kaldır">
                          <IconButton
                            onClick={() => handleDeleteOnarim(index)}
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
                  marginTop: "20px",
                }}
              >
                <LocalizationProvider
                  className="malzeme-add-calender"
                  dateAdapter={AdapterDayjs}
                  adapterLocale="tr"
                >
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
                </LocalizationProvider>

                {/* <CustomOutlinedButton variant="outlined" onClick={() => handleBakimDateChange(newChosenDate)}>
                                Bakım Kaydı Ekle
                            </CustomOutlinedButton> */}

                <Tooltip title="Bakım Kaydı Ekle" placement="right">
                  <IconButton
                    onClick={() => handleBakimDateChange(newChosenDate3)}
                  >
                    <AddCircleIcon
                      style={{ color: "white", marginLeft: "8px" }}
                    />
                  </IconButton>
                </Tooltip>
              </div>

              <div>
                {malzemeInfo.bakimlar && malzemeInfo.bakimlar.length > 0 && (
                  <ul>
                    {malzemeInfo.bakimlar.map((bakim, index) => (
                      <li key={index}>
                        {dayjs(bakim).locale("tr").format("DD/MM/YYYY")}
                        <Tooltip title="Kaldır">
                          <IconButton
                            onClick={() => handleDeleteBakim(index)}
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
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <CustomOutlinedButton variant="outlined" type="submit">
              {malzeme ? "Güncelle" : "Kaydet"}
            </CustomOutlinedButton>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default MalzemeAdd;
