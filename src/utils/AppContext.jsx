import { createContext, useContext, useEffect, useState } from "react";
import SettingService from "../services/settingService";
import { message } from 'antd';
import dayjs from "dayjs";

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
    const [jars, setJars] = useState({ data: [] });
    const [accounts, setAccounts] = useState({ data: [] });
    const [categories, setCategories] = useState({ data: [] });
    const [expenseSrcs, setExpenseSrcs] = useState({ data: [] });
    const [debtSrcs, setDebtSrcs] = useState({ data: [] });
    const [setKeys, setSetKeys] = useState({ data: [] });

    const [loadSettings, setLoadSettings] = useState(true);
    const [currentMonth, setCurrentMonth] = useState({month: dayjs().month() + 1, year: dayjs().year()});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [messageApi, contextHolder] = message.useMessage();

    const loadAllData = async () => {
        setLoadSettings(true);
        const res = await SettingService.getAllSettings();
        console.log("all settings",res);

        setLoadSettings(false);

        setJars({ ...res.data.jar, data: res.data.jar.data || [] });
        setAccounts({ ...res.data.account, data: res.data.account.data || [] });
        setCategories({ ...res.data.category, data: res.data.category.data || [] });
        setExpenseSrcs({ ...res.data.expenseSrc, data: res.data.expenseSrc.data || [] });
        setDebtSrcs({ ...res.data.debtSrc, data: res.data.debtSrc.data || [] });
        setSetKeys({ ...res.data.setKey, data: res.data.setKey.data || [] });
    };

    useEffect(() => {
        loadAllData();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <SheetContext.Provider value={{
            jars, accounts, categories, expenseSrcs, debtSrcs, setKeys,
            loadSettings, refresh: loadAllData, messageApi,
            setCurrentMonth, currentMonth, isMobile
        }}
        >
            {contextHolder}
            {children}
        </SheetContext.Provider>
    );
};

export const useSheet = () => useContext(SheetContext);
