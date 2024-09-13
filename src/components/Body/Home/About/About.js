import React, { useEffect, useState } from "react";
import axios from "../../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import "./About.css";
import { dotWave } from "ldrs";

dotWave.register();

const About = ({ idCategory }) => {
  const [fill, setFill] = useState([]);
  const [loading, setLoading] = useState(false);

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
    console.log("1" + 1);
    console.log("1" - 1);
  }, []);

  const handleClick = (clickIdCategory) => {
    idCategory(clickIdCategory);
  };

  return (
    <div className="w-100 mt-4 container-fluid">
      <div className="position-relative">
        <img
          src="https://maytinhdalat.vn/Images/Product/maytinhdalat_linh-kien-may-tinh-2.jpg"
          alt=""
          className="rounded-4 w-100 h-100"
        />
        <div
          className="position-absolute start-50 translate-middle"
          style={{ top: "125%" }}
        >
          <div className="bg-white rounded-4 p-2 shadow" id="item-product">
            <h2 className="text-center mb-3">Danh mục</h2>
            {loading ? (
              <>
                <div className="d-flex justify-content-center">
                  {fill.slice(0, Math.ceil(fill.length / 2)).map((cate) => (
                    <div
                      className="d-flex justify-content-center mb-3 "
                      key={cate.id}
                    >
                      <Link
                        className="text-decoration-none text-dark w-75 object-fit-cover"
                        id="featured-category-item"
                        onClick={() => handleClick(cate.id)}
                        role="button"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={cate.imagecateproduct}
                          alt={cate.name}
                          className="rounded-5"
                         
                        />
                        <br />
                        <span className="card-text text-center m-2">
                          {cate.name}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-center">
                  {fill.slice(Math.ceil(fill.length / 2)).map((cate) => (
                    <div
                      className="d-flex justify-content-center mb-3"
                      key={cate.id}
                    >
                      <Link
                        className="text-decoration-none text-dark"
                        id="featured-category-item"
                        onClick={() => handleClick(cate.id)}
                        role="button"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={cate.imagecateproduct}
                          alt={cate.name}
                          className="rounded-3"
                        />
                        <br />
                        <span className="card-text text-center m-2">
                          {cate.name}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </>
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
