import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import useDebounce from "../../../CustumHook/useDebounce";
import "./StoreStyle.css";
import { Box, Skeleton } from "@mui/material";
const ProductStore = ({ item, idCate, resetSearch }) => {
  const { idStore } = useParams();
  const [fill, setFill] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false); //Skelenton
  const [loading, setLoading] = useState(true); //Load data
  //Debounce
  const debouncedItem = useDebounce(item);
  const debouncedIdCate = useDebounce(idCate);

  const loadData = async (idStore) => {
    try {
      const res = await axios.get(`/productStore/${idStore}`);
      //Duyệt qua từng sản phẩm để lấy chi tiết sản phẩm
      const dataWithDetails = await Promise.all(
        res.data.map(async (product) => {
          const resDetail = await axios.get(`/detailProduct/${product.id}`);
          return {
            ...product,
            productDetails: resDetail.data,
          };
        })
      );
      setFill(dataWithDetails);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
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
  const filterSearchByText = useMemo(() => {
    return fill.filter((product) => {
      const matchesSearch = debouncedItem
        ? product.name.toLowerCase().includes(debouncedItem.toLowerCase())
        : true;
      const matchesSearchNameCate = debouncedItem
        ? product.productcategory.name
            .toLowerCase()
            .includes(debouncedItem.toLowerCase())
        : true;
      const matchesCategory = debouncedIdCate
        ? product.productcategory.id === debouncedIdCate
        : true;

      const matchesTrademark = debouncedItem
        ? product.trademark.name
            .toLowerCase()
            .includes(debouncedItem.toLowerCase())
        : true;
      return (
        (matchesSearch || matchesSearchNameCate || matchesTrademark) &&
        matchesCategory
      );
    });
  }, [debouncedIdCate, debouncedItem, fill]);

  const handleResetSearch = () => {
    resetSearch(true);
  };

  //Skelenton
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedItem, debouncedIdCate]);

  return (
    <>
      {debouncedItem || debouncedIdCate ? (
        <div
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={handleResetSearch}
        >
          <i className="bi bi-box-seam"></i> Hiển thị tất cả sản phẩm của cửa hàng 
        </div>
      ) : null}
      {loading || isFiltering ? (
        <div className="row">
          {Array.from(new Array(12)).map((skeleton, index) => (
            <div
              className="col-lg-4 col-md-3 col-sm-4 mt-3 p-2 d-flex flex-column"
              style={{ minHeight: "100%" }}
              key={index}
            >
              <Box sx={{ width: 310, marginRight: 0.5, my: 5 }}>
                <Skeleton variant="rectangular" width={310} height={118} />
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </div>
          ))}
        </div>
      ) : filterSearchByText.length === 0 ? (
        <>
          <div className="d-flex justify-content-center">
            <i
              className="bi bi-file-earmark-image-fill"
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
            const productDetail = fill.productDetails;

            //Tìm giá nhỏ nhất lớn nhất trong mảng
            const minPrice = Math.min(
              ...productDetail.map((filter) => filter.price)
            );
            const maxPrice = Math.max(
              ...productDetail.map((filter) => filter.price)
            );
            return (
              <div className="col-lg-3 col-md-3 col-sm-3 mt-3" key={fill.id}>
                <div
                  className="card shadow rounded-4 mt-4 p-2 d-flex flex-column"
                  style={{ height: "100%" }} // Đảm bảo chiều cao tự điều chỉnh
                  id="product-item"
                >
                  <Link to={`/detailProduct/${fill.id}`}
                  className="d-flex justify-content-center">
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
                        {minPrice === maxPrice
                          ? formatPrice(minPrice) + " đ"
                          : `${formatPrice(minPrice)} - ${formatPrice(
                              maxPrice
                            )}` + " đ"}
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
