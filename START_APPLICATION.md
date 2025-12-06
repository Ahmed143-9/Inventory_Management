# Starting the Application

## Prerequisites
Make sure you have Node.js installed on your system.

## Starting the Application

1. Open a terminal/command prompt
2. Navigate to the project directory:
   ```
   cd c:\Users\dell\Desktop\inventory
   ```

3. Start the development server:
   ```
   npm start
   ```

4. If you see a message saying "Something is already running on port 3000", you have two options:
   
   Option A - Kill the existing process:
   - Press Ctrl+C to stop the current process
   - Or find and kill the process using port 3000:
     ```
     taskkill /F /PID <port_3000_process_id>
     ```
   
   Option B - Use a different port:
   - Press 'Y' when prompted to run the app on another port
   - The application will start on the next available port (usually 3001)

5. Once started, the application will automatically open in your default browser at:
   - http://localhost:3000 (or the next available port)

## Troubleshooting

### If the application doesn't start:
1. Make sure all dependencies are installed:
   ```
   npm install
   ```

2. Clear the cache and try again:
   ```
   npm start --reset-cache
   ```

3. Check for any error messages in the terminal and address them accordingly

### If the application is slow:
1. The optimizations we implemented should help with performance
2. For very large datasets, consider using pagination or virtual scrolling
3. Check the browser's developer tools for performance bottlenecks

## Performance Notes

The application now includes several performance optimizations:
- Debounced localStorage operations to prevent UI freezing
- Memoized calculations to avoid unnecessary re-renders
- Optimized data filtering and sorting
- Efficient state management

These optimizations should make the application much more responsive, especially when dealing with large datasets.