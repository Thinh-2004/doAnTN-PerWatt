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
    selectedProduct: [],
    quantity: 0,
  });

  const formatPrice = (value) => {
    return value ? Number(value).toLocaleString("vi-VN") : "";
  };
  const [products, setProducts] = useState([]);

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

    if (formEdit.quantity === 0) {
      toast.warning("Vui lòng nhập số lượng voucher hợp lệ");
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

  const handleOnChangePhanTramGiamGia = (e) => {
    const value = e.target.value;

    // Nếu giá trị là rỗng, đặt giảm giá và kết quả giá về 0
    if (value === "") {
      setFormEdit((pre) => ({
        ...pre,
        discountprice: 0,
      }));
      return;
    }

    const discountValue = parseFloat(value);

    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      setFormEdit((pre) => ({
        ...pre,
        discountprice: discountValue,
      }));
    }
  };

  const handleQuantity = (e) => {
    const value = e.target.value;
    setFormEdit((pre) => ({
      ...pre,
      quantity: value,
    }));
  };

  const handleChangeSelectedProduct = (e, newValue) => {
    // `newValue` là mảng các sản phẩm đã được chọn sau mỗi thay đổi
    setFormEdit((prev) => ({
      ...prev,
      selectedProduct: newValue, // Cập nhật trực tiếp giá trị trong formEdit
    }));
    console.log(newValue);
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
        console.log(response.data);
        setFormEdit({
          vouchername: response.data[0].voucher.vouchername,
          selectedProduct: response.data.map((fill) => fill),
          discountprice: response.data[0].voucher.discountprice,
          startday: response.data[0].voucher.startday,
          endday: response.data[0].voucher.endday,
          quantity: response.data[0].voucher.quantityvoucher,
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
        quantityvoucher: parseInt(formEdit.quantity),
        slug: "",
      };
      const products = formEdit.selectedProduct.map(
        (id) => ({ id }.id.product)
      );
      const dataToSend = {
        voucher,
        products,
      };
      console.log(dataToSend);
      const idToast = toast.loading("Vui lòng chờ...");
      try {
        await axios.put(`updateVoucher/${slug}`, { voucher, products });

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

        <div className="form-group">
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={products}
            value={formEdit.selectedProduct}
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
            value={formEdit.discountprice}
            onChange={handleOnChangePhanTramGiamGia}
            fullWidth
          />
        </div>
        <div className="form-group">
          <TextField
            label="Số lượng voucher"
            variant="outlined"
            name="quantity"
            value={formEdit.quantity}
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
              {formEdit.selectedProduct.length === 0 ? (
                <h6 className="p-2">Vui lòng chọn sản phẩm</h6>
              ) : (
                products
                  .filter((fill) => {
                    // Kiểm tra xem id của sản phẩm có tồn tại trong danh sách products không
                    return formEdit.selectedProduct.some(
                      (product) => product.product.id === fill.product.id
                    );
                  })
                  .map((fill) => {
                    // Lấy giá từng mảng product
                    const priceProductDetail = fill.productDetails.map(
                      (data) => data.price
                    );
                    const discountPrices = priceProductDetail.map((price) => {
                      const discount = price * (formEdit.discountprice / 100);
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
              {/* {fillProduct.length === 0 ? (
                <h6 className="p-2">Vui lòng chọn sản phẩm</h6>
              ) : (
                fillProduct &&
                fillProduct.map((fill) => {
                  //Lấy giá từng mảng product
                  const priceProductDetail = fill.productDetails.map(
                    (data) => data.price
                  );
                  const discountPrices = priceProductDetail.map((price) => {
                    const discount = price * (formEdit.discountprice / 100);
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
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
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
