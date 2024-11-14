import React from "react";
import BannerMid from "../../../Banner/BannerMid";
import BannerMidTop from "../../../Banner/BannerMidTop";
import BannerMidBot from "../../../Banner/BannerMidBot";

const BannerMiddle = () => {
  return (
    <div className="row">
      <div className="col-lg-8 col-md-8 col-lg-sm-8" style={{height : "700px"}}>
      <BannerMid></BannerMid>
      </div>
      <div className="col-lg-4 col-md-4 col-lg-sm-4">
        
        <BannerMidTop></BannerMidTop>
        <BannerMidBot></BannerMidBot>
        
      </div>
    </div>
  );
};

export default BannerMiddle;