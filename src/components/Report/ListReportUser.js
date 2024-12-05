import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "../../Localhost/Custumize-axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

const CardReportUserByWait = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [listHistoryWait, setListHistoryWait] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const loadData = async (pageNo, pageSize) => {
    setListHistoryWait([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/report/list/wait/${user.id}?pageNo=${pageNo || 0}&pageSize=${
          pageSize || ""
        }`
      );
      setListHistoryWait(res.data.reports);
      setTotalItems(res.data.totalItems);
      // console.log(res.data.reports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0, pageSize);
  }, [pageSize]);

  const handleLoadMore = () => {
    if (listHistoryWait.length >= totalItems) {
      setPageSize(5);
    } else {
      setPageSize(pageSize + 5);
    }
  };

  return (
    <>
      <h5 className="border p-2 rounded-3">Chờ xử lý</h5>
      {listHistoryWait.length === 0 ? (
        <strong>Không có lịch sử.</strong>
      ) : (
        listHistoryWait.map((fill) => (
          <Card
            sx={{ minWidth: 275, boxShadow: "none" }}
            className="mb-3 rounded-3"
          >
            <CardContent>
              <Typography variant="h5" component="div">
                Báo cáo đến {fill.store.namestore}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Nội dung báo báo: {fill.content}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Ngày báo báo: {dayjs(fill.createdat).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <Typography variant="body2">Trạng thái: {fill.status}</Typography>
            </CardContent>
            <CardActions>
              <Tooltip title="Xem chi tiết báo cáo">
                <ModelDialog idReport={fill.id} idOrder={fill.order?.id} />
              </Tooltip>
            </CardActions>
          </Card>
        ))
      )}
      {listHistoryWait.length !== 0 ? (
        listHistoryWait.length < totalItems ? (
          <div className=" d-flex justify-content-center">
            <Button
              className="mb-3 mx-2 me-2"
              variant="outlined"
              disableElevation
              sx={{ width: "10%" }}
              onClick={handleLoadMore}
            >
              {loading ? "Đang tải..." : "Xem thêm"}
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <Button
              className="mb-3 mx-2 me-2"
              variant="outlined"
              disableElevation
              sx={{ width: "10%" }}
              onClick={handleLoadMore}
            >
              {loading ? "Đang tải..." : "Ẩn bớt"}
            </Button>
          </div>
        )
      ) : null}
    </>
  );
};

const CardReportUserByProcessed = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [listHistoryProcess, setListHistoryProcess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const loadData = async (pageNo, pageSize) => {
    setListHistoryProcess([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/report/list/process/${user.id}?pageNo=${pageNo || 0}&pageSize=${
          pageSize || ""
        }`
      );
      setListHistoryProcess(res.data.reports);
      setTotalItems(res.data.totalItems);
      // console.log(res.data.reports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0, pageSize);
  }, [pageSize]);

  const handleLoadMore = () => {
    if (listHistoryProcess.length >= totalItems) {
      setPageSize(5);
    } else {
      setPageSize(pageSize + 1);
    }
  };

  return (
    <>
      <h5 className="border p-2 rounded-3">Đã xử lý</h5>
      {listHistoryProcess.length === 0 ? (
        <strong>Không có lịch sử.</strong>
      ) : (
        listHistoryProcess.map((fill) => (
          <Card
            sx={{ minWidth: 275, boxShadow: "none" }}
            className="mb-3 rounded-3"
          >
            <CardContent>
              <Typography variant="h5" component="div">
                Báo cáo đến {fill.store.namestore}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Nội dung báo báo: {fill.content}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Ngày báo báo: {dayjs(fill.createdat).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <Typography variant="body2">
                Trạng thái:{" "}
                <label className="text-success">{fill.status}</label>
              </Typography>
              {fill.replyreport && (
                <Typography variant="body2">
                  Phản hồi từ người kiểm duyệt:{" "}
                  <label className="text-danger">{fill.replyreport}</label>
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Tooltip title="Xem chi tiết báo cáo">
                <ModelDialog idReport={fill.id} idOrder={fill.order?.id} />
              </Tooltip>
            </CardActions>
          </Card>
        ))
      )}
      {/* {listHistoryProcess.length !== 0 ? (
        listHistoryProcess.length < totalItems ? (
          <div className=" d-flex justify-content-center">
            <Button
              className="mb-3 mx-2 me-2"
              variant="outlined"
              disableElevation
              sx={{ width: "10%" }}
              onClick={handleLoadMore}
            >
              {loading ? "Đang tải..." : "Xem thêm"}
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <Button
              className="mb-3 mx-2 me-2"
              variant="outlined"
              disableElevation
              sx={{ width: "10%" }}
              onClick={handleLoadMore}
            >
              {loading ? "Đang tải..." : "Ẩn bớt"}
            </Button>
          </div>
        )
      ) : null} */}
    </>
  );
};

const CardReportUserByRefuse = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [listHistoryRefuse, setListHistoryRefuse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const loadData = async (pageNo, pageSize) => {
    setListHistoryRefuse([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/report/list/refuse/${user.id}?pageNo=${pageNo || 0}&pageSize=${
          pageSize || ""
        }`
      );
      setListHistoryRefuse(res.data.reports);
      setTotalItems(res.data.totalItems);
      // console.log(res.data.reports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0, pageSize);
  }, [pageSize]);

  const handleLoadMore = () => {
    if (listHistoryRefuse.length >= totalItems) {
      setPageSize(5);
    } else {
      setPageSize(pageSize + 1);
    }
  };

  return (
    <>
      <h5 className="border p-2 rounded-3">Từ chối xử lý</h5>
      {listHistoryRefuse.length === 0 ? (
        <strong>Không có lịch sử.</strong>
      ) : (
        listHistoryRefuse.map((fill) => (
          <Card
            sx={{ minWidth: 275, boxShadow: "none" }}
            className="mb-3 rounded-3"
          >
            <CardContent>
              <Typography variant="h5" component="div">
                Báo cáo đến {fill.store.namestore}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Nội dung báo báo: {fill.content}
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Ngày báo báo: {dayjs(fill.createdat).format("DD/MM/YYYY HH:mm")}
              </Typography>
              <Typography variant="body2">
                Trạng thái: <label className="text-danger">{fill.status}</label>
              </Typography>
              {fill.replyreport && (
                <Typography variant="body2">
                  Phản hồi từ người kiểm duyệt:{" "}
                  <label className="text-danger">{fill.replyreport}</label>
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Tooltip title="Xem chi tiết báo cáo">
                <ModelDialog idReport={fill.id} idOrder={fill.order?.id} />
              </Tooltip>
            </CardActions>
          </Card>
        ))
      )}
      {/* {listHistoryProcess.length !== 0 ? (
        listHistoryProcess.length < totalItems ? (
          <div className=" d-flex justify-content-center">
            <Button
              className="mb-3 mx-2 me-2"
              variant="outlined"
              disableElevation
              sx={{ width: "10%" }}
              onClick={handleLoadMore}
            >
              {loading ? "Đang tải..." : "Xem thêm"}
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <Button
              className="mb-3 mx-2 me-2"
              variant="outlined"
              disableElevation
              sx={{ width: "10%" }}
              onClick={handleLoadMore}
            >
              {loading ? "Đang tải..." : "Ẩn bớt"}
            </Button>
          </div>
        )
      ) : null} */}
    </>
  );
};

const ListReportUser = () => {
  return (
    <>
      <Header />
      <h2 className="text-center mt-3">Lịch sử báo cáo</h2>
      <Container maxWidth="lg">
        {/* Chờ xử lý */}
        <CardReportUserByWait />
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            {/* Đang xử lý */}
            <CardReportUserByProcessed />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            {/* Từ chối xử lý */}
            <CardReportUserByRefuse />
          </div>
        </div>
      </Container>
    </>
  );
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ModelDialog = ({ idReport, idOrder }) => {
  const [open, setOpen] = useState(false);
  const [infoReport, setInfoReport] = useState(null);
  const [infoOrder, setInfoOrder] = useState([]);

  const loadData = async (id) => {
    const res = await axios.get(`/report/${id}`);
    setInfoReport(res.data);
    console.log(res.data);
  };

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
    if (idReport) {
      loadData(idReport);
    }
    if (idOrder) {
      loadInfoOrder(idOrder);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setInfoReport(null);
  };

  return (
    <>
      <Button onClick={handleClickOpen}>
        <InfoOutlinedIcon />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Chi tiết báo cáo ngày{" "}
          {dayjs(infoReport?.createdat).format("DD/MM/YYYY")}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            <strong>Người báo cáo:</strong> {infoReport?.user?.fullname}
          </Typography>
          <Typography gutterBottom>
            <stong>Đơn vị bị cáo báo:</stong> {infoReport?.store.namestore}
          </Typography>
          <Typography gutterBottom>
            <strong>Sản phẩm bị báo cáo:</strong>{" "}
            {infoOrder[0]?.productDetail.product.name || "Không có"}
          </Typography>
          <Typography gutterBottom>
            <strong>Nội dụng báo cáo:</strong> {infoReport?.content}
          </Typography>
          <Typography gutterBottom>
            <strong>Video xác thực:</strong>
            {infoReport?.media && (
              <div className="mt-3">
                <video width="100%" controls className="rounded-3">
                  <source src={infoReport?.media} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
              </div>
            )}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default ListReportUser;
