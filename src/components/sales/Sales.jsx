import { useEffect, useState } from 'react';
import { Card, Button, Modal, Tag, Statistic, Row, Col, Form, Select } from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined, RiseOutlined, FallOutlined,
  ShoppingCartOutlined, DownOutlined, UpOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/Sales.css';
import { SALES_CONS } from '../../utils/sales';
import SaleDetail from './SaleDetail';
import SaleService from '../../services/saleService';
import { useSheet } from '../../utils/AppContext';

function Sales() {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [dataSales, setDataSales] = useState([]);
  const [currentSale, setCurrentSale] = useState(null);
  const [showMore, setShowMore] = useState(true);
  const [saleFiltered, setSaleFiltered] = useState([]);
  const [saleDisplay, setSaleDisplay] = useState([]);

  const [loading, setLoading] = useState(false);
  const { currentMonth, messageApi, isMobile } = useSheet();
  const [form] = Form.useForm();
  const pageSize = isMobile ? 5 : 10;

  useEffect(() => {
    form.setFieldsValue({
      status: SALES_CONS.StatusOptions.filter(i => i.value !== 'sold').map(i => i.value),
      product_type: 'product',
    })
    loadData();
  }, []);

  function showMoreSales() {
    if (showMore) {
      if (saleDisplay.length + pageSize < saleFiltered.length) {
        setSaleDisplay([...saleDisplay.slice(0, saleDisplay.length + pageSize)]);
      } else {
        setSaleDisplay([...saleFiltered]);
        setShowMore(false);
      }
    } else {
      setSaleDisplay([...saleFiltered.slice(0, pageSize)]);
      setShowMore(true);
    }
  }

  function onChangeFilter(oriData) {
    const values = form.getFieldsValue();
    let filteredData = [...oriData] ?? [...dataSales];

    if (values.status && values.status.length > 0) {
      filteredData = filteredData.filter(sale => values.status.includes(sale.status));
    }

    if (values.product_type && values.product_type !== 'all') {
      filteredData = filteredData.filter(sale => sale.product_type === values.product_type);
    }

    setSaleFiltered(filteredData);
    setSaleDisplay([...filteredData.slice(0, pageSize)]);
    setShowMore(true);
  }

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
      .sort((a, b) => dayjs(b.buy_date, 'DD/MM/YYYY').toDate() - dayjs(a.buy_date, 'DD/MM/YYYY').toDate());
    setDataSales(newData);
    onChangeFilter(newData);
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
      onOk: async () => {
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
        <Form
          form={form}
          layout="vertical"
          onValuesChange={() => onChangeFilter()}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status">
                <Select placeholder="Chọn trạng thái" mode="multiple"
                  maxTagCount="responsive"
                  options={SALES_CONS.StatusOptions} 
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product_type">
                <Select placeholder="Chọn loại sản phẩm"
                  options={[{ value: 'all', label: 'Tất cả' }, ...SALES_CONS.ProductTypeOptions]}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {
          dataSales.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <ShoppingOutlined style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
              <p>Chưa có giao dịch nào</p>
            </div>
          ) : (
            <div className='sale-list'>
              {saleDisplay.map(sale => {
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
                        <Col span={8}>
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
          )
        }

        <Row>
          <Button className="sale-show-more-btn" color="default" variant="outlined"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={showMoreSales}
            icon={showMore ? <DownOutlined /> : <UpOutlined />}
          >
            {showMore ? "Thêm 5 dòng" : "Thu gọn"}
          </Button>
        </Row>
      </Card >

      <SaleDetail
        visible={openDetailModal}
        currentSale={currentSale}
        onClose={() => {
          setOpenDetailModal(false);
          setCurrentSale(null);
        }}
        onSubmit={loadData}
      ></SaleDetail>
    </div >
  );
}

export default Sales;
