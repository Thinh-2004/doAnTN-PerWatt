import React, { useEffect, useState } from "react";
import axios from "../../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import "./About.css";

const About = ({ idCategory }) => {
  const [fill, setFill] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("category/hot");
        setFill(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, []);

  const handleClick = (clickIdCategory) => {
    idCategory(clickIdCategory);
    console.log(clickIdCategory);
  };

  return (
    <div className="w-100 mt-4">
      <div className="position-relative">
        <img
          src="https://maytinhdalat.vn/Images/Product/maytinhdalat_linh-kien-may-tinh-2.jpg"
          alt=""
          className="rounded-4 w-100 h-100"
        />
        <div
          className="position-absolute start-50 translate-middle shadow"
          style={{ top: "470px" }}
        >
          <div className="bg-white rounded-4 p-2" id="item-product">
            <h2 className="text-center mb-3">Danh mục nổi bật</h2>
            <div className="p-2 m-2 overflow-x-auto featured-categories-container">
              <div className="d-flex flex-nowrap">
                {fill.map((cate) => (
                  <Link
                    key={cate.id}
                    className="featured-category-item text-decoration-none text-dark"
                    onClick={() => handleClick(cate.id)}
                    role="button"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={cate.imagecateproduct}
                      alt={cate.name}
                      className="img-fluid"
                    />
                    <br />
                    <span className="card-text text-center">{cate.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
