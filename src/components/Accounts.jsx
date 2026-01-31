import { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Space, Statistic, Alert } from 'antd';
import { PlusOutlined, MinusOutlined, EditOutlined, BankOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/helpers';
import '../styles/Accounts.css';

function Accounts({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('deposit');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [form] = Form.useForm();
  const [incomeForm] = Form.useForm();

  const accountTypeLabels = {
    personal: 'Cá nhân',
    business: 'Kinh doanh',
    debt: 'Trả nợ'
  };

  const handleTransaction = (values) => {
    const transAmount = parseFloat(values.amount);
    setData({
      ...data,
      accounts: data.accounts.map(acc => 
        acc.id === selectedAccount.id 
          ? {
              ...acc,
              balance: transactionType === 'deposit' 
                ? acc.balance + transAmount 
                : acc.balance - transAmount
            }
          : acc
      )
    });
    setShowModal(false);
    form.resetFields();
    setSelectedAccount(null);
  };

  const handleIncomeUpdate = (values) => {
    setData({
      ...data,
      monthlyIncome: parseFloat(values.monthlyIncome)
    });
    setShowIncomeModal(false);
    incomeForm.resetFields();
  };

  const openTransaction = (account, type) => {
    setSelectedAccount(account);
    setTransactionType(type);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setSelectedAccount(null);
  };

  return (
    <div className="accounts-container">
      {/* Monthly Income Card */}
      <Card 
        title={<span className="card-title-custom">💰 Thu nhập hàng tháng</span>}
        extra={
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => {
              incomeForm.setFieldsValue({ monthlyIncome: data.monthlyIncome });
              setShowIncomeModal(true);
            }}
          >
            Sửa
          </Button>
        }
        className="mb-4 glass-card"
      >
        <Statistic
          value={data.monthlyIncome}
          formatter={(value) => formatCurrency(value)}
          valueStyle={{ color: '#06D6A0', fontSize: '2.5rem', fontWeight: 700 }}
        />
        <div className="mt-3">
          <Alert
            message={`Giới hạn trả nợ (40%): ${formatCurrency(data.monthlyIncome * 0.4)}`}
            type="info"
            showIcon
          />
        </div>
      </Card>

      {/* Accounts Grid */}
      <Card 
        title={<span className="card-title-custom">🏦 Tài khoản</span>}
        className="mb-4 glass-card"
      >
        <Row gutter={[16, 16]}>
          {data.accounts.map(account => (
            <Col xs={24} sm={12} md={8} key={account.id}>
              <Card 
                className="account-card"
                style={{ borderColor: account.color }}
                hoverable
              >
                <div className="text-center">
                  <div className="account-icon">{account.icon}</div>
                  <div className="account-name">{account.name}</div>
                  <div className="account-balance" style={{ color: account.color }}>
                    {formatCurrency(account.balance)}
                  </div>
                  <div className="account-type">{accountTypeLabels[account.type]}</div>
                  <Space className="mt-3" style={{ width: '100%' }}>
                    <Button 
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => openTransaction(account, 'deposit')}
                      block
                      style={{ 
                        background: 'linear-gradient(135deg, #06D6A0 0%, #00E5B3 100%)',
                        border: 'none'
                      }}
                    >
                      Nạp
                    </Button>
                    <Button 
                      danger
                      icon={<MinusOutlined />}
                      onClick={() => openTransaction(account, 'withdraw')}
                      block
                    >
                      Rút
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Guide Card */}
      <Card 
        title={<span className="card-title-custom">💡 Hướng dẫn sử dụng</span>}
        className="guide-card"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <strong>👤 TK Cá nhân:</strong> Dùng cho chi tiêu hàng ngày
          </div>
          <div>
            <strong>💼 TK Kinh doanh:</strong> Nhập hàng và nhận tiền bán
          </div>
          <div>
            <strong>💳 TK Trả nợ:</strong> Trích riêng để trả nợ đúng hạn
          </div>
          <Alert
            message="Lưu ý: Tổng tiền trả nợ hàng tháng không nên vượt quá 40% thu nhập"
            type="warning"
            showIcon
          />
        </Space>
      </Card>

      {/* Transaction Modal */}
      <Modal
        title={
          <Space>
            {transactionType === 'deposit' ? '💰 Nạp tiền' : '💸 Rút tiền'}
          </Space>
        }
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Card 
          size="small" 
          className="mb-3"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Tài khoản</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
              {selectedAccount?.icon} {selectedAccount?.name}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Số dư hiện tại: {formatCurrency(selectedAccount?.balance || 0)}
            </div>
          </Space>
        </Card>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleTransaction}
        >
          <Form.Item
            label="Số tiền"
            name="amount"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
          >
            <Input 
              type="number" 
              placeholder="0" 
              size="large" 
              autoFocus
              prefix="₫"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button 
                type="primary" 
                htmlType="submit"
                danger={transactionType === 'withdraw'}
                style={transactionType === 'deposit' ? {
                  background: 'linear-gradient(135deg, #06D6A0 0%, #00E5B3 100%)',
                  border: 'none'
                } : {}}
              >
                {transactionType === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Income Modal */}
      <Modal
        title="💰 Thu nhập hàng tháng"
        open={showIncomeModal}
        onCancel={() => {
          setShowIncomeModal(false);
          incomeForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={incomeForm}
          layout="vertical"
          onFinish={handleIncomeUpdate}
        >
          <Form.Item
            label="Thu nhập cố định từ lương"
            name="monthlyIncome"
            rules={[{ required: true, message: 'Vui lòng nhập thu nhập' }]}
          >
            <Input 
              type="number" 
              placeholder="0" 
              size="large" 
              autoFocus
              prefix="₫"
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate
          >
            {({ getFieldValue }) => {
              const income = parseFloat(getFieldValue('monthlyIncome') || 0);
              return income > 0 ? (
                <Card 
                  size="small" 
                  className="mb-3"
                  style={{ 
                    background: 'rgba(255, 210, 63, 0.1)',
                    border: '1px solid #FFD23F'
                  }}
                >
                  <Statistic
                    title="Giới hạn trả nợ (40%)"
                    value={income * 0.4}
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ color: '#FFD23F', fontSize: '1.5rem', fontWeight: 700 }}
                  />
                </Card>
              ) : null;
            }}
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setShowIncomeModal(false);
                incomeForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Accounts;
