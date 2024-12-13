import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const ToolbarListUsers = ({ search, setSearch, radioCheckItem }) => {
  //State radio
  const [checkRadio, setCheckRadio] = useState("");
  const handleCheckRadio = (e) => {
    const value = e.target.value;
    setCheckRadio(value);
    radioCheckItem(value);
    // console.log(value);
  };

  const handleRemoveCheck = () => {
    setCheckRadio("");
    radioCheckItem("");
  };

  return (
    <div className="row m-1">
      <div className="col-lg-4 col-md-4 col-sm-4 mb-3">
        {/* Tìm kiếm */}
        <form autoComplete="off">
          <TextField
            id="outlined-search"
            name="searchField"
            label="Nhập nội dung cần tìm kiếm (Tên người dùng, Email)"
            type="search"
            size="small"
            fullWidth
            autoComplete="off"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </form>
      </div>
      <div className="col-lg-4 col-md-4 col-sm-4 mb-3 ">
        <FormControl fullWidth>
          <div className="d-flex justify-content-between">
            <FormLabel id="demo-row-radio-buttons-group-label">
              Vai trò
            </FormLabel>
            <Button
              size="small"
              color="error"
              variant="outlined"
              disabled={checkRadio ? false : true}
              onClick={handleRemoveCheck}
            >
              Bỏ chọn
            </Button>
          </div>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            className="d-flex justify-content-center"
            onChange={handleCheckRadio}
            value={checkRadio}
          >
            <FormControlLabel
              value="Seller"
              control={<Radio size="small" />}
              label="Người bán hàng"
            />
            <FormControlLabel
              value="Buyer"
              control={<Radio size="small" />}
              label="Người dùng"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default ToolbarListUsers;
