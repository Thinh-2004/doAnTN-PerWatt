import React, { useEffect, useState } from "react";
import "./ProductItemStyle.css";
import { Link } from "react-router-dom";
import axios from "../../../../../Localhost/Custumize-axios";

const Product = () => {
  const [fillAllProduct, setFillAllProduct] = useState([]);
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };
  const loadData = async () => {
    try {
      const res = await axios.get("pageHome");
      setFillAllProduct(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {fillAllProduct.map((fill, index) => {
        const firstIMG = fill.images[0];
        return (
          <div className="col-lg-2 mt-3">
            <div
              class="card shadow rounded-4 mt-4 p-2"
              style={{ width: "18rem;" }}
              id="product-item"
            >
              <Link to={`/detailProduct/${fill.id}`}>
                <img
                  src={
                    firstIMG
                      ? geturlIMG(fill.id, firstIMG.imagename)
                      : "/images/no_img.png"
                  }
                  className="card-img-top img-fluid rounded-4"
                  alt="..."
                  style={{ width: "200px", height: "150px" }}
                />
              </Link>
              <div class="mt-2">
              <span className="fw-bold fst-italic" id="product-name">
                    {fill.name}
                  </span>
                  <h5 id="price-product">
                    <del className="text-secondary me-1">3000000 đ</del> -
                    <span className="text-danger mx-1" id="price-product-item">
                      {formatPrice(fill.price)} đ
                    </span>
                  </h5>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <div>
                      <label htmlFor="" className="text-warning">
                        <i class="bi bi-star-fill"></i>
                      </label>
                      <label htmlFor="" className="text-warning">
                        <i class="bi bi-star-fill"></i>
                      </label>
                      <label htmlFor="" className="text-warning">
                        <i class="bi bi-star-fill"></i>
                      </label>
                      <label htmlFor="" className="text-warning">
                        <i class="bi bi-star-fill"></i>
                      </label>
                      <label htmlFor="" className="text-warning">
                        <i class="bi bi-star-fill"></i>
                      </label>
                    </div>
                    <div>
                      <span htmlFor="">Đã bán: 0</span>
                    </div>
                  </div>
               
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Product;
