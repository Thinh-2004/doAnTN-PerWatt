import React, { useEffect, useState } from "react";
import axios from "../../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import "./About.css";
import { dotWave } from "ldrs";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeModeContext } from "../../../ThemeMode/ThemeModeProvider";
import BannerTop from "../../../Banner/BannerTop";

dotWave.register();

const About = ({ idCategory }) => {
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // Quản lý trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(10); // Số lượng mục hiển thị
  const [checkIdCategory, setCheckIdCategory] = useState("");
  const { mode } = useContext(ThemeModeContext);

  // Hàm để xác định số lượng mục hiển thị dựa trên kích thước màn hình
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    // console.log(width);

    if (width >= 1900) {
      setItemsPerPage(10);
    } else if (width >= 1800) {
      setItemsPerPage(9);
    } else if (width >= 1700) {
      setItemsPerPage(9);
    } else if (width >= 1600) {
      setItemsPerPage(8);
    } else if (width >= 1500) {
      setItemsPerPage(7);
    } else if (width >= 1400) {
      setItemsPerPage(7);
    } else if (width >= 1300) {
      setItemsPerPage(6);
    } else if (width >= 1200) {
      setItemsPerPage(6);
    } else if (width >= 1100) {
      setItemsPerPage(5);
    } else if (width >= 1050) {
      setItemsPerPage(5);
    } else if (width >= 850) {
      setItemsPerPage(4);
    } else if (width >= 800) {
      setItemsPerPage(3);
    } else if (width >= 500) {
      setItemsPerPage(2);
    } else {
      setItemsPerPage(2);
    }
  };

  //Reponsive UI
  useEffect(() => {
    // Gọi hàm để xác định số lượng mục hiển thị ngay khi component mount
    updateItemsPerPage();

    // Lắng nghe sự thay đổi kích thước cửa sổ
    window.addEventListener("resize", updateItemsPerPage);

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("category/hot");
        setFill(res.data);
        setLoading(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    load();
  }, []);

  //Cuộn thanh cuộn xuống nơi chỉ định
  useEffect(() => {
    if (checkIdCategory !== "") {
      window.scrollTo({ top: 2300 , behavior: "smooth" });
    }
  }, [checkIdCategory]);

  const handleClick = (clickIdCategory) => {
    idCategory(clickIdCategory);
    setCheckIdCategory(clickIdCategory);
  };

  const handleNext = () => {
    setPageIndex((prevIndex) =>
      Math.min(prevIndex + 1, Math.ceil(fill.length / itemsPerPage) - 1)
    ); // Giới hạn trang tối đa
  };

  const handlePrev = () => {
    setPageIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Giới hạn trang tối thiểu
  };

  return (
    <div className="w-100 container-fluid">
      <div className="position-relative">
        <BannerTop/>
        <div
          className="position-absolute start-50 translate-middle"
          style={{ width: "90%", top: "105%" }}
        >
          <Box
            className="rounded-4 p-2 shadow"
            sx={{
              backgroundColor: "backgroundElement.children",
            }}
            id={``}
          >
            <h2 className="text-center mb-3">Danh mục</h2>
            {loading ? (
              <div className="d-flex justify-content-between align-items-center">
                {/* Nút Prev */}
                <button
                  className="btn rounded-circle"
                  onClick={handlePrev}
                  disabled={pageIndex === 0}
                  style={{
                    width: "50px",
                    height: "50px",
                    outline: "1px solid",
                    border:
                      mode === "dark"
                        ? "1px solid white"
                        : "1px solid black",
                    color: mode === "dark" ? " white" : " black",
                  }}
                >
                  {pageIndex === 0 ? (
                    <DoDisturbAltIcon />
                  ) : (
                    <ArrowBackIosNewOutlinedIcon />
                  )}
                </button>

                {/* Danh mục hiển thị */}
                <div className="d-flex justify-content-center">
                  {fill
                    .slice(
                      pageIndex * itemsPerPage,
                      pageIndex * itemsPerPage + itemsPerPage
                    )
                    .map((cate) => (
                      <div
                        className="flex-column align-items-center mb-3 m-2"
                        key={cate.id}
                      >
                        <Link
                          className="text-decoration-none text-center"
                          id="featured-category-item"
                          onClick={() => handleClick(cate.id)}
                          role="button"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={cate.imagecateproduct}
                            alt={cate.name}
                            className="rounded-3"
                            // style={{
                            //   width: "100%",
                            //   height: "100px",
                            //   objectFit: "cover",
                            // }}
                          />
                          <br />
                          <Typography
                            variant="span"
                            className="card-text m-2"
                            sx={{ color: "text.default" }}
                          >
                            {cate.name}
                          </Typography>
                        </Link>
                      </div>
                    ))}
                </div>

                {/* Nút Next */}
                <button
                  className="btn rounded-circle"
                  onClick={handleNext}
                  disabled={
                    pageIndex === Math.ceil(fill.length / itemsPerPage) - 1
                  }
                  style={{
                    width: "50px",
                    height: "50px",
                    outline: "1px solid",
                    border:
                      mode === "dark"
                        ? "1px solid white"
                        : "1px solid black",
                    color: mode === "dark" ? " white" : " black",
                  }}
                >
                  {pageIndex === Math.ceil(fill.length / itemsPerPage) - 1 ? (
                    <DoDisturbAltIcon />
                  ) : (
                    <ArrowForwardIosOutlinedIcon />
                  )}
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-center">
                <l-dot-wave size="50" speed="1" color="black"></l-dot-wave>
              </div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default About;
