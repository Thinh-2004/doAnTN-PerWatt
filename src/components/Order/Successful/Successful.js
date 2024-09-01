import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSession from "../../../Session/useSession";
import axios from "../../../Localhost/Custumize-axios";
import Header from "../../Header/Header";
import { Button } from "@mui/material";

const Successful = () => {
  const [products, setProducts] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("6");
  const [idUser] = useSession("id");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const statusVNPay = query.get("vnp_ResponseCode");
  const vnp_OrderInfo = query.get("vnp_OrderInfo");
  const addressIds = vnp_OrderInfo.split(",").pop().trim();
  const cartIds = vnp_OrderInfo.split(",").slice(0, -1).join(",").trim();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (cartIds) {
          const response = await axios.get(`/cart?id=${cartIds}`);
          setProducts(response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    loadProducts();
  }, [cartIds, idUser]);

  const groupByStore = (products) => {
    return products.reduce((groups, product) => {
      const storeId = product.product.store.id;
      if (!groups[storeId]) {
        groups[storeId] = {
          store: product.product.store,
          products: [],
        };
      }
      groups[storeId].products.push(product);
      return groups;
    }, {});
  };

  useEffect(() => {
    const handleOrderVNPay = async () => {
      try {
        // if (!selectedShippingInfo) {
        //   toast.error("Vui lòng chọn địa chỉ nhận hàng!");
        //   return;
        // }

        // Nhóm các sản phẩm theo storeId
        const groupedProducts = groupByStore(products);

        // Lặp qua từng nhóm cửa hàng và tạo đơn hàng riêng biệt
        for (const storeId in groupedProducts) {
          const { store, products: storeProducts } = groupedProducts[storeId];

          const order = {
            user: { id: idUser },
            paymentmethod: { id: selectedPaymentMethod },
            shippinginfor: { id: addressIds },
            fee: { id: 1 },
            store: { id: storeId },
            paymentdate: new Date().toISOString(),
            orderstatus: "Đang chờ duyệt",
          };

          const orderDetails = storeProducts.map((product) => ({
            product: { id: product.product.id },
            quantity: product.quantity,
            price: product.product.price,
          }));

          console.log(order);
          console.log(orderDetails);

          if (statusVNPay === "00") {
            // Tạo đơn hàng cho từng cửa hàng
            const response = await axios.post("/api/payment/createVnPayOrder", {
              order,
              orderDetails,
            });
          } else {
            console.log("bug");
            return;
          }
        }
      } catch (error) {
        // toast.error("Đặt hàng thất bại!");
        console.log(error);
      }
    };

    handleOrderVNPay();
  }, [products, idUser, selectedPaymentMethod, addressIds]);

  return (
    <div>
      {statusVNPay === "00" ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="col-4">
            <div className="card text-center">
              <div className="card-body">
                <div className="col-12">
                  <img src="/images/7efs.gif" />
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
                  <img src="/images/4Bmb.gif" />
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