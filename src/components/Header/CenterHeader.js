import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useMatch } from "react-router-dom";
import Audio from "./VoiceSearhDialog/Audio";
import * as tmImage from "@teachablemachine/image";
import { toast } from "react-toastify";

const CenterHeader = ({ textSearch, resetSearch }) => {
  //AI tìm hình ảnh
  const URL = "https://teachablemachine.withgoogle.com/models/h47wTQkV-/";
  const [model, setModel] = useState(null);
  const matchFindMoreProduct = useMatch("/findMoreProduct/:name"); //Kiểm tra đường dẫn có chứa tham số động
  const matchProductPerMall = useMatch("/product/PerMall"); //Kiểm tra đường dẫn có chứa tham số động
  const [open, setOpen] = useState(false); // mở dialog của tìm bằng hình ảnh

  // const [maxPredictions, setMaxPredictions] = useState(0);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isRecording, setIsRecording] = useState(false); // Tham chiếu đến Audio component ngắt ghi âm
  const recognitionRef = useRef(null);
  //
  const [openVoice, setOpenVoice] = useState(false);

  const [search, setSearch] = useState("");

  //AI train hình ảnh
  useEffect(() => {
    const loadModel = async () => {
      if (!model) {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        // setMaxPredictions(loadedModel.getTotalClasses());
        // console.log(maxPredictions);
      }
    };

    loadModel();
  }, [model]);

  useEffect(() => {
    if (resetSearch) {
      setSearch(""); // Xóa nội dung thanh tìm kiếm
    }
  }, [resetSearch]);

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
      setSearch(maxPrediction.className);
      setOpen(false);
      setImage(null); //đặt lại hình ảnh khi thoát khỏi tìm kiếm
    } else {
      toast.warning(
        "Rất tiếc hình ảnh của bạn cần tìm không có trong sàn chúng tôi."
      );
    }
  };

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
    textSearch(e.target.value);
    setSearch(e.target.value);
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
      textSearch(transcript);
      setSearch(transcript);
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

  return (
    <>
      {(window.location.pathname === "/" || matchProductPerMall) && (
        <div className="row">
          <div className="col-lg-2 col-md-2 col-sm-2 d-flex">
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
              className="me-2"
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
                      <label htmlFor="" className="align-content-center fs-2">
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
          <div className="col-lg-10 col-md-10 col-sm-10 align-content-center">
            <form className="d-flex w-100" role="search">
              <TextField
                id="outlined-search"
                label="Tìm kiếm"
                type="search"
                placeholder="Bạn cần tìm gì?"
                value={search}
                onChange={handleTextSearch}
                className="w-100"
                size="small"
              />
            </form>
          </div>
        </div>
      )}
      {matchFindMoreProduct && (
        <div className="flex-grow-1">
          <div
            className="fs-5"
            style={{
              color: "text.titleHeader",
            }}
          >
            Trang tìm kiếm sản phẩm có liên quan
          </div>
        </div>
      )}
    </>
  );
};

export default CenterHeader;
