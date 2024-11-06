import React, { useEffect, useRef, useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@mui/material";

const Transaction = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [formattedDepositAmount, setFormattedDepositAmount] = useState("");
  const [formattedWithdrawAmount, setFormattedWithdrawAmount] = useState("");

  const [wallet, setWallet] = useState("");
  const { status } = useParams();
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");
  const [inputValues, setInputValues] = useState(Array(6).fill(""));

  const inputRefs = useRef([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

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

  const handlePassCodeDeposit = () => {
    const openModalButton = document.querySelector('[data-bs-toggle="modal"]');
    if (openModalButton) {
      openModalButton.click();
    }
  };

  const handlePassCodeWithdraw = () => {
    const closeModalButton = document.querySelector(
      '[data-bs-dismiss="modal"]'
    );
    if (closeModalButton) {
      closeModalButton.click();
    }
  };

  const statusWallet = localStorage.getItem("status")
    ? JSON.parse(localStorage.getItem("status"))
    : null;
  const walletLink =
    statusWallet === "seller"
      ? "/profileMarket/wallet/seller"
      : "/wallet/buyer";

  //Nạp
  const handleDeposit = async () => {
    try {
      const newBalance = parseFloat(wallet.balance) + parseFloat(depositAmount);

      if (depositAmount < 1000 || depositAmount > 10000000) {
        toast.warning(
          "Vui lòng nhập số tiền tối thiểu 1000 VNĐ và tối đa 10.000.000 VNĐ!"
        );
        return;
      }

      if (!selectedValue) {
        toast.warning("Bạn chưa chọn ngân hàng cần nạp tiền");
        return;
      }

      const resultString = inputValues.join("").toString().trim();
      const walletPasscode = wallet.passcode.toString().trim();

      if (resultString === walletPasscode) {
        const res = await axios.put(`wallet/update/${user.id}`, {
          balance: newBalance,
          passcode: walletPasscode,
        });

        setWallet(res.data);
        setDepositAmount("");
        addTransaction(depositAmount, "Nạp tiền");
        toast.success("Nạp tiền thành công");
        const closeModalButton = document.querySelector(
          '[data-bs-dismiss="modal"]'
        );
        if (closeModalButton) {
          closeModalButton.click();
        }
        navigate(walletLink);
      } else {
        toast.warning("Chưa bạn nhập đúng Passcode");
        const closeModalButton = document.querySelector(
          '[data-bs-dismiss="modal"]'
        );
        if (closeModalButton) {
          closeModalButton.click();
        }
        return;
      }
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
  //Rút
  const handleWithdraw = async () => {
    try {
      const newBalance =
        parseFloat(wallet.balance) - parseFloat(withdrawAmount);

      console.log(wallet.balance);
      console.log(withdrawAmount);

      const lackBalance =
        parseFloat(withdrawAmount) - parseFloat(wallet.balance);

      if (withdrawAmount < 1000 || withdrawAmount > 10000000) {
        toast.warning(
          "Vui lòng nhập số tiền tối thiểu 1000 VNĐ và tối đa 10.000.000 VNĐ!"
        );
        return;
      }

      if (!selectedValue) {
        toast.warning("Bạn chưa chọn ngân hàng cần rút tiền");
        return;
      }
      console.log(newBalance);

      if (newBalance < 0) {
        toast.warning(
          "Bạn còn thiếu " +
            formatPrice(lackBalance) +
            " VNĐ" +
            " để thực hiện giao dịch này!"
        );
        return;
      }
      const resultString = inputValues.join("").toString().trim();
      const walletPasscode = wallet.passcode.toString().trim();

      if (resultString === walletPasscode) {
        const res = await axios.put(`wallet/update/${user.id}`, {
          balance: newBalance,
          passcode: walletPasscode,
        });
        setWallet(res.data);
        setWithdrawAmount("");
        addTransaction(withdrawAmount, "Rút tiền");
        toast.success("Rút tiền thành công");
        const closeModalButton = document.querySelector(
          '[data-bs-dismiss="modal"]'
        );
        if (closeModalButton) {
          closeModalButton.click();
        }
        navigate(walletLink);
      } else {
        toast.warning("Chưa bạn nhập đúng Passcode");
        const closeModalButton = document.querySelector(
          '[data-bs-dismiss="modal"]'
        );
        if (closeModalButton) {
          closeModalButton.click();
        }
        return;
      }
    } catch (error) {
      console.error(
        "Error withdrawing money:",
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
    setDepositAmount(value);
    setFormattedDepositAmount(formatPrice(value));
  };

  const handleWithdrawAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setWithdrawAmount(value);
    setFormattedWithdrawAmount(formatPrice(value));
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
      <Header />
      <h1 className="text-center mt-4 mb-4">
        {status === "deposit" ? "Nạp tiền" : "Rút tiền"}
      </h1>
      <div
        className="col-12 col-md-12 col-lg-10 offset-lg-1 mt-3"
        style={{ transition: "0.5s" }}
      >
        <div className="card">
          <div className="card-body">
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
                {status === "deposit" ? (
                  <div>
                    <div>
                      <h4>Nạp tiền</h4>
                      <input
                        className="form-control"
                        type="text"
                        value={formattedDepositAmount}
                        onChange={handleDepositAmountChange}
                        placeholder="Nhập số tiền để nạp"
                      />
                    </div>
                    <div>
                      <button
                        className="btn btn w-100 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={handlePassCodeDeposit}
                        style={{
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                          border: "none",
                        }}
                        disabled={!depositAmount || !selectedValue}
                      >
                        Nạp tiền
                      </button>

                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1
                                class="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                Vui lòng nhập Passcode
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div class="modal-body">
                              <div className="row">
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
                                      onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button
                                className="btn btn-primary mt-3"
                                onClick={handleDeposit}
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <h4>Rút tiền</h4>
                      <input
                        className="form-control"
                        type="text"
                        value={formattedWithdrawAmount}
                        onChange={handleWithdrawAmountChange}
                        placeholder="Nhập số tiền để rút"
                      />
                    </div>
                    <div>
                      <button
                        className="btn btn w-100 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={handlePassCodeWithdraw}
                        style={{
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                          border: "none",
                        }}
                        disabled={!withdrawAmount || !selectedValue}
                      >
                        Rút tiền
                      </button>

                      <div
                        className="modal fade"
                        id="depositModal"
                        tabIndex="-1"
                        aria-labelledby="depositModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="depositModalLabel"
                              >
                                Vui lòng thêm Passcode
                              </h1>

                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="row">
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
                                      onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                className="btn btn-primary mt-3"
                                onClick={handleDeposit}
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

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
                              <div className="row">
                                <div className="col-12">
                                  <div>
                                    Số dư PerPay:{" "}
                                    {formatPrice(wallet.balance) + " VNĐ"}
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div>
                                    Số tiền cần rút:{" "}
                                    {formatPrice(withdrawAmount) + " VNĐ"}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div class="modal-body">
                              <div className="row">
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
                                      onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button
                                className="btn btn-primary mt-3"
                                onClick={handleWithdraw}
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-6">
                <h4>Chọn ngân hàng</h4>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={selectedValue}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="PerBank"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Transaction;
