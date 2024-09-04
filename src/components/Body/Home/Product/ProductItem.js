import React, { useEffect, useState, useMemo } from "react";
import "./ProductItemStyle.css";
import { Link } from "react-router-dom";
import axios from "../../../../Localhost/Custumize-axios";
import { trefoil } from "ldrs";
import useDebounce from "../../../../CustumHook/useDebounce";
import { Box, Pagination, Skeleton } from "@mui/material";
import { Stack } from "@mui/material";

trefoil.register();

const Product = ({ item, idCate, handleReset }) => {
  const [fillAllProduct, setFillAllProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const debouncedItem = useDebounce(item);
  const debouncedIdCate = useDebounce(idCate);
  const [countOrderBuyed, setCountOrderBuyed] = useState({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);//Trang hiện tại
  const itemInPage = 20;

  //Tính toán
  const lastIndex = currentPage * itemInPage; // đi đến trang típ theo
  const firstIndex = lastIndex - itemInPage; //Trở về trang (Ví dụ: 40 - 20)
  const records = fillAllProduct.slice(firstIndex, lastIndex); //cắt danh sách fill sp cần show
  const pageCount = Math.ceil(fillAllProduct.length / itemInPage); //ceil để làm tròn số số trang 

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

  const loadData = async () => {
    try {
      const res = await axios.get("pageHome");
      setFillAllProduct(res.data);
      setLoading(false);
      loadOrderBuyed(res.data);
    } catch (error) {
      console.error(error);
      setLoading(true);
    }
  };

  const loadOrderBuyed = async (products) => {
    const orderCounts = await Promise.all(
      products.map(async (product) => {
        try {
          const res = await axios.get(`countOrderSuccess/${product.id}`);
          return { [product.id]: res.data };
        } catch (error) {
          console.error(error);
          return { [product.id]: 0 };
        }
      })
    );
    setCountOrderBuyed(Object.assign({}, ...orderCounts));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedItem, debouncedIdCate]);

  const filterBySearchAndCategory = useMemo(() => {
    return records.filter((product) => {
      const matchesSearch = debouncedItem
        ? product.name.toLowerCase().includes(debouncedItem.toLowerCase())
        : true;
      const matchesCategory = debouncedIdCate
        ? product.productcategory.id === debouncedIdCate
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [debouncedItem, debouncedIdCate, records]);

  // Sự kiện đặt lại giá trị cho số trang
  const handlePageChange = (e, value) => {
    setCurrentPage(value);
    console.log(value);
  };

  return (
    <>
      {debouncedItem || debouncedIdCate ? (
        <div
          onClick={handleReset}
          className="text-primary"
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-box-seam"></i> Hiển thị tất cả sản phẩm
        </div>
      ) : null}
      {loading || isFiltering ? (
        Array.from(new Array(10)).map((skeleton, index) => (
          <div
            className="col-lg-3 col-md-3 col-sm-4 mt-3 p-2 d-flex flex-column"
            style={{ minHeight: "100%" }}
            key={index}
          >
            <Box sx={{ width: 310, marginRight: 0.5, my: 5 }}>
              <Skeleton variant="rectangular" width={310} height={118} />
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </div>
        ))
      ) : filterBySearchAndCategory.length === 0 ? (
        <div className="text-center">
          <h4>
            <i
              className="bi bi-file-earmark-x"
              style={{ fontSize: "100px" }}
            ></i>
          </h4>
          <label className="fs-4">Thông tin bạn tìm không tồn tại</label>
        </div>
      ) : (
        filterBySearchAndCategory.map((fill) => {
          const firstIMG = fill.images[0];
          return (
            <div
              className="col-lg-2 col-md-3 col-sm-4 mt-3 card shadow rounded-4 p-2 d-flex flex-column"
              style={{ minHeight: "100%" }}
              key={fill.id}
              id="home-product-item"
            >
              <Link
                to={`/detailProduct/${fill.id}`}
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
                {fill.quantity === 0 && (
                  <div
                    className="position-absolute top-0 start-50 translate-middle text-danger"
                    id="bg-sold-out"
                  >
                    <span className="text-white text-center">Hết hàng</span>
                  </div>
                )}
              </Link>

              <div className="mt-2 flex-grow-1 d-flex flex-column justify-content-between">
                <span className="fw-bold fst-italic" id="product-name">
                  {fill.name}
                </span>
                <h5 id="price-product">
                  <del className="text-secondary me-1">3,000,000 đ</del> -
                  <span className="text-danger mx-1" id="price-product-item">
                    {formatPrice(fill.price)} đ
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
                    Đã bán: {formatCount(countOrderBuyed[fill.id]) || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div className="mt-3 mb-3 d-flex justify-content-center">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
        />
      </div>
    </>
  );
};

export default Product;
