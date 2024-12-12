import React, { useContext, useEffect, useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Pagination,
  Radio,
} from "@mui/material";
import { confirmAlert } from "react-confirm-alert";
import FormSelectAdress from "../APIAddressVN/FormSelectAdress.js";
import TextField from "@mui/material/TextField";
import { ThemeModeContext } from "../ThemeMode/ThemeModeProvider.js";

const ShippingList = () => {
  const [shippingInfo, setShippingInfo] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [selectedShipping, setSelectedShipping] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [addingAddress, setAddingAddress] = useState("");
  const [resetForm, setResetForm] = useState(false);
  const [newHomeUpdate, setNewHomeUpdate] = useState("");
  const [newHomeAdd, setNewHomeAdd] = useState("");
  const [open, setOpen] = useState(false);

  const { mode } = useContext(ThemeModeContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalItems = shippingInfo.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = shippingInfo.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    setNewHomeAdd("");
    setNewHomeUpdate("");
    setTimeout(() => {
      setResetForm(false);
    }, 1000);
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

      toast.success("Thêm địa chỉ thành công!");
      fetchShippingInfo();
      handleReset();
    } catch (error) {
      console.error("Error adding shipping information:", error);
      toast.error("Lỗi thêm địa chỉ!");
    }
  };

  const handleUpdate = async () => {
    if (!addingAddress) {
      toast("Vui lòng nhập địa chỉ!");
      return;
    }
    try {
      await axios.put(`/shippingInfoUpdate/${selectedShipping.id}`, {
        ...selectedShipping,
        address: newAddress,
      });
      toast.success("Cập nhật địa chỉ thành công!");
      fetchShippingInfo();
      handleReset();

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

  const handleUpdateDefault = async (ShipId) => {
    setOpen(true);

    try {
      const response = await axios.get(`/shippingInfoId/${ShipId}`);

      if (response.data) {
        await axios.put(`/shippingInfoUpdateDefault/${ShipId}`, {
          isDefault: true,
          user: { id: user.id },
          address: response.data.address,
        });

        fetchShippingInfo();
      } else {
        toast.error("Không tìm thấy thông tin địa chỉ.");
      }
    } catch (error) {
      console.error("Error updating default address:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật địa chỉ");
    } finally {
      setTimeout(() => {
        setOpen(false);
      }, 100);
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div
        className="col-12 col-md-12 col-lg-12 offset-lg-0"
        style={{ transition: "0.5s" }}
      >
        <Card
          className=" rounded-4"
          sx={{
            boxShadow: "none",
            backgroundColor: "backgroundElement.children",
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
                <i class="bi bi-plus-circle-fill"></i>
              </Button>
            </h3>
            <hr />
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: theme.zIndex.drawer + 1,
              })}
              open={open}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            {currentItems.length > 0 ? (
              currentItems.map((info) => (
                <Card
                  className="mb-3"
                  key={info.id}
                  sx={{ backgroundColor: "backgroundElement.children" }}
                >
                  <CardContent className=" d-flex justify-content-between align-items-center">
                    <h5 className="">{info.address}</h5>
                    <div className="button-group">
                      <Button
                        className="me-3"
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
                        <i class="bi bi-pencil-square"></i>
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
                        <i class="bi bi-trash-fill"></i>
                      </Button>
                      <div>
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Địa chỉ mặc định"
                          checked={info.isdefault === true}
                          onClick={() => handleUpdateDefault(info.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h1>Chưa có địa chỉ nhận hàng nào.</h1>
            )}
          </CardContent>
        </Card>
      </div>

      <div
        className="modal fade"
        id="exampleModal3"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel3"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div
            className="modal-content"
            style={{
              backgroundColor: mode === "light" ? "white" : "#363535",
            }}
          >
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
              <TextField
                className="mb-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Địa chỉ nhận hàng cũ"
                variant="outlined"
                value={selectedShipping ? selectedShipping.address : ""}
                inputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                className="mb-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Địa chỉ nhận hàng mới"
                variant="outlined"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                inputProps={{
                  readOnly: true,
                }}
              />
              <FormSelectAdress
                apiAddress={(fullAddressUpdate) => {
                  setNewAddress(`${newHomeUpdate} ${fullAddressUpdate}`);
                }}
                resetForm={resetForm}
                setNewAddress=""
                editFormAddress={newAddress}
              />
              <TextField
                className="mt-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Số nhà"
                variant="outlined"
                value={newHomeUpdate}
                onChange={(e) => setNewHomeUpdate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setNewAddress(`${newHomeUpdate}, ${newAddress}`);
                    setNewHomeUpdate("");
                  }
                }}
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
                <i class="bi bi-arrow-clockwise"></i>
              </Button>
            </div>
            <div className="modal-footer">
              <Button
                onClick={handleUpdate}
                data-bs-dismiss="modal"
                style={{
                  width: "auto",
                  backgroundColor: "rgb(204,244,255)",
                  color: "rgb(0,70,89)",
                }}
                disableElevation
              >
                <i class="bi bi-pencil-square"></i>
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
          <div
            className="modal-content"
            style={{
              backgroundColor: mode === "light" ? "white" : "#363535",
            }}
          >
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
              <TextField
                className="mb-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Địa chỉ nhận hàng"
                variant="outlined"
                value={addingAddress}
                onChange={(e) => setAddingAddress(e.target.value)}
                inputProps={{
                  readOnly: true,
                }}
              />

              <FormSelectAdress
                apiAddress={(fullAddressAdd) => {
                  setAddingAddress(`${newHomeAdd} ${fullAddressAdd}`);
                }}
                resetForm={resetForm}
                setAddingAddress=""
                editFormAddress={addingAddress}
              />

              <TextField
                className="mt-3"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Số nhà"
                variant="outlined"
                value={newHomeAdd}
                onChange={(e) => setNewHomeAdd(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setAddingAddress(`${newHomeAdd}, ${addingAddress}`);
                    setNewHomeAdd("");
                  }
                }}
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
                <i class="bi bi-arrow-clockwise"></i>
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
                <i class="bi bi-plus-circle-fill"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        count={Math.ceil(totalItems / itemsPerPage)}
        page={currentPage}
        onChange={(event, value) => paginate(value)}
        color="primary"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      />
    </div>
  );
};

export default ShippingList;
