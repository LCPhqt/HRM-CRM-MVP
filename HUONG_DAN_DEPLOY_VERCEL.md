# Hướng Dẫn Deploy Lên Vercel

## 📋 Tổng Quan

Vercel chủ yếu dùng để deploy **Frontend** (React/Vite). Backend services cần deploy riêng trên các platform khác (Railway, Render, Heroku, hoặc VPS).

---

## 🚀 Cách 1: Deploy Qua Vercel CLI (Khuyến nghị)

### Bước 1: Cài đặt Vercel CLI

```powershell
npm install -g vercel
```

### Bước 2: Đăng nhập Vercel

```powershell
vercel login
```

### Bước 3: Deploy Frontend

```powershell
# Di chuyển vào thư mục frontend
cd frontend-hrmSOA

# Deploy lần đầu (sẽ hỏi các câu hỏi)
vercel

# Deploy production
vercel --prod
```

### Bước 4: Cấu hình Environment Variables

Sau khi deploy, vào Vercel Dashboard:
1. Vào project settings
2. Chọn **Environment Variables**
3. Thêm biến:
   - `VITE_API_BASE` = URL của backend API (ví dụ: `https://your-backend.railway.app`)

### Bước 5: Redeploy để áp dụng biến môi trường

```powershell
vercel --prod
```

---

## 🌐 Cách 2: Deploy Qua GitHub (Tự động)

### Bước 1: Push code lên GitHub

```powershell
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Bước 2: Kết nối với Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **Add New Project**
4. Chọn repository của bạn
5. Cấu hình:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-hrmSOA`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Bước 3: Thêm Environment Variables

Trong Vercel Dashboard:
- **Settings** → **Environment Variables**
- Thêm:
  ```
  VITE_API_BASE = https://your-backend-api.com
  ```

### Bước 4: Deploy

Click **Deploy** - Vercel sẽ tự động build và deploy!

---

## ⚙️ Cấu Hình Chi Tiết

### File `vercel.json` (đã tạo ở root)

File này đã được tạo để cấu hình Vercel. Nếu deploy từ thư mục `frontend-hrmSOA`, có thể không cần file này.

### Cấu hình trong Vercel Dashboard

Nếu deploy từ thư mục `frontend-hrmSOA`:

**Build Settings:**
- Framework Preset: `Vite`
- Root Directory: `frontend-hrmSOA` (hoặc để trống nếu đã ở trong thư mục)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:**
```
VITE_API_BASE=https://your-backend-api.com
```

---

## 🔧 Deploy Backend Services

Vercel không phù hợp cho backend Node.js services. Bạn cần deploy backend trên:

### Option 1: Railway (Khuyến nghị - Dễ dùng)

1. Truy cập [railway.app](https://railway.app)
2. Tạo project mới
3. Deploy từng service:
   - Identity Service
   - Admin HR Service
   - CRM Service
   - Profile Service
   - Payroll Service
   - Gateway

**Lưu ý:** Railway có thể deploy nhiều services trong một project.

### Option 2: Render

1. Truy cập [render.com](https://render.com)
2. Tạo Web Service cho mỗi backend service
3. Kết nối GitHub repository

### Option 3: VPS (DigitalOcean, AWS, etc.)

Deploy backend services trên VPS và cấu hình:
- Nginx reverse proxy
- PM2 để quản lý processes
- MongoDB (hoặc MongoDB Atlas)

---

## 📝 Checklist Trước Khi Deploy

### Frontend:
- [ ] Đã test build thành công: `npm run build`
- [ ] Đã cấu hình `VITE_API_BASE` environment variable
- [ ] Đã kiểm tra các API calls trong code
- [ ] Đã test preview build: `npm run preview`

### Backend:
- [ ] Đã deploy backend services (Railway/Render/VPS)
- [ ] Đã cấu hình CORS cho backend
- [ ] Đã cấu hình MongoDB (MongoDB Atlas hoặc self-hosted)
- [ ] Đã test API endpoints hoạt động

---

## 🔗 Cấu Hình CORS Cho Backend

Nếu backend deploy trên domain khác, cần cấu hình CORS:

```javascript
// Trong backend gateway hoặc mỗi service
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173' // Cho development
  ],
  credentials: true
}));
```

---

## 🧪 Test Sau Khi Deploy

### 1. Kiểm tra Frontend

```powershell
# Truy cập URL Vercel cung cấp
# Ví dụ: https://your-app.vercel.app
```

### 2. Kiểm tra API Connection

Mở browser console và kiểm tra:
- Không có lỗi CORS
- API calls thành công
- Login/Register hoạt động

### 3. Test Các Chức Năng

- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập
- [ ] Xem profile
- [ ] Các chức năng admin/staff

---

## 🐛 Troubleshooting

### Lỗi Build Failed

```powershell
# Kiểm tra build local trước
cd frontend-hrmSOA
npm run build

# Nếu lỗi, sửa lỗi trước khi deploy
```

### Lỗi API không kết nối được

1. Kiểm tra `VITE_API_BASE` đã được set đúng chưa
2. Kiểm tra backend đang chạy
3. Kiểm tra CORS configuration
4. Kiểm tra network tab trong browser console

### Lỗi 404 khi refresh trang

Vercel đã được cấu hình với `rewrites` để xử lý React Router. Nếu vẫn lỗi:
- Kiểm tra file `vercel.json`
- Đảm bảo `rewrites` đã được cấu hình đúng

### Environment Variables không hoạt động

1. Đảm bảo biến bắt đầu với `VITE_` (cho Vite)
2. Redeploy sau khi thêm biến môi trường
3. Kiểm tra trong Vercel Dashboard → Settings → Environment Variables

---

## 📚 Tài Liệu Tham Khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)

---

## 🎯 Quick Start (Tóm tắt)

```powershell
# 1. Cài Vercel CLI
npm install -g vercel

# 2. Đăng nhập
vercel login

# 3. Deploy
cd frontend-hrmSOA
vercel --prod

# 4. Thêm environment variable trong Vercel Dashboard
# VITE_API_BASE = https://your-backend-api.com

# 5. Redeploy
vercel --prod
```

---

## 💡 Lưu Ý Quan Trọng

1. **Backend phải deploy riêng** - Vercel chỉ phù hợp cho frontend
2. **MongoDB** - Nên dùng MongoDB Atlas (cloud) thay vì self-hosted
3. **Environment Variables** - Phải bắt đầu với `VITE_` cho Vite projects
4. **CORS** - Đảm bảo backend đã cấu hình CORS cho domain Vercel
5. **Build Command** - Đảm bảo `npm run build` chạy thành công trước khi deploy

