import React from 'react';
import './ProductItemStyle.css'

const Product = () => {
    return (
        <div className="col-lg-3 mt-3">
        <a href="#"
          class="card shadow rounded-4 p-3"
          style={{ width: "18rem;" }}
          id="product-item"
        >
          <img
            src="https://minhancomputercdn.com/media/product/11518_xiberia_xs3100.jpg"
            class="card-img-top"
            alt="..."
            className="img-thumbnail rounded-4"
          />
          <div class="card-body">
            <p class="card-text">
              <span className="fw-bold">
                Bàn phím cơ XIBERIA XS3100 Blue Ice Blade
              </span>
              <h5>
                <del className="text-secondary">1.250.000 đ</del> -{" "}
                <span className="text-danger">990.000 đ</span>{" "}
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
                  <span htmlFor="">Đã bán: 90k</span>
                </div>
              </div>
            </p>
            <div className="d-flex justify-content-center">
              <button className="btn btn-sm btn-outline-success">
                Mua Ngay
              </button>
              <button className="btn btn-sm btn-outline-primary mx-2">
                Thêm giỏ hàng
              </button>
            </div>
          </div>
        </a>
      </div>
    );
};

export default Product;