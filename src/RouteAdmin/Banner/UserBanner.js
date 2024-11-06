import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tab,
  Tabs,
  Box,
  TextField,
  Grid,
  Alert,
  Pagination,
  MenuItem,
  Select,
} from "@mui/material";
import Header from "../../components/Header/Header";

const BannerTable = () => {
  const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    bannername: "",
    startdate: "",
    enddate: "",
    position: "TOP",
    userFullname: "",
    userId: "",
    img: "",
  });
  const [editingBanner, setEditingBanner] = useState(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Set default to current month and year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  ); // Months are 0-based
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const geturlIMG = (userId, filename) => {
    return `http://localhost:8080/files/banner/${userId}/${filename}`;
  };

  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        id: user.id,
        userFullname: user.fullname,
      }));
    }
    fetchBanners();
    resetForm();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get("http://localhost:8080/banners");
      setBanners(response.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const [successMessage, setSuccessMessage] = useState("");

  // Cập nhật thông báo thành công
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra tên banner
    if (!validateBannerName(formData.bannername)) {
      setError(
        "Tên banner chỉ được chứa chữ cái, số và không có ký tự đặc biệt."
      );
      return;
    }

    // Kiểm tra ngày bắt đầu
    if (!validateStartDate(formData.startdate)) {
      setError("Ngày bắt đầu phải là hôm nay hoặc sau hôm nay.");
      return;
    }

    // Kiểm tra ngày kết thúc
    if (!validateEndDate(formData.startdate, formData.enddate)) {
      setError(
        "Ngày kết thúc phải cách ngày bắt đầu ít nhất 15 ngày và tối đa là 6 tháng."
      );
      return;
    }

    // Kiểm tra nếu đây là tạo mới và không có hình ảnh
    if (!editingBanner && !selectedFile) {
      setError("Vui lòng chọn hình ảnh cho banner.");
      return;
    }

    const form = new FormData();
    const bannerData = {
      bannername: formData.bannername,
      startdate: formData.startdate,
      enddate: formData.enddate,
      position: formData.position,
      user: { id: user.id },
    };

    form.append("banner", JSON.stringify(bannerData));

    if (selectedFile) {
      form.append("image", selectedFile);
    }

    try {
      if (editingBanner) {
        await axios.put(`http://localhost:8080/banners/${formData.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Cập nhật banner thành công!");
      } else {
        await axios.post("http://localhost:8080/banners", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Thêm banner thành công!");
      }

      fetchBanners();
      resetForm();
      setError("");
      // Ẩn thông báo thành công sau 5 giây
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving banner:", error);
      setError("Lỗi khi lưu banner. Vui lòng thử lại.");
      setSuccessMessage("");
    }
  };

  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setFormData({
      id: banner.id,
      bannername: banner.bannername,
      startdate: format(new Date(banner.startdate), "yyyy-MM-dd"),
      enddate: format(new Date(banner.enddate), "yyyy-MM-dd"),
      position: banner.position,
      userFullname: banner.user ? banner.user.fullname : "",
      userId: banner.user ? banner.user.id : "",
      img: banner.img,
    });

    setTabValue(1);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      try {
        await axios.delete(`http://localhost:8080/banners/${id}`);
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
        setError("Failed to delete banner. Please try again.");
      }
    }
  };

  const resetForm = () => {
    const userId = sessionStorage.getItem("id");
    const userFullname = sessionStorage.getItem("fullname");

    // Set ngày bắt đầu là hôm nay và ngày kết thúc là 15 ngày sau
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 15);

    setFormData({
      id: "",
      bannername: "",
      startdate: format(today, "yyyy-MM-dd"),
      enddate: format(endDate, "yyyy-MM-dd"),
      position: "TOP",
      userFullname: userFullname || "",
      userId: userId || "",
      img: "",
    });
    setSelectedFile(null);
    setEditingBanner(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  };

  const filteredBanners = banners.filter((banner) => {
    const startDate = new Date(banner.startdate);
    const isMonthMatch =
      selectedMonth === "all" ||
      startDate.getMonth() + 1 === parseInt(selectedMonth);
    const isYearMatch =
      selectedYear === "all" ||
      startDate.getFullYear() === parseInt(selectedYear);

    return (
      banner.bannername.toLowerCase().includes(searchTerm.toLowerCase()) &&
      isMonthMatch &&
      isYearMatch
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBanners.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1);
  };

  // Kiểm tra tên banner chỉ chứa chữ cái và số, không chứa ký tự đặc biệt
  const validateBannerName = (bannername) => {
    const regex = /^[a-zA-Z0-9 ]+$/; // Chỉ cho phép chữ cái và số, không cho phép ký tự đặc biệt
    return regex.test(bannername);
  };

  // Kiểm tra ngày bắt đầu phải là hôm nay hoặc sau hôm nay
  const validateStartDate = (startDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây về 0 (chỉ so sánh ngày)

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây về 0 cho ngày bắt đầu

    return start >= today; // So sánh ngày không xét đến giờ
  };

  // Kiểm tra ngày kết thúc phải cách ngày bắt đầu ít nhất 15 ngày và tối đa 6 tháng
  const validateEndDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Kiểm tra nếu ngày kết thúc cách ngày bắt đầu ít nhất 15 ngày
    const minEndDate = new Date(start);
    minEndDate.setDate(minEndDate.getDate() + 15);

    // Kiểm tra nếu ngày kết thúc cách ngày bắt đầu tối đa là 6 tháng
    const maxEndDate = new Date(start);
    maxEndDate.setMonth(maxEndDate.getMonth() + 6);

    return end >= minEndDate && end <= maxEndDate;
  };

  return (
    <div className="UserBanner">
      <Header></Header>
      <div className="container mt-5">
        <h2 className="mb-4">Quản Lý Banner</h2>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Hiển thị thông báo thành công */}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="banner tabs"
        >
          <Tab label="Danh Sách Banner" />
          <Tab label="Thêm/Sửa Banner" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={2}
              >
                <TextField
                  label="Tìm Theo Tên Banner"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginRight: "16px" }}
                />

                <Box display="flex" alignItems="center">
                  <TextField
                    select
                    label="Chọn Tháng"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ marginRight: "16px" }}
                  >
                    <MenuItem value="all">- Tháng -</MenuItem>
                    {Array.from({ length: 12 }, (_, index) => (
                      <MenuItem key={index} value={index + 1}>
                        Tháng {index + 1}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Chọn Năm"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <MenuItem value="all">- Năm -</MenuItem>
                    {Array.from({ length: 10 }, (_, index) => {
                      const year = new Date().getFullYear() - index;
                      return (
                        <MenuItem key={year} value={year}>
                          Năm {year}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="banner table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">Tên Banner</TableCell>
                      <TableCell align="center">IMG</TableCell>
                      <TableCell align="center">Ngày Bắt Đầu</TableCell>
                      <TableCell align="center">Ngày Kết Thúc</TableCell>
                      <TableCell align="center">Vị Trí</TableCell>
                      <TableCell align="center">Người Tạo</TableCell>
                      <TableCell align="center">Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell align="center">{banner.id}</TableCell>
                        <TableCell align="center">{banner.bannername}</TableCell>
                        <TableCell align="center">
                          <img
                            src={geturlIMG(banner.user.id, banner.img)}
                            alt={banner.bannername}
                            width="100"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {format(parseISO(banner.startdate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell align="center">
                          {format(parseISO(banner.enddate), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell align="center">{banner.position}</TableCell>
                        <TableCell align="center">
                          {banner.user ? banner.user.fullname : "N/A"}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "rgba(255, 255, 204, 1)",
                              color: "rgb(45, 45, 0)",
                            }}
                            onClick={() => handleEditClick(banner)}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "rgb(255, 184, 184)",
                              color: "rgb(198, 0, 0)",
                              marginLeft: "8px",
                            }}
                            onClick={() => handleDeleteClick(banner.id)}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginTop={2}
              >
                <strong>Số Dòng:</strong>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  label="Bộ lọc"
                  sx={{
                    border: "none",
                    "& .MuiSelect-select": {
                      border: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>

                <Pagination
                  count={Math.ceil(filteredBanners.length / itemsPerPage)}
                  page={currentPage}
                  onChange={paginate}
                  variant="outlined"
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </div>
          )}

          {tabValue === 1 && (
            <div>
              <h2>{editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner"}</h2>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={6}
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  <label htmlFor="image" style={{ cursor: "pointer" }}>
                    <img
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : editingBanner
                          ? geturlIMG(formData.userId, formData.img)
                          : "placeholder-image-url.png"
                      }
                      alt="Chọn Ảnh Cho Banner Ở Đây!"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "250px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    />
                  </label>

                  <input
                    type="file"
                    id="fileInput"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Tên Banner"
                      name="bannername"
                      value={formData.bannername}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                    />

                    <TextField
                      type="date"
                      label="Ngày Bắt Đầu"
                      name="startdate"
                      value={formData.startdate}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <TextField
                      type="date"
                      label="Ngày Kết Thúc"
                      name="enddate"
                      value={formData.enddate}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />

                    <TextField
                      select
                      label="Vị Trí"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      fullWidth
                      required
                      margin="normal"
                    >
                      <MenuItem value="TOP">TOP</MenuItem>
                      <MenuItem value="MID">MID</MenuItem>
                      <MenuItem value="BOT">BOT</MenuItem>
                    </TextField>
                    <TextField
                      label="Người Tạo"
                      name="userFullname"
                      value={user.fullname}
                      readOnly
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Người Tạo ID"
                      name="userId"
                      value={formData.userId}
                      readOnly
                      fullWidth
                      margin="normal"
                      style={{ display: "none" }}
                    />

                    <Box display="flex" justifyContent="center" marginTop={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        style={{
                          backgroundColor: "rgb(218, 255, 180)",
                          color: "rgb(45, 91, 0)",
                          marginRight: "8px",
                        }}
                      >
                        {editingBanner ? "Cập nhật" : "Thêm"}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={resetForm}
                        style={{ color: "rgb(100, 107, 0)" }}
                      >
                        Hủy
                      </Button>
                    </Box>
                  </form>
                </Grid>
              </Grid>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default BannerTable;
