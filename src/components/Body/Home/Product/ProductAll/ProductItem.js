import React, { useEffect, useState } from "react";
import "../../../../ListItemProduct/ProductItemStyle.css";
import axios from "../../../../../Localhost/Custumize-axios";
import { trefoil } from "ldrs";
import useDebounce from "../../../../../CustumHook/useDebounce";
import { Box, Pagination } from "@mui/material";
import SkeletonLoad from "../../../../../Skeleton/SkeletonLoad";
import ListItemProduct from "../../../../ListItemProduct/ListItemProduct";

trefoil.register();

const Product = ({ item, idCate, handleReset }) => {
  const [fillAllProduct, setFillAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedItem = useDebounce(item, 500);
  // console.log(debouncedItem);
  const debouncedIdCate = useDebounce(idCate, 500);

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
      setFillAllProduct(res.data.products);
      // console.log(res.data.products);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    
    loadData(0, 20, debouncedItem ? debouncedItem : debouncedIdCate);
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

  //Cuộn thanh cuộn xuống nơi chỉ định
  useEffect(() => {
    if (debouncedItem !== "") {
      window.scrollTo({ top: 2300, behavior: "smooth" });
    }
  }, [debouncedItem]);

  const handleScrollToCategory = () => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <>
      {debouncedItem || debouncedIdCate ? (
        <div className="d-flex">
          <Box
            id="default"
            sx={{ background: "background.default" }}
            className="fill-all btn-fill text-center me-2"
            onClick={handleReset}
          >
            <svg>
              <rect x="0" y="0" fill="none" width="100%" height="100%" />
            </svg>
            <i className="bi bi-box-seam"></i> Hiển thị tất cả
          </Box>
          <Box
            id="default-btn-scroll"
            sx={{ background: "background.default" }}
            className="scroll-web btn-scroll text-center"
            onClick={handleScrollToCategory}
          >
            <svg>
              <rect x="0" y="0" fill="none" width="100%" height="100%" />
            </svg>
            <i className="bi bi-bookmarks-fill"></i> Tìm theo danh mục
          </Box>
        </div>
      ) : null}
      {loading ? (
        <SkeletonLoad />
      ) : fillAllProduct.length === 0 && (item !== "" || idCate !== "") ? (
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
        <ListItemProduct
          data={fillAllProduct}
          classNameCol={"col-lg-2 col-md-3 col-sm-4"}
        />
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
