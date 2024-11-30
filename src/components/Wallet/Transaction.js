import React, { useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import { useParams, Link } from "react-router-dom";
import { Button, Card, CardContent, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Transaction = () => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [formattedDepositAmount, setFormattedDepositAmount] = useState("");

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
      : user.id === 1
      ? "/admin/wallet"
      : "/wallet/buyer";

  //Nạp
  const handlePerPay = async () => {
    try {
      if (depositAmount < 10000 || depositAmount > 10000000) {
        toast.warning(
          "Vui lòng nhập số tiền tối thiểu 10.000 VNĐ và tối đa 10.000.000 VNĐ!"
        );
        return;
      }

      if (!selectedValue) {
        toast.warning("Bạn chưa chọn ngân hàng cần nạp tiền");
        return;
      }

      sessionStorage.setItem("depositAmount", "Nạp tiền");

      const vnPay = await axios.post("/api/payment/create_payment", {
        amount: depositAmount,
      });

      window.location.href = vnPay.data.url;
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

  const handleDepositAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    console.log(value);
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
      {status === "seller" || user.id === 1 ? null : <Header />}
      <h1 className="text-center mt-4 mb-4">Nạp tiền</h1>
      <div
        className="col-12 col-md-12 col-lg-10 offset-lg-1 mt-3"
        style={{ transition: "0.5s" }}
      >
        <Card
          className="rounded-3"
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <CardContent className="">
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
                    <TextField
                      id="outlined-basic"
                      // label="Nạp tiền"
                      variant="outlined"
                      value={formattedDepositAmount}
                      onChange={handleDepositAmountChange}
                      placeholder="Nhập số tiền để nạp"
                      fullWidth
                      size="small"
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
          </CardContent>
        </Card>
      </div>
      {status === "seller" ? null : <Footer />}
    </div>
  );
};

export default Transaction;
