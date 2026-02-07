import { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, Select, DatePicker, List, Space, Tag, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/Sales.css';
import { SALES_CONS } from '../../utils/sales';
import SaleService from '../../services/saleService';

const SaleDetail = (props) => {
    const { visible, onClose, onSubmit, currentSale } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Watch form values for profit calculation
    const buyPrice = Form.useWatch('buy_price', form);
    const sellPrice = Form.useWatch('sell_price', form);
    const calculatedProfit = buyPrice && sellPrice ? parseFloat(sellPrice) - parseFloat(buyPrice) : 0;

    useEffect(() => {
        if (visible) {
            form.setFieldsValue(currentSale ? {
                ...currentSale,
                buy_date: dayjs(currentSale.buy_date),
                sell_date: currentSale.sell_date ? dayjs(currentSale.sell_date) : null,
            } : {
                buy_date: dayjs(),
                payment_type: SALES_CONS.BuyType[0].value,
                status: 'stored',
                product_type: 'product',
            });
        }
    }, [visible, currentSale]);

    const handleSubmit = async (values) => {
        setLoading(true);
        const sale = {
            name: values.name,
            buy_price: parseFloat(values.buy_price),
            sell_price: values.sell_price ? parseFloat(values.sell_price) : '',
            payment_type: values.payment_type,
            installment_months: values.payment_type === 'installment' ? parseInt(values.installment_months) : '',
            buy_date: values.buy_date.format('DD/MM/YYYY'),
            sell_date: values.sell_date?.format('DD/MM/YYYY') ?? '',
            last_modified: dayjs().format('DD/MM/YYYY'),
            status: values.status,
            product_type: values.product_type,
        };

        let res;
        if (currentSale?.id) {
            res = await SaleService.update(currentSale.id, sale);
        } else {
            res = await SaleService.insert(sale);
        }

        setLoading(false);
        onSubmit();
        form.resetFields();
        onClose();
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <>
            {/* Modal */}
            <Modal
                title={currentSale ? 'Sửa giao dịch' : 'Thêm giao dịch'}
                open={visible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                    >
                        <Input placeholder="Ví dụ: iPhone 15" size="large" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Giá nhập"
                                name="buy_price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá nhập' }]}
                            >
                                <Input type="number" placeholder="0" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giá bán"
                                name="sell_price"
                            >
                                <Input type="number" placeholder="0" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày mua"
                                name="buy_date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày mua' }]}
                            >
                                <DatePicker style={{ width: '100%' }} size="large" format="DD/MM/YYYY" allowClear={false} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày bán"
                                name="sell_date"
                            >
                                <DatePicker style={{ width: '100%' }} size="large" format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {buyPrice && sellPrice && (
                        <Card
                            size="small"
                            className="mb-3"
                            style={{
                                background: calculatedProfit >= 0
                                    ? 'rgba(6, 214, 160, 0.1)'
                                    : 'rgba(239, 71, 111, 0.1)',
                                border: `1px solid ${calculatedProfit >= 0 ? '#06D6A0' : '#EF476F'}`
                            }}
                        >
                            <Statistic
                                title="Lợi nhuận dự kiến"
                                value={calculatedProfit}
                                formatter={(value) => formatCurrency(value)}
                                prefix={calculatedProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                valueStyle={{
                                    color: calculatedProfit >= 0 ? '#06D6A0' : '#EF476F',
                                    fontSize: '1.5rem',
                                    fontWeight: 700
                                }}
                            />
                        </Card>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Chọn trạng thái" size="large"
                                    options={SALES_CONS.StatusOptions}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Loại mặt hàng"
                                name="product_type"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Chọn loại mặt hàng" size="large"
                                    options={SALES_CONS.ProductTypeOptions}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Hình thức nhập hàng"
                                name="payment_type"
                                rules={[{ required: true }]}
                            >
                                <Select placeholder="Chọn hình thức nhập hàng" size="large"
                                    options={SALES_CONS.BuyType}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.payment_type !== currentValues.payment_type
                            }
                        >
                            {({ getFieldValue }) =>
                                getFieldValue('payment_type') === 'installment' ? (
                                    <Col span={12}>
                                        <Form.Item
                                            label="Số tháng trả góp"
                                            name="installment_months"
                                            rules={[{ required: true, message: 'Vui lòng nhập số tháng' }]}
                                        >
                                            <Input type="number" placeholder="12" size="large" />
                                        </Form.Item>
                                    </Col>
                                ) : null
                            }
                        </Form.Item>
                    </Row>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit"
                                icon={loading ? <LoadingOutlined /> : null}
                                disabled={loading}
                            >
                                {currentSale ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SaleDetail;