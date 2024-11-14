import React, { useEffect, useRef, useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { format } from "date-fns";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Button, Card, CardContent } from "@mui/material";
import { useParams } from "react-router-dom";

const Wallet = () => {
  const [wallet, setWallet] = useState("");
  const [walletAdmin, setWalletAdmin] = useState("");
  const [walletTransactions, setWalletTransactions] = useState(null);
  const [walletTransactionsAdmin, setWalletTransactionsAdmin] = useState(null);
  const inputRefs = useRef([]);
  const [inputValues, setInputValues] = useState(Array(6).fill(""));
  const { status } = useParams();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

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

    try {
      const resAdmin = await axios.get(`wallet/${1}`);
      setWalletAdmin(resAdmin.data);
      console.log(resAdmin.data);
    } catch (error) {
      console.error(
        "Error fetching wallet data:",
        error.response ? error.response.data : error.message
      );
    }
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
    try {
      const resAdmin = await axios.get(`wallettransaction/${1}`);
      setWalletTransactionsAdmin(resAdmin.data);
    } catch (error) {
      console.error(
        "Error fetching wallet data:",
        error.response ? error.response.data : error.message
      );
    }
  };

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

  return (
    <div>
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
          sx={{ backgroundColor: "backgroundElement.children" }}
        >
          <CardContent className="">
            <div className="row">
              <div className="col-6">
                {wallet ? (
                  <div>
                    <div>{"Tên người dùng: " + wallet.user.fullname}</div>
                    <div>
                      {"Số dư: " + formatPrice(wallet.balance) + " VNĐ"}
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <Button
                          variant="contained"
                          className="w-100 mt-3"
                          href="/transaction"
                          style={{
                            backgroundColor: "rgb(218, 255, 180)",
                            color: "rgb(45, 91, 0)",
                          }}
                          disableElevation
                        >
                          Nạp tiền
                        </Button>
                      </div>
                      <div className="col-6" style={{ cursor: "not-allowed" }}>
                        <Button
                          variant="contained"
                          className="w-100 mt-3"
                          style={{
                            backgroundColor: "rgb(255, 184, 184)",
                            color: "rgb(198, 0, 0)",
                            cursor: "not-allowed",
                          }}
                          disableElevation
                          disabled
                        >
                          Rút tiền
                        </Button>
                      </div>
                    </div>
                    <h1>Admin</h1>
                    <div>
                      {"Tên người dùng: " + walletAdmin?.user?.fullname}
                    </div>
                    <div>
                      {"Số dư: " + formatPrice(walletAdmin.balance) + " VNĐ"}
                    </div>
                  </div>
                ) : (
                  <div>Không có thông tin ví</div>
                )}
              </div>
              <div className="col-6">
                <h1 className="text-center">Lịch sử giao dịch</h1>
                <div
                // style={{
                //   maxHeight: "300px",
                //   overflowY: "auto",
                //   borderRadius: "5px",
                // }}
                >
                  {walletTransactions && walletTransactions.length > 0 ? (
                    walletTransactions.map((walletTransaction) => (
                      <div key={walletTransaction.id}>
                        <Card
                          className="rounded-3 mb-3"
                          sx={{
                            backgroundColor: "background.default",
                            boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.1)",
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
                                      <h5
                                        className="modal-title"
                                        id="exampleModalLabel"
                                      >
                                        Modal title
                                      </h5>
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
                                              onKeyDown={(e) =>
                                                handleKeyDown(e, index)
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>{" "}
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                      >
                                        Đóng
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                      >
                                        Lưu thay đổi
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <div>Không có giao dịch nào</div>
                  )}
                  <hr />
                  <h1>Admin</h1>
                  {walletTransactionsAdmin &&
                  walletTransactionsAdmin.length > 0 ? (
                    walletTransactionsAdmin.map((walletTransaction) => (
                      <div key={walletTransaction.id}>
                        <div
                          className="card mb-3"
                          style={{
                            backgroundColor: "rgb(255, 255, 255)",
                            boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <div className="card-body">
                            <div className="d-flex">
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
                                {walletTransaction.amount > 0 ? (
                                  <div className="col-5">
                                    {walletTransaction.transactiontype}
                                  </div>
                                ) : (
                                  <div className="col-5">
                                    {walletTransaction.transactiontype}
                                  </div>
                                )}
                              </>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Không có giao dịch nào</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {status === "seller" || user.id === 1 ? null : <Footer />}
    </div>
  );
};

export default Wallet;
