import React, { useEffect, useState } from "react";
import "./ProductItemStyle.css";
import axios from "../../../../../Localhost/Custumize-axios";
import { trefoil } from "ldrs";
import useDebounce from "../../../../../CustumHook/useDebounce";
import { Box, Pagination } from "@mui/material";
import SkeletonLoad from "../../../../../Skeleton/SkeletonLoad";
// import SkeletonLoad from "./SkeletonLoad";
import ListItem from "./ListItem";

trefoil.register();

const Product = ({ item, idCate, handleReset }) => {
  const [fillAllProduct, setFillAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedItem = useDebounce(item, 500);
  // console.log(debouncedItem);
  const debouncedIdCate = useDebounce(idCate);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(0); //Tổng số trang

  const loadData = async (pageNo, pageSize, keyWord) => {
    setFillAllProduct([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/home/product/list?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keyWord=${keyWord || ""}`
      );
      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPages);
      // Duyệt qua từng sản phẩm để lấy chi tiết sản phẩm và lưu vào productDetails
      const dataWithDetails = await Promise.all(
        res.data.products.map(async (push) => {
          const resDetail = await axios.get(`/detailProduct/${push.id}`);

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
            ...push,
            productDetails: resDetail.data,
            countQuantityOrderBy, // lưu tổng số lượng đã bán
          };
        })
      );

      setFillAllProduct(dataWithDetails);
      // console.log(dataWithDetails);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    const loadingData = async () => {
      // setLoading(true);
      try {
        if (debouncedItem) {
          await loadData(0, 20, debouncedItem);
        } else if (debouncedIdCate) {
          await loadData(0, 20, debouncedIdCate);
        } else {
          await loadData();
        }
      } catch {}
    };
    loadingData();
  }, [debouncedItem, debouncedIdCate]);

  // Sự kiện đặt lại giá trị cho số trang
  const handlePageChange = async (e, value) => {
    // setLoading(true);
    try {
      if (debouncedItem) {
        await loadData(value - 1, 20, debouncedItem);
      } else if (debouncedIdCate) {
        await loadData(value - 1, 20, debouncedIdCate);
      } else {
        await loadData(value - 1, 20);
      }
      setCurrentPage(value);
    } catch {
      // setLoading(false);
    }

    // console.log(value);
  };

  return (
    <>
      {debouncedItem || debouncedIdCate ? (
        <div className="">
          <Box id="default" sx={{background : "background.default"}} class="fill-all btn-fill text-center" onClick={handleReset}>
            <svg>
              <rect x="0" y="0" fill="none" width="100%" height="100%" />
            </svg>
            <i className="bi bi-box-seam"></i> Hiển thị tất cả
          </Box>
        </div>
      ) : null}
      {loading ? (
        <SkeletonLoad />
      ) : fillAllProduct.length === 0 && item !== "" ? (
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
        <ListItem data={fillAllProduct} />
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

export default Product;
