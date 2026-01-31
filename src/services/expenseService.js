import { httpGet, httpPost } from "./callAxios";


const ExpenseService = {
    API_URL: import.meta.env.VITE_AKIRA_SHEET_APP_URL,
    SHEET_NAME: "expense_1_2026",
    
    async getAll() {
        const res = await httpGet(this.API_URL, { action: 'getExpenses', sheetName: this.SHEET_NAME });
        return res.data;
    },
    async insert(lastIndex, data) {
        const res = await httpGet(this.API_URL, { action: 'insertExpense', sheetName: this.SHEET_NAME,
           lastIndex, data: JSON.stringify(data) });
        return res.data;
    },
    async update(id, data) {
        const res = await httpGet(this.API_URL, { action: 'updateExpense', sheetName: this.SHEET_NAME, 
            id, data: JSON.stringify(data) });
        return res.data;
    },
    async delete(id) {
        const res = await httpGet(this.API_URL, { action: 'deleteExpense', sheetName: this.SHEET_NAME, 
            id });
        return res.data;
    },
    async getTotal() {
        const res = await httpGet(this.API_URL, { action: 'getExpenseTotal', sheetName: this.SHEET_NAME });
        return res.data;
    },
}

export default ExpenseService;