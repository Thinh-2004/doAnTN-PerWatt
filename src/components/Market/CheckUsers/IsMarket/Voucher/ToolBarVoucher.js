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
import { Link } from "react-router-dom";

const ToolBarVoucher = ({ textSearch, radioCheckItem }) => {
  //State search
  const [search, setSearch] = useState("");
  //State radio
  const [checkRadio, setCheckRadio] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    textSearch(value);
    // console.log(value);
  };

  const handleCheckRadio = (e) => {
    const value = e.target.value;
    setCheckRadio(value);
    radioCheckItem(value);
    // console.log(value);
  };

  const handleRemoveCheck = () => {
    setCheckRadio("");
    radioCheckItem("");
  }

  return (
    <div className="row">
      <div className="col-lg-4 col-md-4 col-sm-4 align-content-center">
        <TextField
          id="outlined-search"
          label="Tìm kiếm"
          type="search"
          size="small"
          fullWidth
          value={search}
          onChange={handleSearch}
          placeholder="Tìm theo tên voucher, tên sản phẩm"
        />
      </div>
      <div className="col-lg-5 col-md-4 col-sm-4">
        <FormControl fullWidth>
          <div className="d-flex justify-content-between">
            <FormLabel id="demo-row-radio-buttons-group-label">
              Trạng thái
            </FormLabel>
            <Button size="small" color="error" variant="outlined" disabled={checkRadio ? false : true} onClick={handleRemoveCheck}>
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
              value="Hoạt động"
              control={<Radio size="small" />}
              label="Hoạt động"
            />
            <FormControlLabel
              value="Chờ hoạt động"
              control={<Radio size="small" />}
              label="Chờ hoạt động"
            />
            <FormControlLabel
              value="Ngừng hoạt động"
              control={<Radio size="small" />}
              label="Ngừng hoạt động"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="col-lg-3 col-md-4 col-sm-4 align-content-center">
        <div className="d-flex justify-content-end">
          <button className="btn" id="btn-add" style={{ width: "100%" }}>
            <Link
              to={"/profileMarket/addVoucher"}
              style={{ color: "rgb(45, 91, 0)" }}
            >
              Thêm voucher
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBarVoucher;
