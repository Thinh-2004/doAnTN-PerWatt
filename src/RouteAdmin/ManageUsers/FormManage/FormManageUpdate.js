import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { forwardRef, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "../../../Localhost/Custumize-axios";
import { toast } from "react-toastify";

//Hiệu ứng transittion của dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormManageUpdate = ({ idUser, isRefeshTable }) => {
  const [open, setOpen] = useState(false);
  const [rolePermission, setRolePermission] = useState([]);
  //selected role
  const [selectedRolePermission, setSelectedRolePermission] = useState("");
  const [formEditUser, setFormEditUser] = useState({
    fullname: "",
    password: "",
    email: "",
    birthdate: "",
    gender: true,
    rolePermission: "", // Vai trò
    address: "",
    phone: "",
    configPassWord: "",
  });

  const [role, setRole] = useState("");

  const token = localStorage.getItem("hadfjkdshf"); // Lấy token từ localStorage
  const [loading, setLoading] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
    loadData();
  };

  const handleClose = () => {
    setOpen(false);
    setFormEditUser({
      fullname: "",
      password: "",
      email: "",
      birthdate: "",
      gender: true,
      rolepermission: "", // Vai trò buyer
      address: "",
      phone: "",
      configPassWord: "",
    });
    setSelectedRolePermission("");
  };

  const handleChange = (e) => {
    //Kiểm tra nếu `e` là một sự kiện (từ các input khác), xử lý bình thường
    if (e?.target) {
      const { name, value, type } = e.target;
      setFormEditUser({
        ...formEditUser,
        [name]: type === "radio" ? JSON.parse(value) : value,
      });
    } else {
      //Nếu e là giá trị ngày từ DatePicker
      setFormEditUser((pre) => ({
        ...pre,
        birthdate: e, //Cập nhật giá trị ngày từ DatePicker
      }));
    }
  };

  const handleSelectedChange = (e) => {
    const value = e.target.value;
    setSelectedRolePermission(value);
  };

  const loadData = async () => {
    try {
      const res = await axios.get(`role/permission/list`);
      setRolePermission(res.data);
      if (idUser) {
        const resEdit = await axios.get(`/userProFile/${idUser}`);
        setFormEditUser(resEdit.data);
        setSelectedRolePermission(resEdit.data.rolePermission.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [idUser]);

  //Render để lấy quyền
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (!token) {
          setLoading(false); // Không có token, dừng xử lý
          return;
        }
        const res = await axios.get(`/userProFile/myInfo`);
        setRole(res.data.rolePermission.permission.name);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setRole(null); // Nếu lỗi, đặt role về null
      } finally {
        setLoading(false); // Hoàn tất quá trình tải
      }
    };

    loadUserInfo();
  }, [token]);

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
    } = formEditUser;

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
          (birthDate.getDate() >= today.getDate() &&
            birthDate.getMonth() >= today.getMonth()) ||
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

      if (selectedRolePermission === "") {
        toast.warning("Bạn cần chọn vai trò");
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (validate()) {
      const id = toast.loading("Vui lòng chờ...");
      try {
        const genderBoolean = formEditUser.gender === true;
        const formData = new FormData();
        const userToSend = {
          fullname: formEditUser.fullname,
          password: formEditUser.password,
          email: formEditUser.email,
          birthdate: formEditUser.birthdate,
          gender: genderBoolean,
          rolePermission: {
            id: selectedRolePermission,
          },
          address: null,
          phone: formEditUser.phone,
        };
        console.log(userToSend);
        formData.append("user", JSON.stringify(userToSend));
        const res = await axios.put(`/manage/update/${idUser}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
          },
        });

        setTimeout(() => {
          toast.update(id, {
            render: "Tạo quản trị mới thành công",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
          setFormEditUser({
            fullname: "",
            password: "",
            email: "",
            birthdate: "",
            gender: "",
            rolepermission: "", // Vai trò
            phone: "",
            configPassWord: "",
          });
          setSelectedRolePermission("");
          handleClose();
          isRefeshTable(true);
        }, 2000);
        setTimeout(() => {
          isRefeshTable(false);
        }, 2500);
      } catch (error) {
        console.error("Error response:", error.response);
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
    <>
      {role === "All_Function" ? (
        <button className="btn" id="btn-edit" onClick={handleClickOpen}>
          <i className="bi bi-pencil-square"></i>
        </button>
      ) : (
        <Tooltip title="Quyền truy cập bị giới hạn">
          <span>
            <Button
              variant="outlined"
              onClick={handleClickOpen}
              fullWidth
              disabled
            >
              Thêm người dùng
            </Button>
          </span>
        </Tooltip>
      )}

      {/* Dialog component */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle>Thêm người dùng mới</DialogTitle>
        <DialogContent>
          <div className="row mt-2">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="mb-3">
                <TextField
                  name="fullname"
                  value={formEditUser.fullname}
                  id="outlined-basic"
                  label="Tên quản trị"
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  id="outlined-basic"
                  label="Email quản trị"
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="email"
                  value={formEditUser.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    name="birthdate"
                    value={
                      formEditUser.birthdate
                        ? dayjs(formEditUser.birthdate)
                        : null
                    } // Chuyển đổi múi giờ về Việt Nam
                    onChange={handleChange}
                    sx={{
                      "& .MuiInputBase-root": {
                        width: "565px",
                        height: "40px",
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="mb-3">
                <TextField
                  size="small"
                  fullWidth
                  name="phone"
                  value={formEditUser.phone}
                  onChange={handleChange}
                  label="Nhập số điện thoại"
                  id="phone-basic"
                  variant="outlined"
                />
              </div>
              <Box className="mb-3">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Vai trò quản trị
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedRolePermission}
                    label="Vai trò quản trị"
                    onChange={handleSelectedChange}
                  >
                    {rolePermission.map((fill) => (
                      <MenuItem key={fill.id} value={fill.id}>
                        {fill.permission.name} - ({fill.note})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="inlineRadio1"
                  value="true"
                  checked={formEditUser.gender === true}
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
                  checked={formEditUser.gender === false}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Nữ
                </label>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button onClick={handleUpdate}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormManageUpdate;
