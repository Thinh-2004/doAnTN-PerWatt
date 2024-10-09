import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import useDebounce from "../../../CustumHook/useDebounce";
import "./StoreStyle.css";
import { Pagination } from "@mui/material";

import SkeletonLoad from "../../../Skeleton/SkeletonLoad";
import ListProductStore from "./ListProductStore";
import ToolBarHomeStore from "./ToolBarHomeStore";
const ProductStore = ({ item, idCate, resetSearch }) => {
  const { slugStore } = useParams();
  const [fill, setFill] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false); //Skelenton
  const [loading, setLoading] = useState(true); //Load data
  //Debounce
  const debouncedItem = useDebounce(item);
  const debouncedIdCate = useDebounce(idCate);
  const [sortOption, setSortOption] = useState("newOrOldItem"); // Trạng thái cho sắp xếp
  const [isAscending, setIsAscending] = useState(true); // Trạng thái tăng/giảm giá
  const [isSortOption, setIsSortOption] = useState(true); //Trạng thái sắp xếp cũ nhất mới nhất

  const loadData = async () => {
    try {
      const res = await axios.get(`/productStore/${slugStore}`);
      //Duyệt qua từng sản phẩm để lấy chi tiết sản phẩm
      const dataWithDetails = await Promise.all(
        res.data.map(async (product) => {
          const resDetail = await axios.get(`/detailProduct/${product.id}`);

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
            ...product,
            productDetails: resDetail.data,
            countQuantityOrderBy, //Lưu tổng số lượng đã bán
          };
        })
      );
      setFill(dataWithDetails);
      console.log(dataWithDetails);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadData();
  }, [slugStore]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1); // trang hiện tại là 1
  const itemInPage = 20;

  //Lọc sản phẩm
  const filterSearchByText = useMemo(() => {
    return fill.filter((product) => {
      const matchesSearch = debouncedItem
        ? product.name.toLowerCase().includes(debouncedItem.toLowerCase())
        : true;
      const matchesSearchNameCate = debouncedItem
        ? product.productcategory.name
            .toLowerCase()
            .includes(debouncedItem.toLowerCase())
        : true;
      const matchesCategory = debouncedIdCate
        ? product.productcategory.id === debouncedIdCate
        : true;

      const matchesTrademark = debouncedItem
        ? product.trademark.name
            .toLowerCase()
            .includes(debouncedItem.toLowerCase())
        : true;
      return (
        (matchesSearch || matchesSearchNameCate || matchesTrademark) &&
        matchesCategory
      );
    });
  }, [debouncedIdCate, debouncedItem, fill]);

  // Hàm sắp xếp sản phẩm
  const sortedProducts = useMemo(() => {
    const products = [...filterSearchByText];
    if (sortOption === "newOrOldItem") {
      return products.sort((a, b) => {
        return isSortOption ? b.id - a.id : a.id - b.id; //Giảm giần : Tăng dần
      });
    }

    if (sortOption === "price") {
      return products.sort((a, b) => {
        const priceA = Math.min(...a.productDetails.map((p) => p.price));
        const priceB = Math.min(...b.productDetails.map((p) => p.price));
        return isAscending ? priceA - priceB : priceB - priceA;
      });
    }
    return products;
  }, [filterSearchByText, sortOption, isAscending, isSortOption]);

  // Hàm xử lý khi nhấn nút sắp xếp theo giá
  const handleSortByPrice = useCallback(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setSortOption("price");
      setIsAscending(!isAscending); // Đảo ngược trạng thái tăng/giảm giá
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAscending]);

  //Hàm xử lí khi nhấn nút sắp xếp cũ hoặc mới nhất
  const handleSortOption = useCallback(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setSortOption("newOrOldItem");
      setIsSortOption(!isSortOption);
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isSortOption]);

  //Tính toán
  const lastIndex = currentPage * itemInPage; // đi đến trang tiếp theo
  const firstIndex = lastIndex - itemInPage; // Trở về trang (ví dụ 40 -20)
  const records = sortedProducts.slice(firstIndex, lastIndex); //cắt danh sách cần hiển thị
  const pageCount = Math.ceil(filterSearchByText.length / itemInPage); //Ceil làm tròn số trang

  // Sự kiện đặt lại giá trị cho số trang
  const handlePageChange = (e, value) => {
    setCurrentPage(value);
    console.log(value);
  };
  const handleResetSearch = () => {
    resetSearch(true);
  };

  //Skelenton
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedItem, debouncedIdCate, lastIndex, firstIndex]);

  return (
    <>
      {debouncedItem || debouncedIdCate ? (
        <div
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={handleResetSearch}
        >
          <i className="bi bi-box-seam"></i> Hiển thị tất cả sản phẩm của cửa
          hàng
        </div>
      ) : null}
      {loading || isFiltering ? (
        <div className="row">
          <SkeletonLoad />
        </div>
      ) : filterSearchByText.length === 0 ? (
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
          <div className="d-flex justify-content-between">
            <div>
              <ToolBarHomeStore
                isAscending={isAscending}
                handleSortByPrice={handleSortByPrice}
                handleSortOption={handleSortOption}
                isSortOption={isSortOption}
              />
            </div>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
            />
          </div>
          <ListProductStore data={records} />
        </div>
      )}
      <div className="mt-3 mb-3 d-flex justify-content-center">
        <Pagination
          count={pageCount}
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
