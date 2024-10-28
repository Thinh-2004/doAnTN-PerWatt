import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from "@mui/material";

const Category = ({ name, value, onChange }) => {
  const [fillCate, setFillCate] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("category");
        setFillCate(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  // Nhóm các danh mục theo chữ cái đầu tiên của tên
  const groupedCate = fillCate.reduce(
    (acc, cate) => {
      if (cate.name === "Khác") {
        acc.Khac.push(cate); // Đưa 'Khác' vào riêng
      } else {
        const firstLetter = cate.name.charAt(0).toUpperCase(); // Lấy chữ cái đầu tiên
        const checkLetter = /[A-Z]/.test(firstLetter) ? firstLetter : "#"; // Kiểm tra chữ cái đầu trong A-Z
        if (!acc.grouped[checkLetter]) {
          // Kiểm tra tồn tại của mảng
          acc.grouped[checkLetter] = []; // Tạo mảng rỗng
        }
        acc.grouped[checkLetter].push(cate);
      }

      return acc;
    },
    { Khac: [], grouped: {} }
  );

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="demo-select-small-label">Phân loại</InputLabel>
      <Select
        name={name}
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label="Phân loại"
        onChange={onChange}
      >
        {/* Đưa mục "Khác" lên trước */}
        {groupedCate.Khac.map((fill) => (
          <MenuItem key={fill.id} value={fill.id}>
            {fill.name}
          </MenuItem>
        ))}

        {/*Đưa các mục được nhóm hiển thị*/}
        {Object.keys(groupedCate.grouped).map((fill) => [
          <ListSubheader key={fill}>{fill === "#" ? "#" : fill}</ListSubheader>,
          groupedCate.grouped[fill].map((fillCate) => (
            <MenuItem key={fillCate.id} value={fillCate.id}>
              {fillCate.name}
            </MenuItem>
          )),
        ])}
      </Select>
    </FormControl>
  );
};

export default Category;
