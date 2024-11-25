import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import axios from "../../../../Localhost/Custumize-axios";
import { useState } from "react";

const ListImageDetailProduct = ({ dataImage, totalQuantity }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const itemsPerPage = 4;
  const [open, setOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const delay = 400; // Độ trễ 3 giây

  const handleSelectImage = (index) => {
    setSelectedImage(index);
    setCurrentPage(Math.floor(index / itemsPerPage));
  };

  const [popUpImage, setPopUpImage] = useState(null);
  const handleClickOpen = (image) => {
    setPopUpImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const geturlIMG = (productId, filename) => {
  //   return `${axios.defaults.baseURL}files/product-images/${productId}/${filename}`;
  // };

  const handleNextImage = () => {
    if (isDisabled) return; // Nếu đang trong thời gian chờ, không làm gì cả
    setIsDisabled(true); // Vô hiệu hóa nút
    handleSelectImage((selectedImage + 1) % (dataImage?.images?.length || 1));

    setTimeout(() => {
      setIsDisabled(false); // Bật lại nút sau 3 giây
    }, delay);
  };

  const handlePrevImage = () => {
    if (isDisabled) return; // Nếu đang trong thời gian chờ, không làm gì cả
    setIsDisabled(true); // Vô hiệu hóa nút
    handleSelectImage(
      (selectedImage - 1 + (dataImage?.images?.length || 1)) %
        (dataImage?.images?.length || 1)
    );

    setTimeout(() => {
      setIsDisabled(false); // Bật lại nút sau 3 giây
    }, delay);
  };
  return (
    <>
      <div
        id="carouselExampleDark"
        className="carousel slide position-relative "
      >
        <div
          className="position-absolute top-50 start-50 translate-middle rounded-3"
          id="text-sold-out"
          style={{
            display: totalQuantity === 0 ? "inline" : "none",
          }}
        >
          <span className="text-white ">Hết hàng</span>
        </div>

        <div
          className="carousel-inner align-content-center"
          style={{ height: "575px" }}
        >
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide="prev"
            onClick={handlePrevImage}
            disabled={isDisabled} // Vô hiệu hóa nút nếu isDisabled là true
          >
            <div
              style={{
                background: "rgba(0,0,0,0.5)",
                width: "80%",
                aspectRatio: "1/1",
              }}
              className="rounded-circle"
            >
              <span
                className="carousel-control-prev-icon mt-2"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </div>
          </button>
          {dataImage && dataImage.images && dataImage.images.length > 0 ? (
            dataImage.images.map((image, index) => (
              <div
                key={index}
                className={`carousel-item  ${
                  index === selectedImage ? "active" : ""
                }`}
                style={{
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                <div
                  variant="outlined"
                  onClick={() => handleClickOpen(image)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      dataImage
                        ?  image.imagename
                        : "/images/no_img.png"
                    }
                    className="d-block object-fit-cover rounded-5"
                    alt={dataImage ? dataImage.name : "No Image"}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <Dialog
                  open={open}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                  disableScrollLock={true}
                  fullWidth
                  maxWidth="xl"
                >
                  <DialogContent>
                    <img
                      src={
                        popUpImage
                          ? popUpImage.imagename
                          : ""
                      }
                      className="d-block"
                      alt={dataImage ? dataImage.name : "No Image"}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Thoát</Button>
                  </DialogActions>
                </Dialog>
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <img
                src="/images/no_img.png"
                className="d-block"
                alt=""
                style={{ width: "100%", height: "400px" }}
              />
            </div>
          )}
          <button
            className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
          onClick={handleNextImage}
          disabled={isDisabled} // Vô hiệu hóa nút nếu isDisabled là true
          >
            <div
              style={{
                background: "rgba(0,0,0,0.5)",
                width: "80%",
                aspectRatio: "1/1",
              }}
              className="rounded-circle"
            >
              <span
                className="carousel-control-next-icon mt-2"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </div>
          </button>
        </div>
      </div>
      <div className="d-flex mt-2">
        {dataImage &&
          dataImage.images &&
          dataImage.images.length > 0 &&
          dataImage.images
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((image, index) => (
              <Button
                id="btn-children-img"
                key={index}
                type="button"
                data-bs-target="#carouselExampleDark"
                data-bs-slide-to={index}
                className={`carousel-indicator-button mb-2 ${
                  index === selectedImage % itemsPerPage ? "active" : ""
                }`}
                aria-current={
                  index === selectedImage % itemsPerPage ? "true" : "false"
                }
                aria-label={`Slide ${index + 1}`}
                onClick={() =>
                  handleSelectImage(currentPage * itemsPerPage + index)
                }
              >
                <img
                  src={
                    dataImage
                      ?  image.imagename
                      : "/images/no_img.png"
                  }
                  className=" rounded-3 border"
                  alt=""
                  style={{ width: "100px", height: "100px" }}
                />
              </Button>
            ))}
      </div>
    </>
  );
};

export default ListImageDetailProduct;
