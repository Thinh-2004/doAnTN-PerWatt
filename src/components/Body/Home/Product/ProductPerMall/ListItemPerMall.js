import React from "react";
import { Link } from "react-router-dom";
import axios from "../../../../../Localhost/Custumize-axios";
import { Box } from "@mui/material";

const ListItemPerMall = ({ data }) => {
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
        const firstIMG = fill.product.images[0];
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
          <Box
            className="col-lg-3 col-md-3 col-sm-3 mb-2 shadow rounded-3 p-2 d-flex flex-column"
            sx={{ maxWidth: "23%", bgcolor: "backgroundElement.children" }}
            key={fill.product.id}
            id="home-product-itemPerMall"
          >
            <Link
              to={`/detailProduct/${fill.product.slug}`}
              className="position-relative d-flex justify-content-center"
              // style={{ height: "50%" }}
            >
              <img
                src={
                  firstIMG
                    ? geturlIMG(fill.product.id, firstIMG.imagename)
                    : "/images/no_img.png"
                }
                style={{ width: "100%", height: "150px" }}
                className="img-fluid rounded-3"
                alt="Product"
              />
              {totalQuantity === 0 && (
                <div
                  className="position-absolute top-0 start-50 translate-middle text-danger"
                  id="bg-sold-out"
                >
                  <span
                    className="text-white text-center"
                    style={{ fontSize: "15px" }}
                  >
                    Hết hàng
                  </span>
                </div>
              )}
              {fill?.product?.store?.taxcode && (
                <div className="position-absolute bottom-0 end-0">
                  <img
                    src="/images/IconShopMall.png"
                    alt=""
                    className="rounded-circle"
                    style={{ width: "15%", aspectRatio: "1 / 1" }}
                  />
                </div>
              )}
            </Link>

            <div className="mt-2 flex-grow-1 d-flex flex-column justify-content-between">
              <span className="fw-bold fst-italic" id="product-name">
                {fill.product.name}
              </span>
              <h5 id="price-product">
                <del className="text-secondary me-1">3,000,000 đ</del> -
                <span className="text-danger mx-1" id="price-product-item">
                  {minPrice === maxPrice
                    ? formatPrice(minPrice) + " đ"
                    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}` +
                      " đ"}
                </span>
              </h5>
              <hr className="m-o p-0" />
            </div>

            <div className="d-flex justify-content-between align-items-end">
              <div>
                <span style={{ fontSize: "12px" }}>
                  <i className="bi bi-star-fill text-warning"></i> 3.3
                </span>
              </div>
              <div>
                <span style={{ fontSize: "12px" }}>
                  Đã bán: {formatCount(fill.countOrderSuccess)}
                </span>
              </div>
            </div>
          </Box>
        );
      })}
    </>
  );
};

export default ListItemPerMall;
