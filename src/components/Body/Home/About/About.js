import React, { useEffect, useState } from "react";
import axios from "../../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import "./About.css";
import { dotWave } from "ldrs";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";

dotWave.register();

const About = ({ idCategory }) => {
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // Quản lý trang hiện tại

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

  const handleClick = (clickIdCategory) => {
    idCategory(clickIdCategory);
  };

  const handleNext = () => {
    setPageIndex((prevIndex) =>
      Math.min(prevIndex + 1, Math.ceil(fill.length / 10) - 1)
    ); // Giới hạn trang tối đa
  };

  const handlePrev = () => {
    setPageIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Giới hạn trang tối thiểu
  };

  return (
    <div className="w-100 container-fluid">
      <div className="position-relative">
        <img
          src="https://maytinhdalat.vn/Images/Product/maytinhdalat_linh-kien-may-tinh-2.jpg"
          alt=""
          className="rounded-4 w-100 h-100"
        />
        <div
          className="position-absolute start-50 translate-middle"
          style={{ width: "90%", top: "115%" }}
        >
          <div className="bg-white rounded-4 p-2 shadow" id="item-product">
            <h2 className="text-center mb-3">Danh mục</h2>
            {loading ? (
              <div className="d-flex justify-content-between align-items-center">
                {/* Nút Prev */}
                {pageIndex === 0 ? (
                  <button
                    className="btn rounded-circle"
                    onClick={handleNext}
                    disabled={pageIndex === 0}
                    style={{
                      width: "50px",
                      height: "50px",
                      outline: "1px solid",
                    }}
                  >
                    <DoDisturbAltIcon></DoDisturbAltIcon>
                  </button>
                ) : (
                  <button
                    className="btn rounded-circle"
                    onClick={handlePrev}
                    disabled={pageIndex === 0}
                    style={{
                      width: "50px",
                      height: "50px",
                      outline: "1px solid",
                    }}
                  >
                    <ArrowBackIosNewOutlinedIcon></ArrowBackIosNewOutlinedIcon>
                  </button>
                )}

                {/* Danh mục hiển thị */}
                <div className="d-flex justify-content-center">
                  {fill
                    .slice(pageIndex * 10, pageIndex * 10 + 10)
                    .map((cate) => (
                      <div
                        className="d-flex flex-column align-items-center mb-3 m-2"
                        key={cate.id}
                        style={{ maxWidth: "100%" }}
                      >
                        <Link
                          className="text-decoration-none text-dark"
                          id="featured-category-item"
                          onClick={() => handleClick(cate.id)}
                          role="button"
                          style={{
                            cursor: "pointer",
                            width: "138px",
                            maxWidth: "200px",
                          }}
                        >
                          <img
                            src={cate.imagecateproduct}
                            alt={cate.name}
                            className="rounded-3"
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <br />
                          <span className="card-text text-center m-2">
                            {cate.name}
                          </span>
                        </Link>
                      </div>
                    ))}
                </div>

                {/* Nút Next */}
                {pageIndex === Math.ceil(fill.length / 10) - 1 ? (
                  <button
                    className="btn rounded-circle"
                    onClick={handleNext}
                    disabled={pageIndex === Math.ceil(fill.length / 10) - 1}
                    style={{
                      width: "50px",
                      height: "50px",
                      outline: "1px solid",
                    }}
                  >
                    <DoDisturbAltIcon></DoDisturbAltIcon>
                  </button>
                ) : (
                  <button
                    className="btn rounded-circle"
                    onClick={handleNext}
                    style={{
                      width: "50px",
                      height: "50px",
                      outline: "1px solid",
                    }}
                  >
                    <ArrowForwardIosOutlinedIcon></ArrowForwardIosOutlinedIcon>
                  </button>
                )}
              </div>
            ) : (
              <l-dot-wave size="47" speed="1" color="black"></l-dot-wave>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
