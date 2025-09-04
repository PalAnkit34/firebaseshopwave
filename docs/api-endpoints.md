# Google Apps Script API Endpoints

## Base URL
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Product Management APIs

### 1. Get All Products
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=list
```

### 2. Get Single Product
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=get&id=P_POOJA_AM_01
```

### 3. Search Products
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=search&query=tulsi
```

### 4. Get Products by Category
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=category&category=Pooja
```

### 5. Create New Product
```
POST: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
Content-Type: application/json

{
  "method": "POST",
  "name": "New Product Name",
  "brand": "Brand Name",
  "category": "Category",
  "subcategory": "Subcategory",
  "price_original": 100,
  "price_currency": "₹",
  "quantity": 50,
  "description": "Product description",
  "features": "Feature1, Feature2, Feature3"
}
```

### 6. Update Product
```
POST: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
Content-Type: application/json

{
  "method": "PUT",
  "id": "P_POOJA_AM_01",
  "price_original": 120,
  "quantity": 25
}
```

### 7. Delete Product
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=DELETE&id=P_POOJA_AM_01
```

## Test Product Data (from your CSV)

### Sample Products:
1. **P_POOJA_AM_01** - 100% Original Tulsi Mala 108 Beads
2. **P_POOJA_AM_02** - 100% Sphatik Mala Original 27 Beads
3. **P_POOJA_AM_03** - Buy Magnetic Anklet for Pain, Swelling
4. **P_POOJA_AM_04** - Buy Magnetic Mala [For Men, Women]
5. **P_POOJA_AM_05** - Buy Original Tulsi Karmala 27 Beads
6. **P_POOJA_AM_06** - Puja Asana Woolen (पूजा आसन)
7. **P_POOJA_AM_07** - Puja Asana Woolen (Blue - 640)
8. **P_POOJA_AM_08** - Buy Sphatik Karmala (27 Beads)

## Response Format

### Success Response:
```json
{
  "success": true,
  "data": [...], // Array of products or single product
  "count": 8     // Total count (for list operations)
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## Quick Setup Steps:

1. Copy the code from `docs/google-apps-script.js`
2. Create new Apps Script project
3. Paste the code and save
4. Deploy as web app
5. Run `initializeSampleData()` function to load your CSV data
6. Copy the deployment URL and update your `.env.local`
7. Test endpoints using Postman or browser

## Next.js Integration:

Update your `.env.local`:
```
NEXT_PUBLIC_APPS_SCRIPT_API_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

The app will automatically use this URL to fetch products from Google Sheets!
