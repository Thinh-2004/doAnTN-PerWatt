import React, { useEffect, useState } from "react";
import useSession from "../../../Session/useSession";
import axios from "../../../Localhost/Custumize-axios";
import "./ProfileStyle.css";
import { toast } from "react-toastify";

const Profile = () => {
  const [id] = useSession("id");
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

  useEffect(() => {
    const loadData = async (id) => {
      try {
        const res = await axios.get(`userProFile/${id}`);
        setFill(res.data);
        // Set the preview URL if there is an avatar
        setPreviewAvatar(res.data.avatar ? geturlIMG(id, res.data.avatar) : "");
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadData(id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFill({
      ...fill,
      [name]: type === "radio" ? JSON.parse(value) : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set preview URL
      setPreviewAvatar(URL.createObjectURL(file));
      setFill(prevFill => ({
        ...prevFill,
        avatar: file,
      }));
    }
  };

  const validate = () => {
    const { fullname, email, birthdate, phone, gender, avatar } = fill;

    const pattentEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattentPhone = /0[0-9]{9}/;
    if (!fullname || !email || !birthdate || !phone || gender === undefined || !avatar) {
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
      formData.append(
        "user",
        JSON.stringify({
          fullname: fill.fullname,
          email: fill.email,
          birthdate: fill.birthdate,
          phone: fill.phone,
          gender: fill.gender,
          password: fill.password,
          role: {
            id: fill.role.id,
          },
          address: fill.address,
        })
      );
      if (fill.avatar instanceof File) {
        formData.append("avatar", fill.avatar);
      }

      try {
        const idToast = toast.loading("Vui lòng chờ...");
        const res = await axios.put(`/user/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setTimeout(() => {
          toast.update(
            idToast,
            {
              render: "Cập nhật thông tin thành công",
              type: "success",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            },
            500
          );
          setFill(res.data); // Cập nhật thông tin sau khi lưu thành công
          sessionStorage.setItem("fullname", res.data.fullname);
          sessionStorage.setItem("avatar", res.data.avatar);
          window.location.reload();
        }, 500);
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật hồ sơ");
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-white rounded-4">
      <h3 className="text-center p-2">Hồ sơ của tôi</h3>
      <hr />
      <form onSubmit={handleChangeProfile}>
        <div className="row">
          <div className="col-lg-6 mx-4 border-end">
            <div className="mb-3">
              <input
                type="text"
                name="fullname"
                value={fill.fullname}
                onChange={handleChange}
                className="form-control"
                placeholder="Họ và tên"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={fill.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Email"
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                name="birthdate"
                value={fill.birthdate}
                onChange={handleChange}
                className="form-control"
                placeholder="Ngày sinh"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="phone"
                value={fill.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="Số điện thoại"
              />
            </div>
            <div className="mb-3">
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
            </div>
            <button className="btn btn-sm btn-success mb-4">
              Lưu thay đổi
            </button>
          </div>
          <div className="col-lg-5 d-flex flex-column justify-content-between">
            <div className="row">
              <div className="col-lg-12 d-flex justify-content-center mb-3">
                <img
                  src={previewAvatar || geturlIMG(id, fill.avatar)}
                  alt="Avatar"
                  className="img-fluid"
                  id="img-change-avatar"
                />
              </div>
              <div className="col-lg-12">
                <input
                  type="file"
                  className="form-control"
                  name="avatar"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
