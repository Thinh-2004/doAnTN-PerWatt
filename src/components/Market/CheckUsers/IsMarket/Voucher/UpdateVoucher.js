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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function UpdateVoucherForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [formEdit, setFormEdit] = useState({
    vouchername: "",
    startday: "",
    endday: "",
    discountprice: "",
    selectedProduct: "",
    selectedProductDetails: [],
  });
  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };
  const [products, setProducts] = useState([]); // State to store products
  const [productsDetails, setProductsDetails] = useState([]); // State to store products
  const [priceDetailProduct, setPriceDetailProduct] = useState("");
  const [resultPrice, setResultPrice] = useState("");
  //checkcombobox null
  const [checkName, setCheckName] = useState("");
  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };
  const geturlImgDetailProduct = (detailId, filename) => {
    return `${axios.defaults.baseURL}files/detailProduct/${detailId}/${filename}`;
  };
  const validate = () => {
    // Kiểm tra tên voucher
    if (!formEdit.vouchername || formEdit.vouchername.trim() === "") {
      toast.warning("Vui lòng nhập tên voucher");
      return false;
    }

    // Kiểm tra sản phẩm được chọn
    if (!formEdit.selectedProduct) {
      toast.warning("Vui lòng chọn sản phẩm");
      return false;
    }

    // Kiểm tra phân loại sản phẩm được chọn
    if (!formEdit.selectedProductDetails && checkName) {
      toast.warning("Vui lòng chọn phân loại sản phẩm");
      return false;
    }

    // Kiểm tra giá giảm
    const discount = parseFloat(formEdit.discountprice);
    if (
      !formEdit.discountprice ||
      isNaN(discount) ||
      discount <= 0 ||
      discount > 100
    ) {
      toast.warning("Vui lòng nhập giá giảm hợp lệ (1% => 100%)");
      return false;
    }

    const dateNow = new Date();
    const startDay = new Date(formEdit.startday);
    const endDay = new Date(formEdit.endday);

    // Kiểm tra ngày bắt đầu hợp lệ
    if (isNaN(startDay.getTime())) {
      toast.warning("Ngày bắt đầu không hợp lệ");
      return false;
    }

    // Kiểm tra ngày kết thúc hợp lệ
    if (isNaN(endDay.getTime())) {
      toast.warning("Ngày kết thúc không hợp lệ");
      return false;
    }

    // So sánh ngày bắt đầu với ngày hiện tại (chỉ so sánh ngày, tháng, năm)
    if (
      startDay.getFullYear() < dateNow.getFullYear() ||
      (startDay.getFullYear() === dateNow.getFullYear() &&
        startDay.getMonth() < dateNow.getMonth()) ||
      (startDay.getFullYear() === dateNow.getFullYear() &&
        startDay.getMonth() === dateNow.getMonth() &&
        startDay.getDate() < dateNow.getDate())
    ) {
      toast.warning("Ngày bắt đầu phải từ hôm nay hoặc hơn");
      return false;
    }

    // So sánh ngày kết thúc với ngày bắt đầu (chỉ so sánh ngày, tháng, năm)
    if (
      endDay.getFullYear() < startDay.getFullYear() ||
      (endDay.getFullYear() === startDay.getFullYear() &&
        endDay.getMonth() < startDay.getMonth()) ||
      (endDay.getFullYear() === startDay.getFullYear() &&
        endDay.getMonth() === startDay.getMonth() &&
        endDay.getDate() < startDay.getDate())
    ) {
      toast.warning("Ngày kết thúc không được nhỏ hơn ngày bắt đầu");
      return false;
    }

    return true;
  };

  const handleClickIdProduct = async (e) => {
    const value = e.target.value;
    // console.log(value);
    if (value !== formEdit.selectedProduct) {
      setFormEdit((pre) => ({
        ...pre,
        selectedProduct: value,
        discountprice: "",
        selectedProductDetails: [],
      }));
      setPriceDetailProduct("");
      setResultPrice("");
    } else {
      setFormEdit((pre) => ({
        ...pre,
        selectedProduct: value ? value : pre.selectedProduct,
      }));
    }

    const keyFilDetail = value ? value : formEdit.selectedProduct;
    console.log(keyFilDetail);

    try {
      // Gọi API để lấy sản phẩm theo storeId
      const response = await axios.get(`fillProductDetails/${keyFilDetail}`);
      setProductsDetails(response.data); // Lưu dữ liệu sản phẩm vào state
      // console.log(response.data);
      setPriceDetailProduct("");

      setCheckName(response.data[0].namedetail);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleOnChangeProductDetails = (event, newValue) => {
    console.log(newValue);

    // Cập nhật mảng các sản phẩm chi tiết đã chọn vào `formEdit`
    setFormEdit((pre) => ({
      ...pre,
      selectedProductDetails: newValue ? newValue : [],
    }));

    // Tính giá của sản phẩm chi tiết đầu tiên (nếu có)
    if (newValue.length > 0) {
      setPriceDetailProduct(newValue[0].price); // Lấy giá của phần tử đầu tiên
    } else {
      setPriceDetailProduct(""); // Nếu không chọn gì, reset giá
    }
  };

  const handleOnChangePhanTramGiamGia = (e) => {
    const value = e.target.value;

    // Restrict input between 1 and 100
    if (value.length <= 3 && value >= 0 && value <= 100) {
      setFormEdit((pre) => ({
        ...pre,
        discountprice: value,
      }));

      // Calculate the discount or set to 0 if the value is 100
      const priceDown = priceDetailProduct * (value / 100);
      const result = priceDetailProduct - priceDown;
      setResultPrice(result);
    }
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
    const fetchVoucherData = async () => {
      try {
        const response = await axios.get(`editVoucherShop/${slug}`);
        //Khởi tạo biến nhận dữ liệu từ api
        const data = response.data;
        //Duyệt qua từng mảng data để lấy idProductDetail
        const productDetail = Array.isArray(data)
          ? data.map((id) => id.productDetail)
          : [];

        setFormEdit({
          vouchername: response.data[0].vouchername,
          selectedProduct: response.data[0].productDetail.product.id,
          selectedProductDetails: productDetail,
          discountprice: response.data[0].discountprice,
          startday: response.data[0].startday,
          endday: response.data[0].endday,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (slug) {
      fetchProducts();
      fetchVoucherData();
    }
  }, [slug]);

  useEffect(() => {
    const loadCboPrDetail = async () => {
      try {
        // Gọi API để lấy sản phẩm theo storeId
        const response = await axios.get(
          `fillProductDetails/${formEdit.selectedProduct}`
        );
        setProductsDetails(response.data); // Lưu dữ liệu sản phẩm vào state
        setCheckName(response.data[0].namedetail);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    if (formEdit.selectedProduct) {
      loadCboPrDetail();
    }
  }, [formEdit.selectedProduct]);

  //Render giá gốc và giá sau khi giảm sản phẩm
  useEffect(() => {
    // Nếu có ít nhất 1 sản phẩm được chọn
    if (formEdit.selectedProductDetails.length > 0) {
      // Nếu chỉ có 1 sản phẩm được chọn
      if (formEdit.selectedProductDetails.length === 1) {
        // Lấy giá của sản phẩm đã chọn
        const selectedProduct = Array.isArray(productsDetails)
          ? productsDetails.find(
              (prDetails) =>
                prDetails.id === formEdit.selectedProductDetails[0].id
            )
          : null;

        // Tính giá giảm
        const priceDown =
          selectedProduct?.price * (formEdit.discountprice / 100);
        const result = selectedProduct?.price - priceDown;
        if (selectedProduct) {
          setPriceDetailProduct(formatPrice(selectedProduct.price));
          setResultPrice(formatPrice(result));
        }
      } else {
        // Nếu có nhiều hơn 1 sản phẩm được chọn
        // Nếu có nhiều hơn 1 sản phẩm được chọn
        //Lấy data giá
        const dataProductDetail = formEdit.selectedProductDetails.map(
          (data) => data.price
        );
        //Lấy giá nhỏ nhất
        const minPriceSelected = Math.min(...dataProductDetail);
        //Lấy giá lớn nhất
        const maxPriceSelected = Math.max(...dataProductDetail);
        // Tính giá giảm First
        const priceDownFirst =
          minPriceSelected * (formEdit.discountprice / 100);
        const resultFirst = minPriceSelected - priceDownFirst;
        // Tính giá giảm First
        const priceDownLast = maxPriceSelected * (formEdit.discountprice / 100);
        const resultLast = maxPriceSelected - priceDownLast;

        // Nếu tìm thấy cả 2 sản phẩm đầu tiên và cuối cùng, hiển thị giá của chúng
        if (minPriceSelected && maxPriceSelected) {
          setPriceDetailProduct(
            `${formatPrice(minPriceSelected)} - ${formatPrice(
              maxPriceSelected
            )}`
          );
          setResultPrice(
            `${formatPrice(resultFirst)} - ${formatPrice(resultLast)}`
          );
        }
      }
    } else {
      setPriceDetailProduct(0); // Nếu không có sản phẩm nào được chọn, reset giá
    }
  }, [
    formEdit.selectedProductDetails,
    productsDetails,
    formEdit.discountprice,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const voucher = {
        vouchername: formEdit.vouchername,
        startday: formEdit.startday
          ? dayjs(formEdit.startday).format("YYYY-MM-DDTHH:mm:ssZ")
          : null,
        endday: formEdit.endday
          ? dayjs(formEdit.endday).format("YYYY-MM-DDTHH:mm:ssZ")
          : null,
        discountprice: formEdit.discountprice, // Giá giảm đã chuyển đổi thành số thực

        status: "Hoạt động",
        slug: "",
      };

      const productDetails =
        checkName === null
          ? [productsDetails[0]]
          : formEdit.selectedProductDetails.map((id) => ({ id }.id));

      const dataToSend = {
        voucher,
        productDetails,
      };
      console.log(dataToSend);

      try {
        await axios.put(`updateVoucher/${slug}`, { voucher, productDetails });
        const idToast = toast.loading("Vui lòng chờ...");
        toast.update(idToast, {
          render: "Cập nhật voucher thành công!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
          closeButton: true,
        });
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

  useEffect(() => {
    if (checkName === null) {
      setPriceDetailProduct(productsDetails[0].price);
    }
  }, [checkName, productsDetails, priceDetailProduct]);

  const handleInputChange = (e, field) => {
    // Kiểm tra nếu `e` là sự kiện từ các trường nhập liệu thông thường (TextField, Select, v.v.)
    if (e?.target) {
      const { name, value } = e.target;
      setFormEdit((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Kiểm tra nếu `e` là một đối tượng Dayjs từ DatePicker
    else if (e instanceof dayjs) {
      // Kiểm tra tên trường để cập nhật đúng giá trị
      setFormEdit((prev) => ({
        ...prev,
        [field]: e.format("YYYY-MM-DD"), // Cập nhật đúng trường được chọn
      }));
    }
  };

  return (
    <Box
      sx={{ backgroundColor: "backgroundElement.children" }}
      id="voucherFormContainer"
      className="container mt-5"
    >
      <h2 className="text-center">Cập Nhật Voucher</h2>
      <form id="voucherForm" onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <TextField
            label="Tên Voucher"
            variant="outlined"
            name="vouchername"
            value={formEdit.vouchername}
            onChange={handleInputChange}
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
              value={formEdit.selectedProduct}
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
                        src={geturlIMG(product.id, images.imagename)}
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
                value={formEdit.selectedProductDetails}
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
                value={formEdit.selectedProductDetails}
                onChange={(event, newValue) =>
                  handleOnChangeProductDetails(event, newValue)
                }
                disableCloseOnSelect
                getOptionLabel={(option) => option.namedetail}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    <img
                      style={{ width: "40px", aspectRatio: "1/1" }}
                      src={geturlImgDetailProduct(
                        option.id,
                        option.imagedetail
                      )}
                      alt=""
                    />
                    &nbsp;
                    {option.namedetail}
                  </li>
                )}
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
            value={formEdit.discountprice}
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
            label="Ngày bắt đầu"
            value={formEdit.startday ? dayjs(formEdit.startday) : null}
            format="DD/MM/YYYY"
            onChange={(e) => handleInputChange(e, "startday")} // Chỉ thay đổi startday
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
            label="Ngày kết thúc"
            format="DD/MM/YYYY"
            value={formEdit.endday ? dayjs(formEdit.endday) : null}
            onChange={(e) => handleInputChange(e, "endday")} // Chỉ thay đổi endday
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
            Cập Nhật
          </Button>
        </div>
      </form>
    </Box>
  );
}

export default UpdateVoucherForm;
