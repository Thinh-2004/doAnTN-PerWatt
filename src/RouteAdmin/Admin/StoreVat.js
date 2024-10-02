import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import axios from 'axios';
import './StoreVat.css';

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, onVATChange, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber onChange={onVATChange} /> : <Input />;
  return (
    <td {...restProps}>
      {editing && dataIndex === 'vat' ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Vui lòng nhập ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const StoreVat = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      StoreName: record.StoreName,
      totalOrders: record.totalOrders,
      totalRevenue: record.totalRevenue,
      vat: record.vat,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Xác thực không thành công:', errInfo);
    }
  };

  const onVATChange = (value) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.key === editingKey);
    if (index > -1) {
      const item = newData[index];
      const totalRevenueBeforeVAT = item.totalRevenue * (100 / (100 - item.vat)); // Tính tổng doanh thu trước VAT
      const newTotalRevenue = calculateTotalRevenue(totalRevenueBeforeVAT, value); // Tính tổng doanh thu mới
      newData.splice(index, 1, {
        ...item,
        totalRevenue: newTotalRevenue,
        vat: value,
      });
      setData(newData);
    }
  };

  const calculateTotalRevenue = (totalRevenueBeforeVAT, vat) => {
    const vatAmount = totalRevenueBeforeVAT * (vat / 100);
    return totalRevenueBeforeVAT - vatAmount; // Tính tổng doanh thu sau khi trừ VAT
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: '10%',
      render: (_, store) => (
        <img
          src={store.image}
          alt={store.StoreName}
          className="productImageClassDa1"
          style={{ width: '150px', height: 'auto' }}
        />
      ),
    },
    {
      title: 'Tên cửa hàng',
      dataIndex: 'StoreName',
      width: '25%',
      editable: false,
    },
    {
      title: 'Tổng số lượng bán',
      dataIndex: 'totalOrders',
      width: '15%',
      editable: false,
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'totalRevenue',
      width: '40%',
      editable: false,
    },
    {
      title: 'VAT',
      dataIndex: 'vat',
      width: '15%',
      editable: true,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
              Lưu
            </Typography.Link>
            <Popconfirm title="Bạn có chắc chắn muốn hủy?" onConfirm={cancel}>
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Chỉnh sửa
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'vat' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onVATChange: onVATChange,
      }),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/top5');
        const result = response.data.map((store, index) => {
          const vatAmount = store.totalRevenue * (store.vat / 100); // Tính VAT từ tổng doanh thu
          const totalRevenueAfterVAT = store.totalRevenue - vatAmount; // Tính tổng doanh thu sau khi trừ VAT
          const image = store.ImageNameStore && store.idImageStore
            ? `http://localhost:8080/files/store/${store.idImageStore}/${store.ImgBackgound}`
            : `https://via.placeholder.com/50?text=${store.ImgBackgound}`; // Ảnh mặc định

          return {
            ...store,
            key: index.toString(),
            totalRevenue: totalRevenueAfterVAT,
            image, // Thêm thuộc tính image vào kết quả
          };
        });
        setData(result);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Form form={form} component={false}>
      <Table className='table-container'
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{ onChange: cancel }}
      />
    </Form>
  );
};

export default StoreVat;
