import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, notification } from 'antd';
import ApexCharts from 'react-apexcharts';
import './TableAd.css'; // Thêm tệp CSS tùy chỉnh

// Hàm định dạng số với dấu phân cách hàng nghìn và ký hiệu đ
const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  return `${value.toLocaleString()} đ`;
};

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

// Thành phần chính của bảng và biểu đồ
const TableAd = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [chartSeries, setChartSeries] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fees/store-fee-details');
        const fetchedData = response.data;
        const transformedData = fetchedData.map((item, index) => ({
          id: index + 1,
          nameStore: item[0],
          taxmoney: item[1],
          commission: item[2] || 0,
        }));
        setData([transformedData[0]]);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fees/store-revenue');
        const fetchedData = response.data;
        const seriesData = fetchedData.map(item => item[1] || 0);
        const categories = fetchedData.map(item => item[0] || 'Unknown');
        setChartSeries([{ name: 'Doanh thu tổng', data: seriesData }]);
        setChartCategories(categories);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchTableData();
    fetchChartData();
  }, []);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      id: record.id,
      taxmoney: record.taxmoney || 0,
      commission: record.commission || 0,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const existingRecord = data.find(item => item.id === id);
      const taxmoney = parseFloat(row.taxmoney);

      if (isNaN(taxmoney)) {
        notification.error({
          message: 'Lỗi',
          description: 'Số tiền thuế không hợp lệ.',
        });
        form.setFieldsValue({ taxmoney: existingRecord.taxmoney });
        return;
      }

      if (taxmoney < 0) {
        notification.error({
          message: 'Lỗi',
          description: 'Số tiền thuế không được âm.',
        });
        form.setFieldsValue({ taxmoney: existingRecord.taxmoney });
        return;
      }

      const updatedRow = { taxmoney, commission: existingRecord.commission };
      await axios.put(`http://localhost:8080/fees/${id}`, updatedRow);

      const newData = data.map(item =>
        item.id === id ? { ...item, taxmoney: updatedRow.taxmoney } : item
      );
      setData(newData);
      setEditingKey('');

      const response = await axios.get('http://localhost:8080/fees/store-revenue');
      const fetchedData = response.data;
      const seriesData = fetchedData.map(item => item[1] || 0);
      setChartSeries([{ name: 'Doanh thu tổng', data: seriesData }]);

      notification.success({
        message: 'Thành công',
        description: 'Cập nhật dữ liệu thành công!',
      });

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi lưu dữ liệu.',
      });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Tiền thuế',
      dataIndex: 'taxmoney',
      width: '40%',
      editable: true,
      align: 'center',
    },
    {
      title: 'Thao tác',
      dataIndex: 'operation',
      width: '50%',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginInlineEnd: 8 }}
            >
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
        inputType: col.dataIndex === 'taxmoney' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const chartOptions = {
    chart: {
      type: 'line',
      height: 670,
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          formatter: (val) => formatNumber(val), // Sử dụng hàm formatNumber
        },
      },
    },
    xaxis: {
      categories: chartCategories,
    },
    title: {
      text: 'Tổng quan về doanh thu cửa hàng',
      align: 'left',
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => formatNumber(val), // Sử dụng hàm formatNumber
    },
    tooltip: {
      y: {
        formatter: (val) => formatNumber(val), // Sử dụng hàm formatNumber
      },
    },
    stroke: {
      curve: 'smooth',
    },
  };

  return (
    <div className="row">
      <div className="col-lg-6">
        <Form form={form} component={false}>
          <div><h1>Bảng thuế</h1></div>
          <Table
            components={{ body: { cell: EditableCell } }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false} // Tắt phân trang
            className="custom-table"
          />
        </Form>
      </div>
      <div className="col-lg-6">
        <div className="chart-container mt-4">
          <ApexCharts
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default TableAd;
