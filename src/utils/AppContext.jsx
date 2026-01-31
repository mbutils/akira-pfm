import { createContext, useContext, useEffect, useState } from "react";
import SettingService from "../services/settingService";
import { message } from 'antd';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const [jars, setJars] = useState({ data: []});
  const [account, setAccount] = useState({ data: []});
  const [categories, setCategories] = useState({ data: []});
  const [expenseSrcs, setExpenseSrcs] = useState({ data: []});
  const [debtSrcs, setDebtSrcs] = useState({ data: []});
  const [setKeys, setSetKeys] = useState({ data: []});
  
  const [loadSettings, setLoadSettings] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();

    const loadAllData = async () => {
        setLoadSettings(true);
        const res = await SettingService.getAllSettings();
        console.log("setting",res);
        
        setLoadSettings(false);

        setJars({ ...res.data.jar, data: res.data.jar.data || []});
        setAccount({ ...res.data.account, data: res.data.account.data || []});
        setCategories({ ...res.data.category, data: res.data.category.data || []});
        setExpenseSrcs({ ...res.data.expenseSrc, data: res.data.expenseSrc.data || []});
        setDebtSrcs({ ...res.data.debtSrc, data: res.data.debtSrc.data || []});
        setSetKeys({ ...res.data.setKey, data: res.data.setKey.data || []});

    //     const accountRes = await SettingService.getAccounts();
    //     setAccount(accountRes.data);
    //     setLoadAccount(false);

    //     const categoryRes = await SettingService.getCategories();
    //     setCategories(categoryRes.data);
    //     setLoadCategory(false);

    //     const expenseSrcRes = await SettingService.getExpenseSources();
    //     setExpenseSrcs(expenseSrcRes.data);
    //     setLoadExpenseSrc(false);

    //     const debtSrcRes = await SettingService.getDebtSources();
    //     setDebtSrcs(debtSrcRes.data);
    //     setLoadDebtSrc(false);

    //     const setKeyRes = await SettingService.getSetKeys();
    //     setSetKeys(setKeyRes.data);
    //     setLoadSetKey(false);
    };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <SheetContext.Provider value={{ jars, account, categories, expenseSrcs, debtSrcs, setKeys, 
        loadSettings, refresh: loadAllData, messageApi }}
    >
        {contextHolder}
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = () => useContext(SheetContext);
