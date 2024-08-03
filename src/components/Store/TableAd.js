import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import ApexCharts from 'react-apexcharts';

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
          rules={[{ required: true, message: `Please Input ${title}!` }]}
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
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fees/store-fee-details');
        const fetchedData = response.data;

        // Chuyển đổi dữ liệu từ mảng các mảng con thành mảng các đối tượng
        const transformedData = fetchedData.map((item, index) => ({
          id: index + 1, // Tạo ID giả định
          nameStore: item[0],
          taxmoney: item[1],
          commission: item[2] || 0, // Lấy commission từ dữ liệu hoặc mặc định là 0
        }));

        setData(transformedData);

        // Cập nhật dữ liệu biểu đồ với nameStore và taxmoney
        const seriesData = transformedData.map(item => item.taxmoney || 0); // Giá trị thuế
        const categories = transformedData.map(item => item.nameStore || 'Unknown'); // Tên cửa hàng
        setChartSeries([{ name: 'Tax Money', data: seriesData }]);
        setChartCategories(categories);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      id: record.id,
      taxmoney: record.taxmoney || 0,
      // Đặt giá trị commission để giữ nguyên khi chỉnh sửa
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

      // Cập nhật chỉ taxmoney, giữ nguyên commission
      const updatedRow = { taxmoney: row.taxmoney || 0, commission: existingRecord.commission };

      await axios.put(`http://localhost:8080/fees/${id}`, updatedRow);

      const newData = data.map(item =>
        item.id === id ? { ...item, taxmoney: updatedRow.taxmoney } : item
      );
      setData(newData);
      setEditingKey('');

      // Cập nhật dữ liệu biểu đồ sau khi chỉnh sửa
      const seriesData = newData.map(item => item.taxmoney || 0);
      setChartSeries([{ name: 'Tax Money', data: seriesData }]);

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '20%',
    },
    {
      title: 'Tax Money',
      dataIndex: 'taxmoney',
      width: '70%',
      editable: true,
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
              style={{ marginInlineEnd: 8 }}
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
        },
        markers: {
          size: 5,
          colors: ['#FF4560'],
          strokeColors: '#fff',
          strokeWidth: 2,
          shape: 'circle',
        },
      },
    },
    xaxis: {
      categories: chartCategories,
    },
    title: {
      text: 'Tax Money Overview',
      align: 'left',
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth',
    },
  };

  return (
    <div className="row">
      <div className="col-lg-6">
        <Form form={form} component={false}>
          <div><h1>Tax table</h1></div>
          <Table
            components={{ body: { cell: EditableCell } }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{ onChange: cancel }}
          />
        </Form>
      </div>
      <div className="col-lg-6">
        <div className="chart-container mt-4">
          <ApexCharts
            options={chartOptions}
            series={chartSeries}
            type="line"
            height={670}
          />
        </div>
      </div>
    </div>
  );
};

export default TableAd;
