import React, { useEffect, useState } from "react";
import axios from "../../../Localhost/Custumize-axios";
import "./ProfileStyle.css";
import { toast } from "react-toastify";
import { Box, Button, styled, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  AccountCircle,
  CalendarToday,
  CheckBox,
  LocalPhone,
} from "@mui/icons-material";
import { Email } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Profile = () => {
  const sesion = localStorage.getItem("user");
  const user = sesion ? JSON.parse(sesion) : null;
  const [fill, setFill] = useState({
    fullname: "",
    password: "",
    email: "",
    birthdate: "",
    role: "",
    address: "",
    phone: "",
    gender: true,
    avatar: "",
  });

  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };

  const [previewAvatar, setPreviewAvatar] = useState(""); // State for image preview

  const loadData = async () => {
    try {
      const res = await axios.get(`userProFile/${user.id}`);
      setFill(res.data);
      // console.log(res.data);
      // Set the preview URL if there is an avatar
      setPreviewAvatar(
        res.data.avatar ? geturlIMG(user.id, res.data.avatar) : ""
      );
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    //Kiểm tra nếu `e` là một sự kiện (từ các input khác), xử lý bình thường
    if (e?.target) {
      const { name, value, type } = e.target;
      setFill({
        ...fill,
        [name]: type === "radio" ? JSON.parse(value) : value,
      });
    } else {
      //Nếu e là giá trị ngày từ DatePicker
      setFill((pre) => ({
        ...pre,
        birthdate: e, //Cập nhật giá trị ngày từ DatePicker
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra xem tệp tin có phải là ảnh không
      const fileType = file.type.split("/")[0]; // Lấy loại tệp tin (ví dụ: "image")
      if (fileType === "image") {
        // Set preview URL
        setPreviewAvatar(URL.createObjectURL(file));
        setFill((prevFill) => ({
          ...prevFill,
          avatar: file,
        }));
      } else {
        toast.error("Vui lòng chọn một tệp tin ảnh.");
      }
    }
  };

  const validate = () => {
    const { fullname, email, birthdate, phone, gender, avatar } = fill;

    const pattentEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattentPhone = /0[0-9]{9}/;
    if (
      !fullname ||
      !email ||
      !birthdate ||
      !phone ||
      gender === undefined ||
      !avatar
    ) {
      toast.warning("Vui lòng nhập toàn bộ thông tin");
      return false;
    } else {
      if (fullname === "") {
        toast.warning("Vui lòng nhập tên");
        return false;
      }

      if (email === "") {
        toast.warning("Vui lòng nhập email");
        return false;
      } else if (!pattentEmail.test(email)) {
        toast.warning("Email không hợp lệ");
        return false;
      }

      if (birthdate === "") {
        toast.warning("Vui lòng nhập ngày sinh");
        return false;
      } else {
        const today = new Date();
        const birthDate = new Date(birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (birthDate > today) {
          toast.warning("Ngày sinh không được lớn hơn ngày hiện tại");
          return false;
        } else if (age > 100 || age === 100) {
          toast.warning("Tuổi không hợp lệ");
          return false;
        }
      }

      if (phone === "") {
        toast.warning("Vui lòng nhập số điện thoại");
        return false;
      } else if (!pattentPhone.test(phone)) {
        toast.warning("Số điện thoại không hợp lệ");
        return false;
      }
      return true;
    }
  };

  const handleChangeProfile = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      const userToSend = {
        fullname: fill.fullname,
        email: fill.email,
        birthdate: fill.birthdate,
        phone: fill.phone,
        gender: fill.gender,
        password: fill.password || null,
        role: {
          id: fill.role.id,
        },
        address: fill.address,
      };
      formData.append("user", JSON.stringify(userToSend));
      console.log(userToSend);
      if (fill.avatar instanceof File) {
        formData.append("avatar", fill.avatar);
      }
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        const res = await axios.put(`/user/${user.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setTimeout(() => {
          toast.update(idToast, {
            render: "Cập nhật thông tin thành công",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
          setFill(res.data); // Cập nhật thông tin sau khi lưu thành công
          const userInfo = {
            id: res.data.id,
            fullname: res.data.fullname,
            avatar: res.data.avatar,
          };
          localStorage.setItem("user", JSON.stringify(userInfo)); //Chuyển đổi đối tượng thành JSON
          // sessionStorage.setItem("fullname", res.data.fullname);
          // sessionStorage.setItem("avatar", res.data.avatar);
          loadData();
        }, 500);
      } catch (error) {
        toast.update(idToast, {
          render: "Có lỗi xảy ra khi cập nhật hồ sơ",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        console.error(error);
      }
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Box
      className="rounded-4"
      sx={{
        backgroundColor: "backgroundElement.children",
      }}
    >
      <h3 className="text-center p-2">Hồ sơ của tôi</h3>
      <hr />
      <form onSubmit={handleChangeProfile} className="m-3">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-6 col-md-6 col-sm-6 mx-4 border-end">
            <div className="mb-3">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <AccountCircle
                  sx={{
                    color: "action.active",
                    mr: 1,
                    my: 0.5,
                    fontSize: "25px",
                  }}
                />
                <TextField
                  fullWidth
                  name="fullname"
                  value={fill.fullname}
                  onChange={handleChange}
                  id="input-with-sx-fullname"
                  label="Họ và tên người dùng"
                  variant="standard"
                />
              </Box>
              {/* <input
                type="text"
                name="fullname"
                value={fill.fullname}
                onChange={handleChange}
                className="form-control"
                placeholder="Họ và tên"
              /> */}
            </div>
            <div className="mb-3">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Email
                  sx={{
                    color: "action.active",
                    mr: 1,
                    my: 0.5,
                    fontSize: "25px",
                  }}
                />
                <TextField
                  fullWidth
                  name="email"
                  value={fill.email}
                  onChange={handleChange}
                  id="input-with-sx-email"
                  label="Email"
                  variant="standard"
                />
              </Box>
              {/* <input
                type="email"
                name="email"
                value={fill.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Email"
              /> */}
            </div>
            <div className="mb-3">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <CalendarToday
                  sx={{
                    color: "action.active",
                    mr: 1,
                    my: 0.5,
                    fontSize: "25px",
                  }}
                />
                {/* <input
                  type="date"
                  name="birthdate"
                  value={fill.birthdate}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ngày sinh"
                /> */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    name="birthdate"
                    value={fill.birthdate ? dayjs(fill.birthdate) : null} // Chuyển đổi múi giờ về Việt Nam
                    onChange={handleChange}
                    sx={{
                      "& .MuiInputBase-root": {
                        width: "400px",
                        height: "40px",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </div>
            <div className="mb-3">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <LocalPhone
                  sx={{
                    color: "action.active",
                    mr: 1,
                    my: 0.5,
                    fontSize: "25px",
                  }}
                />
                <TextField
                  fullWidth
                  name="phone"
                  value={fill.phone}
                  onChange={handleChange}
                  id="input-with-sx-phone"
                  label="Số điện thoại"
                  variant="standard"
                />
              </Box>
              {/* <input
                type="text"
                name="phone"
                value={fill.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="Số điện thoại"
              /> */}
            </div>
            <div className="mb-3">
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <CheckBox
                  sx={{
                    color: "action.active",
                    mr: 1,
                    my: 0.5,
                    fontSize: "25px",
                  }}
                />
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="inlineRadio1"
                    value="true"
                    checked={fill.gender === true}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio1">
                    Nam
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="inlineRadio2"
                    value="false"
                    checked={fill.gender === false}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="inlineRadio2">
                    Nữ
                  </label>
                </div>
              </Box>
            </div>
            <button className="btn  mb-4" id="btn-update-profileUser">
              Lưu thay đổi
            </button>
          </div>
          <div className="col-lg-5 col-md-5 col-sm-5 d-flex justify-content-center">
            <div className="row">
              <div className="col-lg-12 d-flex justify-content-center mb-3">
                <img
                  src={previewAvatar || geturlIMG(user.id, fill.avatar)}
                  alt="Avatar"
                  className="img-fluid"
                  id="img-change-avatar"
                />
              </div>
              <div className="col-lg-12">
                <Button
                  fullWidth
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Tải hình ảnh
                  <VisuallyHiddenInput
                    type="file"
                    name="avatar"
                    accept="image/*" // Chỉ cho phép chọn tệp tin ảnh
                    onChange={handleFileChange}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Box>
  );
};

export default Profile;
