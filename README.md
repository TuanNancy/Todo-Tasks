# 📝 Todo App - Full Stack Application

Một ứng dụng Todo List đầy đủ tính năng được xây dựng với React, Node.js, Express, và MongoDB.

## ✨ Tính năng

- ✅ Thêm, sửa, xóa công việc
- ✅ Đánh dấu hoàn thành công việc
- ✅ Lọc theo trạng thái (Tất cả, Đang làm, Hoàn thành)
- ✅ Phân trang (5 tasks mỗi trang)
- ✅ Hiển thị ngày tháng tạo và hoàn thành
- ✅ Animated shader background
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Toast notifications

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- Shadcn UI
- Sonner (Toast notifications)
- Three.js (Animated background)
- Axios

### Backend

- Node.js
- Express 5
- MongoDB / Mongoose
- CORS

## 📦 Cài đặt

### Yêu cầu

- Node.js 18+
- MongoDB (local hoặc Atlas)

### Development

1. **Clone repository:**

```bash
git clone <repository-url>
cd todo-appx
```

2. **Cài đặt dependencies:**

```bash
npm run install:all
```

3. **Cấu hình environment variables:**

Tạo file `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/todo-app
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. **Chạy backend:**

```bash
npm run dev:backend
# hoặc
cd backend && npm run dev
```

5. **Chạy frontend (terminal mới):**

```bash
npm run dev:frontend
# hoặc
cd frontend && npm run dev
```

6. **Mở browser:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api/tasks

## 🚀 Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📱 API Endpoints

- `GET /api/tasks` - Lấy tất cả tasks
- `POST /api/tasks` - Tạo task mới
  ```json
  { "title": "Task title" }
  ```
- `PUT /api/tasks/:id` - Cập nhật task
  ```json
  { "title": "Updated title", "status": "completed" }
  ```
- `DELETE /api/tasks/:id` - Xóa task

## 🌐 Deployment

### Quick Deploy trên Render:

1. Push code lên GitHub
2. Tạo Web Service trên Render
3. Connect GitHub repository
4. Set environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_connection_string`
   - `FRONTEND_URL=https://your-app.onrender.com`
5. Build Command: `npm install && npm install --prefix frontend && npm install --prefix backend && npm run build --prefix frontend`
6. Start Command: `npm run start --prefix backend`

## 📁 Cấu trúc Project

```
todo-appx/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── tasksControllers.js
│   │   ├── routes/
│   │   │   └── tasksRouters.js
│   │   └── server.js
│   ├── models/
│   │   └── Task.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── TodoApp.jsx
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
├── package.json
├── render.yaml
└── README.md
```

## 🔧 Scripts

- `npm run install:all` - Cài đặt tất cả dependencies
- `npm run build` - Build frontend
- `npm start` - Start production server
- `npm run dev:frontend` - Chạy frontend dev server
- `npm run dev:backend` - Chạy backend dev server

## 📝 License

ISC

## 👤 VNAT
