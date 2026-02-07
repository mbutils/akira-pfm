import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Space, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, WalletOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/Expenses.css';
import ExpenseService from '../../services/expenseService';
import { useSheet } from '../../utils/AppContext';
import ExpenseDetailModal from './ExpenseDetailModal';
import LimitJarModal from './LimitJarModal';

function Expenses() {
  const { jars, loadSettings, messageApi, refresh, currentMonth, isMobile } = useSheet();
  const [lastIndex, setLastIndex] = useState(0);
  const [dataExpense, setDataExpense] = useState([]);
  const [expenseDisplay, setExpenseDisplay] = useState([]);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [expenseShowMore, setExpenseShowMore] = useState(true);

  const [loading, setLoading] = useState(true);

  const [jarDisplay, setJarDisplay] = useState([]);
  const [jarTotal, setJarTotal] = useState([]);
  const [jarShowMore, setJarShowMore] = useState(false);
  const [currentJar, setCurrentJar] = useState(null);
  const [addJarModal, setAddJarModal] = useState(false);

  useEffect(() => {
    initData();
  }, [currentMonth]);

  useEffect(() => {
    initJars();
  }, [isMobile, jars]);

  function initJars() {
    const jarsDis = [];
    if (isMobile) {
      jarsDis.push(...jars?.data?.slice(0, 6) || []);
    } else {
      jarsDis.push(...jars?.data?.slice(0, 8) || []);
    }
    setJarDisplay(jarsDis);
    setJarShowMore(false);
  }

  function showMoreJars() {
    if (jarShowMore) {
      initJars();
    } else {
      setJarDisplay(jars?.data || []);
    }
    setJarShowMore(!jarShowMore);
  }

  function showMoreExpenses() {
    if (expenseShowMore) {
      if (expenseDisplay.length + 10 < dataExpense.length) {
        setExpenseDisplay([...dataExpense.slice(0, expenseDisplay.length + 10)]);
      } else {
        setExpenseDisplay([...dataExpense]);
        setExpenseShowMore(false);
      }
    } else {
      setExpenseDisplay([...dataExpense.slice(0, 10)]);
      setExpenseShowMore(true);
    }
  }

  async function initData() {
    setLoading(true);
    const res = await ExpenseService.getTotal(currentMonth);

    setLoading(false);

    if (!res.success) {
      messageApi.open({
        type: 'error',
        content: 'Có lỗi rùi!',
      });
      return;
    }
    var newData = res.data.expense.data
      .sort((a, b) => dayjs(b.date, 'DD/MM/YYYY').toDate() - dayjs(a.date, 'DD/MM/YYYY').toDate())
      .sort((a, b) => b.id - a.id);
    setDataExpense(newData);
    setExpenseDisplay([...newData.slice(0, 10)]);
    setLastIndex(res.data.expense.lastIndex);
    setJarTotal(res.data.jarTotal || []);
  }

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setAddExpenseModal(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa khoản chi tiêu này?',
      okText: 'Xóa',
      centered: true,
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await ExpenseService.delete(currentMonth, id);
        initData();
      }
    });
  };

  function getJarTotal(jarId) {
    return jarTotal?.filter(t => t.jar_id === jarId)?.[0]?.total || 0;
  }
  function getJarTotalLimit() {
    let sum = 0;
    for (let i = 0; i < jars?.data?.length; i++) {
      sum += jars?.data?.[i]?.limit || 0;
    }
    return sum;
  }
  function getJarPercent(jarId) {
    const jarItem = jars?.data?.find(j => j.jar_id === jarId);
    if (!jarItem || !jarItem.limit) return 0;
    return Math.round(getJarTotal(jarId) / jarItem.limit * 100);
  }

  return (
    <div className="expenses-container">
      {/* Jar Cards */}
      <Card
        title={<span className="card-title-custom">🏺 Hũ chi tiêu</span>}
        loading={loadSettings}
        className="mb-4 glass-card"
        extra={
          <div className='jar-total-limit'>
            <span className="jar-amount" style={{ color: "#06D6A0" }}>{formatCurrency(getJarTotalLimit())}</span>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {jarDisplay.map((jarItem) => {
            return (
              <Col xs={12} sm={12} md={6} lg={6} key={jarItem.jar_id}>
                <Card
                  className="jar-card"
                  style={{ borderColor: "#06D6A0" }}
                >
                  <div className="text-center">
                    <div className="jar-name">{jarItem.name}</div>
                    <div className="jar-amount" style={{ color: "#06D6A0" }}>
                      {formatCurrency(getJarTotal(jarItem.jar_id))}
                    </div>
                    <div className="jar-limit" >
                      {formatCurrency(jarItem.limit || 0)}
                    </div>
                    <Progress percent={getJarPercent(jarItem.jar_id)}
                      status={getJarPercent(jarItem.jar_id) >= 100 ? 'exception' : 'normal'}
                      strokeColor={getJarPercent(jarItem.jar_id) >= 100 ? '' : '#06D6A0'}
                      format={percent => `${getJarPercent(jarItem.jar_id)}%`}
                      percentPosition={{ align: 'center', type: 'inner' }}
                      size={[300, 15]}
                    />
                  </div>
                  <div className="jar-actions">
                    <EditOutlined style={{ color: '#06D6A0' }}
                      onClick={() => {
                        setCurrentJar(jarItem);
                        setAddJarModal(true);
                      }}
                    />
                  </div>
                </Card>
              </Col>
            );
          })}

        </Row>
        <Row>
          <Button className="jar-show-more-btn" color="default" variant="outlined"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={showMoreJars}
            icon={jarShowMore ? <UpOutlined /> : <DownOutlined />}
          >
            {jarShowMore ? "Ẩn bớt" : "Xem tất cả"}
          </Button>
        </Row>
      </Card>

      {/* Expense List */}
      <Card
        title={<span className="card-title-custom">📝 Ghi chép chi tiêu</span>}
        loading={loading}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddExpenseModal(true)}
          >
            Thêm
          </Button>
        }
        className="glass-card"
      >
        {expenseDisplay.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <WalletOutlined style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
            <p>Chưa có khoản chi tiêu nào</p>
          </div>
        ) : (
          <div className='expense-list'>
            {expenseDisplay.map(expense => {
              const jarItem = jars?.data?.find(j => j.jar_id === expense.jar_id);
              return (
                <div key={expense.id} className="expense-item">
                  <div className="expense-item-content"
                    onClick={() => handleEdit(expense)}
                  >
                    <div className="expense-item-title">{expense.name}</div>
                    <div className="expense-item-description">
                      {isMobile ? (
                        <div>
                          <div>{jarItem?.name}</div>
                          <div>{new Date(expense.date).toLocaleDateString('vi-VN')}</div>
                        </div>
                      ) : (
                        <Space>
                          <span>{jarItem?.name}</span>
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString('vi-VN')}</span>
                        </Space>
                      )}
                    </div>
                  </div>
                  <div className="expense-amount"
                    onClick={() => handleEdit(expense)}
                  >
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="expense-item-actions">
                    {isMobile ? null : (
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(expense)}
                      />
                    )}
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(expense.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Row>
          <Button className="expense-show-more-btn" color="default" variant="outlined"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={showMoreExpenses}
            icon={expenseShowMore ? <DownOutlined /> : <UpOutlined />}
          >
            {expenseShowMore ? "Thêm 10 dòng" : "Thu gọn"}
          </Button>
        </Row>
      </Card>

      <ExpenseDetailModal
        visible={addExpenseModal}
        onClose={() => {
          setAddExpenseModal(false);
          setCurrentExpense(null);
        }}
        onSubmit={() => initData()}
        currentExpense={currentExpense}
        lastIndex={lastIndex}
      />
      <LimitJarModal
        visible={addJarModal}
        onClose={() => {
          setAddJarModal(false);
          setCurrentJar(null);
        }}
        onSubmit={() => refresh()}
        currentJar={currentJar}
      />
    </div>
  );
}

export default Expenses;
