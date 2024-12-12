import React, { useState, useEffect } from "react";
import axios from "../../../Localhost/Custumize-axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "./Chat.css";

const ChatSeller = ({ infoUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [editMessageId, setEditMessageId] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);


  const idStore = localStorage.getItem("idStore");
  const senderId = idStore === "undefined" ? infoUser.id : idStore;

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
          `http://localhost:8080/api/messages/${senderId}/${infoUser.id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (senderId && infoUser.id) {
      loadDataMessage();
    }
  }, [senderId, infoUser.id]);

  const handleSendMessage = async () => {
    if (!inputMessage || !idStore || !infoUser?.id) return;

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
        senderId: idStore, // Người gửi là infoUser.id (Người bán)
        receiverId: infoUser.id, // Người nhận là user.id (Người mua)
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      console.log(newMessage);

      const savedMessage = await createMessage(newMessage);
      if (savedMessage) setMessages((prev) => [...prev, savedMessage]);
    }

    setInputMessage("");
  };

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
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa tin nhắn này không?"
    );
    if (confirmDelete) {
      await deleteMessage(id);
    }
    setOpenDropdownId(null);
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
              src={infoUser?.avatar}
              alt="Avatar Store"
              className="img-fluid rounded-circle mb-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <h5 className="card-title mb-2">{infoUser?.fullname}</h5>{" "}
            {/* Thay đổi thành infoUser.fullname */}
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
              Đang chat với: {infoUser?.fullname}
            </h5>{" "}
            {/* Thay đổi thành infoUser.fullname */}
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
                  msg.senderId === parseInt(idStore)
                    ? "justify-content-end"
                    : "justify-content-start"
                } chat-message`}
              >
                {msg.senderId === parseInt(idStore) && (
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
                    msg.senderId === parseInt(idStore)
                      ? "bg-info text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "70%", width: "fit-content" }}
                >
                  <strong>
                    {msg.senderId === parseInt(idStore)
                      ? "Bạn"
                      : infoUser?.fullname}
                    : {/* Thay đổi thành infoUser.fullname */}
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

export default ChatSeller;
