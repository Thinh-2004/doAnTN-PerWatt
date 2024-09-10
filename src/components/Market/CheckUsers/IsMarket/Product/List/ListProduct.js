import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListProductStyle.css";
import axios from "../../../../../../Localhost/Custumize-axios";
import useSession from "../../../../../../Session/useSession";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { bouncy } from "ldrs";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
} from "@mui/material";
import useDebounce from "../../../../../../CustumHook/useDebounce";

bouncy.register();

const ListProduct = () => {
  const [fill, setFill] = useState([]); // giá trị để fill Pro vào bảng
  const [fetchData, setFetchData] = useState([]); //giá trị check === 0
  const [idStore] = useSession("idStore");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc"); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState("price"); // Sorting by price
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  const geturlIMG = (productId, filename) => {
    return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  };

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN"); // Định dạng theo kiểu Việt Nam
  };

  const loadData = async () => {
    try {
      const res = await axios.get(`/productStore/${idStore}`);
      const filteredData = res.data.filter((product) => {
        const searchTerm = debounceSearch.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.productcategory.name.toLowerCase().includes(searchTerm) ||
          product.trademark.name.toLowerCase().includes(searchTerm)
        );
      });
      setFetchData(res.data);
      setFill(filteredData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
      if (fetchData.length === 0) setLoading(false);
    }
  };

  // const loadDetailProduct = async () => {
  //   const res = await axios.get(`/detailProduct/14`)
  //   console.log(res.data);
  // }

  useEffect(() => {
    loadData();
  }, [idStore, debounceSearch]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitDelete = (idPr) => {
    confirmAlert({
      title: "Bạn có chắc muốn xóa chứ",
      message: "Thực hiện chức năng xóa sản phẩm",
      buttons: [
        {
          label: "Xóa",
          onClick: async () => {
            const id = toast.loading("Vui lòng chờ...");
            try {
              await axios.delete(`ProductDelete/${idPr}`);
              toast.update(id, {
                render: "Xóa thành công",
                type: "success",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
              loadData();
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Hủy",
        },
      ],
    });
  };

  const sortedData = fill.slice().sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return a[orderBy] < b[orderBy] ? 1 : -1;
    }
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="card mt-4 mb-4">
      <div className="d-flex justify-content-between p-4">
        <h3>Sản phẩm cửa hàng</h3>
        <button className="btn" id="btn-add">
          <Link
            to={"/profileMarket/FormStoreProduct"}
            style={{ color: "rgb(45, 91, 0)" }}
          >
            Thêm sản phẩm
          </Link>
        </button>
      </div>
      <div className="mx-4">
        <TextField
          id="outlined-search"
          label="Nhập từ khóa bạn cần tìm kiếm (Tên, Loại, Hãng)."
          type="search"
          size="small"
          fullWidth
          name="searchProduct"
          onChange={(e) => setSearch(e.target.value)} // Update search state on input change
          value={search}
        />
      </div>
      <TableContainer component={Paper} id="table-container">
        {loading ? (
          <div className="mt-4 mb-4 d-flex justify-content-center">
            <l-bouncy size="60" speed="0.75" color="black"></l-bouncy>
          </div>
        ) : fetchData.length === 0 ? (
          <>
            <hr />
            <h1 className="text-center">Bạn chưa đăng bán sản phẩm.</h1>
          </>
        ) : paginatedData.length === 0 ? (
          <>
            <hr />
            <h1 className="text-center">Sản phẩm bạn tìm không tồn tại.</h1>
          </>
        ) : (
          <Table id="table" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Hình</TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                  >
                    Sản phẩm
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Loại</TableCell>
                <TableCell align="center">Hãng</TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? order : "asc"}
                    onClick={() => handleSort("price")}
                  >
                    Giá
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">SL</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((fill) => {
                const firstIMG = fill.images[0];
                const productDetails = fill.productDetails;

                //Tìm giá nhỏ nhất lớn nhất trong mảng
                const minPrice = Math.min(
                  ...productDetails.map((filter) => filter.price)
                );
                const maxPrice = Math.max(
                  ...productDetails.map((filter) => filter.price)
                );

                const totalQuantity = productDetails.reduce(
                  (total, detailQuantity) => total + detailQuantity.quantity,
                  0
                );
                return (
                  <TableRow
                    key={fill.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className="d-flex justify-content-center"
                    >
                      {firstIMG ? (
                        <img
                          src={geturlIMG(fill.id, firstIMG.imagename)}
                          alt=""
                          className="img-fluid"
                          id="img-product-item"
                        />
                      ) : (
                        <img
                          src="/images/no_img.png"
                          alt=""
                          className="img-fluid"
                          id="img-product-item"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">{fill.name}</TableCell>
                    <TableCell align="center">
                      {fill.productcategory.name}
                    </TableCell>
                    <TableCell align="center">{fill.trademark.name}</TableCell>
                    <TableCell align="center">
                      {minPrice === maxPrice
                        ? formatPrice(minPrice) + " đ"
                        : `${formatPrice(minPrice)} - ${formatPrice(
                            maxPrice
                          )}` + " đ"}
                    </TableCell>
                    <TableCell align="center">{totalQuantity}</TableCell>
                    <TableCell align="center">
                      <div className="d-flex justify-content-center">
                        <Link
                          className="btn"
                          id="btn-edit"
                          to={`/profileMarket/updateProduct/${fill.id}`}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button
                          className="btn mx-2"
                          id="btn-delete"
                          onClick={(e) => handleSubmitDelete(fill.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <Link
                          className="btn"
                          id="btn-showDetail"
                          to={`/profileMarket/checkItemProduct/${fill.id}`}
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={fill.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Giới hạn hiển thị"
        sx={{
          ".MuiTablePagination-displayedRows": {
            transform: "translateY(7px)", // Điều chỉnh giá trị này để di chuyển xuống theo ý muốn
          },
          ".MuiTablePagination-selectLabel": {
            transform: "translateY(7px)", // Điều chỉnh giá trị này để di chuyển xuống theo ý muốn
          },
        }}
      />
    </div>
  );
};

export default ListProduct;
