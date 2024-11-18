import React, { useEffect, useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import { Box, Button, Card, CardContent } from "@mui/material";
import { confirmAlert } from "react-confirm-alert";
import FormSelectAdress from "../APIAddressVN/FormSelectAdress.js";
import TextField from "@mui/material/TextField";

const ShippingList = () => {
  const [shippingInfo, setShippingInfo] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [selectedShipping, setSelectedShipping] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [addingAddress, setAddingAddress] = useState("");
  const [resetForm, setResetForm] = useState(false);

  const fetchShippingInfo = async () => {
    try {
      const response = await axios.get(`/shippingInfo`, {
        params: { userId: user.id },
      });
      setShippingInfo(response.data);
    } catch (error) {
      console.error("Error fetching shipping information:", error);
    }
  };

  const handleReset = () => {
    setResetForm(true);
  };

  useEffect(() => {
    if (user.id) {
      fetchShippingInfo();
    }
  }, [user.id]);

  const handleAdd = async () => {
    if (!addingAddress) {
      toast("Vui lòng nhập địa chỉ!");
      return;
    }
    try {
      await axios.post(`/shippingInfoCreate`, {
        address: addingAddress,
        user: { id: user.id },
      });

      handleReset();
      toast.success("Thêm địa chỉ thành công!");
      fetchShippingInfo();
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
    } catch (error) {
      console.error("Error adding shipping information:", error);
      toast.error("Lỗi thêm địa chỉ!");
    }
  };

  const handleUpdate = async () => {
    if (!newAddress) {
      toast("Vui lòng nhập địa chỉ.");
      return;
    }

    try {
      await axios.put(`/shippingInfoUpdate/${selectedShipping.id}`, {
        ...selectedShipping,
        address: newAddress,
      });
      handleReset();
      toast.success("Cập nhật địa chỉ thành công!");
      fetchShippingInfo();
      const closeModalButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeModalButton) {
        closeModalButton.click();
      }
    } catch (error) {
      console.error("Error updating shipping information:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật địa chỉ.");
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Xóa địa chỉ giao hàng",
      message: "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.delete(`/shippingInfoDelete/${id}`);
              toast.success("Xóa địa chỉ thành công!");
              fetchShippingInfo();
            } catch (error) {
              console.error("Error deleting shipping information:", error);
              toast.error("Đã có đơn hàng sử dụng địa chỉ này!");
            }
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  return (
    <>
      <Box
        className="col-12 col-md-12 col-lg-12 offset-lg-0"
        sx={{
          transition: "0.5s",
        }}
      >
        <Card
          className=" rounded-4"
          sx={{
            backgroundColor: "backgroundElement.children",
            transition: "0.5s",
          }}
        >
          <CardContent className="">
            <h3 className="d-flex justify-content-between align-items-center">
              Danh sách địa chỉ nhận hàng
              <Button
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
                style={{
                  width: "auto",
                  backgroundColor: "rgb(218, 255, 180)",
                  color: "rgb(45, 91, 0)",
                }}
                disableElevation
              >
                Thêm
              </Button>
            </h3>
            <hr />
            <Box className="" >
              {shippingInfo.length > 0 ? (
                shippingInfo.map((info) => (
                  <Card className="mb-3" id="cartItem" key={info.id}>
                    <CardContent className="d-flex justify-content-between align-items-center" sx={{backgroundColor  : "background.default"}}>
                      <h5 className="mb-1">{info.address}</h5>
                      <div className="button-group">
                        <Button
                          className="me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal3"
                          onClick={() => setSelectedShipping(info)}
                          style={{
                            width: "auto",
                            backgroundColor: "rgb(255, 255, 157)",
                            color: "rgb(100, 107, 0)",
                          }}
                          disableElevation
                        >
                          Sửa
                        </Button>
                        <Button
                          onClick={() => handleDelete(info.id)}
                          style={{
                            width: "auto",
                            backgroundColor: "rgb(255, 184, 184)",
                            color: "rgb(198, 0, 0)",
                          }}
                          disableElevation
                        >
                          Xóa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <h1>Chưa có địa chỉ nhận hàng nào.</h1>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <div
        className="modal fade"
        id="exampleModal3"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel3"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel3">
                Cập nhật địa chỉ nhận hàng
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* <label className="label-control">
                Địa chỉ nhận hàng hiện tại
              </label>
              <input
                type="text"
                className="form-control mb-3"
                value={selectedShipping ? selectedShipping.address : ""}
                readOnly
              /> */}

              <TextField
                className="mb-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Địa chỉ nhận hàng cũ"
                variant="outlined"
                value={selectedShipping ? selectedShipping.address : ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />

              {/* <label className="label-control">Địa chỉ nhận hàng mới</label>
              <input
                type="text"
                className="form-control mb-3"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              /> */}

              <TextField
                className="mb-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Địa chỉ nhận hàng mới"
                variant="outlined"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />

              <FormSelectAdress
                apiAddress={(fullAddress) => setNewAddress(fullAddress)}
                resetForm={resetForm}
                editFormAddress={selectedShipping.address}
              />

              <Button
                className="mt-3"
                style={{
                  width: "auto",
                  backgroundColor: "rgb(218, 255, 180)",
                  color: "rgb(45, 91, 0)",
                }}
                disableElevation
                onClick={handleReset}
              >
                Chọn lại
              </Button>
            </div>
            <div className="modal-footer">
              <Button
                onClick={handleUpdate}
                style={{
                  width: "auto",
                  backgroundColor: "rgb(204,244,255)",
                  color: "rgb(0,70,89)",
                }}
                disableElevation
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel2"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel2">
                Thêm địa chỉ nhận hàng
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* <label className="label-control">Địa chỉ nhận hàng</label>
              <input
                type="text"
                className="form-control mb-3"
                value={addingAddress}
                onChange={(e) => setAddingAddress(e.target.value)}
              /> */}

              <TextField
                className="mb-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Nhập địa chỉ nhận hàng"
                variant="outlined"
                value={addingAddress}
                onChange={(e) => setAddingAddress(e.target.value)}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />

              <FormSelectAdress
                apiAddress={(fullAddress) => setAddingAddress(fullAddress)}
                resetForm={resetForm}
                editFormAddress={addingAddress}
              />

              <Button
                className="mt-3"
                style={{
                  width: "auto",
                  backgroundColor: "rgb(218, 255, 180)",
                  color: "rgb(45, 91, 0)",
                }}
                disableElevation
                onClick={handleReset}
              >
                Chọn lại
              </Button>
            </div>
            <div className="modal-footer">
              <Button
                onClick={handleAdd}
                style={{
                  width: "auto",
                  backgroundColor: "rgb(204,244,255)",
                  color: "rgb(0,70,89)",
                }}
                disableElevation
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingList;
