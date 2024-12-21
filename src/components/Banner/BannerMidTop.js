import React, { useEffect, useState } from "react";
import "./BannerMid.css";
import axios from "../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [midTopIndex, setMidTopIndex] = useState(0);


  useEffect(() => {
    const fetchBanners = async () => {
      const today = dayjs().format("YYYY-MM-DD");
      try {
        const response = await axios.get("/banners");
        // Lọc danh sách banner không có enddate bằng ngày hiện tại
        const filteredBanners = response.data.filter((banner) => {
          // Giả sử `enddate` là chuỗi ngày ở định dạng "YYYY-MM-DD"
          return today >= banner.startdate && today <= banner.enddate
        });

        setBanners(filteredBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  // const getActiveBanners = () => {
  //   const today = new Date();
  //   return banners.filter((banner) => {
  //     const startDate = new Date(banner.startdate);
  //     const endDate = new Date(banner.enddate);
  //     return today >= startDate && today <= endDate;
  //   });
  // };

  // const activeBanners = getActiveBanners();
  const midTopBanners = banners.filter(
    (banner) => banner.position === "MIDTOP"
  );

  useEffect(() => {
    const botInterval = setInterval(() => {
      setMidTopIndex((prevIndex) => (prevIndex + 1) % midTopBanners.length);
    }, 3000);

    return () => {
      clearInterval(botInterval);
    };
  }, [midTopBanners.length]);

  return (
    <>
      {midTopBanners.length > 0 && (
        <Link
          to={`/findMoreProduct/${encodeURIComponent(
            midTopBanners[midTopIndex].bannername
          )}`} // Sử dụng thẻ <Link>
          className="banner" // Thêm class nếu cần
        >
          <img
            src={
              midTopBanners[midTopIndex].img
            }
            alt={midTopBanners[midTopIndex].bannername}
            style={{height : "335px"}}
          />
        </Link>
      )}
    </>
  );
};

export default Banner;
