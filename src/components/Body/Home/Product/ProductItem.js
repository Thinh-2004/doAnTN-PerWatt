import React, { useEffect, useState, useMemo } from "react";
import "./ProductItemStyle.css";
import axios from "../../../../Localhost/Custumize-axios";
import { trefoil } from "ldrs";
import useDebounce from "../../../../CustumHook/useDebounce";
import { Pagination } from "@mui/material";
import SkeletonLoad from "../../../../Skeleton/SkeletonLoad";
// import SkeletonLoad from "./SkeletonLoad";
import ListItem from "./ListItem";

trefoil.register();

const Product = ({ item, idCate, handleReset }) => {
  const [fillAllProduct, setFillAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const debouncedItem = useDebounce(item);
  const debouncedIdCate = useDebounce(idCate);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1); //Trang hiện tại
  const itemInPage = 20;

  //Lọc
  const filterBySearchAndCategory = useMemo(() => {
    return fillAllProduct.filter((product) => {
      const matchesSearch = debouncedItem
        ? product.name.toLowerCase().includes(debouncedItem.toLowerCase())
        : true;
      const matchesCategory = debouncedIdCate
        ? product.productcategory.id === debouncedIdCate
        : true;
      const matchesCategoryName = debouncedItem
        ? product.productcategory.name
            .toLowerCase()
            .includes(debouncedItem.toLowerCase())
        : true;

      const matchesTrademark = debouncedItem
        ? product.trademark.name
            .toLowerCase()
            .includes(debouncedItem.toLowerCase())
        : true;
      return (
        (matchesSearch || matchesCategoryName || matchesTrademark) &&
        matchesCategory
      );
    });
  }, [debouncedItem, debouncedIdCate, fillAllProduct]);

  //Tính toán
  const lastIndex = currentPage * itemInPage; // đi đến trang típ theo
  const firstIndex = lastIndex - itemInPage; //Trở về trang (Ví dụ: 40 - 20)
  const records = filterBySearchAndCategory.slice(firstIndex, lastIndex); //cắt danh sách fill sp cần show
  const pageCount = Math.ceil(filterBySearchAndCategory.length / itemInPage); //ceil để làm tròn số số trang

  const loadData = async () => {
    try {
      const res = await axios.get("pageHome");

      // Duyệt qua từng sản phẩm để lấy chi tiết sản phẩm và lưu vào productDetails
      const dataWithDetails = await Promise.all(
        res.data.map(async (product) => {
          const resDetail = await axios.get(`/detailProduct/${product.id}`);

          // Duyệt qua từng chi tiết sản phẩm để lấy số lượng đã bán
          const countOrderBy = await Promise.all(
            resDetail.data.map(async (detail) => {
              const res = await axios.get(`countOrderSuccess/${detail.id}`);
              return res.data; // Trả về số lượng đã bán cho chi tiết sản phẩm
            })
          );

          // Tính tổng số lượng sản phẩm đã bán cho tất cả chi tiết sản phẩm
          const countQuantityOrderBy = countOrderBy.reduce(
            (acc, quantity) => acc + quantity,
            0
          );

          return {
            ...product,
            productDetails: resDetail.data,
            countQuantityOrderBy, // lưu tổng số lượng đã bán
          };
        })
      );

      setFillAllProduct(dataWithDetails);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedItem, debouncedIdCate, lastIndex, firstIndex]);

  // Sự kiện đặt lại giá trị cho số trang
  const handlePageChange = (e, value) => {
    setCurrentPage(value);
    console.log(value);
  };

  return (
    <>
      {debouncedItem || debouncedIdCate ? (
        <div
          onClick={handleReset}
          className="text-primary"
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-box-seam"></i> Hiển thị tất cả sản phẩm
        </div>
      ) : null}
      {loading || isFiltering ? (
        <SkeletonLoad />
      ) : filterBySearchAndCategory.length === 0 ? (
        <div className="text-center">
          <h4>
            <i
              className="bi bi-file-earmark-x"
              style={{ fontSize: "100px" }}
            ></i>
          </h4>
          <label className="fs-4">Thông tin bạn tìm không tồn tại</label>
        </div>
      ) : (
        <ListItem data={records} />
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

export default Product;
