import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useSession from "../../../Session/useSession";
import axios from "../../../Localhost/Custumize-axios";
import { Button } from "@mui/material";

const Successful = () => {
  const [products, setProducts] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const statusVNPay = query.get("vnp_ResponseCode");
  const vnp_OrderInfo = query.get("vnp_OrderInfo");
  const addressIds = vnp_OrderInfo.split(",").pop().trim();
  const cartIds = vnp_OrderInfo.split(",").slice(0, -1).join(",").trim();

  const productList = localStorage.getItem("productList")
    ? JSON.parse(localStorage.getItem("productList"))
    : null;

  const groupByStore = (products) => {
    return products.reduce((groups, product) => {
      const storeId = product.productDetail.product.store.id;
      if (!groups[storeId]) {
        groups[storeId] = {
          store: product.productDetail.product.store,
          products: [],
        };
      }
      groups[storeId].products.push(product);
      return groups;
    }, {});
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/cart?id=${cartIds}`);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
    console.log(productList);
    
  }, [user.id]);

  useEffect(() => {
    (async () => {
      try {
        const groupedProducts = groupByStore(products);

        for (const storeId in groupedProducts) {
          const { products: storeProducts } = groupedProducts[storeId];

          const order = {
            user: { id: user.id },
            paymentmethod: { tyle: "Thanh toán bằng VN Pay" },
            shippinginfor: { id: addressIds },
            store: { id: storeId },
            paymentdate: new Date().toISOString(),
            orderstatus: "Đang chờ duyệt",
          };

          const orderDetails = storeProducts.map((product) => ({
            productDetail: { id: product.productDetail.id },
            quantity: product.quantity,
            price: product.productDetail.price,
          }));
          //00 = thành công
          if (statusVNPay === "00") {
            await axios.post("/api/payment/createVnPayOrder", {
              order,
              orderDetails,
            });
          } else {
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [products]);

  return (
    <div>
      {statusVNPay === "00" ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="col-4">
            <div className="card text-center">
              <div className="card-body">
                <div className="col-12">
                  <img src="/images/7efs.gif" alt="" />
                </div>
                <h1>Thanh toán thành công</h1>
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
                    href="/order"
                    style={{
                      backgroundColor: "rgb(204,244,255)",
                      color: "rgb(0,70,89)",
                    }}
                    disableElevation
                  >
                    Xem đơn hàng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="col-4">
            <div className="card text-center">
              <div className="card-body">
                <div className="col-12">
                  <img src="/images/4Bmb.gif" alt="" />
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Successful;
