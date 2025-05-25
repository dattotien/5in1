# HỆ THỐNG ĐIỂM DANH BẰNG KHUÔN MẶT

Hệ thống điểm danh tự động sử dụng AI nhận diện khuôn mặt, được xây dựng với kiến trúc microservices hiện đại.
## Báo cáo Usecase: [url.spa/xbf9f](https://drive.google.com/file/d/1s9Doa7CDX_WKRS19gWJo0XjB2fkXDrnW/view?usp=sharing)

## 📑 Mục lục
- [Tổng quan](#tổng-quan)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và Chạy](#cài-đặt-và-chạy)
- [Xử lý Lỗi](#xử-lý-lỗi)
- [Backup & Restore](#backup--restore)

## 🎯 Tổng quan

### Tính năng chính
- **Nhận diện khuôn mặt thời gian thực**: 
  - MTCNN cho phát hiện và căn chỉnh khuôn mặt
  - InceptionResNet-V1 cho trích xuất đặc trưng (512-d)
  - Tối ưu với PyTorch và CUDA
  
- **Phát hiện đa khuôn mặt**: 
  - Phát hiện nhiều khuôn mặt trong frame
  - Điểm danh từng người một
  - Ngưỡng nhận diện có thể điều chỉnh

- **Xử lý dữ liệu thông minh**:
  - Chuẩn hóa dữ liệu tự động
  - Chống giả mạo khuôn mặt
  - Mã hóa face embeddings

## 🏗 Kiến trúc hệ thống

```
┌─────────────┐     ┌─────────────┐
│   Frontend  │     │    Admin    │
│  (Port 3000)│     │ (Port 3001) │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └─────────┬────────┘
                 │
         ┌───────┴───────┐
         │    Backend    │
         │  (Port 8000)  │
         └───────┬───────┘
                 │
         ┌───────┴───────┐
         │   MongoDB     │
         │ (Port 27017)  │
         └───────────────┘
```

### Công nghệ sử dụng
- **Frontend**: React + TypeScript, Material-UI
- **Backend**: FastAPI + Python 3.8
- **Database**: MongoDB
- **DevOps**: Docker, Nginx

## 🔄 Quy trình Hoạt động

**Quá trình Điểm Danh**:
```
Camera Stream (1.5s/frame) -> 
MTCNN Face Detection (kiểm tra 1 khuôn mặt) -> 
Face Alignment & Preprocessing -> 
InceptionResNet-V1 Feature Extraction (512-d) -> 
Face Matching với Dataset (threshold 0.8) -> 
Attendance Recording -> Real-time Update
```

## 💾 Cấu trúc Dữ liệu

### Database Collections (MongoDB)
- **students**: Thông tin sinh viên và face embeddings
- **attendance**: Lịch sử điểm danh
- **message**: Lưu trữ thông báo hệ thống
- **users**: Quản lý người dùng hệ thống

## ⚙️ Yêu cầu hệ thống
- Docker Engine (version 20.10.0+)
- Docker Compose (version 2.0.0+)
- Git

## 🚀 Cài đặt và Chạy

1. **Clone repository**
```bash
git clone <repository_url>
cd <project_folder>
```

2. **Khởi động hệ thống**
```bash
docker compose up -d
```

3. **Truy cập services**
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- Backend API: http://localhost:8000

4. **Thông tin đăng nhập mặc định**
- **User**:
   - Username: haanh
   - Password: 23020353
- **Admin**:
   - Username: datto
   - Password: 23020353

## 🛠 Xử lý Lỗi

### Kiểm tra logs
```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của service cụ thể
docker-compose logs backend
```

### Restart services
```bash
# Restart một service
docker-compose restart backend

# Restart toàn bộ hệ thống
docker-compose restart
```

## 💾 Backup & Restore

### Backup database
```bash
# Tạo backup
docker exec attendance_mongodb mongodump --out /backup/$(date +%Y%m%d)
```

### Restore database
```bash
# Restore
docker exec attendance_mongodb mongorestore --db Attendances /backup/Attendances
```

## 👥 Contributing
- Chu Thị Phương Anh: Backend
- Đặng Minh Nguyệt: Model Developer
- Tô Tiến Đạt: Admin Frontend
- Nguyễn Thị Minh Ly: User Frontend
- Phạm Hà Anh: Database + Docker




