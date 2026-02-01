import { httpGet } from "./callAxios";

const HistoryService = {
    API_URL: import.meta.env.VITE_AKIRA_SHEET_APP_URL,
    SHEET_NAME: "history_settings",
    
    async getAllHistory() {
        const res = await httpGet(this.API_URL, { action: 'getAllHistory', sheetName: this.SHEET_NAME });
        return res.data;
    },
    async insert(data) {
        const res = await httpGet(this.API_URL, { action: 'insertHistory', sheetName: this.SHEET_NAME,
           data: JSON.stringify(data) });
        return res.data;
    },
    async update(id, data) {
        const res = await httpGet(this.API_URL, { action: 'updateHistory', sheetName: this.SHEET_NAME, 
            id, data: JSON.stringify(data) });
        return res.data;
    },
    async delete(id) {
        const res = await httpGet(this.API_URL, { action: 'deleteHistory', sheetName: this.SHEET_NAME, 
            id });
        return res.data;
    },
}

export default HistoryService;