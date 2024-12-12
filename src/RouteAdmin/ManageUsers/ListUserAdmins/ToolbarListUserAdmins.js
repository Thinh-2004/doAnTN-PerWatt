import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "../../../Localhost/Custumize-axios";

import React, { useCallback, useEffect, useState } from "react";
import FormManageAdd from "../FormManage/FormManageAdd";

const ToolbarListUserAdmins = ({
  search,
  setSearch,
  SelectItem,
  isRefeshData,
}) => {
  const [listRolePermission, setListRolePermission] = useState([]);

  const loadData = async () => {
    try {
      const res = await axios.get(`role/permission/list`);
      setListRolePermission(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  //State radio
  const [selectRolePermission, setSelectRolePermission] = useState("");
  const handleSelected = (e) => {
    const value = e.target.value;
    setSelectRolePermission(value);
    SelectItem(value);
    // console.log(value);
  };

  const handleTakeIsRefeshTable = useCallback(
    (value) => {
      isRefeshData(value);
    },
    [isRefeshData]
  );

  return (
    <div className="row m-1">
      <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
        {/* Tìm kiếm */}
        <form autoComplete="off">
          <TextField
            autoComplete="off"
            id="outlined-search"
            label="Tìm kiếm"
            type="search"
            size="small"
            fullWidth
            name="searchProduct"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Nhập tên hoặc email quản trị cần tìm"
          />
        </form>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12 mb-3 ">
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              Tìm kiếm theo vai trò
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectRolePermission}
              label="Tìm kiếm theo vai trò"
              onChange={handleSelected}
            >
              <MenuItem value={""}>Vui lòng chọn</MenuItem>
              {listRolePermission.map((fill) => (
                <MenuItem key={fill.id} value={fill.permission.id}>
                  {fill.permission.name} - ({fill.note})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12 mb-3 align-content-center ">
        <FormManageAdd isRefeshTable={handleTakeIsRefeshTable} />
      </div>
    </div>
  );
};

export default ToolbarListUserAdmins;
