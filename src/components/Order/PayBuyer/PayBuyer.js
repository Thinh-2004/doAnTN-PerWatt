import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const PayBuyer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("1");
  const [selectedShippingInfo, setSelectedShippingInfo] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [newHome, setNewHome] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState("");
  const [walletAdmin, setWalletAdmin] = useState("");
  const query = new URLSearchParams(location.search);
  const cartIds = query.get("cartIds");
  const [resetForm, setResetForm] = useState(false);
  const [totalAmountProduct, setTotalAmountProduct] = useState(0); // Khai báo state để lưu tổng tiền
  const [isLoadingShipping, setIsLoadingShipping] = useState(false); // Trạng thái loading

  const [shippingFee, setShippingFee] = useState(0);
  const [voucher, setVoucher] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [voucherS, setVoucherS] = React.useState(0);
  const [finalAmout, setFinalAmout] = React.useState(0);
  const [voucherData, setVoucherData] = useState({
    id: [], // Khởi tạo id là mảng rỗng
    discountprice: [], // Khởi tạo discountprice là mảng rỗng
  });

  const hehe = (hha) => {
    console.log(voucherData);
  };

  useEffect(() => hehe());

  const [listFee, setListFee] = useState([]);

  tailspin.register();
  const [inputValues, setInputValues] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const handleReset = () => {
    setResetForm(true);
  };

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const fetchWallet = async () => {
    try {
      const resUser = await axios.get(`wallet/${user.id}`);
      const resAdmin = await axios.get(`wallet/${1}`);
      setWallet(resUser.data);
      setWalletAdmin(resAdmin.data);
    } catch (error) {
      console.error(
        "Error fetching wallet data:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [user.id]);

  const handleWithdraw = async (amount) => {
    try {
      if (wallet.balance > amount) {
        const newBalance = parseFloat(wallet.balance) - parseFloat(amount);

        const res = await axios.put(`wallet/update/${user.id}`, {
          balance: newBalance,
        });

        addTransaction(amount, "Thanh toán PerWatt");

        let adminBalance = parseFloat(walletAdmin.balance);
        for (const storeId in groupedProducts) {
          const { store, products } = groupedProducts[storeId];

          const storeTotal = products.reduce((sum, product) => {
            const price = parseFloat(product.productDetail.price) || 0;
            const quantity = parseInt(product.quantity, 10) || 0;
            const shipping = parseFloat(shippingFee) || 0;

            return sum + price * quantity + shipping;
          }, 0);

          adminBalance += storeTotal;
          const adminRes = await axios.put(`wallet/update/${1}`, {
            balance: adminBalance,
          });
          setWalletAdmin(adminRes.data);

          const transactionUser = await axios.get(
            `wallettransaction/idWalletByIdUSer/${user.id}`
          );

          await axios.post(
            `wallettransaction/create/${transactionUser.data.id}`,
            {
              amount: -storeTotal,
              transactiontype: "Thanh toán bằng PerPay",
              transactiondate: new Date(),
              user: { id: user.id },
            }
          );
          const transactionType =
            `Thanh toán từ người dùng: ${user.fullname}`.substring(0, 50);
          await axios.post(`wallettransaction/create/${1}`, {
            amount: storeTotal,
            transactiontype: transactionType,
            transactiondate: new Date(),
            user: { id: user.id },
            store: { id: store.id },
          });

          const withdrawAmount = storeTotal * 0.9;
          const adminBalancePlus = storeTotal * 0.1;
          adminBalance -= withdrawAmount;
          const adminResWithdraw = await axios.put(`wallet/update/${1}`, {
            balance: adminBalance,
          });
          setWalletAdmin(adminResWithdraw.data);

          const formattedAdminBalance =
            adminBalancePlus.toLocaleString("vi-VN");

          const transactionTypeWithdraw =
            `Chuyển tiền về của hàng: ${store.namestore} và lấy ${formattedAdminBalance}`.substring(
              0,
              50
            );
          await axios.post(`wallettransaction/create/${1}`, {
            amount: -withdrawAmount,
            transactiontype: transactionTypeWithdraw,
            transactiondate: new Date(),
            user: { id: user.id },
            store: { id: store.id },
          });

          const fillWalletStore = await axios.get(`wallet/${store.user.id}`);
          const transactionStore = await axios.get(
            `wallettransaction/idWalletByIdUSer/${store.user.id}`
          );

          await axios.put(`wallet/update/${store.user.id}`, {
            balance: fillWalletStore.data.balance + withdrawAmount,
          });

          await axios.post(
            `wallettransaction/create/${transactionStore.data.id}`,
            {
              amount: withdrawAmount,
              transactiontype: "Tiền từ PerWatt",
              transactiondate: new Date(),
              user: { id: store.user.id },
            }
          );
        }

        setWallet(res.data);
        handleOrder();
      } else {
        toast.warning("Bạn không đủ tiền trong tài khoản");
      }
    } catch (error) {
      console.error(
        "Error withdrawing money:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const addTransaction = async (amount, transactionType) => {
    const now = new Date();

    try {
      await axios.post(`wallettransaction/create/${wallet.id}`, {
        amount: amount,
        transactiontype: transactionType,
        transactiondate: now,
      });
    } catch (error) {
      console.error(
        "Đã có lỗi xảy ra:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (cartIds) {
        const response = await axios.get(`/cart?id=${cartIds}`);
        setProducts(response.data);
        console.log(response.data);
      }
      const paymentResponse = await axios.get("/paymentMethod");
      setPaymentMethods(paymentResponse.data);

      if (user.id) {
        const shippingInfoResponse = await axios.get(
          `/shippingInfo?userId=${user.id}`
        );
        setShippingInfo(shippingInfoResponse.data);
      }

      const VoucherResponse = await axios.get(
        `/findVoucherByIdUser/${user.id}`
      );
      setVoucher(VoucherResponse.data);
      console.log(VoucherResponse.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [cartIds, user.id]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d$/.test(value) && value !== "") {
      e.target.value = "";
      return;
    }

    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);

    if (index < inputRefs.current.length - 1 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputRefs.current[index].value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // const groupByStore = (products) => {
  //   return products.reduce((groups, product) => {
  //     const storeId = product.productDetail.product.store.id;
  //     if (!groups[storeId]) {
  //       groups[storeId] = {
  //         store: product.productDetail.product.store,
  //         products: [],
  //       };
  //     }
  //     groups[storeId].products.push(product);
  //     return groups;
  //   }, {});
  // };

  const groupByStore = (products) => {
    const groupedProducts = products.reduce((groups, product) => {
      const storeId = product.productDetail.product.store.id;
      const store = product.productDetail.product.store;
      const address = product.productDetail.product.store.address;

      let feeShip = []; // Khởi tạo mảng feeShip
      if (!groups[storeId]) {
        groups[storeId] = {
          store,
          address, // Địa chỉ cửa hàng
          products: [],
          feeShip: feeShip, // Thêm phí ship vào đây
        };
      }
      fetchVouchers(product.productDetail.product.store.slug);
      groups[storeId].products.push(product);
      return groups;
    }, {});
    return groupedProducts;
  };
  const fetchVouchers = async (slugStore) => {
    try {
      const response = await axios.get(`fillVoucherShop/${slugStore}`);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  // useEffect(() => {
  //   const addresses = products.reduce((addresses, product) => {
  //     const address = product.productDetail.product.store.user.address;
  //     if (!addresses.includes(address)) {
  //       addresses.push(address);
  //     }
  //     return addresses;
  //   }, []);

  //   setStoreAddress(addresses); // Chỉ gọi setStoreAddress một lần
  // }, [products, selectedShippingInfo]); // useEffect chỉ chạy khi products thay đổi

  const groupedProducts = groupByStore(products);

  const handlePayment = async () => {
    try {
      const totalAmount = Object.values(groupedProducts).reduce(
        (sum, { products }) => {
          return (
            sum +
            products.reduce((productSum, product) => {
              return (
                productSum + product.productDetail.price * product.quantity
              );
            }, 0)
          );
        },
        0
      );

      const productList = Object.values(groupedProducts).flatMap(
        ({ products }) =>
          products.map((product) => ({
            name: product.productDetail.product.name,
            quantity: product.quantity,
          }))
      );

      const response = await axios.post("/api/payment/create_payment", {
        amount: totalAmount,
        products: productList,
        ids: cartIds,
        address: selectedShippingInfo,
      });
      console.log(totalAmount);

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error redirecting to payment URL:", error);
      toast.error("Có lỗi xảy ra khi chuyển hướng thanh toán.");
    }
  };

  const handleOrder = async () => {
    try {
      if (!selectedShippingInfo) {
        toast.error("Vui lòng chọn địa chỉ nhận hàng!");
        return;
      }

      const groupedProducts = groupByStore(products);

      // Kiểm tra nếu số lượng `listFee` không khớp với số lượng cửa hàng
      if (listFee.length !== Object.keys(groupedProducts).length) {
        toast.error("Lỗi tính phí giao hàng, vui lòng thử lại!");
        return;
      }

      let feeIndex = 0; // Dùng để theo dõi phí giao hàng cho từng cửa hàng

      for (const storeId in groupedProducts) {
        const { products: storeProducts } = groupedProducts[storeId];

        const outOfStockProduct = storeProducts.find(
          (product) => product.productDetail.quantity === 0
        );
        if (outOfStockProduct) {
          toast.error(
            "Sản phẩm đã có người mua trước, vui lòng mua sản phẩm khác hoặc mua lại sau"
          );
          return;
        }

        // Tính tổng tiền sản phẩm (bao gồm voucher giảm giá nếu có)
        const totalAmount = storeProducts.reduce((sum, product) => {
          // Kiểm tra và áp dụng voucher nếu có
          const productPrice =
            voucherData.id === product.productDetail.id
              ? product.productDetail.price *
                product.quantity *
                (1 - voucherData.discountprice / 100) // Giảm giá cho sản phẩm có voucher
              : product.productDetail.price * product.quantity; // Không có voucher thì tính bình thường

          return sum + productPrice;
        }, 0);

        const feeShip = listFee[feeIndex]; // Lấy phí ship tương ứng
        const totalAmountOrder = totalAmount + (feeShip || 0);

        const order = {
          user: { id: user.id },
          paymentmethod: { id: selectedPaymentMethod },
          shippinginfor: { id: selectedShippingInfo },
          store: { id: storeId },
          paymentdate: new Date().toISOString(),
          orderstatus: "Đang chờ duyệt",
          totalamount: totalAmountOrder,
        };

        const orderDetails = storeProducts.map((product) => ({
          productDetail: { id: product.productDetail.id },
          quantity: product.quantity,
          price: product.productDetail.price,
          status: "",
        }));

        await axios.post("/api/orderCreate", {
          order,
          orderDetails,
        });

        feeIndex++; // Tăng chỉ số để lấy phí giao hàng tiếp theo
      }

      toast.success("Đặt hàng thành công!");
      navigate("/order");
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
    } catch (error) {
      toast.error("Đặt hàng thất bại!");
    }
  };

  const handleAddAddress = async () => {
    try {
      if (!newAddress.trim()) {
        toast.warning("Vui lòng nhập địa chỉ!");
        return;
      }

      const response = await axios.post("/shippingInfoCreate", {
        address: newAddress,
        user: { id: user.id },
      });

      setShippingInfo([...shippingInfo, response.data]);
      setNewAddress("");
      handleReset();
      toast.success("Thêm địa chỉ thành công!");
    } catch (error) {
      toast.error("Thêm địa chỉ thất bại!");
    }
    loadProducts();
  };

  const handleMomo = async () => {
    const totalAmount = Object.values(groupedProducts).reduce(
      (sum, { products }) => {
        return (
          sum +
          products.reduce((productSum, product) => {
            return productSum + product.productDetail.price * product.quantity;
          }, 0)
        );
      },
      0
    );
    const productList = Object.values(groupedProducts).flatMap(({ products }) =>
      products.map((product) => ({
        name: product.productDetail.product.name,
        quantity: product.quantity,
        id: product.productDetail.id,
      }))
    );

    sessionStorage.setItem("productList", JSON.stringify(productList));
    const data = {
      amount: totalAmount,
      ids: cartIds,
      address: selectedShippingInfo,
    };
    const response = await axios.get("/pay", {
      params: data,
    });
    const paymentUrl = response.data;
    window.location.href = paymentUrl;
  };

  const handleCombinedAction = async () => {
    if (!selectedShippingInfo) {
      toast.warning("Bạn chưa chọn địa chỉ nhận hàng!");
      return;
    } else {
      try {
        if (selectedPaymentMethod === "1") {
          await handleOrder();
        } else if (selectedPaymentMethod === "6") {
          await handlePayment();
        } else if (selectedPaymentMethod === "8") {
          await handleMomo();
        } else if (selectedPaymentMethod === "9") {
          const openModalButton = document.querySelector(
            '[data-bs-toggle="modal"]'
          );
          if (openModalButton) {
            openModalButton.click();
          }
        } else {
          toast.error("Vui lòng chọn phương thức thanh toán!");
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi thực hiện các chức năng:", error);
        toast.error("Có lỗi xảy ra khi thực hiện các chức năng.");
      }
    }
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  useEffect(() => {
    const calculatedTotalAmountBeforeDiscount = Object.values(
      groupedProducts
    ).reduce((sum, { products }) => {
      return (
        sum +
        products.reduce((productSum, product) => {
          const productPrice = product.productDetail.price;
          const productQuantity = product.quantity;

          // Tính tổng tiền chưa giảm giá (không áp dụng voucher)
          return productSum + productPrice * productQuantity;
        }, 0)
      );
    }, 0);

    // Lưu tổng tiền chưa giảm giá vào state

    // const calculatedTotalAmountAfterDiscount = Object.values(
    //   groupedProducts
    // ).reduce((sum, { products }) => {
    //   return (
    //     sum +
    //     products.reduce((productSum, product) => {
    //       const productPrice = product.productDetail.price;
    //       const productQuantity = product.quantity;

    //       // Kiểm tra voucher và áp dụng giảm giá
    //       const priceAfterDiscount =
    //         voucherData.id === product.productDetail.id
    //           ? productPrice *
    //             productQuantity *
    //             (1 - voucherData.discountprice / 100)
    //           : productPrice * productQuantity;

    //       return productSum + priceAfterDiscount;
    //     }, 0)
    //   );
    // }, 0);

    const calculatedTotalAmountAfterDiscount = Object.values(
      groupedProducts
    ).reduce((sum, { products }) => {
      return (
        sum +
        products.reduce((productSum, product) => {
          const productPrice = product.productDetail.price;
          const productQuantity = product.quantity;

          // Kiểm tra tất cả các voucher và áp dụng giảm giá
          let priceAfterDiscount = productPrice * productQuantity;

          // Duyệt qua tất cả các voucher đã chọn và áp dụng giảm giá
          voucherData.id.forEach((voucherId, index) => {
            // Kiểm tra xem sản phẩm có thể áp dụng voucher này không
            if (voucherId === product.productDetail.id) {
              const discount = voucherData.discountprice[index]; // Lấy discountprice tương ứng
              priceAfterDiscount *= 1 - discount / 100; // Áp dụng giảm giá
            }
          });

          return productSum + priceAfterDiscount;
        }, 0)
      );
    }, 0);

    // Lưu tổng tiền đã áp dụng giảm giá vào state
    setTotalAmountProduct(calculatedTotalAmountBeforeDiscount); // Thêm phí vận chuyển vào tổng tiền
    setVoucherS(
      calculatedTotalAmountAfterDiscount - calculatedTotalAmountBeforeDiscount
    );
    setFinalAmout(calculatedTotalAmountAfterDiscount + shippingFee);
    console.log(calculatedTotalAmountBeforeDiscount);
    console.log(
      calculatedTotalAmountAfterDiscount - calculatedTotalAmountBeforeDiscount
    );
    console.log(calculatedTotalAmountAfterDiscount);
  }, [groupedProducts, voucherData, shippingFee]); // Tính lại khi có sự thay đổi về groupedProducts, voucherData hoặc shippingFee

  // Hàm lấy phần cuối của địa chỉ
  const getLastPartOfAddress = (address) => {
    const parts = address.split(","); // Chia chuỗi theo dấu phẩy
    return parts[parts.length - 1].trim(); // Lấy phần tử cuối cùng và loại bỏ khoảng trắng
  };

  // Hàm chuyển địa chỉ thành tọa độ
  const getCoordinatesFromAddress = async (address) => {
    const lastPart = getLastPartOfAddress(address); // Lấy phần cuối của địa chỉ
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${lastPart}`;

    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        console.log("Không tìm thấy tọa độ cho địa chỉ này");
        return null;
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      return null;
    }
  };

  // Hàm tính khoảng cách giữa hai tọa độ
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Bán kính trái đất (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Khoảng cách tính được (km)
    return distance;
  };

  // Hàm tính phí ship
  const calculateShippingFee = (distance) => {
    const baseFee = 5000; // Phí cố định cho 0-5 km
    const additionalFeePerKm = 100; // Phí cho mỗi km sau 5 km
    const maxFee = 200000; // Phí tối đa (tối đa cho các chuyến giao hàng xa)

    let fee = baseFee; // Bắt đầu với phí cơ bản

    if (distance > 5) {
      // Tính phí cho các km vượt qua 5 km
      const additionalDistance = distance - 5;
      fee += additionalDistance * additionalFeePerKm;
    }

    // Nếu phí tính ra vượt quá mức phí tối đa, áp dụng phí tối đa
    if (fee > maxFee) {
      fee = maxFee;
    }

    // Làm tròn phí
    return Math.round(fee);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCalculateShipping = async (idShipping) => {
    setSelectedShippingInfo(idShipping);

    const selectedShipping = shippingInfo.find(
      (shipping) => shipping.id === idShipping
    );
    if (!selectedShipping) {
      return;
    }
    if (!idShipping) {
      return;
    }
    setOpen(true);

    setIsLoadingShipping(true); // Bắt đầu tính toán, set trạng thái loading

    const userCoords = await getCoordinatesFromAddress(
      selectedShipping.address
    ); // Sử dụng địa chỉ người dùng

    const updatedGroupedProducts = { ...groupedProducts }; // Tạo bản sao để cập nhật
    let totalShippingFee = 0;
    await Promise.all(
      Object.keys(updatedGroupedProducts).map(async (storeId) => {
        const storeGroup = updatedGroupedProducts[storeId];
        const parts = storeGroup.address.split(",");
        const storeCoords = await getCoordinatesFromAddress(
          parts[parts.length - 1].trim()
        );

        if (userCoords && storeCoords) {
          const { lat: userLat, lon: userLon } = userCoords;
          const { lat: storeLat, lon: storeLon } = storeCoords;

          const distance = calculateDistance(
            userLat,
            userLon,
            storeLat,
            storeLon
          );
          const fee = calculateShippingFee(distance);

          storeGroup.feeShip.push(fee);

          totalShippingFee += fee;
          setListFee((prevFees) =>
            Array.isArray(prevFees) ? [...prevFees, fee] : [fee]
          );
        } else {
          toast.error("Server tính tiền ship không phản hồi");
        }
      })
    );

    setGroupedProducts(updatedGroupedProducts); // Cập nhật state của groupedProducts
    setShippingFee(totalShippingFee);

    setIsLoadingShipping(false);
    setOpen(false);
  };

  const [groupedProductss, setGroupedProducts] = useState([]);

  useEffect(() => {
    setGroupedProducts(groupByStore(products));
  }, [products]);

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
          Object.keys(groupedProductss).map((storeId) => {
            const {
              store,
              products: storeProducts,
              feeShip,
            } = groupedProductss[storeId];

            const totalAmount = storeProducts.reduce(
              (sum, cart) => sum + cart.productDetail.price * cart.quantity,
              0
            );

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
                      alt=""
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
                              <div
                                className="modal fade"
                                id="exampleModal"
                                tabIndex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Thanh toán bằng PerPay
                                      </h1>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div className="modal-body">
                                      Số tiền thanh toán:{" "}
                                      {formatPrice(finalAmout) + " VNĐ"}
                                      <div>
                                        Số dư PerPay:{" "}
                                        {formatPrice(wallet.balance) + " VNĐ"}
                                      </div>
                                      <div className="row mt-3">
                                        {[...Array(6)].map((_, index) => (
                                          <div className="col-2" key={index}>
                                            <input
                                              className="form-control"
                                              type="text"
                                              maxLength="1"
                                              ref={(el) =>
                                                (inputRefs.current[index] = el)
                                              }
                                              onChange={(e) =>
                                                handleInputChange(e, index)
                                              }
                                              onKeyDown={(e) =>
                                                handleKeyDown(e, index)
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                      <Button
                                        variant="contained"
                                        style={{
                                          width: "auto",
                                          backgroundColor: "rgb(218, 255, 180)",
                                          color: "rgb(45, 91, 0)",
                                        }}
                                        onClick={() =>
                                          handleWithdraw(
                                            storeProducts.reduce(
                                              (sum, detail) =>
                                                sum +
                                                detail.productDetail.price *
                                                  detail.quantity,
                                              0
                                            )
                                          )
                                        }
                                        disableElevation
                                      >
                                        Xác nhận
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-3">
                                Giá:{" "}
                                {formatPrice(cart.productDetail.price) + " VNĐ"}
                              </div>
                              <div className="col-2">
                                Số lượng: {cart.quantity}
                              </div>
                              {/* <div className="col-7">
                                Thành tiền:{" "}
                                {voucherData.id === cart.productDetail.id ? (
                                  <>
                                    <del style={{ fontSize: "14px" }}>
                                      {formatPrice(
                                        cart.productDetail.price * cart.quantity
                                      )}{" "}
                                      VNĐ
                                    </del>{" "}
                                    {formatPrice(
                                      cart.productDetail.price *
                                        cart.quantity *
                                        (1 - voucherData.discountprice / 100)
                                    )}{" "}
                                    VNĐ
                                  </>
                                ) : (
                                  <>
                                    {formatPrice(
                                      cart.productDetail.price * cart.quantity
                                    ) + " VNĐ"}
                                  </>
                                )}
                              </div> */}

                              <div className="col-7">
                                Thành tiền:{" "}
                                {voucherData.id.length > 0 &&
                                voucherData.id.includes(
                                  cart.productDetail.id
                                ) ? (
                                  <>
                                    <del style={{ fontSize: "14px" }}>
                                      {formatPrice(
                                        cart.productDetail.price * cart.quantity
                                      )}{" "}
                                      VNĐ
                                    </del>{" "}
                                    {voucherData.id.reduce(
                                      (
                                        priceAfterDiscount,
                                        voucherId,
                                        index
                                      ) => {
                                        // Kiểm tra xem sản phẩm có thể áp dụng voucher này không
                                        if (
                                          voucherId === cart.productDetail.id
                                        ) {
                                          const discount =
                                            voucherData.discountprice[index]; // Lấy discountprice tương ứng
                                          return (
                                            priceAfterDiscount *
                                            (1 - discount / 100)
                                          ); // Áp dụng giảm giá
                                        }
                                        return priceAfterDiscount;
                                      },
                                      cart.productDetail.price * cart.quantity
                                    )}
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
                  <Backdrop
                    sx={(theme) => ({
                      color: "#fff",
                      zIndex: theme.zIndex.drawer + 1,
                    })}
                    open={open}
                    onClick={handleClose}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                  <div className="col-lg-11 col-md-12">
                    <div className="d-flex justify-content-between mt-3">
                      {/* <FormControl size="small" sx={{ width: "30%" }}>
                        <InputLabel id="address-select-label">
                          Voucher
                        </InputLabel>
                        <Select
                          labelId="address-select-label"
                          id="address-select"
                          value={voucherData.id} // Giá trị là mảng của các id đã chọn
                          label="Voucher"
                          multiple
                          onChange={(e) => {
                            const selectedVoucherIds = e.target.value; // Lấy danh sách các id voucher đã chọn
                            const selectedVouchers = voucher.filter((v) =>
                              selectedVoucherIds.includes(
                                v.voucher.productDetail.id
                              )
                            );

                            // Tìm tất cả các voucher có cùng vouchername với những voucher đã chọn
                            const selectedVoucherNames = selectedVouchers.map(
                              (selectedVoucher) =>
                                selectedVoucher.voucher.vouchername
                            );

                            // Lọc ra tất cả các voucher có vouchername trùng với những voucher đã chọn
                            const allSelectedVouchers = voucher.filter(
                              (voucherItem) =>
                                selectedVoucherNames.includes(
                                  voucherItem.voucher.vouchername
                                )
                            );

                            // Lưu mảng các id và discountprice của các voucher đã chọn
                            setVoucherData({
                              id: allSelectedVouchers.map(
                                (v) => v.voucher.productDetail.id
                              ), // Lưu mảng các id voucher
                              discountprice: allSelectedVouchers.map(
                                (selectedVoucher) =>
                                  selectedVoucher.voucher.discountprice
                              ), // Lưu mảng discountprice của các voucher đã chọn
                            });
                          }}
                        >
                          {voucher.length === 0 ? (
                            <MenuItem disabled>
                              Hiện tại bạn chưa có voucher nào
                            </MenuItem>
                          ) : (
                            voucher.map((voucherItem) => (
                              <MenuItem
                                key={voucherItem.id}
                                value={voucherItem.voucher.productDetail.id}
                              >
                                {voucherItem.voucher.vouchername}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl> */}
                      <FormControl size="small" sx={{ width: "30%" }}>
                        <InputLabel id="address-select-label">
                          Voucher
                        </InputLabel>
                        <Select
                          labelId="address-select-label"
                          id="address-select"
                          value={voucherData.id} // Giá trị là mảng của các id đã chọn
                          label="Voucher"
                          multiple
                          onChange={(e) => {
                            const selectedVoucherIds = e.target.value; // Lấy danh sách các id voucher đã chọn
                            const selectedVouchers = voucher.filter((v) =>
                              selectedVoucherIds.includes(
                                v.voucher.productDetail.id
                              )
                            );

                            // Tìm tất cả các voucher có cùng vouchername với những voucher đã chọn
                            const selectedVoucherNames = selectedVouchers.map(
                              (selectedVoucher) =>
                                selectedVoucher.voucher.vouchername
                            );

                            // Lọc ra tất cả các voucher có vouchername trùng với những voucher đã chọn
                            const allSelectedVouchers = voucher.filter(
                              (voucherItem) =>
                                selectedVoucherNames.includes(
                                  voucherItem.voucher.vouchername
                                )
                            );

                            // Lưu mảng các id và discountprice của các voucher đã chọn
                            setVoucherData({
                              id: allSelectedVouchers.map(
                                (v) => v.voucher.productDetail.id
                              ), // Lưu mảng các id voucher
                              discountprice: allSelectedVouchers.map(
                                (selectedVoucher) =>
                                  selectedVoucher.voucher.discountprice
                              ), // Lưu mảng discountprice của các voucher đã chọn
                            });
                          }}
                        >
                          {voucher.length === 0 ? (
                            <MenuItem disabled>
                              Hiện tại bạn chưa có voucher nào
                            </MenuItem>
                          ) : (
                            // Sử dụng Set để loại bỏ các voucher trùng lặp theo vouchername
                            Array.from(
                              new Set(
                                voucher.map(
                                  (voucherItem) =>
                                    voucherItem.voucher.vouchername
                                )
                              )
                            ).map((voucherName) => {
                              // Lọc ra tất cả các voucher có vouchername tương ứng
                              const vouchersWithSameName = voucher.filter(
                                (voucherItem) =>
                                  voucherItem.voucher.vouchername ===
                                  voucherName
                              );

                              return (
                                <MenuItem
                                  key={voucherName}
                                  value={
                                    vouchersWithSameName[0].voucher
                                      .productDetail.id
                                  } // Chỉ lấy id của voucher đầu tiên
                                >
                                  {voucherName} {" giám giá "}
                                  {
                                    vouchersWithSameName[0].voucher
                                      .discountprice
                                  }{" "}
                                  %
                                </MenuItem>
                              );
                            })
                          )}
                        </Select>
                      </FormControl>

                      <div>
                        <div className="d-flex justify-content-end">
                          Tổng tiền:{" "}
                          {/* {formatPrice(
                            storeProducts.reduce((total, cart) => {
                              return (
                                total +
                                (voucherData.id === cart.productDetail.id
                                  ? cart.productDetail.price *
                                    cart.quantity *
                                    (1 - voucherData.discountprice / 100)
                                  : cart.productDetail.price * cart.quantity)
                              );
                            }, 0)
                          )} */}
                          {formatPrice(
                            storeProducts.reduce((total, cart) => {
                              const productPrice = cart.productDetail.price;
                              const productQuantity = cart.quantity;

                              // Kiểm tra và áp dụng tất cả các voucher đã chọn
                              let priceAfterDiscount =
                                productPrice * productQuantity;

                              // Duyệt qua tất cả các voucher đã chọn và áp dụng giảm giá
                              voucherData.id.forEach((voucherId, index) => {
                                if (voucherId === cart.productDetail.id) {
                                  const discount =
                                    voucherData.discountprice[index]; // Lấy discountprice tương ứng
                                  priceAfterDiscount *= 1 - discount / 100; // Áp dụng giảm giá cho giá sản phẩm
                                }
                              });

                              return total + priceAfterDiscount;
                            }, 0)
                          )}
                          {" VNĐ"}
                        </div>
                        <div className="d-flex justify-content-end">
                          Phí ship:{" "}
                          {isLoadingShipping
                            ? "Đang tính phí ship..."
                            : `${formatPrice(feeShip)} VNĐ`}
                        </div>
                        <div className="d-flex justify-content-end">
                          Tổng thanh toán:{" "}
                          {/* {formatPrice(
                            storeProducts.reduce((total, cart) => {
                              return (
                                total +
                                (voucherData.id === cart.productDetail.id
                                  ? cart.productDetail.price *
                                    cart.quantity *
                                    (1 - voucherData.discountprice / 100)
                                  : cart.productDetail.price * cart.quantity)
                              );
                            }, 0) + Number(feeShip)
                          )}{" "} */}
                          {formatPrice(
                            storeProducts.reduce((total, cart) => {
                              const productPrice = cart.productDetail.price;
                              const productQuantity = cart.quantity;

                              // Tính toán giá trị sau khi áp dụng tất cả các voucher đã chọn
                              let priceAfterDiscount =
                                productPrice * productQuantity;

                              // Duyệt qua tất cả các voucher đã chọn và áp dụng giảm giá
                              voucherData.id.forEach((voucherId, index) => {
                                if (voucherId === cart.productDetail.id) {
                                  const discount =
                                    voucherData.discountprice[index]; // Lấy discountprice tương ứng
                                  priceAfterDiscount *= 1 - discount / 100; // Áp dụng giảm giá cho sản phẩm
                                }
                              });

                              // Cộng dồn giá trị sau giảm giá vào tổng
                              return total + priceAfterDiscount;
                            }, 0) + Number(feeShip) // Cộng phí ship vào tổng
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
                          : method.type === "Thanh toán bằng PerPay"
                          ? "PerPay.png"
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
              <div className="d-flex">
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
                      handleCalculateShipping(e.target.value);
                    }}
                  >
                    {shippingInfo.map((shipping) => (
                      <MenuItem key={shipping.id} value={shipping.id}>
                        {/* {shipping.user.fullname} <br />
                        {shipping.user.phone ? (
                          <>
                            {shipping.user.phone}
                            <br />
                          </>
                        ) : (
                          ""
                        )} */}
                        {shipping.address}
                      </MenuItem>
                    ))}
                    <MenuItem>
                      <Button
                        variant="contained"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                        style={{
                          width: "100%",
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                          textAlign: "right",
                        }}
                        disableElevation
                      >
                        <i className="bi bi-plus"></i> Thêm địa chỉ mới
                      </Button>
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="mt-3"></div>
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
                    {/* <input
                      type="text"
                      className="form-control mb-3"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Địa chỉ mới"
                      readOnly
                    /> */}
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
                        setNewAddress(`${newHome}, ${fullAddress}`);
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
                          setNewAddress(`${newHome} ${newAddress}`);
                          setNewHome(""); // Xoá input sau khi nhấn Enter
                        }
                      }}
                    />

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
                        Thêm
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
                <span>Phí ship:</span>
                <span>
                  {isLoadingShipping
                    ? "Đang tính phí ship..."
                    : `${formatPrice(shippingFee)} VNĐ`}
                </span>
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
                  {isLoadingShipping
                    ? "Đang tính thành tiền..."
                    : `${formatPrice(finalAmout)} VNĐ`}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                component={Link}
                to="/wallet/buyer"
                sx={{
                  width: "auto",
                  backgroundColor: "rgb(218, 255, 180)",
                  color: "rgb(45, 91, 0)",
                  "&:hover": {
                    backgroundColor: "rgb(218, 255, 180)",
                    color: "rgb(45, 91, 0)",
                  },
                }}
                className="ms-2 me-3"
                disableElevation
              >
                <i className="bi bi-wallet2"></i>
              </Button>

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
                Đặt hàng
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
