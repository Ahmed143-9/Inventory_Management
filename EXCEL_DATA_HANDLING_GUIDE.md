# Excel Data Handling Guide

## Overview
This guide explains how the Inventory Management System processes Excel data and ensures all product information is captured correctly from your Excel files.

## Supported Excel Columns

### Product Master Sheet Columns
The system recognizes and processes the following columns from your Excel files:

#### Identification Fields
| Column Name | Description | Example Values |
|-------------|-------------|----------------|
| Product | General product type/category | Door Lock, Door Stopper, Screw |
| Product Name | Specific product name | Lever Lock AROMA, EASY DOOR STOPPER |
| Product Code | Unique product identifier | D-LEVER-556---, S-STAR -0--- |

#### Physical Attributes
| Column Name | Description | Example Values |
|-------------|-------------|----------------|
| Size | Product dimensions | 556, 5570, 9216 |
| Material | Construction material | AB, ORB, SS |
| Color | Product color | Golden 20p |
| Model No | Model/reference number | 556, 5570, 9216 |
| Brand | Manufacturer/brand | AROMA, EMA, FSB |
| Grade | Quality grade | Premium, Standard |

#### Inventory Management
| Column Name | Description | Example Values |
|-------------|-------------|----------------|
| Category | Product classification | Door Hardware, Accessories |
| Unit | Measurement unit | PCS |
| Unit Qty | Quantity per unit | 1 |
| Quantity | Stock on hand | 0, 6 |
| Unit Rate | Purchase cost per unit | 2035 |
| Total Buy | Total purchase cost | 12210 |
| Sell Rate | Selling price | 2800 |
| Approximate Rate | Market reference price | 2500 |
| Authentication Rate | Verified price | 2450 |

## How Data Is Processed

### 1. Column Recognition
The system uses flexible column recognition to handle variations in your Excel files:

- Recognizes standard column names like "Product Name", "Product Code"
- Handles special product-specific column names like "D-LEVER-556---"
- Maps various model number formats to the "Model No" field
- Processes different size representations consistently

### 2. Data Transformation
During import, the system:

1. **Validates Rows**: Skips completely empty rows
2. **Maps Columns**: Associates Excel columns with internal product fields
3. **Converts Data Types**: 
   - Converts text numbers to actual numbers (e.g., "2035" → 2035)
   - Parses dates and formats them consistently
4. **Calculates Derived Fields**:
   - Profit margin: ((Sell Rate - Unit Rate) / Unit Rate) × 100
   - Total buy: Unit Rate × Quantity (when Total Buy is missing)

### 3. Special Handling
- **Empty Cells**: Replaced with appropriate defaults (empty string, 0, "N/A")
- **Missing Columns**: Handled gracefully with default values
- **Duplicate Products**: Each row becomes a separate product entry

## Search Functionality

### How Search Works
The search feature scans across multiple product fields simultaneously:

1. **Comprehensive Indexing**: Searches in:
   - Product Name
   - Product Code
   - Product Type
   - Material
   - Model Number
   - Brand
   - Grade
   - Color
   - Size
   - Category

2. **Flexible Matching**: 
   - Case-insensitive search
   - Partial word matching
   - Space-separated term matching

### Search Examples
| Search Term | Finds Products |
|-------------|----------------|
| "lever" | All lever locks regardless of brand |
| "AROMA" | All AROMA brand products |
| "556" | Products with model number 556 |
| "door lock" | All door lock products |
| "steel" | Products with "steel" in any field |

## Ensuring All Data Is Captured

### Best Practices for Excel Files
1. **Consistent Formatting**:
   - Use consistent column headers
   - Maintain uniform data types in columns
   - Avoid merging cells

2. **Complete Information**:
   - Fill in as many fields as possible
   - Use descriptive product names
   - Include accurate quantities and pricing

3. **Validation Tips**:
   - Check for typos in product codes
   - Verify numerical values are formatted as numbers
   - Ensure dates are in consistent formats

### Troubleshooting Missing Data
If product information appears incomplete after import:

1. **Check Column Headers**: Ensure they match recognized names
2. **Verify Data Types**: Confirm numbers aren't stored as text
3. **Review Empty Fields**: Look for unintentionally blank cells
4. **Test Search**: Use search to verify data was imported correctly

## Viewing Complete Product Details

### Accessing All Information
While the main product list shows essential information, complete details are available through:

1. **Product Detail View**: Click the eye icon to see all fields
2. **Edit Product**: Access full information when editing
3. **Reports**: Various reports show specialized product data

### Hidden Information
Some detailed information is not shown in the main list but is stored and accessible:
- Full descriptions
- Extended product specifications
- Complete pricing history
- Supplier information
- Transaction records

## Exporting Data

### Data Retention
When exporting products to Excel:
- All captured fields are included
- Original column mappings are preserved
- Calculated fields are exported as values
- Data types are maintained

### Export Benefits
- Backup of complete inventory
- Sharing with stakeholders
- Offline data analysis
- Integration with other systems

## Common Issues and Solutions

### Issue: Search Not Finding Expected Products
**Solution**: 
- Check if data was imported correctly
- Verify search terms match the data exactly
- Try broader search terms
- Clear filters and search again

### Issue: Missing Product Information
**Solution**:
- Verify Excel column names match supported fields
- Check for hidden characters in cells
- Ensure rows aren't accidentally skipped
- Re-import with corrected data

### Issue: Incorrect Profit Calculations
**Solution**:
- Verify Unit Rate and Sell Rate are numeric
- Check for formula errors in Excel
- Ensure no text values in price columns
- Review calculated profit margin in detail view

## Advanced Features

### Bulk Operations
- Import multiple products simultaneously
- Update existing products with new data
- Delete products in bulk (admin only)
- Export filtered product lists

### Data Validation
- Automatic detection of inconsistent data
- Warning messages for suspicious values
- Validation of required fields
- Error reporting for failed imports

This guide ensures you can confidently import, search, and manage all your product data using the Inventory Management System.