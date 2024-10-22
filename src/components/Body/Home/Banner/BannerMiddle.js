import React from "react";

const BannerMiddle = () => {
  return (
    <div className="row">
      <div className="col-lg-8 col-md-8 col-lg-sm-8">
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded-3">
            <div className="carousel-item active">
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7r98o-m0465uem8jcd8a_xxhdpi"
                className="d-block w-100 h-100 object-fit-cover"
                alt="..."
                // style={{ height: "600px" }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://file.hstatic.net/200000722513/file/web_slider_800x400_b2s.png"
                className="d-block w-100 h-100 object-fit-cover"
                alt="..."
                // style={{ height: "600px" }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://file.hstatic.net/200000722513/file/banner_web_slider_800x400_xa_kho_t9.2024.jpg"
                className="d-block w-100 h-100 object-fit-cover"
                alt="..."
                // style={{ height: "600px" }}
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-lg-sm-4">
        <img
          src="https://file.hstatic.net/200000722513/file/layout_web_-01.png"
          alt=""
          className="img-fluid w-100"
        />
        <img
          src="https://file.hstatic.net/200000722513/file/layout_web_-01.png"
          alt=""
          className="img-fluid w-100"
        />
      </div>
    </div>
  );
};

export default BannerMiddle;
