import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
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
  Typography,
} from "@mui/material";
import axios from "../../../../../Localhost/Custumize-axios";
import "./AddVoucher.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function AddVoucherForm() {
  //State request
  const [vouchername, setvouchername] = useState("");
  const [startday, setstartday] = useState(null);
  const [endday, setendday] = useState(null);
  const [discountprice, setdiscountprice] = useState(0);
  const [quantiy, setQuantity] = useState(0);
  //State logic
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };

  ///
  const dateNow = dayjs();
  const validate = () => {
    // Kiểm tra tên voucher
    if (!vouchername || vouchername.trim() === "") {
      toast.warning("Vui lòng nhập tên voucher");
      return false;
    }

    // Kiểm tra sản phẩm được chọn
    if (selectedProduct.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm");
      return false;
    }

    // Kiểm tra giá giảm
    const discount = parseFloat(discountprice);
    if (!discountprice || isNaN(discount) || discount <= 0 || discount > 100) {
      toast.warning("Vui lòng nhập giá giảm hợp lệ (1% => 100%)");
      return false;
    }

    if (quantiy <= 0) {
      toast.warning("Vui lòng nhập số lượng voucher hợp lệ");
      return false;
    }

    // Kiểm tra ngày bắt đầu
    if (!startday) {
      toast.warning("Vui lòng chọn ngày bắt đầu");
      return false;
    }

    // Kiểm tra nếu ngày bắt đầu trước ngày hiện tại
    if (startday.isBefore(dateNow, "day")) {
      toast.warning("Ngày bắt đầu phải từ hôm nay hoặc hơn");
      return false;
    }

    // Kiểm tra ngày kết thúc
    if (!endday) {
      toast.warning("Vui lòng chọn ngày kết thúc");
      return false;
    }

    // Kiểm tra nếu ngày kết thúc trước ngày bắt đầu
    if (endday.isBefore(startday, "day")) {
      toast.warning("Ngày kết thúc phải sau ngày bắt đầu");
      return false;
    }
    if (startday && startday.isBefore(dateNow, "day")) {
      toast.warning("Ngày bắt đầu phải từ hôm nay hoặc hơn");
      return false;
    }

    return true;
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const idStore = localStorage.getItem("idStore"); // Lấy storeId từ sessionStorage

      if (idStore) {
        try {
          // Gọi API để lấy sản phẩm theo storeId
          const response = await axios.get(`fillProduct/${idStore}`);
          setProducts(response.data); // Lưu dữ liệu sản phẩm vào state
          // console.log(response.data);
        } catch (error) {
          console.error("Error fetching products", error);
        }
      } else {
        console.error("No storeId found in sessionStorage");
      }
    };

    fetchProducts();
  }, []);

  // Hàm xử lý việc thêm voucher
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // Chuyển đổi giá giảm thành số thực và chọn sản phẩm
      const discount = parseFloat(discountprice);
      const voucher = {
        vouchername,
        startday: startday
          ? dayjs(startday).format("YYYY-MM-DDTHH:mm:ssZ")
          : null,
        endday: endday ? dayjs(endday).format("YYYY-MM-DDTHH:mm:ssZ") : null,
        discountprice: discount, // Giá giảm đã chuyển đổi thành số thực
        slug: "",
        quantityvoucher: parseInt(quantiy),
      };
      const products = selectedProduct.map((id) => ({ id }.id.product));

      console.log(voucher);
      console.log(products);
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        const response = await axios.post("addVouchers", {
          voucher,
          products,
        });
        // Reset form sau khi thêm thành công
        resetForm();

        toast.update(idToast, {
          render: "Thêm voucher thành công!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
          closeButton: true,
        });
        // Điều hướng sau khi cập nhật thành công
        navigate("/profileMarket/fillVoucher");
      } catch (error) {
        console.log(error);

        toast.update(idToast, {
          render: "Thêm voucher thất bại!",
          type: "error",
          isLoading: false,
          autoClose: 1500,
          closeButton: true,
        });

        if (error.response && error.response.status === 400) {
          // Display the error message to the user
          toast.update(idToast, {
            render: `${error.response.data}`,
            type: "error",
            isLoading: false,
            autoClose: 1500,
            closeButton: true,
          });
        }
      }
    }
  };

  // Hàm để làm mới form
  const resetForm = () => {
    setvouchername("");
    setstartday(null);
    setendday(null);
    setdiscountprice(0);
    setSelectedProduct([]);
    setQuantity(0);
  };

  const handleChangeSelectedProduct = (e, newValue) => {
    // `newValue` là mảng các sản phẩm đã được chọn sau mỗi thay đổi
    setSelectedProduct(newValue); // Cập nhật giá trị đã chọn
    console.log(newValue);
  };

  const handleOnChangePhanTramGiamGia = (e) => {
    const value = e.target.value;

    // Nếu giá trị là rỗng, đặt giảm giá và kết quả giá về 0
    if (value === "") {
      setdiscountprice(0);
      return;
    }

    const discountValue = parseFloat(value);

    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      setdiscountprice(discountValue);
    }
  };

  const handleQuantity = (e) => {
    const value = e.target.value;

    if (value === "") {
      setQuantity(0);
      return;
    }

    const discountValue = parseInt(value);
    setQuantity(discountValue);
  };

  return (
    <Box
      sx={{ backgroundColor: "backgroundElement.children" }}
      id="voucherFormContainer"
      className="container mt-5"
    >
      <h2 className="text-center">Thêm Voucher Mới</h2>
      <form id="voucherForm" onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <TextField
            label="Tên Voucher"
            variant="outlined"
            value={vouchername}
            onChange={(e) => setvouchername(e.target.value)}
            fullWidth
          />
        </div>

        <div className="form-group">
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={products}
            value={selectedProduct}
            onChange={handleChangeSelectedProduct}
            disableCloseOnSelect
            getOptionLabel={(option) => option.product.name}
            isOptionEqualToValue={(option, value) =>
              option.product.id === value.product.id
            }
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={option.product.id} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <img
                    style={{ width: "40px", aspectRatio: "1/1" }}
                    src={option.product.images[0].imagename}
                    alt=""
                  />
                  &nbsp;
                  <label className="text-truncate">{option.product.name}</label>
                </li>
              );
            }}
            fullWidth
            renderInput={(params) => (
              <TextField {...params} label="Chọn sản phẩm" />
            )}
          />
        </div>
        <div className="form-group">
          <TextField
            label="Phần trăm giảm (%)"
            variant="outlined"
            value={discountprice}
            onChange={handleOnChangePhanTramGiamGia}
            fullWidth
          />
        </div>

        <div className="form-group">
          <TextField
            label="Số lượng voucher"
            variant="outlined"
            value={quantiy}
            onChange={handleQuantity}
            fullWidth
          />
        </div>
        <TableContainer className="border mb-3">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" width={200}>
                  Hình
                </TableCell>
                <TableCell align="center" width={100}>
                  Giá gốc
                </TableCell>
                <TableCell align="center">Giá giảm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProduct.length === 0 ? (
                <h6 className="p-2">Vui lòng chọn sản phẩm</h6>
              ) : (
                selectedProduct &&
                selectedProduct.map((fill) => {
                  //Lấy giá từng mảng product
                  const priceProductDetail = fill.productDetails.map(
                    (data) => data.price
                  );
                  const discountPrices = priceProductDetail.map((price) => {
                    const discount = price * (discountprice / 100);
                    return price - discount;
                  });

                  const minPrice = Math.min(...priceProductDetail);
                  const maxPrice = Math.max(...priceProductDetail);
                  const minDiscountPrice = Math.min(...discountPrices);
                  const maxDiscountPrice = Math.max(...discountPrices);

                  let finalPrice;
                  if (minPrice === maxPrice) {
                    finalPrice = formatPrice(minDiscountPrice); // Hoặc có thể tính với maxDiscountPrice
                  } else {
                    finalPrice = `${formatPrice(
                      minDiscountPrice
                    )} - ${formatPrice(maxDiscountPrice)}`;
                  }

                  return (
                    <TableRow key={fill.product.id}>
                      <TableCell align="center">
                        <Typography className="text-truncate">
                          <img
                            src={fill.product.images[0].imagename}
                            alt=""
                            className="object-fit-cover"
                            style={{ width: "50%", aspectRatio: "1/1" }}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {minPrice === maxPrice ? (
                          formatPrice(maxPrice)
                        ) : (
                          <>
                            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                          </>
                        )}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="center">
                        {finalPrice}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Ngày bắt đầu sử dụng MUI DatePicker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="DD/MM/YYYY"
            label="Ngày bắt đầu"
            value={startday}
            // defaultValue={todayNow}
            onChange={(newValue) => setstartday(newValue)}
            sx={{
              "& .MuiInputBase-root": {
                width: "100%",
                marginBottom: "16px",
              },
            }}
          />
        </LocalizationProvider>
        {/* Ngày kết thúc sử dụng MUI DatePicker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="DD/MM/YYYY"
            label="Ngày kết thúc"
            value={endday}
            onChange={(newValue) => setendday(newValue)}
            sx={{
              "& .MuiInputBase-root": {
                width: "100%",
                marginBottom: "16px",
              },
            }}
          />
        </LocalizationProvider>

        {/* Nút thêm và nút làm mới */}
        <div className="form-group">
          <Button variant="contained" type="submit">
            Thêm Mới
          </Button>
          <Button
            variant="outlined"
            onClick={resetForm}
            sx={{ marginLeft: "16px" }}
          >
            Làm Mới
          </Button>
        </div>
      </form>
    </Box>
  );
}

export default AddVoucherForm;
