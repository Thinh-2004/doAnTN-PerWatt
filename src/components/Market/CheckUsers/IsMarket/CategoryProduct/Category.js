import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";

const Category = ({name, value, onChange }) => {
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
  const groupedCategories = fillCate.reduce((acc, category) => {
    const firstLetter = category.name.charAt(0).toUpperCase();
    const groupKey = /[A-Z]/.test(firstLetter) ? firstLetter : "#";
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(category);
    return acc;
  }, {});

  return (
    <>
      <select
        name={name}
        className="form-select"
        value={value}
        onChange={onChange}
      >
        <option value="" hidden>
          Vui lòng chọn loại sản phẩm
        </option>
        {Object.keys(groupedCategories).map((letter) => (
          <optgroup label={letter === "#" ? "#" : letter + " -"} key={letter}>
            {groupedCategories[letter].map((fill) => (
              <option key={fill.id} value={fill.id}>
                {fill.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </>
  );
};

export default Category;
