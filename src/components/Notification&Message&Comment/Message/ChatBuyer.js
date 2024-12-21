import React, { useState, useEffect } from "react";
import axios from "../../../Localhost/Custumize-axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./Chat.css";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Try } from "@mui/icons-material";

const ChatBuyer = ({ infoStore }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [editMessageId, setEditMessageId] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  // const idStore = localStorage.getItem("idStore");


  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    });

    setStompClient(stompClient);

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadDataMessage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/messages/${user.id}/${infoStore.id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user && infoStore.id) {
      loadDataMessage();
    }
  }, [user, infoStore.id]);

  const handleSendMessage = async () => {
    if (!inputMessage || !user?.id || !infoStore?.id) return;

    if (editMessageId) {
      const updatedMessage = { content: inputMessage };
      const result = await updateMessage(editMessageId, updatedMessage);
      if (result) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editMessageId ? { ...msg, content: result.content } : msg
          )
        );
        setEditMessageId(null);
      }
    } else {
      const newMessage = {
        senderId: user.id,
        receiverId: infoStore.id,
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };

      const savedMessage = await createMessage(newMessage);
      if (savedMessage) setMessages((prev) => [...prev, savedMessage]);
    }

    setInputMessage("");
  };
  // console.log(infoStore);

  const createMessage = async (newMessage) => {
    try {
      const response = await axios.post("/api/messages", newMessage);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm tin nhắn:", error);
    }
  };

  const updateMessage = async (id, updatedMessage) => {
    try {
      const response = await axios.put(`/api/messages/${id}`, updatedMessage);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi sửa tin nhắn:", error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`/api/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa tin nhắn:", error);
    }
  };

  const handleEditMessage = (id, content) => {
    setEditMessageId(id);
    setInputMessage(content);
    setOpenDropdownId(null);
  };

  const handleDeleteMessage = async (id) => {
    confirmAlert({
      title: "Xóa tin nhắn!",
      message: "Bạn có chắc chắn rằng muốn xóa tin nhắn này không?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            // Hiển thị thông báo đang tải
            try {
              const idToast = toast.loading("Vui lòng chờ...");
              await deleteMessage(id);
              toast.update(idToast, {
                render: "Xóa tin nhắn thành công",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                closeButton: true,
              });
              setOpenDropdownId(null);
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Không",
        },
      ],
      overlayClassName: "custom-overlay",
    });
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="row">
      <div className="col-lg-4">
        <div className="card text-center shadow border-0">
          <div className="card-body">
            <img
              src={infoStore?.user?.avatar}
              alt="Avatar Store"
              className="img-fluid rounded-circle mb-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <h5 className="card-title mb-2">{infoStore?.namestore}</h5>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="shadow border-0">
          <div
            className="py-2 px-3 bg-primary text-white"
            style={{ borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}
          >
            <h5 className="mb-0 text-truncate">
              Đang chat với: {infoStore?.namestore}
            </h5>
          </div>

          <div
            className="chat-messages overflow-auto"
            style={{
              height: "360px",
              backgroundColor: "#f8f9fa",
              padding: "5px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 d-flex ${
                  msg.senderId === user.id
                    ? "justify-content-end"
                    : "justify-content-start"
                } chat-message`}
              >
                {msg.senderId === user.id && (
                  <div className="chat-message-options ms-2">
                    <button
                      className="btn btn-sm btn-link p-0"
                      onClick={() => toggleDropdown(msg.id)}
                      style={{ textDecoration: "none" }}
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul
                      className={`dropdown-menu dropdown-menu-end ${
                        openDropdownId === msg.id ? "show" : ""
                      }`}
                    >
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEditMessage(msg.id, msg.content)}
                        >
                          Sửa
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          Xóa
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                <div
                  className={`p-2 rounded shadow-sm ${
                    msg.senderId === user.id
                      ? "bg-info text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "70%", width: "fit-content" }}
                >
                  <strong>
                    {msg.senderId === user.id ? "Bạn" : infoStore?.namestore}:
                  </strong>
                  <p className="mt-2 mb-0">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>
                {editMessageId ? "Cập nhật" : "Gửi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBuyer;
