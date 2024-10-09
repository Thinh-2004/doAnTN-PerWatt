import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField } from "@mui/material";

const ToolBarFindMore = () => {
  const [search, setSearch] = useState("");
  const handleTextSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
        <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="standard-search"
          label="Bạn cần tìm gì?"
          type="search"
          variant="standard"
          size="small"
          value={search}
          onChange={handleTextSearch}
          fullWidth
        />
      </Box>
    </div>
  );
};

export default ToolBarFindMore;
