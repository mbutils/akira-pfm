import { httpGet } from "./callAxios";


const SettingService = {
    API_URL: import.meta.env.VITE_AKIRA_SHEET_APP_URL,
    SHEET_NAME: "settings",
    
    async getSettingsByType(type) {
        const res = await httpGet(this.API_URL, { action: 'getSettingsByType', sheetName: this.SHEET_NAME, type: type });
        return res.data;
    },
    async getAllSettings() {
        const res = await httpGet(this.API_URL, { action: 'getAllSettings', sheetName: this.SHEET_NAME });
        return res.data;
    },
    async updateSettings(type, data) {
        const res = await httpGet(this.API_URL, { action: 'updateSettings', sheetName: this.SHEET_NAME, 
            type, data: JSON.stringify(data) });
        return res.data;
    },
}

export default SettingService;