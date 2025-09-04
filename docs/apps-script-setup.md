# Google Apps Script Setup Instructions

## Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Replace the default code with the code from `docs/google-apps-script.js`
4. Save the project with a meaningful name (e.g., "E-commerce API")

## Step 2: Create Google Sheets

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it something like "Product Database"
4. Note down the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 3: Link Apps Script to Sheets

1. In your Apps Script project, click on "Resources" → "Cloud Platform project"
2. Or simply run the script once, it will automatically create a sheet named "Products"

## Step 4: Deploy as Web App

1. In Apps Script editor, click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone" (for public API)
5. Click "Deploy"
6. Copy the Web app URL - this is your API endpoint

## Step 5: Test the API

### Get All Products
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=list
```

### Get Single Product
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=get&id=P_POOJA_AM_01
```

### Search Products
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=search&query=tulsi
```

### Get Products by Category
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=GET&action=category&category=Pooja
```

### Create New Product
```
POST: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=POST
Content-Type: application/json

{
  "name": "New Product",
  "brand": "Test Brand",
  "category": "Test Category",
  "price_original": 100,
  "description": "Test description"
}
```

### Update Product
```
POST: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=PUT
Content-Type: application/json

{
  "id": "P_POOJA_AM_01",
  "price_original": 120
}
```

### Delete Product
```
GET: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?method=DELETE&id=P_POOJA_AM_01
```

## Step 6: Initialize Sample Data

Run this function in Apps Script editor to load your CSV data:

```javascript
function initializeSampleData()
```

## Step 7: Update Environment Variables

Add your Apps Script Web App URL to your `.env.local`:

```
NEXT_PUBLIC_APPS_SCRIPT_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": [...], // Array of products or single product
  "count": 10    // Total count (for list operations)
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 400
}
```

## Product Data Structure

```json
{
  "id": "P_POOJA_AM_01",
  "slug": "tulsi-mala-108-beads",
  "name": "100% Original Tulsi Mala 108 Beads [Best Price]",
  "brand": "Achyutaya",
  "category": "Pooja",
  "subcategory": "Aasan and Mala",
  "price_original": 100,
  "price_currency": "₹",
  "quantity": 0,
  "description": "Product description...",
  "features": ["feature1", "feature2"],
  "ratings_average": 5.0,
  "ratings_count": 1,
  "extraImages": ["url1", "url2"],
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Security Notes

1. The API is public by default - anyone can access it
2. Consider adding authentication if needed
3. You can restrict access by modifying the `ALLOWED_ORIGINS` array
4. For production, consider implementing rate limiting

## Troubleshooting

1. **CORS Issues**: Make sure CORS headers are properly set in the script
2. **Permission Errors**: Ensure the script has permission to access Google Sheets
3. **Timeout Issues**: For large datasets, consider implementing pagination
4. **Rate Limits**: Google Apps Script has execution time limits (6 minutes max)

## Advanced Features

### Pagination (Optional)
Add `limit` and `offset` parameters to the getAllProducts function for better performance with large datasets.

### Caching (Optional)
Implement caching using PropertiesService for frequently accessed data.

### Webhooks (Optional)
Add webhook support to notify your Next.js app when data changes.
