import {
  Badge,
  Button,
  Collapse,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  MenuItem,
  Select,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "../../../Localhost/Custumize-axios";
import { confirmAlert } from "react-confirm-alert";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const TableProduct = ({ data, isRefeshListProduct }) => {
  const [checkedStates, setCheckedStates] = useState({});
  const [productStates, setProductStates] = useState({});
  const [dates, setDates] = useState({});
  const [reason, setReason] = useState("");
  //Tạo 1 đối tượng nhận mảng block của idProduct
  const [listNameProductChange, setListNameProductChange] = useState({});

  const loadList = async (idProduct) => {
    try {
      const res = await axios.get(`/list/block/product/${idProduct}`);
      setListNameProductChange((pre) => ({
        ...pre,
        [idProduct]: res.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (data) {
      data.forEach((fill) => {
        loadList(fill.product.id);
      });
    }
  }, [data]);

  const handleSwitchChange = (id) => {
    setCheckedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectChange = (id, value) => {
    setProductStates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (id, name, value) => {
    setDates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value,
      },
    }));
  };

  const handleChangeReason = (e) => {
    const value = e.target.value;
    setReason(value);
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

  const validateForm = (id) => {
    // Kiểm tra trạng thái chặn
    if (Object.values(checkedStates).every((value) => !value)) {
      toast.warning("Chưa bật trạng thái chặn");
      return false;
    }

    // Kiểm tra trạng thái "Hoạt động"
    if (productStates[id] === "Không hiệu lực" || productStates[id] === null) {
      toast.warning("Vui lòng chọn mức ban");
      return false;
    }

    if (!dates[id]?.startday && productStates[id] !== "Vĩnh viễn") {
      toast.warning("Vui lòng chọn ngày bắt đầu");
      return false;
    } else {
      const today = new Date();
      const start = new Date(dates[id]?.startday);

      // So sánh toàn bộ ngày
      if (
        start.getFullYear() < today.getFullYear() ||
        (start.getFullYear() === today.getFullYear() &&
          start.getMonth() < today.getMonth()) ||
        (start.getFullYear() === today.getFullYear() &&
          start.getMonth() === today.getMonth() &&
          start.getDate() < today.getDate())
      ) {
        toast.warning("Ngày bắt đầu không được nhỏ hơn ngày hiện tại.");
        return false;
      } else if (
        start.getFullYear() > today.getFullYear() ||
        (start.getFullYear() === today.getFullYear() &&
          start.getMonth() > today.getMonth()) ||
        (start.getFullYear() === today.getFullYear() &&
          start.getMonth() === today.getMonth() &&
          start.getDate() > today.getDate())
      ) {
        toast.warning("Ngày bắt đầu không được lớn hơn ngày hiện tại.");
        return false;
      }
    }

    if (!dates[id]?.endday && productStates[id] !== "Vĩnh viễn") {
      toast.warning("Vui lòng ngày kết thúc");
      return false;
    } else {
      const start = new Date(dates[id]?.startday);
      const end = new Date(dates[id]?.endday);
      if (
        end.getFullYear() < start.getFullYear() ||
        (end.getFullYear() === start.getFullYear() &&
          end.getMonth() < start.getMonth()) ||
        (end.getFullYear() === start.getFullYear() &&
          end.getMonth() === start.getMonth() &&
          end.getDate() <= start.getDate())
      ) {
        toast.warning(
          "Ngày kết thúc không được nhỏ hơn hoặc bằng ngày bắt đầu."
        );
        return false;
      }
    }

    // Kiểm tra lý do
    if (reason === "") {
      toast.warning("Vui lòng nhập lý do ban");
      return false;
    }

    return true;
  };

  const handleBanProduct = (id) => {
    if (validateForm(id)) {
      confirmAlert({
        title: "Xác nhận các thông tin",
        message:
          "Hãy đảm bảo các thông tin là đúng sự thật, sau khi xác nhận sẽ không thể thay đổi.",
        buttons: [
          {
            label: "Có",
            onClick: async () => {
              const productBanToSend = {
                block: checkedStates[id],
                status: productStates[id],
                startday: dates[id]?.startday
                  ? dayjs(dates[id]?.startday).format("YYYY-MM-DD")
                  : null,
                endday: dates[id]?.endday
                  ? dayjs(dates[id]?.endday).format("YYYY-MM-DD")
                  : null,
                reason: reason,
              };
              // console.log(productBanToSend);
              const idToast = toast.loading("Vui lòng chờ...");
              try {
                // Xử lý cập nhật
                await axios.put(`/ban/product/${id}`, productBanToSend);
                toast.update(idToast, {
                  render: "Xác nhận báo cáo thành công",
                  type: "success",
                  isLoading: false,
                  autoClose: 5000,
                  closeButton: true,
                });
                isRefeshListProduct(true);
                setReason("");
                setTimeout(() => {
                  isRefeshListProduct(false);
                }, 550);
              } catch (error) {
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại!");
              }
            },
          },
          {
            label: "Không",
          },
        ],
        overlayClassName: "custom-overlay",
      });
    }
  };

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <TableContainer className="mb-3">
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
              data.map((row) => {
                //Lấy mảng dựa theo idProduct
                const listChangeNameProduct =
                  listNameProductChange[row.product.id] || [];
                return (
                  <TableRow key={row.product.id}>
                    <TableCell align="center" component="th" scope="row">
                      <img
                        src={row.product.images[0].imagename}
                        alt=""
                        className="rounded-3 object-fit-cover"
                        style={{ width: "50%", aspectRatio: "1/1" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {listChangeNameProduct.length === 0 ? (
                        <Tooltip title={row.product.name}>
                          <Typography className="text-truncate">
                            {row.product.name}
                          </Typography>
                        </Tooltip>
                      ) : (
                        listChangeNameProduct.length >= 1 && (
                          <>
                            <ListItemButton
                              onClick={handleClick}
                              sx={{
                                "&:hover": { backgroundColor: "transparent" },
                              }}
                            >
                              <ListItemIcon sx={{ color: "text.default" }}>
                                <Typography className="text-truncate w-25">
                                  {
                                    listNameProductChange[row.product.id][0]
                                      .nameproduct
                                  }
                                </Typography>
                              </ListItemIcon>
                              {typeof listNameProductChange[row.product.id]?.[0]
                                ?.nameproduct === "string" &&
                                !listNameProductChange[
                                  row.product.id
                                ][0].nameproduct.includes(row.product.name) && (
                                  <>{open ? <ExpandLess /> : <ExpandMore />}</>
                                )}
                            </ListItemButton>
                            {typeof listNameProductChange[row.product.id]?.[0]
                              ?.nameproduct === "string" &&
                              !listNameProductChange[
                                row.product.id
                              ][0].nameproduct.includes(row.product.name) && (
                                <Collapse
                                  in={open}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <List component="div" disablePadding>
                                    <div className="text-start">
                                      <strong>Tên được thay đổi:</strong>
                                    </div>
                                    <ListItemButton>
                                      <div className="d-flex justify-content-start">
                                        <Typography variant="span" className="">
                                          {row.product.name}
                                        </Typography>
                                      </div>
                                    </ListItemButton>
                                  </List>
                                </Collapse>
                              )}
                          </>
                        )
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.countOrderSuccess}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={
                          checkedStates[row.product.id] || row.product.block
                        }
                        onChange={() => handleSwitchChange(row.product.id)}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <div className="d-flex justify-content-between">
                        {row.product.status === "Không hiệu lực" ? (
                          <div className="align-content-center">
                            <StyledBadge variant="dot" />
                          </div>
                        ) : (
                          <div className="align-content-center">
                            <StyledBadgeStop variant="dot" />
                          </div>
                        )}
                        <FormControl size="small" sx={{ width: "80%" }}>
                          <Select
                            value={
                              productStates[row.product.id] ||
                              row.product.status
                            }
                            onChange={(e) =>
                              handleSelectChange(row.product.id, e.target.value)
                            }
                          >
                            <MenuItem value="Có hiệu lực">Có hiệu lực</MenuItem>
                            <MenuItem value="Không hiệu lực">
                              Không hiệu lực
                            </MenuItem>
                            <MenuItem value="Vĩnh viễn">Vĩnh viễn</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="DD/MM/YYYY"
                          value={
                            dates[row.product.id]?.startday ||
                            row.product.startday
                              ? dayjs(row.product.startday)
                              : null
                          }
                          onChange={(newValue) =>
                            handleDateChange(
                              row.product.id,
                              "startday",
                              newValue
                            )
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              width: "100%",
                              height: "40px",
                            },
                          }}
                          disabled={
                            productStates[row.product.id] === "Vĩnh viễn" ||
                            row.product.status === "Vĩnh viễn"
                          }
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell align="center">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="DD/MM/YYYY"
                          value={
                            dates[row.product.id]?.endday || row.product.endday
                              ? dayjs(row.product.endday)
                              : null
                          }
                          onChange={(newValue) =>
                            handleDateChange(row.product.id, "endday", newValue)
                          }
                          sx={{
                            "& .MuiInputBase-root": {
                              width: "100%",
                              height: "40px",
                            },
                          }}
                          disabled={
                            productStates[row.product.id] === "Vĩnh viễn" ||
                            row.product.status === "Vĩnh viễn"
                          }
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => handleBanProduct(row.product.id)}
                        disabled={row.product.block}
                      >
                        <ModeEditOutlineOutlinedIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TextField
        id="outlined-multiline-static"
        label="Lý do ban"
        name="reason"
        value={reason}
        multiline
        rows={4}
        fullWidth
        onChange={handleChangeReason}
      />
    </>
  );
};

export default TableProduct;
