import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./Message.css";
import axios from "../../../Localhost/Custumize-axios"; // Tùy chỉnh lại theo đường dẫn của bạn
import ChatSeller from "./ChatSeller";
import ChatBuyer from "./ChatBuyer";
import { useMatch } from "react-router-dom";

// Placeholder Components for ChatBuyer and ChatSeller

const ChatInterface = ({ isOpenChatBox, store, user }) => {
  const [show, setShow] = useState(false); // Trạng thái hiển thị Modal
  const urlSeller = useMatch("profileMarket/*");

  useEffect(() => {
    if (isOpenChatBox) {
      setShow(true);
      console.log(store);
    }
  }, [isOpenChatBox]);

  const handleShow = () => {
    setShow(true);
  }; // Mở Modal
  const handleClose = () => {
    setShow(false);
  }; // Đóng Modal

  // useEffect(() => {
  //   const loadUserInfo = async () => {
  //     try {
  //       if (!token) {
  //         setLoading(true);
  //         return;
  //       }
  //       const res = await axios.get(`/userProFile/myInfo`);
  //       setRole(res.data.rolePermission.role.namerole); // Lấy role người dùng
  //     } catch (error) {
  //       console.error("Lỗi khi lấy thông tin người dùng:", error);
  //       setRole(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadUserInfo();
  // }, [token]);

  return (
    <>
      {/* Nút chat */}
      <div className="chat-icon-container" onClick={handleShow}>
        <img
          src="https://logowik.com/content/uploads/images/chat3893.logowik.com.webp"
          alt="Chat Logo"
          className="chat-logo"
        />
      </div>

      {/* Modal hiển thị nội dung chat */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="chat-modal"
        backdrop={false} // Không làm mờ nền
        centered={false} // Không căn giữa Modal
      >
        <Modal.Header closeButton>
          <Modal.Title>Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            {!urlSeller ? (
              <ChatBuyer infoStore={store} /> // Hiển thị giao diện ChatBuyer
            ) : urlSeller ? (
              <ChatSeller infoUser={user} /> // Hiển thị giao diện ChatSeller
            ) : (
              <p>Lỗi: Không xác định được vai trò của người dùng.</p>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChatInterface;
