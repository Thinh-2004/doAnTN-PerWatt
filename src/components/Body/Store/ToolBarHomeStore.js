import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AdjustIcon from "@mui/icons-material/Adjust";

const ToolBarHomeStore = ({ isAscending, isSortOption, valueSort }) => {
  const [selectSortPrice, setSelectSortPrice] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectSortPrice(value);
    valueSort(value);
  };

  const [selectedButton, setSelectedButton] = useState(null);
  const handleButtonClick = (buttonName) => {
    if ((buttonName === "oldItems") | (buttonName === "newItems")) {
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
      <div className="position-relative">
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

        <FormControl size="small" sx={{ width: "45%", margin: "4px" }}>
          <InputLabel id="demo-simple-select-label">
            Sắp xếp giá theo
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectSortPrice}
            label="Sắp xếp giá theo"
            onChange={handleChange}
          >
            <MenuItem value={"priceASC"}>
              <ArrowUpwardIcon /> Giá thấp đến cao
            </MenuItem>
            <MenuItem value={"priceDESC"}>
              <ArrowDownwardIcon /> Giá cao đến thấp
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </>
  );
};

export default ToolBarHomeStore;
