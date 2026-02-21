

 
const salesHeader = { row: 2, column: 1, numRows: 1, numColumns: 12, dataIndex: 3 }
const saleTotalHeader = { row: 2, column: 14, numRows: 1, numColumns: 3, dataIndex: 3 }

function getSales(sheetName, statuses, productType) {
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

       const headers = sheet.getRange(salesHeader.row, salesHeader.column, salesHeader.numRows, salesHeader.numColumns).getValues()[0];
       const values = sheet.getRange(salesHeader.row + 1, salesHeader.column, lastRow - salesHeader.row, salesHeader.numColumns).getValues();

       const rows = values.filter(row => row[0] !== "")
           .map((row, index) => {
               const rowObject = { id: index + salesHeader.dataIndex };
               headers.forEach((header, i) => {
                   rowObject[header] = row[i];
               });
               return rowObject;
           })
           .filter(row => {
               if (statuses && statuses.length > 0 && !statuses.includes(row.status)) {
                   return false;
               }
               if (productType && productType !== 'all' && row.product_type !== productType) {
                   return false;
               }
               return true;
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

function insertSale(sheetName, data) {
   try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
           return json({
               success: false,
               message: 'Không tìm thấy sheet: ' + sheetName
           });
       }

       const headers = sheet.getRange(salesHeader.row, salesHeader.column, salesHeader.numRows, salesHeader.numColumns).getValues()[0];
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

function updateSale(sheetName, id, data) {
   try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
           return json({
               success: false,
               message: 'Không tìm thấy sheet: ' + sheetName
           });
       }

       const headers = sheet.getRange(salesHeader.row, salesHeader.column, salesHeader.numRows, salesHeader.numColumns).getValues()[0];
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

function deleteSale(sheetName, id) {
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

function getSaleTotal(sheetName) {
   try {
       const sheet = getSpreadSheet(sheetName);
       if (!sheet) {
           return json({
               success: false,
               message: 'Không tìm thấy sheet: ' + sheetName
           });
       }

       const headers = sheet.getRange(saleTotalHeader.row, saleTotalHeader.column, saleTotalHeader.numRows, saleTotalHeader.numColumns).getValues()[0];
       const values = sheet.getRange(saleTotalHeader.row + 1, saleTotalHeader.column, 1, saleTotalHeader.numColumns).getValues();

       const rows = values.filter(row => row[0] !== "")
           .map((row, index) => {
               const rowObject = { id: index + saleTotalHeader.dataIndex };
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