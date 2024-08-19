import React, { useEffect, useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";

const Brand = ({name, value, onChange }) => {
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
  const groupedTrade = fillBrand.reduce((acc, brand) => {
    const firstLetter = brand.name.charAt(0).toUpperCase(); //Lấy chữ cái đầu tiền
    const checkLetter = /[A-Z]/.test(firstLetter) ? firstLetter : "#"; //kiểm tra chữ cái đầu trong EN
    if (!acc[checkLetter]) {
      //Kiểm tra tồn tại của mảng
      acc[checkLetter] = []; //Tạo mảng rỗng
    }
    acc[checkLetter].push(brand);
    return acc;
  }, {});
  return (
    <>
      <select
        name={name}
        id=""
        className="form-select"
        value={value}
        onChange={onChange}
      >
        <option value="" selected hidden>
          Vui lòng chọn thương hiệu
        </option>
        <option value="NO">No brand</option>
        {Object.keys(groupedTrade).map((letter) => (
          <optgroup label={letter === "#" ? "# -" : letter + " -"} key={letter}>
            {groupedTrade[letter].map((fill) => (
              <option value={fill.id} key={fill.id}>
                {fill.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </>
  );
};

export default Brand;
