import React, { useCallback, useEffect } from "react";
import "./ProductItemPerMallStyle.css";
import ListItemPerMall from "./ListItemPerMall";
import { useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import SkeletonLoad from "../../../../../Skeleton/SkeletonLoad";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

const ProductItemPerMall = () => {
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(false); // state tải trang
  const [currentPage, setCurrentPage] = useState(0); //Sate nhận số trang hiện tại
  const [totalPage, setTotalPage] = useState(0); //State nhận tổng số trang
  const [isNextPage, setIsNextPage] = useState(false); //State animation next
  const [isPrePage, setIsPrePage] = useState(false); //State animation pre

  const loadData = async (pageNo, pageSize) => {
    setFill([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/productPerMall/list?pageNo=${pageNo || ""}&pageSize=${pageSize || ""}`
      );
      setCurrentPage(res.data.currentPage);
      setTotalPage(res.data.totalPage);
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

      setFill(dataWithDetails);
      // console.log(dataWithDetails);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNextPage = useCallback(() => {
    setIsNextPage(true);

    const timer = setTimeout(() => {
      setCurrentPage(currentPage + 1);
      loadData(currentPage + 1, 8);
      setIsNextPage(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const handlePrePage = useCallback(() => {
    setIsPrePage(true);

    const timer = setTimeout(() => {
      setCurrentPage(currentPage - 1);
      loadData(currentPage - 1, 8);
      setIsPrePage(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <>
      <div className="col-lg-4 col-md-4 col-sm-4 mt-2 border-end ">
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner rounded-3">
            <div className="carousel-item active">
              <img
                src="https://cf.shopee.vn/file/sg-11134258-7rdxs-m1m9bdywn82vaf"
                className="d-block w-100"
                style={{height: "610px"}}
                alt="..."
              />
            </div>
            <div class="carousel-item">
              <img
                src="https://cf.shopee.vn/file/sg-11134258-7rdxs-m1m9bdywn82vaf"
                className="d-block w-100"
                style={{height: "610px"}}
                alt="..."
              />
            </div>
            <div class="carousel-item">
              <img
                src="https://cf.shopee.vn/file/sg-11134258-7rdxs-m1m9bdywn82vaf"
                className="d-block w-100"
                style={{height: "610px"}}
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="col-lg-8 col-md-8 col-sm-8 mt-2 d-flex">
        <div className="align-content-center border-start p-2">
          {currentPage === 0 ? (
            <div id="sold-page" className="align-items-center">
              <DoNotDisturbIcon />
            </div>
          ) : (
            <div
              id="pre-page"
              className="align-items-center"
              onClick={handlePrePage}
            >
              <ArrowBackIosNewIcon
                id={`${isPrePage ? "transition-pre" : ""}`}
              />
            </div>
          )}
        </div>
        {loading ? (
          <SkeletonLoad />
        ) : (
          <div className="row d-flex justify-content-center">
            <ListItemPerMall
              data={fill}
              isNextPage={isNextPage}
              isPrePage={isPrePage}
            />
          </div>
        )}
        <div className="align-content-center p-2">
          {currentPage === totalPage - 1 ? (
            <div id="sold-page" className="align-items-center">
              <DoNotDisturbIcon />
            </div>
          ) : (
            <div
              id="next-page"
              className="align-items-center"
              onClick={handleNextPage}
            >
              <ArrowForwardIosIcon
                id={`${isNextPage ? "transition-next" : ""}`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductItemPerMall;
