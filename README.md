# Inventory Management System

This is a complete Inventory Management System built with React that allows you to manage products, track stock levels, record purchases and sales, and generate reports.

## Features

- Product Management (CRUD operations)
- Stock Tracking (In/Out movements)
- Purchase and Sales Recording
- Excel Import/Export functionality
- Dashboard with Key Metrics
- Detailed Reporting
- Role-Based Access Control (RBAC)
- Document Management with Extra Cost Tracking
- Responsive Design

## Role-Based Access Control (RBAC)

The system implements role-based access control to ensure data security:

- **Admin (Super Admin)**: Can perform all actions including deleting products and documents
- **Regular Users**: Can view and edit data but cannot delete anything

Only users with the "superadmin" role can delete products or documents. This ensures that critical data cannot be accidentally removed by regular users.

## Document Management & Extra Cost Tracking

The system now includes a Documents section where you can track extra costs that affect your profit margins:

### Features:
1. **Bill Entry**: Add bills with title, amount, description, and image attachment
2. **Image Support**: Upload bill copies or receipts as images
3. **Cost Tracking**: All extra costs are summed and displayed in the dashboard
4. **Profit Adjustment**: Extra costs automatically reduce your net profit calculations
5. **Detailed Reporting**: View breakdown of all extra costs in the Profit & Loss report

### How it Works:
1. Navigate to the "Documents" section from the sidebar
2. Click "Add Bill" to enter a new expense
3. Fill in the bill details and optionally attach an image
4. The system will automatically track the total extra costs
5. These costs are subtracted from your gross profit to show net profit
6. Detailed breakdown is available in the Profit & Loss report

## Excel Import Functionality

The system supports importing data from Excel files with multiple sheets. This allows you to quickly populate your inventory with existing data.

### Supported Excel File Formats

1. **Product Master Sheet**
   - Contains product information including:
     - Product Code
     - Product Name
     - Category
     - Quantity
     - Unit Rate (Buy Price)
     - Sell Rate
     - Size, Brand, Material, Color, etc.

2. **Purchase Record Sheet**
   - Contains purchase transaction data:
     - Date
     - Invoice Number
     - Product ID/Name
     - Quantity Purchased
     - Unit Price
     - Supplier Information

3. **Sales Record Sheet**
   - Contains sales transaction data:
     - Date
     - Invoice Number
     - Customer Name
     - Product ID/Name
     - Quantity Sold
     - Unit Price
     - Total Sale Amount

### How to Import Excel Data

1. Navigate to the "Excel Import" section from the sidebar menu
2. Click the "Choose File" button and select your Excel file
3. The system will automatically process all sheets in the file:
   - Product Master data will be added to your product inventory
   - Purchase Record data will be processed for reporting
   - Sales Record data will be processed for reporting
4. After import, you can view the results in the dashboard

### Dashboard Features

The dashboard provides key insights from your imported data:

1. **Stock Status**
   - Identifies products with low quantity (≤ 5 units)
   - Shows out-of-stock items
   - Displays total inventory value

2. **Profit Analysis**
   - Compares buy price vs sell price for each product
   - Calculates profit margin percentage
   - Shows potential profit based on current stock levels
   - Automatically adjusts for extra costs

3. **Quick Actions**
   - Direct links to add products
   - Import more Excel files
   - View detailed reports

### Reports Available

1. **Stock Report**
   - Detailed view of all products with stock levels
   - Filtering options for high/low/out-of-stock items
   - Total inventory valuation

2. **Profit & Loss Report**
   - Profit calculation per product
   - Overall profit margin analysis
   - Identification of profitable vs non-profitable items
   - Automatic adjustment for extra costs

3. **Purchase Report**
   - History of all purchase transactions
   - Supplier analysis

4. **Sales Report**
   - History of all sales transactions
   - Customer analysis

## Getting Started

1. Open the application in your browser
2. Use the sidebar navigation to access different features
3. To import your existing data:
   - Go to "Excel Import" in the sidebar
   - Upload your Excel files
   - View results in the Dashboard
4. Manage your inventory through the Products section
5. Track extra costs in the Documents section
6. Generate reports as needed

## Support

For any issues or questions about the Excel import functionality, please contact the development team.