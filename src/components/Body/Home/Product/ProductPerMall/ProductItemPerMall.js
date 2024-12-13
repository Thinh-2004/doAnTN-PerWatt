import React, { useCallback, useEffect } from "react";
import "./ProductItemPerMallStyle.css";
import ListItemPerMall from "./ListItemPerMall";
import { useState } from "react";
import axios from "../../../../../Localhost/Custumize-axios";
import SkeletonLoad from "../../../../../Skeleton/SkeletonLoad";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import BannerBot from "../../../../Banner/BannerBot";
import { Box } from "@mui/material";

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
      setFill(res.data.products);
      // console.log(res.data.products);
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
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        loadData(nextPage, 8);
        return nextPage;
      });
      setIsNextPage(false);
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer in case component unmounts
  }, []);

  const handlePrePage = useCallback(() => {
    setIsPrePage(true);

    const timer = setTimeout(() => {
      setCurrentPage((prevPage) => {
        const previousPage = prevPage - 1;
        loadData(previousPage, 8);
        return previousPage;
      });
      setIsPrePage(false);
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer in case component unmounts
  }, []);

  return (
    <>
      <div className="col-lg-4 col-md-4 col-sm-4 mt-2 border-end ">
        <BannerBot></BannerBot>
      </div>
      <Box className="col-lg-8 col-md-8 col-sm-8 mt-2 d-flex">
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
      </Box>
    </>
  );
};

export default ProductItemPerMall;
