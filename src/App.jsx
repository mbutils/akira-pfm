import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import Dashboard from './components/Dashboard';
import Expenses from './components/expense/Expenses';
import Debts from './components/Debts';
import Sales from './components/Sales';
import Accounts from './components/Accounts';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import { storage } from './utils/storage';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Ant Design CSS
import 'antd/dist/reset.css';
// Import custom styles
import './styles/main.css';
import SettingService from './services/settingService';
import { SheetProvider } from './utils/AppContext';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [data, setData] = useState({
    expenses: [],
    jars: [
      { id: 1, name: 'Sinh hoạt', amount: 0, icon: '🏠', color: '#FF6B35' },
      { id: 2, name: 'Giải trí', amount: 0, icon: '🎮', color: '#06D6A0' },
      { id: 3, name: 'Tiết kiệm', amount: 0, icon: '💰', color: '#FFD23F' },
      { id: 4, name: 'Đầu tư', amount: 0, icon: '📈', color: '#004E89' }
    ],
    debts: [],
    sales: [],
    accounts: [
      { id: 1, name: 'TK Cá nhân', balance: 0, type: 'personal', icon: '👤', color: '#FF6B35' },
      { id: 2, name: 'TK Kinh doanh', balance: 0, type: 'business', icon: '💼', color: '#06D6A0' },
      { id: 3, name: 'TK Trả nợ', balance: 0, type: 'debt', icon: '💳', color: '#EF476F' }
    ],
    monthlyIncome: 0
  });

  // Calculate total debt payment
  const totalDebtPayment = data.debts.reduce((sum, debt) => {
    const monthlyPayment = debt.type === 'installment' 
      ? (debt.amount + (debt.amount * (debt.interestRate || 0) / 100)) / debt.months
      : debt.monthlyAmount || 0;
    return sum + monthlyPayment;
  }, 0);

  // Check debt limit (40% of monthly income)
  const debtLimit = data.monthlyIncome * 0.4;
  const isDebtSafe = totalDebtPayment <= debtLimit;

  // Calculate dashboard stats
  const stats = {
    totalSales: data.sales.reduce((sum, sale) => sum + sale.sellPrice, 0),
    totalPurchases: data.sales.reduce((sum, sale) => sum + sale.buyPrice, 0),
    totalProfit: data.sales.reduce((sum, sale) => sum + (sale.sellPrice - sale.buyPrice), 0),
    totalDebt: totalDebtPayment,
    totalExpenses: data.expenses.reduce((sum, exp) => sum + exp.amount, 0),
    totalBalance: data.accounts.reduce((sum, acc) => sum + acc.balance, 0)
  };

  const remainingMoney = stats.totalBalance - stats.totalExpenses - stats.totalDebt;

  const renderContent = () => {
    switch(currentTab) {
      case 'dashboard':
        return <Dashboard 
          stats={stats} 
          remainingMoney={remainingMoney} 
          isDebtSafe={isDebtSafe} 
          debtLimit={debtLimit} 
          totalDebtPayment={totalDebtPayment}
          monthlyIncome={data.monthlyIncome}
        />;
      case 'expenses':
        return <Expenses data={data} setData={setData} />;
      case 'debts':
        return <Debts 
          data={data} 
          setData={setData} 
          isDebtSafe={isDebtSafe} 
          debtLimit={debtLimit} 
          totalDebtPayment={totalDebtPayment} 
        />;
      case 'sales':
        return <Sales data={data} setData={setData} />;
      case 'accounts':
        return <Accounts data={data} setData={setData} />;
      default:
        return <Dashboard stats={stats} remainingMoney={remainingMoney} />;
    }
  };

  return (
    <SheetProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#FF6B35',
            colorSuccess: '#06D6A0',
            colorWarning: '#FFD23F',
            colorError: '#EF476F',
            colorInfo: '#004E89',
            borderRadius: 12,
            fontFamily: "'iCielBree', 'Work Sans', sans-serif",
          },
        }}
      >
        <div className="app-container">
          {/* <Header /> */}
          <main className="content-main">
            {renderContent()}
          </main>
          <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
      </ConfigProvider>
    </SheetProvider>
  );
}

export default App;
