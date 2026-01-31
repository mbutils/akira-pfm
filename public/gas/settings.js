const settingHeaders = {
    jar: { row: 2, column: 1, numRows: 1, numColumns: 3, dataIndex: 3 },
    account: { row: 2, column: 5, numRows: 1, numColumns: 2, dataIndex: 3 },
    category: { row: 2, column: 8, numRows: 1, numColumns: 2, dataIndex: 3 },
    expenseSrc: { row: 2, column: 11, numRows: 1, numColumns: 2, dataIndex: 3 },
    debtSrc: { row: 2, column: 14, numRows: 1, numColumns: 2, dataIndex: 3 },
    setKey: { row: 2, column: 17, numRows: 1, numColumns: 2, dataIndex: 3 },
}

function getSettingsByType(sheetName, type) {
    try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
         return json({
           success: false,
           message: 'Không tìm thấy sheet: ' + sheetName
         });
       }

       const lastRow = sheet.getLastRow();
       if (lastRow < 2) {
         return json({
           success: true,
           data: [],
           headers: []
         });
       }
        const headersConfig = settingHeaders[type];
       // sheet.getRange(row, column, numRows, numColumns)
       const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
       const values = sheet.getRange(headersConfig.row + 1, headersConfig.column, lastRow - headersConfig.row, headersConfig.numColumns).getValues();
       var lastIndex = 0;

       const rows = values.filter(row => row[0] !== "")
        .map((row, index) => {
         const rowObject = { id: index + headersConfig.dataIndex };
         headers.forEach((header, i) => {
            rowObject[header] = row[i];
        });
        lastIndex = rowObject.id;
         return rowObject;
       });

       return json({
         success: true,
         data: rows,
         headers: headers,
         lastIndex: lastIndex
       });
    } catch (error) {
       return json({
         success: false,
         message: error.toString()
       });
    }
}

function getAllSettings(sheetName) {
    try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
         return json({
           success: false,
           message: 'Không tìm thấy sheet: ' + sheetName
         });
       }

       const lastRow = sheet.getLastRow();
       if (lastRow < 2) {
         return json({
           success: true,
           data: [],
           headers: []
         });
       }
        const allData = {};

        Object.keys(settingHeaders).forEach(type => {
            const config = settingHeaders[type];
            const headers = sheet.getRange(config.row, config.column, config.numRows, config.numColumns).getValues()[0];
            const values = sheet.getRange(config.row + 1, config.column, lastRow - config.row, config.numColumns).getValues();
            var lastIndex = 0;

            const rows = values.filter(row => row[0] !== "")
                .map((row, index) => {
                const rowObject = { id: index + config.dataIndex };
                headers.forEach((header, i) => {
                    rowObject[header] = row[i];
                });
                lastIndex = rowObject.id;
                return rowObject;
            });

            allData[type] = {
                data: rows,
                headers: headers,
                lastIndex: lastIndex
            };
        });

       return json({
         success: true,
         data: allData
       });
    } catch (error) {
       return json({
         success: false,
         message: error.toString()
       });
    }
}


function insertSettings(sheetName, lastIndex, type, data) {
    try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
         return json({
           success: false,
           message: 'Không tìm thấy sheet: ' + sheetName
         });
       }

        const headersConfig = settingHeaders[type];
       const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
       const newRowIndex = parseInt(lastIndex) + 1;
       headers.map((col, i) => {
            sheet.getRange(newRowIndex, i + 1).setValue(data[col] || '');
        });

       return json({
         success: true,
         message: 'Đã thêm dòng thành công',
         rowIndex: newRowIndex
       });
    } catch (error) {
       return json({
         success: false,
         message: error.toString()
       });
    }
}

function updateSettings(sheetName, type, data) {
    try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
         return json({
           success: false,
           message: 'Không tìm thấy sheet: ' + sheetName
         });
       }

        const headersConfig = settingHeaders[type];
       const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
       headers.map((col, i) => {
            sheet.getRange(data.id, i + 1).setValue(data[col] || '');
        });

       return json({
         success: true,
         message: 'Đã cập nhật dòng thành công',
       });
    } catch (error) {
       return json({
         success: false,
         message: error.toString()
       });
    }
}