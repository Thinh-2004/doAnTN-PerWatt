import axios from "../../../Localhost/Custumize-axios";
import React, { useEffect, useState } from "react";
import TableUsers from "./TableUsers";
import ToolbarListUsers from "./ToolbarListUsers";
import { Paper, TableContainer, TablePagination } from "@mui/material";
import useDebounce from "../../../CustumHook/useDebounce";
import { bouncy } from "ldrs";

bouncy.register();
const ListUsers = () => {
  const [listUsers, setListUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  //Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSeach] = useState("");
  const [dataRadioCheck, setDataRadioCheck] = useState("");
  const debounceSearch = useDebounce(search, 500);

  const [isSortName, setIsSortName] = useState(false); // boolean sắp xếp theo tên
  const [sortOption, setSortOption] = useState("");

  const loadData = async (pageNo, pageSize, keyWord, checkFilter, sortBy) => {
    setListUsers([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/user?pageNo=${pageNo || ""}&pageSize=${pageSize || "5"}&keyWord=${
          keyWord || ""
        }&checkFilter=${checkFilter || ""}&sortBy=${sortBy || ""}`
      );
      setListUsers(res.data.users);
      setCurrentPage(res.data.currentPage);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(
      debounceSearch ? 0 : currentPage,
      totalPage,
      debounceSearch,
      dataRadioCheck,
      sortOption
    );
  }, [currentPage, totalPage, debounceSearch, dataRadioCheck, sortOption]);

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTotalPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDateRadioCheckItem = (value) => {setDataRadioCheck(value);};

  const handleSortOption = (property) => {
    if (property === "ASCName") {
      setSortOption(property);
      setIsSortName(true);
    } else if (property === "DESCName") {
      setSortOption(property);
      setIsSortName(false);
    }
  }

  return (
    <>
      <div>
        <h2>Danh sách người dùng</h2>
        <ToolbarListUsers
          search={search}
          setSearch={setSeach}
          radioCheckItem={handleDateRadioCheckItem}
        />
      </div>
      <TableContainer id="table-container">
        {loading ? (
          <div className="mt-4 mb-4 d-flex justify-content-center">
            <l-bouncy size="60" speed="0.75" color="black"></l-bouncy>
          </div>
        ) : listUsers.length === 0 && search === "" ? (
          <>
            <hr />
            <h1 className="text-center">Dữ liệu người dùng rỗng.</h1>
          </>
        ) : listUsers.length === 0 && search !== "" ? (
          <>
            <hr />
            <h1 className="text-center">Thông tin bạn tìm không tồn tại</h1>
          </>
        ) : (
          <TableUsers
            data={listUsers}
            isSortName={isSortName}
            valueSort={handleSortOption}
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
    </>
  );
};

export default ListUsers;
