import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Nhập axios để gọi API
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd'; // Nhập các thành phần từ Ant Design
import ApexCharts from 'react-apexcharts'; // Nhập thư viện biểu đồ

// Thành phần để hiển thị các ô có thể chỉnh sửa
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// Thành phần chính của bảng
const TableAd = () => {
  const [form] = Form.useForm(); // Khởi tạo form
  const [data, setData] = useState([]); // Dữ liệu cho bảng
  const [editingKey, setEditingKey] = useState(''); // Khoá dòng đang chỉnh sửa
  const [chartSeries, setChartSeries] = useState([]); // Dữ liệu cho biểu đồ

  useEffect(() => {
    // Hàm lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fees');
        const fetchedData = response.data;
        console.log('Fetched Data:', fetchedData); // Kiểm tra dữ liệu nhận được
        setData(fetchedData);

        // Tính toán dữ liệu cho biểu đồ
        const seriesData = fetchedData.map(item => item.taxmoney || 0); // Đảm bảo dữ liệu không undefined
        const categories = fetchedData.map(item => item.nameStore || `Item ${item.id}`); // Đảm bảo có dữ liệu cho trục x
        setChartSeries([{ name: 'Tax Money', data: seriesData }]);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Kiểm tra nếu một dòng đang được chỉnh sửa
  const isEditing = (record) => record.id === editingKey;

  // Bắt đầu chỉnh sửa một dòng
  const edit = (record) => {
    form.setFieldsValue({
      id: record.id,
      taxMoney: record.taxmoney || 0, // Đảm bảo giá trị hợp lệ
      commission: record.commission || 0,
    });
    setEditingKey(record.id);
  };

  // Hủy bỏ chỉnh sửa
  const cancel = () => {
    setEditingKey('');
  };

  // Lưu thông tin chỉnh sửa
  const save = async (id) => {
    try {
      const row = await form.validateFields(); // Xác thực dữ liệu từ form
      await axios.put(`http://localhost:8080/fees/${id}`, row); // Gọi API để cập nhật dữ liệu
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData); // Cập nhật dữ liệu mới
        setEditingKey('');

        // Cập nhật dữ liệu cho biểu đồ khi có sự thay đổi
        const seriesData = newData.map(item => item.taxmoney || 0);
        setChartSeries([{ name: 'Tax Money', data: seriesData }]);

      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '15%',
    },
    {
      title: 'Tax Money',
      dataIndex: 'taxmoney', // Thay đổi đây để khớp với dữ liệu từ API
      width: '40%',
      editable: true, // Cho phép chỉnh sửa cột taxMoney
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      width: '40%',
      editable: false, // Không cho phép chỉnh sửa cột commission
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  // Kết hợp các cột có thể chỉnh sửa với phần tử ô
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'taxmoney' ? 'number' : 'text', // Chỉ cột taxMoney có kiểu số
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // Cấu hình biểu đồ
  const chartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: data.length ? data.map(item => item.nameStore || `Item ${item.id}`) : [], // Đảm bảo không có lỗi khi data chưa được tải
    },
    title: {
      text: 'Tax Money Overview',
      align: 'left',
    },
  };

  // Trả về thành phần bảng
  return (
    <div className="row">
      <div className="col-lg-6">
        <Form form={form} component={false}>
          <div><h1>TableAd1</h1></div>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data} // Đảm bảo data chứa trường taxMoney
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </div>
      <div className="col-lg-6">
        <div className="chart-container mt-4">
          <ApexCharts
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={670}
          />
        </div>
      </div>
    </div>
  );
};

export default TableAd;
