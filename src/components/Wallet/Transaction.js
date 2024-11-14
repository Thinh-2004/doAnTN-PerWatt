<<<<<<< HEAD
import React, { useEffect, useRef, useState } from "react";
=======
import React, { useState } from "react";
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
import axios from "../../Localhost/Custumize-axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import { useParams, Link } from "react-router-dom";
<<<<<<< HEAD
import { Button } from "@mui/material";
=======
import { Button, Card, CardContent, TextField } from "@mui/material";
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Transaction = () => {
<<<<<<< HEAD
  const [depositAmount, setDepositAmount] = useState("");
  const [formattedDepositAmount, setFormattedDepositAmount] = useState("");

  const [wallet, setWallet] = useState("");
=======
  const [depositAmount, setDepositAmount] = useState(0);
  const [formattedDepositAmount, setFormattedDepositAmount] = useState("");

>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
  const { status } = useParams();
  const [selectedValue, setSelectedValue] = useState("");

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const statusWallet = localStorage.getItem("status")
    ? JSON.parse(localStorage.getItem("status"))
    : null;
  const walletLink =
    statusWallet === "seller"
      ? "/profileMarket/wallet/seller"
<<<<<<< HEAD
      : "/wallet/buyer";
=======
      : user.id === 1 ? "/admin/wallet" :"/wallet/buyer";
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d

  //Nạp
  const handlePerPay = async () => {
    try {
<<<<<<< HEAD
      if (depositAmount < 1000 || depositAmount > 10000000) {
        toast.warning(
          "Vui lòng nhập số tiền tối thiểu 1000 VNĐ và tối đa 10.000.000 VNĐ!"
=======
      if (depositAmount < 10000 || depositAmount > 10000000) {
        toast.warning(
          "Vui lòng nhập số tiền tối thiểu 10.000 VNĐ và tối đa 10.000.000 VNĐ!"
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
        );
        return;
      }

      if (!selectedValue) {
        toast.warning("Bạn chưa chọn ngân hàng cần nạp tiền");
        return;
      }

<<<<<<< HEAD
      // const res = await axios.put(`wallet/update/${user.id}`, {
      //   balance: newBalance,
      // });

      // setWallet(res.data);
      // setDepositAmount("");
      // addTransaction(depositAmount, "Nạp tiền");
=======
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
      sessionStorage.setItem("depositAmount", "Nạp tiền");

      const vnPay = await axios.post("/api/payment/create_payment", {
        amount: depositAmount,
      });

      window.location.href = vnPay.data.url;
<<<<<<< HEAD

      toast.success("Nạp tiền thành công");
      // const closeModalButton = document.querySelector(
      //   '[data-bs-dismiss="modal"]'
      // );
      // if (closeModalButton) {
      //   closeModalButton.click();
      // }
      // navigate(walletLink);
=======
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
    } catch (error) {
      console.error(
        "Error depositing money:",
        error.response ? error.response.data : error.message
      );
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
    }
    const closeModalButton = document.querySelector(
      '[data-bs-dismiss="modal"]'
    );
    if (closeModalButton) {
      closeModalButton.click();
    }
  };

<<<<<<< HEAD
  const addTransaction = async (amount, transactionType) => {
    const now = new Date();
    const adjustedAmount = transactionType === "Rút tiền" ? -amount : amount;

    try {
      const response = await axios.post(
        `wallettransaction/create/${wallet.id}`,
        {
          amount: adjustedAmount,
          transactiontype: transactionType,
          transactiondate: now,
          user: { id: user.id },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(
        "Đã có lỗi xảy ra:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`wallet/${user.id}`);
      setWallet(res.data);
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

  const handleDepositAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
=======


  const handleDepositAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    console.log(value);
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
    setDepositAmount(value);
    setFormattedDepositAmount(formatPrice(value));
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
<<<<<<< HEAD
      {status === "seller" ? null : <Header />}
=======
      {status === "seller" || user.id === 1 ? null : <Header />}
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
      <h1 className="text-center mt-4 mb-4">Nạp tiền</h1>
      <div
        className="col-12 col-md-12 col-lg-10 offset-lg-1 mt-3"
        style={{ transition: "0.5s" }}
      >
<<<<<<< HEAD
        <div className="card">
          <div className="card-body">
=======
        <Card
          className="rounded-3"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <CardContent className="">
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
            <Button
              variant="contained"
              component={Link}
              style={{
                width: "auto",
                backgroundColor: "rgb(204,244,255)",
                color: "rgb(0,70,89)",
              }}
              to={walletLink}
              disableElevation
            >
              <i className="bi bi-caret-left-fill"></i>{" "}
            </Button>

            <hr />
            <div className="row">
              <div className="col-6">
                <div>
                  <div>
                    <h4>Nạp tiền</h4>
<<<<<<< HEAD
                    <input
                      className="form-control"
                      type="text"
                      value={formattedDepositAmount}
                      onChange={handleDepositAmountChange}
                      placeholder="Nhập số tiền để nạp"
=======
                    <TextField
                      id="outlined-basic"
                      // label="Nạp tiền"
                      variant="outlined"
                      value={formattedDepositAmount}
                      onChange={handleDepositAmountChange}
                      placeholder="Nhập số tiền để nạp"
                      fullWidth
                      size="small"

>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <h4>Chọn ví</h4>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Chọn ngân hàng
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedValue}
                      onChange={handleRadioChange}
                      label="Chọn ngân hàng"
                    >
                      <MenuItem value="vnPay">
                        <img
                          className="me-2 rounded-3"
                          src={`/images/VNPay.png`}
                          style={{ width: "40px" }}
                          alt="VN Pay"
                        />
                        VN Pay
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <div>
                  <button
                    className="btn btn w-100 mt-3"
                    onClick={handlePerPay}
                    style={{
                      backgroundColor: "rgb(218, 255, 180)",
                      color: "rgb(45, 91, 0)",
                      border: "none",
                    }}
                    disabled={!depositAmount || !selectedValue}
                  >
                    Nạp tiền
                  </button>
                </div>
              </div>
            </div>
<<<<<<< HEAD
          </div>
        </div>
=======
          </CardContent>
        </Card>
>>>>>>> e73760dd1189295936e71b2db90b88646e0dfd3d
      </div>
      {status === "seller" ? null : <Footer />}
    </div>
  );
};

export default Transaction;
