import axios from "../../../../../Localhost/Custumize-axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";

import { toast } from "react-toastify";

import VoucherTable from "./VoucherTable";
import ToolBarVoucher from "./ToolBarVoucher";
import { Paper, TableContainer, TablePagination } from "@mui/material";
import useDebounce from "../../../../../CustumHook/useDebounce";
import { ring } from "ldrs";
import { ThemeModeContext } from "../../../../ThemeMode/ThemeModeProvider";

ring.register();

function VoucherList() {
  const idStore = sessionStorage.getItem("idStore");
  const { mode } = useContext(ThemeModeContext);
  //State voucher
  const [vouchers, setVouchers] = useState([]);

  //State loading
  const [loading, setLoading] = useState(false);

  //State nhận dữ liệu textSearch
  const [dataSearch, setDataSearch] = useState("");
  //Sate nhận dữ liệu radioCheck
  const [dataRadioCheck, setDataRadioCheck] = useState("");

  //DebouceSearh
  const useDebounceSearch = useDebounce(dataSearch, 500);

  //Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalItems, setTotalItems] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [sortOption, setSortOption] = useState("");

  const [isSortName, setIsSortName] = useState(false); // boolean sắp xếp theo tên
  const [isSortDisCountPrice, setIsDisCountPrice] = useState(false); //boolean sắp xếp theo % giảm

  // Hàm để lấy danh sách vouchers
  const fetchVouchers = async (pageNo, pageSize, keyWord, status, sortBy) => {
    setVouchers([]);
    setLoading(true);
    try {
      const response = await axios.get(
        `fillVoucher/${idStore}?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keyWord=${keyWord || ""}&status=${status || ""}&sortBy=${
          sortBy || ""
        }`
      );
      setVouchers(response.data.vouchersGrouped);
      setCurrentPage(response.data.currentPage);
      setTotalItems(response.data.totalItem);
      setTotalPage(
        response.data.totalPage === 1
          ? response.data.totalPage
          : response.data.totalPage - 1
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      // setError("Error fetching vouchers");
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetchVouchers khi component mount
  useEffect(() => {
    fetchVouchers(
      useDebounceSearch ? 0 : currentPage,
      10,
      useDebounceSearch,
      dataRadioCheck,
      sortOption
    );
  }, [useDebounceSearch, currentPage, dataRadioCheck, sortOption]);

  // Hàm xóa voucher
  const handleDelete = (id) => {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa voucher này không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            const toastId = toast.loading("Vui lòng chờ...");
            try {
              await axios.delete(`delete/${id}`);

              toast.update(toastId, {
                render: "Xóa voucher thành công!",
                type: "success",
                isLoading: false,
                autoClose: 1500,
                closeButton: true,
              });

              fetchVouchers();
            } catch (error) {
              toast.update(toastId, {
                render: "Xóa voucher thất bại!",
                type: "error",
                isLoading: false,
                autoClose: 1500,
                closeButton: true,
              });
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  //Hàm nhận dataSearch
  const handleDataSearch = useCallback((value) => {
    // console.log(value);
    setDataSearch(value);
  }, []);

  //Hàm nhận dataRadio
  const handleDateRadioCheckItem = useCallback((value) => {
    // console.log(value);
    setDataRadioCheck(value);
  }, []);

  const handleChangePage = (event, newPage) => {
    // console.log(newPage);
    setCurrentPage(newPage);
  };

  //Hàm xử lí việc sort children
  const handleSortOption = useCallback((property) => {
    if (property === "oldVouchers") {
      setSortOption(property);
      setIsSortName(true);
    } else if (property === "newVouchers") {
      setSortOption(property);
      setIsSortName(false);
    }

    if (property === "disCountPriceASC") {
      setSortOption(property);
      setIsDisCountPrice(true);
    } else if (property === "disCountPriceDESC") {
      setSortOption(property);
      setIsDisCountPrice(false);
    }

    // if (property === "quantityASC") {
    //   setSortOption(property);
    //   setIsSortQuantity(true);
    // } else if (property === "quantityDESC") {
    //   setSortOption(property);
    //   setIsSortQuantity(false);
    // }

    // console.log(property);
  }, []);

  return (
    <div className=" mt-5">
      <h2 className="text-center">Danh Sách Voucher</h2>

      <ToolBarVoucher
        textSearch={handleDataSearch}
        radioCheckItem={handleDateRadioCheckItem}
      />
      <TableContainer
        component={Paper}
        className="mt-4"
        sx={{ backgroundColor: "backgroundElement.children" }}
      >
        {loading ? (
          <div className="p-2 d-flex justify-content-center">
            <l-ring
              size="40"
              stroke="5"
              bg-opacity="0"
              speed="2"
              color={mode === "light" ? "black" : "white"}
            ></l-ring>
          </div>
        ) : vouchers.length === 0 ? (
          <>
            <h1 className="text-center p-2">
              Thông tin bạn tìm không tồn tại.
            </h1>
          </>
        ) : (
          <VoucherTable
            data={vouchers}
            handleDelete={handleDelete}
            isSortName={isSortName}
            isSortDisCountPrice={isSortDisCountPrice}
            valueSort={handleSortOption}
          />
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[]} // Ẩn lựa chọn số hàng mỗi trang
        component="div"
        count={totalPage === 1 ? 1 : totalItems}
        rowsPerPage={totalPage}
        page={currentPage}
        onPageChange={handleChangePage}
        sx={{
          ".MuiTablePagination-displayedRows": {
            transform: "translateY(7px)", // Điều chỉnh vị trí nếu muốn
          },
          ".MuiTablePagination-selectLabel": {
            display: "none", // Ẩn nhãn "Rows per page"
          },
          ".MuiTablePagination-select": {
            display: "none", // Ẩn dropdown lựa chọn số hàng trên mỗi trang
          },
        }}
      />
    </div>
  );
}

export default VoucherList;
