import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
  const [vouchername, setvouchername] = useState("");
  const [startday, setstartday] = useState(null);
  const [endday, setendday] = useState(null);
  const [discountprice, setdiscountprice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(""); // State for selected product
  const [selectedProductDetails, setSelectedProductDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsDetails, setProductsDetails] = useState([]); // State to store products
  const [priceDetailProduct, setPriceDetailProduct] = useState("");
  const [resultPrice, setResultPrice] = useState("");
  const navigate = useNavigate();
  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };
  //checkcombobox null
  const [checkName, setCheckName] = useState("");

  ///
  const dateNow = dayjs();
  const validate = () => {
    // Kiểm tra tên voucher
    if (!vouchername || vouchername.trim() === "") {
      toast.warning("Vui lòng nhập tên voucher");
      return false;
    }

    // Kiểm tra sản phẩm được chọn
    if (!selectedProduct) {
      toast.warning("Vui lòng chọn sản phẩm");
      return false;
    }

    // Kiểm tra phân loại sản phẩm được chọn
    if (!selectedProductDetails && checkName) {
      toast.warning("Vui lòng chọn phân loại sản phẩm");
      return false;
    }

    // Kiểm tra giá giảm
    const discount = parseFloat(discountprice);
    if (!discountprice || isNaN(discount) || discount <= 0 || discount > 100) {
      toast.warning("Vui lòng nhập giá giảm hợp lệ (1% => 100%)");
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

        status: "Hoạt động",
        slug: "",
      };

      const productDetails =
        checkName === null
          ? [productsDetails[0]]
          : selectedProductDetails.map((id) => ({ id }.id));

      try {
        const response = await axios.post("addVouchers", {
          voucher,
          productDetails,
        });
        console.log("Voucher created:", response.data);
        // Reset form sau khi thêm thành công
        resetForm();
        const idToast = toast.loading("Vui lòng chờ...");
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

        if (error.response && error.response.status === 400) {
          // Display the error message to the user
          toast.error(
            error.response.data.error ||
              "Tên voucher hoặc phân loại sản phẩm đã bị trùng.",
            {
              autoClose: 1500,
              closeButton: true,
            }
          );
        }
      }
    }
  };

  // Hàm để làm mới form
  const resetForm = () => {
    setvouchername("");
    setstartday(null);
    setendday(null);
    setdiscountprice("");
    setSelectedProduct("");
    setSelectedProductDetails([]);
    setCheckName("");
    setResultPrice("");
    setPriceDetailProduct("");
    setProductsDetails([]);
  };

  const handleClickIdProduct = async (e) => {
    const value = e.target.value;
    setSelectedProduct(value);
    if (value !== selectedProduct) {
      setPriceDetailProduct("");
      setResultPrice("");
    }
    try {
      // Gọi API để lấy sản phẩm theo idProduct
      const response = await axios.get(`fillProductDetails/${value}`);
      setProductsDetails(response.data); // Lưu dữ liệu sản phẩm vào state

      setCheckName(response.data[0].namedetail);
      setdiscountprice("");
      setResultPrice("");
      setPriceDetailProduct("");
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleOnChangeProductDetails = (e, newValue) => {
    // `newValue` là mảng các sản phẩm đã được chọn sau mỗi thay đổi
    setSelectedProductDetails(newValue); // Cập nhật giá trị đã chọn

    // Nếu có ít nhất 1 sản phẩm được chọn
    if (newValue.length > 0) {
      // Nếu chỉ có 1 sản phẩm được chọn
      if (newValue.length === 1) {
        setdiscountprice("");
        setResultPrice("");
        // Lấy giá của sản phẩm đã chọn
        const selectedProduct = productsDetails.find(
          (prDetails) => prDetails.id === newValue[0].id
        );
        if (selectedProduct) {
          setPriceDetailProduct(`${formatPrice(selectedProduct.price)}`);
        }
      } else {
        setdiscountprice("");
        setResultPrice("");
        // Nếu có nhiều hơn 1 sản phẩm được chọn
        //Lấy data giá
        const dataProductDetail = newValue.map((data) => data.price);
        //Lấy giá nhỏ nhất
        const minPriceSelected = Math.min(...dataProductDetail);
        //Lấy giá lớn nhất
        const maxPriceSelected = Math.max(...dataProductDetail);
        // Nếu tìm thấy cả 2 sản phẩm đầu tiên và cuối cùng, hiển thị giá của chúng
        if (minPriceSelected && maxPriceSelected) {
          setPriceDetailProduct(
            `${formatPrice(minPriceSelected)} - ${formatPrice(
              maxPriceSelected
            )}`
          );
        }
      }
    } else {
      setPriceDetailProduct(0); // Nếu không có sản phẩm nào được chọn, reset giá
    }
  };

  const handleOnChangePhanTramGiamGia = (e) => {
    const value = e.target.value;

    // Restrict input between 1 and 100
    if (value.length <= 3 && value >= 0 && value <= 100) {
      setdiscountprice(value); // Set phần trăm giảm giá

      // Cập nhật giá đã chọn cho người dùng
      if (selectedProductDetails.length > 0) {
        // Nếu chỉ chọn 1 sản phẩm
        if (selectedProductDetails.length === 1) {
          const selectedProduct = productsDetails.find(
            (prDetails) => prDetails.id === selectedProductDetails[0].id
          );
          // Tính giá giảm
          const priceDown = selectedProduct.price * (value / 100);
          const result = selectedProduct.price - priceDown;

          if (selectedProduct) {
            setResultPrice(formatPrice(result));
          }
        } else {
          // Nếu có nhiều sản phẩm, hiển thị giá của sản phẩm đầu tiên và cuối cùng

          //Lấy data giá
          const dataProductDetail = productsDetails.map((data) => data.price);
          //Lấy giá nhỏ nhất
          const minPriceSelected = Math.min(...dataProductDetail);
          //Lấy giá lớn nhất
          const maxPriceSelected = Math.max(...dataProductDetail);
          // Tính giá giảm First
          const priceDownFirst = minPriceSelected * (value / 100);
          const resultFirst = minPriceSelected - priceDownFirst;
          // Tính giá giảm First
          const priceDownLast = maxPriceSelected * (value / 100);
          const resultLast = maxPriceSelected - priceDownLast;

          if (minPriceSelected && maxPriceSelected) {
            setResultPrice(
              `${formatPrice(resultFirst)} - ${formatPrice(resultLast)}`
            );
          }
        }
      } else {
        // Tính giá giảm
        const priceDown = productsDetails[0].price * (value / 100);
        const result = productsDetails[0].price - priceDown;
        setResultPrice(formatPrice(result));
      }
    }
  };

  useEffect(() => {
    if (checkName === null) {
      setPriceDetailProduct(formatPrice(productsDetails[0].price));
    } else {
      setPriceDetailProduct("");
    }
  }, [checkName, productsDetails]);

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

        {/* Product selection using styled ComboBox */}
        <div className="form-group">
          <FormControl fullWidth>
            <InputLabel id="product-label">Chọn Sản Phẩm</InputLabel>
            <Select
              labelId="product-label"
              id="product-select"
              value={selectedProduct}
              onChange={handleClickIdProduct}
              label="Chọn Sản Phẩm"
              fullWidth
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400, // Đặt chiều cao tối đa cho dropdown để giữ thanh cuộn
                  },
                },
                disableScrollLock: true, // Ngăn trang web khóa cuộn khi mở dropdown
              }}
            >
              {products.map((product) => {
                const images = product.images[0];
                return (
                  <MenuItem key={product.id} value={product.id}>
                    <Box display="flex" alignItems="center">
                      <img
                        src={images.imagename}
                        style={{ width: "40px", aspectRatio: "1/1" }}
                        alt=""
                      />
                      &nbsp;
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "500px", // Đặt chiều rộng tối đa cho tên sản phẩm
                        }}
                      >
                        {product.name}
                      </span>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="form-group">
          {checkName === null ? (
            <FormControl fullWidth disabled>
              <InputLabel id="demo-simple-select-disabled-label">
                {" "}
                Sản phẩm không có phân loại
              </InputLabel>
              <Select
                labelId="demo-simple-select-disabled-label"
                id="demo-simple-select-disabled"
                label="Chọn Loại Sản Phẩm"
              ></Select>
            </FormControl>
          ) : (
            <>
              {/* <FormControl fullWidth>
              <InputLabel id="product-label">Chọn Loại Sản Phẩm</InputLabel>
              <Select
                labelId="product-label"
                id="product-select"
                value={selectedProductDetails}
                onChange={handleOnChangeProductDetails}
                label="Chọn Sản Phẩm"
                fullWidth
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400, // Đặt chiều cao tối đa cho dropdown để giữ thanh cuộn
                    },
                  },
                  disableScrollLock: true, // Ngăn trang web khóa cuộn khi mở dropdown
                }}
              >
                {productsDetails.map((productsDetails) => (
                  <MenuItem key={productsDetails.id} value={productsDetails.id}>
                    <Box display="flex" alignItems="center">
                      <img
                        style={{ width: "40px", aspectRatio: "1/1" }}
                        src={geturlImgDetailProduct(
                          productsDetails.id,
                          productsDetails.imagedetail
                        )}
                        alt=""
                      />
                      &nbsp;
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "500px", // Đặt chiều rộng tối đa cho tên sản phẩm
                        }}
                      >
                        {productsDetails.namedetail}
                      </span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={productsDetails}
                value={selectedProductDetails}
                onChange={handleOnChangeProductDetails}
                disableCloseOnSelect
                getOptionLabel={(option) => option.namedetail}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <img
                        style={{ width: "40px", aspectRatio: "1/1" }}
                        src={option.imagedetail}
                        alt=""
                      />
                      &nbsp;
                      {option.namedetail}
                    </li>
                  );
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Chọn phân loại" />
                )}
              />
            </>
          )}
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
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="form-group">
              <TextField
                label="Giá gốc"
                variant="outlined"
                value={priceDetailProduct}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="form-group">
              <TextField
                label="Giá Giảm (%)"
                variant="outlined"
                value={resultPrice}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>
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
