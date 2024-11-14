import {
  Badge,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import TimerIcon from "@mui/icons-material/Timer";
import axios from "../../../../../Localhost/Custumize-axios";

const VoucherTable = ({
  data,
  handleDelete,
  isSortName,
  isSortDisCountPrice,
  valueSort,
}) => {
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const geturlImgDetailProduct = (detailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${detailId}/${filename}`;
  };
  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };

  // Icon hoạt động
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  // Icon ngừng hoạt động
  const StyledBadgeStop = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#878787",
      color: "#878787",
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      },
    },
  }));

  const handleSort = (value) => {
    // Gọi hàm sắp xếp với giá trị
    if ((value === "newVouchers") | (value === "oldVouchers")) valueSort(value);

    if ((value === "disCountPriceDESC") | (value === "disCountPriceASC"))
      valueSort(value);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "backgroundElement.children" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <TableSortLabel
                active={true}
                direction={isSortName ? "desc" : "asc"}
                onClick={() =>
                  isSortName
                    ? handleSort("newVouchers")
                    : handleSort("oldVouchers")
                }
              >
                Tên Voucher
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={true}
                direction={isSortDisCountPrice ? "desc" : "asc"}
                onClick={() =>
                  isSortDisCountPrice
                    ? handleSort("disCountPriceDESC")
                    : handleSort("disCountPriceASC")
                }
              >
                Giá Giảm (%)
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Giá gốc</TableCell>
            <TableCell align="center">Tên Sản phẩm</TableCell>
            <TableCell align="center">Loại sản phẩm</TableCell>
            <TableCell align="center">Ngày Bắt Đầu</TableCell>
            <TableCell align="center">Ngày Kết Thúc</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Hành Động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((fill) => {
              return fill.vouchers.map((voucher, index) => {
                const priceDown =
                  voucher.productDetail.price * (voucher.discountprice / 100);
                const result = voucher.productDetail.price - priceDown;

                return (
                  <TableRow key={voucher.id}>
                    {/* Cột Voucher Name - Hiển thị tên voucher chỉ 1 lần cho nhóm */}
                    {index === 0 && (
                      <TableCell
                        rowSpan={fill.vouchers.length}
                        align="center"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 70,
                        }}
                      >
                        {fill.nameVoucher}
                      </TableCell>
                    )}

                    <TableCell align="center">
                      {formatPrice(result)} ({voucher.discountprice}%)
                    </TableCell>
                    <TableCell align="center">
                      {formatPrice(voucher.productDetail.price)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 100,
                      }}
                    >
                      <img
                        src={geturlIMG(
                          voucher.productDetail?.product.id,
                          voucher.productDetail?.product.images[0].imagename
                        )}
                        style={{ width: "40px", aspectRatio: "1/1" }}
                        alt=""
                      />
                      &nbsp; {voucher.productDetail?.product.name}
                    </TableCell>
                    <TableCell align="left">
                      {voucher.productDetail?.namedetail ? (
                        <>
                          <img
                            style={{ width: "40px", aspectRatio: "1/1" }}
                            src={geturlImgDetailProduct(
                              voucher.productDetail?.id,
                              voucher.productDetail?.imagedetail
                            )}
                            alt=""
                          />
                          &nbsp; {voucher.productDetail?.namedetail}
                        </>
                      ) : (
                        <Typography variant="strong" className="fw-bold">
                          Không phân loại
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(voucher.startday).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      {dayjs(voucher.endday).format("DD/MM/YYYY")}
                    </TableCell>

                    {voucher.status === "Hoạt động" ? (
                      <TableCell align="center">
                        <StyledBadge variant="dot" />
                        &nbsp;&nbsp; {voucher.status}
                      </TableCell>
                    ) : voucher.status === "Chờ hoạt động" ? (
                      <TableCell align="center">
                        <TimerIcon /> {voucher.status}
                      </TableCell>
                    ) : (
                      <TableCell align="center">
                        <StyledBadgeStop variant="dot" />
                        &nbsp;&nbsp; {voucher.status}
                      </TableCell>
                    )}

                    {/* Nút hành động - chỉ hiển thị cho dòng đầu tiên của nhóm voucher */}
                    <TableCell align="center">
                      {index === 0 && (
                        <div>
                          <Button
                            variant="contained"
                            color="warning"
                            sx={{
                              color: "rgb(100, 107, 0)",
                              backgroundColor: "rgb(255, 255, 157)",
                              "&:hover": {
                                backgroundColor: "rgb(255, 255, 157)",
                                color: "rgb(100, 107, 0)",
                                transform: "scale(1.08)",
                              },
                              transition: "0.5s",
                            }}
                            component={Link}
                            to={`/profileMarket/editVoucher/${voucher.slug}`}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Button>

                          <Button
                            variant="contained"
                            color="error"
                            sx={{
                              backgroundColor: "rgb(255, 184, 184)",
                              color: "rgb(198, 0, 0)",
                              "&:hover": {
                                backgroundColor: "rgb(255, 184, 184)",
                                color: "rgb(198, 0, 0)",
                                transform: "scale(1.08)",
                              },
                              transition: "0.5s",
                              ml: 2,
                            }}
                            onClick={() => handleDelete(voucher.slug)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              });
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VoucherTable;
