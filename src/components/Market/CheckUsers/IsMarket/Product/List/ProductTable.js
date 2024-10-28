import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../../../../Localhost/Custumize-axios";

const ProductTable = ({ data, handleSortOption, handleSubmitDelete }) => {
  const [isSortName, setIsSortName] = useState(false);
  const [isSortPrice, setIsSortPrice] = useState(false);
  const [isSortQuantity, setIsSortQuantity] = useState(false);
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  const handleSort = (value) => {
    let data;
    if (value === "newItems") {
      data = value;
      setIsSortName(!isSortName); // Cập nhật trạng thái isSortOption
    } else if (value === "oldItems") {
      data = value;
      setIsSortName(!isSortName); // Cập nhật trạng thái isSortOption
    }

    if (value === "priceDESC") {
      data = value;
      setIsSortPrice(!isSortPrice); // Cập nhật trạng thái isSortOption
    } else if (value === "priceASC") {
      data = value;
      setIsSortPrice(!isSortPrice); // Cập nhật trạng thái isSortOption
    }

    if (value === "quantityDESC") {
      data = value;
      setIsSortQuantity(!isSortQuantity);
    } else if (value === "quantityASC") {
      data = value;
      setIsSortQuantity(!isSortQuantity);
    }

    // Gọi hàm sắp xếp với giá trị
    handleSortOption(data);
  };

  return (
    <>
      <Table
        id="table"
        sx={{ minWidth: 650, backgroundColor: "backgroundElement.children" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Hình</TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={true} // Luôn giữ trạng thái active
                direction={isSortName ? "desc" : "asc"} // Sắp xếp theo trạng thái của isSortOption
                onClick={() => handleSort(isSortName ? "newItems" : "oldItems")} // Đổi giữa "asc" và "desc"
              >
                Sản phẩm
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Loại</TableCell>
            <TableCell align="center">Hãng</TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={true} // Luôn giữ trạng thái active
                direction={isSortPrice ? "desc" : "asc"} // Sắp xếp theo trạng thái của isSortOption
                onClick={() =>
                  handleSort(isSortPrice ? "priceDESC" : "priceASC")
                } // Đổi giữa "asc" và "desc"
              >
                Giá
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={true} // Luôn giữ trạng thái active
                direction={isSortQuantity ? "desc" : "asc"} // Sắp xếp theo trạng thái của isSortOption
                onClick={() =>
                  handleSort(isSortQuantity ? "quantityDESC" : "quantityASC")
                } // Đổi giữa "asc" và "desc"
              >
                Số lượng
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((fill) => {
            const firstIMG = fill.images[0];
            const productDetails = fill.productDetails; //Nhận mảng productDetails

            //Tìm giá nhỏ nhất lớn nhất trong mảng
            const minPrice = Math.min(
              ...productDetails.map((filter) => filter.price)
            );
            const maxPrice = Math.max(
              ...productDetails.map((filter) => filter.price)
            );

            //Tính tổng số lượng của phân loại sản phẩm
            const totalQuantity = productDetails.reduce(
              (total, detailQuantity) => total + detailQuantity.quantity,
              0
            );
            return (
              <TableRow
                key={fill.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="d-flex justify-content-center"
                >
                  {firstIMG ? (
                    <img
                      src={geturlIMG(fill.id, firstIMG.imagename)}
                      alt=""
                      className="img-fluid"
                      id="img-product-item"
                    />
                  ) : (
                    <img
                      src="/images/no_img.png"
                      alt=""
                      className="img-fluid"
                      id="img-product-item"
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <div id="text-truncate">{fill.name}</div>
                </TableCell>
                <TableCell align="center">
                  {fill.productcategory.name}
                </TableCell>
                <TableCell align="center">{fill.trademark.name}</TableCell>
                <TableCell align="center">
                  {minPrice === maxPrice
                    ? formatPrice(minPrice) + " đ"
                    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}` +
                      " đ"}
                </TableCell>
                <TableCell align="center">{totalQuantity}</TableCell>
                <TableCell align="center">
                  <div className="d-flex justify-content-center">
                    <Link
                      className="btn"
                      id="btn-edit"
                      to={`/profileMarket/updateProduct/${fill.slug}`}
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
                      to={`/profileMarket/checkItemProduct/${fill.slug}`}
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductTable;
