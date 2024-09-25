import React, { useState } from 'react';
import { Modal, Button, Dropdown, DropdownButton, InputGroup, FormControl } from 'react-bootstrap';
import './Message.css';

const ChatInterface = () => {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState('Tất cả');

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleSelect = (eventKey) => setFilter(eventKey);

  return (
    <>
      <div className="chat-icon-container" onClick={handleShow}>
        <img src="https://logowik.com/content/uploads/images/chat3893.logowik.com.webp" alt="Chat Logo" className="chat-logo" />
      </div>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-and-filter-container">
            <InputGroup className="search-input-group">
              <FormControl placeholder="Tìm kiếm" aria-label="Tìm kiếm" />
              <Button variant="outline-secondary">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
            <DropdownButton
              id="dropdown-basic-button"
              title={filter}
              onSelect={handleSelect}
              className="filter-dropdown"
            >
              <Dropdown.Item eventKey="Tất cả">Tất cả</Dropdown.Item>
              <Dropdown.Item eventKey="Chưa đọc">Chưa đọc</Dropdown.Item>
              <Dropdown.Item eventKey="Chưa phản hồi">Chưa phản hồi</Dropdown.Item>
              <Dropdown.Item eventKey="Đã ghim">Đã Ghim</Dropdown.Item>
            </DropdownButton>
          </div>
          <div className="content-container">
            <div className="col-md-12 text-center">
              <h4>Chào mừng bạn đến với tính năng Chat dành cho Người Bán Shopee</h4>
              <p>Bắt đầu trả lời người mua!</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChatInterface;
