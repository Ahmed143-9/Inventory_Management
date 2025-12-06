# Testing the Excel Import Functionality

## Steps to Test

1. Open your browser and navigate to http://localhost:3000

2. Log in with the default credentials:
   - Username: admin@example.com
   - Password: admin123

3. Once logged in, you'll see the dashboard.

4. To test the Excel import functionality:
   - Click on "Excel Import" in the left sidebar
   - You'll see a page with an upload area for Excel files
   - Use any of your Excel files:
     - Profit Loss Upload.xlsx
     - Sells Record - upload.xlsx
     - Purchase Record Upload.xlsx
     - Products Upload.xlsx
     - Dashboard -upload.xlsx

5. After uploading a file:
   - The system will process all sheets in the Excel file
   - You'll see a summary of imported data
   - Products will be added to your inventory
   - Purchase and sales data will be processed for reporting

6. To view the results:
   - Go back to the Dashboard to see key metrics
   - Check the "Stock Report" to see low stock items
   - Check the "Profit & Loss Report" to see profit calculations
   - Navigate to "Products" to see all imported products

## What the System Does

- Identifies products that are not available or low in quantity
- Compares buy price and selling price from your Excel sheets
- Calculates profit margins automatically
- Shows all data in the dashboard for easy monitoring

## Troubleshooting

If you encounter any issues:
1. Make sure your Excel files have the correct sheet names
2. Ensure column headers match the expected format
3. Check that numeric values are properly formatted
4. Refresh the page if data doesn't appear immediately

## Support

For any questions or issues, please contact the development team.