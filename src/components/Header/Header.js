import React from "react";
import "./HeaderStyle.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import LeftHeader from "./LeftHeader";
import CenterHeader from "./CenterHeader";
import RightHeader from "./RightHeader";
import { Box, useTheme } from "@mui/material";

const Header = ({ contextSearch, resetSearch, reloadCartItems }) => {
  const theme = useTheme();
  const handleTextSearch = (e) => {
    contextSearch(e);
  };

  return (
    <div className="container-fluid sticky-top">
      <Box
        className="row align-items-center justify-content-between"
        sx={{
          backdropFilter: "blur(10px)",
          border:
            theme.palette.mode === "dark"
              ? ""
              : "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 4px 15px rgba(255, 255, 255, 0.5)" // Shadow trắng cho dark mode
              : "0px 4px 15px rgba(0, 0, 0, 0.2)", // Shadow đen cho light mode
        }}

      >
        <div className="col-lg-3 col-md-3 col-sm-3 d-flex justify-content-start mb-3">
          <div className="d-flex align-items-center">
            <LeftHeader />
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-6 mb-3">
          <CenterHeader
            textSearch={handleTextSearch}
            resetSearch={resetSearch}
          />
        </div>

        <div className="col-lg-3 col-md-3 col-sm-3 d-flex justify-content-end mb-3 ">
          <RightHeader reloadCartItems={reloadCartItems} />
        </div>
      </Box>
    </div>
  );
};
export default Header;
