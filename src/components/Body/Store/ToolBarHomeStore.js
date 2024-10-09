import { Button } from "@mui/material";
import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const ToolBarHomeStore = ({
  isAscending,
  handleSortByPrice,
  handleSortOption,
  isSortOption,
}) => {
  return (
    <>
      {isSortOption ? (
        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          onClick={handleSortOption}
        >
          Cũ nhất
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          onClick={handleSortOption}
        >
          Mới nhất
        </Button>
      )}
      <Button variant="outlined" sx={{ margin: "4px" }}>
        Bán chạy
      </Button>

      {isAscending ? (
        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          onClick={handleSortByPrice}
        >
          <ArrowUpwardIcon /> Giá tăng dần
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          onClick={handleSortByPrice}
        >
          <ArrowDownwardIcon /> Giá giảm dần
        </Button>
      )}
    </>
  );
};

export default ToolBarHomeStore;
