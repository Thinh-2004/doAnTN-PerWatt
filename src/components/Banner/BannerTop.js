import React, { useEffect, useState } from "react";
import "./Banner.css";
import axios from "axios";

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [topIndex, setTopIndex] = useState(0);

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

    const getActiveBanners = () => {
        const today = new Date();
        return banners.filter(banner => {
            const startDate = new Date(banner.startdate);
            const endDate = new Date(banner.enddate);
            return today >= startDate && today <= endDate;
        });
    };

    const activeBanners = getActiveBanners();
    const topBanners = activeBanners.filter(banner => banner.position === "TOP");

    useEffect(() => {
        const topInterval = setInterval(() => {
            setTopIndex(prevIndex => (prevIndex + 1) % topBanners.length);
        }, 3000);

        return () => {
            clearInterval(topInterval);
        };
    }, [topBanners.length]);

    return (
        <div className="banner-container">
            <div className="top-banners">
                {topBanners.length > 0 && (
                    <a 
                        href={`http://localhost:3000/findMoreProduct/${encodeURIComponent(topBanners[topIndex].bannername)}`} // Thay đổi href
                        className="bannerr"
                    >
                        <img 
                            src={`http://localhost:8080/files/banner/${topBanners[topIndex].user.id}/${topBanners[topIndex].img}`} 
                            alt={topBanners[topIndex].bannername} 
                        className="bannerr-image"
                        />
                    </a>
                )}
            </div>
        </div>
    );
};

export default Banner;
