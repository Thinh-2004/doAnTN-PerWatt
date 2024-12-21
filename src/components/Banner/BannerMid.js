import React, { useEffect, useState } from "react";
import "./BannerMid.css";
import axios from "../../Localhost/Custumize-axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [midIndex, setMidIndex] = useState(0);


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
  const midBanners = banners.filter(
    (banner) => banner.position === "MID"
  );

  useEffect(() => {
    const midInterval = setInterval(() => {
      setMidIndex((prevIndex) => (prevIndex + 1) % midBanners.length);
    }, 2500);

    return () => {
      clearInterval(midInterval);
    };
  }, [midBanners.length]);

  // Chuyển đến banner tiếp theo
  const nextBanner = () => {
    setMidIndex((prevIndex) => (prevIndex + 1) % midBanners.length);
  };

  // Quay lại banner trước
  const prevBanner = () => {
    setMidIndex(
      (prevIndex) => (prevIndex - 1 + midBanners.length) % midBanners.length
    );
  };

  return (
    <div className="banner-container rounded-4">
      <div className="mid-banners ">
        {midBanners.length > 0 && (
          <>
            <Link
              to={`/findMoreProduct/${encodeURIComponent(
                midBanners[midIndex].bannername
              )}`} // Sử dụng thẻ <Link>
              className="banner"
            >
              <img
                src={midBanners[midIndex].img}
                alt={midBanners[midIndex].bannername}
                className="rounded-4"
                style={{with : "100%", height : "700px"}}
                
              />
            </Link>

            {/* Nút "Previous" */}
            <button onClick={prevBanner} className="carousel-btn prev-btn">
              &lt; {/* Dấu mũi tên trái */}
            </button>

            {/* Nút "Next" */}
            <button onClick={nextBanner} className="carousel-btn next-btn">
              &gt; {/* Dấu mũi tên phải */}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Banner;
