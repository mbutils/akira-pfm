const expenseHeaders = {
    expense: {row: 2, column: 1, numRows: 1, numColumns: 8, dataIndex: 3},
    categoryTotal: {row: 2, column: 10, numRows: 1, numColumns: 2, dataIndex: 3},
    sourceTotal: {row: 2, column: 13, numRows: 1, numColumns: 2, dataIndex: 3},
    jarTotal: {row: 2, column: 16, numRows: 1, numColumns: 2, dataIndex: 3},
}

function getExpenses(sheetName) {
    try {
        const sheet = getSpreadSheet(sheetName);
        if (!sheet) {
            return json({
                success: false,
                message: 'Không tìm thấy sheet: ' + sheetName
            });
        }


        const headersConfig = expenseHeaders['expense'];
        const lastRow = sheet.getLastRow();
        if (lastRow < headersConfig.row + 1) {
            return json({
                success: true,
                lastIndex: lastRow,
                data: [],
                headers: []
            });
        }

        const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
        const values = sheet.getRange(headersConfig.row + 1, headersConfig.column, lastRow - headersConfig.row, headersConfig.numColumns).getValues();
        
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

function insertExpense(sheetName, lastIndex, data) {
    try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
         return json({
           success: false,
           message: 'Không tìm thấy sheet: ' + sheetName
         });
       }

        const headersConfig = expenseHeaders['expense'];
       const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
        const newRowIndex = parseInt(lastIndex) + 1;
        headers.map((col, i) => {
            sheet.getRange(newRowIndex, i + 1).setValue(data[col] ?? '');
        });
    //    const newObj = headers.map(col => data[col] ?? '');
    //     sheet.appendRow(newObj);

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

function updateExpense(sheetName, id, data) {
    try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
         return json({
           success: false,
           message: 'Không tìm thấy sheet: ' + sheetName
         });
       }

        const headersConfig = expenseHeaders['expense'];
       const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
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

function deleteExpense(sheetName, id) {
    try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
         return json({
           success: false,
           message: 'Không tìm thấy sheet: ' + sheetName
         });
       }

        const headersConfig = expenseHeaders['expense'];
       const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
       headers.map((col, i) => {
            sheet.getRange(id, i + 1).setValue('');
        });

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

function getExpenseTotal(sheetName) {
    try {
        const sheet = getSpreadSheet(sheetName);
        if (!sheet) {
            return json({
                success: false,
                message: 'Không tìm thấy sheet: ' + sheetName
            });
        }

        const lastRow = sheet.getLastRow();
        const allData = {};
        Object.keys(expenseHeaders).forEach(type => {
            const headersConfig = expenseHeaders[type];
            let lastIndex = headersConfig.row;
            const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
            const values = sheet.getRange(headersConfig.row + 1, headersConfig.column, lastRow - headersConfig.row, headersConfig.numColumns).getValues();
            
            const rows = values.filter(row => row[0] !== "")
                .map((row, index) => {
                    const rowObject = { id: index + headersConfig.dataIndex };
                    headers.forEach((header, i) => {
                        rowObject[header] = row[i];
                    });
                    lastIndex = rowObject.id;
                    return rowObject;
                });
            if (type === 'expense') {
                allData[type] = {data: rows, lastIndex};
            } else {
                allData[type] = rows;
            }
        })

        return json({
            success: true,
            data: allData,
        });
    } catch (error) {
        return json({
            success: false,
            message: error.toString()
        });
    }
}

// function getExpenseTotal(sheetName) {
//     try {
//        const sheet = getSpreadSheet(sheetName);
//        if (!sheet) {
//          return json({
//            success: false,
//            message: 'Không tìm thấy sheet: ' + sheetName
//          });
//        }

//        const lastRow = sheet.getLastRow();
//        if (lastRow < 2) {
//          return json({
//            success: true,
//            data: [],
//            headers: []
//          });
//        }
        
//         const allData = {};
//         Object.keys(expenseHeaders).forEach(type => {
//             const headersConfig = expenseHeaders[type];
//            const headers = sheet.getRange(headersConfig.row, headersConfig.column, headersConfig.numRows, headersConfig.numColumns).getValues()[0];
//            const values = sheet.getRange(headersConfig.row + 1, headersConfig.column, lastRow - headersConfig.row, headersConfig.numColumns).getValues();

//            const rows = values.filter(row => row[0] !== "")
//             .map((row, index) => {
//              const rowObject = { id: index + headersConfig.dataIndex };
//              headers.forEach((header, i) => {
//                 rowObject[header] = row[i];
//             });
//             lastIndex = rowObject.id;
//              return rowObject;
//            });
          
//             allData[type] = rows;
//         });

//        return json({
//          success: true,
//          data: allData,
//        });
//     } catch (error) {
//        return json({
//          success: false,
//          message: error.toString()
//        });
//     }
// }