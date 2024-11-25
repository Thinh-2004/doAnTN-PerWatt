import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Typography, Button, notification, Row, Col, Empty } from 'antd';
import axios from '../../../../../Localhost/Custumize-axios';

const { Title, Text } = Typography;

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const BasicInfoComponent = ({ savedProducts, idVoucherAdmin }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState(savedProducts);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [discounts, setDiscounts] = useState({});
    const [voucherInfo, setVoucherInfo] = useState({ voucherName: '', startDay: '', endDay: '' });
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 }); // Hiển thị 5 sản phẩm mỗi trang

    useEffect(() => {
        setProducts(savedProducts);
    }, [savedProducts]);

    useEffect(() => {
        const fetchVoucherInfo = async () => {
            try {
                const response = await axios.get(`/vouchers/${idVoucherAdmin}`);
                setVoucherInfo({
                    voucherName: response.data.vouchername,
                    startDay: formatDate(response.data.startday),
                    endDay: formatDate(response.data.endday),
                });
            } catch (error) {
                console.error("Error fetching voucher info:", error);
            }
        };

        if (idVoucherAdmin) {
            fetchVoucherInfo();
        }
    }, [idVoucherAdmin]);

    useEffect(() => {
        const key = `savedProducts_${idVoucherAdmin}`;
        if (products.length > 0) {
            localStorage.setItem(key, JSON.stringify(products));
        } else {
            localStorage.removeItem(key);
        }
    }, [products, idVoucherAdmin]);

    const handleDeleteByProductDetail = async (idProductDetail) => {
        try {
            await axios.delete(`/voucherAdminDetails/deleteByProductDetail/${idProductDetail}`);
            
            const updatedProducts = products.filter(product => product.productDetail.id !== idProductDetail);
            setProducts(updatedProducts);

            notification.success({
                message: 'Thành công',
                description: 'Đã xóa sản phẩm thành công.',
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Đã xảy ra lỗi khi xóa sản phẩm! Vui lòng thử lại.',
            });
        }
    };

    const handleDeleteSelected = async () => {
        try {
            // Gửi tất cả yêu cầu xóa đồng thời
            await Promise.all(
                selectedRowKeys.map(idProductDetail =>
                    axios.delete(`/voucherAdminDetails/deleteByProductDetail/${idProductDetail}`)
                )
            );
    
            // Lọc danh sách sản phẩm để loại bỏ những sản phẩm đã xóa
            const updatedProducts = products.filter(
                product => !selectedRowKeys.includes(product.productDetail.id)
            );
    
            // Cập nhật lại state products
            setProducts(updatedProducts);
    
            // Xóa danh sách các sản phẩm đã chọn
            setSelectedRowKeys([]);
    
            notification.success({
                message: 'Thành công',
                description: 'Đã xóa các sản phẩm được chọn thành công.',
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Đã xảy ra lỗi khi xóa các sản phẩm đã chọn! Vui lòng thử lại.',
            });
        }
    };
    

    const handleSelectRow = (id) => {
        const newSelectedRowKeys = selectedRowKeys.includes(id)
            ? selectedRowKeys.filter(key => key !== id)
            : [...selectedRowKeys, id];
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleDiscountChange = (id, value) => {
        const discountValue = parseFloat(value) || 0;
        const updatedDiscounts = { ...discounts, [id]: discountValue };
        setDiscounts(updatedDiscounts);

        const updatedProducts = products.map(product => {
            if (product.productDetail.id === id) {
                const originalPrice = product.originalPrice;
                const discountPrice = originalPrice * (1 - discountValue / 100);
                return { 
                    ...product, 
                    discount: discountValue,
                    discountPrice: discountPrice
                };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const handleUpdateDiscount = async () => {
        try {
            for (const [idProductDetail, discount] of Object.entries(discounts)) {
                const discountPrice = products.find(p => p.productDetail.id === parseInt(idProductDetail))?.originalPrice * (1 - discount / 100);

                await axios.put(`/voucherAdminDetails/updateDiscountByProductDetail/${idProductDetail}`, null, {
                    params: { newDiscountPrice: discountPrice },
                });
            }

            notification.success({
                message: 'Thành công',
                description: 'Cập nhật giảm giá thành công.',
            });

            setDiscounts({}); // Reset discounts after successful update
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Đã xảy ra lỗi khi cập nhật giảm giá! Vui lòng thử lại.',
            });
        }
    };

    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleTableChange = (pagination) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
        });
    };

    // Group products by category
    const groupedProducts = filteredProducts.reduce((groups, product) => {
        const category = product.productDetail.categoryName || 'Không xác định'; // Chắc chắn có thuộc tính categoryName trong dữ liệu
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(product);
        return groups;
    }, {});

    return (
        <Card title="Danh sách sản phẩm đã lưu" className="mt-6">
            <Row gutter={16}>
                <Col span={12}>
                    <Text>Loại chương trình khuyến mãi: <strong>{voucherInfo.voucherName}</strong></Text>
                </Col>
                <Col span={12}>
                    <Text>Thời gian khuyến mãi: <strong>{voucherInfo.startDay} - {voucherInfo.endDay}</strong></Text>
                </Col>
            </Row>
            <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />
            <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col>
                    <Button
                        type="primary"
                        danger
                        onClick={handleDeleteSelected}
                        disabled={selectedRowKeys.length === 0}
                    >
                        Xóa sản phẩm đã chọn
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={handleUpdateDiscount}
                        disabled={!Object.keys(discounts).length}
                    >
                        Cập nhật giảm giá
                    </Button>
                </Col>
            </Row>
            {Object.entries(groupedProducts).length === 0 ? (
                <Empty description={<span>Không có sản phẩm nào</span>} />
            ) : (
                Object.entries(groupedProducts).map(([category, products]) => (
                    <React.Fragment key={category}>
                        <Title level={4}>{category}</Title>
                        <Table
                            dataSource={products}
                            columns={[
                                {
                                    title: 'Tên sản phẩm',
                                    dataIndex: 'name',
                                    key: 'name',
                                    render: (text, record) => (
                                        <span className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedRowKeys.includes(record.productDetail.id)}
                                                onChange={() => handleSelectRow(record.productDetail.id)}
                                                style={{ marginRight: '8px' }}
                                            />
                                            <img src={record.imgSrc} alt={record.name} style={{ width: '50px', marginRight: '8px' }} />
                                            {text}
                                        </span>
                                    ),
                                },
                                {
                                    title: 'Giá gốc',
                                    dataIndex: 'originalPrice',
                                    key: 'originalPrice',
                                    render: (price) => formatPrice(price),
                                },
                                {
                                    title: 'Giá giảm',
                                    dataIndex: 'discountPrice',
                                    key: 'discountPrice',
                                    render: (price) => formatPrice(price),
                                },
                                {
                                    title: 'Giảm giá (%)',
                                    render: (text, record) => (
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={discounts[record.productDetail.id] || record.discount || 0}
                                            onChange={(e) => handleDiscountChange(record.productDetail.id, e.target.value)}
                                            className="w-16 p-1 border rounded-md"
                                        />
                                    ),
                                }
                            ]}
                            rowKey="id"
                            pagination={false} // Không phân trang cho mỗi nhóm
                        />
                    </React.Fragment>
                ))
            )}
        </Card>
    );
};

export default BasicInfoComponent;
