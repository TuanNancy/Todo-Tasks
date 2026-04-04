# 📝 Todo App - Full Stack Application

Một ứng dụng Todo List đầy đủ tính năng được xây dựng với React, Node.js, Express, và MongoDB. Hỗ trợ xác thực người dùng bằng JWT.

## ✨ Tính năng

### 🔐 Xác thực
- ✅ Đăng ký tài khoản (username, email, password)
- ✅ Đăng nhập / Đăng xuất
- ✅ JWT httpOnly cookies (bảo mật chống XSS)
- ✅ Protected routes — yêu cầu đăng nhập
- ✅ Mỗi user chỉ thấy & quản lý task của mình

### 📋 Quản lý công việc
- ✅ Thêm, sửa, xóa công việc
- ✅ Đánh dấu hoàn thành công việc
- ✅ Lọc theo trạng thái (Tất cả, Đang làm, Hoàn thành)
- ✅ Phân trang server-side (5 tasks mỗi trang)
- ✅ Thống kê số lượng tasks theo trạng thái
- ✅ Hiển thị ngày tháng tạo và hoàn thành (relative time)
- ✅ Optimistic UI updates với rollback khi lỗi

### 🎨 Giao diện
- ✅ Animated shader background (Three.js)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Toast notifications (Sonner)

## 🛠️ Tech Stack

### Frontend

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 19 | UI library |
| Vite | 7 | Build tool |
| Tailwind CSS | 4 | Styling |
| Shadcn UI | - | Component library |
| Sonner | 2 | Toast notifications |
| Three.js | 0.182 | Animated background |
| Axios | 1.13 | HTTP client |
| React Router | 7 | Routing |
| Lucide React | 0.562 | Icons |

### Backend

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| Node.js | 18+ | Runtime |
| Express | 5 | Web framework |
| Mongoose | 9 | MongoDB ODM |
| JWT (jsonwebtoken) | - | Authentication |
| bcryptjs | - | Password hashing |
| cookie-parser | - | Parse httpOnly cookies |
| CORS | 2.85 | Cross-origin requests |
| dotenv | 17 | Environment variables |

### Database

- MongoDB (local hoặc Atlas)

## 📦 Cài đặt

### Yêu cầu

- Node.js 18+
- MongoDB (local hoặc Atlas)

### Development

**1. Clone repository:**

```bash
git clone <repository-url>
cd Todo-Tasks
```

**2. Cài đặt dependencies:**

```bash
npm run install:all
```

**3. Cấu hình environment variables:**

Tạo file `backend/.env` (copy từ `backend/.env.example`):

```bash
cp backend/.env.example backend/.env
```

```env
# Database
MONGO_URI=mongodb://localhost:27017/todo-app

# Server
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
COOKIE_MAX_AGE=604800000
```

> ⚠️ **Quan trọng:** Thay đổi `JWT_SECRET` thành một chuỗi ngẫu nhiên dài trong production.

**4. Chạy ứng dụng:**

Chạy backend và frontend ở 2 terminal riêng:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

**5. Mở browser:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api

## 🔐 Luồng xác thực

```
1. User đăng ký → POST /api/auth/register
2. User đăng nhập → POST /api/auth/login → Server trả về httpOnly cookie chứa JWT
3. Mọi request tiếp theo tự động gửi cookie
4. Middleware auth verify JWT → attach req.user
5. Tasks được filter theo userId → mỗi user chỉ thấy task của mình
6. User đăng xuất → POST /api/auth/logout → Xóa cookie
```

## 📱 API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Body | Auth |
|--------|----------|-------|------|------|
| `POST` | `/api/auth/register` | Đăng ký tài khoản | `{ username, email, password }` | ❌ |
| `POST` | `/api/auth/login` | Đăng nhập | `{ email, password }` | ❌ |
| `POST` | `/api/auth/logout` | Đăng xuất | - | ✅ |
| `GET` | `/api/auth/me` | Lấy thông tin user hiện tại | - | ✅ |

### Tasks

> ⚠️ Tất cả task endpoints đều yêu cầu đăng nhập.

| Method | Endpoint | Mô tả | Query Params |
|--------|----------|-------|--------------|
| `GET` | `/api/tasks` | Lấy danh sách tasks (có phân trang) | `page`, `limit`, `status` |
| `GET` | `/api/tasks/counts` | Lấy thống kê số lượng tasks | - |
| `POST` | `/api/tasks` | Tạo task mới | - |
| `PUT` | `/api/tasks/:id` | Cập nhật task | - |
| `DELETE` | `/api/tasks/:id` | Xóa task | - |

### Query Parameters

**GET /api/tasks:**

| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| `page` | number | 1 | Trang hiện tại |
| `limit` | number | 5 | Số tasks mỗi trang |
| `status` | string | all | Lọc theo trạng thái (`active`, `completed`) |

### Response Examples

**POST /api/auth/register:**

