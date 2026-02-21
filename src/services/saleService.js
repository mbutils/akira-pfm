import { httpGet } from "./callAxios";


const SaleService = {
    API_URL: import.meta.env.VITE_AKIRA_SHEET_APP_URL,
    SHEET_NAME: "sales",

    async getSaleTotal(currentMonth) {
        const res = await httpGet(this.API_URL, { action: 'getSaleTotal', sheetName: this.SHEET_NAME, currentMonth });
        return res.data;
    },
    async getSales(currentMonth, statuses, productType) {
        const res = await httpGet(this.API_URL, { action: 'getSales', sheetName: this.SHEET_NAME, currentMonth,
            statuses: statuses?.join(','), productType });
        return res.data;
    },
    async insert(data) {
        const res = await httpGet(this.API_URL, { action: 'insertSale', sheetName: this.SHEET_NAME,
           data: JSON.stringify(data) });
        return res.data;
    },
    async update(id, data) {
        const res = await httpGet(this.API_URL, { action: 'updateSale', sheetName: this.SHEET_NAME, 
            id, data: JSON.stringify(data) });
        return res.data;
    },
    async delete(id) {
        const res = await httpGet(this.API_URL, { action: 'deleteSale', sheetName: this.SHEET_NAME, 
            id });
        return res.data;
    },
}

export default SaleService;