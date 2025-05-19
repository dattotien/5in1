# HỆ THỐNG ĐIỂM DANH BẰNG KHUÔN MẶT
Dự án này là một mô hình của hệ thống điểm danh bằng khuôn mặt. Nó sử dụng các mô hình MTCNN và InceptionResNet-V1 để mô phỏng một hệ thống nhận dạng khuôn mặt. Dự án này dành cho mục đích điểm danh trong học tập.
<!-- Mục lục -->
<details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#Giới thiệu về dự án">Giới thiệu về dự án</a>
      <ul>
        <li><a href="#built-with">Được xây dựng bởi</a></li>
      </ul>
    </li>
    <li>
      <a href="#Hướng dẫn cài đặt">Hướng dẫn cài đặt</a>
      <ul>
        <li><a href="#prerequisites">Điều kiện tiên quyết</a></li>
        <li><a href="#installation">Cài đặt</a></li>
      </ul>
    </li>
    <li><a href="#usage">Cách sử dụng</a></li>
    <li><a href="#roadmap">Kế hoạch phát triển</a></li>
    <li><a href="#contributing">Đóng góp</a></li>
    <li><a href="#acknowledgments">Lời cảm ơn</a></li>
  </ol>
</details>


## Giới thiệu về dự án
Dự án này là một mô hình của hệ thống điểm danh bằng khuôn mặt dành cho môi trường học tập. Nó sử dụng các mô hình MTCNN và InceptionResNet-V1 để mô phỏng quy trình nhận dạng khuôn mặt nhằm phục vụ mục đích điểm danh. Hệ thống bao gồm nhiều thành phần:

- **Backend**: Xử lý API, chạy mô hình AI để nhận diện khuôn mặt/biển số, kết nối và lưu trữ kết quả vào cơ sở dữ liệu.
- **Frontend**: Giao diện người dùng chính để gửi ảnh/video lên backend và hiển thị kết quả nhận diện theo thời gian thực.
- **Admin-Frontend**: Giao diện quản trị (có thể tách riêng hoặc tích hợp chung với frontend) để quản lý người dùng, xem log, và chỉnh sửa dữ liệu trong cơ sở dữ liệu.
- **Docker Compose**: Tập hợp các service thành một môi trường đồng nhất, dễ triển khai.

## Hướng dẫn cài đặt

### 1. Điều kiện tiên quyết
Trước khi bắt đầu, hãy đảm bảo hệ thống của bạn đã cài đặt đủ các phần mềm sau:
- **Python 3.8+** 
- **Docker** và **Docker Compose** 
- **Git**

### 2.Cài đặt
#### Cài đặt Docker Compose

## Cách sử dụng

### 1. Đăng ký khuôn mặt (Register)
1. Truy cập giao diện người dùng: http://localhost:
2. Cho phép trình duyệt truy cập webcam.  
- Đảm bảo khuôn mặt hiển thị gần hết khung hình, không bị che khuất.
3. Nhấn nút **“.....”** hoặc **“.....”** để frontend gửi ảnh lên backend.
4. Backend thực hiện kiểm tra:
- Kiểm tra có ít nhất một khuôn mặt rõ ràng (sử dụng MTCNN).  
- Nếu ảnh hợp lệ, backend chạy InceptionResNet-V1 để trích xuất `face_encoding`.  
- Lưu `face_encoding` cùng thông tin người dùng vào cơ sở dữ liệu.
---

### 2. Điểm danh (Attendance)
1. Truy cập giao diện điểm danh:  http://localhost:
2. Cho phép trình duyệt truy cập webcam.  
- Hệ thống liên tục quét khuôn mặt theo thời gian thực.
3. Khi phát hiện khuôn mặt, backend so khớp với `face_encoding` đã lưu:
- Nếu khớp, ghi nhận lịch sử điểm danh và trả về tên/sinh viên.  
- Nếu không khớp, hiển thị thông báo **“Không nhận diện được”**.

---

### 3. Giao diện quản trị (Admin)
1. Truy cập:.... Sau đó đăng nhập bằng tài khoản admin
2. Các chức năng chính:
- **Quản lý danh sách người dùng** (thêm, sửa, xóa).  
- **Chỉnh sửa dữ liệu trực tiếp** (nếu cần).

3. Các API liên quan:
- `GET /api/users`  
  Lấy danh sách người dùng.
- `POST /api/users`  
  Tạo mới người dùng (kèm `face_encoding`).
- `GET /api/attendance`  
  Lấy log điểm danh.
- `DELETE /api/users/:id`  
  Xóa người dùng, v.v.

---
## Kế hoạch phát triển

Dưới đây là một số ý tưởng nâng cấp và tính năng sẽ phát triển trong tương lai:

### 1. **Cải thiện độ chính xác**  
- Tìm hiểu và tinh chỉnh tham số của MTCNN để phát hiện khuôn mặt trong điều kiện ánh sáng kém hoặc góc nghiêng.  
- Cập nhật InceptionResNet-V1 hoặc thử nghiệm các mô hình mới hơn (FaceNet, ArcFace) để nâng cao độ chính xác.

### 2. **Hỗ trợ nhận dạng nhiều khuôn mặt cùng lúc**  
- Khi có nhiều sinh viên cùng điểm danh trong một khung hình, thiết lập cơ chế nhận dạng đa khuôn mặt và lưu log cho từng người.

### 3. **Tích hợp thông báo thời gian thực**  
- Sử dụng WebSocket hoặc Socket.IO để đẩy kết quả điểm danh ngay lập tức vào màn hình hiển thị trên dashboard.

### 5. **Ứng dụng di động (Mobile App)**  
- Phát triển app iOS/Android, tích hợp camera điện thoại để điểm danh di động, kết nối API backend.

### 6. **Báo cáo & thống kê nâng cao**  
- Tích hợp biểu đồ thống kê số lượng điểm danh theo tháng, ngày, tiết học.  
- Hỗ trợ xuất báo cáo PDF/Excel.

### 7. **Bảo mật & phân quyền**  
- Xây dựng hệ thống xác thực (JWT/OAuth2) cho backend API.  
- Phân quyền admin, giảng viên, sinh viên khác nhau, giới hạn quyền truy cập API.

---


