import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import axios from "../../../Localhost/Custumize-axios";
import dayjs from "dayjs";
import TableProduct from "./TableProduct";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import useDebounce from "../../../CustumHook/useDebounce";
import { tailChase } from "ldrs";
import { ThemeModeContext } from "../../../components/ThemeMode/ThemeModeProvider";
import { toast } from "react-toastify";

tailChase.register();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShowDetailInfoUser = ({ idUser }) => {
  const [open, setOpen] = useState(false);
  const [infoDetail, setInfoDetail] = useState(null);
  const [infoStore, setInfoStore] = useState(null);
  const [productStore, setProductStore] = useState([]);
  const [checked, setChecked] = useState(true);
  const [select, setSelect] = useState("");
  const [reason, setReason] = useState("");
  const [startday, setStartday] = useState(null);
  const [endday, setEndday] = useState(null);
  //slugStore
  const [slugStore, setSlugStore] = useState("");

  //Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  //State tìm kiếm
  const [search, setSearch] = useState("");
  const useDebounceSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(true);

  const { mode } = useContext(ThemeModeContext);

  const handleChange = (e, newValue) => {
    // Kiểm tra nếu e là một sự kiện (từ các input khác)
    if (e?.target) {
      const { name, value, checked } = e.target;

      if (name === "select") {
        setSelect(value);
      } else if (name === "checked") {
        setChecked(checked);
      } else if (name === "reason") {
        setReason(value);
      }
    } else {
      // Xử lý cho các phần tử không phải là input chuẩn (DatePicker)
      if (newValue) {
        if (e?.name === "startday") {
          setStartday(newValue); // Set giá trị dayjs vào state startday
        } else if (e?.name === "endday") {
          setEndday(newValue); // Set giá trị dayjs vào state endday
        }
      }
    }
  };

  const loadDetailInfo = async (id) => {
    try {
      const res = await axios.get(`/userProFile/${id}`);
      setInfoDetail(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadInfoStore = async (id) => {
    try {
      const res = await axios.get(`searchStore/${id}`);
      if (!res.data || Object.keys(res.data).length === 0) {
        // Nếu dữ liệu rỗng hoặc không có
        setInfoStore("empty");
      } else {
        // Nếu có dữ liệu
        setInfoStore(res.data);
        setSlugStore(res.data.slug);
        setSelect(res.data.status);
        setChecked(res.data.block);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadProductInStore = async (slug, pageNo, pageSize, keyWord) => {
    setLoading(true);
    setProductStore([]);
    try {
      const res = await axios.get(
        `/productStore/${slug}?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keyWord=${keyWord || ""}`
      );
      setProductStore(res.data);
      setCurrentPage(res.data.currentPage - 1);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadDetailInfo(idUser);
    loadInfoStore(idUser);
  };
  const handleClose = () => {
    setOpen(false);
    setInfoDetail(null);
    setInfoStore(null);
    setSelect("");
    setChecked(false);
    setReason("");
  };

  const handleChangePage = async (event, newPage) => {
    // console.log(newPage);
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTotalPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  useEffect(() => {
    if (slugStore) {
      loadProductInStore(
        slugStore,
        useDebounceSearch ? 0 : currentPage,
        totalPage,
        useDebounceSearch
      );
    }
  }, [slugStore, currentPage, totalPage, useDebounceSearch]);

  const validateForm = () => {
    if (!checked) {
      toast.warning("Chưa bật trạng thái chặn");
      return false;
    }
    if (select === "Hoạt động") {
      toast.warning("Vui lòng chọn mức ban");
      return false;
    }

    if (!startday) {
      toast.warning("Vui lòng chọn ngày bắt đầu");
      return false;
    } else {
      const today = new Date();
      const start = new Date(startday);
      if (
        start.getDate !== today.getDate ||
        start.getMonth !== today.getMonth ||
        start.getFullYear !== today.getFullYear
      ) {
        toast.warning("Ngày bắt đầu không được nhỏ hơn ngày hiện tại.");
        return false;
      }
    }

    if (!endday) {
      toast.warning("Vui lòng ngày kết thúc");
      return false;
    } else {
      const start = new Date(startday);
      const end = new Date(endday);
      if (
        end.getDate <= start.getDate ||
        end.getMonth <= start.getMonth ||
        end.getFullYear <= start.getFullYear
      ) {
        toast.warning("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
        return false;
      }
    }
    return true;
  };

  const handleBanStore = async () => {
    if (validateForm()) {
      const storeBanToSend = {
        block: checked,
        status: select,
        startday:
          select === "Vĩnh viễn" ? null : dayjs(startday).format("DD/MM/YYYY"),
        endday:
          select === "Vĩnh viễn" ? null : dayjs(endday).format("DD/MM/YYYY"),
        reason: reason,
      };
      console.log(storeBanToSend);
      // try {
      //   const res = axios.put(`/store/ban/${infoStore.id}`)
      // } catch (error) {
      //   console.log(error);
      // }
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        <PermContactCalendarOutlinedIcon />
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Xem thông tin chi tiết
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <div className="row">
            <div className="col-lg-2 col-md-2 col-sm-2 align-content-center border-end">
              <div className=" d-flex justify-content-center ">
                <img
                  src={infoDetail?.avatar}
                  alt=""
                  className="rounded-circle object-fit-cover"
                  style={{ width: "70%", aspectRatio: "1/1" }}
                />
              </div>
            </div>
            <div className="col-lg-10 col-md-10 col-sm-10">
              <h5 className="mt-2 mb-3 border-bottom">Thông tin tài khoản</h5>
              <div className="mb-3">
                <strong>Họ tên:</strong> <span>{infoDetail?.fullname}</span>
              </div>
              <div className="mb-3">
                <strong>Email:</strong> <span>{infoDetail?.email}</span>
              </div>
              <div className="mb-3">
                <strong>Giới tính:</strong>{" "}
                <span>{infoDetail?.gender ? "Nam" : "Nữ"}</span>
              </div>
              <div className="mb-3">
                <strong>Ngày sinh:</strong> <span>{infoDetail?.birthdate}</span>
              </div>
              <div className="mb-3">
                <strong>Số điện thoại:</strong> <span>{infoDetail?.phone}</span>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="mb-3 border-top">
            <h5 className="mt-2 mb-3">Thông tin cửa hàng</h5>
            {infoStore === "empty" ? (
              <label>Tài khoản chưa tạo kênh bán.</label>
            ) : (
              <>
                <div className="border-bottom mb-3">
                  <div className="row">
                    <div className="col-lg-5 col-md-5 col-sm-5">
                      <div className="mb-3">
                        <strong>Tên cửa hàng:</strong>{" "}
                        <span>{infoStore?.namestore}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Địa chỉ cửa hàng:</strong>{" "}
                        <span>{infoStore?.address}</span>
                      </div>
                      <div className="mb-3">
                        <strong>Số thuế cửa hàng:</strong>{" "}
                        <span>
                          {infoStore?.taxcode
                            ? infoStore?.taxcode
                            : "Không có mã thuế"}
                        </span>
                      </div>
                      <div className="mb-3">
                        <strong>Ngày tạo cửa hàng:</strong>{" "}
                        <span>
                          {infoStore?.createdtime
                            ? dayjs(infoStore.createdtime).format(
                                "DD/MM/YYYY HH:mm"
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-7">
                      <TableContainer>
                        <Table
                          sx={{ minWidth: 650, height: "100px" }}
                          size="small"
                          aria-label="a dense table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Trạng thái chặn cửa hàng</TableCell>
                              <TableCell align="center">
                                Hiện trạng hiện tại
                              </TableCell>
                              <TableCell align="center">
                                Ngày bắt đầu chặn
                              </TableCell>
                              <TableCell align="center">
                                Ngày kết thúc chặn
                              </TableCell>
                              <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                <Switch
                                  checked={checked}
                                  onChange={handleChange}
                                  name="checked"
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <FormControl fullWidth size="small">
                                  <InputLabel id="demo-simple-select-label">
                                    Trạng thái
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={select}
                                    label="Trạng thái"
                                    onChange={handleChange}
                                    name="select"
                                  >
                                    <MenuItem value="1 ngày">1 ngày</MenuItem>
                                    <MenuItem value="3 ngày">3 ngày</MenuItem>
                                    <MenuItem value="Vĩnh viễn">
                                      Vĩnh viễn
                                    </MenuItem>
                                    <MenuItem value="Hoạt động">
                                      Hoạt động
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="center">
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    name="startday"
                                    value={startday ? dayjs(startday) : null} // Kiểm tra nếu có giá trị
                                    onChange={(newValue) =>
                                      handleChange(
                                        { name: "startday" },
                                        newValue
                                      )
                                    } // Truyền newValue
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
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DatePicker
                                    format="DD/MM/YYYY"
                                    name="endday"
                                    value={endday ? dayjs(endday) : null} // Kiểm tra nếu có giá trị
                                    onChange={(newValue) =>
                                      handleChange({ name: "endday" }, newValue)
                                    } // Truyền newValue
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
                                <Button onClick={handleBanStore}>
                                  <ModeEditOutlineOutlinedIcon />
                                </Button>
                              </TableCell>
                            </TableRow>
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
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-3">
                      <h5 className="mt-2 mb-3">Danh sách sản phẩm</h5>
                    </div>
                    {/* Tìm kiếm */}
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <TextField
                        id="outlined-search"
                        label="Nhập từ khóa bạn cần tìm kiếm (Tên, Loại, Hãng)."
                        type="search"
                        size="small"
                        fullWidth
                        name="searchProduct"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                      />
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3 d-flex justify-content-end">
                      <h5 className="mt-2 mb-3">
                        Số lượng sản phẩm: {totalItems}
                      </h5>
                    </div>
                  </div>
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <l-tail-chase
                        size="40"
                        speed="1.75"
                        color={mode === "light" ? "black" : "white"}
                      ></l-tail-chase>
                    </div>
                  ) : productStore.products.length === 0 &&
                    useDebounceSearch === "" ? (
                    <h2 className="text-center">Shop chưa có sản phẩm.</h2>
                  ) : productStore.products.length === 0 &&
                    useDebounceSearch !== "" ? (
                    <h2 className="text-center">
                      Thông tin sản phẩm không tồn tại.
                    </h2>
                  ) : (
                    <TableProduct
                      data={productStore.products}
                      dataProdcut={productStore}
                    />
                  )}

                  <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={totalItems}
                    rowsPerPage={totalPage}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Giới hạn hiển thị"
                    sx={{
                      ".MuiTablePagination-displayedRows": {
                        transform: "translateY(7px)", // Điều chỉnh giá trị này để di chuyển xuống theo ý muốn
                      },
                      ".MuiTablePagination-selectLabel": {
                        transform: "translateY(7px)", // Điều chỉnh giá trị này để di chuyển xuống theo ý muốn
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowDetailInfoUser;
