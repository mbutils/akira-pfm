import { httpGet } from "./callAxios";


const ExpenseService = {
    API_URL: import.meta.env.VITE_AKIRA_SHEET_APP_URL,
    SHEET_NAME: "expense_1_2026",

    getSheetName(currentMonth) {
        return `expense_${currentMonth?.month}_${currentMonth?.year}`;
    },
    
    async getTotalMonth(currentMonth) {
        const res = await httpGet(this.API_URL, { action: 'getExpenseTotalMonth', sheetName: this.getSheetName(currentMonth) });
        return res.data;
    },
    async insert(currentMonth, lastIndex, data) {
        const res = await httpGet(this.API_URL, { action: 'insertExpense', sheetName: this.getSheetName(currentMonth),
           lastIndex, data: JSON.stringify(data) });
        return res.data;
    },
    async update(currentMonth, id, data) {
        const res = await httpGet(this.API_URL, { action: 'updateExpense', sheetName: this.getSheetName(currentMonth), 
            id, data: JSON.stringify(data) });
        return res.data;
    },
    async delete(currentMonth, id) {
        const res = await httpGet(this.API_URL, { action: 'deleteExpense', sheetName: this.getSheetName(currentMonth), 
            id });
        return res.data;
    },
    async getTotal(currentMonth) {
        const res = await httpGet(this.API_URL, { action: 'getExpenseTotal', sheetName: this.getSheetName(currentMonth) });
        return res.data;
    },
}

export default ExpenseService;