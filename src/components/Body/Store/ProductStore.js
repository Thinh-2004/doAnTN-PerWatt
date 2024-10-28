import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import useDebounce from "../../../CustumHook/useDebounce";
import "./StoreStyle.css";
import { Box, Pagination } from "@mui/material";

import SkeletonLoad from "../../../Skeleton/SkeletonLoad";
import ListProductStore from "./ListProductStore";
import ToolBarHomeStore from "./ToolBarHomeStore";

const ProductStore = ({ item, idCate, resetSearch }) => {
  const { slugStore } = useParams();
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(true); //Load data, skelenton
  //Debounce
  const debouncedItem = useDebounce(item);
  const debouncedIdCate = useDebounce(idCate);
  const [sortOption, setSortOption] = useState(""); // Trạng thái cho sắp xếp
  const [isAscending, setIsAscending] = useState(true); // Trạng thái tăng/giảm giá
  const [isSortOption, setIsSortOption] = useState(true); //Trạng thái sắp xếp cũ nhất mới nhất

  // Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(0); //Tổng số trang

  const loadData = async (pageNo, pageSize, keyWord, sortBy) => {
    setFill([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/productStore/${slugStore}?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keyWord=${keyWord || ""}&sortBy=${sortBy || ""}`
      );
      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPage);
      //Duyệt qua từng sản phẩm để lấy chi tiết sản phẩm
      const dataWithDetails = await Promise.all(
        res.data.products.map(async (push) => {
          const resDetail = await axios.get(`/detailProduct/${push.id}`);

          //Duyệt qua từng chi tiết sản phẩm để lấy số lượng đã bán
          const countOrderBy = await Promise.all(
            resDetail.data.map(async (detail) => {
              const res = await axios.get(`countOrderSuccess/${detail.id}`);
              return res.data;
            })
          );

          //Tính tổng số lượng sản phẩm đã bán cho tất cả chi tiết
          const countQuantityOrderBy = countOrderBy.reduce(
            (count, quantity) => count + quantity,
            0
          );
          return {
            ...push,
            productDetails: resDetail.data,
            countQuantityOrderBy, //Lưu tổng số lượng đã bán
          };
        })
      );
      setFill(dataWithDetails);
      // console.log(dataWithDetails);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    const loadingData = async () => {
      setLoading(true);
      try {
        if (debouncedItem || sortOption) {
          await loadData(0, 20, debouncedItem, sortOption);
        } else if (debouncedIdCate || sortOption) {
          await loadData(0, 20, debouncedIdCate, sortOption);
        } else {
          await loadData();
        }
      } finally {
        setLoading(false);
      }
    };
    loadingData();
  }, [slugStore, debouncedIdCate, debouncedItem, sortOption]);

  //Hàm xử lí khi nhấn nút sắp xếp cũ hoặc mới nhất
  const handleSortOption = (value) => {
    // console.log(value);
    if ((value === "oldItems") | (value === "newItems")) {
      loadData(0, 20, "", value);
      setSortOption(value);
      setIsSortOption(!isSortOption);
      setIsAscending(false);
    } else if ((value === "priceASC") | (value === "priceDESC")) {
      loadData(0, 20, "", value);
      setSortOption(value);
      setIsAscending(!isAscending);
      setIsSortOption(false);
    } else if (value === "bestSeller") {
      setSortOption(value);
      loadData(0, 20, "", value);
      setIsSortOption(false); //Đặt lại giá trị cho sắp xếp cũ mới
      setIsAscending(false); // Đặt lại giá trị cho sắp xếp theo giá
    }
  };

  // Sự kiện đặt lại giá trị cho số trang
  const handlePageChange = async (e, value) => {
    setLoading(true);
    try {
      if (sortOption || item) {
        await loadData(value - 1, 20, item, sortOption);
      } else {
        await loadData(value - 1, 20);
      }
      setCurrentPage(value);
    } finally {
      setLoading(false);
    }

    // console.log(value);
  };
  const handleResetSearch = () => {
    resetSearch(true);

    const timer = setTimeout(() => {
      resetSearch(false);
    }, 10);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-6">
          <ToolBarHomeStore
            isAscending={isAscending}
            // handleSortByPrice={handleSortByPrice}
            valueSort={handleSortOption}
            // handleSortBestSeller={handleSortBestSeller}
            isSortOption={isSortOption}
          />
          {debouncedItem || debouncedIdCate ? (
            <div className="mt-2">
              <Box
                id="default"
                className="fill-all btn-fill mt-3 text-center"
                onClick={handleResetSearch}
                sx={{background : "background.default"}}
              >
                <svg>
                  <rect x="0" y="0" fill="none" width="100%" height="100%" />
                </svg>
                <i className="bi bi-box-seam"></i> Hiển thị tất cả
              </Box>
            </div>
          ) : null}
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-end mt-1">
          <Pagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
          />
        </div>
      </div>
      {loading ? (
        <div className="row">
          <SkeletonLoad />
        </div>
      ) : fill.length === 0 && debouncedItem !== "" ? (
        <>
          <div className="d-flex justify-content-center">
            <i
              className="bi bi-file-earmark-image-fill"
              style={{ fontSize: "100px" }}
            ></i>
          </div>
          <label className="d-flex justify-content-center fs-5 mb-3">
            Shop không có nội dung bạn cần tìm
          </label>
          <div className="d-flex justify-content-center  mb-5">
            <Link className="btn" id="btn-comback-home" to={"/"}>
              Quay về trang chủ để tìm kiếm trên sàn PerWatt
            </Link>
          </div>
        </>
      ) : (
        <div className="row mb-5">
          <ListProductStore data={fill} />
        </div>
      )}
      <div className="mt-3 mb-3 d-flex justify-content-center">
        <Pagination
          count={totalPage}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
        />
      </div>
    </>
  );
};

export default ProductStore;
