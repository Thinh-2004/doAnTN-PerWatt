import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React from "react";
import ShowDetailInfoUser from "./ShowDetailInfoUser";

const TableUsers = ({ data, valueSort, isSortName }) => {
  const handleSort = (value) => {
    // Gọi hàm sắp xếp với giá trị
    if ((value === "DESCName") | (value === "ASCName")) valueSort(value);
    // console.log(value);
  };
  return (
    <>
      {/* Bảng user  */}
      <Table
        id="table"
        sx={{ minWidth: 650, backgroundColor: "backgroundElement.children" }}
        aria-label="simple table"
        className="rounded-3"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Hình</TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={true} // Luôn giữ trạng thái active
                direction={isSortName ? "desc" : "asc"} // Sắp xếp theo trạng thái của isSortOption
                onClick={() =>
                  isSortName ? handleSort("DESCName") : handleSort("ASCName")
                } // Đổi giữa "asc" và "desc"
              >
                Tên người dùng
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Số điện thoại</TableCell>
            <TableCell align="center">Giới tính</TableCell>
            <TableCell align="center">Ngày sinh</TableCell>
            <TableCell align="center">Vai trò</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((fill) => {
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
                  <img
                    src={fill.avatar}
                    alt=""
                    className="img-fluid rounded-circle"
                    id="img-product-item"
                    loading="lazy"
                  />
                </TableCell>
                <TableCell align="center">
                  <div id="text-truncate">{fill.fullname}</div>
                </TableCell>
                <TableCell align="center" className="text-truncate">
                  {fill.email}
                </TableCell>
                <TableCell align="center">
                  {fill.phone || "Tài khoản google"}
                </TableCell>
                <TableCell align="center">
                  {fill.gender === null
                    ? "Tài khoản google"
                    : fill.gender
                    ? "Nam"
                    : "Nữ"}
                </TableCell>

                <TableCell align="center">
                  {fill.birthdate || "Tài khoản google"}
                </TableCell>

                <TableCell align="center">
                  {fill.rolePermission.role.namerole === "Seller"
                    ? "Người bán hàng"
                    : "Người dùng"}
                </TableCell>
                <TableCell align="center">
                  <ShowDetailInfoUser idUser={fill.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default TableUsers;
