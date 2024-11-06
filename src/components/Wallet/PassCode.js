import { Balance } from "@mui/icons-material";
import axios from "../../Localhost/Custumize-axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PassCode = () => {
  const inputRefs = useRef([]);
  const [inputValues, setInputValues] = useState(Array(6).fill("")); // 6 ô nhập đầu tiên
  const [confirmValues, setConfirmValues] = useState(Array(6).fill("")); // 6 ô nhập xác nhận
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const { status } = useParams();
  const [wallet, setWallet] = useState("");

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

  const handleConfirmChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d$/.test(value) && value !== "") {
      e.target.value = "";
      return;
    }

    const newConfirmValues = [...confirmValues];
    newConfirmValues[index] = value;
    setConfirmValues(newConfirmValues);

    // Chuyển đến ô nhập tiếp theo trong hàng xác nhận
    const nextInputIndex = index + 6 + 1; // Tính toán chỉ số ô tiếp theo
    if (value && nextInputIndex < inputRefs.current.length) {
      inputRefs.current[nextInputIndex].focus(); // Chỉ gọi focus nếu ô tiếp theo tồn tại
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputRefs.current[index].value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleWithdraw = async () => {
    if (inputValues.join("") !== confirmValues.join("")) {
      toast.error("Mã pin không khớp! Vui lòng nhập lại.");
      return;
    }

    const passCode = inputValues.join("");
    try {
      const res = await axios.put(`wallet/update/${user.id}`, {
        passcode: passCode,
        balance: wallet.balance,
      });
      toast.success("Tạo mã pin thành công");
      if (status === "deposit") {
        navigate("/transaction/deposit");
      } else if (status === "withdraw") {
        navigate("/transaction/withdraw");
      }
    } catch (error) {
      console.error(
        "Lỗi khi rút tiền:",
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
    if (user.id) {
      fetchWallet();
    }
  }, [user.id]);

  return (
    <div>
      <h1 className="text-center mt-4 mb-4">Tạo mã pin</h1>
      <div
        className="col-12 col-md-12 col-lg-10 offset-lg-1 mt-3"
        style={{ transition: "0.5s" }}
      >
        <div className="card">
          <div className="card-body">
            <div className="col-4 offset-4">
              {/* Hàng nhập mã pin */}
              <div className="row" style={{ transition: "0.5s" }}>
                {[...Array(6)].map((_, index) => (
                  <div className="col-2" key={index}>
                    <input
                      className="form-control"
                      type="text"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) => handleInputChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  </div>
                ))}
              </div>

              <h1 className="text-center mt-4 mb-4">Xác nhận mã pin</h1>
              <div className="row mt-3" style={{ transition: "0.5s" }}>
                {[...Array(6)].map((_, index) => (
                  <div className="col-2" key={index + 6}>
                    <input
                      className="form-control"
                      type="text"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index + 6] = el)}
                      onChange={(e) => handleConfirmChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index + 6)}
                    />
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleWithdraw}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassCode;
