import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import axios from "../../../Localhost/Custumize-axios";
import React, { useCallback, useEffect, useState } from "react";
import FormManageUpdate from "../FormManage/FormManageUpdate";

const TableUserAdmins = ({
  data,
  valueSort,
  handleSubmitDelete,
  isSortName,
  isRefeshData,
}) => {
  const token = localStorage.getItem("hadfjkdshf"); // Lấy token từ localStorage
  const [role, setRole] = useState(null); // Ban đầu là null để biết trạng thái đang tải

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        if (!token) {
          return;
        }

        const res = await axios.get(`/userProFile/myInfo`);
        setRole(res.data.rolePermission.permission.name);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setRole(null); // Nếu lỗi, đặt role về null
      }
    };

    loadUserInfo();
  }, [token]);

  const handleSort = (value) => {
    // Gọi hàm sắp xếp với giá trị
    if ((value === "DESCName") | (value === "ASCName")) valueSort(value);
    // console.log(value);
  };

  const handleTakeIsRefeshTable = useCallback(
    (value) => {
      isRefeshData(value);
    },
    [isRefeshData]
  );

  
  return (
    <>
      {/* Bảng admin  */}
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
                Tên quản trị
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Số điện thoại</TableCell>
            <TableCell align="center">Vai trò</TableCell>
            {role === "All_Function" && (
              <TableCell align="center">Thao tác</TableCell>
            )}
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
                <TableCell align="center">{fill.email}</TableCell>
                <TableCell align="center">
                  {fill.phone || "Tài khoản google"}
                </TableCell>
                <TableCell align="center">
                  {fill.rolePermission.role.namerole +
                    " " +
                    fill.rolePermission.permission.name}
                </TableCell>
                {role === "All_Function" && (
                  <TableCell align="center">
                    <div className="d-flex justify-content-center">
                      <FormManageUpdate
                        idUser={fill.id}
                        isRefeshTable={handleTakeIsRefeshTable}
                      />
                      <button
                        className="btn mx-2"
                        id="btn-delete"
                          onClick={(e) => handleSubmitDelete(fill.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default TableUserAdmins;
