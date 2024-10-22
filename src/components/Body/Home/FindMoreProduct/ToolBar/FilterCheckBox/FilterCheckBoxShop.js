import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React, { useEffect, useState } from "react";

const FilterCheckBoxShop = ({ idShopType, isRemoveStorage }) => {
  const shopType = [
    { id: "1", name: "PerMall" },
    { id: "2", name: "Shop thường" },
  ];

  const [checkShopType, setCheckShopType] = useState(() => {
    const saved = localStorage.getItem("selectedShopType");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (isRemoveStorage) {
      setCheckShopType([]);
      localStorage.removeItem("selectedShopType"); // Xóa localStorage khi isRemoveStorage = true
    }
  }, [isRemoveStorage]);

  // Hàm xử lý khi checkbox thay đổi
  const handleCheckBoxChange = (id) => {
    setCheckShopType((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }

      // Lưu vào localStorage
      localStorage.setItem("selectedShopType", JSON.stringify(updated));

      // Gọi hàm idShopType sau khi state đã được cập nhật
      idShopType(updated);
      return updated;
    });
  };

  return (
    <FormGroup>
      {shopType.map((fill) => (
        <FormControlLabel
          key={fill.id}
          control={
            <Checkbox
              size="small"
              checked={checkShopType.includes(fill.id)}
              onChange={() => handleCheckBoxChange(fill.id)}
            />
          }
          label={fill.name}
        />
      ))}
    </FormGroup>
  );
};

export default FilterCheckBoxShop;
