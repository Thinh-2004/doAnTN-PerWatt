import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../../Localhost/Custumize-axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "./WarehouseVoucherUserStyle.css";
import { Link } from "react-router-dom";

const WarehouseVoucherUser = () => {
  const [voucherByUser, setVoucherByUser] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(`findVoucherByIdUser/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hadfjkdshf")}`,
          },
        });
        setVoucherByUser(res.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu ");
        console.log(error);
      }
    };
    loadData();
  }, [user.id]);

  //Nhóm nameVoucher
  const groupedVouchers = voucherByUser.reduce((acc, current) => {
    const name = current.voucher.vouchername;

    // Kiểm tra nếu đã tồn tại nhóm với `vouchername`
    if (!acc[name]) {
      acc[name] = [];
    }

    // Thêm phần tử vào nhóm
    acc[name].push(current);

    return acc;
  }, {});

  //Chuyển object thành mảng
  const groupedVoucherArray = Object.entries(groupedVouchers).map(
    ([name, items]) => ({
      vouchername: name,
      vouchers: items,
    })
  );

  console.log(groupedVoucherArray);
  return (
    <>
      <Box
        sx={{ backgroundColor: "backgroundElement.children" }}
        className="rounded-3"
      >
        <Typography variant="h3" className="p-2 text-center">
          Kho voucher
        </Typography>
        <hr className="m-0 p-0" />
        <Box className="p-3">
          {groupedVoucherArray.length === 0 ? (
            <Typography variant="h5" className="text-center">
              Bạn chưa có voucher.
            </Typography>
          ) : (
            groupedVoucherArray.map((fill) => {
              return (
                <Card
                  className="mb-3"
                  sx={{ backgroundColor: "backgroundElement.children" }}
                >
                  <CardContent key={fill.id} className="mt-2">
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Giảm{" "}
                      <span className="text-danger">
                        {fill.vouchers[0].voucher.discountprice}%
                      </span>
                    </Typography>

                    <div className="d-flex justify-content-between">
                      <div>
                        <Typography variant="h5" component="div">
                          {fill.vouchername}
                        </Typography>
                        <img
                          src={
                            fill.vouchers[0].voucher.productDetail.product
                              .images[0].imagename
                          }
                          alt=""
                          id="img-product-voucher"
                          className="mb-2 mt-2"
                        />
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          Ngày kết thúc:{" "}
                          <span className="text-danger">
                            {dayjs(fill.vouchers[0].voucher.endday).format(
                              "DD-MM-YYYY"
                            )}
                          </span>
                        </Typography>
                      </div>
                      <div className="align-content-center">
                        <Link
                          className="btn"
                          id="btn-use-now"
                          to={`/detailProduct/${fill.vouchers[0].voucher.productDetail.product.slug}`}
                        >
                          Dùng ngay
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Box>
    </>
  );
};

export default WarehouseVoucherUser;
