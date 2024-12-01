import React, { useEffect, useRef, useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { format } from "date-fns";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

import { Button, Card, CardContent, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [walletTransactions, setWalletTransactions] = useState(null);
  // const inputRefs = useRef([]);
  // const [inputValues, setInputValues] = useState(Array(6).fill(""));
  const { status } = useParams();
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [withdraw, setWithdraw] = useState(false);
  const [value, setValue] = useState(["", "", "", "", "", ""]);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const newValue = [...value];
    newValue[index] = e.target.value.slice(0, 1); // Chỉ cho phép 1 ký tự
    setValue(newValue);

    if (e.target.value && index < 5) {
      document.getElementById(`pin-${index + 1}`).focus();
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
  const handleConfirmWithdrawa = async () => {
    if (!accountNumber && !recipientName && !withdrawAmount && !selectedBank) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const cleanAccountNumber = accountNumber.replace(/\s+/g, "");

    if (cleanAccountNumber.length !== 12 || isNaN(cleanAccountNumber)) {
      toast.warning("Số tài khoản phải có 12 chữ số.");
      return;
    }

    if (!recipientName) {
      toast.warning("Vui lòng nhập tên người nhận");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount < 10000 || amount > 10000000 || !amount) {
      toast.warning("Số tiền rút phải từ 10,000 VNĐ đến 10,000,000 VNĐ.");
      return;
    }
    const resWallet = await axios.get(`wallet/${user.id}`);
    if (resWallet.data.balance < withdrawAmount) {
      toast.warning(
        "Số dư tài khoản của bạn không đủ để thực hiện giao dịch này!"
      );
      return;
    }

    if (selectedBank < 1 || !selectedBank) {
      toast.warning("Bạn chưa nhập ngân hàng cần chuyển tiền vào");
      return;
    }

    if (value.join("").length === 6) {
      try {
        const response = await axios.get(`/wallet/${user.id}`);
        const passcodeFromAPI = String(response.data.passcode).trim();
        const enteredPin = value.join("");

        if (passcodeFromAPI === enteredPin) {
        } else {
          toast.warning("Mã PIN không chính xác");
          return;
        }
      } catch (error) {
        toast.error("Lỗi xác minh mã PIN cũ! " + error.message);
        return;
      }
    } else {
      toast.warning("Vui lòng nhập đủ 6 ký tự");
      return;
    }
    try {
      const newBalance =
        parseFloat(resWallet.data.balance) - parseFloat(withdrawAmount);

      await axios.put(`wallet/update/${user.id}`, {
        balance: newBalance,
      });

      await axios.post(`wallettransaction/create/${resWallet.data.id}`, {
        amount: -withdrawAmount,
        transactiontype: "Rút tiền qua ngân hàng",
        transactiondate: new Date(),
        user: { id: user.id },
      });
      handleClear1();
      fetchWallet();
      toast.success("Xác nhận thành công!");
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
    } catch (error) {
      console.error(
        "Error depositing money:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleClear1 = () => {
    setAccountNumber("");
    setRecipientName("");
    setWithdrawAmount("");
    setSelectedBank("");
    setValue(["", "", "", "", "", ""]);
  };
  const handleAccountNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Chỉ giữ số
    if (value.length > 12) value = value.slice(0, 12); // Giới hạn 12 ký tự
    value = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Thêm dấu cách mỗi 4 số
    setAccountNumber(value);
  };

  const handleOrderOnTheWay = () => {
    confirmAlert({
      title: "Bạn chưa có ví bạn có muốn tạo ví không!",
      message: "Bạn có muốn tạo ví không!",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            navigate("/pinCode");
          },
        },
        { label: "Không" },
      ],
    });
  };

  const fetchWalletTran = async () => {
    try {
      const res = await axios.get(`wallettransaction/${wallet.id}`);
      setWalletTransactions(res.data);
    } catch (error) {
      console.error(
        "Error fetching wallet data:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // const handleInputChange = (e, index) => {
  //   const value = e.target.value;

  //   if (!/^\d$/.test(value) && value !== "") {
  //     e.target.value = "";
  //     return;
  //   }

  //   const newValues = [...inputValues];
  //   newValues[index] = value;
  //   setInputValues(newValues);

  //   if (index < inputRefs.current.length - 1 && value) {
  //     inputRefs.current[index + 1].focus();
  //   }
  // };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchWallet();
    }
    if (status === "seller") {
      localStorage.setItem("status", JSON.stringify(status));
    } else {
      localStorage.setItem("status", JSON.stringify("buyer"));
    }
  }, [user.id]);

  useEffect(() => {
    if (wallet) {
      fetchWalletTran();
    }
  }, [wallet]);

  const formatPrice = (value) => {
    if (!value) return "0";
    return Number(value).toLocaleString("vi-VN");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm:ss dd/MM/yyyy");
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      console.log(wallet);
      if (wallet === null) {
        handleOrderOnTheWay();
      }
    }, 100);

    return () => clearTimeout(delay);
  }, [wallet]);

  return (
    <>
      {status === "seller" ? null : user.id === 1 ? <Header /> : <Header />}
      <h1 className="text-center mt-4 mb-4">PerPay</h1>
      <div
        className={`col-12 col-md-12 ${
          status === "seller" ? "col-lg-12" : "offset-lg-1 col-lg-10"
        } mt-3`}
        style={{ transition: "0.5s" }}
      >
        <Card
          className="rounded-3"
          sx={{
            backgroundColor: "backgroundElement.children",
            boxShadow: "none",
          }}
        >
          <CardContent>
            <div className="row">
              <div className="col-6">
                {wallet ? (
                  <div>
                    <div className="row">
                      <div className="col-6">
                        <strong>Tên người dùng:</strong>
                        <div>{wallet.user.fullname}</div>
                      </div>

                      <div className="col-6">
                        <strong>Số dư:</strong>
                        <div className="text-success">
                          {formatPrice(wallet.balance)} VNĐ
                        </div>
                      </div>
                      <div className="col-6">
                        <Button
                          variant="contained"
                          className="w-100 mt-3"
                          href="/transaction"
                          style={{
                            backgroundColor: "rgb(204,244,255)",
                            color: "rgb(0,70,89)",
                          }}
                          disableElevation
                        >
                          <i class="bi bi-cash me-2"></i>
                          Nạp tiền
                        </Button>
                      </div>
                      <div className="col-6">
                        <Button
                          variant="contained"
                          className="w-100 mt-3"
                          style={{
                            backgroundColor: "rgb(255, 184, 184)",
                            color: "rgb(198, 0, 0)",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          disableElevation
                        >
                          <i class="bi bi-cash-stack me-2"></i> Rút tiền
                        </Button>
                      </div>
                      <div className="col-6"></div>
                      <div className="col-6 mt-3 d-flex justify-content-end">
                        <a
                          href="/changePinCode"
                          style={{
                            padding: "5px 10px", // Thêm khoảng cách phù hợp xung quanh chữ
                            borderRadius: "10px",
                            backgroundColor: "rgb(218, 255, 180)",
                            color: "rgb(45, 91, 0)",
                            textAlign: "center",
                            display: "inline-block", // Đảm bảo thẻ có kích thước vừa chữ
                          }}
                        >
                          Đổi mã PIN
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <spam className="text-center mt-4 mb-4">
                    Không có thông tin ví
                  </spam>
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                hidden
              ></button>
              <div
                className="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Nhập thông tin rút tiền
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="modal-body">
                        {withdraw === false ? (
                          <>
                            <TextField
                              className="mb-3"
                              fullWidth
                              size="small"
                              label="Nhập số thẻ ngân hàng"
                              variant="outlined"
                              value={accountNumber}
                              onChange={handleAccountNumberChange}
                            />
                            <TextField
                              className="mb-3"
                              fullWidth
                              size="small"
                              label="Nhập tên người nhận"
                              variant="outlined"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                            />
                            <TextField
                              className="mb-3"
                              fullWidth
                              size="small"
                              label="Nhập số tiền cần rút"
                              variant="outlined"
                              value={withdrawAmount}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setWithdrawAmount(value);
                                }
                              }}
                              inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                              }}
                            />

                            <select
                              className="form-select"
                              aria-label="Chọn ngân hàng"
                              value={selectedBank}
                              onChange={(e) => setSelectedBank(e.target.value)}
                            >
                              <option value="" disabled>
                                Chọn ngân hàng cần rút
                              </option>
                              <option value="vietcombank">Vietcombank</option>
                              <option value="agribank">Agribank</option>
                              <option value="techcombank">Techcombank</option>
                              <option value="bidv">BIDV</option>
                              <option value="vietinbank">VietinBank</option>
                              <option value="mbbank">MB Bank</option>
                              <option value="sacombank">Sacombank</option>
                              <option value="acb">ACB</option>
                              <option value="vpbank">VPBank</option>
                              <option value="eximbank">Eximbank</option>
                              <option value="shinhanbank">Shinhan Bank</option>
                            </select>
                            <div
                              className="d-flex justify-content-between mt-3"
                              style={{ maxWidth: "300px", margin: "0 auto" }}
                            >
                              {value.map((val, index) => (
                                <input
                                  key={index}
                                  id={`pin-${index}`}
                                  type="password"
                                  value={val}
                                  onChange={(e) => handleChange(e, index)}
                                  onKeyDown={(e) => handleKeyDown(e, index)}
                                  maxLength="1"
                                  className="form-control text-center border border-dark"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    fontSize: "20px",
                                    backgroundColor: "#f8f9fa",
                                  }}
                                  onFocus={(e) => e.target.select()}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <Button
                        variant="contained"
                        className="me-3"
                        onClick={handleClear1}
                        style={{
                          backgroundColor: "rgb(255, 184, 184)",
                          color: "rgb(198, 0, 0)",
                          display: "inline-block",
                        }}
                        disableElevation
                      >
                        Đặt lại
                      </Button>
                      <Button
                        onClick={handleConfirmWithdrawa}
                        style={{
                          width: "auto",
                          backgroundColor: "rgb(204,244,255)",
                          color: "rgb(0,70,89)",
                        }}
                        disableElevation
                      >
                        Xác nhận
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <h1 className="text-center">Lịch sử giao dịch</h1>
                <Card
                  sx={{
                    backgroundColor: "background.default",
                    boxShadow: "none",
                  }}
                >
                  <CardContent>
                    <div className="d-flex">
                      <div className="col-4">Số tiền</div>
                      <div className="col-4">Ngày giao dịch</div>
                      <div className="col-4">Trạng thái giao dịch</div>
                    </div>
                  </CardContent>
                </Card>
                <div
                  className="mt-3"
                  style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    borderRadius: "5px",
                  }}
                >
                  {walletTransactions && walletTransactions.length > 0 ? (
                    walletTransactions.map((walletTransaction) => (
                      <div key={walletTransaction.id}>
                        <Card
                          className="rounded-3 mb-3"
                          sx={{
                            backgroundColor: "background.default",
                            boxShadow: "none",
                          }}
                        >
                          <CardContent className="">
                            <div className="d-flex">
                              {walletTransaction.user.role.id === 1 ? (
                                <>
                                  <div className="col-3">
                                    <div
                                      className={
                                        walletTransaction.amount < 0
                                          ? "text-danger"
                                          : "text-success"
                                      }
                                    >
                                      {`${formatPrice(
                                        walletTransaction.amount
                                      )} VNĐ`}
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    {formatDate(
                                      walletTransaction.transactiondate
                                    )}
                                  </div>
                                  {walletTransaction.amount < 0 ? (
                                    <div className="col-3">
                                      Gữi từ: {walletTransaction.user.fullname}
                                    </div>
                                  ) : (
                                    <div className="col-3">
                                      Đến: {walletTransaction.store?.namestore}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className="col-4">
                                    <div
                                      className={
                                        walletTransaction.amount < 0
                                          ? "text-danger"
                                          : "text-success"
                                      }
                                    >
                                      {`${formatPrice(
                                        walletTransaction.amount
                                      )} VNĐ`}
                                    </div>
                                  </div>
                                  <div className="col-4">
                                    {formatDate(
                                      walletTransaction.transactiondate
                                    )}
                                  </div>
                                  <div className="col-4">
                                    {walletTransaction.transactiontype}
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div className="text-center mt-4 mb-4">
                      Không có giao dịch nào
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {status === "seller" || user.id === 1 ? null : <Footer />}
    </>
  );
};

export default Wallet;
