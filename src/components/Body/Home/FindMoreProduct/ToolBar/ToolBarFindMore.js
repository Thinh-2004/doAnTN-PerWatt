import React, { useCallback, useEffect, useState } from "react";

import axios, { APITinhThanh } from "../../../../../Localhost/Custumize-axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import Search from "./Search/Search";
import FilterCheckBox from "./FilterCheckBox/FilterCheckBoxAddress";
import FilterCheckBoxTradeMark from "./FilterCheckBox/FilterCheckBoxTradeMark";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import FilterPriceRange from "./FilterPrice/FilterPriceRange";
import FilterCheckBoxShop from "./FilterCheckBox/FilterCheckBoxShop";

const ToolBarFindMore = ({
  //Dữ liệu từ con lên cha
  onClearFilters,
  text,
  address,
  trademark,
  valueMinMax,
  idShopType,
}) => {
  const nameBrandUrl = useParams();
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tradeMark, setTradeMark] = useState([]);
  const [isHiddenComponentTradeMark, setIsHiddenComponentTradeMark] =
    useState(false); //State ẩn hiện components

  const load = async () => {
    try {
      setLoading(true);
      const res = await APITinhThanh.get(`/api/p`);
      setProvinces(res.data);
      const resTradeMark = await axios.get("brand");
      setTradeMark(resTradeMark.data);
      setLoading(false);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tradeMark.length > 0 && nameBrandUrl.name) {
      //check name url and array trademark
      const isSame = tradeMark.some(
        (brand) =>
          brand.name.toLowerCase() === nameBrandUrl.name.toLocaleLowerCase()
      ); //retutn true if same
      setIsHiddenComponentTradeMark(isSame);
    }
  }, [tradeMark, nameBrandUrl.name]);

  useEffect(() => {
    load();

    // Khôi phục giá trị tìm kiếm từ localStorage
    const savedSearch = localStorage.getItem("searchText");
    if (savedSearch) {
      text(savedSearch); // Gửi giá trị tìm kiếm lên component cha
    }

    // Khôi phục địa chỉ đã chọn từ localStorage
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);
      address(parsedAddress); // Gửi dữ liệu địa chỉ lên component cha
    }

    // Khôi phục thương hiệu đã chọn từ localStorage
    const savedTradeMark = localStorage.getItem("selectedTradeMark");
    if (savedTradeMark) {
      const parsedTradeMark = JSON.parse(savedTradeMark);
      trademark(parsedTradeMark); // Gửi dữ liệu thương hiệu lên component cha
    }
  }, [address, text, trademark]);

  const handleTextSearch = useCallback(
    (value) => {
      text(value);

      setTimeout(() => {
        // Lưu giá trị tìm kiếm vào localStorage
        localStorage.setItem("searchText", value);
      }, 1000);
    },
    [text]
  );

  const dataNameAddress = useCallback(
    (data) => {
      address(data);
    },
    [address]
  );

  const dataNameTradeMark = useCallback(
    (data) => {
      trademark(data);
    },
    [trademark]
  );

  const dataIdShopType = useCallback(
    (data) => {
      idShopType(data);
    },
    [idShopType]
  );

  //Hàm xử lí xóa localStogare
  const [isRemoveStorage, setIsRemoveStorage] = useState(false);
  const removeLocalStorage = () => {
    setIsRemoveStorage(true); // thực hiện xóa các checkbox của component con
    onClearFilters(true);
  };

  useEffect(() => {
    // Đặt lại giá trị của isRemoveStorage và onClearFilters
    setTimeout(() => {
      setIsRemoveStorage(false);
      onClearFilters(false);
    }, 500);
  }, [isRemoveStorage, onClearFilters]);

  //Hàm xử lí truyền dữ liệu valuePriceMinMax
  const valueMinMaxPrice = useCallback(
    (value) => {
      valueMinMax(value);
      // console.log(value);
    },
    [valueMinMax]
  );

  return (
    <Box
      sx={{ backgroundColor: "backgroundElement.children" }}
      className="rounded-2"
    >
      <div className="m-3">
        <div>
          <Search valueText={handleTextSearch} />
        </div>
        <div className="mt-3 mb-3 d-flex justify-content-between">
          <div className="align-content-center">
            <FilterAltIcon />
            <strong className="text-uppercase mx-3">
              Bộ lọc sản phẩm cần tìm
            </strong>
          </div>
          <div>
            <Button
              variant="outlined"
              color="error"
              onClick={removeLocalStorage}
              sx={{
                width: 130,
                height: 30,
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
        <hr className="" />
        <span className="">Lọc theo khoảng giá</span>
        <div className="d-flex justify-content-center">
          <FilterPriceRange
            valueMinMaxPrice={valueMinMaxPrice}
            isRemoveStorage={isRemoveStorage}
          />
        </div>
        <hr />
        {loading ? (
          <div className="text-center">
            <label htmlFor="">Đang tải...</label>
          </div>
        ) : (
          <>
            <span className="">Địa chỉ cửa hàng</span>
            <FilterCheckBox
              data={provinces}
              nameAdress={dataNameAddress}
              isRemoveStorage={isRemoveStorage}
            />
          </>
        )}
        <hr />
        {loading ? (
          <div className="text-center">
            <label htmlFor="">Đang tải...</label>
          </div>
        ) : (
          !isHiddenComponentTradeMark && ( // chỉ hiển thị khi không trùng tên
            <>
              <span className="">Thương hiệu sản phẩm</span>
              <FilterCheckBoxTradeMark
                dataTradeMark={tradeMark}
                nameTradeMark={dataNameTradeMark}
                isRemoveStorage={isRemoveStorage}
              />
              <hr />
            </>
          )
        )}

        <span>Loại shop</span>
        <FilterCheckBoxShop
          idShopType={dataIdShopType}
          isRemoveStorage={isRemoveStorage}
        />
      </div>
    </Box>
  );
};

export default ToolBarFindMore;
