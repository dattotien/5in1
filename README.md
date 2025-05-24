# HỆ THỐNG ĐIỂM DANH BẰNG KHUÔN MẶT

Dự án này là một hệ thống điểm danh sử dụng nhận diện khuôn mặt, được xây dựng với các công nghệ hiện đại và kiến trúc microservices. Hệ thống cho phép tự động hóa quá trình điểm danh trong môi trường học tập thông qua việc sử dụng công nghệ AI để nhận diện khuôn mặt.

### Tính năng chính:
- **Nhận diện khuôn mặt thời gian thực**: 
  - Sử dụng MTCNN để phát hiện và căn chỉnh khuôn mặt
  - Áp dụng InceptionResNet-V1 để trích xuất đặc trưng khuôn mặt (512-dimensional face embeddings)
  - Tối ưu hóa thời gian xử lý với PyTorch và CUDA acceleration
  
- **Phát hiện đa khuôn mặt**: 
  - Có khả năng phát hiện nhiều khuôn mặt trong cùng một khung hình
  - Thực hiện điểm danh từng người một để đảm bảo độ chính xác
  - Hỗ trợ điều chỉnh ngưỡng nhận diện (confidence threshold)

- **Xử lý dữ liệu thông minh**:
  - Tự động chuẩn hóa và làm sạch dữ liệu đầu vào
  - Hệ thống chống giả mạo khuôn mặt (anti-spoofing)
  - Lưu trữ và mã hóa an toàn face embeddings

### Kiến trúc Hệ thống Chi tiết:

#### 1. Frontend Service (Port 3000):
- **Công nghệ**: React + TypeScript
- **Tính năng**:
  - Giao diện điểm danh trực quan
  - Tích hợp WebSocket cho cập nhật thời gian thực
  - Responsive design cho nhiều thiết bị
  - Tối ưu hóa performance với React.memo và useMemo

#### 2. Admin Dashboard (Port 3001):
- **Công nghệ**: React + TypeScript
- **Tính năng**:
  - Quản lý thông tin sinh viên và lớp học
  - Thống kê và báo cáo chi tiết
  - Quản lý phiên điểm danh
  - Export dữ liệu đa định dạng

#### 3. Backend Service (Port 8000):
- **Công nghệ**: FastAPI + Python 3.8
- **Core Features**:
  - Face Recognition Pipeline
  - RESTful API với OpenAPI documentation
  - JWT Authentication
  - Rate limiting và request validation
- **Modules**:
  - /auth: Xác thực và phân quyền
  - /users: Quản lý người dùng
  - /attendance: Xử lý điểm danh
  - /reports: Tạo báo cáo

#### 4. Database Layer:
- **MongoDB**:
  - Collections:
    - students: Thông tin sinh viên và face embeddings
    - attendance: Lịch sử điểm danh
    - message: Lưu trữ thông báo hệ thống
    - users: Quản lý người dùng hệ thống
  - Indexes tối ưu cho truy vấn
  - Automatic backups

### Quy trình Hoạt động:

**Quá trình Điểm Danh**:
```
Camera Stream (1.5s/frame) -> 
MTCNN Face Detection (kiểm tra 1 khuôn mặt) -> 
Face Alignment & Preprocessing -> 
InceptionResNet-V1 Feature Extraction (512-d) -> 
Face Matching với Dataset (threshold 0.8) -> 
Attendance Recording -> Real-time Update
```

### Cấu trúc Dữ liệu:

#### 1. Dataset Khuôn Mặt:
- Face embeddings được tính toán trước và lưu trong MongoDB
- Mỗi sinh viên có một face embedding vector (512-d)
- Ngưỡng similarity (threshold) = 0.8 cho việc match khuôn mặt

#### 2. Database Collections (MongoDB):
- **students**: Thông tin sinh viên và face embeddings
- **attendance**: Lịch sử điểm danh
- **message**: Lưu trữ thông báo hệ thống
- **users**: Quản lý người dùng hệ thống

### Xử lý Dữ liệu:

1. **Preprocessing**:
   - Phát hiện khuôn mặt trong khung hình
   - Căn chỉnh và chuẩn hóa kích thước
   - Tối ưu hóa chất lượng ảnh

2. **Face Recognition**:
   - Trích xuất đặc trưng khuôn mặt (512-d embeddings)
   - So sánh với dataset có sẵn
   - Xác định danh tính dựa trên độ tương đồng

3. **Attendance Processing**:
   - Ghi nhận thời gian điểm danh
   - Cập nhật trạng thái real-time
   - Thống kê và báo cáo

### Bảo mật và An toàn:

1. **Authentication & Authorization**:
   - Sử dụng JWT (JSON Web Tokens) cho xác thực API
   - Token hết hạn sau 1 giờ để tăng tính bảo mật
   - Phân quyền rõ ràng: Admin và User thường

2. **Bảo vệ API**:
   - Sử dụng CORS policy cho phép chỉ frontend và admin dashboard được truy cập
   - Rate limiting: Giới hạn số request từ một IP
   - Validate tất cả input từ client

3. **Bảo mật Database**:
   - MongoDB được cấu hình với authentication required
   - Kết nối database qua internal Docker network
   - Backup dữ liệu tự động hàng ngày

### Khả năng Mở rộng:

1. **Container Orchestration**:
   - Sử dụng Docker Compose để quản lý các services
   - Các services có thể được khởi động độc lập
   - Tự động restart khi gặp lỗi

2. **Caching và Performance**:
   - Nginx làm reverse proxy và load balancer
   - Cấu hình Nginx cho static file caching
   - MongoDB indexes cho các truy vấn thường xuyên

3. **Monitoring**:
   - Log files được lưu trữ và quản lý bởi Docker
   - Theo dõi status của các services qua Docker health checks
   - Kiểm tra tài nguyên hệ thống thông qua Docker stats

### Công nghệ sử dụng:
- **Frontend**: 
  - React.js với TypeScript
  - Material-UI cho giao diện người dùng
  - WebSocket cho cập nhật thời gian thực
  
- **Backend**: 
  - FastAPI framework
  - PyTorch cho deep learning
  - MTCNN và InceptionResNet-V1 cho face recognition
  - JWT cho authentication
  
- **Database**: 
  - MongoDB cho lưu trữ dữ liệu
  - Redis cho caching
  
- **DevOps**: 
  - Docker và Docker Compose
  - Nginx cho reverse proxy
  - GitHub Actions cho CI/CD

### Use Cases:


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


