import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ListProductStyle.css";
import axios from "../../../../../../Localhost/Custumize-axios";

import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { bouncy } from "ldrs";
import { Box, Paper, TableContainer, TablePagination } from "@mui/material";
import useDebounce from "../../../../../../CustumHook/useDebounce";

import ProductTable from "./ProductTable";
import ToolbarListProduct from "./ToolbarListProduct";
import { load } from "@teachablemachine/image";

bouncy.register();

const ListProduct = () => {
  const [fill, setFill] = useState([]); // giá trị để fill Pro vào bảng
  const [fetchData, setFetchData] = useState([]); //giá trị check === 0
  const idStore = localStorage.getItem("idStore");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(""); // Sorting by price

  //Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  //Tìm kiếm
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  //Chọn option danh mục sản phẩm
  const [idCateOption, setIdCateOption] = useState("");

  const [isFilterQuantitySoldOut, setIsFilterQuantitySoldOut] = useState(false); //Trạng thái lọc quantity sold out

  const loadData = async (
    pageNo,
    pageSize,
    keyWord,
    sortBy,
    soldOutProduct
  ) => {
    setFill([]);
    setLoading(true);
    try {
      const resStore = await axios.get(`/store/${idStore}`);
      const res = await axios.get(
        `/productStore/${resStore.data.slug}?pageNo=${pageNo || ""}&pageSize=${
          pageSize || "5"
        }&keyWord=${keyWord || ""}&sortBy=${sortBy || ""}&soldOutProduct=${
          soldOutProduct || "false"
        }`
      );
      setCurrentPage(res.data.currentPage - 1);
      setTotalItems(res.data.totalItems);

      const filteredData = res.data.products.filter((product) => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(
      currentPage,
      totalPage,
      debounceSearch || idCateOption,
      sortOption,
      isFilterQuantitySoldOut
    );
  }, [
    currentPage,
    totalPage,
    debounceSearch,
    sortOption,
    idCateOption,
    isFilterQuantitySoldOut,
  ]);

  useEffect(() => {
    if (debounceSearch) {
      // Khi debounceSearch có dữ liệu, reset các giá trị liên quan
      setIdCateOption(null);
      setIsFilterQuantitySoldOut(false);
    }
  }, [debounceSearch]);

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

  const handleSortOption = useCallback((property) => {
    if (property === "oldItems") setSortOption(property);
    else if (property === "newItems") setSortOption(property);

    if (property === "priceDESC") setSortOption(property);
    else if (property === "priceASC") setSortOption(property);

    if (property === "quantityDESC") setSortOption(property);
    else if (property === "quantityASC") setSortOption(property);
    console.log(property);
    // setSortOption(property);
  }, []);

  const handleChangePage = async (event, newPage) => {
    // console.log(newPage);
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTotalPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
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

  const handleClickFilterSoldOutByQuantity = useCallback(() => {
    setIsFilterQuantitySoldOut((pre) => !pre);
  }, []);

  const handleOneChangeIdCate = (event, newValue) => {
    if (!newValue) {
      setIdCateOption(null);
      return;
    }
    setIdCateOption(newValue.id); // Lưu id
  };

  return (
    <Box
      className=" mt-4 mb-4"
      sx={{ backgroundColor: "backgroundElement.children" }}
    >
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
      <ToolbarListProduct
        search={search}
        setSearch={setSearch}
        handleOneChangeIdCate={handleOneChangeIdCate}
        idCateOption={idCateOption}
        handleClickFilterSoldOutByQuantity={handleClickFilterSoldOutByQuantity}
        isFilterQuantitySoldOut={isFilterQuantitySoldOut}
      />
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
        ) : fill.length === 0 && search !== "" ? (
          <>
            <hr />
            <h1 className="text-center">Sản phẩm bạn tìm không tồn tại.</h1>
          </>
        ) : (
          <ProductTable
            data={fill}
            handleSortOption={handleSortOption}
            handleSubmitDelete={handleSubmitDelete}
          />
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={totalItems}
        rowsPerPage={totalPage}
        page={currentPage}
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
    </Box>
  );
};

export default ListProduct;
