import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  styled,
  TextField,
  useTheme,
} from "@mui/material";
import axios from "../../../Localhost/Custumize-axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FormSelectAdress from "../../APIAddressVN/FormSelectAdress";
import TermsPopup from "../TermsPopup";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ModelTermPopUp = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <label>
        Tôi đồng ý với các{" "}
        <Link onClick={handleClickOpen}>điều khoản và dịch vụ</Link>.
      </label>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <div className="py-3 d-flex justify-content-around">
            <div className="d-flex align-items-center">
              <div>
                <ReceiptLongIcon
                  style={{
                    fontSize: "80px",
                    color: "#228dff",
                  }}
                />
              </div>
              <div className="stack ms-3">
                <div className="fs-4">Điều Khoản và Dịch Vụ</div>
              </div>
            </div>
          </div>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TermsPopup />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

const Register = ({ onRegisterSuccess }) => {
  const [formUser, setFormUser] = useState({
    fullname: "",
    password: "",
    email: "",
    birthdate: "",
    gender: "",
    rolePermission: 6, // Vai trò buyer
    address: "",
    phone: "",
    configPassWord: "",
    check: false,
  });

  //Hidden or show pass
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfig, setShowPasswordConfig] = useState(false);
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [isFocusedPassCofig, setIsFocusedPassCofig] = useState(false);

  const handleChange = (e) => {
    // Kiểm tra nếu `e` là một sự kiện (từ các input khác), xử lý bình thường
    if (e?.target) {
      const { name, value, type, checked } = e.target;
      setFormUser((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    // Nếu `e` là giá trị ngày từ DatePicker
    else {
      setFormUser((prev) => ({
        ...prev,
        birthdate: e, // Cập nhật giá trị ngày từ DatePicker
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
      phone,
      configPassWord,
      check,
    } = formUser;

    const pattentEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattentPhone = /0[0-9]{9}/;
    const patternPassword = /^(?=.*[a-zA-Z]).{8,}$/;

    if (
      !fullname &&
      !password &&
      !email &&
      !birthdate &&
      !gender &&
      !phone &&
      !check
    ) {
      toast.warning("Cần nhập toàn bộ thông tin");
      return false;
    } else {
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

        // Tính tuổi dựa trên năm, tháng, và ngày
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();

        // Điều chỉnh tuổi nếu tháng hiện tại hoặc ngày hiện tại chưa tới sinh nhật trong năm nay
        if (
          monthDifference < 0 ||
          (monthDifference === 0 && dayDifference < 0)
        ) {
          age--;
        }

        if (
          birthDate.getDate() >= today.getDate() &&
          birthDate.getMonth() >= today.getMonth() &&
          birthDate.getFullYear() >= today.getFullYear()
        ) {
          toast.warning("Ngày sinh không thể lớn hơn hoặc bằng ngày hiện tại");
          return false;
        } else if (age > 100) {
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
      } else if (password.length < 8 || !patternPassword.test(password)) {
        toast.warning(
          "Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa hoặc thường"
        );
        return false;
      }

      if (password !== configPassWord) {
        toast.warning("Xác thực mật khẩu không khớp");
        return false;
      }

      if (!check) {
        toast.warning("Bạn chưa chấp nhận điều khoản và dịch vụ của chúng tôi");
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
          fullname: formUser.fullname,
          password: formUser.password,
          email: formUser.email,
          birthdate: formUser.birthdate,
          gender: genderBoolean,
          rolePermission: {
            id: formUser.rolePermission,
          },
          address: null,
          phone: formUser.phone,
        };
        const res = await axios.post("/user", userToSend);

        toast.update(id, {
          render: "Đăng ký thành công, hệ thống sẽ chuyển sang đăng nhập.",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        setFormUser({
          fullname: "",
          password: "",
          email: "",
          birthdate: "",
          gender: "",
          rolePermission: 6, // Vai trò buyer
          phone: "",
          configPassWord: "",
          check: false,
        });
        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } catch (error) {
        console.error("Error response:", error.response);
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : "Đã xảy ra lỗi, vui lòng thử lại";
        toast.update(id, {
          render: `${errorMessage}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfig = () =>
    setShowPasswordConfig((show) => !show);

  const handleMouseDownPasswordConfig = (event) => {
    event.preventDefault();
  };

  const theme = useTheme();

  return (
    <form
      onSubmit={handleRegister}
      className="form-sign"
      style={{
        backgroundColor: theme.palette.mode === "light" ? " #fff" : "#363535",
      }}
    >
      <h2 className="titleLogin_Register">Đăng Ký</h2>
      <p className="subject">
        Đăng ký tài khoản để được trải nghiệm hết các tính năng của chúng tôi!!!
      </p>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3">
            <TextField
              fullWidth
              name="fullname"
              value={formUser.fullname}
              onChange={handleChange}
              id="fullname-basic"
              label="Nhập họ tên"
              variant="standard"
            />
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              name="email"
              value={formUser.email}
              onChange={handleChange}
              id="email-basic"
              label="Nhập email"
              variant="standard"
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD/MM/YYYY"
                name="birthdate"
                value={formUser.birthdate ? dayjs(formUser.birthdate) : null} // Chuyển đổi múi giờ về Việt Nam
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-root": {
                    width: "400px",
                    height: "40px",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              name="phone"
              value={formUser.phone}
              onChange={handleChange}
              label="Nhập số điện thoại"
              id="phone-basic"
              variant="standard"
            />
          </div>
        </div>
        <div className="col-lg-12">
          <div className="row mb-3">
            <div className="col-lg-6">
              <div className="mb-3">
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="enterPass-adornment-password">
                    Nhập mật khẩu
                  </InputLabel>
                  <Input
                    name="password"
                    value={formUser.password}
                    onChange={handleChange}
                    id="enterPass-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onFocus={() => setIsFocusedPass(true)}
                    onBlur={() => setIsFocusedPass(false)}
                    endAdornment={
                      isFocusedPass && (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="enterConfig-adornment-password">
                    Xác thực mật khẩu
                  </InputLabel>
                  <Input
                    onChange={handleChange}
                    value={formUser.configPassWord}
                    name="configPassWord"
                    id="enterConfig-adornment-password"
                    type={showPasswordConfig ? "text" : "password"}
                    onFocus={() => setIsFocusedPassCofig(true)}
                    onBlur={() => setIsFocusedPassCofig(false)}
                    endAdornment={
                      isFocusedPassCofig && (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordConfig}
                            onMouseDown={handleMouseDownPasswordConfig}
                          >
                            {showPasswordConfig ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  />
                </FormControl>
              </div>
            </div>
          </div>
          {/* <div className="mb-3">
            <FormSelectAdress
              apiAddress={handleDataApiAddress}
              resetForm={isReset}
            />
          </div> */}
          <div className="p-0 m-0 d-flex justify-content-start">
            <input
              type="checkbox"
              className="form-check me-2"
              name="check"
              checked={formUser.check}
              onChange={handleChange}
            />
            <ModelTermPopUp />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="button w-100"
        style={{
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(to right, #28ffdb, #228dff)"
              : "linear-gradient(to right, #1c4a43, #072748)",
        }}
      >
        Đăng ký
      </button>
    </form>
  );
};

export default Register;
