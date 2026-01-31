import { useState } from 'react';
import { Card, Button, Modal, Form, Input, Select, DatePicker, List, Space, Tag, Statistic, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/helpers';
import '../styles/Sales.css';

const { Option } = Select;

function Sales({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [form] = Form.useForm();

  const paymentTypeLabels = {
    full: 'Trả 1 lần',
    installment: 'Trả góp',
    deferred: 'Trả sau'
  };

  const handleSubmit = (values) => {
    const sale = {
      id: currentSale?.id || Date.now(),
      productName: values.productName,
      buyPrice: parseFloat(values.buyPrice),
      sellPrice: parseFloat(values.sellPrice),
      paymentType: values.paymentType,
      installmentMonths: values.paymentType === 'installment' ? parseInt(values.installmentMonths) : 0,
      date: values.date.format('YYYY-MM-DD')
    };

    if (currentSale) {
      setData({
        ...data,
        sales: data.sales.map(s => s.id === sale.id ? sale : s)
      });
    } else {
      setData({
        ...data,
        sales: [...data.sales, sale]
      });
    }

    setShowModal(false);
    form.resetFields();
    setCurrentSale(null);
  };

  const handleEdit = (sale) => {
    setCurrentSale(sale);
    form.setFieldsValue({
      ...sale,
      date: dayjs(sale.date)
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa giao dịch này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setData({
          ...data,
          sales: data.sales.filter(s => s.id !== id)
        });
      }
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setCurrentSale(null);
  };

  // Watch form values for profit calculation
  const buyPrice = Form.useWatch('buyPrice', form);
  const sellPrice = Form.useWatch('sellPrice', form);
  const calculatedProfit = buyPrice && sellPrice ? parseFloat(sellPrice) - parseFloat(buyPrice) : 0;

  return (
    <div className="sales-container">
      {/* Sales List */}
      <Card
        title={<span className="card-title-custom">🛍️ Quản lý bán hàng</span>}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setShowModal(true)}
          >
            Thêm
          </Button>
        }
        className="glass-card"
      >
        {data.sales.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <ShoppingOutlined style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
            <p>Chưa có giao dịch nào</p>
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={data.sales.sort((a, b) => new Date(b.date) - new Date(a.date))}
            renderItem={sale => {
              const profit = sale.sellPrice - sale.buyPrice;
              const profitPercent = ((profit / sale.buyPrice) * 100).toFixed(1);
              const isProfit = profit >= 0;
              
              return (
                <List.Item
                  className="sale-item"
                  extra={
                    <Space>
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(sale)}
                      />
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(sale.id)}
                      />
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <span className="sale-title">{sale.productName}</span>
                        <Tag color="blue">{paymentTypeLabels[sale.paymentType]}</Tag>
                        {sale.paymentType === 'installment' && (
                          <Tag>{sale.installmentMonths} tháng</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <span>{new Date(sale.date).toLocaleDateString('vi-VN')}</span>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Statistic 
                              title="Giá nhập" 
                              value={sale.buyPrice}
                              formatter={(value) => formatCurrency(value)}
                              valueStyle={{ fontSize: '1rem', color: '#FFD23F' }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic 
                              title="Giá bán" 
                              value={sale.sellPrice}
                              formatter={(value) => formatCurrency(value)}
                              valueStyle={{ fontSize: '1rem', color: '#06D6A0' }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic 
                              title="Lợi nhuận" 
                              value={profit}
                              formatter={(value) => formatCurrency(value)}
                              prefix={isProfit ? <RiseOutlined /> : <FallOutlined />}
                              valueStyle={{ 
                                fontSize: '1rem', 
                                color: isProfit ? '#06D6A0' : '#EF476F',
                                fontWeight: 700 
                              }}
                              suffix={
                                <span style={{ fontSize: '0.8rem' }}>
                                  ({isProfit ? '+' : ''}{profitPercent}%)
                                </span>
                              }
                            />
                          </Col>
                        </Row>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      {/* Modal */}
      <Modal
        title={currentSale ? 'Sửa giao dịch' : 'Thêm giao dịch'}
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            paymentType: 'full',
            date: dayjs()
          }}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Ví dụ: iPhone 15" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giá nhập"
                name="buyPrice"
                rules={[{ required: true, message: 'Vui lòng nhập giá nhập' }]}
              >
                <Input type="number" placeholder="0" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá bán"
                name="sellPrice"
                rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
              >
                <Input type="number" placeholder="0" size="large" />
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

          <Form.Item
            label="Hình thức nhập hàng"
            name="paymentType"
            rules={[{ required: true }]}
          >
            <Select size="large">
              <Option value="full">Trả 1 lần</Option>
              <Option value="installment">Trả góp</Option>
              <Option value="deferred">Trả sau</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.paymentType !== currentValues.paymentType
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('paymentType') === 'installment' ? (
                <Form.Item
                  label="Số tháng trả góp"
                  name="installmentMonths"
                  rules={[{ required: true, message: 'Vui lòng nhập số tháng' }]}
                >
                  <Input type="number" placeholder="12" size="large" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            label="Ngày giao dịch"
            name="date"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} size="large" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {currentSale ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Sales;
