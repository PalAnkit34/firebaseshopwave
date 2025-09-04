/**
 * Google Apps Script for E-commerce Product Management
 * This script provides API endpoints for CRUD operations on product data stored in Google Sheets
 */

// Configuration
const SHEET_NAME = 'Products'; // Name of the sheet containing product data
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://your-domain.com', // Replace with your actual domain
  'https://your-vercel-app.vercel.app' // Replace with your Vercel URL
];

/**
 * Main function to handle all HTTP requests
 */
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

/**
 * Central request handler
 */
function handleRequest(e) {
  try {
    // Enable CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600'
    };
    
    // Handle preflight OPTIONS request
    if (e && e.parameter && e.parameter.method === 'OPTIONS') {
      return output.setContent(JSON.stringify({ status: 'OK' }));
    }
    
    const method = e.parameter.method || 'GET';
    const action = e.parameter.action || 'list';
    
    let response;
    
    switch (method.toUpperCase()) {
      case 'GET':
        response = handleGet(e);
        break;
      case 'POST':
        response = handlePost(e);
        break;
      case 'PUT':
        response = handlePut(e);
        break;
      case 'DELETE':
        response = handleDelete(e);
        break;
      default:
        response = { error: 'Method not allowed', status: 405 };
    }
    
    return output.setContent(JSON.stringify(response));
    
  } catch (error) {
    console.error('Error in handleRequest:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: error.toString(),
        status: 500 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests
 */
function handleGet(e) {
  const action = e.parameter.action || 'list';
  
  switch (action) {
    case 'list':
      return getAllProducts(e);
    case 'get':
      return getProduct(e.parameter.id);
    case 'search':
      return searchProducts(e.parameter.query);
    case 'category':
      return getProductsByCategory(e.parameter.category);
    default:
      return { error: 'Invalid action', status: 400 };
  }
}

/**
 * Handle POST requests (Create new product)
 */
function handlePost(e) {
  try {
    const postData = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    return createProduct(postData);
  } catch (error) {
    return { error: 'Invalid JSON data', status: 400 };
  }
}

/**
 * Handle PUT requests (Update product)
 */
function handlePut(e) {
  try {
    const putData = e.postData ? JSON.parse(e.postData.contents) : e.parameter;
    const id = putData.id || e.parameter.id;
    return updateProduct(id, putData);
  } catch (error) {
    return { error: 'Invalid JSON data', status: 400 };
  }
}

/**
 * Handle DELETE requests
 */
function handleDelete(e) {
  const id = e.parameter.id;
  return deleteProduct(id);
}

/**
 * Get the Google Sheet
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Create sheet if it doesn't exist
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    initializeSheet(sheet);
  }
  
  return sheet;
}

/**
 * Initialize sheet with headers
 */
function initializeSheet(sheet) {
  const headers = [
    'id', 'slug', 'name', 'brand', 'category', 'subcategory',
    'price_original', 'price_currency', 'quantity', 'description',
    'features', 'ratings_average', 'ratings_count', 'extraImages',
    'created_at', 'updated_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
}

/**
 * Convert sheet row to product object
 */
function rowToProduct(row, headers) {
  const product = {};
  headers.forEach((header, index) => {
    let value = row[index];
    
    // Convert specific fields
    switch (header) {
      case 'price_original':
        product[header] = parseFloat(value) || 0;
        break;
      case 'quantity':
        product[header] = parseInt(value) || 0;
        break;
      case 'ratings_average':
        product[header] = parseFloat(value) || 0;
        break;
      case 'ratings_count':
        product[header] = parseInt(value) || 0;
        break;
      case 'extraImages':
        product[header] = value ? value.split(',').map(img => img.trim()) : [];
        break;
      case 'features':
        product[header] = value ? value.split(',').map(feature => feature.trim()) : [];
        break;
      default:
        product[header] = value || '';
    }
  });
  
  return product;
}

/**
 * Convert product object to sheet row
 */
function productToRow(product, headers) {
  return headers.map(header => {
    let value = product[header];
    
    switch (header) {
      case 'extraImages':
      case 'features':
        return Array.isArray(value) ? value.join(', ') : (value || '');
      case 'created_at':
      case 'updated_at':
        return value || new Date().toISOString();
      default:
        return value !== undefined ? value : '';
    }
  });
}

/**
 * Get all products
 */
function getAllProducts(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { success: true, data: [], count: 0 };
    }
    
    const headers = data[0];
    const products = data.slice(1).map(row => rowToProduct(row, headers));
    
    // Apply filters if provided
    let filteredProducts = products;
    
    if (e.parameter.category) {
      filteredProducts = products.filter(p => 
        p.category.toLowerCase() === e.parameter.category.toLowerCase()
      );
    }
    
    if (e.parameter.subcategory) {
      filteredProducts = filteredProducts.filter(p => 
        p.subcategory.toLowerCase() === e.parameter.subcategory.toLowerCase()
      );
    }
    
    return {
      success: true,
      data: filteredProducts,
      count: filteredProducts.length
    };
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return { success: false, error: error.toString(), status: 500 };
  }
}

/**
 * Get single product by ID
 */
function getProduct(id) {
  try {
    if (!id) {
      return { success: false, error: 'Product ID is required', status: 400 };
    }
    
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { success: false, error: 'Product not found', status: 404 };
    }
    
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    if (idIndex === -1) {
      return { success: false, error: 'ID column not found', status: 500 };
    }
    
    const productRow = data.find(row => row[idIndex] === id);
    
    if (!productRow) {
      return { success: false, error: 'Product not found', status: 404 };
    }
    
    const product = rowToProduct(productRow, headers);
    
    return { success: true, data: product };
  } catch (error) {
    console.error('Error in getProduct:', error);
    return { success: false, error: error.toString(), status: 500 };
  }
}

