# HỆ THỐNG ĐIỂM DANH BẰNG KHUÔN MẶT

Dự án này là một hệ thống điểm danh sử dụng nhận diện khuôn mặt, được xây dựng với các công nghệ hiện đại và kiến trúc microservices.

## Mục lục
- [Tổng quan](#tổng-quan)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và Chạy](#cài-đặt-và-chạy)
- [Cấu trúc Project](#cấu-trúc-project)
- [API Documentation](#api-documentation)
- [Xử lý Lỗi](#xử-lý-lỗi)
- [Backup & Restore](#backup--restore)

## Tổng quan

Hệ thống bao gồm các thành phần chính:
- **Frontend**: Giao diện người dùng (React)
- **Admin Dashboard**: Giao diện quản trị (React)
- **Backend API**: REST API (FastAPI)
- **Database**: MongoDB
- **Face Recognition Service**: MTCNN và InceptionResNet-V1

## Kiến trúc hệ thống

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

## Yêu cầu hệ thống

- Docker Engine (version 20.10.0+)
- Docker Compose (version 2.0.0+)
- Git

## Cài đặt và Chạy

### 1. Clone repository
```bash
git clone <repository_url>
cd <project_folder>
```

### 2. Khởi động hệ thống
```bash
docker-compose up -d
```

### 3. Kiểm tra trạng thái
```bash
docker-compose ps
```

### 4. Truy cập các services
- Frontend: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- Backend API: http://localhost:8000
- MongoDB: localhost:27017

### 5. Thông tin đăng nhập mặc định
- Username: admin
- Password: admin123

## Cấu trúc Project

```
project/
├── frontend/                # Frontend React app
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── frontend/admin/         # Admin Dashboard
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── backend/               # Backend FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
├── backup/               # MongoDB backup
├── docker-compose.yml    # Docker configuration
├── mongo-init.sh        # MongoDB initialization
└── README.md
```

## API Documentation

### Authentication
- POST /api/auth/login
- POST /api/auth/logout

### User Management
- GET /api/users
- POST /api/users
- PUT /api/users/{id}
- DELETE /api/users/{id}

### Attendance
- POST /api/attendance/check
- GET /api/attendance/history
- GET /api/attendance/stats

## Xử lý Lỗi

### 1. Kiểm tra logs
```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của service cụ thể
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### 2. Restart services
```bash
# Restart một service
docker-compose restart backend

# Restart toàn bộ hệ thống
docker-compose restart
```

### 3. Lỗi thường gặp

#### MongoDB Connection Failed
```bash
# Kiểm tra MongoDB logs
docker-compose logs mongodb

# Kiểm tra MongoDB status
docker exec -it attendance_mongodb mongosh -u admin -p admin123
```

#### Frontend không kết nối được Backend
1. Kiểm tra CORS configuration
2. Kiểm tra API URL trong environment
3. Kiểm tra nginx proxy configuration

## Backup & Restore

### 1. Backup database
```bash
# Tạo backup
docker exec attendance_mongodb mongodump --username admin --password admin123 --out /backup/$(date +%Y%m%d)

# Copy backup ra host
docker cp attendance_mongodb:/backup ./backup
```

### 2. Restore database
```bash
# Copy backup vào container
docker cp ./backup attendance_mongodb:/backup

# Restore
docker exec attendance_mongodb mongorestore --username admin --password admin123 --db Attendances /backup/Attendances
```

### 3. Automatic Backup
Hệ thống tự động backup database mỗi ngày vào thư mục `./backup`

## Quản lý Container

### 1. Dừng hệ thống
```bash
docker-compose down
```

### 2. Xóa toàn bộ data
```bash
docker-compose down -v
```

### 3. Rebuild và chạy lại
```bash
docker-compose up -d --build
```

### 4. Scale services
```bash
docker-compose up -d --scale backend=2
```

## Monitoring

### 1. Kiểm tra tài nguyên
```bash
docker stats
```

### 2. Kiểm tra container health
```bash
docker-compose ps
```

### 3. Kiểm tra network
```bash
docker network inspect attendance_network
```

## Security

1. Tất cả passwords được mã hóa
2. MongoDB authentication enabled
3. CORS được cấu hình chặt chẽ
4. Nginx reverse proxy bảo vệ backend
5. Docker network isolation

## Lưu ý

1. **Data Persistence**: 
   - Dữ liệu MongoDB được lưu trong Docker volume
   - Backup thường xuyên để đảm bảo an toàn

2. **Environment Variables**:
   - Kiểm tra các biến môi trường trong docker-compose.yml
   - Có thể override bằng file .env

3. **Performance**:
   - MongoDB index được tự động tạo
   - Frontend được build và serve bởi Nginx
   - Backend có thể scale horizontal

4. **Troubleshooting**:
   - Check logs thường xuyên
   - Monitor system resources
   - Backup trước khi update

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details


