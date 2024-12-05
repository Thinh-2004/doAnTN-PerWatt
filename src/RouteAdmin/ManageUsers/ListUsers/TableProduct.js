import {
  Badge,
  Button,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TableProduct = ({ data }) => {
  const [checkedStates, setCheckedStates] = useState({});

  // Xử lý thay đổi trạng thái của switch
  const handleChangeChecked = (id) => {
    setCheckedStates((prev) => ({
      ...prev,
      [id]: !prev[id], // Đảo trạng thái hiện tại
    }));
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

  return (
    <TableContainer>
      <Table
        id="table"
        sx={{ minWidth: 650, backgroundColor: "backgroundElement.children" }}
        aria-label="simple  table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Hình</TableCell>
            <TableCell align="center">Tên sản phẩm</TableCell>
            <TableCell align="center">Số lượng đã bán</TableCell>
            <TableCell align="center">Trạng thái chặn sản phẩm</TableCell>
            <TableCell align="center">Hiện trạng hiện tại</TableCell>
            <TableCell align="center">Ngày bắt đầu chặn</TableCell>
            <TableCell align="center">Ngày kết thúc chặn</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow key={row.product.id}>
                <TableCell align="center" component="th" scope="row">
                  <img
                    src={row.product.images[0].imagename}
                    alt=""
                    className="rounded-3 object-fit-cover"
                    style={{ width: "50%", aspectRatio: "1/1" }}
                  />
                </TableCell>
                <TableCell align="center">{row.product.name}</TableCell>
                <TableCell align="center">{row.countOrderSuccess}</TableCell>
                <TableCell align="center">
                  <Switch
                    checked={checkedStates[row.product.id] || false} // Trạng thái của switch
                    onChange={() => handleChangeChecked(row.product.id)} // Xử lý thay đổi
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </TableCell>
                <TableCell align="center">
                  <StyledBadge variant="dot" />
                  &nbsp; {row.product.status ? row.product.status : "Hoạt động"}
                </TableCell>
                <TableCell align="center">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      name="birthdate"
                      // value={
                      //   formUser.birthdate ? dayjs(formUser.birthdate) : null
                      // } // Chuyển đổi múi giờ về Việt Nam
                      // onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-root": {
                          width: "100%",
                          height: "40px",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell align="center">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      name="birthdate"
                      // value={
                      //   formUser.birthdate ? dayjs(formUser.birthdate) : null
                      // } // Chuyển đổi múi giờ về Việt Nam
                      // onChange={handleChange}
                      sx={{
                        "& .MuiInputBase-root": {
                          width: "100%",
                          height: "40px",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell align="center">
                  <Button>
                    <ModeEditOutlineOutlinedIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    
  );
};

export default TableProduct;
