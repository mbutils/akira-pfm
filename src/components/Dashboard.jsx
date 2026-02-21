import { Card, Row, Col, Statistic, Progress, Alert, Badge } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  CreditCardOutlined,
  WalletOutlined,
  SmileOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { formatCurrency } from '../utils/helpers';
import '../styles/Dashboard.css';
import { useSheet } from '../utils/AppContext';
import ExpenseService from '../services/expenseService';
import { useEffect, useState } from 'react';
import SaleService from '../services/saleService';

function Dashboard({ stats, remainingMoney, isDebtSafe, debtLimit, totalDebtPayment, monthlyIncome }) {
  const debtPercentage = debtLimit > 0 ? Math.min((totalDebtPayment / debtLimit) * 100, 100) : 0;
  const { currentMonth } = useSheet();
  const [dataDashboard, setDataDashboard] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    initData();
  }, [currentMonth]);

  async function initData() {
    const data = {};
    setLoading({ 
      expense: true,
      sales: true,
    });

    // total expense
    ExpenseService.getTotalMonth(currentMonth)
      .then(res => {
        data.expense = res.data[0]?.total_month ?? 0;
        setDataDashboard({ ...data });
      })
      .finally(() => {
        setLoading({ expense: false });
      });
    
    SaleService.getSaleTotal(currentMonth)
      .then(res => {
        data.sales = res.data[0] ?? {};
        setDataDashboard({ ...data });
      })
      .finally(() => {
        setLoading({ sales: false });
      });
  }

  return (
    <div className="dashboard-container">
      {/* Stats Grid */}
      <Row gutter={[16, 16]} className="mb-4">

        <Col xs={12} sm={12} md={8} lg={8}>
          <Card className="stat-card stat-card-warning">
            <Statistic
              title={<span className="stat-title">💸 Chi cá nhân</span>}
              value={dataDashboard.expense}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#FFD23F', fontWeight: 700 }}
              prefix={<WalletOutlined />}
              loading={loading.expense}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={8} lg={8}>
          <Card className="stat-card stat-card-success">
            <Statistic
              title={<span className="stat-title">💰 Tổng bán</span>}
              value={dataDashboard.sales?.total_sell ?? 0}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#06D6A0', fontWeight: 700 }}
              prefix={<DollarOutlined />}
              loading={loading.sales}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={8} lg={8}>
          <Card className="stat-card stat-card-info">
            <Statistic
              title={<span className="stat-title">🛒 Tổng nhập</span>}
              value={dataDashboard.sales?.total_buy ?? 0}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#004E89', fontWeight: 700 }}
              prefix={<ShoppingCartOutlined />}
              loading={loading.sales}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={8} lg={8}>
          <Card className="stat-card stat-card-primary">
            <Statistic
              title={<span className="stat-title">📈 Lợi nhuận</span>}
              value={dataDashboard.sales?.total_revenue ?? 0}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#FF6B35', fontWeight: 700 }}
              prefix={<RiseOutlined />}
              loading={loading.sales}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={8} lg={8}>
          <Card className={`stat-card ${isDebtSafe ? 'stat-card-success' : 'stat-card-danger'}`}>
            <Statistic
              title={<span className="stat-title">💳 Trả nợ</span>}
              value={stats.totalDebt}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{
                color: isDebtSafe ? '#06D6A0' : '#EF476F',
                fontWeight: 700
              }}
              prefix={<CreditCardOutlined />}
            />
            {!isDebtSafe && (
              <Badge.Ribbon text="⚠️ Vượt 40%" color="red">
                <div style={{ height: '10px' }}></div>
              </Badge.Ribbon>
            )}
          </Card>
        </Col>

        <Col xs={12} sm={12} md={8} lg={8}>
          <Card className={`stat-card ${remainingMoney >= 0 ? 'stat-card-success' : 'stat-card-danger'}`}>
            <Statistic
              title={<span className="stat-title">✨ Còn lại</span>}
              value={remainingMoney}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{
                color: remainingMoney >= 0 ? '#06D6A0' : '#EF476F',
                fontWeight: 700
              }}
              prefix={remainingMoney >= 0 ? <SmileOutlined /> : <WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Debt Warning */}
      {!isDebtSafe && monthlyIncome > 0 && (
        <Alert
          message="⚠️ Cảnh báo nợ"
          description={
            <div>
              <p>Tổng tiền trả nợ hàng tháng đang vượt quá 40% thu nhập cố định!</p>
              <Progress
                percent={debtPercentage}
                status="exception"
                strokeColor={{
                  '0%': '#EF476F',
                  '100%': '#FFD23F',
                }}
              />
              <div className="d-flex justify-content-between mt-2">
                <span>Hiện tại: {formatCurrency(totalDebtPayment)}</span>
                <span>Giới hạn: {formatCurrency(debtLimit)}</span>
              </div>
            </div>
          }
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {/* Account Overview */}
      <Card
        title={<span className="card-title-custom">💡 Tổng quan tài khoản</span>}
        className="overview-card"
      >
        <Statistic
          title="Tổng số dư tất cả tài khoản"
          value={stats.totalBalance}
          formatter={(value) => formatCurrency(value)}
          valueStyle={{ color: '#06D6A0', fontSize: '2rem', fontWeight: 700 }}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
