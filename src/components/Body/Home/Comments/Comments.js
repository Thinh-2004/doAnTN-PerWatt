import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "../../../../Localhost/Custumize-axios";
import Stars from "./Stars";
import { Link } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ThemeModeContext } from "../../../ThemeMode/ThemeModeProvider";
import { toast } from "react-toastify";

const Comments = ({ FillDetailPr }) => {
  // State cho ô comment
  const [comment, setComment] = useState("");
  // State cho danh sách các comment của sản phẩm
  const [comments, setComments] = useState([]);
  // State cho ô phản hồi
  const [replyComment, setReplyComment] = useState("");
  // State để lưu id comment được phải hồi
  const [replyCommentId, setReplyCommentId] = useState(null);
  // State để lưu khi người dùng chỉnh sửa comment
  const [updateComment, setUpdateComment] = useState("");
  // State để lưu id comment được chỉnh sửa
  const [updateCommentId, setUpdateCommentId] = useState(null);
  // State để lưu tổng số comment
  const [totalComment, setTotalComment] = useState(null);
  // State để lưu rating, mặc định là 5 sao
  const [rating, setRating] = useState(5);

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const idStore = localStorage.getItem("idStore");
  const idProduct = FillDetailPr?.id;
  const { mode } = useContext(ThemeModeContext);

  // Các hàm cập nhật trạng thái
  const handleChangeComment = (event) => {
    setComment(event.target.value);
  };
  const handleChangeReplyComment = (event) => {
    setReplyComment(event.target.value);
  };
  const handleChangeRating = (rating) => {
    setRating(rating);
  };
  const handleChangeReplyCommentId = (id) => {
    setReplyCommentId(id);
  };

  const handleChangeContentUdateComment = (event) => {
    setUpdateComment(event.target.value);
  };

  // Các hàm load dữ liệu
  const loadReplies = async (commentId) => {
    try {
      const res = await axios.get("/comment/reply", {
        params: { commentId: commentId },
      });
      return res.data; // Trả về dữ liệu thực tế của replies
    } catch (err) {
      console.log(err);
      return []; // Trả về mảng trống nếu có lỗi
    }
  };

  const loadComments = async (page = 1, limit = 5, sort = "newest") => {
    try {
      const res = await axios.get("/comment/list", {
        params: { productId: idProduct, page, limit, sort },
      });

      const commentsRes = res.data;

      const commentsData = await Promise.all(
        commentsRes.map(async (comment) => {
          const replies = await loadReplies(comment.id);
          return {
            ...comment,
            replies,
          };
        })
      );

      setComments(commentsData);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalComment = async (productId) => {
    axios
      .get("/comment/count", {
        params: {
          productId: productId,
        },
      })
      .then((res) => {
        setTotalComment(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (FillDetailPr) {
      loadComments();
      loadTotalComment(FillDetailPr.id);
    }
  }, [FillDetailPr]);

  // Các hàm gọi API
  const addComment = async () => {
    var commentData = {
      productId: FillDetailPr.id,
      content: comment,
      userId: user.id,
      storeId: FillDetailPr.store.id,
      commentDate: new Date().toISOString().replace("Z", ""),
      rating: rating,
    };
    // console.log(commentData);
    setComment("");
    axios
      .post("/comment", commentData)
      .then((res) => {
        loadComments();
        loadTotalComment(FillDetailPr.id);
      })
      .catch((err) => console.log(err));
  };

  const addReplyComment = async (replyId) => {
    var commentData = {
      productId: FillDetailPr.id,
      content: replyComment,
      userId: user.id,
      storeId: FillDetailPr.store.id,
      commentDate: new Date().toISOString().replace("Z", ""),
      replyId: replyId,
    };
    setComment("");
    axios
      .post("/comment", commentData)
      .then((res) => {
        loadComments();
        loadTotalComment(FillDetailPr.id);
        setReplyComment("");
        setReplyCommentId(null);
      })
      .catch((err) => console.log(err));
  };

  const updateCommentSendAPI = (comment, replyId = null) => {
    var commentData = {
      id: comment.id,
      productId: comment.product.id,
      content: updateComment,
      userId: comment.user.id,
      storeId: comment.store.id,
      commentDate: new Date().toISOString().slice(0, 19),
      rating: rating,
      replyId: replyId,
    };
    axios
      .put("/comment", commentData)
      .then((res) => {
        loadComments();
        loadTotalComment(comment.product.id);
        setUpdateCommentId(null);
      })
      .catch((err) => console.log(err));
  };

  const deleteComment = async (commentId, productid) => {
    axios
      .delete(`/comment/${commentId}`)
      .then((res) => {
        loadComments();
        loadTotalComment(productid);
      })
      .catch((err) => console.log(err));
  };

  // Hàm chọn comment chỉnh sửa
  const handleChangeUpdateComment = (id, content, currentRating) => {
    setUpdateCommentId(id);
    setUpdateComment(content);
    setRating(currentRating); // Set lại số sao hiện tại
  };
  // Hàm kiểm tra comment chỉnh sửa
  const checkIsUpdateComment = (commentId) => {
    return commentId === updateCommentId;
  };
  // Hàm kiểm tra comment nào của người dùng
  const isUserComment = (id) => {
    if (user == null) {
      return false;
    } else if (user.id !== id) {
      return false;
    } else {
      return true;
    }
  };
  // Hàm kiểm tra comment được phản hồi
  const isReplyComment = (id) => {
    return replyCommentId === id;
  };

  // Hàm sinh thời gian comment
  const getRelativeTime = (sentDate) => {
    const now = new Date();
    const sentDateObj = new Date(sentDate);
    const utcDate = new Date(sentDateObj.getTime() + 7 * 60 * 60 * 1000);
    const diffInMs = now - utcDate;
    const diffInSec = Math.floor(diffInMs / 1000);
    const diffInMin = Math.floor(diffInSec / 60);
    const diffInHour = Math.floor(diffInMin / 60);
    const diffInDay = Math.floor(diffInHour / 24);
    const diffInWeek = Math.floor(diffInDay / 7);

    if (diffInSec < 60) {
      return "Vừa xong";
    } else if (diffInMin < 60) {
      return `${diffInMin} phút trước`;
    } else if (diffInHour < 24) {
      return `${diffInHour} giờ trước`;
    } else if (diffInDay < 7) {
      return `${diffInDay} ngày trước`;
    } else if (diffInWeek < 4) {
      return `${diffInWeek} tuần trước`;
    } else {
      return new Date(sentDate).toLocaleDateString("vi-VN");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(5);
  const [sortOption, setSortOption] = useState("newest"); // or 'oldest'

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    loadComments(pageNumber, commentsPerPage, sortOption);
  };

  const handleCommentsPerPageChange = (event) => {
    setCommentsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing comments per page
    loadComments(1, event.target.value, sortOption);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1); // Reset to first page when changing sort option
    loadComments(1, commentsPerPage, event.target.value);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalComment / commentsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Trang đầu
        i === totalPages || // Trang cuối
        (i >= currentPage - 1 && i <= currentPage + 1) // Các trang gần trang hiện tại
      ) {
        pageNumbers.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      className="row rounded-4 mt-3 mb-3"
      sx={{ backgroundColor: "backgroundElement.children" }}
    >
      <div className="p-3">
        <h4>Đánh giá sản phẩm</h4>
        <span className="p-0 m-0">
          {/* Ô comment */}
          <Box
            sx={{ backgroundColor: "background.default" }}
            className="rounded-4 p-4 stack"
          >
            <textarea
              value={comment}
              onChange={handleChangeComment}
              placeholder="Viết bình luận..."
              className="focus-visible-none border border-0 bg-transparent w-100 "
              style={{
                height: "120px",
                resize: "none",
                color: mode === "light" ? "black" : "white",
              }}
            ></textarea>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Stars
                  iconSize={25}
                  defaultRating={rating}
                  onRatingChange={handleChangeRating}
                />
              </div>

              <Button
                className="btn h-25 rounded-3 mt-3"
                disableElevation
                id="btn-add-card"
                style={{ width: "100px" }}
                onClick={addComment}
                disabled={comment.trim().length === 0 || !user ? true : false}
              >
                Gửi
              </Button>
            </div>
          </Box>
          <hr />
          <div className="w-100">
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <div className="fs-5">Bình luận</div>
                <div className="rounded-pill ms-3 px-3 py-1 text-light total-comment">
                  {totalComment || 0}
                </div>
              </div>
              <div className="d-flex">
                <select onChange={handleSortOptionChange} value={sortOption}>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
                <select
                  onChange={handleCommentsPerPageChange}
                  value={commentsPerPage}
                >
                  <option value={5}>5 bình luận/trang</option>
                  <option value={10}>10 bình luận/trang</option>
                  <option value={20}>20 bình luận/trang</option>
                </select>
              </div>
            </div>
            {/* Hiển thị các comment */}
            <div className="w-100">
              {comments.map((item) => {
                const feedback =
                  FillDetailPr &&
                  parseInt(FillDetailPr?.store?.id) === parseInt(idStore);
                return (
                  <div key={item.id}>
                    <div className="d-flex w-100 mt-4">
                      <div
                        className="d-flex justify-content-around"
                        style={{ width: "10%" }}
                      >
                        <img
                          className="rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          alt=""
                          src={item.user.avatar}
                        />
                      </div>
                      <div className="stack" style={{ width: "85%" }}>
                        <div className="stack">
                          <div className="fw-bold">{item.user.fullname}</div>
                          <Stars
                            iconSize={25}
                            defaultRating={item.rating}
                            readOnly={true}
                          />
                          <textarea
                            disabled={!checkIsUpdateComment(item.id)}
                            onChange={(e) =>
                              checkIsUpdateComment(item.id) &&
                              handleChangeContentUdateComment(e)
                            }
                            value={
                              !checkIsUpdateComment(item.id)
                                ? item.content
                                : updateComment
                            }
                            className={`my-2 rounded bg-transparent w-100 ${
                              !checkIsUpdateComment(item.id)
                                ? "focus-visible-none"
                                : ""
                            }`}
                            style={{
                              resize: "none",
                              minHeight: "40px",
                              color: mode === "light" ? "black" : "white",
                            }}
                          >
                            Sản phẩm này rất tuyệt vời
                          </textarea>
                          {checkIsUpdateComment(item.id) && (
                            <Stars
                              count={5}
                              defaultRating={item.rating} // Sử dụng state rating hiện tại
                              color="yellow"
                              onRatingChange={(newRating) =>
                                setRating(newRating)
                              } // Cập nhật số sao
                            />
                          )}

                          {checkIsUpdateComment(item.id) && (
                            <div className="d-flex justify-content-end">
                              <Button
                                className="btn px-2 py-1 rounded-3"
                                disableElevation
                                id="btn-add-card"
                                onClick={() => updateCommentSendAPI(item)}
                                disabled={
                                  item.content.trim().length === 0
                                    ? true
                                    : false
                                }
                              >
                                Gửi
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="text-body-tertiary d-flex">
                          <Typography
                            variant="span"
                            sx={{ color: "text.secondary" }}
                          >
                            {getRelativeTime(item.commentdate)}
                          </Typography>
                          {feedback ? (
                            <Typography
                              className="ms-3 text-underline-hover"
                              onClick={() =>
                                handleChangeReplyCommentId(item.id)
                              }
                              variant="span"
                              sx={{ color: "text.secondary" }}
                            >
                              Phản hồi
                            </Typography>
                          ) : null}
                        </div>
                      </div>
                      {isUserComment(item.user.id) && (
                        <div
                          className="text-center mt-3"
                          style={{ width: "5%" }}
                        >
                          <div>
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={handleClick}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              MenuListProps={{
                                "aria-labelledby": "long-button",
                              }}
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleChangeUpdateComment(
                                    item.id,
                                    item.content,
                                    item.rating
                                  )
                                }
                              >
                                Chỉnh sửa
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  deleteComment(item.id, item.product.id)
                                }
                              >
                                Xóa
                              </MenuItem>
                            </Menu>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Hiển thị các comment phản hồi */}
                    <div className="stack">
                      {item.replies.map((reply, index) => {
                        return (
                          <div key={reply.id}>
                            <div className="d-flex w-100 mt-4">
                              <div style={{ width: "5%" }}></div>
                              <div
                                className="d-flex justify-content-around"
                                style={{ width: "10%" }}
                              >
                                <img
                                  className="rounded-circle"
                                  style={{ width: "50px", height: "50px" }}
                                  src={reply.user.avatar}
                                  alt=""
                                />
                              </div>
                              <div className="stack" style={{ width: "80%" }}>
                                <div className="stack">
                                  <div className="fw-bold">
                                    {reply.user.fullname}
                                  </div>
                                  <textarea
                                    disabled={!checkIsUpdateComment(reply.id)}
                                    onChange={(e) =>
                                      checkIsUpdateComment(reply.id) &&
                                      handleChangeContentUdateComment(e)
                                    }
                                    value={
                                      !checkIsUpdateComment(reply.id)
                                        ? reply.content
                                        : updateComment
                                    }
                                    className={`my-2 rounded bg-transparent w-100 ${
                                      !checkIsUpdateComment(reply.id)
                                        ? "focus-visible-none"
                                        : ""
                                    }`}
                                    style={{
                                      resize: "none",
                                      minHeight: "40px",
                                      color:
                                        mode === "light" ? "black" : "white",
                                    }}
                                  >
                                    Sản phẩm này rất tuyệt vời
                                  </textarea>
                                  {checkIsUpdateComment(reply.id) && (
                                    <div className="d-flex justify-content-end">
                                      <Button
                                        className="btn px-2 py-1 rounded-3"
                                        disableElevation
                                        id="btn-add-card"
                                        onClick={() =>
                                          updateCommentSendAPI(reply, item.id)
                                        }
                                        disabled={
                                          reply.content.trim().length === 0
                                            ? true
                                            : false
                                        }
                                      >
                                        Gửi
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <div className="text-body-tertiary d-flex">
                                  <Typography
                                    variant="span"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {getRelativeTime(reply.commentdate)}
                                  </Typography>
                                  <Typography
                                    variant="span"
                                    sx={{ color: "text.secondary" }}
                                    className="ms-3 text-underline-hover"
                                    onClick={() =>
                                      handleChangeReplyCommentId(item.id)
                                    }
                                  >
                                    Phản hồi
                                  </Typography>
                                </div>
                              </div>
                              {isUserComment(reply.user.id) && (
                                <div
                                  className="text-center mt-3"
                                  style={{ width: "5%" }}
                                >
                                  <div
                                    className="dropdown"
                                    data-bs-auto-close="true"
                                  >
                                    <button
                                      className="btn focus-visible-none"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleChangeUpdateComment(
                                              reply.id,
                                              reply.content
                                            )
                                          }
                                        >
                                          Chỉnh sửa
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          className="dropdown-item"
                                          onClick={() =>
                                            deleteComment(
                                              reply.id,
                                              reply.product.id
                                            )
                                          }
                                        >
                                          Xóa
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {/* Ô comment phản hồi */}
                      {user && isReplyComment(item.id) && (
                        <div>
                          <div className="d-flex w-100 mt-4">
                            <div style={{ width: "5%" }}></div>
                            <div
                              className="d-flex justify-content-around"
                              style={{ width: "10%" }}
                            >
                              <img
                                className="rounded-circle"
                                style={{ width: "50px", height: "50px" }}
                                src={user.avatar}
                                alt=""
                              />
                            </div>
                            <div className="stack" style={{ width: "80%" }}>
                              <div className="stack">
                                <div className="fw-bold">{user.fullname}</div>
                                <textarea
                                  onChange={(e) => handleChangeReplyComment(e)}
                                  value={replyComment}
                                  className="my-2 rounded bg-transparent w-100"
                                  style={{
                                    resize: "none",
                                    minHeight: "40px",
                                  }}
                                ></textarea>
                                <div className="d-flex justify-content-end">
                                  <Button
                                    className="btn px-2 py-1 rounded-3"
                                    disableElevation
                                    id="btn-add-card"
                                    onClick={() => addReplyComment(item.id)}
                                    disabled={
                                      replyComment.trim().length === 0
                                        ? true
                                        : false
                                    }
                                  >
                                    Gửi
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pagination-container">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Trang trước
              </button>

              {renderPagination().map((number, index) => (
                <button
                  key={index}
                  onClick={() => number !== "..." && handlePageChange(number)}
                  className={`pagination-btn ${
                    currentPage === number ? "active-page" : ""
                  }`}
                  disabled={number === "..."}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={comments.length < commentsPerPage}
                className="pagination-btn"
              >
                Trang sau
              </button>
            </div>
          </div>
        </span>
      </div>
    </Box>
  );
};

export default Comments;
