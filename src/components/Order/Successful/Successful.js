import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import { Button, Card, CardContent } from "@mui/material";
import { CardBody } from "@chakra-ui/react";

const Successful = () => {
  const [products, setProducts] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const idStore = localStorage.getItem("idStore");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const statusVNPay = query.get("vnp_ResponseCode");
  const vnp_OrderInfo = query.get("vnp_OrderInfo");
  const addressIds = vnp_OrderInfo.split(",").pop().trim();
  const cartIds = vnp_OrderInfo.split(",").slice(0, -1).join(",").trim();
  const vnp_Amount = query.get("vnp_Amount");
  const hasRun = useRef(false);
  const storedDepositAmount = sessionStorage.getItem("depositAmount");

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
  }, [user.id]);

  useEffect(() => {
    //xủ lí thanh toán
    const createVnPay = async () => {
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
    };

    //xử ví nạp ví
    const handlePerPay = async () => {
      hasRun.current = true;
      try {
        const resWallet = await axios.get(`wallet/${user.id}`);
        const newVnp_Amount = vnp_Amount / 100;
        const newBalance =
          parseFloat(resWallet.data.balance) + parseFloat(newVnp_Amount);

        await axios.put(`wallet/update/${user.id}`, {
          balance: newBalance,
        });

        await axios.post(`wallettransaction/create/${resWallet.data.id}`, {
          amount: newVnp_Amount,
          transactiontype: "Nạp tiền thông qua VN Pay",
          transactiondate: new Date(),
          user: { id: user.id },
        });
        sessionStorage.removeItem("depositAmount");
      } catch (error) {
        console.error(
          "Error depositing money:",
          error.response ? error.response.data : error.message
        );
      }
    };
    if (storedDepositAmount === "Nạp tiền" && !hasRun.current) {
      handlePerPay();
    } else {
      createVnPay();
    }
  }, [
    storedDepositAmount,
    addressIds,
    products,
    statusVNPay,
    user.id,
    vnp_Amount,
  ]);

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
                  {storedDepositAmount === "Nạp tiền" ? (
                    <Button
                      variant="contained"
                      href={
                        idStore !== "undefined"
                          ? "/profileMarket/wallet/seller"
                          : user.id === 1
                          ? "/admin/wallet"
                          : "/wallet/buyer"
                      }
                      style={{
                        backgroundColor: "rgb(218,255,180)",
                        color: "rgb(45,91,0)",
                      }}
                      disableElevation
                    >
                      Ví
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className="me-3"
                      href="/order"
                      style={{
                        backgroundColor: "rgb(204,244,255)",
                        color: "rgb(0,70,89)",
                      }}
                      disableElevation
                    >
                      Xem đơn hàng
                    </Button>
                  )}
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
