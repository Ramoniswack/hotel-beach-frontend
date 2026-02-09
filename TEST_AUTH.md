# Testing Authentication

## Prerequisites
1. Backend server must be running on `http://localhost:5000`
2. MongoDB must be running on `mongodb://localhost:27017/hotel-booking`

## Start Backend Server
```bash
cd backend
npm run dev
```

## Start Frontend Server
```bash
cd frontend
npm run dev
```

## Test Steps

### 1. Test Backend Health
Open browser: `http://localhost:5000/api/health`
Should return: `{"status":"OK","message":"Server is running"}`

### 2. Seed Test Users (if not done)
```bash
cd backend
npm run seed:admin
```

This creates:
- admin@hotel.com / admin123 (Admin)
- staff@hotel.com / staff123 (Staff)
- guest@hotel.com / guest123 (Guest)

### 3. Test Registration
1. Go to `http://localhost:3000/register`
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Phone: (optional)
3. Click "Create account"
4. Should redirect to homepage with "Welcome, Test User" in header

### 4. Test Login
1. Go to `http://localhost:3000/login`
2. Fill in:
   - Email: guest@hotel.com
   - Password: guest123
3. Click "Sign in"
4. Should redirect to homepage with "Welcome, Guest User" in header

### 5. Test Logout
1. Click "Logout" in header
2. Should show "Login" button again

## Common Issues

### Backend not running
Error: `Network Error` or `ERR_CONNECTION_REFUSED`
Solution: Start backend server with `npm run dev` in backend folder

### MongoDB not running
Error: `MongooseServerSelectionError`
Solution: Start MongoDB service

### CORS errors
Error: `Access-Control-Allow-Origin`
Solution: Check backend CORS settings in `server.ts`

### Token not persisting
Issue: User logged out on page refresh
Solution: Check browser localStorage for 'token' and 'user' keys
