import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import useDebounce from "../../../../../../CustumHook/useDebounce";

const FilterCheckBoxTradeMark = ({
  //Data thương hiệu
  dataTradeMark,
  nameTradeMark, //truyền name đã chọn lên component cha
  isRemoveStorage, //Xóa các checkbox
}) => {
  //Lưu danh sách id tích check
  const [checkTradeMark, setCheckTradeMark] = useState(() => {
    const saved = localStorage.getItem("selectedTradeMark");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  // Hàm xử lý khi checkbox thay đổi
  const handleCheckBoxChange = (name) => {
    setCheckTradeMark((prev) => {
      let updated;
      if (prev.includes(name)) {
        updated = prev.filter((item) => item !== name);
      } else {
        updated = [...prev, name];
      }
      nameTradeMark(updated); // Truyền danh sách đã cập nhật lên cha
      // Lưu vào localStorage
      localStorage.setItem("selectedTradeMark", JSON.stringify(updated));
      return updated;
    });
  };

  // Sắp xếp dữ liệu để các mục đã chọn nằm ở đầu và lọc theo tìm kiếm
  const sortedData = useMemo(() => {
    const selectedItems = dataTradeMark.filter((item) =>
      checkTradeMark.includes(item.name)
    );
    const unselectedItems = dataTradeMark.filter(
      (item) => !checkTradeMark.includes(item.name)
    );

    // Lọc dữ liệu theo tên tỉnh/thành
    const filteredItems = [...selectedItems, ...unselectedItems].filter(
      (item) => item.name.toLowerCase().includes(debounceSearch.toLowerCase())
    );

    return filteredItems;
  }, [dataTradeMark, checkTradeMark, debounceSearch]);

  useEffect(() => {
    if (isRemoveStorage) {
      setCheckTradeMark([]);
    }
  }, [isRemoveStorage]);

  //Hàm xử lí tìm tỉnh thành
  const handleTextSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      {/* checkbox theo thương hiệu  */}

      <TextField
        id="outlined-search"
        className="mt-3 mb-3"
        label="Thương hiệu"
        type="search"
        fullWidth
        size="small"
        placeholder="Nhập tên thương hiệu cần tìm"
        value={search}
        onChange={handleTextSearch}
      />
      <Box
        sx={{
          maxHeight: 370, //Độ dài của thanh cuộn
          overflow: "auto", //Thanh cuộn dọc
        }}
      >
        {sortedData.length === 0 ? (
          <div className="text-center">
            <label htmlFor="">Tên thương hiệu không tồn tại</label>
          </div>
        ) : (
          sortedData.map((fill) => {
            return (
              <FormGroup key={fill.id}>
                <FormControlLabel
                  key={fill.id}
                  control={
                    <Checkbox
                      key={fill.id}
                      size="small"
                      checked={checkTradeMark.includes(fill.name)}
                      onChange={() => handleCheckBoxChange(fill.name)}
                    />
                  }
                  label={fill.name}
                />
              </FormGroup>
            );
          })
        )}
      </Box>
    </>
  );
};

export default FilterCheckBoxTradeMark;
