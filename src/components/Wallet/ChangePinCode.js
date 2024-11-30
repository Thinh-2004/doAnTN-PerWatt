import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const ChangePinCode = () => {
  const [value, setValue] = useState(["", "", "", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", "", "", ""]); // Lưu mã PIN mới
  const [status, setStatus] = useState("Nhập mã PIN cũ");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate();

  // Xử lý thay đổi trong các ô nhập
  const handleChange = (e, index) => {
    const newValue = [...value];
    newValue[index] = e.target.value.slice(0, 1);
    setValue(newValue);

    if (e.target.value && index < 5) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  // Xử lý di chuyển ô nhập khi nhấn Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  // Đặt lại: Xóa nội dung các ô nhập hiện tại
  const handleClear = () => {
    setValue(["", "", "", "", "", ""]);
  };

  // Tạo lại: Reset toàn bộ trạng thái về bước Nhập mã PIN cũ
  const handleRetry = () => {
    setValue(["", "", "", "", "", ""]);
    setStatus("Nhập mã PIN cũ");
    setNewPin(["", "", "", "", "", ""]);
  };

  // Xác nhận mã PIN cũ
  const handleConfirm1 = async () => {
    if (value.join("").length === 6) {
      try {
        const response = await axios.get(`/wallet/${user.id}`);
        const passcodeFromAPI = String(response.data.passcode).trim();
        const enteredPin = value.join("");

        if (passcodeFromAPI === enteredPin) {
          setStatus("Nhập mã PIN mới");
          toast.success("Mã PIN chính xác");
          handleClear();
        } else {
          toast.warning("Mã PIN không chính xác");
          handleClear();
        }
      } catch (error) {
        toast.error("Lỗi xác minh mã PIN cũ! " + error.message);
      }
    } else {
      toast.warning("Vui lòng nhập đủ 6 ký tự");
    }
  };

  const handleConfirmNewPin = async () => {
    if (value.join("").length === 6) {
      const tempNewPin = value; // Biến tạm lưu giá trị mã PIN mới đang nhập
      const response = await axios.get(`/wallet/${user.id}`);

      if (tempNewPin.join("") === String(response.data.passcode).trim()) {
        toast.warning("Mã PIN mới không được trùng với mã PIN cũ");
        handleClear();
        return;
      }

      setNewPin(tempNewPin); // Lưu mã PIN mới vào trạng thái
      setStatus("Xác nhận mã PIN mới");
      handleClear();
    } else {
      toast.warning("Vui lòng nhập đủ 6 ký tự");
    }
  };

  // Xác nhận lần cuối
  const handleConfirm2 = () => {
    if (value.join("").length === 6) {
      if (value.join("") === newPin.join("")) {
        updatePIN();
      } else {
        toast.warning("Mã PIN mới không khớp!");
        handleClear();
      }
    } else {
      toast.warning("Vui lòng nhập đủ 6 ký tự");
    }
  };

  // Gửi mã PIN mới lên server
  const updatePIN = async () => {
    try {
      const pinCode = parseInt(newPin.join(""), 10); // Sử dụng mã PIN mới
      console.log(pinCode);

      // const response = await axios.get(`/wallet/${user.id}`);
      await axios.put(`/wallet/updatePassCode/${user.id}`, {
        passcode: pinCode, // Cập nhật mã PIN mới
      });

      toast.success("Cập nhật mã PIN thành công!");
      navigate("/wallet/buyer");
    } catch (error) {
      console.error("Có lỗi xảy ra khi cập nhật mã PIN:", error);
      toast.error("Cập nhật mã PIN không thành công!");
    }
  };

  return (
    <div>
      <Header />
      <h1 className="text-center mt-4 mb-4">Đổi mã PIN</h1>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <div
          id="smooth"
          className="col-12 col-sm-10 col-md-8 col-lg-4 col-xl-3"
        >
          <div className="card">
            <h3 className="text-center mt-3">{status}</h3>
            <div className="card-body">
              <div
                className="d-flex justify-content-between"
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
              <div className="d-flex justify-content-center mt-3">
                {status === "Nhập mã PIN cũ" ? (
                  <>
                    <Button
                      variant="contained"
                      className="me-3"
                      onClick={handleClear}
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
                      variant="contained"
                      className="me-3"
                      onClick={handleConfirm1}
                      style={{
                        backgroundColor: "rgb(218, 255, 180)",
                        color: "rgb(45, 91, 0)",
                        display: "inline-block",
                      }}
                      disableElevation
                    >
                      Xác nhận
                    </Button>
                  </>
                ) : status === "Nhập mã PIN mới" ? (
                  <>
                    <Button
                      variant="contained"
                      className="me-3"
                      onClick={handleRetry}
                      style={{
                        backgroundColor: "rgb(204,244,255)",
                        color: "rgb(0,70,89)",
                        display: "inline-block",
                      }}
                      disableElevation
                    >
                      Tạo lại
                    </Button>
                    <Button
                      variant="contained"
                      className="me-3"
                      onClick={handleClear}
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
                      variant="contained"
                      onClick={handleConfirmNewPin}
                      style={{
                        backgroundColor: "rgb(218, 255, 180)",
                        color: "rgb(45, 91, 0)",
                        display: "inline-block",
                      }}
                      disableElevation
                    >
                      Xác nhận
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      className="me-3"
                      onClick={handleRetry}
                      style={{
                        backgroundColor: "rgb(204,244,255)",
                        color: "rgb(0,70,89)",
                        display: "inline-block",
                      }}
                      disableElevation
                    >
                      Tạo lại
                    </Button>
                    <Button
                      variant="contained"
                      className="me-3"
                      onClick={handleClear}
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
                      variant="contained"
                      onClick={handleConfirm2}
                      style={{
                        backgroundColor: "rgb(218, 255, 180)",
                        color: "rgb(45, 91, 0)",
                        display: "inline-block",
                      }}
                      disableElevation
                    >
                      Xác nhận
                    </Button>

                    {/* <button
                      className="btn btn-outline-danger me-3"
                      onClick={handleClear}
                    >
                      Đặt lại
                    </button>
                    <button
                      className="btn btn-outline-danger me-3"
                      onClick={handleRetry}
                    >
                      Tạo lại
                    </button>
                    <button className="btn btn-danger" onClick={handleConfirm2}>
                      Xác nhận mã PIN mới
                    </button> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePinCode;
