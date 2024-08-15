import React, { useEffect, useState } from "react";
import axios from "../../Localhost/Custumize-axios";
import useSession from "../../Session/useSession";

const ShippingList = () => {
  const [shippingInfo, setShippingInfo] = useState([]);
  const [id] = useSession("id"); // Lấy userId từ session
  const [selectedShipping, setSelectedShipping] = useState(null); // Để lưu thông tin địa chỉ hiện tại được chọn
  const [newAddress, setNewAddress] = useState(""); // Để lưu giá trị địa chỉ mới
  const [successMessage, setSuccessMessage] = useState(""); // Để lưu thông báo thành công

  // Các thông báo lỗi
  const [errorMessageAdd, setErrorMessageAdd] = useState(""); // Để lưu thông báo lỗi khi thêm
  const [errorMessageEdit, setErrorMessageEdit] = useState(""); // Để lưu thông báo lỗi khi cập nhật
  const [errorMessageDelete, setErrorMessageDelete] = useState(""); // Để lưu thông báo lỗi khi xóa

  const [addingAddress, setAddingAddress] = useState(""); // Để lưu địa chỉ mới khi thêm

  useEffect(() => {
    const fetchShippingInfo = async () => {
      try {
        const response = await axios.get(`/shippingInfo`, {
          params: { userId: id },
        });
        setShippingInfo(response.data);
      } catch (error) {
        console.error("Error fetching shipping information:", error);
      }
    };

    if (id) {
      fetchShippingInfo();
    }
  }, [id]);

  // Hàm reset thông báo lỗi khi thêm
  const resetErrorMessageAdd = () => {
    setErrorMessageAdd("");
  };

  // Hàm reset thông báo lỗi khi cập nhật
  const resetErrorMessageEdit = () => {
    setErrorMessageEdit("");
  };

  // Hàm reset thông báo lỗi khi xóa
  const resetErrorMessageDelete = () => {
    setErrorMessageDelete("");
  };

  const handleEditClick = (shipping) => {
    setSelectedShipping(shipping);
    setNewAddress(shipping.address); // Đặt giá trị của input
    setSuccessMessage(""); // Reset thông báo thành công
    resetErrorMessageAdd(); // Reset thông báo lỗi khi thêm
    resetErrorMessageEdit(); // Reset thông báo lỗi khi cập nhật
    resetErrorMessageDelete(); // Reset thông báo lỗi khi xóa
  };

  const handleUpdate = async () => {
    if (!newAddress.trim()) {
      setErrorMessageEdit("Vui lòng nhập địa chỉ.");
      setTimeout(resetErrorMessageEdit, 500); // Reset thông báo lỗi sau 3 giây
      return;
    }

    try {
      await axios.put(`/shippingInfoUpdate/${selectedShipping.id}`, {
        ...selectedShipping,
        address: newAddress,
      });
      setShippingInfo(
        shippingInfo.map((info) =>
          info.id === selectedShipping.id
            ? { ...info, address: newAddress }
            : info
        )
      );
      setSuccessMessage("Cập nhật địa chỉ thành công!");
      setSelectedShipping(null);
      setNewAddress("");
      setTimeout(() => setSuccessMessage(""), 500); // Reset thông báo sau 3 giây
      resetErrorMessageEdit(); // Reset thông báo lỗi khi cập nhật
    } catch (error) {
      console.error("Error updating shipping information:", error);
      setErrorMessageEdit("Đã xảy ra lỗi khi cập nhật địa chỉ.");
      setTimeout(() => setErrorMessageEdit(""), 500); // Reset thông báo lỗi sau 3 giây
    }
  };

  const handleAdd = async () => {
    if (!addingAddress.trim()) {
      setErrorMessageAdd("Vui lòng nhập địa chỉ.");
      setTimeout(resetErrorMessageAdd, 500); // Reset thông báo lỗi sau 3 giây
      return;
    }
    try {
      const newShippingInfor = {
        address: addingAddress,
        user: { id }, // Đảm bảo gửi userId nếu cần
      };
      await axios.post(`/shippingInfoCreate`, newShippingInfor);
      setShippingInfo([...shippingInfo, newShippingInfor]);
      setSuccessMessage("Thêm địa chỉ thành công!");
      setAddingAddress("");
      setTimeout(() => setSuccessMessage(""), 500); // Reset thông báo sau 3 giây
      resetErrorMessageAdd(); // Reset thông báo lỗi khi thêm
    } catch (error) {
      console.error("Error adding shipping information:", error);
      setErrorMessageAdd("Đã xảy ra lỗi khi thêm địa chỉ.");
      setTimeout(() => setErrorMessageAdd(""), 500); // Reset thông báo lỗi sau 3 giây
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa địa chỉ này không?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`/shippingInfoDelete/${id}`);
        setShippingInfo(shippingInfo.filter((info) => info.id !== id));
        setSuccessMessage("Xóa địa chỉ thành công!");
        window.alert("Xóa địa chỉ thành công!");
        setTimeout(() => setSuccessMessage(""), 500); // Reset thông báo sau 3 giây
        resetErrorMessageDelete(); // Reset thông báo lỗi khi xóa
      } catch (error) {
        if (error.response && error.response.status === 409) {
          window.alert(error.response.data); // Hiển thị thông báo lỗi từ backend
        } else {
          console.error("Error deleting shipping information:", error);
          window.alert("Đã xảy ra lỗi khi xóa địa chỉ.");
          resetErrorMessageDelete(); // Reset thông báo lỗi khi xóa
        }
      }
    }
  };

  return (
    <div>
      <div className="container mt-3">
        <div className="card">
          <div className="card-body">
            <h3 className="d-flex justify-content-between align-items-center">
              Danh sách địa chỉ nhận hàng
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
              >
                Thêm
              </button>
            </h3>
            <hr />
            <div className="list-group">
              {shippingInfo.length > 0 ? (
                shippingInfo.map((info) => (
                  <div className="card mt-3" id="cartShipping" key={info.id}>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5 className="mb-1">{info.address}</h5>
                      <div className="button-group">
                        <button
                          type="button"
                          className="btn btn-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal3"
                          onClick={() => handleEditClick(info)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(info.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="list-group-item">Chưa có địa chỉ nào.</div>
              )}
            </div>
            {successMessage && (
              <div className="alert alert-success mt-3" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessageAdd && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessageAdd}
              </div>
            )}
            {errorMessageEdit && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessageEdit}
              </div>
            )}
            {errorMessageDelete && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessageDelete}
              </div>
            )}
          </div>
        </div>
      </div>

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
            </div>
            <div className="modal-body">
              <label className="label-control">Địa chỉ nhận hàng</label>
              <input
                type="text"
                className="form-control mb-3"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              {errorMessageEdit && (
                <div className="alert alert-danger mt-2" role="alert">
                  {errorMessageEdit}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success mt-2" role="alert">
                  {successMessage}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Cập nhật
              </button>
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
            </div>
            <div className="modal-body">
              <label className="label-control">Địa chỉ nhận hàng</label>
              <input
                type="text"
                className="form-control"
                value={addingAddress}
                onChange={(e) => setAddingAddress(e.target.value)}
              />
              {errorMessageAdd && (
                <div className="alert alert-danger mt-2" role="alert">
                  {errorMessageAdd}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success mt-2" role="alert">
                  {successMessage}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingList;
