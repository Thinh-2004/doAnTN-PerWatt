import { Button } from "@mui/material";
import React, { useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AdjustIcon from "@mui/icons-material/Adjust";

const ButtonFilter = ({ isAscending, isSortOption, valueSort }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const handleButtonClick = (buttonName) => {
    if ((buttonName === "oldItems") | (buttonName === "newItems")) {
      setSelectedButton(buttonName);
      valueSort(buttonName);
    }
    if ((buttonName === "priceASC") | (buttonName === "priceDESC")) {
      setSelectedButton(buttonName);
      valueSort(buttonName);
    }

    if (buttonName === "bestSeller") {
      setSelectedButton(buttonName);
      valueSort(buttonName);
    }
  };
  return (
    <>
      <div class="position-relative">
        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          onClick={() =>
            isSortOption
              ? handleButtonClick("oldItems")
              : handleButtonClick("newItems")
          }
        >
          {isSortOption ? "Cũ nhất" : "Mới nhất"}
          {(selectedButton === "oldItems") | (selectedButton === "newItems") ? (
            <div className="position-absolute top-100 start-100 translate-middle ">
              <AdjustIcon sx={{ width: 15 }} />
            </div>
          ) : null}
        </Button>

        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          onClick={() => handleButtonClick("bestSeller")}
        >
          Bán chạy
          {selectedButton === "bestSeller" && (
            <div className="position-absolute top-100 start-100 translate-middle ">
              <AdjustIcon sx={{ width: 15 }} />
            </div>
          )}
        </Button>

        <Button
          variant="outlined"
          sx={{ margin: "4px" }}
          onClick={() =>
            isAscending
              ? handleButtonClick("priceDESC")
              : handleButtonClick("priceASC")
          }
        >
          {isAscending ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
          {isAscending ? "Giá cao đến thấp" : "Giá thấp đến cao"}
          {(selectedButton === "priceASC") |
          (selectedButton === "priceDESC") ? (
            <div className="position-absolute top-100 start-100 translate-middle ">
              <AdjustIcon sx={{ width: 15 }} />
            </div>
          ) : null}
        </Button>
      </div>
    </>
  );
};

export default ButtonFilter;
