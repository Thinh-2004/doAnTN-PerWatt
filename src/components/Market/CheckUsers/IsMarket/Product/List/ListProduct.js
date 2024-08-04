import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListProductStyle.css";
import axios from "../../../../../../Localhost/Custumize-axios";
import useSession from "../../../../../../Session/useSession";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { bouncy } from "ldrs";

bouncy.register();

const ListProduct = () => {
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const [fill, setFill] = useState([]);
  const [idStore] = useSession("idStore");
  const [loading, setLoading] = useState(true);

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };
  const loadData = async (idStore) => {
    try {
      const res = await axios.get(`/productStore/${idStore}`);
      setFill(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  };
  useEffect(() => {
    loadData(idStore);
  }, [idStore]);

  const handleSubmitDelete = (idPr) => {
    confirmAlert({
      title: "Bạn có chắc muốn xóa chứ",
      message: "Thực hiện chức năng xóa sản phẩm",
      buttons: [
        {
          label: "Xóa",
          onClick: async () => {
            const id = toast.loading("Vui lòng chờ...");
            try {
              const res = await axios.delete(`ProductDelete/${idPr}`);
              setTimeout(() => {
                toast.update(id, {
                  render: "Xóa thành công",
                  type: "success",
                  isLoading: false,
                  autoClose: 5000,
                  closeButton: true,
                });
                loadData(idStore);
              });
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Hủy",
        },
      ],
    });
  };

  return (
    <div className="card mt-4">
      <div className="d-flex justify-content-between p-4">
        <h3>Sản phẩm cửa hàng</h3>
        <Link
          className="btn"
          id="btn-add"
          to={"/profileMarket/FormStoreProduct"}
        >
          Thêm sản phẩm
        </Link>
      </div>
      <div className="card" style={{ border: "none" }}>
        <div className="card-body">
          <table
            className="table table text-center"
            style={{ verticalAlign: "middle" }}
          >
            <thead>
              <tr>
                <th scope="col">Hình</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Loại</th>
                <th scope="col">Hãng</th>
                <th scope="col">Giá</th>
                <th scope="col">SL</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>

            {loading ? (
              <div className="mt-4">
                <l-bouncy size="60" speed="0.75" color="black"></l-bouncy>
              </div>
            ) : (
              <>
                {" "}
                <tbody>
                  {fill.map((fill) => {
                    const firstIMG = fill.images[0];
                    return (
                      <tr key={fill.id}>
                        <td id="td-img">
                          {firstIMG ? (
                            <img
                              src={geturlIMG(fill.id, firstIMG.imagename)}
                              alt=""
                              className="img-fluid"
                            />
                          ) : (
                            <img
                              src="/images/no_img.png"
                              alt=""
                              className="img-fluid"
                            />
                          )}
                        </td>
                        <td>{fill.name}</td>
                        <td>{fill.productcategory.name}</td>
                        <td>{fill.trademark.name}</td>
                        <td>{formatPrice(fill.price)}</td>
                        <td>{fill.quantity}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Link
                              className="btn"
                              id="btn-edit"
                              to={`/profileMarket/updateProduct/${fill.id}`}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button
                              className="btn mx-2"
                              id="btn-delete"
                              onClick={(e) => handleSubmitDelete(fill.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                            <Link
                              className="btn"
                              id="btn-showDetail"
                              to={`/profileMarket/checkItemProduct/${fill.id}`}
                            >
                              <i class="bi bi-eye"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
