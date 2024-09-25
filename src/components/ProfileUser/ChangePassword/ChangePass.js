import React, { useEffect, useState } from "react";
import axios from "../../../Localhost/Custumize-axios";
import useSession from "../../../Session/useSession";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangePass = () => {
  const [id] = useSession("id");
  const changeLink = useNavigate();
  const [formPass, setFormPass] = useState({
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

  const [newPass, setNewPass] = useState("");
  const [configPass, setConfigPass] = useState("");

  useEffect(() => {
    const loadData = async (id) => {
      try {
        const res = await axios.get(`userProFile/${id}`);
        setFormPass(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadData(id);
  }, [id]);

  const validate = () => {
    const patternPassword = /^(?=.*[a-zA-Z]).{8,}$/;

    if (!newPass || !configPass) {
      toast.warning("Vui lòng nhập toàn bộ thông tin");
      return false;
    }

    if (newPass === "") {
      toast.warning("Vui lòng nhập mật khẩu mới");
      return false;
    } else if (newPass.length < 8 || !patternPassword.test(newPass)) {
      toast.warning(
        "Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa hoặc thường"
      );
      return false;
    }

    if (newPass !== configPass) {
      toast.warning("Xác thực mật khẩu không khớp");
      return false;
    }

    return true;
  };

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append(
        "user",
        JSON.stringify({
          fullname: formPass.fullname,
          email: formPass.email,
          birthdate: formPass.birthdate,
          phone: formPass.phone,
          gender: formPass.gender,
          password: newPass, // Sử dụng mật khẩu mới
          role: {
            id: formPass.role.id,
          },
          address: formPass.address,
          avatar: formPass.avatar,
        })
      );

      if (formPass.avatar instanceof File) {
        formData.append("avatar", formPass.avatar);
      }

      try {
        const idToast = toast.loading("Vui lòng chờ...");
        const res = await axios.put(`/user/${id}`, formData, {
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
          sessionStorage.setItem("fullname", res.data.fullname);
          sessionStorage.setItem("avatar", res.data.avatar);
          changeLink("/user");
          window.location.reload();
        }, 500);
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật hồ sơ");
        console.error(error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-4">
      <h3 className="text-center p-2">Đổi mật khẩu</h3>
      <hr />
      <form onSubmit={handleChangePass}>
        <div className="offset-3 col-6">
          <div className="mb-3">
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="form-control"
              placeholder="Mật khẩu mới"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={configPass}
              onChange={(e) => setConfigPass(e.target.value)}
              className="form-control"
              placeholder="Xác nhận khẩu mới"
            />
          </div>
          <button className="btn btn-sm btn-success mb-4">Xác nhận</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePass;
