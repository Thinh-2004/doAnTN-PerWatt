import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ valueText }) => {
  const [searchValue, setSearchValue] = useState(() => {
    const savedSearch = localStorage.getItem("searchText");
    return savedSearch ? savedSearch : "";
  });

  const handleTextSearch = (e) => {
    const value = e.target.value;
    valueText(value);
    setSearchValue(value);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
        <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          className="mt-2"
          id="standard-search"
          label="Bạn cần tìm gì?"
          type="search"
          variant="standard"
          size="small"
          value={searchValue}
          onChange={handleTextSearch}
          fullWidth
        />
      </Box>
    </>
  );
};

export default Search;
