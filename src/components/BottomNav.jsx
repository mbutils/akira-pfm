import { Badge } from 'antd';
import '../styles/BottomNav.css';

function BottomNav({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'expenses', icon: '💸', label: 'Chi tiêu' },
    { id: 'debts', icon: '💳', label: 'Nợ' },
    { id: 'sales', icon: '🛍️', label: 'Bán hàng' },
    { id: 'accounts', icon: '🏦', label: 'Tài khoản' }
  ];

  return (
    <nav className="bottom-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-button ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => setCurrentTab(tab.id)}
        >
          <span className="nav-button-icon">{tab.icon}</span>
          <span className="nav-button-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
