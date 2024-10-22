import React from "react";
import { Link } from "react-router-dom";
import axios from "../../../../../Localhost/Custumize-axios";

const ListItem = ({ data }) => {
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };

  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };

  const formatCount = (count) => {
    if (count === null || count === "") return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}tr`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  return (
    <>
      {data.map((fill) => {
        const firstIMG = fill.images[0];
        const productDetails = fill.productDetails;

        //Tìm giá nhỏ nhất lớn nhất trong mảng
        const minPrice = Math.min(
          ...productDetails.map((filter) => filter.price)
        );
        const maxPrice = Math.max(
          ...productDetails.map((filter) => filter.price)
        );

        //tính tổng số lượng sản phẩm
        const totalQuantity = productDetails.reduce(
          (total, detailQuantity) => total + detailQuantity.quantity,
          0
        );
        return (
          <div
            className="col-lg-2 col-md-3 col-sm-4 mt-3 card shadow rounded-4 p-2 d-flex flex-column"
            style={{ minHeight: "100%" }}
            key={fill.id}
            id="home-product-item"
          >
            <Link
              to={`/detailProduct/${fill.slug}`}
              className="position-relative d-flex justify-content-center"
              style={{ height: "50%" }}
            >
              <img
                src={
                  firstIMG
                    ? geturlIMG(fill.id, firstIMG.imagename)
                    : "/images/no_img.png"
                }
                className="img-fluid rounded-4"
                alt="Product"
              />
              {totalQuantity === 0 && (
                <div
                  className="position-absolute top-0 start-50 translate-middle text-danger"
                  id="bg-sold-out"
                >
                  <span className="text-white text-center">Hết hàng</span>
                </div>
              )}
              {fill?.store?.taxcode && (
                <div class="position-absolute bottom-0 end-0">
                  <img
                    src="/images/IconShopMall.png"
                    alt=""
                    className="rounded-circle"
                    style={{ width: "15%", height: "15%" }}
                  />
                </div>
              )}
            </Link>

            <div className="mt-2 flex-grow-1 d-flex flex-column justify-content-between">
              <span className="fw-bold fst-italic" id="product-name">
                {fill.name}
              </span>
              <h5 id="price-product">
                {/* <del className="text-secondary me-1">3,000,000 đ</del> - */}
                <span className="text-danger mx-1" id="price-product-item">
                  {minPrice === maxPrice
                    ? formatPrice(minPrice) + " đ"
                    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}` +
                      " đ"}
                </span>
              </h5>
              <hr />
            </div>

            <div className="d-flex justify-content-between align-items-end">
              <div>
                {[...Array(5)].map((_, index) => (
                  <i key={index} className="bi bi-star-fill text-warning"></i>
                ))}
              </div>
              <div>
                <span style={{ fontSize: "12px" }}>
                  Đã bán: {formatCount(fill.countQuantityOrderBy)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ListItem;
