import React, { useEffect, useState } from "react";
import { Pagination, Input } from "antd"; // Import Ant Design Pagination và Input
import "./PromotionalCard.css"; // Import CSS file
import axios from "../../../../../Localhost/Custumize-axios";
import { Card, CardContent } from "@mui/material";

const { Search } = Input; // Sử dụng thành phần Search của Ant Design

const PromotionalCard = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const currentDate = new Date();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("/vouchersAdmin");

        setPromotions(response.data);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchPromotions();

    const interval = setInterval(() => {
      fetchPromotions();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredPromotions = promotions
    .filter((promotion) =>
      promotion.vouchername?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((promotion) => {
      const endDate = new Date(promotion.endday); // Chuyển đổi từ LocalDate sang Date
      return currentDate < endDate;
    });

  const indexOfLastPromotion = currentPage * pageSize;
  const indexOfFirstPromotion = indexOfLastPromotion - pageSize;
  const currentPromotions = filteredPromotions.slice(
    indexOfFirstPromotion,
    indexOfLastPromotion
  );

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <Card className="">
      <CardContent>
        {" "}
        <h2>Danh Sách Khuyến Mãi</h2>
        <h1 className="title-voucher-webite">Gần giá 2024</h1>
        <div className="mb-4">
          <img
            src="https://cf.shopee.vn/file/vn-11134258-7ras8-m0sil68ehi1b66_xxhdpi"
            alt="Promotional Banner"
            className="w-full rounded-lg"
          />
          <p className="mb-2 mt-2">
            THỜI GIAN DIỄN RA: 10:00:00 02-02-2024 - 23:59:59 31-12-2024
          </p>
          <p>
            Đây là chương trình - Hỗ trợ Người bán giảm giá từ 0 đến 99% - KHÔNG
            TRỢ GIÁ. Quy định chung: - Chương trình không áp dụng cho các sản
            phẩm thay đổi nội dung và / hoặc tăng giá trước khi đăng ký & trong
            suốt thời gian tham gia chương trình.
          </p>
        </div>
        <div className="search-container mb-4">
          <Search
            placeholder="Tìm kiếm khuyến mãi..."
            onSearch={handleSearch}
            enterButton
            allowClear
            style={{ width: 230 }}
          />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Khung giờ</h2>
          <p className="">
            Chương trình có thể đăng ký: {filteredPromotions.length}
          </p>

          {currentPromotions.map((promotion, index) => {
            const endDate = new Date(promotion.endday); // Chuyển đổi từ chuỗi LocalDate sang Date
            const startDate = new Date(promotion.startday); // Chuyển đổi từ chuỗi LocalDate sang Date

            const isRegistrationOpen =
              currentDate < endDate && promotion.status === "đang hoạt động"; // Kiểm tra nếu hiện tại vẫn trong thời gian đăng ký
            const isReadyToRegister = currentDate === startDate; // Kiểm tra nếu ngày hiện tại là ngày bắt đầu
            const isAfterStartDate = currentDate > startDate; // Kiểm tra nếu ngày hiện tại đã lớn hơn ngày bắt đầu
            const daysUntilStart = Math.floor(
              (startDate - currentDate) / (1000 * 60 * 60 * 24)
            ); // Tính số ngày còn lại đến khi chương trình bắt đầu

            // Tính giờ, phút còn lại (không tính giây)
            const totalMillisecondsUntilStart = startDate - currentDate;
            const daysLeft = Math.floor(
              totalMillisecondsUntilStart / (1000 * 60 * 60 * 24)
            ); // Tính số ngày còn lại
            const hoursLeft = Math.floor(
              (totalMillisecondsUntilStart % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            ); // Tính số giờ còn lại
            const minutesLeft = Math.floor(
              (totalMillisecondsUntilStart % (1000 * 60 * 60)) / (1000 * 60)
            ); // Tính số phút còn lại

            return (
              <div
                key={index}
                className={`mb-2 p-4 rounded-lg shadow-md ${
                  isRegistrationOpen ? "bg-open" : "bg-closed"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {currentDate < startDate
                      ? "ĐĂNG KÝ ĐANG CHUẨN BỊ"
                      : currentDate >= startDate && currentDate <= endDate
                      ? "ĐĂNG KÝ ĐÃ MỞ"
                      : "ĐĂNG KÝ ĐÃ ĐÓNG"}
                  </span>
                  <span>Kết thúc lúc: {endDate.toLocaleString("vi-VN")}</span>
                </div>

                <p className="font-bold">{promotion.vouchername}</p>
                <p>
                  Khung giờ: {startDate.toLocaleString("vi-VN")} đến{" "}
                  {endDate.toLocaleString("vi-VN")}
                </p>

                {/* Hiển thị thời gian còn lại theo ngày, giờ, phút */}
                <p>
                  {isAfterStartDate
                    ? "Chương trình đã bắt đầu"
                    : `Thời gian còn lại: ${daysLeft} ngày ${hoursLeft} giờ ${minutesLeft} phút`}
                </p>

                <div className="flex justify-between mt-4">
                  <p className="text-sm mt-2">
                    Mã giảm giá: {promotion.vouchername}
                  </p>

                  {/* Kiểm tra nếu ngày hiện tại đã lớn hơn ngày bắt đầu */}
                  {isAfterStartDate ? (
                    <a href={`/Widget?idVoucherAdmin=${promotion.id}`}>
                      <button className="btn-voucher-webite btn-primary">
                        Đăng ký sản phẩm
                      </button>
                    </a>
                  ) : (
                    <button className="btn-voucher-webite btn-primary" disabled>
                      Đang chuẩn bị đăng ký
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredPromotions.length}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionalCard;
