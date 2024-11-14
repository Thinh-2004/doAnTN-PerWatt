import React, { useEffect, useState } from "react";
import "./Banner.css";
import axios from "axios";

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [topIndex, setTopIndex] = useState(0);
    const [midIndex, setMidIndex] = useState(0);
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
    const topBanners = activeBanners.filter(banner => banner.position === "TOP");
    const midBanners = activeBanners.filter(banner => banner.position === "MID");
    const botBanners = activeBanners.filter(banner => banner.position === "BOT");

    useEffect(() => {
        const topInterval = setInterval(() => {
            setTopIndex(prevIndex => (prevIndex + 1) % topBanners.length);
        }, 3000);

        const midInterval = setInterval(() => {
            setMidIndex(prevIndex => (prevIndex + 1) % midBanners.length);
        }, 3000);

        const botInterval = setInterval(() => {
            setBotIndex(prevIndex => (prevIndex + 1) % botBanners.length);
        }, 3000);

        return () => {
            clearInterval(topInterval);
            clearInterval(midInterval);
            clearInterval(botInterval);
        };
    }, [topBanners.length, midBanners.length, botBanners.length]);

    return (
        <div className="banner-container">
            <div className="left-banners">
                <div className="top-banners">
                    {topBanners.length > 0 && (
                        <div className="banner">
                            <img src={`http://localhost:8080/files/banner/${topBanners[topIndex].user.id}/${topBanners[topIndex].img}`} alt={topBanners[topIndex].bannername} />
                            <p>{topBanners[topIndex].bannername}</p>
                        </div>
                    )}
                </div>
                <div className="mid-banners">
                    {midBanners.length > 0 && (
                        <div className="banner">
                            <img src={`http://localhost:8080/files/banner/${midBanners[midIndex].user.id}/${midBanners[midIndex].img}`} alt={midBanners[midIndex].bannername} />
                            <p>{midBanners[midIndex].bannername}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="right-banners">
                <div className="bot-banners">
                    {botBanners.length > 0 && (
                        <div className="banner">
                            <img src={`http://localhost:8080/files/banner/${botBanners[botIndex].user.id}/${botBanners[botIndex].img}`} alt={botBanners[botIndex].bannername} />
                            <p>{botBanners[botIndex].bannername}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Banner;
