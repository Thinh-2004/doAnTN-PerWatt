import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import axios from "../../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import { tailspin } from "ldrs";
import "./PayBuyerStyle.css";
import { Button, Card, CardContent, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormSelectAdress from "../../APIAddressVN/FormSelectAdress.js";
import { format } from "date-fns";

const PayBuyer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [selectedShippingInfo, setSelectedShippingInfo] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("1");

  const [newAddress, setNewAddress] = useState("");
  const [newHome, setNewHome] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const cartIds = query.get("cartIds");
  const [resetForm, setResetForm] = useState(false);
  const [totalAmountProduct, setTotalAmountProduct] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [feeShip, setFeeShip] = useState(0);

  const [voucher, setVoucher] = useState(null);
  const [voucherS, setVoucherS] = useState(0);
  const [voucherData, setVoucherData] = useState({
    id: [],
    discountprice: [],
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  tailspin.register();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/cart?id=${cartIds}`);
      setProducts(response.data);
      const resPayment = await axios.get("/paymentMethod");
      setPaymentMethods(resPayment.data);

      const resShipInfo = await axios.get(`/shippingInfo?userId=${user.id}`);
      setShippingInfo(resShipInfo.data);

      const resVoucher = await axios.get(`/findVoucherByIdUser/${user.id}`);
      setVoucher(resVoucher.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [cartIds, user.id]);

  const fetchShippingInfo = async () => {
    try {
      const resShipInfo = await axios.get(`/shippingInfo?userId=${user.id}`);

      if (resShipInfo.data.length > 0) {
        const defaultShippingInfo = resShipInfo.data.find(
          (info) => info.isdefault === true
        );

        if (defaultShippingInfo) {
          setSelectedShippingInfo(defaultShippingInfo.id);
        } else {
          setSelectedShippingInfo(resShipInfo.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching shipping info:", error);
    }
  };

  useEffect(() => {
    fetchShippingInfo();
  }, [user.id]);

  const handleReset = () => {
    setResetForm(true);
    setNewAddress("");
    setNewHome("");
    setTimeout(() => {
      setResetForm(false);
    }, 1000);
  };

  const groupByStore = (products) => {
    const groupedProducts = products.reduce((groups, product) => {
      const storeId = product.productDetail.product.store.id;
      const store = product.productDetail.product.store;
      const address = product.productDetail.product.store.address;

      let feeShip = [];
      if (!groups[storeId]) {
        groups[storeId] = {
          store,
          address,
          products: [],
          feeShip: feeShip,
        };
      }
      groups[storeId].products.push(product);
      return groups;
    }, {});
    return groupedProducts;
  };

  const groupedProducts = groupByStore(products);

  // const handleCod = async () => {
  //   try {
  //     if (!selectedShippingInfo) {
  //       toast.error("Vui lòng chọn địa chỉ nhận hàng!");
  //       return;
  //     }

  //     const groupedProducts = groupByStore(products);

  //     for (const storeId in groupedProducts) {
  //       const { products: storeProducts } = groupedProducts[storeId];

  //       const outOfStockProduct = storeProducts.find(
  //         (product) => product.productDetail.quantity === 0
  //       );

  //       if (outOfStockProduct) {
  //         toast.error(
  //           "Sản phẩm đã có người mua trước, vui lòng mua sản phẩm khác hoặc mua lại sau"
  //         );
  //         return;
  //       }

  //       const totalAmount = storeProducts.reduce((sum, product) => {
  //         const productPrice =
  //           voucherData.id === product.productDetail.id
  //             ? product.productDetail.price *
  //               product.quantity *
  //               (1 - voucherData.discountprice / 100)
  //             : product.productDetail.price * product.quantity;
  //         return sum + productPrice;
  //       }, 0);

  //       const order = {
  //         user: { id: user.id },
  //         paymentmethod: { id: selectedPaymentMethod },
  //         shippinginfor: { id: selectedShippingInfo },
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

  //       await axios.post("/api/orderCreate", {
  //         order,
  //         orderDetails,
  //       });
  //     }
  //     toast.success("Đặt hàng thành công!");
  //     navigate("/order");
  //   } catch (error) {
  //     toast.error("Đặt hàng thất bại!");
  //   }
  // };

  // const calculateShippingFee = async () => {
  //   for (const storeId in groupedProducts) {
  //     const { products: storeProducts } = groupedProducts[storeId];

  //     if (!storeProducts.length) continue;

  //     const outOfStockProduct = storeProducts.find(
  //       (product) => product.productDetail.quantity === 0
  //     );

  //     if (outOfStockProduct) {
  //       toast.error(
  //         "Sản phẩm đã có người mua trước, vui lòng mua sản phẩm khác hoặc mua lại sau"
  //       );
  //       return;
  //     }
  //     const totalAmount = storeProducts.reduce((sum, product) => {
  //       const productPrice =
  //         voucherData.id === product.productDetail.id
  //           ? product.productDetail.price *
  //             product.quantity *
  //             (1 - voucherData.discountprice / 100)
  //           : product.productDetail.price * product.quantity;
  //       return sum + productPrice;
  //     }, 0);

  //     try {
  //       const feePayload = {
  //         service_type_id: 5,
  //         from_district_id: 1442,
  //         from_ward_code: "21211",
  //         to_district_id: 1820,
  //         to_ward_code: "030712",
  //         height: 20,
  //         length: 30,
  //         weight: 3000,
  //         width: 40,
  //         insurance_value: totalAmount,
  //         coupon: null,
  //         items: storeProducts.map((product) => ({
  //           name:
  //             product.productDetail.product.name +
  //               " " +
  //               product.productDetail.namedetail || "",
  //           quantity: product.quantity,
  //           height: 12,
  //           weight: 1200,
  //           length: 12,
  //           width: 12,
  //         })),
  //       };

  //       const res = await axios.post(
  //         "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
  //         feePayload,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
  //             ShopId: "195541",
  //           },
  //         }
  //       );
  //       console.log(res.data);
  //     } catch (error) {
  //       console.error("Lỗi khi tính phí vận chuyển: ", error.response?.data);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   calculateShippingFee();
  // }, [selectedShippingInfo]);

  const handleCod = async () => {
    const loadingGHN = toast.loading("Đang đặt hàng");

    try {
      if (!selectedShippingInfo) {
        toast.error("Vui lòng chọn địa chỉ nhận hàng!");
        return;
      }

      const groupedProducts = groupByStore(products);

      // let feeShip = 0;
      // let leadtime = [];

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

        const totalAmount = storeProducts.reduce((sum, product) => {
          const productPrice = product.productDetail.price;
          const productQuantity = product.quantity;

          let priceAfterDiscount = productPrice * productQuantity;

          voucherData.id.forEach((voucherId, index) => {
            if (voucherId === product.productDetail.product.id) {
              const discount = voucherData.discountprice[index];
              priceAfterDiscount *= 1 - discount / 100;
            }
          });

          return sum + priceAfterDiscount;
        }, 0);

        // const addressUser = await axios.get(
        //   `shippingInfoId/${selectedShippingInfo}`
        // );

        // const addressPartFroms = store.address
        //   .split(",")
        //   .map((part) => part.trim());

        // let phuong = "";
        // let quan = "";
        // let thanhPho = "";

        // if (addressPartFroms.length === 3) {
        //   phuong = addressPartFroms[0];
        //   quan = addressPartFroms[1];
        //   thanhPho = addressPartFroms[2];
        // } else if (addressPartFroms.length === 4) {
        //   phuong = addressPartFroms[1];
        //   quan = addressPartFroms[2];
        //   thanhPho = addressPartFroms[3];
        // } else if (addressPartFroms.length === 5) {
        //   phuong = addressPartFroms[2];
        //   quan = addressPartFroms[3];
        //   thanhPho = addressPartFroms[4];
        // }

        // const addressPartsTo = addressUser.data.address
        //   .split(",")
        //   .map((part) => part.trim());

        // let to_ward_name = "";
        // let to_district_name = "";
        // let to_province_name = "";

        // if (addressPartsTo.length === 3) {
        //   to_ward_name = addressPartsTo[0];
        //   to_district_name = addressPartsTo[1];
        //   to_province_name = addressPartsTo[2];
        // } else if (addressPartsTo.length === 4) {
        //   to_ward_name = addressPartsTo[1];
        //   to_district_name = addressPartsTo[2];
        //   to_province_name = addressPartsTo[3];
        // } else if (addressPartsTo.length === 5) {
        //   to_ward_name = addressPartsTo[2];
        //   to_district_name = addressPartsTo[3];
        //   to_province_name = addressPartsTo[4];
        // }

        // const ghnPayload = {
        //   payment_type_id: 2,
        //   note: "",
        //   required_note: "KHONGCHOXEMHANG",
        //   return_phone: store.phone,
        //   return_address: store.address,
        //   return_district_id: "",
        //   return_ward_code: "",
        //   client_order_code: "",
        //   from_name: store.namestore,
        //   from_phone: store.phone,
        //   from_address: store.address,
        //   from_ward_name: phuong,
        //   from_district_name: quan,
        //   from_province_name: thanhPho,
        //   to_name: user.fullname,
        //   to_phone: addressUser.data.user.phone,
        //   to_address: addressUser.data.address,
        //   to_ward_name: to_ward_name,
        //   to_district_name: to_district_name,
        //   to_province_name: to_province_name,
        //   cod_amount: 0,
        //   content: "",
        //   weight: 200,
        //   length: 1,
        //   width: 20,
        //   height: 10,
        //   cod_failed_amount: 10000,
        //   pick_station_id: 1444,
        //   deliver_station_id: 0,
        //   insurance_value: totalAmount,
        //   service_id: 2,
        //   service_type_id: 2,
        //   coupon: "",
        //   pickup_time: 1733758226,
        //   pick_shift: [1],
        //   items: storeProducts.map((product) => ({
        //     name:
        //       product.productDetail.product.name +
        //       " " +
        //       product.productDetail?.namedetail,
        //     code: String(product.productDetail.id),
        //     quantity: product.quantity,
        //     price: product.productDetail.price,
        //     length: 12,
        //     width: 12,
        //     weight: 1200,
        //     height: 12,
        //     category: {
        //       level1: "Sản phẩm",
        //     },
        //   })),
        // };

        // try {
        //   console.log("Payload gửi tới GHN: ", ghnPayload);
        //   const response = await axios.post(
        //     "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
        //     ghnPayload,
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         ShopId: "195541",
        //         Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
        //         // Authorization: "Bearer ece58b2c-b0da-11ef-9083-dadc35c0870d",
        //       },
        //     }
        //   );
        //   console.log("Kết quả trả về từ GHN: ", response.data);
        //   console.log("Total fee: ", response.data.data.total_fee);

        //   feeShip += Number(response.data.data.total_fee);

        //   if (!Array.isArray(leadtime)) {
        //     leadtime = [];
        //   }

        //   leadtime = [...leadtime, response.data.data.expected_delivery_time];

        // } catch (error) {
        //   console.error(error);
        //   return;
        // }

        const order = {
          user: { id: user.id },
          paymentmethod: { id: selectedPaymentMethod },
          shippinginfor: { id: selectedShippingInfo },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
          totalamount: totalAmount + feeShip,
          voucher: voucher[0]?.voucher?.id
            ? { id: voucher[0].voucher.id }
            : null,
        };

        const orderDetails = storeProducts.map((product) => ({
          productDetail: { id: product.productDetail.id },
          quantity: product.quantity,
          price: product.productDetail.price,
          status: null,
        }));

        await axios.post("/api/orderCreate", {
          order,
          orderDetails,
        });
      }

      navigate("/order");

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

      toast.update(loadingGHN, {
        render: "Đặt hàng thành công",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (error) {
      console.error("Lỗi: ", error);
      toast.error("Đặt hàng thất bại!");
      return;
    }
  };

  const handleVnPay = async () => {
    try {
      // const totalAmount = Object.values(groupedProducts).reduce(
      //   (sum, { products }) => {
      //     return (
      //       sum +
      //       products.reduce((productSum, product) => {
      //         return (
      //           productSum + product.productDetail.price * product.quantity
      //         );
      //       }, 0)
      //     );
      //   },
      //   0
      // );

      for (const storeId in groupedProducts) {
        const { products: storeProducts } = groupedProducts[storeId];

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
      }

      if (finalTotal >= 10000000 || finalTotal < 10000) {
        toast.warning(
          "Bạn chỉ được mua tối thiếu 10.000đ và tối đa 10.000.000đ"
        );
        return;
      }

      const productList = Object.values(groupedProducts).flatMap(
        ({ products }) =>
          products.map((product) => ({
            name: product.productDetail.product.name,
            quantity: product.quantity,
          }))
      );

      const voucherId = voucher[0]?.voucher?.id;

      if (
        voucherData.id.length !== 0 &&
        voucherData.discountprice.length !== 0
      ) {
        sessionStorage.setItem("voucherId", voucherId);
      }

      const response = await axios.post("/api/payment/create_payment", {
        amount: finalTotal,
        products: productList,
        ids: cartIds,
        address: selectedShippingInfo,
      });

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chuyển hướng thanh toán.");
    }
  };

  const handleMomo = async () => {
    if (finalTotal >= 10000000 || finalTotal < 10000) {
      toast.warning("Bạn chỉ được mua tối thiếu 10.000đ và tối đa 10.000.000đ");
      return;
    }

    const productList = Object.values(groupedProducts).flatMap(({ products }) =>
      products.map((product) => ({
        name: product.productDetail.product.name,
        quantity: product.quantity,
        id: product.productDetail.id,
      }))
    );

    const voucherId = voucher[0]?.voucher?.id;
    console.log(voucherId);

    if (voucherData.id.length !== 0 && voucherData.discountprice.length !== 0) {
      localStorage.setItem("voucherIdMoMo", voucherId);
    }

    sessionStorage.setItem("productList", JSON.stringify(productList));
    const data = {
      amount: finalTotal,
      ids: cartIds,
      address: selectedShippingInfo,
    };
    const response = await axios.get("/pay", {
      params: data,
    });
    const paymentUrl = response.data;
    window.location.href = paymentUrl;
  };

  const handleAddAddress = async () => {
    try {
      if (!newAddress) {
        toast.warning("Vui lòng nhập địa chỉ");
        return;
      }

      const response = await axios.post("/shippingInfoCreate", {
        address: newAddress,
        user: { id: user.id },
      });

      setShippingInfo([...shippingInfo, response.data]);
      setNewAddress("");
      setResetForm(true);
      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại!");
    }
    loadProducts();
  };

  const handleCombinedAction = async () => {
    if (!selectedShippingInfo) {
      toast.warning("Bạn chưa chọn địa chỉ nhận hàng");
      return;
    } else {
      try {
        if (selectedPaymentMethod === "1") {
          await handleCod();
        } else if (selectedPaymentMethod === "6") {
          await handleVnPay();
        } else if (selectedPaymentMethod === "8") {
          await handleMomo();
        } else {
          toast.warning("Vui lòng chọn phương thức thanh toán");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi thực hiện các chức năng.");
      }
    }
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  useEffect(() => {
    const feeShipCalculator = async () => {
      try {
        // const groupedProducts = groupByStore(products);

        // for (const storeId in groupedProducts) {
        //   const { products: storeProducts } = groupedProducts[storeId];

        const addressUser = await axios.get(
          `shippingInfoId/${selectedShippingInfo}`
        );

        console.log(selectedShippingInfo);

        // console.log(addressUser.data.districtid);
        // console.log(addressUser.data.wardid);

        const requestData = {
          service_type_id: 2,
          from_district_id: 1442,
          from_ward_code: "21211",
          to_district_id: addressUser.data.districtid,
          to_ward_code: addressUser.data.wardid.toString(),
          height: 10,
          length: 10,
          weight: 10,
          width: 5,
          insurance_value: 0,
          coupon: null,
          items: [
            {
              name: "TEST1",
              quantity: 1,
              height: 10,
              weight: 10,
              length: 10,
              width: 5,
            },
          ],
        };

        // eslint-disable-next-line no-loop-func
        const getShippingFee = async () => {
          try {
            const response = await fetch(
              "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Token: "ece58b2c-b0da-11ef-9083-dadc35c0870d",
                  ShopId: "195541",
                },
                body: JSON.stringify(requestData),
              }
            );

            const data = await response.json();
            setFeeShip(data.data?.total);
          } catch (error) {
            console.error(error);
          }
        };
        getShippingFee();
        // }
      } catch (error) {
        console.error(error);
      }
    };

    const calculatedTotalAmountBeforeDiscount = Object.values(
      groupedProducts
    ).reduce((sum, { products }) => {
      return (
        sum +
        products.reduce((productSum, product) => {
          const productPrice = product.productDetail.price;
          const productQuantity = product.quantity;

          return productSum + productPrice * productQuantity;
        }, 0)
      );
    }, 0);

    const calculatedTotalAmountAfterDiscount = Object.values(
      groupedProducts
    ).reduce((sum, { products }) => {
      return (
        sum +
        products.reduce((productSum, product) => {
          const productPrice = product.productDetail.price;
          const productQuantity = product.quantity;

          let priceAfterDiscount = productPrice * productQuantity;

          voucherData.id.forEach((voucherId, index) => {
            if (voucherId === product.productDetail.product.id) {
              const discount = voucherData.discountprice[index];
              priceAfterDiscount *= 1 - discount / 100;
            }
          });

          return productSum + priceAfterDiscount;
        }, 0)
      );
    }, 0);
    feeShipCalculator();
    setTotalAmountProduct(calculatedTotalAmountBeforeDiscount);
    setVoucherS(
      calculatedTotalAmountAfterDiscount - calculatedTotalAmountBeforeDiscount
    );
    setFinalTotal(
      calculatedTotalAmountAfterDiscount -
        calculatedTotalAmountBeforeDiscount +
        calculatedTotalAmountBeforeDiscount +
        feeShip
    );
  }, [groupedProducts, voucherData, selectedShippingInfo]);

  return (
    <div>
      <Header />
      <div id="smooth" className="col-12 col-md-12 col-lg-10 offset-lg-1">
        {loading ? (
          <div className="d-flex justify-content-center mt-3">
            <l-tailspin
              size="40"
              stroke="5"
              speed="0.9"
              color="black"
            ></l-tailspin>
          </div>
        ) : (
          Object.keys(groupedProducts).map((storeId) => {
            const { store, products: storeProducts } = groupedProducts[storeId];
            return (
              <Card className="mt-3 rounded-3" key={storeId}>
                <CardContent
                  sx={{ backgroundColor: "backgroundElement.children" }}
                  className=""
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={store.user.avatar}
                      id="imgShop"
                      alt=""
                      className="mx-2 object-fit-cover"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "100%",
                      }}
                    />
                    <h5 id="nameShop" className="mt-1">
                      {store.namestore}
                    </h5>
                  </div>
                  <hr id="hr" />
                  {storeProducts.map((cart) => {
                    const firstIMG = cart.productDetail.product.images?.[0];
                    return (
                      <div className="mt-3" key={cart.productDetail.id}>
                        <div className="row">
                          <img
                            src={
                              cart &&
                              cart.productDetail &&
                              cart.productDetail.imagedetail
                                ? cart.productDetail.imagedetail
                                : firstIMG.imagename
                            }
                            alt="Product"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "contain",
                              display: "block",
                              margin: "0 auto",
                              backgroundColor: "#ffff",
                            }}
                            className="rounded-3"
                          />
                          {cart.productDetail.quantity === 0 && (
                            <div
                              className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center rounded-3"
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                fontWeight: "bold",
                                zIndex: 1,
                              }}
                            >
                              Hết hàng
                            </div>
                          )}

                          <div className="col-lg-4 col-md-12 mt-3 mx-2">
                            <div id="fontSizeTitle">
                              {cart.productDetail.product.name}
                            </div>
                            <div id="fontSize">
                              {[
                                cart.productDetail.namedetail,
                                cart.productDetail.product.productcategory.name,
                                cart.productDetail.product.trademark.name,
                                cart.productDetail.product.warranties.name,
                              ]
                                .filter(Boolean)
                                .join(", ")}{" "}
                            </div>
                          </div>

                          <div className="col-lg-6 col-md-12 mx-3 mt-5">
                            <div className="d-flex">
                              <button
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                hidden
                              ></button>
                              <div className="col-3">
                                Giá:{" "}
                                {formatPrice(cart.productDetail.price) + " VNĐ"}
                              </div>
                              <div className="col-2">
                                Số lượng: {cart.quantity}
                              </div>

                              <div className="col-7">
                                Thành tiền:{" "}
                                {voucherData.id.length > 0 &&
                                voucherData.id.includes(
                                  cart.productDetail.product.id
                                ) ? (
                                  <>
                                    <del style={{ fontSize: "14px" }}>
                                      {formatPrice(
                                        cart.productDetail.price * cart.quantity
                                      )}{" "}
                                      VNĐ
                                    </del>{" "}
                                    {formatPrice(
                                      voucherData.id.reduce(
                                        (
                                          priceAfterDiscount,
                                          voucherId,
                                          index
                                        ) => {
                                          if (
                                            voucherId ===
                                            cart.productDetail.product.id
                                          ) {
                                            const discount =
                                              voucherData.discountprice[index];
                                            return (
                                              priceAfterDiscount *
                                              (1 - discount / 100)
                                            );
                                          }
                                          return priceAfterDiscount;
                                        },
                                        cart.productDetail.price * cart.quantity
                                      )
                                    )}{" "}
                                    VNĐ
                                  </>
                                ) : (
                                  <>
                                    {formatPrice(
                                      cart.productDetail.price * cart.quantity
                                    )}{" "}
                                    VNĐ
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="col-lg-11 col-md-12">
                    <div className="d-flex justify-content-between mt-3">
                      <FormControl size="small" sx={{ width: "30%" }}>
                        <InputLabel id="address-select-label">
                          Voucher
                        </InputLabel>
                        <Select
                          labelId="address-select-label"
                          id="address-select"
                          value={voucherData.id}
                          label="Voucher"
                          multiple
                          onChange={(e) => {
                            const selectedVoucherIds = e.target.value;
                            const selectedVouchers = voucher.filter((v) =>
                              selectedVoucherIds.includes(v.voucher.product.id)
                            );

                            const selectedVoucherNames = selectedVouchers.map(
                              (selectedVoucher) =>
                                selectedVoucher.voucher.vouchername
                            );

                            const allSelectedVouchers = voucher.filter(
                              (voucherItem) =>
                                selectedVoucherNames.includes(
                                  voucherItem.voucher.vouchername
                                )
                            );

                            setVoucherData({
                              id: allSelectedVouchers.map(
                                (v) => v.voucher.product.id
                              ),
                              discountprice: allSelectedVouchers.map(
                                (selectedVoucher) =>
                                  selectedVoucher.voucher.discountprice
                              ),
                            });
                          }}
                        >
                          {voucher.length === 0 ? (
                            <MenuItem disabled>
                              Hiện tại bạn chưa có voucher nào
                            </MenuItem>
                          ) : (
                            Array.from(
                              new Set(
                                voucher.map(
                                  (voucherItem) =>
                                    voucherItem.voucher.vouchername
                                )
                              )
                            ).map((voucherName) => {
                              const vouchersWithSameName = voucher.filter(
                                (voucherItem) =>
                                  voucherItem.voucher.vouchername ===
                                  voucherName
                              );

                              const isDisabled =
                                vouchersWithSameName[0].voucher
                                  .quantityvoucher < 1;

                              return (
                                <MenuItem
                                  key={voucherName}
                                  value={
                                    vouchersWithSameName[0].voucher.product.id
                                  }
                                  disabled={isDisabled} // Vô hiệu hóa nếu quantityVoucher < 1
                                >
                                  {voucherName} {" giảm giá "}
                                  {
                                    vouchersWithSameName[0].voucher
                                      .discountprice
                                  }{" "}
                                  %
                                  {/* ,
                                  {" Còn lại " +
                                    vouchersWithSameName[0].voucher
                                      .quantityvoucher}{" "} */}
                                  {isDisabled && "( Hết số lượng)"}{" "}
                                </MenuItem>
                              );
                            })
                          )}
                        </Select>
                      </FormControl>

                      <div>
                        <div className="d-flex justify-content-end">
                          Tổng tiền:{" "}
                          {formatPrice(
                            storeProducts.reduce((total, cart) => {
                              const productPrice = cart.productDetail.price;
                              const productQuantity = cart.quantity;

                              let priceAfterDiscount =
                                productPrice * productQuantity;

                              voucherData.id.forEach((voucherId, index) => {
                                if (
                                  voucherId === cart.productDetail.product.id
                                ) {
                                  const discount =
                                    voucherData.discountprice[index];
                                  priceAfterDiscount *= 1 - discount / 100;
                                }
                              });

                              return total + priceAfterDiscount;
                            }, 0)
                          )}{" "}
                          VNĐ
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
        <Card
          className="rounded-3 mt-3 p-3"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <CardContent className="row">
            <div className="col-lg-6 col-md-8 col-sm-12 ">
              {paymentMethods.map((method) => (
                <div className="form-check mb-3" key={method.id}>
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input me-1 mb-1"
                      type="radio"
                      name="paymentMethod"
                      id={`paymentMethod${method.id}`}
                      value={method.id}
                      checked={selectedPaymentMethod === String(method.id)}
                      onChange={() =>
                        setSelectedPaymentMethod(String(method.id))
                      }
                      style={{ cursor: "pointer" }}
                    />
                    &nbsp;
                    <img
                      className="image-fixed-size"
                      src={`/images/${
                        method.type === "Thanh toán khi nhận hàng"
                          ? "COD.png"
                          : method.type === "Thanh toán bằng VN Pay"
                          ? "VNPay.png"
                          : method.type === "Thanh toán bằng MoMo"
                          ? "MoMo.png"
                          : "default.png"
                      }`}
                      alt={method.type}
                      style={{
                        width: "8%",
                        objectFit: "cover",
                        borderRadius: "100%",
                        cursor: "pointer",
                      }}
                      onClick={(e) =>
                        setSelectedPaymentMethod(String(method.id))
                      }
                    />
                    &nbsp;
                    <label
                      className="form-check-label me-3"
                      htmlFor={`paymentMethod${method.id}`}
                      style={{ cursor: "pointer" }}
                    >
                      {method.type}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-6 col-md-12 mt-lg-0 mt-md-5">
              <div className="d-flex flex-column">
                <FormControl fullWidth size="small">
                  <InputLabel id="address-select-label">
                    Chọn địa chỉ nhận hàng
                  </InputLabel>
                  <Select
                    labelId="address-select-label"
                    id="address-select"
                    value={selectedShippingInfo || ""}
                    label="Chọn địa chỉ nhận hàng"
                    onChange={(e) => {
                      setSelectedShippingInfo(e.target.value);
                    }}
                  >
                    {shippingInfo
                      .slice()
                      .sort(
                        (a, b) => (b.isdefault ? 1 : 0) - (a.isdefault ? 1 : 0)
                      )
                      .map((shipping) => (
                        <MenuItem
                          key={shipping.id}
                          value={shipping.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            minWidth: "200px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            {shipping.address}
                            {shipping.isdefault && (
                              <span
                                style={{ color: "red", marginLeft: "auto" }}
                              >
                                Mặc định
                              </span>
                            )}
                          </div>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <div className="mt-3 d-flex justify-content-end">
                  <Button
                    variant="contained"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                    style={{
                      width: "auto",
                      backgroundColor: "rgb(218, 255, 180)",
                      color: "rgb(45, 91, 0)",
                    }}
                    disableElevation
                  >
                    <i class="bi bi-plus-circle-fill me-1"></i>Thêm địa chỉ
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="exampleModal1"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Thêm địa chỉ nhận hàng
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <TextField
                      className="mb-3"
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      label="Địa chỉ mới"
                      variant="outlined"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      inputProps={{
                        readOnly: true,
                      }}
                    />

                    <FormSelectAdress
                      apiAddress={(fullAddress) => {
                        setNewAddress(`${newHome} ${fullAddress}`);
                      }}
                      resetForm={resetForm}
                      editFormAddress={newAddress}
                    />

                    <TextField
                      className="mt-3"
                      size="small"
                      fullWidth
                      id="outlined-basic"
                      label="Số nhà"
                      variant="outlined"
                      value={newHome}
                      onChange={(e) => setNewHome(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setNewAddress(`${newHome}, ${newAddress}`);
                          setNewHome("");
                        }
                      }}
                    />

                    <Button
                      className="mt-3"
                      style={{
                        width: "auto",
                        backgroundColor: "rgb(218, 255, 180)",
                        color: "rgb(45, 91, 0)",
                      }}
                      disableElevation
                      onClick={handleReset}
                    >
                      <i class="bi bi-arrow-clockwise me-1"></i> Chọn lại
                    </Button>
                    <div className="text-end mt-3">
                      <Button
                        variant="contained"
                        onClick={handleAddAddress}
                        style={{
                          width: "auto",
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                        }}
                        disableElevation
                      >
                        <i class="bi bi-plus-circle-fill me-1"></i> Thêm
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <div
            className="card-body"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>Tổng tiền:</span>
                <span>{formatPrice(totalAmountProduct) + " VNĐ"}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Phí ship</span>
                <span>{formatPrice(feeShip) + " VNĐ"}</span>
              </div>
              <hr />
              {voucherData.id ? (
                <div className="d-flex justify-content-between">
                  <span>Voucher giảm giá:</span>
                  <span>{formatPrice(voucherS)} VNĐ</span>
                </div>
              ) : (
                <div className="d-flex justify-content-between">
                  <span>Voucher giảm giá: </span>
                  <span>0 VNĐ</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between">
                <span className="mt-3 me-3">Thành tiền:</span>
                <span className="text-danger fw-bold fs-2">
                  {formatPrice(finalTotal)} VNĐ
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleCombinedAction}
                style={{
                  width: "auto",
                  backgroundColor: "rgb(218, 255, 180)",
                  color: "rgb(45, 91, 0)",
                }}
                disableElevation
              >
                <i class="bi bi-cart-check-fill me-1"></i> Đặt hàng
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PayBuyer;
