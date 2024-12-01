import { Box, Slider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../../../../Localhost/Custumize-axios";

const FilterPriceRange = ({ valueMinMaxPrice, isRemoveStorage }) => {
  const name = useParams(); // Lấy tên liên quan trên url
  const [minMax, setMinMax] = useState([]);
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem("sliderMinMax");
    return saved ? JSON.parse(saved) : minMax;
  });

  const minMaxData = async () => {
    const res = await axios.get(`/sidlerMinMax/${name.name}`);
    // console.log(res.data[0]);
    setMinMax(res.data[0]);
  };

  useEffect(() => {
    if (minMax.length > 0) {
      const saved = localStorage.getItem("sliderMinMax");
      setValue(saved ? JSON.parse(saved) : minMax); // Cập nhật lại giá trị sau khi minMax có dữ liệu
    }
  }, [minMax]);

  useEffect(() => {
    if (name) {
      minMaxData();
    }
  }, [name]);

  useEffect(() => {
    if (isRemoveStorage && minMax.length > 0) {
      setValue(minMax); // Đặt lại giá trị value với minMax từ API
      localStorage.removeItem("sliderMinMax"); // Xóa dữ liệu trong localStorage nếu cần
    }
  }, [isRemoveStorage, minMax]); // Theo dõi cả minMax để đảm bảo giá trị được cập nhật từ API

  const handleChange = (event, newValue) => {
    setValue(newValue);
    valueMinMaxPrice(newValue);
    // console.log(newValue);

    // Lưu vào localStorage
    localStorage.setItem("sliderMinMax", JSON.stringify(newValue));
  };

  // Hàm để format số
  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number); // Format theo kiểu số Việt Nam (có dấu phẩy)
  };

  return (
    <>
      <Box sx={{ width: 300 }}>
        {minMax.length > 0 ? (
          <Slider
            getAriaLabel={() => "Lọc theo khoảng giá"}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(x) => `${formatNumber(x)} đ`} // Format lại số có dấu phân cách và đơn vị
            min={minMax[0]}
            max={minMax[1]}
            step={10000}
            color="success"
          />
        ) : (
          <p>Loading...</p> // Hoặc một loader
        )}
      </Box>
    </>
  );
};

export default FilterPriceRange;
