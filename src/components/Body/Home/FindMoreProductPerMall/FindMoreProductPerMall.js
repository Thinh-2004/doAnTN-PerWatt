import React, { useCallback, useEffect, useState } from "react";
import Header from "../../../Header/Header";
import ToolBar from "./ToolBar/ToolBar";
import axios from "../../../../Localhost/Custumize-axios";
import SkeletonLoad from "../../../../Skeleton/SkeletonLoad";
import { Box, Container, Pagination } from "@mui/material";
import useDebounce from "../../../../CustumHook/useDebounce";
import Footer from "../../../../components/Footer/Footer";
import "./FindMoreProductPerMallStyle.css";
import ListItemProduct from "../../../ListItemProduct/ListItemProduct";

const FindMoreProductPerMall = () => {
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [search, setSearch] = useState("");
  const [isResetSearch, setIsResetSearch] = useState(false);
  const debouncedItem = useDebounce(search, 500);
  const [sortOption, setSortOption] = useState(""); // Trạng thái cho sắp xếp
  const [isAscending, setIsAscending] = useState(true); // Trạng thái tăng/giảm giá
  const [isSortOption, setIsSortOption] = useState(true); //Trạng thái sắp xếp cũ nhất mới nhất

  const loadData = async (pageNo, pageSize, keyWord, sortBy) => {
    setFill([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `findMore/productPerMall/list?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keyWord=${keyWord || ""}&sortBy=${sortBy || ""}`
      );
      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPage);

      setFill(res.data.products);
      // console.log(res.data.products);
    } catch (error) {
      console.error(error);
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedItem || sortOption) {
      loadData(0, 20, debouncedItem, sortOption);
    } else {
      loadData();
    }
  }, [debouncedItem, sortOption]);

  //Hàm xử lí khi nhấn nút sắp xếp cũ hoặc mới nhất
  const handleSortOption = (value) => {
    // console.log(value);
    if (value === "oldItems" || value === "newItems" || debouncedItem) {
      loadData(0, 20, debouncedItem, value);
      setSortOption(value);
      setIsSortOption(!isSortOption);
      setIsAscending(false);
    } else if (
      (value === "priceASC") | (value === "priceDESC") ||
      debouncedItem
    ) {
      loadData(0, 20, debouncedItem, value);
      setSortOption(value);
      setIsAscending(!isAscending);
      setIsSortOption(false);
    } else if (value === "bestSeller" || debouncedItem) {
      setSortOption(value);
      loadData(0, 20, debouncedItem, value);
      setIsSortOption(false); //Đặt lại giá trị cho sắp xếp cũ mới
      setIsAscending(false); // Đặt lại giá trị cho sắp xếp theo giá
    }
  };

  // Sự kiện đặt lại giá trị cho số trang
  const handlePageChange = async (e, value) => {
    setLoading(true);
    try {
      if (debouncedItem || sortOption) {
        await loadData(value - 1, 20, debouncedItem, sortOption);
      } else {
        await loadData(value - 1, 20);
      }
      setCurrentPage(value);
    } finally {
      setLoading(false);
    }

    // console.log(value);
  };

  const handleTakeTextSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleShowMore = () => {
    setSearch("");
    setIsResetSearch(true);

    loadData();
    setIsResetSearch(false);
  };

  return (
    <>
      <Header
        contextSearch={handleTakeTextSearch}
        resetSearch={isResetSearch}
      />
      <Container className="mt-3" maxWidth="xl">
        <div className="d-flex justify-content-between">
          <ToolBar
            isAscending={isAscending}
            isSortOption={isSortOption}
            valueSort={handleSortOption}
          />
          <span className="align-content-center fst-italic fs-5">
            Gợi ý sản phẩm hôm nay cho bạn
          </span>
        </div>
        <hr />
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="mt-3 mb-3 d-flex justify-content-start">
              {debouncedItem && (
                <Box
                  id="default"
                  className="fill-all btn-fill text-center"
                  onClick={handleShowMore}
                  sx={{ background: "background.default" }}
                >
                  <svg>
                    <rect x="0" y="0" fill="none" width="100%" height="100%" />
                  </svg>
                  <i className="bi bi-box-seam"></i> Hiển thị tất cả
                </Box>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="mt-3 mb-3 d-flex justify-content-end">
              <Pagination
                count={totalPage}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                color="primary"
              />
            </div>
          </div>
        </div>
        {loading ? (
          <SkeletonLoad />
        ) : fill.length === 0 && debouncedItem !== "" ? (
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
          <div className="row d-flex justify-content-center">
            <ListItemProduct
              data={fill}
              classNameCol={"col-lg-2 col-md-3 col-sm-3"}
            />
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
      </Container>
      <Footer />
    </>
  );
};

export default FindMoreProductPerMall;
