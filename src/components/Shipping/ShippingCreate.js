import React from "react";

const Shipping = () => {
  return (
    <div>
      <div className="col-8 offset-2 mt-3">
        <div className="card">
          <div className="card-body">
          <h3>Thêm địa chỉ nhận hàng</h3>
          <hr />
          <label className="label-control">Địa chỉ nhận hàng</label>
            <input type="text" className="form-control mb-3" />
            <button className="btn btn-primary">Thêm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
