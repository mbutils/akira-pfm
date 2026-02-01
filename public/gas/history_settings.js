const historyHeader = {row: 2, column: 1, numRows: 1, numColumns: 6, dataIndex: 3}

function getActiveHistories(sheetName) {
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

        const headers = sheet.getRange(historyHeader.row, historyHeader.column, historyHeader.numRows, historyHeader.numColumns).getValues()[0];
        const values = sheet.getRange(historyHeader.row + 1, historyHeader.column, lastRow - historyHeader.row, historyHeader.numColumns).getValues();
        
        const rows = values.filter(row => row[0] !== "")
            .map((row, index) => {
                const rowObject = { id: index + historyHeader.dataIndex };
                headers.forEach((header, i) => {
                    rowObject[header] = row[i];
                });
                return rowObject;
            });

        return json({
            success: true,
            data: rows,
            headers: headers,
        });
    } catch (error) {
        return json({
            success: false,
            message: error.toString()
        });
    }
}

function insertHistory(sheetName, data) {
    try {
        const sheet = getSpreadSheet(sheetName);
        if (!sheet) {
            return json({
                success: false,
                message: 'Không tìm thấy sheet: ' + sheetName
            });
        }

        const headers = sheet.getRange(historyHeader.row, historyHeader.column, historyHeader.numRows, historyHeader.numColumns).getValues()[0];
        const newObj = headers.map(col => data[col] ?? '');
        sheet.appendRow(newObj);

       return json({
         success: true,
         message: 'Đã thêm dòng thành công',
         rowIndex: sheet.getLastRow()
       });
    } catch (error) {
       return json({
         success: false,
         message: error.toString()
       });
    }
}

function updateHistory(sheetName, id, data) {
    try {
        const sheet = getSpreadSheet(sheetName);
        if (!sheet) {
            return json({
                success: false,
                message: 'Không tìm thấy sheet: ' + sheetName
            });
        }

        const headers = sheet.getRange(historyHeader.row, historyHeader.column, historyHeader.numRows, historyHeader.numColumns).getValues()[0];
        headers.map((col, i) => {
            sheet.getRange(id, i + 1).setValue(data[col] ?? '');
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

function deleteHistory(sheetName, id) {
    try {
        const sheet = getSpreadSheet(sheetName);
        if (!sheet) {
            return json({
                success: false,
                message: 'Không tìm thấy sheet: ' + sheetName
            });
        }
        sheet.deleteRow(id);

       return json({
         success: true,
         message: 'Đã xóa dòng thành công',
       });
    } catch (error) {
       return json({
         success: false,
         message: error.toString()
       });
    }
}

