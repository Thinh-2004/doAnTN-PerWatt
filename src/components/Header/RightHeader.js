import React, { useCallback, useContext, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Menu,
  MenuItem,
  styled,
  Switch,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import axios from "../../Localhost/Custumize-axios";
import { useEffect } from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeModeContext } from "../ThemeMode/ThemeModeProvider";
import MotionPhotosAutoIcon from "@mui/icons-material/MotionPhotosAuto";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import RoofingIcon from "@mui/icons-material/Roofing";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";

const RightHeader = ({ reloadCartItems }) => {
  const changeLink = useNavigate();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const idStore = localStorage.getItem("idStore");
  const token = localStorage.getItem("hadfjkdshf");

  const [count, setCount] = useState(0);
  const [countOrderBuyer, setCountOrderBuyer] = useState(0);
  const [countOrderSeller, setCountOrderSeller] = useState(0);
  const matchSeller = useMatch("/profileMarket/*"); //Kiểm tra đường dẫn có chứa tham số động
  const matchAdmin = useMatch("/admin/*"); //Kiểm tra đường dẫn có chứa tham số động

  const { mode, checkAutoMode, toggleMode, handleAutoScreenMode } =
    useContext(ThemeModeContext);

  const handleChangeMode = (e) => {
    const newMode = e.target.checked;
    localStorage.setItem("screenMode", newMode ? "dark" : "light");
    // console.log(newMode);
    toggleMode(newMode);
  };

  const handleChangeAutoMode = (e) => {
    const newAutoMode = e.target.checked;
    localStorage.setItem("autoScreenMode", newAutoMode);
    handleAutoScreenMode(newAutoMode);
    // console.log(newAutoMode);
  };

  const handleLogOut = () => {
    confirmAlert({
      title: "Đăng xuất tài khoản",
      message: "Bạn chắc chắn muốn đăng xuất?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            const toastId = toast.loading("Vui lòng chờ...");

            try {
              // Gửi yêu cầu logout
              const token = localStorage.getItem("hadfjkdshf");
              await axios.post(
                `form/logout`,
                { token: token } // Gửi qua body
              );

              // Hiển thị thông báo thành công
              toast.update(toastId, {
                render: "Đăng xuất thành công",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
              // Xóa localStorage ngay khi người dùng nhấn "Đăng xuất"
              localStorage.clear();
              sessionStorage.clear();
              // Chuyển hướng về trang chủ
              changeLink("/");
            } catch (error) {
              console.error("Logout error:", error);

              // Hiển thị thông báo lỗi
              toast.update(toastId, {
                render: "Đăng xuất thất bại",
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
              // Hiển thị thông báo thành công

              // Chuyển hướng về trang chủ
            }
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenuUser = Boolean(anchorEl);
  const handleClickMenuUser = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenuUser = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const CallAPICheckUserId = async (id) => {
    try {
      const res = await axios.get(`store/checkIdUser/${id}`);
      return res.data.exists; // Lấy giá trị exists từ phản hồi
    } catch (error) {
      console.log("Error ", error);
      return false;
    }
  };

  const checkUserId = async (e) => {
    // Ngăn chặn hành động mặc định của liên kết
    e.preventDefault();

    // Kiểm tra nếu id là null hoặc undefined
    if (user === null || user === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Hãy đăng nhập để có trải nghiệm tuyệt vời hơn",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              // Hiển thị thông báo đang tải
              const id = toast.loading("Vui lòng chờ...");
              toast.update(id, {
                render: "Chuyển hướng đến trang đăng nhập",
                type: "info",
                isLoading: false,
                autoClose: 2000,
                closeButton: true,
              });
              changeLink("/login");
            },
          },
          {
            label: "Không",
          },
        ],
      });
    } else {
      // Nếu id tồn tại, kiểm tra với API
      const check = await CallAPICheckUserId(user.id);
      if (check) {
        // Nếu id tồn tại trong cửa hàng
        changeLink("/profileMarket");
      } else {
        // Chưa tồn tại
        changeLink("/market");
      }
    }
  };

  const checkUserIdOnCart = async (e) => {
    // Ngăn chặn hành động mặc định của liên kết
    e.preventDefault();

    // Kiểm tra nếu id là null hoặc undefined
    if (user === null || user === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Bạn cần đăng nhập để vào giỏ hàng của mình",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              // Hiển thị thông báo đang tải
              const id = toast.loading("Vui lòng chờ...");
              toast.update(id, {
                render: "Chuyển hướng đến trang đăng nhập",
                type: "info",
                isLoading: false,
                autoClose: 2000,
                closeButton: true,
              });
              changeLink("/login");
            },
          },
          {
            label: "Không",
          },
        ],
      });
    } else {
      changeLink("/cart");
    }
  };

  const checkUserIdOnReport = async (e) => {
    // Ngăn chặn hành động mặc định của liên kết
    e.preventDefault();

    // Kiểm tra nếu id là null hoặc undefined
    if (user === null || user === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Bạn cần đăng nhập để vào danh sách báo cáo của mình",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              // Hiển thị thông báo đang tải
              const id = toast.loading("Vui lòng chờ...");
              toast.update(id, {
                render: "Chuyển hướng đến trang đăng nhập",
                type: "info",
                isLoading: false,
                autoClose: 2000,
                closeButton: true,
              });
              changeLink("/login");
            },
          },
          {
            label: "Không",
          },
        ],
      });
    } else {
      changeLink("/report");
    }
  };

  useEffect(() => {
    const count = async () => {
      try {
        if (user) {
          const res = await axios.get(`/countCartIdUser/${user.id}`);
          setCount(res.data.length);
          // console.log(res.data.length);
        } else {
          console.log("Chưa có sản phẩm");
          setCount(0);
        }
      } catch (error) {
        console.log(error);
      }
    };
    //Đếm thông báo buyer
    const fetchOrderNotificationsBuyer = async (userId) => {
      try {
        const response = await axios.get(`/checkOrderBuyer/${userId}`);
        const inTransitOrders =
          response.data &&
          response.data.filter(
            (order) => order.orderstatus === "Đang vận chuyển"
          );
        const canceledOrders =
          response.data &&
          response.data.filter((order) => order.orderstatus === "Hủy");

        const inTransitOrderCount = inTransitOrders.length;
        const canceledOrderCount = canceledOrders.length;

        setCountOrderBuyer(inTransitOrderCount + canceledOrderCount); // Total orders
      } catch (error) {
        console.log("Error fetching order notifications:", error);
      }
    };
    //Đếm thông báo seller
    const fetchOrderNotificationsSeller = async (idStore) => {
      try {
        // Gọi API lấy đơn hàng mới, đơn hàng đã giao và đơn hàng đã hủy song song
        const [newOrdersRes, deliveredOrdersRes, canceledOrdersRes] =
          await Promise.all([
            axios.get(`/checkOrderSeller/${idStore}`),
            axios.get(`/deliveredOrders/${idStore}`),
            axios.get(`/canceledOrders/${idStore}`), // Thêm API lấy đơn hàng đã hủy
          ]);

        // Tính tổng số đơn hàng
        const newOrderCount = newOrdersRes.data.length;
        const deliveredOrderCount = deliveredOrdersRes.data.length;
        const canceledOrderCount = canceledOrdersRes.data.length;

        // Cập nhật tổng số đơn hàng vào state
        setCountOrderSeller(
          newOrderCount + deliveredOrderCount + canceledOrderCount
        );
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };
    if (token) {
      if (idStore !== "undefined") fetchOrderNotificationsSeller(idStore);
      fetchOrderNotificationsBuyer(user?.id);
    }
    count();
  }, [user, idStore]);

  useEffect(() => {
    if (reloadCartItems) {
      const count = async () => {
        try {
          if (user) {
            const res = await axios.get(`/countCartIdUser/${user.id}`);
            setCount(res.data.length);
            // console.log(res.data.length);
          } else {
            console.log("Chưa có sản phẩm");
          }
        } catch (error) {
          console.log(error);
        }
      };
      count();
    }
  }, [reloadCartItems, user]);

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#aab4be",
          ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: "#003892",
      }),
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
      ...theme.applyStyles("dark", {
        backgroundColor: "#8796A5",
      }),
    },
  }));

  return (
    <>
      <div className="d-flex align-items-center border-end mx-3">
        {matchSeller ? (
          <>
            <Tooltip title="Trang chủ PerWatt">
              <Link
                type="button"
                className="btn btn-icon position-relative rounded-3 me-1"
                to={"/"}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <i className="bi bi-houses fs-4"></i>
                </Typography>
              </Link>
            </Tooltip>
            <Tooltip title="Giỏ hàng">
              <Link
                type="button"
                className="btn btn-icon position-relative rounded-3 me-1"
                to={"/cart"}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <i className="bi bi-cart4 fs-4"></i>
                </Typography>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count}
                </span>
              </Link>
            </Tooltip>
            <Tooltip title="Lịch sử báo cáo">
              <Link
                onClick={checkUserIdOnReport}
                type="button"
                className="btn btn-icon position-relative rounded-3 me-1"
                to={""}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <i className="bi bi-flag fs-4"></i>
                </Typography>
                {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {0}
                </span> */}
              </Link>
            </Tooltip>
            <Tooltip title="Thông báo">
              <Link
                type="button"
                className="btn btn-icon btn-sm  position-relative rounded-3 me-2"
                to={"/profileMarket/notifications"}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <i className="bi bi-bell fs-4"></i>
                </Typography>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {countOrderSeller}
                </span>
              </Link>
            </Tooltip>
          </>
        ) : matchAdmin ? (
          <>
            <Tooltip title="Hồ sơ của tôi">
              <Link
                type="button"
                className="btn btn-icon position-relative rounded-4 "
                to={"/admin/info"}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <AccountBoxIcon />
                </Typography>
              </Link>
            </Tooltip>
            <Tooltip title="Đăng xuất">
              <Link
                type="button"
                className="btn btn-icon btn-sm rounded-4"
                id="btn-logOut"
                onClick={handleLogOut}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <LogoutIcon />
                </Typography>
              </Link>
            </Tooltip>
            <Tooltip title="Chế độ màn hình">
              <Button
                className=""
                id="basic-button"
                aria-controls={openMenuUser ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenuUser ? "true" : undefined}
                onClick={handleClickMenuUser}
                size="small"
                sx={{
                  color: "text.primary",
                  textTransform: "capitalize",
                }}
              >
                <Typography variant="span" className="">
                  <SettingsApplicationsIcon />
                  <ArrowDropDownIcon fontSize="small" />
                </Typography>
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenuUser}
              onClose={handleCloseMenuUser}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    width: 200,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              disableScrollLock
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <FormControlLabel
                  control={
                    <MaterialUISwitch
                      // sx={{ m: 1 }}
                      defaultChecked={false}
                      onChange={handleChangeMode}
                      checked={mode === "dark"}
                    />
                  }
                  label={mode === "dark" ? "Nền tối" : "Nền sáng"}
                />
              </MenuItem>

              <Tooltip
                title="Website sẽ tự động điều chỉnh màn hình theo cài đặt hệ thống trên thiết bị của bạn."
                placement="left-start"
                className="d-flex align-items-center"
                TransitionComponent={Zoom}
              >
                <MenuItem>
                  <Checkbox
                    // {...label}
                    icon={<MotionPhotosAutoIcon />}
                    checkedIcon={<MotionPhotosAutoIcon />}
                    onChange={handleChangeAutoMode}
                    checked={checkAutoMode}
                  />
                  <Typography>Tự động</Typography>
                </MenuItem>
              </Tooltip>
            </Menu>
          </>
        ) : (
          <>
            {user?.id === 1 && (
              <Tooltip title="Trang admin">
                <Link
                  type="button"
                  className="btn btn-icon position-relative rounded-3 me-1"
                  to={"/admin"}
                >
                  <Typography sx={{ color: "text.primary" }}>
                    <RoofingIcon />
                  </Typography>
                </Link>
              </Tooltip>
            )}
            <Tooltip title="Giỏ hàng">
              <Link
                type="button"
                className="btn btn-icon position-relative rounded-3 me-1"
                onClick={checkUserIdOnCart}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <i className="bi bi-cart4 fs-4"></i>
                </Typography>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count}
                </span>
              </Link>
            </Tooltip>
            <Tooltip title="Cửa hàng">
              <Link
                onClick={checkUserId}
                type="button"
                className="btn btn-icon btn-sm rounded-3 me-1"
              >
                <Typography sx={{ color: "text.primary" }}>
                  {" "}
                  <i className="bi bi-shop fs-4"></i>
                </Typography>
              </Link>
            </Tooltip>
            <Tooltip title="Thông báo">
              <Link
                type="button"
                className="btn btn-icon btn-sm  position-relative rounded-3 me-1"
                to={"/buyerNotification"}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <i className="bi bi-bell fs-4"></i>
                </Typography>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {countOrderBuyer}
                </span>
              </Link>
            </Tooltip>
            <Tooltip title="Lịch sử báo cáo">
              <Link
                onClick={checkUserIdOnReport}
                type="button"
                className="btn btn-icon position-relative rounded-3 me-2"
                to={""}
              >
                <Typography sx={{ color: "text.primary" }}>
                  <i className="bi bi-flag fs-4"></i>
                </Typography>
                {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {0}
                </span> */}
              </Link>
            </Tooltip>
          </>
        )}
      </div>
      {user ? (
        matchAdmin ? (
          <div className="align-content-center">
            <img
              src={user.avatar}
              alt=""
              className="rounded-circle img-fluid"
              style={{ width: "30px", aspectRatio: "1/1", objectFit: "cover" }}
            />{" "}
            &nbsp;
            <span className="" style={{ fontSize: "12px" }}>
              {user.fullname}
            </span>
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center mt-2 rounded-2"
            style={{ border: "1px solid" }}
          >
            <Button
              id="basic-button"
              aria-controls={openMenuUser ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenuUser ? "true" : undefined}
              onClick={handleClickMenuUser}
              size="small"
              sx={{
                color: "text.primary",
                textTransform: "capitalize",
              }}
            >
              <img
                src={user.avatar}
                alt=""
                className="rounded-circle img-fluid"
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
              &nbsp;
              <Typography variant="span" style={{ fontSize: "15px" }}>
                {user.fullname}
                <ArrowDropDownIcon fontSize="small" />
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenuUser}
              onClose={handleCloseMenuUser}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    width: 200,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              disableScrollLock
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleCloseMenuUser}>
                <Link className="text-dark " to={"/user"}>
                  <img
                    src={user.avatar}
                    alt=""
                    className="rounded-circle img-fluid"
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                    }}
                  />
                  &nbsp;
                  <Typography variant="span" sx={{ color: "text.primary" }}>
                    Hồ sơ của tôi
                  </Typography>
                </Link>
              </MenuItem>

              <MenuItem onClick={handleCloseMenuUser}>
                <Link className="text-dark " to={"/order"}>
                  <ListAltIcon sx={{ color: "text.primary" }} />
                  &nbsp;
                  <Typography variant="span" sx={{ color: "text.primary" }}>
                    Đơn hàng
                  </Typography>
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem>
                <FormControlLabel
                  control={
                    <MaterialUISwitch
                      // sx={{ m: 1 }}
                      defaultChecked={false}
                      onChange={handleChangeMode}
                      checked={mode === "dark"}
                    />
                  }
                  label={mode === "dark" ? "Nền tối" : "Nền sáng"}
                />
              </MenuItem>

              <Tooltip
                title="Website sẽ tự động điều chỉnh màn hình theo cài đặt hệ thống trên thiết bị của bạn."
                className="d-flex align-items-center"
                TransitionComponent={Zoom}
                placement="left-start"
              >
                <MenuItem>
                  <Checkbox
                    // {...label}
                    icon={<MotionPhotosAutoIcon />}
                    checkedIcon={<MotionPhotosAutoIcon />}
                    onChange={handleChangeAutoMode}
                    checked={checkAutoMode}
                  />
                  <Typography>Tự động</Typography>
                </MenuItem>
              </Tooltip>

              <Divider />
              <MenuItem onClick={handleCloseMenuUser}>
                <Link
                  className="dropdown-item text-danger"
                  onClick={handleLogOut}
                >
                  <LogoutIcon /> &nbsp;Đăng xuất
                </Link>
              </MenuItem>
            </Menu>
          </div>
        )
      ) : (
        <div className="d-flex mt-2">
          <Link
            type="button"
            className={`btn btn-register btn-sm me-2 ${
              mode === "light" ? "" : "text-white"
            }`}
            to={"/login"}
            style={{ width: "90px", height: "30px" }}
          >
            Đăng ký
          </Link>
          <Link
            type="button"
            className={`btn btn-login btn-sm me-2 ${
              mode === "light" ? "" : "text-white"
            }`}
            to={"/login"}
            style={{ width: "95px", height: "30px" }}
          >
            Đăng nhập
          </Link>
        </div>
      )}
      {/* <FormControlLabel
        control={
          <MaterialUISwitch
            sx={{ m: 1 }}
            defaultChecked={false}
            onChange={handleChangeMode}
            checked={mode === "dark"}
          />
        }
        label={mode === "dark" ? "Tối" : "Sáng"}
      /> */}
    </>
  );
};

export default RightHeader;
