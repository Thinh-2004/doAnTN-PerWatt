import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import useDebounce from "../../../../../../CustumHook/useDebounce";

const FilterCheckBox = ({
  // Data địa chỉ
  data,
  nameAdress, // truyền name đã chọn lên component cha
  isRemoveStorage, //Xóa các checkbox
}) => {
  // Khởi tạo trạng thái từ localStorage nếu có, ngược lại là mảng rỗng
  const [checkAddress, setCheckAddress] = useState(() => {
    const saved = localStorage.getItem("selectedAddress");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  // Hàm xử lý khi checkbox thay đổi
  const handleCheckBoxChange = (name) => {
    setCheckAddress((prev) => {
      let updated;
      if (prev.includes(name)) {
        updated = prev.filter((item) => item !== name);
      } else {
        updated = [...prev, name];
      }
      nameAdress(updated); // Truyền danh sách đã cập nhật lên cha
      // Lưu vào localStorage
      localStorage.setItem("selectedAddress", JSON.stringify(updated));
      return updated;
    });
  };

  // Sắp xếp dữ liệu để các mục đã chọn nằm ở đầu và lọc theo tìm kiếm
  const sortedData = useMemo(() => {
    const selectedItems = data.filter((item) =>
      checkAddress.includes(item.name)
    );
    const unselectedItems = data.filter(
      (item) => !checkAddress.includes(item.name)
    );

    // Lọc dữ liệu theo tên tỉnh/thành
    const filteredItems = [...selectedItems, ...unselectedItems].filter(
      (item) => item.name.toLowerCase().includes(debounceSearch.toLowerCase())
    );

    return filteredItems;
  }, [data, checkAddress, debounceSearch]);

  useEffect(() => {
    if (isRemoveStorage) {
      setCheckAddress([]);
    }
  }, [isRemoveStorage]);

  //Hàm xử lí tìm tỉnh thành
  const handleTextSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      {/* Checkbox theo địa chỉ */}

      <TextField
        id="outlined-search"
        className="mt-3 mb-3"
        label="Tỉnh/Thành"
        type="search"
        fullWidth
        size="small"
        placeholder="Nhập tỉnh/thành cần tìm"
        value={search}
        onChange={handleTextSearch}
      />
      <Box
        sx={{
          maxHeight: 370, // Độ cao tối đa cho Box
          overflowY: "auto", // Cho phép thanh cuộn dọc
        }}
      >
        {sortedData.length === 0 ? (
          <div className="text-center">
            <label htmlFor="">Tỉnh/thành không tồn tại.</label>
          </div>
        ) : (
          sortedData.map((fill) => (
            <FormGroup key={fill.id}>
              <FormControlLabel
                key={fill.id}
                control={
                  <Checkbox
                    key={fill.code}
                    size="small"
                    checked={checkAddress.includes(fill.name)}
                    onChange={() => handleCheckBoxChange(fill.name)}
                  />
                }
                label={fill.name}
              />
            </FormGroup>
          ))
        )}
      </Box>
    </>
  );
};

export default FilterCheckBox;
