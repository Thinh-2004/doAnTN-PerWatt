import React, { useCallback, useEffect, useState } from "react";
import useDebounce from "../../../CustumHook/useDebounce";
import axios from "../../../Localhost/Custumize-axios";
import ToolbarListUserAdmins from "./ToolbarListUserAdmins";
import { TableContainer, TablePagination } from "@mui/material";
import TableUserAdmins from "./TableUserAdmins";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const ListUserAdmins = () => {
  const [listUserAdmins, setListUserAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  //Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  //
  const [search, setSeach] = useState("");
  const [dataSelected, setDataSelected] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const [isSortName, setIsSortName] = useState(false); // boolean sắp xếp theo tên
  const [sortOption, setSortOption] = useState("");
  //Nhận state để load lại table
  const [isRefesh, setIsRefesh] = useState(false);

  const loadData = async (pageNo, pageSize, keyWord, checkSelected, sortBy) => {
    setListUserAdmins([]);
    setLoading(true);
    try {
      const res = await axios.get(
        `/user/admin?pageNo=${pageNo || ""}&pageSize=${
          pageSize || "5"
        }&keyWord=${keyWord || ""}&checkSelected=${
          checkSelected || ""
        }&sortBy=${sortBy || ""}`
      );
      setListUserAdmins(res.data.users);
      setCurrentPage(res.data.currentPage);
      setTotalItems(res.data.totalItems);
      console.log(res.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRefesh)
      loadData(
        debounceSearch ? 0 : currentPage,
        totalPage,
        debounceSearch,
        dataSelected,
        sortOption
      );
    else
      loadData(
        debounceSearch ? 0 : currentPage,
        totalPage,
        debounceSearch,
        dataSelected,
        sortOption
      );
  }, [
    currentPage,
    totalPage,
    debounceSearch,
    dataSelected,
    sortOption,
    isRefesh,
  ]);

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTotalPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleSelectedItem = useCallback((value) => {
    // console.log(value);
    setDataSelected(value);
  }, []);

  const handleSortOption = useCallback((property) => {
    if (property === "ASCName") {
      setSortOption(property);
      setIsSortName(true);
    } else if (property === "DESCName") {
      setSortOption(property);
      setIsSortName(false);
    }
    // console.log(property);
  }, []);

  const handleTakeIsRefesh = useCallback((value) => {
    setIsRefesh(value);
  }, []);

  const handleSubmitDelete = (idUser) => {
    confirmAlert({
      title: "Bạn có chắc muốn xóa chứ",
      message: "Thực hiện chức năng xóa quản trị",
      buttons: [
        {
          label: "Xóa",
          onClick: async () => {
            const id = toast.loading("Vui lòng chờ...");
            try {
              await axios.delete(`/manage/delete/${idUser}`);
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
  return (
    <>
      <h2>Danh sách Admin</h2>
      <div className="row">
        <div className="col-lg-9">
          <TableContainer id="table-container">
            {loading ? (
              <div className="mt-4 mb-4 d-flex justify-content-center">
                <l-bouncy size="60" speed="0.75" color="black"></l-bouncy>
              </div>
            ) : listUserAdmins.length === 0 && debounceSearch === "" ? (
              <>
                <hr />
                <h1 className="text-center">Dữ liệu người dùng rỗng.</h1>
              </>
            ) : listUserAdmins.length === 0 && debounceSearch !== "" ? (
              <>
                <hr />
                <h1 className="text-center">Thông tin bạn tìm không tồn tại</h1>
              </>
            ) : (
              <TableUserAdmins
                data={listUserAdmins}
                isSortName={isSortName}
                valueSort={handleSortOption}
                isRefeshData={handleTakeIsRefesh}
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
        </div>
        <div className="col-lg-3">
          <ToolbarListUserAdmins
            search={search}
            setSearch={setSeach}
            SelectItem={handleSelectedItem}
            isRefeshData={handleTakeIsRefesh}
          />
        </div>
      </div>
    </>
  );
};

export default ListUserAdmins;