```json
{
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**GET /api/tasks?page=1&limit=5&status=active:**

```json
{
  "tasks": [
    {
      "_id": "67a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Học React",
      "status": "active",
      "completedAt": null,
      "userId": "...",
      "createdAt": "2026-04-04T10:00:00.000Z",
      "updatedAt": "2026-04-04T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalTasks": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**GET /api/tasks/counts:**

```json
{
  "total": 15,
  "active": 8,
  "completed": 7
}
```

### Error Responses

| Status Code | Mô tả |
|-------------|-------|
| `400` | Input không hợp lệ, username/email đã tồn tại |
| `401` | Chưa đăng nhập, token hết hạn hoặc không hợp lệ |
| `404` | Task không tồn tại |
| `500` | Lỗi server |

## 🚀 Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

Production mode: Express sẽ serve static files từ `frontend/dist/` và xử lý SPA routing.

## 🌐 Deployment

### Deploy trên Render:

1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Connect repository
4. Set environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_connection_string`
   - `FRONTEND_URL=https://your-app.onrender.com`
   - `JWT_SECRET=your-secure-random-secret`
   - `JWT_EXPIRES_IN=7d`
   - `COOKIE_MAX_AGE=604800000`
5. Build Command: `npm install && npm install --prefix frontend && npm install --prefix backend && npm run build --prefix frontend`
6. Start Command: `npm run start --prefix backend`

Hoặc dùng `render.yaml` có sẵn để auto-deploy.

## 📁 Cấu trúc Project

```
Todo-Tasks/
├── backend/
│   ├── models/
│   │   ├── Task.js                 # Mongoose schema (có userId)
│   │   └── User.js                 # User schema + bcrypt
│   └── src/
│       ├── config/
│       │   └── db.js               # MongoDB connection
│       ├── controllers/
│       │   ├── authControllers.js  # Register, login, logout, getMe
│       │   └── tasksControllers.js # CRUD tasks (filter theo userId)
│       ├── middleware/
│       │   └── auth.js             # JWT verification middleware
│       ├── routes/
│       │   ├── authRoutes.js       # /api/auth/* routes
│       │   └── tasksRouters.js     # /api/tasks/* routes (có auth)
│       └── server.js               # Express entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/                 # Shadcn UI primitives
│       │   │   ├── button.jsx
│       │   │   ├── card.jsx
│       │   │   ├── checkbox.jsx
│       │   │   ├── input.jsx
│       │   │   └── animated-shader-background.jsx
│       │   ├── TodoApp.jsx         # Main container component
│       │   ├── TaskForm.jsx        # Form thêm task mới
│       │   ├── TaskItem.jsx        # Item task đơn lẻ
│       │   ├── FilterBar.jsx       # Thanh lọc trạng thái
│       │   ├── Pagination.jsx      # Component phân trang
│       │   └── ProtectedRoute.jsx  # Route bảo vệ (yêu cầu auth)
│       ├── context/
│       │   └── AuthContext.jsx     # Auth state management
│       ├── pages/
│       │   ├── LoginPage.jsx       # Trang đăng nhập
│       │   ├── RegisterPage.jsx    # Trang đăng ký
│       │   └── NotFound.jsx        # 404 page
│       ├── services/
│       │   └── api.js              # Axios API client
│       ├── lib/
│       │   └── utils.js            # Utility helpers
│       ├── App.jsx                 # Router + AuthProvider setup
│       └── main.jsx                # React entry point
├── package.json                    # Root workspace scripts
├── render.yaml                     # Render deployment config
└── README.md
```

## 🔧 Scripts

| Command | Mô tả |
|---------|-------|
| `npm run install:all` | Cài đặt tất cả dependencies |
| `npm run build` | Build frontend production |
| `npm start` | Start production server (backend) |
| `npm run dev:frontend` | Chạy frontend dev server (Vite) |
| `npm run dev:backend` | Chạy backend dev server (nodemon) |
| `npm run lint --prefix frontend` | Chạy ESLint frontend |

## 🗄️ Data Models

### User

```javascript
{
  username: String,     // required, unique, trim, 3-30 chars
  email: String,        // required, unique, lowercase
  password: String,     // required, hashed (bcrypt), min 6 chars
  createdAt: Date,      // auto
  updatedAt: Date,      // auto
}
```

### Task

```javascript
{
  title: String,          // required, trim
  status: String,         // "active" | "completed", default: "active"
  completedAt: Date,      // null khi chưa hoàn thành
  userId: ObjectId,       // ref: User (required)
  createdAt: Date,        // auto
  updatedAt: Date,        // auto
}
```

## 🔒 Bảo mật

- **JWT httpOnly cookies** — Token không thể truy cập qua JavaScript, chống XSS
- **Password hashing** — bcrypt với salt rounds = 12
- **CORS allowlist** — Chỉ cho phép origins đã cấu hình
- **Validation ObjectId** — Trước khi query database
- **Input sanitization** — Trim và validate input ở backend
- **User isolation** — Mỗi user chỉ thấy & sửa được task của mình
- **Request timeout** — 10s ở frontend
- **401 interceptor** — Tự động redirect về `/login` khi token hết hạn

## 📝 License

ISC

## 👤 VNAT
