# Comprehensive Excel Data Management Guide

This guide explains how to use the Excel import/export functionality in the Inventory Management System, including templates for all data types.

## Table of Contents
1. [Overview](#overview)
2. [Available Templates](#available-templates)
3. [Product Master Template](#product-master-template)
4. [Purchase Record Template](#purchase-record-template)
5. [Sales Record Template](#sales-record-template)
6. [Profit/Loss Template](#profitloss-template)
7. [Multi-Sheet Template](#multi-sheet-template)
8. [Importing Data](#importing-data)
9. [Exporting Data](#exporting-data)
10. [Best Practices](#best-practices)

## Overview

The Inventory Management System supports comprehensive Excel data handling for four main data types:
- Product Master (inventory items)
- Purchase Records (incoming stock)
- Sales Records (outgoing stock)
- Profit/Loss Calculations (financial analysis)

Each data type has its own template format, and you can also use a multi-sheet template that contains all four types.

## Available Templates

You can download templates from the following locations in the application:

1. **Data Import/Export Page** (/data/import-export)
   - Comprehensive Data Management section
   - Individual template downloads for each data type
   - Multi-sheet template with all data types

2. **Individual Import Pages**
   - Product Import page has product template
   - Excel Import page has multi-sheet template

## Product Master Template

### Columns and Descriptions

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| No. | Serial number | Optional | 1, 2, 3 |
| Product | General product category | Required | Door Lock, Screw |
| Product Name | Specific product name | Required | Lever Lock AROMA |
| Size | Product dimensions/specifications | Optional | 556, 5 /8'' |
| Brand | Manufacturer name | Optional | AROMA, FSB |
| Grade | Quality grade | Optional | Premium, Standard |
| Material | Construction material | Optional | Steel, Plastic |
| Color | Product color | Optional | Black, Silver |
| Model No | Model/reference number | Optional | 556, 9216 |
| Product Code | Unique identifier | Required | D-LEVER-556--- |
| Unit Qty | Quantity per unit | Optional | 1, 5 |
| Unit | Measurement unit | Optional | PCS, Set |
| Unit Rate | Purchase cost per unit | Optional | 2035.00 |
| Total Buy | Total purchase cost | Optional | 12210.00 |
| Category | Product classification | Optional | Door Hardware |
| Quantity | Current stock level | Optional | 6 |
| Approximate Rate | Market reference price | Optional | 2500.00 |
| Authentication Rate | Verified price | Optional | 2450.00 |
| Sell Rate | Selling price | Optional | 2800.00 |

### Sample Data
```
No.,Product,Product Name,Size,Brand,Grade,Material,Color,Model No,Product Code,Unit Qty,Unit,Unit Rate,Total Buy,Category,Quantity,Approximate Rate,Authentication Rate,Sell Rate
,Door Lock,Lever Lock AROMA,556,,Premium,,AB,556,D-LEVER-556---,1,PCS,2035,12210,Door Lock,6,2500,2450,2800
,screw,star screw prime - quality,5 /8'',,Premium,Steel,,5 /8'',S-STAR -0---,5,PCS,310,1550,Screw,10,350,340,400
```

## Purchase Record Template

### Columns and Descriptions

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| Date | Purchase date | Required | 2023-01-15 |
| Invoice No | Supplier invoice number | Required | INV-001 |
| Product ID | Product identifier | Required | D-LEVER-556--- |
| Product Name | Product name | Required | Lever Lock AROMA |
| Model | Product model | Optional | 556 |
| Size | Product size | Optional | 556 |
| Color or material | Product attributes | Optional | AB, Steel |
| Quality | Product quality | Optional | Premium |
| Quantity Purchased | Number of units | Required | 6 |
| Unit Price (Buy) | Cost per unit | Required | 2035.00 |
| Total Purchase Cost | Total cost | Required | 12210.00 |
| Supplier | Supplier name | Required | NEW JANATHA HARDWORK |
| Payment Status | Payment status | Required | Paid, Pending |

### Sample Data
```
Date,Invoice No,Product ID,Product Name,Model,Size,Color or material,Quality,Quantity Purchased,Unit Price (Buy),Total Purchase Cost,Supplier,Payment Status
2023-01-15,INV-001,D-LEVER-556---,Lever Lock AROMA,556,556,AB,Premium,6,2035,12210,NEW JANATHA HARDWORK,Paid
2023-01-16,INV-002,S-STAR -0---,star screw prime - quality,5 /8'',5 /8'',Steel,Premium,5,310,1550,SUPPLIER XYZ,Pending
```

## Sales Record Template

### Columns and Descriptions

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| Date | Sale date | Required | 2023-01-20 |
| Invoice No | Sales invoice number | Required | SL-001 |
| Customer Name | Customer name | Required | John Doe |
| Product ID | Product identifier | Required | D-LEVER-556--- |
| Product Name | Product name | Required | Lever Lock AROMA |
| Quantity Sold | Number of units sold | Required | 2 |
| Unit Price (Sell) | Selling price per unit | Required | 2800.00 |
| Total Sale | Total sale amount | Required | 5600.00 |
| Payment Status | Payment status | Required | Paid, Pending |

### Sample Data
```
Date,Invoice No,Customer Name,Product ID,Product Name,Quantity Sold,Unit Price (Sell),Total Sale,Payment Status
2023-01-20,SL-001,John Doe,D-LEVER-556---,Lever Lock AROMA,2,2800,5600,Paid
2023-01-21,SL-002,Jane Smith,S-STAR -0---,star screw prime - quality,10,400,4000,Pending
```

## Profit/Loss Template

### Columns and Descriptions

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| Date | Transaction date | Optional | 2023-01-20 |
| Product ID | Product identifier | Required | D-LEVER-556--- |
| Product Name | Product name | Required | Lever Lock AROMA |
| Quantity Sold | Units sold | Required | 2 |
| Total Sale Amount | Revenue from sales | Required | 5600.00 |
| Total Purchase Cost | Cost of goods sold | Required | 4070.00 |
| Profit/Loss | Financial result | Calculated | 1530.00 |

### Sample Data
```
Date,Product ID,Product Name,Quantity Sold,Total Sale Amount,Total Purchase Cost,Profit/Loss
2023-01-20,D-LEVER-556---,Lever Lock AROMA,2,5600,4070,1530
2023-01-21,S-STAR -0---,star screw prime - quality,10,4000,3100,900
```

## Multi-Sheet Template

The multi-sheet template contains all four sheets in a single Excel file:
1. Product Master
2. Purchase Record
3. Sales Record
4. Profit Loss

This is the most convenient format for bulk data operations.

## Importing Data

### Single Sheet Import
1. Navigate to Data Import/Export → Import Data
2. Choose the appropriate import method:
   - Upload Excel/CSV file
   - Paste CSV data directly
3. Select your file or paste data
4. Preview the data to verify correct parsing
5. Click "Import" to add data to the system

### Multi-Sheet Import
1. Navigate to Data Import/Export → Import Data
2. Upload an Excel file with multiple sheets
3. The system will automatically detect and process:
   - Product Master sheet
   - Purchase Record sheet
   - Sales Record sheet
4. Review import summary for confirmation

### Supported File Formats
- Excel: .xlsx, .xls
- CSV: .csv
- Maximum file size: 10MB

## Exporting Data

### Individual Exports
From the Data Import/Export → Export Data section:
1. **Export Products**: Downloads current product inventory
2. **Export Purchases**: Downloads purchase records
3. **Export Sales**: Downloads sales records

### Bulk Export
- **Export All Data**: Downloads separate files for products, purchases, and sales

### Export Benefits
- Complete data backup
- Data sharing with stakeholders
- Offline analysis
- Integration with other systems

## Best Practices

### File Preparation
1. **Consistent Formatting**:
   - Use consistent column headers
   - Maintain uniform data types
   - Avoid merged cells

2. **Data Completeness**:
   - Fill required fields
   - Use descriptive names
   - Include accurate quantities/pricing

3. **Validation**:
   - Check for typos
   - Verify numerical values
   - Ensure date consistency

### Import Process
1. **Start Small**: Test with a few records first
2. **Review Preview**: Always check data preview before importing
3. **Backup Data**: Keep copies of original files
4. **Monitor Results**: Check import summaries for errors

### Troubleshooting
1. **Import Failures**:
   - Verify file format
   - Check column headers
   - Ensure required fields are populated
   - Validate data types

2. **Missing Data**:
   - Check column mapping
   - Look for hidden characters
   - Verify row completeness

3. **Performance Issues**:
   - Split large files into smaller batches
   - Use CSV for better performance
   - Ensure adequate system resources

## Template Customization

While the system recognizes standard column names, you can customize templates:
- Add additional columns (they will be ignored)
- Rearrange columns (order doesn't matter)
- Use partial column names (system uses fuzzy matching)

However, for best results, stick to the standard column names provided in the templates.

## Data Security

- All data is stored locally in your browser
- No data is transmitted to external servers
- Regular exports serve as backups
- Clear browser data will remove all information

## Getting Help

If you encounter issues:
1. Check this guide for common solutions
2. Verify your Excel file structure
3. Contact system administrator
4. Review browser console for error messages

This comprehensive guide should help you effectively manage all your inventory data through Excel import/export functionality.