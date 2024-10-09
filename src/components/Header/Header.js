import React, { useEffect, useRef, useState } from "react";
import "./HeaderStyle.css";
import { Link, useMatch, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from "../../Localhost/Custumize-axios";
import * as tmImage from "@teachablemachine/image";
import { Button, styled } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Audio from "./VoiceSearhDialog/Audio";

const Header = ({ contextSearch, resetSearch, reloadCartItems }) => {
  const match = useMatch("/findMoreProduct/:name"); //Kiểm tra đường dẫn có chứa tham số động
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const changeLink = useNavigate();
  const [open, setOpen] = useState(false); // mở dialog của tìm bằng hình ảnh
  //AI tìm hình ảnh
  const URL = "https://teachablemachine.withgoogle.com/models/h47wTQkV-/";
  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isRecording, setIsRecording] = useState(false); // Tham chiếu đến Audio component ngắt ghi âm
  const recognitionRef = useRef(null);
  //
  const [openVoice, setOpenVoice] = useState(false);
  const geturlIMG = (idUser, filename) => {
    return `${axios.defaults.baseURL}files/user/${idUser}/${filename}`;
  };
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  useEffect(() => {
    const count = async () => {
      try {
        if (user) {
          const res = await axios.get(`/countCartIdUser/${user.id}`);
          setCount(res.data.length);
          // console.log(res.data.length);
        } else {
          console.log("Chưa có sản phẩm");
          setCount(0);
        }
      } catch (error) {
        console.log(error);
      }
    };
    count();
  }, [user]);

  useEffect(() => {
    if (resetSearch) {
      setSearch(""); // Xóa nội dung thanh tìm kiếm
    }
  }, [resetSearch]);

  useEffect(() => {
    if (reloadCartItems) {
      const count = async () => {
        try {
          if (user) {
            const res = await axios.get(`/countCartIdUser/${user.id}`);
            setCount(res.data.length);
            // console.log(res.data.length);
          } else {
            console.log("Chưa có sản phẩm");
          }
        } catch (error) {
          console.log(error);
        }
      };
      count();
    }
  }, [reloadCartItems, user]);

  const handleLogOut = () => {
    confirmAlert({
      title: "Đăng xuất tài khoản",
      message: "Bạn chắc chắn muốn đăng xuất?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            const toastId = toast.loading("Vui lòng chờ...");
            try {
              setTimeout(() => {
                toast.update(toastId, {
                  render: "Đăng xuất thành công",
                  type: "success",
                  isLoading: false,
                  autoClose: 5000,
                  closeButton: true,
                });
                //Xóa session khỏi website
                localStorage.clear();
                sessionStorage.clear();
                changeLink("/"); // Chuyển hướng về trang chủ
              }, 500);
            } catch (error) {
              toast.update(toastId, {
                render: "Đăng xuất thất bại",
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeButton: true,
              });
            }
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  //Ghi âm
  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();

    recognition.lang = "vi-VN";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSearch(transcript);
      contextSearch(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
    recognitionRef.current = recognition;
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.onend = () => {
        setIsRecording(false); // Cập nhật trạng thái khi ghi âm dừng
      };
      recognitionRef.current.onerror = (error) => {
        console.error("SpeechRecognition error:", error);
        setIsRecording(false);
      };
    } else {
      setIsRecording(false);
    }
  };

  const handleClickOpenVoice = () => {
    setOpenVoice(true);
  };

  const handleCloseVoice = () => {
    stopRecording(); // Dừng ghi âm
    setOpenVoice(false); // Đóng dialog
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    handleVoiceSearch();
    setIsRecording(true);
  };

  //Nhập nội dung tìm kiếm
  const handleTextSearch = (e) => {
    setSearch(e.target.value);
    contextSearch(e.target.value);
  };

  const CallAPICheckUserId = async (id) => {
    try {
      const res = await axios.get(`store/checkIdUser/${id}`);
      return res.data.exists; // Lấy giá trị exists từ phản hồi
    } catch (error) {
      console.log("Error ", error);
      return false;
    }
  };

  const checkUserId = async (e) => {
    // Ngăn chặn hành động mặc định của liên kết
    e.preventDefault();

    // Kiểm tra nếu id là null hoặc undefined
    if (user === null || user === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Hãy đăng nhập để có trải nghiệm tuyệt vời hơn",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              // Hiển thị thông báo đang tải
              const id = toast.loading("Vui lòng chờ...");
              setTimeout(() => {
                toast.update(id, {
                  render: "Chuyển hướng đến trang đăng nhập",
                  type: "info",
                  isLoading: false,
                  autoClose: 2000,
                  closeButton: true,
                });
                changeLink("/login");
              }, 500);
            },
          },
          {
            label: "Không",
          },
        ],
      });
    } else {
      // Nếu id tồn tại, kiểm tra với API
      const check = await CallAPICheckUserId(user.id);
      if (check) {
        // Nếu id tồn tại trong cửa hàng
        changeLink("/profileMarket");
      } else {
        // Chưa tồn tại
        changeLink("/market");
      }
    }
  };
  const checkUserIdOnCart = async (e) => {
    // Ngăn chặn hành động mặc định của liên kết
    e.preventDefault();

    // Kiểm tra nếu id là null hoặc undefined
    if (user === null || user === undefined) {
      confirmAlert({
        title: "Bạn đã đăng nhập chưa?",
        message: "Bạn cần đăng nhập để vào giỏ hàng của mình",
        buttons: [
          {
            label: "Có",
            onClick: () => {
              // Hiển thị thông báo đang tải
              const id = toast.loading("Vui lòng chờ...");
              setTimeout(() => {
                toast.update(id, {
                  render: "Chuyển hướng đến trang đăng nhập",
                  type: "info",
                  isLoading: false,
                  autoClose: 2000,
                  closeButton: true,
                });
                changeLink("/login");
              }, 500);
            },
          },
          {
            label: "Không",
          },
        ],
      });
    } else {
      changeLink("/cart");
    }
  };

  //AI train hình ảnh
  useEffect(() => {
    const loadModel = async () => {
      if (!model) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        setMaxPredictions(loadedModel.getTotalClasses());
        // console.log(maxPredictions);
      }
    };

    loadModel();
  }, [model]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const predict = () => {
    //setSearch(maxPrediction.className);
    if (maxPrediction.probability.toFixed(2) >= 0.5) {
      contextSearch(maxPrediction.className);
      setOpen(false);
      setImage(null); //đặt lại hình ảnh khi thoát khỏi tìm kiếm
    } else {
      toast.warning(
        "Rất tiếc hình ảnh của bạn cần tìm không có trong sàn chúng tôi."
      );
    }
  };
  useEffect(() => {
    if (model && image) {
      const imgElement = document.createElement("img");
      imgElement.src = image;
      imgElement.onload = async () => {
        const prediction = await model.predict(imgElement);
        setPredictions(prediction);
      };
    }
  }, [model, image]);

  //Lọc ra so sánh cao nhất của AI
  const getMaxPrediction = () => {
    if (predictions.length === 0) return null;

    return predictions.reduce((maxPred, pred) =>
      pred.probability > maxPred.probability ? pred : maxPred
    );
  };
  const maxPrediction = getMaxPrediction();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImage(null); //đặt lại hình ảnh khi thoát khỏi tìm kiếm
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div className=" container-fluid sticky-top">
      <div
        className="row align-items-center justify-content-between shadow "
        id="nav"
      >
        <div className="col-auto">
          <Link to={"/"}>
            <img src="/images/logoWeb.png" alt="" className="" id="img-logo" />
          </Link>
        </div>
        {window.location.pathname === "/" && (
          <div className="col-auto flex-grow-1">
            <form className="d-flex" role="search">
              <input
                className="form-control rounded-start-4 me-3"
                type="search"
                placeholder="Bạn cần tìm gì"
                aria-label="Search"
                style={{ width: "auto" }}
                value={search}
                onChange={handleTextSearch}
              />
              <div>
                <Button
                  variant="outlined"
                  onClick={handleClickOpenVoice}
                  className="me-2"
                >
                  <i className="bi bi-mic"></i>
                </Button>
                <Dialog
                  open={openVoice}
                  onClose={handleCloseVoice}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  disableScrollLock={true} //Ngăn chặn mất thanh cuộn
                  fullWidth
                >
                  <DialogContent>
                    <div id="alert-dialog-description" className="text-center">
                      <div className="d-flex justify-content-center align-content-center">
                        <Audio checkRecording={isRecording} />
                      </div>
                      <label htmlFor="" className="fs-4">
                        {search ? search : ""}
                      </label>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseVoice}>Dừng ghi âm</Button>
                    <Button onClick={handleStartRecording}>Ghi âm</Button>
                  </DialogActions>
                </Dialog>

                <Button
                  variant="outlined"
                  onClick={handleClickOpen}
                  className="rounded-end-4"
                >
                  <i className="bi bi-images"></i>
                </Button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  disableScrollLock={true} //Ngăn chặn mất thanh cuộn
                  fullWidth
                >
                  <DialogTitle id="alert-dialog-title" className="text-center">
                    Chọn hình ảnh cần tìm
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <div
                        id="find-product-bg-img"
                        className="d-flex justify-content-center align-content-center"
                      >
                        {image && image !== null ? (
                          <img
                            src={image}
                            alt="Uploaded"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        ) : (
                          <label
                            htmlFor=""
                            className="align-content-center fs-2"
                          >
                            Bạn cần tìm sản phẩm gì?
                          </label>
                        )}
                      </div>
                      {predictions.map((fill) => (
                        <div>
                          <label htmlFor="">
                            {fill.className} : {fill.probability.toFixed(2)}
                          </label>
                        </div>
                      ))}
                      <div className="mt-3">
                        <Button
                          component="label"
                          variant="contained"
                          tabIndex={-1}
                          fullWidth
                        >
                          <i className="bi bi-images"></i>
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </Button>
                      </div>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={predict} disabled={!image}>
                      Tìm kiếm
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </form>
          </div>
        )}
        {match && (
          <div className="col-auto flex-grow-1">
            <div
              className="fs-5"
              style={{
                color: "#001F3F",
              }}
            >
              Trang tìm kiếm sản phẩm có liên quan
            </div>
          </div>
        )}

        <div className="col-auto">
          <div className="d-flex align-content-center m-3">
            <Link
              type="button"
              className="btn btn-icon position-relative rounded-4"
              onClick={checkUserIdOnCart}
            >
              <i className="bi bi-cart4 fs-4"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {count}
              </span>
            </Link>
            <Link
              onClick={checkUserId}
              type="button"
              className="btn btn-icon btn-sm mx-3 rounded-4"
            >
              <i className="bi bi-shop fs-4"></i>
            </Link>
            <Link type="button" className="btn btn-icon btn-sm rounded-4 me-3">
              <i className="bi bi-bell fs-4"></i>
            </Link>
            {user !== null ? (
              <div className="d-flex justify-content-center align-items-center mt-2 ">
                <div className="dropdown">
                  <button
                    className="p-1 btn btn-lg d-flex p-0 align-items-center dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    id="btn-sessionUser"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={geturlIMG(user.id, user.avatar)}
                      alt=""
                      className="rounded-circle img-fluid"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <span className="ms-2">{user.fullname}</span>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to={"/user"}>
                        Hồ sơ của tôi
                      </Link>
                    </li>
                    <li>
                      <hr className="p-0 m-2" />
                    </li>
                    <li>
                      <Link
                        className="dropdown-item text-danger"
                        onClick={handleLogOut}
                      >
                        Đăng xuất
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <Link
                  type="button"
                  className="btn btn-register btn-sm me-3"
                  to={"/login"}
                  style={{ width: "90px", height: "30px" }}
                >
                  Đăng ký
                </Link>
                <Link
                  type="button"
                  className="btn btn-login btn-sm"
                  to={"/login"}
                  style={{ width: "95px", height: "30px" }}
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
