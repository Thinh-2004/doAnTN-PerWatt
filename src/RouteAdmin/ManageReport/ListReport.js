import React, { useContext, useEffect, useState } from "react";
import TableReport from "./TableReport";
import axios from "../../Localhost/Custumize-axios";

import { dotSpinner } from "ldrs";
import { ThemeModeContext } from "../../components/ThemeMode/ThemeModeProvider";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TablePagination,
} from "@mui/material";

dotSpinner.register();

const ListReport = () => {
  const [listReport, setListReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useContext(ThemeModeContext);
  const [isLoadTable, setIsLoadTable] = useState(false);
  //State radio
  const [checkRadio, setCheckRadio] = useState("");
  //Pagination
  const [currentPage, setCurrentPage] = useState(0); //Trang hiện tại
  const [totalPage, setTotalPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  const handleCheckRadio = (e) => {
    const value = e.target.value;
    setCheckRadio(value);
    // console.log(value);
  };

  const handleRemoveCheck = () => {
    setCheckRadio("");
  };

  const loadData = async (pageNo, pageSize, keySort) => {
    try {
      setListReport([]);
      setLoading(true);
      const res = await axios.get(
        `/report/list?pageNo=${pageNo || ""}&pageSize=${
          pageSize || ""
        }&keySort=${keySort || ""}`
      );
      setListReport(res.data.reports);
      setCurrentPage(res.data.currentPage);
      setTotalItems(res.data.totalItems);
      //   console.log(res.data.reports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoadTable) {
      loadData(currentPage, totalPage, checkRadio);
    } else loadData(currentPage, totalPage, checkRadio);
  }, [isLoadTable, checkRadio, currentPage, totalPage]);

  const handleTakeReload = (value) => {
    setIsLoadTable(value);
  };

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTotalPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <div>
      <h2>Danh sách báo cáo </h2>
      <FormControl fullWidth>
        <div className="d-flex justify-content-between">
          <FormLabel id="demo-row-radio-buttons-group-label">
            Trạng thái
          </FormLabel>
          <Button
            size="small"
            color="error"
            variant="outlined"
            disabled={checkRadio ? false : true}
            onClick={handleRemoveCheck}
          >
            Bỏ chọn
          </Button>
        </div>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          className="d-flex justify-content-center"
          onChange={handleCheckRadio}
          value={checkRadio}
        >
          <FormControlLabel
            value="Chờ xử lý"
            control={<Radio size="small" />}
            label="Chờ xử lý"
          />
          <FormControlLabel
            value="Đã xử lý"
            control={<Radio size="small" />}
            label="Đã xử lý"
          />
          <FormControlLabel
            value="Từ chối xử lý"
            control={<Radio size="small" />}
            label="Từ chối xử lý"
          />
        </RadioGroup>
      </FormControl>
      {loading ? (
        <div className="d-flex justify-content-center">
          <l-dot-spinner
            size="40"
            speed="0.9"
            color={mode === "light" ? "black" : "white"}
          ></l-dot-spinner>
        </div>
      ) : listReport.length === 0 ? (
        <label className="text-center">Không có báo cáo</label>
      ) : (
        <>
          <TableReport data={listReport} isLoadTable={handleTakeReload} />
          <TablePagination
            rowsPerPageOptions={[25, 35]}
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
      )}
    </div>
  );
};

export default ListReport;
