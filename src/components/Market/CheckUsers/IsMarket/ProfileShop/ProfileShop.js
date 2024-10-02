import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../../../../Localhost/Custumize-axios";
import "./ProfileShopStyle.css";
import { Box, Button, styled, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StoreIcon from "@mui/icons-material/Store";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import { BadgeOutlined, PhoneCallback } from "@mui/icons-material";
import SubtitlesOutlinedIcon from "@mui/icons-material/SubtitlesOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BusinessIcon from "@mui/icons-material/Business";

const ProfileShop = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const idStore = localStorage.getItem("idStore");
  const [dataStore, setDataStore] = useState({
    namestore: "",
    address: "",
    email: "",
    phone: "",
    cccdnumber: "",
    imgbackgound: "",
    user: user.id,
    taxcode: "",
    slug : "",
  });
  const [dataTaxCode, setDataTaxCode] = useState({
    name: "",
    address: "",
  });
  const [previewAvatar, setPreviewAvatar] = useState("");

  const geturlIMG = (storeId, filename) => {
    return `${axios.defaults.baseURL}files/store/${storeId}/${filename}`;
  };

  const loadData = async () => {
    try {
      const res = await axios.get(`store/${idStore}`);
      setDataStore(res.data);

      const apiCheckTaxCode = await axios.get(`/business/${res.data.taxcode}`);
      setDataTaxCode(apiCheckTaxCode.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, [idStore]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file));
      setDataStore({
        ...dataStore,
        imgbackgound: file,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataStore({
      ...dataStore,
      [name]: value,
    });
  };

  const validate = () => {
    const { namestore, address, email, phone, cccdnumber, taxcode } = dataStore;
    const pattenPhone = /0[0-9]{9}/;
    const pattenEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pattenCccd = /^[0-9]{9,12}$/;

    if (!namestore || !address || !email || !phone || !cccdnumber) {
      toast.warning("Cần nhập tất cả thông tin");
      return false;
    }

    if (namestore.length < 10) {
      toast.warning("Tên cửa hàng phải tối thiểu 10 kí tự");
      return false;
    }

    if (!pattenPhone.test(phone)) {
      toast.warning("Số điện thoại không hợp lệ");
      return false;
    }

    if (!pattenEmail.test(email)) {
      toast.warning("Email không hợp lệ");
      return false;
    }

    if (!pattenCccd.test(cccdnumber)) {
      toast.warning("Căn cước không hợp lệ");
      return false;
    }

    if (!taxcode) {
      return true;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        //kiểm tra mã số thuế trước khi cập nhật
        if (dataStore.taxcode) {
          const checkTax = await axios.get(`/business/${dataStore.taxcode}`);
          if (!checkTax.data.data || checkTax.status === 524) {
            toast.update(idToast, {
              render: "Mã số thuế không tồn tại ",
              type: "warning",
              isLoading: false,
              autoClose: 5000,
              closeButton: true,
            });
            return;
          }
        }

        //Thực hiện gửi dữ liệu về backend
        const formData = new FormData();
        formData.append(
          "store",
          JSON.stringify({
            id : idStore,
            namestore: dataStore.namestore,
            address: dataStore.address,
            email: dataStore.email,
            phone: dataStore.phone,
            cccdnumber: dataStore.cccdnumber,
            user: {
              id: user.id,
            },
            taxcode: dataStore.taxcode,
            slug : dataStore.slug,
          })
        );
        if (dataStore.imgbackgound instanceof File) {
          formData.append("imgbackgound", dataStore.imgbackgound);
        }

        await axios.put(`/store/${idStore}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setTimeout(() => {
          toast.update(idToast, {
            render: "Sửa thông tin cửa hàng thành công",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
          loadData();
        }, 500);
      } catch (error) {
        console.log(error);
        if (error.response) {
          const errorMessage =
            error.response.status === 409
              ? error.response.data
              : error.response.data;
          toast.update(idToast, {
            render: errorMessage,
            type: "warning",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        } else if (error.request) {
          toast.update(idToast, {
            render: "Máy chủ không phản hồi",
            type: "warning",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        } else {
          toast.update(idToast, {
            render: "Cập nhật thất bại",
            type: "warning",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        }
        console.error("Lỗi từ backend hoặc máy chủ:", error);
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
    <form onSubmit={handleSubmit}>
      <div className="card mt-4 p-3">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6 border-end">
            <h3 className="text-center">Thông tin kênh bán hàng của tôi</h3>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <h3 className="text-center">Hình nền shop</h3>
          </div>
        </div>
        <span className="p-0 m-0">
          <hr />
        </span>

        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6 border-end">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="mb-3">
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
                        fullWidth
                        name="namestore"
                        value={dataStore.namestore}
                        onChange={handleInputChange}
                        id="input-with-sx-nameStore"
                        label="Tên shop"
                        variant="standard"
                      />
                    </Box>
                    {/* <input
                      type="text"
                      name="namestore"
                      value={dataStore.namestore}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Tên cửa hàng"
                    /> */}
                  </div>
                  <div className="mb-3">
                    <TextField
                      id="outlined-multiline-static"
                      label="Địa chỉ cửa hàng"
                      multiline
                      rows={9}
                      fullWidth
                      defaultValue="Địa chỉ cửa hàng"
                      name="address"
                      value={dataStore.address}
                      onChange={handleInputChange}
                    />
                    {/* <textarea
                    name="address"
                    className="form-control"
                    placeholder="Địa chỉ cửa hàng"
                    rows={8}
                    value={dataStore.address}
                    onChange={handleInputChange}
                  ></textarea> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div>
                <div className="d-flex justify-content-center">
                  <img
                    src={
                      previewAvatar ||
                      geturlIMG(idStore, dataStore.imgbackgound)
                    }
                    alt="Logo shop"
                    id="img-background"
                    className="rounded-3"
                  />
                </div>
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "40px" }}
                >
                  <Button
                    style={{ width: "400px" }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Tải hình ảnh
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-4 p-3 mb-4">
        <h3 className="text-start">Thông tin chi tiết</h3>
        <span className="p-0 m-0">
          <hr />
        </span>

        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6 border-end">
              <div className="mb-3">
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <MarkEmailUnreadIcon
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
                    value={dataStore.email}
                    onChange={handleInputChange}
                    id="input-with-sx-emailStore"
                    label="Email shop"
                    variant="standard"
                  />
                </Box>
                {/* <input
                      type="email"
                      name="email"
                      value={dataStore.email}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Email cửa hàng"
                    /> */}
              </div>
              <div className="mb-3">
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <PhoneCallback
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
                    value={dataStore.phone}
                    onChange={handleInputChange}
                    id="input-with-sx-phoneStore"
                    label="Số điện thoại shop"
                    variant="standard"
                  />
                </Box>
                {/* <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={dataStore.phone}
                      onChange={handleInputChange}
                      placeholder="Số điện thoại cửa hàng"
                    /> */}
              </div>
              <div className="mb-3">
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <BadgeOutlined
                    sx={{
                      color: "action.active",
                      mr: 1,
                      my: 0.5,
                      fontSize: "25px",
                    }}
                  />
                  <TextField
                    fullWidth
                    name="cccdnumber"
                    value={dataStore.cccdnumber}
                    onChange={handleInputChange}
                    id="input-with-sx-cccdSeller"
                    label="Căn cước công dân chủ shop"
                    variant="standard"
                  />
                </Box>
                {/* <input
                      type="text"
                      name="cccdnumber"
                      value={dataStore.cccdnumber}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Căn cước công dân"
                    /> */}
              </div>
              <button
                type="submit"
                className="btn mt-3"
                id="btn-update-infoShop"
              >
                Lưu thay đổi
              </button>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="mb-3">
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <SubtitlesOutlinedIcon
                    sx={{
                      color: "action.active",
                      mr: 1,
                      my: 0.5,
                      fontSize: "25px",
                    }}
                  />
                  <TextField
                    fullWidth
                    name="taxcode"
                    value={dataStore.taxcode}
                    onChange={handleInputChange}
                    id="input-with-sx-taxCodeSeller"
                    label="Mã thuế của shop"
                    variant="standard"
                  />
                </Box>
              </div>
              <div className="mb-3">
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <StorefrontOutlinedIcon
                    sx={{
                      color: "action.active",
                      mr: 1,
                      my: 0.5,
                      fontSize: "25px",
                    }}
                  />
                  <TextField
                    fullWidth
                    name="name"
                    value={dataTaxCode?.name}
                    onChange={handleInputChange}
                    id="input-with-sx-taxNameSeller"
                    label="Tên người kinh doanh"
                    variant="standard"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </div>
              <div className="mb-3">
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <BusinessIcon
                    sx={{
                      color: "action.active",
                      mr: 1,
                      my: 0.5,
                      fontSize: "25px",
                    }}
                  />
                  {/* <TextField
                    fullWidth
                    name="address"
                    value={dataTaxCode?.address}
                    onChange={handleInputChange}
                    id="input-with-sx-taxAddressSeller"
                    label="địa chỉ đăng ký kinh doanh"
                    variant="standard"
                    InputProps={{
                      readOnly: true,
                    }}
                  /> */}
                  <TextField
                    fullWidth
                    name="address"
                    value={dataTaxCode?.address}
                    onChange={handleInputChange}
                    id="outlined-multiline-static"
                    label="Multiline"
                    multiline
                    rows={2}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileShop;
