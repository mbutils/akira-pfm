import { DatePicker } from 'antd';
import '../styles/Header.css';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useSheet } from '../utils/AppContext';

function Header() {
  const [selectMonth, setSelectMonth] = useState(dayjs());
  const {setCurrentMonth} = useSheet();

  const onChange = (date) => {
    const month = date.month() + 1;
    const year = date.year();
    setCurrentMonth({month, year});
    setSelectMonth(date);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <label className="header-title">Akira PFM</label>
        <DatePicker picker="month" format={val => "Tháng " + val.format('MM-YYYY')}
          onChange={onChange} 
          value={selectMonth}
          placeholder="Chọn tháng"
          allowClear={false}
        />
      </div>
    </header>
  );
}

export default Header;
