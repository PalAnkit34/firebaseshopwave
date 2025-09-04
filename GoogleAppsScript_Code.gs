function doGet(e) {
  try {
    // Check if e exists and has required properties
    if (!e) {
      e = { parameter: {}, queryString: '' };
    }
    
    const parameter = e.parameter || {};
    const queryString = e.queryString || '';
    
    const method = parameter.method || 'GET';
    const action = parameter.action || 'list';
    
    // CORS headers
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    let result;
    
    if (method === 'GET') {
      if (action === 'list') {
        result = getProducts();
      } else if (action === 'get' && parameter.id) {
        result = getProduct(parameter.id);
      } else {
        result = { 
          error: 'Invalid action for GET method',
          availableActions: ['list', 'get'],
          receivedAction: action 
        };
      }
    } else {
      result = { error: 'Use POST for non-GET methods' };
    }
    
    output.setContent(JSON.stringify(result));
    return output;
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Internal server error: ' + error.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // Check if e exists
    if (!e) {
      e = { parameter: {}, postData: null };
    }
    
    const parameter = e.parameter || {};
    const postData = e.postData || {};
    const method = parameter.method || 'POST';
    
    let result;
    let data = {};
    
    // Parse POST data if available
    if (postData && postData.contents) {
      try {
        data = JSON.parse(postData.contents);
      } catch (parseError) {
        return ContentService.createTextOutput(JSON.stringify({
          error: 'Invalid JSON in request body: ' + parseError.toString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    if (method === 'POST') {
      result = addProduct(data);
    } else if (method === 'PUT') {
      if (!parameter.id) {
        result = { error: 'Product ID required for PUT method' };
      } else {
        result = updateProduct(parameter.id, data);
      }
    } else if (method === 'DELETE') {
      if (!parameter.id) {
        result = { error: 'Product ID required for DELETE method' };
      } else {
        result = deleteProduct(parameter.id);
      }
    } else {
      result = { 
        error: 'Unsupported method',
        supportedMethods: ['POST', 'PUT', 'DELETE'],
        receivedMethod: method 
      };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Internal server error: ' + error.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getProducts() {
  try {
    // Replace 'YOUR_SHEET_ID' with your actual Google Sheet ID
    const SHEET_ID = 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list';
    
    if (SHEET_ID === 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list') {
      return {
        error: 'Please configure your Google Sheet ID in the script',
        instruction: 'Replace https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list with your actual Google Sheet ID'
      };
    }
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return { products: [], count: 0, message: 'No data found in sheet' };
    }
    
    const headers = data[0];
    const products = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const product = {};
      
      headers.forEach((header, index) => {
        if (header === 'features' || header === 'images') {
          // Handle array fields
          product[header] = row[index] ? 
            row[index].toString().split(',').map(item => item.trim()).filter(item => item) : [];
        } else if (header === 'price_original' || header === 'price_discounted') {
          // Handle numeric fields
          product[header] = parseFloat(row[index]) || 0;
        } else if (header === 'quantity') {
          // Handle integer fields
          product[header] = parseInt(row[index]) || 0;
        } else {
          // Handle string fields
          product[header] = row[index] || '';
        }
      });
      
      products.push(product);
    }
    
    return { 
      products, 
      count: products.length,
      timestamp: new Date().toISOString(),
      success: true 
    };
    
  } catch (error) {
    Logger.log('Error in getProducts: ' + error.toString());
    return { 
      error: 'Failed to fetch products: ' + error.toString(),
      products: [],
      count: 0 
    };
  }
}

function addProduct(productData) {
  try {
    const SHEET_ID = 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list';
    
    if (SHEET_ID === 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list') {
      return {
        error: 'Please configure your Google Sheet ID in the script'
      };
    }
    
    if (!productData || Object.keys(productData).length === 0) {
      return { error: 'Product data is required' };
    }
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Create new row based on headers
    const newRow = headers.map(header => {
      if (header === 'features' || header === 'images') {
        return Array.isArray(productData[header]) ? 
          productData[header].join(', ') : (productData[header] || '');
      } else if (header === 'id' && !productData[header]) {
        // Auto-generate ID if not provided
        return 'P_' + Date.now();
      }
      return productData[header] || '';
    });
    
    sheet.appendRow(newRow);
    
    return { 
      success: true, 
      message: 'Product added successfully',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('Error in addProduct: ' + error.toString());
    return { 
      error: 'Failed to add product: ' + error.toString() 
    };
  }
}

function updateProduct(id, productData) {
  try {
    const SHEET_ID = 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list';
    
    if (SHEET_ID === 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list') {
      return {
        error: 'Please configure your Google Sheet ID in the script'
      };
    }
    
    if (!id) {
      return { error: 'Product ID is required' };
    }
    
    if (!productData || Object.keys(productData).length === 0) {
      return { error: 'Product data is required' };
    }
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    if (idIndex === -1) {
      return { error: 'ID column not found in sheet' };
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] == id) {
        headers.forEach((header, index) => {
          if (productData.hasOwnProperty(header)) {
            if (header === 'features' || header === 'images') {
              sheet.getRange(i + 1, index + 1).setValue(
                Array.isArray(productData[header]) ? 
                productData[header].join(', ') : productData[header]
              );
            } else {
              sheet.getRange(i + 1, index + 1).setValue(productData[header]);
            }
          }
        });
        
        return { 
          success: true, 
          message: 'Product updated successfully',
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return { error: 'Product not found with ID: ' + id };
    
  } catch (error) {
    Logger.log('Error in updateProduct: ' + error.toString());
    return { 
      error: 'Failed to update product: ' + error.toString() 
    };
  }
}

function deleteProduct(id) {
  try {
    const SHEET_ID = 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list';
    
    if (SHEET_ID === 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list') {
      return {
        error: 'Please configure your Google Sheet ID in the script'
      };
    }
    
    if (!id) {
      return { error: 'Product ID is required' };
    }
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    if (idIndex === -1) {
      return { error: 'ID column not found in sheet' };
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] == id) {
        sheet.deleteRow(i + 1);
        return { 
          success: true, 
          message: 'Product deleted successfully',
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return { error: 'Product not found with ID: ' + id };
    
  } catch (error) {
    Logger.log('Error in deleteProduct: ' + error.toString());
    return { 
      error: 'Failed to delete product: ' + error.toString() 
    };
  }
}

function getProduct(id) {
  try {
    const SHEET_ID = 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list';
    
    if (SHEET_ID === 'https://script.google.com/macros/s/AKfycbxH8e_F_8wwALwuVpqW6cELLXDcNx_2ZEs8hLX6PHMpgaTm-qn9Dex7pxKPFaxzMWB7/exec?method=GET&action=list') {
      return {
        error: 'Please configure your Google Sheet ID in the script'
      };
    }
    
    if (!id) {
      return { error: 'Product ID is required' };
    }
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    if (idIndex === -1) {
      return { error: 'ID column not found in sheet' };
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] == id) {
        const product = {};
        headers.forEach((header, index) => {
          if (header === 'features' || header === 'images') {
            product[header] = data[i][index] ? 
              data[i][index].toString().split(',').map(item => item.trim()).filter(item => item) : [];
          } else if (header === 'price_original' || header === 'price_discounted') {
            product[header] = parseFloat(data[i][index]) || 0;
          } else if (header === 'quantity') {
            product[header] = parseInt(data[i][index]) || 0;
          } else {
            product[header] = data[i][index] || '';
          }
        });
        
        return { 
          product,
          success: true,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return { error: 'Product not found with ID: ' + id };
    
  } catch (error) {
    Logger.log('Error in getProduct: ' + error.toString());
    return { 
      error: 'Failed to fetch product: ' + error.toString() 
    };
  }
}

// Test function to verify the script works
function testScript() {
  try {
    Logger.log('Testing script...');
    
    // Test getProducts function
    const result = getProducts();
    Logger.log('Test result: ' + JSON.stringify(result));
    
    return result;
  } catch (error) {
    Logger.log('Test error: ' + error.toString());
    return { error: 'Test failed: ' + error.toString() };
  }
}
