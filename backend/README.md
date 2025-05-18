
# Productivity App Backend

This is the backend API for the Productivity App, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```
cd backend
npm install
```

2. Create a `.env` file with your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

3. Start the development server:
```
npm run dev
```

## API Endpoints

### Todos
- GET `/api/todos` - Get all todos
- GET `/api/todos/:id` - Get a specific todo
- POST `/api/todos` - Create a new todo
- PUT `/api/todos/:id` - Update a todo
- DELETE `/api/todos/:id` - Delete a todo

### Pomodoro Sessions
- GET `/api/pomodoro` - Get all pomodoro sessions
- GET `/api/pomodoro/:id` - Get a specific session
- GET `/api/pomodoro/stats` - Get pomodoro statistics
- POST `/api/pomodoro` - Log a new pomodoro session
- DELETE `/api/pomodoro/:id` - Delete a session

### Journals
- Not fully implemented yet

### Habits
- Not fully implemented yet

## Structure
```
/backend
  /models - Mongoose schemas
  /controllers - Route handlers
  /routes - API routes
  server.js - Main application file
```
