import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import dayjs from "dayjs";
import React, { useState } from "react";
import AssistantPhotoOutlinedIcon from "@mui/icons-material/AssistantPhotoOutlined";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import axios from "../../Localhost/Custumize-axios";

const TableReport = ({ data, isLoadTable }) => {
  return (
    <TableContainer>
      <Table
        sx={{ minWidth: 350, backgroundColor: "backgroundElement.children" }}
        aria-label="simple table"
        className="rounded-3"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">Người báo cáo</TableCell>
            <TableCell align="center">Ngày báo cáo</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((fill) => (
            <TableRow key={fill.id}>
              <TableCell align="center">{fill.user?.fullname}</TableCell>
              <TableCell align="center">
                {dayjs(fill.createdat).format("DD/MM/YYYY HH:mm")}
              </TableCell>
              <TableCell align="center">
                {fill.status === "Đã xử lý" ? (
                  <label className="text-success">{fill.status}</label>
                ) : fill.status === "Từ chối xử lý" ? (
                  <label className="text-danger">{fill.status}</label>
                ) : (
                  fill.status
                )}
              </TableCell>
              <TableCell align="center">
                <ModelDialogUpdateReport
                  detailInfo={fill}
                  isRefeshTable={isLoadTable}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ModelDialogUpdateReport = ({ detailInfo, isRefeshTable }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(detailInfo.status);
  const [replyReport, setReplyReport] = useState(detailInfo.replyreport);
  const [infoOrder, setInfoOrder] = useState([]);

  const loadInfoOrder = async (id) => {
    try {
      const res = await axios.get(`orderDetail/${id}`);
      console.log(res.data);
      setInfoOrder(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    loadInfoOrder(detailInfo?.order?.id);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(detailInfo.status);
    setReplyReport("");
    loadInfoOrder([]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "replyReport") {
      setReplyReport(value); // Cập nhật cho TextField
    } else if (name === "status") {
      setSelected(value); // Cập nhật cho Select
    }
  };

  const validateForm = () => {
    if (selected === "Chờ xử lý") {
      toast.warning("Không thể xác nhận khi trạng thái vẫn còn 'Chờ xử lý'");
      return false;
    }
    if (replyReport === "") {
      toast.warning("Không thể xác nhận khi chưa nhập phản hồi");
      return false;
    }
    return true;
  };

  const handleSubmitReport = async () => {
    if (validateForm()) {
      confirmAlert({
        title: "Xác nhận các thông tin",
        message:
          "Hãy đảm bảo các thông tin là đúng sự thật, sau khi xác nhận sẽ không thể thay đổi.",
        buttons: [
          {
            label: "Có",
            onClick: async () => {
              const formReport = {
                status: selected,
                createdat: detailInfo.createdat,
                replyreport: replyReport,
              };
              console.log(formReport);
              const idToast = toast.loading("Vui lòng chờ...");
              try {
                // Xử lý cập nhật
                await axios.put(`/report/update/${detailInfo.id}`, formReport);
                toast.update(idToast, {
                  render: "Xác nhận báo cáo thành công",
                  type: "success",
                  isLoading: false,
                  autoClose: 5000,
                  closeButton: true,
                });
                isRefeshTable(true);
                const timmer = setTimeout(() => {
                  isRefeshTable(false);
                }, 500);
                handleClose();
                return clearTimeout(timmer);
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

  //Hàm phâm tách link video hoặc link hình
  const checkMediaType = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"];
    const videoExtensions = [".mp4", ".avi", ".mov", ".webm"];

    // Lấy phần mở rộng của URL
    const cleanedUrl = url.split("?")[0]; // Loại bỏ phần query string
    const extension = cleanedUrl.slice(cleanedUrl.lastIndexOf(".")); // Lấy phần sau dấu '.'

    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (videoExtensions.includes(extension)) {
      return "video";
    } else {
      return "unknown";
    }
  };

  return (
    <>
      <Tooltip title="Xem chi tiết nội dung báo cáo">
        <Button variant="outlined" onClick={handleClickOpen} size="small">
          <AssistantPhotoOutlinedIcon />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Chi tiết báo cáo của {detailInfo.user?.fullname}
        </DialogTitle>
        <DialogContent>
          {/*  */}
          <h4 className="border-bottom">Thông tin chi tiết</h4>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            <strong>Tên cửa hàng bị báo cáo:</strong>{" "}
            {detailInfo.store?.namestore}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            <strong>Tên chủ cửa hàng:</strong>{" "}
            {detailInfo.store?.user?.fullname}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            <strong>Email chủ cửa hàng:</strong> {detailInfo.store?.user?.email}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            <strong>Số điện thoại chủ cửa hàng:</strong>{" "}
            {detailInfo.store?.user?.phone}
          </Typography>
          {/*  */}
          <h4 className="border-top">Nội dung báo cáo</h4>
          {infoOrder.length !== 0 && (
            <Card sx={{ display: "flex" }} className="mb-3">
              <img
                src={infoOrder[0]?.productDetail.product.images[0].imagename}
                alt=""
                className="object-fit-cover"
                style={{ width: "30%", aspectRatio: "1/1" }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  {infoOrder[0]?.productDetail.product.name}
                </CardContent>
              </Box>
            </Card>
          )}

          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            <strong>Nội dung:</strong> {detailInfo.content}
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            <strong>Video chứng thực:</strong>
            <div className="row mt-3">
              {detailInfo?.imagesReports.map((fill, index) => {
                const media = checkMediaType(fill.media);
                return (
                  <div key={index} className="col-lg-6 col-md-6 col-sm-6">
                    {media === "image" ? (
                      <Card sx={{ width: "100%" }} className="mb-3">
                        <CardContent>
                          <img
                            src={fill.media}
                            alt={`media-${index}`}
                            className="rounded-3 object-fit-cover"
                            style={{ width: "100%", height: "200px" }}
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      <Card sx={{ width: "100%" }} className="mb-3">
                        <CardContent>
                          <video
                            controls
                            className="rounded-3"
                            style={{ width: "100%", height: "200px" }}
                          >
                            <source src={fill.media} type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                          </video>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </Typography>
          {/*  */}
          <h4 className="border-top">Thao tác quản trị</h4>
          <FormControl fullWidth className="mt-3 mb-3" size="small">
            <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="status"
              value={selected}
              label="Trạng thái"
              onChange={handleChange}
            >
              <MenuItem value={"Chờ xử lý"}>Chờ xử lý</MenuItem>
              <MenuItem value={"Đã xử lý"}>Đã xử lý</MenuItem>
              <MenuItem value={"Từ chối xử lý"}>Từ chối xử lý</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-multiline-static"
            label="Trả lời người báo cáo"
            multiline
            rows={4}
            fullWidth
            name="replyReport"
            value={replyReport}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button
            onClick={handleSubmitReport}
            disabled={
              detailInfo.status === "Đã xử lý" ||
              detailInfo.status === "Từ chối xử lý"
            }
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableReport;
