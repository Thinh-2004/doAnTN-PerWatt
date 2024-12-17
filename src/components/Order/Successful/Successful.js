import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import { Button, Card, CardContent } from "@mui/material";
import { toast } from "react-toastify";

const Successful = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const query = new URLSearchParams(location.search);
  const statusVNPay = query.get("vnp_ResponseCode");
  const vnp_OrderInfo = query.get("vnp_OrderInfo");
  const vnp_Amount = query.get("vnp_Amount");
  const [countdown, setCountdown] = useState(5);

  const addressIds = vnp_OrderInfo.split(",").pop().trim();
  const cartIds = vnp_OrderInfo.split(",").slice(0, -1).join(",").trim();
  const totalAmounts = vnp_Amount.split(",").pop().trim();
  let totalAmount = totalAmounts / 100;
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  const groupByStore = (products) => {
    return products.reduce((groupStores, product) => {
      const { store } = product.productDetail.product;
      const storeId = store.id;

      if (!groupStores[storeId]) {
        groupStores[storeId] = {
          store,
          products: [],
        };
      }

      groupStores[storeId].products.push(product);
      return groupStores;
    }, {});
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(`/cart?id=${cartIds}`);
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const createVnPay = async () => {
  //   try {
  //     const groupedProducts = groupByStore(products);

  //     for (const storeId in groupedProducts) {
  //       const { products: storeProducts } = groupedProducts[storeId];
  //       const totalAmount = storeProducts.reduce((sum, product) => {
  //         return sum + product.productDetail.price * product.quantity;
  //       }, 0);

  //       const order = {
  //         user: { id: user.id },
  //         paymentmethod: { tyle: "Thanh toán bằng VN Pay" },
  //         shippinginfor: { id: addressIds },
  //         store: { id: storeId },
  //         paymentdate: new Date().toISOString(),
  //         orderstatus: "Đang chờ duyệt",
  //         totalamount: totalAmount,
  //       };

  //       const orderDetails = storeProducts.map((product) => ({
  //         productDetail: { id: product.productDetail.id },
  //         quantity: product.quantity,
  //         price: product.productDetail.price,
  //         status: null,
  //       }));
  //       if (statusVNPay === "00") {
  //         await axios.post("/api/payment/createVnPayOrder", {
  //           order,
  //           orderDetails,
  //         });
  //       } else {
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleCod = async () => {
    try {
      const groupedProducts = groupByStore(products);

      for (const storeId in groupedProducts) {
        const { products: storeProducts, store } = groupedProducts[storeId];

        if (!storeProducts.length) continue;

        const outOfStockProduct = storeProducts.find(
          (product) => product.productDetail.quantity === 0
        );

        if (outOfStockProduct) {
          toast.error(
            "Sản phẩm đã có người mua trước, vui lòng mua sản phẩm khác hoặc mua lại sau"
          );
          return;
        }

        const savedVoucherId = sessionStorage.getItem("voucherId");

        const order = {
          user: { id: user.id },
          paymentmethod: { id: 6 },
          shippinginfor: { id: addressIds },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
          totalamount: totalAmount,
          voucher:
            savedVoucherId === null ? null : { id: parseInt(savedVoucherId) },
        };

        const orderDetails = storeProducts.map((product) => ({
          productDetail: { id: product.productDetail.id },
          quantity: product.quantity,
          price: product.productDetail.price,
          status: null,
        }));
        if (statusVNPay === "00") {
          await axios.post("/api/orderCreate", {
            order,
            orderDetails,
          });
        }

        sessionStorage.removeItem("voucherId");
      }

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/order");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } catch (error) {
      console.error("Lỗi: ", error);
      return;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCartData();
    }, 10);

    return () => clearTimeout(timer);
  }, [cartIds]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // createVnPay();
      handleCod();
    }, 10);

    return () => clearTimeout(timer);
  }, [addressIds, products, statusVNPay, user.id]);

  return (
    <div>
      {statusVNPay === "00" ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="col-4">
            <Card
              className="text-center rounded-3"
              sx={{ backgroundColor: "backgroundElement.children" }}
            >
              <CardContent className="">
                <div className="col-12">
                  <img
                    src="/images/7efs.gif"
                    alt=""
                    className="rounded-circle"
                  />
                </div>
                <h1>Thanh toán thành công</h1>
                <h5>Tự động chuyển trang sau: 5 giây</h5>
                <div className="my-5">
                  <Button
                    variant="contained"
                    href="/"
                    className="me-3"
                    style={{
                      backgroundColor: "rgb(218,255,180)",
                      color: "rgb(45,91,0)",
                    }}
                    // onClick={orderCreate}
                    disableElevation
                  >
                    Quay về trang chủ
                  </Button>

                  <Button
                    variant="contained"
                    className="me-3"
                    href="/order"
                    style={{
                      backgroundColor: "rgb(204,244,255)",
                      color: "rgb(0,70,89)",
                    }}
                    // onClick={orderCreate}
                    disableElevation
                  >
                    Xem đơn hàng
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="col-4">
            <Card
              className="text-center rounded-3"
              sx={{ backgroundColor: "backgroundElement.children" }}
            >
              <CardContent className="">
                <div className="col-12">
                  <img
                    src="/images/cancelVNPAY.jpg"
                    alt=""
                    style={{ borderRadius: "50%" }}
                    className="w-25"
                  />
                </div>
                <h1 className="mt-5">Bạn đã hủy đơn hàng</h1>
                <div className="my-5">
                  <Button
                    variant="contained"
                    href="/"
                    className="me-3"
                    style={{
                      backgroundColor: "rgb(218,255,180)",
                      color: "rgb(45,91,0)",
                    }}
                    disableElevation
                  >
                    Quay về trang chủ
                  </Button>
                  <Button
                    variant="contained"
                    href="/cart"
                    style={{
                      backgroundColor: "rgb(218,255,180)",
                      color: "rgb(45,91,0)",
                    }}
                    disableElevation
                  >
                    Bạn muốn mua lại không!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Successful;
