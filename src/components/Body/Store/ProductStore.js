import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import useDebounce from "../../../CustumHook/useDebounce";
import "./StoreStyle.css";
const ProductStore = ({ item }) => {
  const { idStore } = useParams();
  const [fill, setFill] = useState([]);
  //Debounce
  const debouncedItem = useDebounce(item);

  const loadData = async (idStore) => {
    try {
      const res = await axios.get(`/productStore/${idStore}`);
      setFill(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadData(idStore);
  }, [idStore]);
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };
  //Lọc sản phẩm
  const filterSearchByText = fill.filter((productStore) =>
    productStore.name.toLowerCase().includes(debouncedItem.toLowerCase())
  );
  return (
    <>
      {filterSearchByText.length === 0 ? (
        <>
          <div className="d-flex justify-content-center">
            <i
              class="bi bi-file-earmark-image-fill"
              style={{ fontSize: "100px" }}
            ></i>
          </div>
          <label className="d-flex justify-content-center fs-5 mb-3">
            Shop không có nội dung bạn cần tìm
          </label>
          <div className="d-flex justify-content-center  mb-5">
            <Link className="btn" id="btn-comback-home" to={"/"}>
              Quay về trang chủ để tìm kiếm trên sàn PerWatt
            </Link>
          </div>
        </>
      ) : (
        <div className="row mb-5">
          {filterSearchByText.map((fill, index) => {
            const firstIMG = fill.images[0];
            return (
              <div className="col-lg-2 col-md-2 col-sm-2 mt-3" key={fill.id}>
                <div
                  className="card shadow rounded-4 mt-4 p-2 d-flex flex-column"
                  style={{height: "100%" }} // Đảm bảo chiều cao tự điều chỉnh
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
                  <div className="mt-2 flex-grow-1 d-flex flex-column justify-content-between">
                    {/* Thêm flex-grow-1 */}
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
      )}
    </>
  );
};

export default ProductStore;
