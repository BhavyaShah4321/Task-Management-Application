# Task Management Application

A full-stack task management application built with the MERN stack that allows authenticated users to manage their tasks and provides administrators with task monitoring and assignment functionality.

## Project Overview

Users can register, login, and manage their own tasks with search, filtering, sorting, and pagination capabilities. The application includes a dark mode theme and skeleton loaders for improved user experience. Administrators have access to a dedicated dashboard to view application statistics, monitor user tasks, and assign tasks to specific users.

All APIs are protected with JWT authentication, and task ownership is enforced on the backend to ensure users can only access their own tasks.

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Logout
- Session restoration
- Password hashing with bcrypt

### Task Management
- Create Task
- Edit Task
- Delete Task
- Mark Completed
- Priority (Low, Medium, High)
- Status (Pending, In Progress, Completed)
- Due Date
- Created Date

### Task Discovery
- Search by title
- Filter by status
- Filter by priority
- Sort by due date
- Sort by created date
- Sort by priority
- Server-side pagination
- Dynamic page size (10, 20, 50)

### Admin
- Role-Based Access Control
- Admin Dashboard
- Application statistics
- View user tasks with owner information
- Filter tasks by user
- Assign tasks to users

### UI
- Responsive layout
- Ant Design components
- Dark Mode
- Skeleton Loaders

## Bonus Features

- Dark Mode with theme persistence
- Skeleton Loaders for initial API loading states
- Role-Based Access Control (Admin/User)

## Technology Stack

### Frontend
- React.js
- Create React App
- Redux Toolkit
- React Redux
- React Router
- Ant Design
- Axios
- Day.js

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- cors
- dotenv

### Development
- Git
- GitHub
- GitHub Actions
- Postman
- Nodemon

## Project Structure

```
Task-Management-Application/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── ...
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── postman/
│   └── Task-Management-API.postman_collection.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 22+
- npm
- MongoDB

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Task-Management-Application
```

2. Install server dependencies:

```bash
cd server
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and configure the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-management
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000
```

**Important:** Do not commit the `.env` file. It contains sensitive information and is already ignored by `.gitignore`.

## Running the Project Locally

### Backend

Start the backend server in one terminal:

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend

Start the frontend in another terminal:

```bash
cd client
npm start
```

The frontend will run on `http://localhost:3000`

## Demo Data Seeding

Optional demo task data can be seeded for testing search, filtering, sorting, pagination, and admin features:

```bash
cd server
npm run seed:tasks
```

**Warning:** This command removes all existing Task documents before inserting 20 demo tasks. It does not affect users.

The demo tasks are distributed across existing normal users and include varied priorities, statuses, and due dates for comprehensive testing.

## API Documentation

Base URL: `http://localhost:5000/api`

Protected routes require: `Authorization: Bearer <token>`

### Authentication API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /auth/register | Public | Register a new user (role automatically set to 'user') |
| POST | /auth/login | Public | Login with email and password |
| GET | /auth/me | Private | Get current authenticated user details |

### Task API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /tasks | Private | Get tasks owned by authenticated user |
| POST | /tasks | Private | Create a new task |
| PUT | /tasks/:id | Private | Update an existing task |
| DELETE | /tasks/:id | Private | Delete a task |

**GET /tasks** supports query parameters:
- `search`: Search by task title
- `status`: Filter by status (Pending, In Progress, Completed)
- `priority`: Filter by priority (Low, Medium, High)
- `sortBy`: Sort by field (createdAt, dueDate, priority)
- `sortOrder`: Sort order (asc, desc)
- `page`: Page number
- `limit`: Items per page (10, 20, 50)

### Admin API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /admin/stats | Admin | Get application statistics |
| GET | /admin/users | Admin | Get all normal users for task assignment |
| GET | /admin/tasks | Admin | Get user tasks with owner information |
| POST | /admin/tasks | Admin | Assign a task to a specific user |

**GET /admin/tasks** supports query parameters:
- `search`: Search by task title
- `status`: Filter by status
- `priority`: Filter by priority
- `userId`: Filter by user
- `sortBy`: Sort by field
- `sortOrder`: Sort order
- `page`: Page number
- `limit`: Items per page

### Health API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /health | Public | Server health check |

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

## Postman Collection

A Postman collection is provided for API testing:

**Location:** `postman/Task-Management-API.postman_collection.json`

**Usage:**
1. Open Postman
2. Import the collection file
3. Start the backend server
4. Set collection variables:
   - `adminEmail`: Your admin email
   - `adminPassword`: Your admin password
5. Run "Login User" to populate the `token` variable
6. Run "Login Admin" to populate the `adminToken` variable
7. The `taskId` variable is automatically populated after creating a task

## Authentication & Authorization

- JWT (JSON Web Tokens) are used for authentication
- Passwords are hashed using bcrypt before storage
- Protected API endpoints require a valid Bearer token in the Authorization header
- Normal users can only access and modify their own tasks
- Admin endpoints use role-based middleware to restrict access to administrators
- Public registration always creates users with the 'user' role
- Administrators can assign tasks to normal users via the admin dashboard

## Validation

Validation occurs on both frontend and backend:

**Frontend:** Ant Design Form rules provide real-time validation feedback

**Backend:** express-validator middleware validates request data

**Examples:**
- Required fields must be provided
- Email must be valid format
- Password must be at least 8 characters
- Task title is required
- Due date cannot be in the past
- Priority must be Low, Medium, or High
- Status must be Pending, In Progress, or Completed

## Search, Filter, Sort, Pagination

**Search:** Tasks can be searched by title

**Filters:**
- Status (Pending, In Progress, Completed)
- Priority (Low, Medium, High)
- User (admin only)

**Sorting:**
- Due date
- Created date
- Priority

**Pagination:**
- Server-side pagination
- Configurable page sizes: 10, 20, 50
- Page resets when filters change

## Continuous Integration

GitHub Actions workflow is configured at `.github/workflows/ci.yml`

**Triggers:**
- Push to main branch
- Pull request to main branch

**Checks:**
- Frontend: `npm ci` and `npm run build`
- Backend: `npm ci` and `npm run check` (syntax verification)

No deployment is configured as it is not required for this assignment.

## Security Notes

- User passwords are hashed with bcrypt before storage
- JWT secrets are stored in environment variables
- `.env` file is ignored by Git
- Task ownership is enforced on the backend
- Admin endpoints are protected by role-based middleware
- Registration endpoint cannot create admin accounts
- CORS is configured to allow requests from the frontend

## Available Scripts

### Client
```bash
npm start          # Start development server
npm run build      # Build for production
```

### Server
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run check      # Syntax check all backend files
npm run seed:tasks # Seed demo task data
```

## Deployment

Deployment is not required for this assignment.
