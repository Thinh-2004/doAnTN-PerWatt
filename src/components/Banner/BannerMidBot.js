import React, { useEffect, useState } from "react";
import "./BannerMid.css";
import axios from "../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [midBotIndex, setMidBotIndex] = useState(0);

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
  const midBotBanners = banners.filter(
    (banner) => banner.position === "MIDBOT"
  );

  useEffect(() => {
    const botInterval = setInterval(() => {
      setMidBotIndex((prevIndex) => (prevIndex + 1) % midBotBanners.length);
    }, 3000);

    return () => {
      clearInterval(botInterval);
    };
  }, [midBotBanners.length]);

  return (
    <>
      {midBotBanners.length > 0 && (
        <Link
          to={`/findMoreProduct/${encodeURIComponent(
            midBotBanners[midBotIndex].bannername
          )}`} // Sử dụng thẻ <Link>
          className="banner" // Thêm class nếu cần
        >
          <img
            src={midBotBanners[midBotIndex].img}
            alt={midBotBanners[midBotIndex].bannername}
            style={{ height: "335px" }}
          />
        </Link>
      )}
    </>
  );
};

export default Banner;
