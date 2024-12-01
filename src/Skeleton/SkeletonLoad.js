import { Box, Skeleton, Grid } from "@mui/material";
import React from "react";

const SkeletonLoad = () => {
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(8)).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Box sx={{ width: "100%", height: "100%", marginRight: 0.5, my: 5 }}>
            <Skeleton variant="rectangular" width="100%" height={150} />
            <Skeleton />
            <Skeleton width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonLoad;
