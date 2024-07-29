import React from "react";
import "./FormProduct.css";
import { Link } from "react-router-dom";

const FormProduct = () => {
  return (
    <div className="row mt-4">
      <form action="">
        <div className="col-lg-12">
          <div className="bg-white rounded-4">
            <div className="card">
              <h3 className="text-center mt-4">Thông tin sản phẩm</h3>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 border-end">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm"
                      />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex">
                        <input
                          type="text"
                          placeholder="Nhập giá sản phẩm"
                          className="form-control me-2"
                        />
                        <input
                          type="text"
                          placeholder="Nhập giá số lượng"
                          className="form-control "
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <textarea
                        name=""
                        id=""
                        placeholder="Mô tả sản phẩm"
                        className="form-control"
                        rows={12}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3 border" id="bg-upload-img">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXa36ntr1L1r36kkklYhoaP98GT-hokpMTug&s"
                        alt=""
                        className="img-thumbnail"
                      />
                    </div>
                    <div className="mb-3">
                      <input type="file" className="form-control" multiple />
                    </div>
                    <div className="mb-3" id="remember">
                      <p>
                        <span className="text-danger">Lưu ý</span>
                        <ul>
                          <li>Chọn ảnh hoặc video tối đa 9 </li>
                          <li>
                            Video tối da 10MB, độ phân giải không vượt quá
                            1280x1280px
                          </li>
                          <li>Độ dài: 10s-60s</li>
                          <li>Định dạng: MP4</li>
                        </ul>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="bg-white rounded-4 mt-3">
            <div className="card">
              <h3 className="mx-4 mt-4">Thông tin chi tiết</h3>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-4 d-flex">
                      <select name="" id="" className="form-select">
                        <option value="" selected hidden>
                          Vui lòng chọn loại sản phẩm
                        </option>
                        <option value="chuot">Chuột</option>
                      </select>
                      <button
                        type="button"
                        class="btn btn-success mx-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        <i class="bi bi-plus-lg"></i>
                      </button>
                      <div
                        class="modal fade"
                        id="exampleModal"
                        tabindex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1
                                class="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                Thêm loại sản phẩm
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="btn-close"
                              ></button>
                            </div>
                            <form action="">
                              <div class="modal-body">
                                <div className="mb-3">
                                  <label htmlFor="">Nhập tên loại mới:</label>
                                  <input
                                    type="text"
                                    placeholder="Nhập tên loại"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button
                                  type="button"
                                  class="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Đóng
                                </button>
                                <button type="button" class="btn btn-primary">
                                  Lưu và cập nhật
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 d-flex">
                      <select name="" id="" className="form-select">
                        <option value="" selected hidden>
                          Vui lòng chọn thương hiệu
                        </option>
                        <option value="NB">No Brand</option>
                      </select>
                      <button
                        type="button"
                        class="btn btn-success mx-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalBrand"
                      >
                        <i class="bi bi-plus-lg"></i>
                      </button>
                      <div
                        class="modal fade"
                        id="exampleModalBrand"
                        tabindex="-1"
                        aria-labelledby="exampleModalBrandLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1
                                class="modal-title fs-5"
                                id="exampleModalBrandLabel"
                              >
                                Thêm thương hiệu
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                 id="btn-close"
                              ></button>
                            </div>
                            <form action="">
                              <div class="modal-body">
                                <div className="mb-3">
                                  <label htmlFor="">
                                    Nhập thương hiệu mới:
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Nhập tên thương hiệu"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button
                                  type="button"
                                  class="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Đóng
                                </button>
                                <button type="button" class="btn btn-primary">
                                  Lưu và cập nhật
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 d-flex">
                      <select name="" id="" className="form-select">
                        <option value="" selected hidden>
                          Vui lòng thời gian bảo hành
                        </option>
                        <option value="1M">1 tháng</option>
                      </select>
                      <button
                        type="button"
                        class="btn btn-success mx-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalGuaranteed"
                      >
                        <i class="bi bi-plus-lg"></i>
                      </button>
                      <div
                        class="modal fade"
                        id="exampleModalGuaranteed"
                        tabindex="-1"
                        aria-labelledby="exampleModalGuaranteedLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h1
                                class="modal-title fs-5"
                                id="exampleModalGuaranteedLabel"
                              >
                                Thêm thời gian bảo hành
                              </h1>
                              <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                 id="btn-close"
                              ></button>
                            </div>
                            <form action="">
                              <div class="modal-body">
                                <div className="mb-3">
                                  <label htmlFor="">
                                    Nhập thời gian bảo hành:
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="VD: 1 tháng, 2 tháng,..."
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button
                                  type="button"
                                  class="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Đóng
                                </button>
                                <button type="button" class="btn btn-primary">
                                  Lưu và cập nhật
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 border-start">
                    <div className="mb-4 d-flex">
                      <select name="" id="" className="form-select">
                        <option
                          value=""
                          className="text-secondary"
                          selected
                          hidden
                        >
                          Chuyên dụng game
                        </option>
                        <option value="Y">Có</option>
                        <option value="N">Không</option>
                      </select>
                    </div>
                    <div className="mb-4 d-flex">
                      <input
                        type="text"
                        placeholder="Nhập kích cỡ (dài x rộng x cao)"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 mb-4">
          <button className="btn mx-2" id="btn-addProduct">
            Đăng sản phẩm
          </button>
          <button className="btn mx-2" id="btn-resetProduct">
            Làm mới
          </button>
          <Link
            className="btn mx-2"
            id="btn-cancelProduct"
            to={"/profileMarket/listStoreProduct"}
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FormProduct;