/**
 * Search products
 */
function searchProducts(query) {
  try {
    if (!query) {
      return getAllProducts({});
    }
    
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { success: true, data: [], count: 0 };
    }
    
    const headers = data[0];
    const products = data.slice(1).map(row => rowToProduct(row, headers));
    
    const searchQuery = query.toLowerCase();
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      product.subcategory.toLowerCase().includes(searchQuery) ||
      (Array.isArray(product.features) && 
       product.features.some(feature => feature.toLowerCase().includes(searchQuery)))
    );
    
    return {
      success: true,
      data: filteredProducts,
      count: filteredProducts.length
    };
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return { success: false, error: error.toString(), status: 500 };
  }
}

/**
 * Get products by category
 */
function getProductsByCategory(category) {
  try {
    if (!category) {
      return { success: false, error: 'Category is required', status: 400 };
    }
    
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { success: true, data: [], count: 0 };
    }
    
    const headers = data[0];
    const products = data.slice(1).map(row => rowToProduct(row, headers));
    
    const filteredProducts = products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
    
    return {
      success: true,
      data: filteredProducts,
      count: filteredProducts.length
    };
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return { success: false, error: error.toString(), status: 500 };
  }
}

/**
 * Create new product
 */
function createProduct(productData) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Generate unique ID if not provided
    if (!productData.id) {
      productData.id = 'P_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Generate slug if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
    
    // Set timestamps
    const now = new Date().toISOString();
    productData.created_at = now;
    productData.updated_at = now;
    
    // Convert product to row
    const newRow = productToRow(productData, headers);
    
    // Add to sheet
    sheet.appendRow(newRow);
    
    // Return created product
    const createdProduct = rowToProduct(newRow, headers);
    
    return { success: true, data: createdProduct };
  } catch (error) {
    console.error('Error in createProduct:', error);
    return { success: false, error: error.toString(), status: 500 };
  }
}

/**
 * Update existing product
 */
