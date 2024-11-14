import React, { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "../../../../Localhost/Custumize-axios";
import { Box } from "@mui/material";
import { ThemeModeContext } from "../../../ThemeMode/ThemeModeProvider";

const NavStore = ({ FillDetailPr, countProductStore }) => {
  const {mode} = useContext(ThemeModeContext);
  const geturlIMGStore = (userId, filename) => {
    return `${axios.defaults.baseURL}files/user/${userId}/${filename}`;
  };
  
  //Hàm cắt chuỗi địa chỉ
  const splitByAddress = (address) => {
    const parts = address?.split(",");
    if (parts?.length > 0) {
      return parts[4];
    }
  };

  //Hàm tính toán ngày giờ
  const calculateAccountDuration = (accountCreatedDate) => {
    //Khởi tạo ngày từ CSDL và ngày hiện tại
    const createdDate = new Date(accountCreatedDate);
    const now = new Date();

    const diffInMilliseconds = now - createdDate; //Tính khoảng cách (Tính bằng mili)
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); //Chuyển đổi kết quả mili giây thành ngày

    if (diffInDays <= 7) {
      //Nhỏ hơn 7 ngày
      return "Mới tham gia";
    }

    //Tính tổng số tháng
    const diffInMonths =
      (now.getFullYear() - createdDate.getFullYear()) * 12 +
      (now.getMonth() - createdDate.getMonth());

    if (diffInMonths >= 12) {
      //Kết quả lớn hơn 12 tháng
      const years = Math.floor(diffInMonths / 12);
      return years + (years === 1 ? " năm" : " năm");
    } else if (diffInMonths > 0) {
      //Kết quả số tháng lớn hơn 0 nhưng nhỏ hơn 12
      return diffInMonths + (diffInMonths === 1 ? " tháng" : " tháng");
    } else {
      //Ngược lại lấy số ngày
      return diffInDays + " ngày";
    }
  };

  return (
    <Box
      sx={{ backgroundColor: "backgroundElement.children" }}
      className="row rounded-4 mt-3"
    >
      <div className="col-lg-4 col-md-4 col-sm-4 border-end">
        <div className="d-flex justify-content-center">
          <div className="p-2 d-flex justify-content-center">
            <Link to={`/pageStore/${FillDetailPr?.store?.slug}`}>
              <img
                src={
                  FillDetailPr && FillDetailPr.store
                    ? geturlIMGStore(
                        FillDetailPr.store.user.id,
                        FillDetailPr.store.user.avatar
                      )
                    : "/images/no_img.png"
                }
                alt=""
                id="avt-store"
                //   onClick={handleViewStoreInfo}
                style={{ cursor: "pointer", border: "none" }}
              />
            </Link>
          </div>
          <div className=" mt-3 ">
            <div className="text-center mb-1">
              <Link
                to={`/pageStore/${FillDetailPr?.store?.slug}`}
                htmlFor=""
                className={`fs-6 ${
                  mode === "light" ? "text-dark" : "text-white"
                }`}
                // onClick={handleViewStoreInfo}
                style={{ cursor: "pointer" }}
              >
                {FillDetailPr && FillDetailPr.store
                  ? FillDetailPr.store.namestore
                  : "N/A"}
              </Link>
            </div>
            <div className="d-flex">
              <Link
                to={`/pageStore/${FillDetailPr?.store?.slug}`}
                className="text-decoration-none"
              >
                <button
                  className="btn btn-sm mx-2"
                  // onClick={handleViewStoreInfo}
                  id="btn-infor-shop"
                >
                  Xem thông tin
                </button>
              </Link>

              <button className="btn btn-sm" id="btn-chatMessage">
                Nhắn tin shop
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col-md-8 col-sm-8">
        <div className="row mt-4">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-4 mb-3 border-end">
              <div className="d-flex justify-content-between align-items-center">
                <label className="fst-italic">Sản phẩm đã đăng bán:</label>
                <span className="fw-semibold">{countProductStore}</span>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 mb-3  border-end">
              <div className="d-flex justify-content-between align-items-center">
                <label className="fst-italic">Địa chỉ:</label>
                <span className="fw-semibold">
                  {splitByAddress(FillDetailPr?.store.address)}
                </span>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="fst-italic">Người theo dõi:</label>
                <span className="fw-semibold">999</span>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 mb-3  border-end">
              <div className="d-flex justify-content-between align-items-center">
                <label className="fst-italic">Đã tham gia:</label>
                <span className="fw-semibold">
                  {calculateAccountDuration(FillDetailPr?.store.createdtime)}
                </span>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 mb-3  border-end">
              <div className="d-flex justify-content-between align-items-center">
                <label className="fst-italic">Đánh giá cửa hàng:</label>
                <span className="fw-semibold">100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default NavStore;
