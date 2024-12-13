import React, { useEffect, useState } from "react";
import { APITinhThanh } from "../../Localhost/Custumize-axios";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";

const FormSelectAdress = ({ apiAddress, resetForm, editFormAddress }) => {
  //API tỉnh thành
  const [provinces, setProvinces] = useState([]); // State tỉnh
  const [districts, setDistricts] = useState([]); //State quận
  const [wards, setWards] = useState([]); // State phường/xã

  //State lưu id khi chọn selected
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  //State lưu tên khi được đưa từ data edit
  const [nameProvinces, setNameProvinces] = useState("");
  const [nameDistricts, setNameDistricts] = useState("");
  const [nameWards, setNameWards] = useState("");

  const load = async () => {
    try {
      const resProvinces = await APITinhThanh.get(`api/p/`);
      setProvinces(resProvinces.data);
      // console.log(resProvinces.data);
    } catch (error) {
      console.log(error);
    }
  };

  const result = async () => {
    try {
      const findProvinceName = await APITinhThanh.get(
        `/api/p/${selectedProvince}`
      );
      const findDistrictsName = await APITinhThanh.get(
        `/api/d/${selectedDistrict}`
      );
      const findwardsName = await APITinhThanh.get(
        `/api/w/${selectedWard}`
      );
      //   console.log(
      //     findProvinceName.data.name +
      //       ", " +
      //       findDistrictsName.data.name +
      //       ", " +
      //       findwardsName.data.name
      //   );
      apiAddress(
        findwardsName.data.name +
          ", " +
          findDistrictsName.data.name +
          ", " +
          findProvinceName.data.name
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (
      selectedProvince !== "" &&
      selectedDistrict !== "" &&
      selectedWard !== ""
    ) {
      result();
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  //Reset Form
  useEffect(() => {
    if (resetForm) {
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
      setDistricts([]);
      setWards([]);
      apiAddress("");
    }
  }, [resetForm, apiAddress]);

  useEffect(() => {
    const splitName = editFormAddress?.split(",").map((fill) => fill.trim());
    if (splitName?.length >= 3) {
      setNameWards(splitName[2]);
      setNameDistricts(splitName[3]);
      setNameProvinces(splitName[4]);
      
    }

    const loadEditAddress = async () => {
      try {
        // Gọi API để tìm tên tỉnh thành phố
        const resNameProvince = await APITinhThanh.get(
          `api/p/search/?q=${nameProvinces}`
        );
        const dataProvince = resNameProvince.data;
        console.log(dataProvince);
        // Lấy mã tỉnh thành và set vào selectedProvince để tự động chọn
        const foundProvince = dataProvince.find(
          (province) => province.name === nameProvinces
        );
        if (foundProvince) {
          setSelectedProvince(foundProvince.code);

          const resNameDistricts = await APITinhThanh.get(
            `api/p/${foundProvince.code}?depth=2`
          );
          const dataDistricts = resNameDistricts.data.districts;
          setDistricts(resNameDistricts.data.districts);

          //Lấy mã quận huyện và set vào selectedDistrict để auto chọn
          const foundDistrict = dataDistricts.find(
            (district) => district.name === nameDistricts
          );
          if (foundDistrict) {
            setSelectedDistrict(foundDistrict.code);

            const resNameWards = await APITinhThanh.get(
              `api/d/${foundDistrict.code}?depth=2`
            );
            setWards(resNameWards.data.wards);
            const dataWards = resNameWards.data.wards;

            //Lấy mã phường xã và set vào selecteWard để auto chọn
            const foundWards = dataWards.find(
              (ward) => ward.name === nameWards
            );
            if (foundWards) {
              setSelectedWard(foundWards.code);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };

    loadEditAddress();
  }, [editFormAddress, nameProvinces, nameDistricts, nameWards]);

  //Hàm xử lí khi chọn tỉnh thành
  const handleChangeProvinces = async (e) => {
    const id = e.target.value;
    // console.log(id);
    setSelectedProvince(id);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);

    if (id !== "0" || id !== "") {
      try {
        const res = await APITinhThanh.get(`api/p/${id}?depth=2`);
        setDistricts(res.data.districts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Hàm xử lí khi chọn quận huyện
  const handleChangeDistricts = async (e) => {
    const id = e.target.value;
    setSelectedDistrict(id);
    setSelectedWard("");
    setWards([]);

    if (id !== "0" || id !== "") {
      try {
        const res = await APITinhThanh.get(`api/d/${id}?depth=2`);
        setWards(res.data.wards);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangeWards = async (e) => {
    const id = e.target.value;
    setSelectedWard(id);
  };

  return (
    <Grid container spacing={3}>
      {/* Chọn tỉnh thành */}
      <Grid item xs={12} sm={12}>
        <FormControl fullWidth size="small" sx={{ textAlign: "left" }}>
          <InputLabel id="province-select-label">Tỉnh / Thành</InputLabel>
          <Select
            labelId="province-select-label"
            id="province-select"
            value={selectedProvince}
            onChange={handleChangeProvinces}
            label="Tỉnh / Thành"
          >
            <MenuItem value="">
              <em>Tỉnh / Thành</em>
            </MenuItem>
            {provinces &&
              provinces.map((province) => (
                <MenuItem key={province.code} value={province.code}>
                  {province.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Chọn quận huyện */}
      <Grid item xs={12} sm={12}>
        <FormControl
          fullWidth
          size="small"
          sx={{ textAlign: "left" }}
          disabled={districts?.length === 0 || !districts}
        >
          <InputLabel id="district-select-label">Quận / Huyện</InputLabel>
          <Select
            labelId="district-select-label"
            id="district-select"
            value={selectedDistrict}
            onChange={handleChangeDistricts}
            label="Quận / Huyện"
          >
            <MenuItem value="">
              <em>Quận / Huyện</em>
            </MenuItem>
            {districts &&
              districts.map((district) => (
                <MenuItem key={district.code} value={district.code}>
                  {district.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Chọn phường/xã */}
      <Grid item xs={12} sm={12}>
        <FormControl
          fullWidth
          size="small"
          sx={{ textAlign: "left" }}
          disabled={wards?.length === 0 || !wards}
        >
          <InputLabel id="ward-select-label">Phường / Xã</InputLabel>
          <Select
            labelId="ward-select-label"
            id="ward-select"
            value={selectedWard}
            onChange={handleChangeWards}
            label="Phường / Xã"
          >
            <MenuItem value="">
              <em>Phường / Xã</em>
            </MenuItem>
            {wards &&
              wards.map((ward) => (
                <MenuItem key={ward.code} value={ward.code}>
                  {ward.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FormSelectAdress;