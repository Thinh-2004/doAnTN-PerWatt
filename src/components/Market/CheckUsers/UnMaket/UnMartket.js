import React, { useState } from "react";
import "./UnMarketStyle.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../../Localhost/Custumize-axios";
import { Box, Card, CardContent, TextField } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BusinessIcon from "@mui/icons-material/Business";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import FormSelectAdress from "../../../APIAddressVN/FormSelectAdress";

const UnMatket = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const changeLink = useNavigate();
  const [formStore, setFormStore] = useState({
    namestore: "",
    addressDetail: "",
    email: "",
    phone: "",
    cccdnumber: "",
    createdtime: "",
    imgbackgound: user.avatar,
    user: user.id,
    taxcode: "",
  });

  //Kiểm tra điều kiện reset components con
  const [isReset, setIsReset] = useState(false);

  //Dữ liệu từ FormSelectAddress
  const [apiAddress, setApiAddress] = useState("");

  const handleDataApiAddress = (data) => {
    setApiAddress(data);
    console.log(data);
  };

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
        // Kiểm tra mã số thuế
        if (formStore.taxcode) {
          const checkTax = await axios.get(`/business/${formStore.taxcode}`);
          if (!checkTax.data.data || checkTax.status === 524) {
            toast.update(toastId, {
              render:
                "Mã số thuế không tồn tại hoặc đã được sử dụng ở nơi khác",
              type: "warning",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            });
            return; //Stop if taxcode not valid
          }
        }

        // Tạo đối tượng để gửi đến backend
        const storeToSend = {
          ...formStore,
          address: formStore.addressDetail + ", " + apiAddress,
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

        // Lưu id store vào localStorage
        localStorage.setItem("idStore", response.data.id);
        handleReset();

        // Chuyển hướng đến trang profileMarket
        changeLink("/profileMarket");
      } catch (error) {
        // Xử lý lỗi từ backend
        if (error.response) {
          const errorMessage =
            error.response.status === 409
              ? error.response.data
              : error.response.data;

          toast.update(toastId, {
            render: errorMessage,
            type: "warning",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        } else if (error.request) {
          // Không có phản hồi từ máy chủ
          toast.update(toastId, {
            render: "Không có phản hồi từ máy chủ. Vui lòng thử lại sau.",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        } else {
          // Lỗi thiết lập yêu cầu
          toast.update(toastId, {
            render: "Đăng ký kênh bán thất bại",
            type: "error",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        }
        console.error("Lỗi từ backend hoặc máy chủ:", error);
      }
    }
  };

  const validate = () => {
    const { namestore, addressDetail, email, phone, cccdnumber, taxcode } =
      formStore;
    //Biểu thức chính quy
    const pattenPhone = /0[0-9]{9}/;
    const pattenEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattenCccd = /^[0-9]{9,12}$/; // Ví dụ kiểm tra số CCCD gồm 9-12 chữ số
    if (!namestore && !email && !phone && !cccdnumber) {
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

      if (apiAddress === "" || apiAddress === null) {
        toast.warning("Vui lòng chọn địa chỉ đầy đủ");
        return false;
      } else if (addressDetail === "" || addressDetail === null) {
        toast.warning("Vui lòng nhập số nhà hoặc đường");
        return false;
      }

      if (!taxcode) {
        return true;
      } else if (!/^\d{10}$|^\d{13}$/.test(taxcode)) {
        toast.warning("Mã số thuế không hợp lệ. Phải có 10 hoặc 12 chữ số");
        return false;
      }
    }
    return true;
  };

  const handleReset = () => {
    setFormStore({
      namestore: "",
      addressDetail: "",
      email: "",
      phone: "",
      cccdnumber: "",
      createdtime: "",
      imgbackgound: user.avatar,
      user: user.id,
      taxcode: "",
    });
    setIsReset(true);
  };

  return (
    <div className="container mt-4">
      <Card className="rounded-4" style={{ border: "none" }}>
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
                <CardContent className="">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
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
                    <div className="mb-4">
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
                    <div className="mb-4">
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
                    <div className="mb-4">
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
                    <div className="mb-4">
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <BusinessIcon
                          sx={{
                            color: "action.active",
                            mr: 1,
                            my: 0.5,
                            fontSize: "25px",
                          }}
                        />
                        <div className="w-100">
                          <FormSelectAdress
                            apiAddress={handleDataApiAddress}
                            resetForm={isReset}
                          />
                          <TextField
                            className="mt-3"
                            id="outlined-multiline-static"
                            label="Đường/Số nhà"
                            multiline
                            placeholder="Ví dụ: Số nhà 123, Đường ABC,"
                            rows={2}
                            name="addressDetail"
                            value={formStore.addressDetail}
                            onChange={handleChange}
                            fullWidth
                          />
                        </div>
                      </Box>
                    </div>

                    <div className="mb-4">
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <SubtitlesIcon
                          sx={{
                            color: "action.active",
                            mr: 1,
                            my: 0.5,
                            fontSize: "25px",
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Nhập mã số thuế (Nếu có)"
                          variant="outlined"
                          name="taxcode"
                          value={formStore.taxcode}
                          onChange={handleChange}
                          size="small"
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
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UnMatket;
