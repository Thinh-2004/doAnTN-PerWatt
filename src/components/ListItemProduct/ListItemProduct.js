import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../Localhost/Custumize-axios";
import { Card, Chip } from "@mui/material";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const ListItemProduct = ({ data, classNameCol }) => {
  //Sử dụng đối tượng để lưu voucher theo từng idProduct
  const [voucher, setVoucher] = useState({});
  //Tạo state để nhận số sao theo idProduct
  const [productRating, setProductRating] = useState({});

  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };

  const formatCount = (count) => {
    if (count === null || count === "") return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}tr`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const loadData = async (idProduct) => {
    try {
      const res = await axios.get(`fillVoucherPrice/${idProduct}`);
      //Lưu voucher theo từng idProduct
      setVoucher((pre) => ({
        ...pre,
        [idProduct]: res.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  //Hàm xử lí số sao
  const loadCountEvaluate = async (idProduct) => {
    try {
      const res = await axios.get(`/comment/count/evaluate/${idProduct}`);
      //Lưu product rating theo idProduct
      setProductRating((pre) => ({
        ...pre,
        [idProduct]: res.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    data.forEach((fill) => {
      loadData(fill.product.id);
      loadCountEvaluate(fill.product.id);
    });
  }, [data]);

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

        //Lấy voucher tương ứng với idProduct
        const productVoucher = voucher[fill.product.id] || [];

        //Kiểm tra xem idProduct có trùng với idProduct trong voucher hay không
        const isVoucherPrice = productVoucher.some(
          (check) => check.product.id === fill.product.id
        );

        //Kiểm tra status voucher
        const isStatusVoucher = productVoucher.some(
          (check) => check.status === "Hoạt động"
        );

        //Tính giá giảm của voucher
        let result;

        if (productVoucher.length > 0) {
          // Tính giá giảm First và Last
          const priceDownFirst =
            minPrice * (productVoucher[0].discountprice / 100);
          const priceDownLast =
            maxPrice *
            (productVoucher[productVoucher.length - 1].discountprice / 100);
          //Kết quả
          const resultFirst = minPrice - priceDownFirst;
          const resultLast = maxPrice - priceDownLast;
          result = formatPrice(resultFirst) + " - " + formatPrice(resultLast);
        }

        //Lấy rating tương ứng từng product
        const productRatings = productRating[fill.product.id] || [];

        // Tính số sao
        const countRating = productRatings.reduce(
          (start, rating) => start + rating.rating,
          0
        );

        // Tính số lượng bình luận
        const totalComment = productRatings.length;

        // Kết quả trung bình số sao
        const resultRating = countRating / totalComment;

        // Làm tròn xuống và chỉ lấy 1 chữ số sau dấu chấm
        const finalRating =
          isNaN(resultRating) || resultRating <= 0
            ? 0
            : Math.floor(resultRating * 10) / 10;
        // Tính toán số sao
        const fullStars = Math.max(0, Math.min(Math.floor(finalRating), 5));
        const emptyStars = 5 - fullStars;

        return (
          <Card
            className={`${classNameCol} mb-3 mt-2 shadow rounded-3 p-2 d-flex flex-column`}
            sx={{
              bgcolor: "backgroundElement.children",
            }}
            key={fill.product.id}
            id="home-product-item"
          >
            <Link
              to={`/detailProduct/${fill.product.slug}`}
              className="position-relative d-flex justify-content-center"
              // style={{ height: "50%" }}
            >
              <img
                src={firstIMG ? firstIMG.imagename : "/images/no_img.png"}
                className="img-fluid rounded-3"
                alt="Product"
                style={{ width: "100%", height: "200px" }}
                loading="lazy"
              />
              {totalQuantity === 0 && (
                <div
                  className="position-absolute top-0 start-50 translate-middle text-danger"
                  id="bg-sold-out"
                >
                  <span className="text-white text-center">Hết hàng</span>
                </div>
              )}
              {isVoucherPrice && isStatusVoucher ? (
                <div className="position-absolute bottom-0 end-0">
                  <Chip
                    icon={<LoyaltyIcon />}
                    label={`Giảm: ${productVoucher[0].discountprice}%`}
                    size="small"
                    sx={{ backgroundColor: "backgroundElement.children" }}
                    className="rounded-3"
                  />
                </div>
              ) : null}
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
                {isVoucherPrice && isStatusVoucher ? (
                  <>
                    <del className="text-secondary me-1">
                      {minPrice === maxPrice
                        ? formatPrice(minPrice) + " đ"
                        : `${formatPrice(minPrice)} - ${formatPrice(
                            maxPrice
                          )}` + " đ"}
                    </del>
                    -
                    <span className="text-danger mx-1" id="price-product-item">
                      {result} đ
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-danger mx-1" id="price-product-item">
                      {minPrice === maxPrice
                        ? formatPrice(minPrice) + " đ"
                        : `${formatPrice(minPrice)} - ${formatPrice(
                            maxPrice
                          )}` + " đ"}
                    </span>
                  </>
                )}
              </h5>
              <hr className="m-0 p-0" />
            </div>

            <div className="d-flex justify-content-between align-items-end">
              <div>
                <span style={{ fontSize: "12px" }}>
                  {[...Array(fullStars)].map((_, index) => (
                    <StarIcon
                      key={index}
                      sx={{ color: "#FFD700", fontSize: "16px" }}
                    />
                  ))}
                  {[...Array(emptyStars)].map((_, index) => (
                    <StarBorderIcon
                      key={index}
                      sx={{ color: "#FFD700", fontSize: "16px" }}
                    />
                  ))}
                </span>
              </div>
              <div>
                <span style={{ fontSize: "12px" }}>
                  Đã bán: {formatCount(fill.countOrderSuccess)}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default ListItemProduct;
