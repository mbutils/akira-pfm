import { useState } from 'react';
import { Card, Alert, Progress, Button, Modal, Form, Input, Select, DatePicker, List, Space, Tag, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CreditCardOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/helpers';
import '../styles/Debts.css';

const { Option } = Select;

function Debts({ data, setData, isDebtSafe, debtLimit, totalDebtPayment }) {
  const [showModal, setShowModal] = useState(false);
  const [currentDebt, setCurrentDebt] = useState(null);
  const [form] = Form.useForm();
  const [debtType, setDebtType] = useState('installment');

  const debtPercentage = debtLimit > 0 ? Math.min((totalDebtPayment / debtLimit) * 100, 100) : 0;

  const handleSubmit = (values) => {
    const debt = {
      id: currentDebt?.id || Date.now(),
      name: values.name,
      amount: parseFloat(values.amount),
      type: values.type,
      months: values.type === 'installment' ? parseInt(values.months) : 0,
      interestRate: values.type === 'installment' ? parseFloat(values.interestRate || 0) : 0,
      monthlyAmount: values.type === 'recurring' ? parseFloat(values.monthlyAmount) : 0,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : ''
    };

    if (currentDebt) {
      setData({
        ...data,
        debts: data.debts.map(d => d.id === debt.id ? debt : d)
      });
    } else {
      setData({
        ...data,
        debts: [...data.debts, debt]
      });
    }

    setShowModal(false);
    form.resetFields();
    setCurrentDebt(null);
    setDebtType('installment');
  };

  const handleEdit = (debt) => {
    setCurrentDebt(debt);
    setDebtType(debt.type);
    form.setFieldsValue({
      ...debt,
      dueDate: debt.dueDate ? dayjs(debt.dueDate) : null
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa khoản nợ này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setData({
          ...data,
          debts: data.debts.filter(d => d.id !== id)
        });
      }
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setCurrentDebt(null);
    setDebtType('installment');
  };

  return (
    <div className="debts-container">
      {/* Debt Limit Warning */}
      <Alert
        message={
          <Space>
            {isDebtSafe ? '✅ Giới hạn nợ' : '⚠️ Giới hạn nợ'}
          </Space>
        }
        description={
          <div>
            <p className="mb-3">
              Tổng tiền trả nợ không nên vượt quá 40% thu nhập hàng tháng
            </p>
            <Progress 
              percent={debtPercentage.toFixed(1)} 
              status={isDebtSafe ? 'success' : 'exception'}
              strokeColor={
                isDebtSafe 
                  ? { '0%': '#06D6A0', '100%': '#FF6B35' }
                  : { '0%': '#EF476F', '100%': '#FFD23F' }
              }
            />
            <div className="d-flex justify-content-between mt-2">
              <span>Hiện tại: {formatCurrency(totalDebtPayment)}</span>
              <span>Giới hạn: {formatCurrency(debtLimit)}</span>
            </div>
            {data.monthlyIncome === 0 && (
              <Alert
                message="💡 Vào phần 'Tài khoản' để thiết lập thu nhập hàng tháng"
                type="warning"
                showIcon
                className="mt-3"
              />
            )}
          </div>
        }
        type={isDebtSafe ? 'success' : 'error'}
        showIcon
        icon={isDebtSafe ? null : <WarningOutlined />}
        className="mb-4"
      />

      {/* Debt List */}
      <Card
        title={<span className="card-title-custom">💳 Quản lý nợ</span>}
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
        {data.debts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CreditCardOutlined style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
            <p>Chưa có khoản nợ nào</p>
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={data.debts}
            renderItem={debt => {
              const monthlyPayment = debt.type === 'installment' 
                ? (debt.amount + (debt.amount * (debt.interestRate || 0) / 100)) / debt.months
                : debt.monthlyAmount;
              
              return (
                <List.Item
                  className="debt-item"
                  extra={
                    <Space>
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(debt)}
                      />
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(debt.id)}
                      />
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <span className="debt-title">{debt.name}</span>
                        <Tag color={debt.type === 'installment' ? 'orange' : 'blue'}>
                          {debt.type === 'installment' ? 'Trả góp' : 'Định kỳ'}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Descriptions size="small" column={1}>
                        <Descriptions.Item label="Tổng gốc">
                          {formatCurrency(debt.amount)}
                        </Descriptions.Item>
                        {debt.type === 'installment' ? (
                          <>
                            <Descriptions.Item label="Kỳ hạn">
                              {debt.months} tháng
                            </Descriptions.Item>
                            <Descriptions.Item label="Lãi suất">
                              {debt.interestRate}%/năm
                            </Descriptions.Item>
                          </>
                        ) : (
                          <>
                            {debt.dueDate && (
                              <Descriptions.Item label="Hạn thanh toán">
                                {new Date(debt.dueDate).toLocaleDateString('vi-VN')}
                              </Descriptions.Item>
                            )}
                          </>
                        )}
                        <Descriptions.Item label="Trả hàng tháng">
                          <span className="monthly-payment">{formatCurrency(monthlyPayment)}</span>
                        </Descriptions.Item>
                      </Descriptions>
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
        title={currentDebt ? 'Sửa khoản nợ' : 'Thêm khoản nợ'}
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
            type: 'installment'
          }}
        >
          <Form.Item
            label="Tên khoản nợ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên khoản nợ' }]}
          >
            <Input placeholder="Ví dụ: Thẻ tín dụng" size="large" />
          </Form.Item>

          <Form.Item
            label="Loại nợ"
            name="type"
            rules={[{ required: true }]}
          >
            <Select 
              size="large" 
              onChange={(value) => setDebtType(value)}
            >
              <Option value="installment">Trả góp tín dụng</Option>
              <Option value="recurring">Trả định kỳ (tiền nhà...)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Tổng số tiền gốc"
            name="amount"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
          >
            <Input type="number" placeholder="0" size="large" />
          </Form.Item>

          {debtType === 'installment' ? (
            <>
              <Form.Item
                label="Số tháng trả góp"
                name="months"
                rules={[{ required: true, message: 'Vui lòng nhập số tháng' }]}
              >
                <Input type="number" placeholder="12" size="large" />
              </Form.Item>

              <Form.Item
                label="Lãi suất (%/năm)"
                name="interestRate"
              >
                <Input type="number" step="0.1" placeholder="0" size="large" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="Số tiền phải trả/tháng"
                name="monthlyAmount"
                rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
              >
                <Input type="number" placeholder="0" size="large" />
              </Form.Item>

              <Form.Item
                label="Ngày hạn thanh toán"
                name="dueDate"
              >
                <DatePicker style={{ width: '100%' }} size="large" format="DD/MM/YYYY" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {currentDebt ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Debts;
