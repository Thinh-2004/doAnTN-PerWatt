import React from "react";
import { Link } from "react-router-dom";
import "./ListProductStyle.css";

const ListProduct = () => {
  return (
    <div className="card mt-4">
      <div className="d-flex justify-content-between p-4">
        <h3>Sản phẩm cửa hàng</h3>
        <Link className="btn" id="btn-add" to={"/profileMarket/FormStoreProduct"}>Thêm sản phẩm</Link>
      </div>
      <div className="card" style={{ border: "none" }}>
        <div className="card-body">
          <table
            class="table table text-center"
            style={{ verticalAlign: "middle" }}
          >
            <thead>
              <tr>
                <th scope="">Hình</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Loại</th>
                <th scope="col">Giá</th>
                <th scope="col">Số luợng</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="td-img">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKr_hgRUfGakotMd3G3_PHSAWsS7PeMJfRmw&s"
                    alt=""
                    className="img-fluid "
                  />
                </td>
                <td>Chuột gaming</td>
                <td>Chuột</td>
                <td>120000</td>
                <td>200</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <button className="btn" id="btn-edit"><i class="bi bi-pencil-square"></i></button>
                    <button className="btn mx-2" id="btn-delete"><i class="bi bi-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
