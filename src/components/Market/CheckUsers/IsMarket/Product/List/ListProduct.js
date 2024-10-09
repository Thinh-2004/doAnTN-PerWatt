import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ListProductStyle.css";
import axios from "../../../../../../Localhost/Custumize-axios";

import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { bouncy } from "ldrs";
import { Paper, TableContainer, TablePagination } from "@mui/material";
import useDebounce from "../../../../../../CustumHook/useDebounce";

import ProductTable from "./ProductTable";
import ToolbarListProduct from "./ToolbarListProduct";

bouncy.register();

const ListProduct = () => {
  const [fill, setFill] = useState([]); // giá trị để fill Pro vào bảng
  const [fetchData, setFetchData] = useState([]); //giá trị check === 0
  const idStore = localStorage.getItem("idStore");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("desc"); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState("name"); // Sorting by price
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Tìm kiếm
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  //Chọn option danh mục sản phẩm
  const [idCateOption, setIdCateOption] = useState("");

  const [isFilterQuantitySoldOut, setIsFilterQuantitySoldOut] = useState(false); //Trạng thái lọc quantity sold out

  const loadData = async () => {
    try {
      const resStore = await axios.get(`/store/${idStore}`);
      const res = await axios.get(`/productStore/${resStore.data.slug}`);

      const filteredData = res.data.filter((product) => {
        const searchTerm = debounceSearch.toLowerCase();
        // Kiểm tra nếu sản phẩm có ID danh mục
        const categoryMatch = idCateOption
          ? product.productcategory &&
            product.productcategory.id === idCateOption
          : true; // Nếu không có ID danh mục, không lọc theo danh mục
        return (
          (product.name.toLowerCase().includes(searchTerm) ||
            (product.productcategory &&
              product.productcategory.name
                .toLowerCase()
                .includes(searchTerm)) ||
            (product.trademark &&
              product.trademark.name.toLowerCase().includes(searchTerm))) &&
          categoryMatch // Thêm điều kiện lọc theo ID danh mục
        );
      });

      // Duyệt qua từng sản phẩm để lấy chi tiết sản phẩm và lưu vào productDetails
      const dataWithDetails = await Promise.all(
        filteredData.map(async (product) => {
          const resDetail = await axios.get(`/detailProduct/${product.id}`);
          return {
            ...product,
            productDetails: resDetail.data, // Lưu chi tiết sản phẩm vào mỗi sản phẩm
          };
        })
      );

      setFetchData(res.data);
      // setFillDetail(dataWithDetails);
      setFill(dataWithDetails);
    } catch (error) {
      console.log(error);
      setLoading(true);
      if (fetchData.length === 0) setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadData();
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [debounceSearch, idCateOption, isFilterQuantitySoldOut]);

  useEffect(() => {
    // setLoading(true);
    if (search) {
      setIdCateOption(null);
      setIsFilterQuantitySoldOut(false);
    }
    // setLoading(false);
  }, [search]);

  useEffect(() => {
    if (idCateOption) {
      setSearch("");
      setIsFilterQuantitySoldOut(false);
    }
  }, [idCateOption]);

  useEffect(() => {
    if (isFilterQuantitySoldOut) {
      setSearch("");
      setIdCateOption(null);
    }
  }, [isFilterQuantitySoldOut]);

  const handleSort = useCallback(
    (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy]
  );

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

  // Xử lý dữ liệu
  const mergedData = fill.map((product) => {
    //Sắp xếp Tăng Giảm theo giá
    const productDetailsSorted = product.productDetails
      ? product.productDetails.slice().sort((a, b) => {
          if (order === "asc") {
            return a.price > b.price ? 1 : -1;
          } else {
            return a.price < b.price ? 1 : -1;
          }
        })
      : [];

    //sắp xếp giá lớn nhất
    const maxPrice = productDetailsSorted.length
      ? Math.max(...productDetailsSorted.map((detail) => detail.price))
      : 0;

    //Tổng số lượng
    const totalQuantity = productDetailsSorted.reduce(
      (total, detailQuantity) => total + detailQuantity.quantity,
      0
    );

    return {
      ...product,
      productDetails: productDetailsSorted,
      maxPrice,
      totalQuantity,
    };
  });

  const filteredData = mergedData.filter(
    (product) => product.totalQuantity === 0
  );

  //Sử dụng useMeMo tránh việc tính toán lại các array dependencies
  const sortedData = useMemo(() => {
    if (isFilterQuantitySoldOut) {
      return filteredData.slice().sort((a, b) => {
        if (orderBy === "name") {
          return order === "asc" ? a.id - b.id : b.id - a.id;
        } else if (orderBy === "maxPrice") {
          return order === "asc"
            ? a.maxPrice - b.maxPrice
            : b.maxPrice - a.maxPrice;
        } else if (orderBy === "quantity") {
          return order === "asc"
            ? a.totalQuantity - b.totalQuantity
            : b.totalQuantity - a.totalQuantity;
        }
        return 0; //Trường hợp không cần sắp xếp
      });
    }
    return mergedData.slice().sort((a, b) => {
      if (orderBy === "name") {
        return order === "asc" ? a.id - b.id : b.id - a.id;
      } else if (orderBy === "maxPrice") {
        return order === "asc"
          ? a.maxPrice - b.maxPrice
          : b.maxPrice - a.maxPrice;
      } else if (orderBy === "quantity") {
        return order === "asc"
          ? a.totalQuantity - b.totalQuantity
          : b.totalQuantity - a.totalQuantity;
      }
      return 0; //Trường hợp không cần sắp xếp
    });
  }, [filteredData, isFilterQuantitySoldOut, mergedData, order, orderBy]);
  // Phân trang sau khi sắp xếp
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleClickFilterSoldOutByQuantity = useCallback(() => {
    setIsFilterQuantitySoldOut((pre) => !pre);
  }, []);

  const handleOptionChange = (event, newValue) => {
    if (!newValue) {
      setIdCateOption(null);
      return;
    }
    setIdCateOption(newValue.id); // Lưu id
  };

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
      <div className="mx-4 d-flex">
        <ToolbarListProduct
          search={search}
          setSearch={setSearch}
          handleOptionChange={handleOptionChange}
          idCateOption={idCateOption}
          handleClickFilterSoldOutByQuantity={
            handleClickFilterSoldOutByQuantity
          }
          isFilterQuantitySoldOut={isFilterQuantitySoldOut}
        />
      </div>
      <TableContainer component={Paper} id="table-container">
        {loading ? (
          <div className="mt-4 mb-4 d-flex justify-content-center">
            <l-bouncy size="60" speed="0.75" color="black"></l-bouncy>
          </div>
        ) : fetchData.length === 0 && !fill ? (
          <>
            <hr />
            <h1 className="text-center">Bạn chưa đăng bán sản phẩm.</h1>
          </>
        ) : paginatedData.length === 0 && search !== "" ? (
          <>
            <hr />
            <h1 className="text-center">Sản phẩm bạn tìm không tồn tại.</h1>
          </>
        ) : (
          <ProductTable
            data={paginatedData}
            orderBy={orderBy}
            order={order}
            handleSort={handleSort}
            handleSubmitDelete={handleSubmitDelete}
          />
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
