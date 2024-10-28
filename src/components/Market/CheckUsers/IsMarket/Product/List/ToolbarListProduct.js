import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import {
  Autocomplete,
  Badge,
  Button,
  darken,
  lighten,
  styled,
  TextField,
} from "@mui/material";
import axios from "../../../../../../Localhost/Custumize-axios";

const ToolbarListPorudct = ({
  search,
  setSearch,
  handleOptionChange,
  idCateOption,
  handleClickFilterSoldOutByQuantity,
  isFilterQuantitySoldOut,
}) => {
  const idStore = localStorage.getItem("idStore");
  const [cateInStore, setCateInStore] = useState([]); //Danh mục trong cửa hàng
  const [countQuantitySoldOut, setCountQuantitySoldOut] = useState(0); // đếm số lượng hết hàng
  const load = async () => {
    //Call API danh mục sản phẩm
    const resCateInStore = await axios.get(`CateProductInStore/${idStore}`);

    const options = resCateInStore.data.map((option) => {
      const firstLetter = option.name[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    });
    //Đếm số lượng === 0
    const countQuantity = await axios.get(`countDetailSoldOut/${idStore}`);

    setCountQuantitySoldOut(countQuantity.data.length);
    setCateInStore(options);
  };

  useEffect(() => {
    load();
  }, []);

  const GroupHeader = styled("div")(({ theme }) => ({
    position: "sticky",
    top: "-8px",
    padding: "4px 10px",
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles("dark", {
      backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
  }));

  const GroupItems = styled("ul")({
    padding: 0,
  });

  return (
    <div className="row m-1">
      <div className="col-lg-6 col-md-6 col-sm-6 mb-3">
        {/* Tìm kiếm */}
        <TextField
          id="outlined-search"
          label="Nhập từ khóa bạn cần tìm kiếm (Tên, Loại, Hãng)."
          type="search"
          size="small"
          fullWidth
          name="searchProduct"
          onChange={(e) => setSearch(e.target.value)} // Update search state on input change
          value={search}
        />
      </div>
      <div className="col-lg-6 col-md-6 col-sm-6 mb-3 ">
        <div className="d-flex justify-content-between">
          {/* Tìm kiếm theo danh mục  */}
          <Autocomplete
            options={cateInStore.sort(
              (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id} // So sánh dựa trên ID
            onChange={handleOptionChange}
            value={
              cateInStore.find((option) => option.id === idCateOption) || null
            } // Đảm bảo giá trị phù hợp
            renderInput={(params) => (
              <TextField {...params} label="Tìm kiếm theo danh mục sản phẩm" />
            )}
            sx={{ width: 390, marginRight : 1 }}
            renderGroup={(params) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>
              </li>
            )}
            size="small"
          />
          {/* Lọc số lượng hết hàng */}
          <Badge badgeContent={countQuantitySoldOut} color="error">
            <Button
              variant="outlined"
              onClick={handleClickFilterSoldOutByQuantity}
              // sx={{ width: 320 }}
            >
              {isFilterQuantitySoldOut ? (
                <>
                  <FilterAltOffIcon />
                  Hiển thị tất cả
                </>
              ) : (
                <>
                  <FilterAltIcon />
                  Lọc sản phẩm hết hàng
                </>
              )}
            </Button>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ToolbarListPorudct;
