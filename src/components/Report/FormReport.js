import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import axios from "../../Localhost/Custumize-axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const FormReport = ({ idStore, idOrder, idProduct }) => {
  const { slug } = useParams();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoStore, setInfoStore] = useState(null);
  const [infoOrder, setInfoOrder] = useState([]);
  const [infoProduct, setInfoProduct] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]); // Danh sách các file (hình & video)
  const [content, setContent] = useState("");
  const [selectContent, setSelectContent] = useState("");
  const open = Boolean(anchorEl);

  //Danh sách mẫu report
  const ListReport = [
    { label: "Sản phẩm lừa đảo" },
    { label: "Hàng giả, hàng nhái" },
    { label: "Sản phẩm không rõ nguồn gốc xuất xứ" },
    { label: "Hình ảnh sản phẩm không đúng với thực tế" },
    { label: "Hình ảnh sản phẩm có nội dung phản cảm" },
    { label: "Tên sản phẩm và hình không giống nhau" },
    { label: "Sản phẩm và hình ảnh ngoài sàn" },
    { label: "Sản phẩm và hình ảnh cấm buôn bán (động vật, vũ khí, 18+,...)" },
    { label: "Khác" },
  ];

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

  const loadInfoProduct = async (slug) => {
    try {
      const res = await axios.get(`product/${slug}`);
      if (Object.keys(res.data).length === 0) {
        setInfoProduct(null); // hoặc xử lý hiển thị khác nếu cần
        return;
      }
      setInfoProduct(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log("Đã xảy ra lỗi khi tải thông tin sản phẩm:", error);
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
    if (slug) {
      loadInfoProduct(slug);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMediaFiles([]);
    setContent(null);
    setSelectContent("");
  };

  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files);
    const newMedia = [...mediaFiles]; // Bản sao danh sách hiện tại

    for (const file of files) {
      if (newMedia.length >= 5) {
        toast.warning("Chỉ được tải tối đa 5 tệp!");
        return;
      }

      if (file.type.startsWith("image/")) {
        // Thêm hình ảnh
        newMedia.push({ url: URL.createObjectURL(file), file, type: "image" });
      } else if (file.type.startsWith("video/")) {
        // Kiểm tra thời lượng video
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          if (video.duration > 600) {
            toast.warning("Video không được dài quá 10 phút!");
          } else {
            newMedia.push({
              url: URL.createObjectURL(file),
              file,
              type: "video",
            });
            setMediaFiles([...newMedia]);
          }
        };
        video.src = URL.createObjectURL(file);
      } else {
        toast.warning("Chỉ chấp nhận file hình ảnh hoặc video!");
      }
    }

    setMediaFiles(newMedia);
  };

  const removeMedia = (index) => {
    const newMedia = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(newMedia);
  };

  const handleContent = (e) => {
    const { name, value } = e.target;
    if (name === "selectContent") setSelectContent(value);

    if (name === "content") setContent(value); // Cập nhật state content dựa trên giá trị mới
  };

  const validateForm = () => {
    if (selectContent === "") {
      toast.warning("Vui lòng chọn nội dung báo cáo.");
      return false;
    } else if (mediaFiles.length === 0) {
      toast.warning("Vui chọn video hoặc hình ảnh minh chứng.");
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

        // Thêm từng file (hình ảnh hoặc video) vào FormData
        mediaFiles.forEach((media, index) => {
          formData.append(`files`, media.file);
        });

        // Thêm thông tin báo cáo vào FormData
        formData.append(
          "report",
          JSON.stringify({
            user: { id: user.id },
            store: { id: idStore || null },
            order: { id: idOrder || null },
            product: { id: infoOrder[0].productDetail.product.id || null },
            content: selectContent === "Khác" ? content : selectContent,
            status: "Chờ xử lý",
          })
        );
        console.log(formData);
        // Gửi dữ liệu qua axios
        const res = await axios.post(`/report/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Xử lý phản hồi thành công
        toast.update(idToast, {
          render: "Gửi báo cáo thành công",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });

        handleCloseDialog(); // Đóng form
      } catch (error) {
        console.error(error);
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
            <hr className="m-0 p-0" />
            <strong className="">Hóa đơn sản phẩm</strong>
            <hr className="m-0 p-0 mb-3" />
            {infoOrder.length !== 0
              ? infoOrder.map((fill) => (
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
                ))
              : "Không có"}
            {/*  */}
            <hr className="m-0 p-0 mt-3" />
            <strong className="">Sản phẩm vi phạm</strong>
            <hr className="m-0 p-0 mb-3" />
            {infoOrder.map((fillProduct) => (
              <Card sx={{ display: "flex" }}>
                <CardMedia
                  component="img"
                  sx={{ width: "20%", aspectRatio: "1/1" }}
                  image={fillProduct.productDetail.product.images[0].imagename}
                  className="rounded-3 object-fit-cover "
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="strong" variant="h5">
                      <label className="text-truncate" style={{ width: "30%" }}>
                        {fillProduct.productDetail.product.name}
                      </label>
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{ color: "text.secondary" }}
                      className=""
                    >
                      <label htmlFor="" className="me-3">
                        Thương hiệu:{" "}
                        {fillProduct.productDetail.product.trademark.name}
                      </label>
                      <label htmlFor="">
                        Loại sản phẩm:{" "}
                        {fillProduct.productDetail.product.productcategory.name}
                      </label>
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                  ></Box>
                </Box>
              </Card>
            ))}
            <hr className="m-0 p-0 mb-3" />
            {/*  */}
            <hr className="m-0 p-0 mt-3" />
            <strong className="">Nội dung vi phạm</strong>
            <hr className="m-0 p-0 mb-3" />
            {selectContent !== "Khác" && (
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Nội dung báo cáo
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="selectContent"
                  value={selectContent}
                  onChange={handleContent}
                  label="Nội dung báo cáo"
                >
                  {ListReport.map((fill, index) => (
                    <MenuItem key={index} value={fill.label}>
                      {fill.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectContent === "Khác" && (
              <TextField
                className="mt-3"
                id="outlined-multiline-static"
                label="Nội dung"
                multiline
                rows={4}
                name="content"
                onChange={handleContent}
                placeholder="Vui lòng nêu rõ chi tiết."
                fullWidth
              />
            )}
            <Alert
              severity="info"
              sx={{ width: "100%", height: " 10%" }}
              className="mt-3"
            >
              <AlertTitle className="text-danger">Lưu ý</AlertTitle>
              Video không quá 10p. Tối đa gửi tệp không quá 5 tệp bao gồm cả
              video hoặc hình ảnh
            </Alert>

            <div>
              {/* Nút thêm tệp */}
              {mediaFiles.length < 5 && (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disableElevation
                  className="mt-3"
                >
                  Thêm tệp
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    hidden
                    onChange={handleMediaChange}
                  />
                </Button>
              )}

              {/* Danh sách các tệp */}
              <div className="row mt-3">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="col-lg-6 col-md-6 col-sm-6">
                    {media.type === "image" ? (
                      <Card sx={{ width: "100%" }} className="mb-3">
                        <CardContent>
                          <img
                            src={media.url}
                            alt={`media-${index}`}
                            className="rounded-3 object-fit-cover"
                            style={{ width: "100%", height: "200px" }}
                          />
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => removeMedia(index)}
                            disableElevation
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </CardActions>
                      </Card>
                    ) : (
                      <Card sx={{ width: "100%" }} className="mb-3">
                        <CardContent>
                          <video
                            controls
                            className="rounded-3"
                            style={{ width: "100%", height: "200px" }}
                          >
                            <source src={media.url} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                          </video>
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => removeMedia(index)}
                            disableElevation
                          >
                            <DeleteOutlineOutlinedIcon />
                          </Button>
                        </CardActions>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmitReport} variant="outlined">
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormReport;
