import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../Localhost/Custumize-axios";
import { Button, Card, CardContent } from "@mui/material";
import { toast } from "react-toastify";
import { format } from "date-fns";

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

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

  const createVnPay = async () => {
    try {
      const groupedProducts = groupByStore(products);

      for (const storeId in groupedProducts) {
        const { products: storeProducts } = groupedProducts[storeId];
        const totalAmount = storeProducts.reduce((sum, product) => {
          return sum + product.productDetail.price * product.quantity;
        }, 0);

        const order = {
          user: { id: user.id },
          paymentmethod: { tyle: "Thanh toán bằng VN Pay" },
          shippinginfor: { id: addressIds },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
          totalamount: totalAmount,
        };

        const orderDetails = storeProducts.map((product) => ({
          productDetail: { id: product.productDetail.id },
          quantity: product.quantity,
          price: product.productDetail.price,
          status: null,
        }));
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

  const handleCod = async () => {
    try {
      const groupedProducts = groupByStore(products);

      let feeShip = 0;
      let leadtime = [];

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

        // const totalAmount = storeProducts.reduce((sum, product) => {
        //   const productPrice =
        //     voucherData.id === product.productDetail.id
        //       ? product.productDetail.price *
        //         product.quantity *
        //         (1 - voucherData.discountprice / 100)
        //       : product.productDetail.price * product.quantity;
        //   return sum + productPrice;
        // }, 0);

        // const totalAmount = storeProducts.reduce((sum, product) => {
        //   const productPrice = product.productDetail.price;
        //   const productQuantity = product.quantity;

        //   let priceAfterDiscount = productPrice * productQuantity;

        //   voucherData.id.forEach((voucherId, index) => {
        //     if (voucherId === product.productDetail.product.id) {
        //       const discount = voucherData.discountprice[index];
        //       priceAfterDiscount *= 1 - discount / 100;
        //     }
        //   });

        //   return sum + priceAfterDiscount;
        // }, 0);

        const addressUser = await axios.get(`shippingInfoId/${addressIds}`);

        const addressPartFroms = store.address
          .split(",")
          .map((part) => part.trim());

        let phuong = "";
        let quan = "";
        let thanhPho = "";

        if (addressPartFroms.length === 3) {
          phuong = addressPartFroms[0];
          quan = addressPartFroms[1];
          thanhPho = addressPartFroms[2];
        } else if (addressPartFroms.length === 4) {
          phuong = addressPartFroms[1];
          quan = addressPartFroms[2];
          thanhPho = addressPartFroms[3];
        } else if (addressPartFroms.length === 5) {
          phuong = addressPartFroms[2];
          quan = addressPartFroms[3];
          thanhPho = addressPartFroms[4];
        }

        const addressPartsTo = addressUser.data.address
          .split(",")
          .map((part) => part.trim());

        let to_ward_name = "";
        let to_district_name = "";
        let to_province_name = "";

        if (addressPartsTo.length === 3) {
          to_ward_name = addressPartsTo[0];
          to_district_name = addressPartsTo[1];
          to_province_name = addressPartsTo[2];
        } else if (addressPartsTo.length === 4) {
          to_ward_name = addressPartsTo[1];
          to_district_name = addressPartsTo[2];
          to_province_name = addressPartsTo[3];
        } else if (addressPartsTo.length === 5) {
          to_ward_name = addressPartsTo[2];
          to_district_name = addressPartsTo[3];
          to_province_name = addressPartsTo[4];
        }

        const ghnPayload = {
          payment_type_id: 2,
          note: "",
          required_note: "KHONGCHOXEMHANG",
          return_phone: store.phone,
          return_address: store.address,
          return_district_id: "",
          return_ward_code: "",
          client_order_code: "",
          from_name: store.namestore,
          from_phone: store.phone,
          from_address: store.address,
          from_ward_name: phuong,
          from_district_name: quan,
          from_province_name: thanhPho,
          to_name: user.fullname,
          to_phone: addressUser.data.user.phone,
          to_address: addressUser.data.address,
          to_ward_name: to_ward_name,
          to_district_name: to_district_name,
          to_province_name: to_province_name,
          cod_amount: 0,
          content: "",
          weight: 200,
          length: 1,
          width: 20,
          height: 10,
          cod_failed_amount: 10000,
          pick_station_id: 1444,
          deliver_station_id: 0,
          insurance_value: totalAmount,
          service_id: 2,
          service_type_id: 2,
          coupon: "",
          pickup_time: 1733758226,
          pick_shift: [1],
          items: storeProducts.map((product) => ({
            name:
              product.productDetail.product.name +
              " " +
              product.productDetail?.namedetail,
            code: String(product.productDetail.id),
            quantity: product.quantity,
            price: product.productDetail.price,
            length: 12,
            width: 12,
            weight: 1200,
            height: 12,
            category: {
              level1: "Sản phẩm",
            },
          })),
        };

        try {
          console.log("Payload gửi tới GHN: ", ghnPayload);
          const response = await axios.post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
            ghnPayload,
            {
              headers: {
                "Content-Type": "application/json",
                ShopId: "195541",
                Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
                // Authorization: "Bearer ece58b2c-b0da-11ef-9083-dadc35c0870d",
              },
            }
          );
          console.log("Kết quả trả về từ GHN: ", response.data);
          console.log("Total fee: ", response.data.data.total_fee);

          feeShip += Number(response.data.data.total_fee);

          if (!Array.isArray(leadtime)) {
            leadtime = [];
          }

          leadtime = [...leadtime, response.data.data.expected_delivery_time];

          const savedVoucherId = sessionStorage.getItem("voucherId");

          const order = {
            user: { id: user.id },
            paymentmethod: { id: 6 },
            shippinginfor: { id: addressIds },
            store: { id: storeId },
            paymentdate: new Date().toISOString(),
            receivedate: response.data.data.expected_delivery_time
              ? new Date(
                  response.data.data.expected_delivery_time
                ).toISOString()
              : null,
            orderstatus: "Đang chờ duyệt",
            totalamount: totalAmount + feeShip,
            voucher:
              savedVoucherId === null ? null : { id: parseInt(savedVoucherId) },
          };

          const orderDetails = storeProducts.map((product) => ({
            productDetail: { id: product.productDetail.id },
            quantity: product.quantity,
            price: product.productDetail.price,
            status: null,
          }));
          console.log(order);
          console.log(savedVoucherId);

          await axios.post("/api/orderCreate", {
            order,
            orderDetails,
          });

          sessionStorage.removeItem("voucherId");
          
        } catch (error) {
          console.error("Error: ", error);
          return;
        }
      }

      // navigate("/order");

      // const allDatesAreSame = leadtime.every((time) => time === leadtime[0]);

      // const message = () => {
      //   if (allDatesAreSame) {
      //     return `Đặt hàng thành công với thời gian nhận hàng dự kiến là: ${formatDate(
      //       leadtime[0]
      //     )}`;
      //   }

      //   return `Đặt hàng thành công với thời gian nhận hàng dự kiến là: ${leadtime
      //     .map((time) => formatDate(time))
      //     .join(", ")}`;
      // };

      // toast.success("Đặt hàng thành công");

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

      // const timer = setTimeout(() => {
      //   navigate("/order");
      // }, 5000);

      // return () => clearTimeout(timer);
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
                <h5>Tự động chuyển trang sau: {countdown} giây</h5>
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
