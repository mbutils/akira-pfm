import { useEffect, useState } from 'react';
import { Card, Button, Modal, Tag, Statistic, Row, Col } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined, RiseOutlined, FallOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/Sales.css';
import { SALES_CONS } from '../../utils/sales';
import SaleDetail from './SaleDetail';
import SaleService from '../../services/saleService';
import { useSheet } from '../../utils/AppContext';

function Sales({ data, setData }) {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [dataSales, setDataSales] = useState([]);
  const [currentSale, setCurrentSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentMonth, messageApi, isMobile } = useSheet();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const res = await SaleService.getSales(currentMonth);
    setLoading(false);

    if (!res.success) {
      messageApi.open({
        type: 'error',
        content: 'Có lỗi rùi!',
      });
      return;
    }
    const newData = res.data
      .sort((a, b) => dayjs(b.buy_date, 'DD/MM/YYYY').toDate() - dayjs(a.buy_date, 'DD/MM/YYYY').toDate())
      .sort((a, b) => b.id - a.id);
    setDataSales(newData);
  }

  const handleEdit = (sale) => {
    setCurrentSale(sale);
    setOpenDetailModal(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa giao dịch này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async() => {
        await SaleService.delete(id);
        loadData();
      }
    });
  };

  function renderProfit(sale) {
    const profit = sale.sell_price - sale.buy_price;
    const profitPercent = ((profit / sale.buy_price) * 100).toFixed(1);
    const isProfit = profit >= 0;

    return (
      <Statistic
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
    )
  }

  return (
    <div className="sales-container">
      {/* Sales List */}
      <Card
        title={<span className="card-title-custom">🛍️ Quản lý bán hàng</span>}
        extra={
          <Button type="primary" icon={<PlusOutlined />}
            onClick={() => setOpenDetailModal(true)}
          >
            Thêm
          </Button>
        }
        className="glass-card"
        loading={loading}
      >
        {dataSales.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <ShoppingOutlined style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
            <p>Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className='sale-list'>
            {dataSales.map(sale => {

              return (
                <div className="sale-item">
                  <div className='item-header'>
                    <div className='sale-title'>
                      <span className='title-text'>{sale.name}</span>
                      <div className='sale-tag'>
                        <Tag color={sale.status === 'sold' ? 'red' : sale.status === 'stored' ? 'green' : 'orange'}>{SALES_CONS.Status[sale.status]}</Tag>
                        <Tag color="blue">{SALES_CONS.BuyType[sale.payment_type]}{SALES_CONS.BuyType.find(i => i.value === sale.payment_type).label}</Tag>
                        {sale.payment_type === 'installment' && (
                          <Tag>{sale.installment_months} tháng</Tag>
                        )}
                      </div>
                    </div>
                    {!isMobile && (
                      <div className='item-action'>
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(sale)} />
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(sale.id)} />
                      </div>
                    )}
                  </div>
                  <div className='sale-date'>
                    {new Date(sale.buy_date).toLocaleDateString('vi-VN')}
                    {isMobile ? (
                      <Col span={4}>
                        <div className='item-action'>
                          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(sale)} />
                          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(sale.id)} />
                        </div>
                      </Col>
                    ) : null}
                  </div>

                  <div className='item-body'>
                    <Row gutter={16}>
                      <Col span={isMobile ? 12 : 8}>
                        <Statistic
                          value={sale.buy_price}
                          prefix={<ShoppingCartOutlined />}
                          formatter={(value) => formatCurrency(value)}
                          valueStyle={{ fontSize: '1rem', color: '#FFD23F' }}
                        />
                      </Col>
                      <Col span={isMobile ? 12 : 8}>
                        <Statistic
                          value={sale.sell_price}
                          prefix={<ShoppingOutlined />}
                          formatter={(value) => formatCurrency(value)}
                          valueStyle={{ fontSize: '1rem', color: '#06D6A0' }}
                        />
                      </Col>

                      {!isMobile && sale.sell_price ? (
                        <Col span={8}>
                          {renderProfit(sale)}
                        </Col>
                      ) : null}
                    </Row>
                    {isMobile && sale.sell_price ? (
                      <Row gutter={16}>
                        <Col span={16}>
                          {renderProfit(sale)}
                        </Col>
                      </Row>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <SaleDetail
        visible={openDetailModal}
        currentSale={currentSale}
        onClose={() => {
          setOpenDetailModal(false);
          setCurrentSale(null);
        }}
        onSubmit={loadData}
      ></SaleDetail>
    </div>
  );
}

export default Sales;
