import React, { useEffect, useState } from "react";
import "./Banner.css";
import axios from "axios";

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [botIndex, setBotIndex] = useState(0);

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
    const botBanners = activeBanners.filter(banner => banner.position === "BOT");

    useEffect(() => {
        const botInterval = setInterval(() => {
            setBotIndex(prevIndex => (prevIndex + 1) % botBanners.length);
        }, 3000);

        return () => {
            clearInterval(botInterval);
        };
    }, [botBanners.length]);

    return (
        <div className="banner-container">
            <div className="bot-banners">
                {botBanners.length > 0 && (
                    <a 
                        href={`http://localhost:3000/findMoreProduct/${encodeURIComponent(botBanners[botIndex].bannername)}`} // Sử dụng thẻ <a>
                        className="banner" // Thêm class nếu cần
                    >
                        <img 
                            src={`http://localhost:8080/files/banner/${botBanners[botIndex].user.id}/${botBanners[botIndex].img}`} 
                            alt={botBanners[botIndex].bannername} 
                        />
                        <p>{botBanners[botIndex].bannername}</p>
                    </a>
                )}
            </div>
        </div>
    );
};

export default Banner;
