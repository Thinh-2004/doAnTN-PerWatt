import axios from "../../../localhost/Custumize-axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formUser, setFormUser] = useState({
    fullname: "",
    password: "",
    email: "",
    birthdate: "",
    gender: "",
    role: 3, // Vai trò buyer
    address: "",
    phone: "",
    avatar:
      "https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "radio") {
      setFormUser((prev) => ({
        ...prev,
        [name]: checked ? value : prev[name],
      }));
    } else {
      setFormUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const {
      fullname,
      password,
      email,
      birthdate,
      gender,
      address,
      phone,
      configPassWord,
    } = formUser;
    //Biểu thức chính quy
    const pattentEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattentPhone = /0[0-9]{9}/;
    const patternPassword = /^(?=.*[a-zA-Z]).{8,}$/;
    // Kiểm tra nếu tất cả các trường đều trống
    if (
      !fullname &&
      !password &&
      !email &&
      !birthdate &&
      !gender &&
      !address &&
      !phone
    ) {
      toast.warning("Cần nhập toàn bộ thông tin");
      return false;
    } else {
      // Kiểm tra từng trường riêng biệt
      if (!fullname) {
        toast.warning("Hãy nhập họ và tên");
        return false;
      }

      if (!email) {
        toast.warning("Hãy nhập email");
        return false;
      } else if (!pattentEmail.test(email)) {
        toast.warning("Email sai định dạng");
        return false;
      }

      if (!gender) {
        toast.warning("Hãy chọn giới tính");
        return false;
      }

      if (!birthdate) {
        toast.warning("Hãy nhập ngày sinh");
        return false;
      } else {
        const today = new Date();
        const birthDate = new Date(birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (birthDate > today) {
          toast.warning("Ngày sinh không thể lớn hơn ngày hiện tại");
          return false;
        } else if (age > 100 || age === 100) {
          toast.warning("Tuổi không hợp lệ");
          return false;
        }
      }

      if (!phone) {
        toast.warning("Hãy nhập số điện thoại");
        return false;
      } else if (!pattentPhone.test(phone)) {
        toast.warning("Số điện thoại không hợp lệ");
        return false;
      }

      if (!password) {
        toast.warning("Hãy nhập mật khẩu");
        return false;
      } else if ((password.length < 8) | !patternPassword.test(password)) {
        toast.warning(
          "Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa hoặc thường"
        );
        return false;
      }

      if (password !== configPassWord) {
        toast.warning("Xác thực mật khẩu không khớp");
        return false;
      }

      if (!address) {
        toast.warning("Hãy nhập địa chỉ");
        return false;
      }
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validate()) {
      const id = toast.loading("Vui lòng chờ...");
      try {
        const genderBoolean = formUser.gender === "true";
        const userToSend = {
          ...formUser,
          gender: genderBoolean,
          role: {
            id: formUser.role,
          },
        };
        const res = await axios.post("/user", userToSend);

        setTimeout(() => {
          toast.update(id, {
            render:
              "Tạo tài khoản thành công, vui lòng quay lại trang đăng nhập",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        }, 2000);
      } catch (error) {
        console.error("Error response:", error.response); // Log full error response
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : "Đã xảy ra lỗi, vui lòng thử lại";
        setTimeout(() => {
          toast.update(id, {
            render: `${errorMessage}`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        }, 2000);
      }
    }
  };

  return (
    <form onSubmit={handleRegister} className="form-sign">
      <h2 className="title">Đăng Ký</h2>
      <p className="subject">
        Hãy điền đầy đủ các thông tin trên để trải nghiệm dịch vụ của chúng tôi
      </p>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3">
            <input
              type="text"
              name="fullname"
              value={formUser.fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              value={formUser.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-start">
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="inlineRadio1"
                value="true"
                checked={formUser.gender === "true"}
                onChange={handleChange}
              />
              <label className="form-check-label mx-2" htmlFor="inlineRadio1">
                Nam
              </label>
            </div>
            <div className="mx-3 mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="inlineRadio2"
                value="false"
                checked={formUser.gender === "false"}
                onChange={handleChange}
              />
              <label className="form-check-label mx-2" htmlFor="inlineRadio2">
                Nữ
              </label>
            </div>
          </div>

          <div className="mb-3">
            <input
              type="date"
              name="birthdate"
              value={formUser.birthdate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="phone"
              value={formUser.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="form-control"
            />
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  value={formUser.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu ***"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <input
                  type="password"
                  onChange={handleChange}
                  value={formUser.configPassWord}
                  name="configPassWord"
                  placeholder="Xác thực mật khẩu ***"
                  className="form-control mb-3"
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <textarea
              name="address"
              value={formUser.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập địa chỉ của bạn"
            ></textarea>
          </div>
        </div>
      </div>
      <button type="submit" className="button">
        Đăng ký
      </button>
    </form>
  );
};

export default Register;
