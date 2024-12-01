import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,

} from "@mui/material";
import { grey } from "@mui/material/colors";

const Brand = ({ name, value, onChange }) => {
  const [fillBrand, setFillBrand] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("brand");
        setFillBrand(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  // Nhóm các danh mục theo chữ cái đầu tiên của tên
  const groupedTrade = fillBrand.reduce(
    (acc, brand) => {
      if (brand.name === "No brand") {
        acc.noBrand.push(brand); // Đưa "No brand" vào riêng
      } else {
        const firstLetter = brand.name.charAt(0).toUpperCase(); // Lấy chữ cái đầu
        const checkLetter = /[A-Z]/.test(firstLetter) ? firstLetter : "#"; // Kiểm tra chữ cái đầu
        if (!acc.grouped[checkLetter]) {
          acc.grouped[checkLetter] = []; // Tạo mảng rỗng cho từng chữ cái
        }
        acc.grouped[checkLetter].push(brand);
      }
      return acc;
    },
    { noBrand: [], grouped: {} } // Khởi tạo 2 mảng: "No brand" và nhóm chữ cái
  );

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-select-small-label">Thương hiệu</InputLabel>
        <Select
          name={name}
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          label="Thương hiệu"
          onChange={onChange}
        >
          {/* Hiển thị No brand trước */}
          {groupedTrade.noBrand.map((fill) => (
            <MenuItem key={fill.id} value={fill.id}>
              {fill.name}
            </MenuItem>
          ))}

          {/* Hiển thị các mục được nhóm theo chữ cái */}
          {Object.keys(groupedTrade.grouped).map((letter) => [
            <ListSubheader key={letter}>
              {letter === "#" ? "Khác" : letter}
            </ListSubheader>,
            groupedTrade.grouped[letter].map((fill) => (
              <MenuItem key={fill.id} value={fill.id}>
                {fill.name}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>
    </>
  );
};

export default Brand;