function updateProduct(id, updateData) {
  try {
    if (!id) {
      return { success: false, error: 'Product ID is required', status: 400 };
    }
    
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    if (idIndex === -1) {
      return { success: false, error: 'ID column not found', status: 500 };
    }
    
    // Find the row to update
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === id) {
        rowIndex = i;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, error: 'Product not found', status: 404 };
    }
    
    // Get current product data
    const currentProduct = rowToProduct(data[rowIndex], headers);
    
    // Merge with update data
    const updatedProduct = { ...currentProduct, ...updateData };
    updatedProduct.updated_at = new Date().toISOString();
    
    // Convert to row
    const updatedRow = productToRow(updatedProduct, headers);
    
    // Update the sheet
    sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([updatedRow]);
    
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return { success: false, error: error.toString(), status: 500 };
  }
}

/**
 * Delete product
 */
function deleteProduct(id) {
  try {
    if (!id) {
      return { success: false, error: 'Product ID is required', status: 400 };
    }
    
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('id');
    
    if (idIndex === -1) {
      return { success: false, error: 'ID column not found', status: 500 };
    }
    
    // Find the row to delete
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === id) {
        rowIndex = i;
        break;
      }
    }
    
    if (rowIndex === -1) {
      return { success: false, error: 'Product not found', status: 404 };
    }
    
    // Delete the row
    sheet.deleteRow(rowIndex + 1);
    
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return { success: false, error: error.toString(), status: 500 };
  }
}

/**
 * Initialize sheet with sample data from CSV
 */
