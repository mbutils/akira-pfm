import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Space, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, WalletOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/helpers';
import '../../styles/Expenses.css';
import ExpenseService from '../../services/expenseService';
import { useSheet } from '../../utils/AppContext';
import ExpenseDetailModal from './ExpenseDetailModal';
import LimitJarModal from './LimitJarModal';

function Expenses() {
  const { jars, loadSettings, messageApi, refresh, currentMonth, isMobile } = useSheet();
  const [dataExpense, setDataExpense] = useState([]);
  const [jarTotal, setJarTotal] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [addJarModal, setAddJarModal] = useState(false);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [currentJar, setCurrentJar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initData();
  }, [currentMonth]);

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
            <span className="card-title-custom me-1">Tổng giới hạn: </span>
            <span className="jar-amount" style={{ color: "#06D6A0" }}>{formatCurrency(getJarTotalLimit())}</span>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {jars?.data?.map(jarItem => {
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
        {dataExpense.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <WalletOutlined style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
            <p>Chưa có khoản chi tiêu nào</p>
          </div>
        ) : (
          <div className='expense-list'>
            {dataExpense.map(expense => {
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
