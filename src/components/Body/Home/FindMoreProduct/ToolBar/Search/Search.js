import { Box, TextField } from '@mui/material';
import React from 'react';
import SearchIcon from "@mui/icons-material/Search";

const Search = ({search, handleTextSearch}) => {
    return (
        <>
          <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
          className='mt-2'
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
        </>
    );
};

export default Search;