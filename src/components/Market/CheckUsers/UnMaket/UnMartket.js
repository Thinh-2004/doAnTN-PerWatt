import React, { useState } from "react";
import "./UnMarketStyle.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../../Localhost/Custumize-axios";
import { Box, TextField } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BusinessIcon from "@mui/icons-material/Business";

const UnMatket = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const changeLink = useNavigate();
  const [formStore, setFormStore] = useState({
    namestore: "",
    address: "",
    email: "",
    phone: "",
    cccdnumber: "",
    createdtime: "",
    imgbackgound: user.avatar,
    user: user.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormStore((prevFormStore) => ({
      ...prevFormStore,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const toastId = toast.loading("Vui lòng chờ...");
      try {
        const storeToSend = {
          ...formStore,
          user: {
            id: formStore.user,
          },
        };
        // Gửi yêu cầu POST đến backend
        const response = await axios.post("store", storeToSend);

        // Nếu yêu cầu thành công
        toast.update(toastId, {
          render: "Đăng ký kênh bán thành công",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        // Chuyển hướng đến trang profileMarket
        changeLink("/profileMarket");
      } catch (error) {
        // Xử lý lỗi từ backend
        if (error.response) {
          if (error.response.status === 409) {
            // Nếu mã trạng thái là 409 (Conflict)
            toast.update(toastId, {
              render: error.response.data || "Tên cửa hàng đã tồn tại!",
              type: "error",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            });
          } else {
            // Các mã trạng thái lỗi khác
            toast.update(toastId, {
              render: error.response.data.message || "Lỗi xảy ra",
              type: "error",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            });
          }
          console.error("Lỗi từ backend: ", error.response.data);
        } else if (error.request) {
          // Nếu không có phản hồi từ máy chủ
          toast.update(toastId, {
            render: "Không có phản hồi từ máy chủ. Vui lòng thử lại sau.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
          console.error("Không có phản hồi từ máy chủ.");
        } else {
          // Lỗi thiết lập yêu cầu
          toast.update(toastId, {
            render: "Đăng ký kênh bán thất bại",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
          console.error("Lỗi thiết lập yêu cầu: ", error.message);
        }
      }
    }
  };

  const validate = () => {
    const { namestore, address, email, phone, cccdnumber } = formStore;
    //Biểu thức chính quy
    const pattenPhone = /0[0-9]{9}/;
    const pattenEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattenCccd = /^[0-9]{9,12}$/; // Ví dụ kiểm tra số CCCD gồm 9-12 chữ số
    if (!namestore && !address && !email && !phone && !cccdnumber) {
      toast.warning("Cần nhập tất cả thông tin");
      return false;
    } else {
      if (namestore === "") {
        toast.warning("Vui lòng nhập tên của hàng");
        return false;
      } else if (namestore.length < 10) {
        toast.warning("Tên cửa hàng phải tối thiểu 10 kí tự");
        return false;
      }

      if (phone === "") {
        toast.warning("Vui lòng nhập số điện thoại cửa hàng");
        return false;
      } else if (!pattenPhone.test(phone)) {
        toast.warning("Số điện thoại không hợp lệ");
        return false;
      }

      if (email === "") {
        toast.warning("Vui lòng nhập email cửa hàng");
        return false;
      } else if (!pattenEmail.test(email)) {
        toast.warning("Email không hợp lệ");
        return false;
      }

      if (cccdnumber === "") {
        toast.warning("Vui lòng nhập căn cước công dân của bạn");
        return false;
      } else if (!pattenCccd.test(cccdnumber)) {
        toast.warning("Căn cước không hợp lệ");
        return false;
      }

      if (address === "") {
        toast.warning("Vui lòng nhập địa chỉ cửa hàng");
        return false;
      }
    }
    return true;
  };

  const handleReset = () => {
    setFormStore({
      namestore: "",
      address: "",
      email: "",
      phone: "",
      cccdnumber: "",
      createdtime: "",
      imgbackgound: user.avatar,
      user: user.id,
    });
  };

  return (
    <div className="container mt-4">
      <div className="card rounded-4 bg-white" style={{ border: "none" }}>
        <div className="row">
          <div className="col-lg-6">
            <img
              src="https://mediapost.com.vn/upload/tin-tuc/tin-media-post/kenh-ban-hang-online-hieu-qua.png?v=1.0.0"
              alt=""
              className="img-fluid rounded-start-4"
              style={{ height: "100%" }}
            />
          </div>
          <div className="col-lg-6">
            <h1 className="text-center mt-3">Tạo kênh bán</h1>
            <p className="text-center">Hãy tạo kênh bán hàng của riêng bạn</p>
            <div className="row">
              <div className="col-lg-12">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      {/* <input
                        type="text"
                        name="namestore"
                        placeholder="Nhập tên cửa hàng"
                        className="form-control rounded-4"
                        value={formStore.namestore}
                        onChange={handleChange}
                      /> */}
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <StoreIcon
                          sx={{
                            color: "action.active",
                            mr: 1,
                            my: 0.5,
                            fontSize: "25px",
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Nhập tên cửa hàng"
                          variant="outlined"
                          name="namestore"
                          value={formStore.namestore}
                          onChange={handleChange}
                          size="small"
                          fullWidth
                        />
                      </Box>
                    </div>
                    <div className="mb-3">
                      {/* <input
                        type="text"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        className="form-control rounded-4"
                        value={formStore.phone}
                        onChange={handleChange}
                      /> */}
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <PhoneIphoneIcon
                          sx={{
                            color: "action.active",
                            mr: 1,
                            my: 0.5,
                            fontSize: "25px",
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Nhập số điện thoại"
                          variant="outlined"
                          name="phone"
                          value={formStore.phone}
                          onChange={handleChange}
                          size="small"
                          fullWidth
                        />
                      </Box>
                    </div>
                    <div className="mb-3">
                      {/* <input
                        type="email"
                        name="email"
                        placeholder="Nhập email"
                        className="form-control rounded-4"
                        value={formStore.email}
                        onChange={handleChange}
                      /> */}
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <AttachEmailIcon
                          sx={{
                            color: "action.active",
                            mr: 1,
                            my: 0.5,
                            fontSize: "25px",
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Nhập email"
                          variant="outlined"
                          name="email"
                          value={formStore.email}
                          onChange={handleChange}
                          size="small"
                          fullWidth
                        />
                      </Box>
                    </div>
                    <div className="mb-3">
                      {/* <input
                        type="text"
                        name="cccdnumber"
                        placeholder="Nhập CCCD"
                        className="form-control rounded-4"
                        value={formStore.cccdnumber}
                        onChange={handleChange}
                      /> */}
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <CreditCardIcon
                          sx={{
                            color: "action.active",
                            mr: 1,
                            my: 0.5,
                            fontSize: "25px",
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Nhập căm cước công dân"
                          variant="outlined"
                          name="cccdnumber"
                          value={formStore.cccdnumber}
                          onChange={handleChange}
                          size="small"
                          fullWidth
                        />
                      </Box>
                    </div>
                    <div className="mb-3">
                      {/* <textarea
                        name="address"
                        placeholder="Nhập địa chỉ của bạn"
                        className="form-control rounded-4"
                        value={formStore.address}
                        onChange={handleChange}
                      ></textarea> */}
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <BusinessIcon
                          sx={{
                            color: "action.active",
                            mr: 1,
                            my: 0.5,
                            fontSize: "25px",
                          }}
                        />
                        <TextField
                          id="outlined-multiline-static"
                          label="Nhập địa chỉ cửa hàng"
                          multiline
                          rows={4}
                          name="address"
                          value={formStore.address}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Box>
                    </div>
                    <button type="submit" className="btn" id="btn-submit">
                      Đăng Ký
                    </button>
                    <button
                      type="button"
                      className="btn mx-3"
                      id="btn-reset"
                      onClick={handleReset}
                    >
                      Làm mới
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnMatket;
