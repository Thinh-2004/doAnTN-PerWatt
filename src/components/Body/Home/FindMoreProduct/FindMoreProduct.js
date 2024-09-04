import React, { useEffect, useState } from "react";
import axios from "../../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";

const FindMoreProduct = ({ idClick, filterType }) => {
  const [fillByMore, setFillByMore] = useState([]);
  const [filterName, setFilterName] = useState("");
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const loadData = async () => {
    try {
      const res = await axios.get("pageHome");
      setFillByMore(res.data);

      //Title lọc
      const selectedFilter = res.data.find((item) => {
        if (
          filterType === "category" &&
          item.productcategory &&
          item.productcategory.id === idClick
        ) {
          return item.productcategory.name;
        } else if (
          filterType === "brand" &&
          item.trademark &&
          item.trademark.id === idClick
        ) {
          return item.trademark.name;
        }
        return null;
      });

      if (selectedFilter) {
        setFilterName(
          filterType === "category"
            ? "loại sản phẩm " + selectedFilter.productcategory.name
            : "thương hiệu " + selectedFilter.trademark.name
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, [idClick, filterType]);

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  // Lọc sản phẩm theo idClick dựa trên loại filterType
  const filterByClick = fillByMore.filter((fill) => {
    if (filterType === "category") {
      return fill.productcategory.id === idClick;
    } else if (filterType === "brand") {
      return fill.trademark.id === idClick;
    }
    return false;
  });

  return (
    <>
      {idClick && filterType ? (
        <div className="row mt-3">
          <div className="p-3">
            <h4>Nội dung liên quan đến {filterName}</h4>
            <span className="p-0 m-0">
              <hr />
            </span>
            <div className="row">
              {filterByClick.map((fill, index) => {
                const firstIMG = fill.images[0];
                return (
                  <div className="col-lg-2 mt-3" key={fill.id}>
                    <div
                      className="card shadow rounded-4 mt-4 p-2"
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
                      <div className="mt-2">
                        <span className="fw-bold fst-italic" id="product-name">
                          {fill.name}
                        </span>
                        <h5 id="price-product">
                          <del className="text-secondary me-1">3000000 đ</del> -
                          <span
                            className="text-danger mx-1"
                            id="price-product-item"
                          >
                            {formatPrice(fill.price)} đ
                          </span>
                        </h5>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <div>
                            <label htmlFor="" className="text-warning">
                              <i className="bi bi-star-fill"></i>
                            </label>
                            <label htmlFor="" className="text-warning">
                              <i className="bi bi-star-fill"></i>
                            </label>
                            <label htmlFor="" className="text-warning">
                              <i className="bi bi-star-fill"></i>
                            </label>
                            <label htmlFor="" className="text-warning">
                              <i className="bi bi-star-fill"></i>
                            </label>
                            <label htmlFor="" className="text-warning">
                              <i className="bi bi-star-fill"></i>
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
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default FindMoreProduct;