function initializeSampleData() {
  const sheet = getSheet();
  
  // Sample data from your CSV
  const sampleData = [
    ['id', 'slug', 'name', 'brand', 'category', 'subcategory', 'price_original', 'price_currency', 'quantity', 'description', 'features', 'ratings_average', 'ratings_count', 'extraImages', 'created_at', 'updated_at'],
    ['P_POOJA_AM_01', 'tulsi-mala-108-beads', '100% Original Tulsi Mala 108 Beads [Best Price]', 'Achyutaya', 'Pooja', 'Aasan and Mala', 100, '₹', 0, 'तुलसी की माला गले में धारण करके जप, तप, यज्ञ, व्रत, दान और सत्कर्म करने से हजार गुना लाभ होता है । यह अकाल मृत्यु को हरती है,रोगप्रतिकारक क्षमता बढ़ाती है ।', 'Authentic Tulsi beads, Prevents untimely death, Boosts immunity', 5.0, 1, '', new Date().toISOString(), new Date().toISOString()],
    ['P_POOJA_AM_02', 'sphatik-mala-bracelet-27-beads', '100% Sphatik Mala Original 27 Beads [Bracelet]', 'Achyutaya', 'Pooja', 'Aasan and Mala', 140, '₹', 0, 'विद्यार्थियों के लिए स्फटिक माला वरदान स्वरूप है। व्यक्ति के जीवन में सुख को जो ग्रह प्रभावित करता है वह शुक्र ग्रह है। इसे धारण करने मात्र से व्यक्ति को सुख-शांति की अनुभूति होने लगती है।', 'Original Sphatik crystal, Enhances concentration, Brings peace and prosperity', '', '', '', new Date().toISOString(), new Date().toISOString()],
    ['P_POOJA_AM_03', 'magnetic-anklet-payal', 'Buy Magnetic Anklet for Pain, Swelling [Payal]', 'Achyutaya', 'Pooja', 'Aasan and Mala', 45, '₹', 100, 'इसका उपयोग करने से सायटिका तथा पिंडलियों, टखनो व एडियों के दर्द एवं लगातार खड़े रहने से होनेवाले पॉंव के दर्द में आदि में आराम होता है। पैरों की सुन्नता, सूजन एवं कमजोरी में लाभदायी है।', 'Relieves leg pain, Reduces swelling, Improves blood circulation', '', '', '', new Date().toISOString(), new Date().toISOString()],
    ['P_POOJA_AM_04', 'magnetic-mala-men-women', 'Buy Magnetic Mala [For Men, Women]', 'Achyutaya', 'Pooja', 'Aasan and Mala', 50, '₹', 100, 'गर्दन में दर्द, गर्दन में जकड़न (गर्दन दायें-बाएँ न घुमा पाना), सर्वाइकल स्पॉन्डिलाइटिस अदि में आशाजनक लाभकारी।', 'Relieves neck pain and stiffness, Useful in respiratory issues, Improves energy flow', '', '', '', new Date().toISOString(), new Date().toISOString()],
    ['P_POOJA_AM_05', 'tulsi-karmala-bracelet-27-beads', 'Buy Original Tulsi Karmala 27 Beads [Tulsi Bracelet Wrist]', 'Achyutaya', 'Pooja', 'Aasan and Mala', 50, '₹', 100, 'तुलसी माता हमारे सनातन धर्म में बहुत महत्व रखती हैं। विष्णु प्रिया श्री तुलसी जी पूजनीय हैं। तुलसी करमाला अनुष्ठान के समय माला की गिनती के लिए उपयोगी है ।', 'Authentic Tulsi wood, Useful for counting chants, Provides health benefits', '', '', '', new Date().toISOString(), new Date().toISOString()],
    ['P_POOJA_AM_06', 'puja-asana-woolen-80', 'Puja Asana Woolen (पूजा आसन)', 'Achyutaya', 'Pooja', 'Aasan and Mala', 80, '₹', 100, 'आसन पर पूजा करने के पीछे धार्मिक ही नहीं वैज्ञानिक महत्व भी है दरअसल पृथ्वी में चुंबकीय बल यानि गुरुत्वाकर्षण है। जब कोई व्यक्ति विशेष मंत्रों का ध्यान और जप करता है, तो उसके अंदर एक सकारात्मक ऊर्जा उत्पन्न होती है। यदि आपने कोई आसन नहीं रखा है तो यह ऊर्जा पृथ्वी में समा जाती है और आपको कोई लाभ नहीं मिलता है।', 'Made of wool, Retains spiritual energy, Available in multiple colors', 5.0, 1, 'https://ashramestore.com/wp-content/uploads/2023/10/blue-asan-600x741.jpg, https://ashramestore.com/wp-content/uploads/2023/10/orange-asan-600x741.jpg, https://ashramestore.com/wp-content/uploads/2023/10/red-asan-600x741.jpg, https://ashramestore.com/wp-content/uploads/2023/10/white-asan-yellow-border-600x741.jpg', new Date().toISOString(), new Date().toISOString()],
    ['P_POOJA_AM_07', 'puja-asana-woolen-blue-640', 'Puja Asana Woolen (Blue - 640)', 'Achyutaya', 'Pooja', 'Aasan and Mala', 640, '₹', 100, 'आसन पर पूजा करने के पीछे धार्मिक ही नहीं वैज्ञानिक महत्व भी है दरअसल पृथ्वी में चुंबकीय बल यानि गुरुत्वाकर्षण है। जब कोई व्यक्ति विशेष मंत्रों का ध्यान और जप करता है, तो उसके अंदर एक सकारात्मक ऊर्जा उत्पन्न होती है। यदि आपने कोई आसन नहीं रखा है तो यह ऊर्जा पृथ्वी में समा जाती है और आपको कोई लाभ नहीं मिलता है।', 'Premium quality wool, Retains spiritual energy, Durable and comfortable', '', '', '', new Date().toISOString(), new Date().toISOString()],
    ['P_POOJA_AM_08', 'sphatik-karmala-27-beads', 'Buy Sphatik Karmala (27 Beads) – Mala', 'Achyutaya', 'Pooja', 'Aasan and Mala', 140, '₹', 100, 'The sphatik is adored by all because it acts as a natural coolant of the mind. On adorning a sphatik mala, one keeps cool and calm in general. With the sphatik crystal, one finds relief from headaches, and this also relieves one from high stress levels and tension.', 'Natural mind coolant, Relieves headaches and tension, Regulates body temperature', '', '', '', new Date().toISOString(), new Date().toISOString()]
  ];
  
  // Clear existing data and add sample data
  sheet.clear();
  sheet.getRange(1, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
  sheet.getRange(1, 1, 1, sampleData[0].length).setFontWeight('bold');
  
  return { success: true, message: 'Sample data initialized successfully', count: sampleData.length - 1 };
}
