function getSpreadSheet(sheetName) {
    const SPREADSHEET_ID = '1sYmtz3CeYgnDRzJ9GgbjAJbUsZhBbiOFffDyI-g0Fd4';
    return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName || 'Sheet1');
}

function doGet(e) {
    const action = e.parameter.action;
    switch (action) {
        case "getExpenseTotalMonth":
            return getExpenseTotalMonth(e.parameter.sheetName);
        case "insertExpense":
            return insertExpense(e.parameter.sheetName, e.parameter.lastIndex, JSON.parse(e.parameter.data));
        case "updateExpense":
            return updateExpense(e.parameter.sheetName, e.parameter.id, JSON.parse(e.parameter.data));
        case "deleteExpense":
            return deleteExpense(e.parameter.sheetName, e.parameter.id);
        case "getExpenseTotal":
            return getExpenseTotal(e.parameter.sheetName);

        case "getSettingsByType":
            return getSettingsByType(e.parameter.sheetName, e.parameter.type);
        case "getAllSettings":
            return getAllSettings(e.parameter.sheetName);
        case "insertSettings":
            return insertSettings(e.parameter.sheetName, e.parameter.lastIndex, e.parameter.type, JSON.parse(e.parameter.data));
        case "updateSettings":
            return updateSettings(e.parameter.sheetName, e.parameter.type, JSON.parse(e.parameter.data));

        case "getAllHistory":
            return getActiveHistories(e.parameter.sheetName);
        case "insertHistory":
            return insertHistory(e.parameter.sheetName, JSON.parse(e.parameter.data));
        case "updateHistory":
            return updateHistory(e.parameter.sheetName, e.parameter.id, JSON.parse(e.parameter.data));
        case "deleteHistory":
            return deleteHistory(e.parameter.sheetName, e.parameter.id);

        default:
            return json({ success: false, message: "Invalid action" });
    }
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  return json({ success: false, message: "Invalid action" });
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
