import React from "react";
import axios from "../../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";

const ListProductStore = ({ data }) => {
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  const formatCount = (count) => {
    if (count === null || count === "") return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}tr`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };
  return (
    <>
      {data.map((fill, index) => {
        const firstIMG = fill.images[0];
        const productDetail = fill.productDetails;

        //Tìm giá nhỏ nhất lớn nhất trong mảng
        const minPrice = Math.min(
          ...productDetail.map((filter) => filter.price)
        );
        const maxPrice = Math.max(
          ...productDetail.map((filter) => filter.price)
        );

        //tính tổng số lượng sản phẩm
        const totalQuantity = productDetail.reduce(
          (total, detailQuantity) => total + detailQuantity.quantity,
          0
        );
        return (
          <div className="col-lg-3 col-md-3 col-sm-3 mb-3" key={fill.id}>
            <div
              className="card shadow rounded-4 mt-4 p-2 d-flex flex-column"
              style={{ height: "100%" }} // Đảm bảo chiều cao tự điều chỉnh
              id="product-item"
            >
              <Link
                to={`/detailProduct/${fill.slug}`}
                className="position-relative d-flex justify-content-center"
              >
                <img
                  src={
                    firstIMG
                      ? geturlIMG(fill.id, firstIMG.imagename)
                      : "/images/no_img.png"
                  }
                  className="card-img-top img-fluid rounded-4 object-fit-contain"
                  alt="..."
                  style={{ width: "200px", height: "150px" }}
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
                {/* Thêm flex-grow-1 */}
                <span className="fw-bold fst-italic" id="product-name">
                  {fill.name}
                </span>
                <h5 id="price-product">
                  <del className="text-secondary me-1">3000000 đ</del> -
                  <span className="text-danger mx-1" id="price-product-item">
                    {minPrice === maxPrice
                      ? formatPrice(minPrice) + " đ"
                      : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} đ`}
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
                    <span style={{ fontSize: "12px" }}>
                      Đã bán: {formatCount(fill.countQuantityOrderBy)}
                    </span>
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

export default ListProductStore;
