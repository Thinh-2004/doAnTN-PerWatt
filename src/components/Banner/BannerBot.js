import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [botIndex, setBotIndex] = useState(0);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://localhost:8080/banners");
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  // Filter active banners based on startdate and enddate
  const getActiveBanners = () => {
    const today = new Date();
    return banners.filter((banner) => {
      const startDate = new Date(banner.startdate);
      const endDate = new Date(banner.enddate);
      return today >= startDate && today <= endDate;
    });
  };

  const activeBanners = getActiveBanners();
  const botBanners = activeBanners.filter(
    (banner) => banner.position === "BOT"
  );

  // Auto change active banner every 3 seconds
  useEffect(() => {
    const botInterval = setInterval(() => {
      setBotIndex((prevIndex) => (prevIndex + 1) % botBanners.length);
    }, 3000);

    return () => {
      clearInterval(botInterval);
    };
  }, [botBanners.length]);

  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-indicators">
        {botBanners.length > 0 &&
          botBanners.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide-to={index}
              className={index === botIndex ? "active" : ""}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
      </div>
      <div className="carousel-inner rounded-3">
        {botBanners.length > 0 ? (
          botBanners.map((banner, index) => (
            <div
              key={index}
              className={`carousel-item ${index === botIndex ? "active" : ""}`}
            >
              <img
                src={banner.img}
                className="d-block w-100"
                style={{ height: "610px" }}
                alt={banner.bannername}
              />
            </div>
          ))
        ) : (
          <img
            src="/images/no_img.png"
            className="d-block w-100"
            style={{ height: "610px" }}
            alt={"no images"}
          />
        )}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Banner;
