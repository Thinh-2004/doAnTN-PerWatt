import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { toast } from "react-toastify";
import axios from "../../Localhost/Custumize-axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const PinCode = () => {
  const [value, setValue] = useState(["", "", "", "", "", ""]);
  const [valueS, setValueS] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("Nhập mã PIN"); // Trạng thái để hiển thị thông báo
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleChange = (e, index) => {
    const newValue = [...value];
    newValue[index] = e.target.value.slice(0, 1); // Chỉ cho phép 1 ký tự
    setValue(newValue);

    if (e.target.value && index < 5) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  const handleClear2 = () => {
    setStatus("Xác nhận mã pin");
    setValue(["", "", "", "", "", ""]);
  };

  const handleClear1 = () => {
    setStatus("Nhập mã PIN");
    setValue(["", "", "", "", "", ""]);
  };

  const handleConfirm0 = () => {
    setStatus("Nhập mã PIN");
    setValue(["", "", "", "", "", ""]);
    setValueS(["", "", "", "", "", ""]);
  };

  // Hàm khi nhấn nút Xác nhận
  const handleConfirm1 = () => {
    if (value.join("").length === 6) {
      setStatus("Xác nhận mã pin");
      setValueS(value);
      setValue(["", "", "", "", "", ""]);
    } else {
      toast.warning("Vui lòng nhập đủ 6 ký tự");
    }
  };

  const createPIN = async () => {
    try {
      // Chuyển chuỗi pinCode thành Integer
      const pinCode = parseInt(valueS.join(""), 10); // parseInt để chuyển thành số nguyên
      console.log(pinCode); // Kiểm tra giá trị sau khi chuyển đổi
      console.log(user.id);

      await axios.post("/wallet/createNew", {
        user: { id: user.id },
        passcode: pinCode, // Gửi passcode dưới dạng Integer
        createdat: new Date(),
      });

      navigate("/wallet/buyer");
    } catch (error) {
      console.error("Có lỗi xảy ra khi thêm:", error);
      console.error(error.response ? error.response.data : error);
    }
  };

  const handleConfirm2 = () => {
    if (value.join("").length === 6) {
      // So sánh chuỗi của các mảng
      if (value.join("") === valueS.join("")) {
        toast.success("Tạo mã PIN thành công!");
        createPIN();
      } else {
        toast.warning("Mã PIN không chính xác!");
        setValue(["", "", "", "", "", ""]);
      }
    } else {
      toast.warning("Vui lòng nhập đủ 6 ký tự");
    }
  };

  return (
    <div>
      <Header />
      <h1 className="text-center mt-4 mb-4">Tạo ví PerPay</h1>
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
                {status === "Nhập mã PIN" ? (
                  <>
                    {/* <button
                      className="btn btn-outline-danger me-3"
                      onClick={handleClear1}
                    >
                      Đặt lại
                    </button>
                    <button className="btn btn-danger" onClick={handleConfirm1}>
                      Xác nhận
                    </button> */}

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
                      variant="contained"
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
                ) : (
                  <>
                    <Button
                      variant="contained"
                      className="me-3"
                      onClick={handleConfirm0}
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
                      onClick={handleClear2}
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

export default PinCode;
