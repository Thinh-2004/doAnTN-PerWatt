import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AdjustIcon from "@mui/icons-material/Adjust";
import { useState } from "react";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const ToolBar = ({ isAscending, isSortOption, valueSort }) => {
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
      <div className="position-relative" style={{ width: "50%" }}>
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

        {/* <Button
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
        </Button> */}

        <FormControl size="small" sx={{ width: "30%", margin: "4px" }}>
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

export default ToolBar;
