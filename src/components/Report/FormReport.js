import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import axios from "../../Localhost/Custumize-axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

const FormReport = ({ idStore, idOrder }) => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoStore, setInfoStore] = useState(null);
  const [infoOrder, setInfoOrder] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(null); // Lưu trữ URL video tạm thời
  const [content, setContent] = useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const loadInfoStore = async (id) => {
    try {
      const res = await axios.get(`store/${id}`);
      setInfoStore(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadInfoOrder = async (id) => {
    try {
      const res = await axios.get(`orderDetail/${id}`);
      // console.log(res.data);
      setInfoOrder(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
    if (idStore) {
      loadInfoStore(idStore);
    }
    if (idOrder) {
      loadInfoOrder(idOrder);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setVideoUrl(null);
    setContent(null);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.warning("Vui lòng chọn một file video!");
        setVideoUrl(null);
        return;
      }

      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        if (video.duration > 600) {
          toast.warning("Video không được dài quá 10 phút!");
          setVideoUrl(null);
        } else {
          setVideoUrl({ url: URL.createObjectURL(file), file }); // Lưu cả URL và file gốc
          setShowVideo(URL.createObjectURL(file));
        }
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const handleText = (e) => {
    const value = e.target.value;
    setContent(value);
  };

  const handleDeleteVideo = () => {
    setVideoUrl(null);
    setShowVideo(null);
  };

  const validateForm = () => {
    if (content === "" && videoUrl === null) {
      toast.warning("Vui lòng điền đẩy đủ thông tin.");
      return false;
    } else if (content === "") {
      toast.warning("Vui lòng nhập nội dung báo cáo.");
      return false;
    } else if (videoUrl === null) {
      toast.warning("Vui chọn video minh chứng.");
      return false;
    }
    return true;
  };

  const handleSubmitReport = async () => {
    if (validateForm()) {
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        // Tạo FormData để gửi dữ liệu và file
        const formData = new FormData();
        formData.append("file", videoUrl.file); // Đính kèm video (file gốc)
        formData.append(
          "report",
          JSON.stringify({
            user: { id: user.id },
            store: { id: idStore || null },
            order: { id: idOrder || null },
            content: content,
            status: "Chờ xử lý",
          })
        );

        // Gửi dữ liệu qua axios
        const res = await axios.post(`/report/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Xử lý phản hồi thành công
        setTimeout(() => {
          toast.update(idToast, {
            render: "Gửi báo cáo thành công",
            type: "success",
            isLoading: false,
            autoClose: 5000,
            closeButton: true,
          });
        }, 500);

        handleCloseDialog(); // Đóng form
      } catch (error) {
        console.log(error);
        toast.update(idToast, {
          render: `Gửi báo cáo thất bại`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
      }
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              width: "20ch",
            },
          },
        }}
      >
        <MenuItem onClick={handleClickOpenDialog}>
          <OutlinedFlagIcon /> Báo cáo
        </MenuItem>
      </Menu>

      {/* Dialog form report */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <>
          <DialogTitle>
            Yêu cầu báo cáo đến cửa hàng: &nbsp;
            <i>'{infoStore?.namestore}'</i>
          </DialogTitle>
          <DialogContent>
            <hr className="m-0 p-0" />
            <strong className="">Thông tin</strong>
            <hr className="m-0 p-0" />

            <div className="row mt-3">
              <div className="col-lg-4 col-md-4 col-sm-4 d-flex justify-content-center align-content-center">
                <div className=" mb-3">
                  <img
                    src={infoStore?.user.avatar}
                    alt=""
                    className="rounded-circle object-fit-cover"
                    style={{ width: "100%", aspectRatio: "1/1" }}
                  />
                </div>
              </div>
              <div className="col-lg-8 col-md-8 col-sm-8">
                <div className=" mb-3">
                  <strong>
                    <u htmlFor="">Tên cửa hàng:</u>
                  </strong>
                  &nbsp;{infoStore?.namestore}
                </div>
                <div className="mb-3">
                  <strong>
                    <u htmlFor="">Địa chỉ cửa hàng:</u>
                  </strong>
                  &nbsp;{infoStore?.address}
                </div>
              </div>
            </div>
            {/*  */}
            <h4>Hóa đơn sản phẩm</h4>
            {infoOrder.length !== 0 ?
              infoOrder.map((fill) => (
                <Card sx={{ minWidth: 275 }} className="mb-2">
                  <CardContent>
                    <Typography
                      gutterBottom
                      sx={{ color: "text.secondary", fontSize: 14 }}
                    ></Typography>
                    <Typography
                      variant="h5"
                      className="text-truncate"
                      component="div"
                    >
                      {fill.productDetail.product.name}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                      Phân loại :{" "}
                      {fill.productDetail.namedetail || "Không phân loại"}
                    </Typography>
                    <Typography variant="body2">
                      Số lượng đã mua : {fill.quantity}
                      <br />
                      Phương thức thanh toán: {fill.order.paymentmethod.type}
                    </Typography>
                  </CardContent>
                </Card>
              )) : "Không có"}
            <TextField
            className="mt-3"
              id="outlined-multiline-static"
              label="Nội dung"
              multiline
              rows={4}
              onChange={handleText}
              placeholder="Vui lòng nêu rõ chi tiết."
              fullWidth
            />
            <Alert
              severity="info"
              sx={{ width: "100%", height: " 10%" }}
              className="mt-3"
            >
              <AlertTitle>Lưu ý</AlertTitle>
              Video không quá 10p.
            </Alert>

            {!videoUrl ? (
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                disableElevation
                className="mt-3"
              >
                Gửi video
                <VisuallyHiddenInput
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  multiple={false}
                />
              </Button>
            ) : (
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                disableElevation
                className="mt-3"
                onClick={handleDeleteVideo}
              >
                Xóa video
              </Button>
            )}
            {/* Hiển thị video nếu có URL */}
            {showVideo && (
              <div className="mt-3">
                <video width="100%" controls className="rounded-3">
                  <source src={showVideo} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
              </div>
            )}
          </DialogContent>
        </>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy bỏ</Button>
          <Button onClick={handleSubmitReport}>Gửi</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormReport;
