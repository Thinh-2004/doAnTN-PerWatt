import React, { useEffect, useState } from "react";
import "./Banner.css";
import axios from "axios";

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [midIndex, setMidIndex] = useState(0);

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
    const midBanners = activeBanners.filter(banner => banner.position === "MID");

    useEffect(() => {
        const midInterval = setInterval(() => {
            setMidIndex(prevIndex => (prevIndex + 1) % midBanners.length);
        }, 3000);

        return () => {
            clearInterval(midInterval);
        };
    }, [midBanners.length]);

    return (
        <div className="banner-container">
            <div className="mid-banners">
                {midBanners.length > 0 && (
                    <a 
                        href={`http://localhost:3000/findMoreProduct/${encodeURIComponent(midBanners[midIndex].bannername)}`} // Sử dụng thẻ <a>
                        className="banner" // Thêm class nếu cần
                    >
                        <img 
                            src={`http://localhost:8080/files/banner/${midBanners[midIndex].user.id}/${midBanners[midIndex].img}`} 
                            alt={midBanners[midIndex].bannername} 
                        />
                        <p>{midBanners[midIndex].bannername}</p>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Banner;
