import React, { useEffect, useState } from "react";
import "./Banner.css";
import axios from "../../Localhost/Custumize-axios";
import dayjs from "dayjs";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [topIndex, setTopIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const today = dayjs().format("YYYY-MM-DD");
      try {
        const response = await axios.get("/banners");
        // Lọc danh sách banner không có enddate bằng ngày hiện tại
        const filteredBanners = response.data.filter((banner) => {
          // Giả sử `enddate` là chuỗi ngày ở định dạng "YYYY-MM-DD"
          return banner.enddate !== today;
        });

        setBanners(filteredBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const getActiveBanners = () => {
    const today = new Date();
    return banners.filter((banner) => {
      const startDate = new Date(banner.startdate);
      const endDate = new Date(banner.enddate);
      return today >= startDate && today <= endDate;
    });
  };

  const activeBanners = getActiveBanners();
  const topBanners = activeBanners.filter(
    (banner) => banner.position === "TOP"
  );

  useEffect(() => {
    const topInterval = setInterval(() => {
      setTopIndex((prevIndex) => (prevIndex + 1) % topBanners.length);
    }, 3000);

    return () => {
      clearInterval(topInterval);
    };
  }, [topBanners.length]);

  return (
    <>
      {topBanners.length > 0 && (
        <div
          // href={`http://localhost:3000/findMoreProduct/${encodeURIComponent(
          //   topBanners[topIndex].bannername
          // )}`} // Thay đổi href
          className="rounded-4 w-100 h-100"
        >
          <img
            src={topBanners[topIndex].img}
            alt={topBanners[topIndex].bannername}
            className="bannerr-image rounded-4 "
            style={{
              width: "100%",
              height: "600px",
            }}
          />
        </div>
      )}
    </>
  );
};

export default Banner;
