# 🛒 KDP Store - Hệ Thống Quản Lý & Cửa Hàng Trực Tuyến

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

> ⚠️ **LƯU Ý:** Đây là đồ án môn học, hoàn toàn phi thương mại và chỉ phục vụ cho mục đích học tập, nghiên cứu.

**KDP Store** là một giải pháp nền tảng thương mại điện tử hiện đại, được tối ưu hóa để quản lý và vận hành cửa hàng trực tuyến (kinh doanh sản phẩm số, sách KDP - Kindle Direct Publishing, hoặc sản phẩm vật lý). Dự án được xây dựng với kiến trúc tối ưu, giao diện thân thiện với người dùng và hệ thống quản trị mạnh mẽ dành cho admin.

---

## 📌 Tính Năng Nổi Bật

### 🌐 Dành Cho Khách Hàng (Frontend)
* **Giao diện Responsive:** Hiển thị tối ưu trên mọi thiết bị (Mobile, Tablet, Desktop).
* **Tìm kiếm & Bộ lọc thông minh:** Tìm kiếm sản phẩm theo từ khóa, danh mục, khoảng giá và đánh giá.
* **Giỏ hàng & Thanh toán:** Thêm/sửa/xóa sản phẩm trong giỏ hàng, tích hợp cổng thanh toán trực tuyến bảo mật.
* **Quản lý tài khoản:** Đăng ký, đăng nhập (hỗ trợ JWT / OAuth2), theo dõi lịch sử đơn hàng và trạng thái vận chuyển.
* **Đánh giá sản phẩm:** Khách hàng có thể để lại bình luận và chấm điểm sao cho sản phẩm đã mua.

### 🔐 Dành Cho Quản Trị Viên (Admin Dashboard)
* **Tổng quan kinh doanh:** Biểu đồ thống kê doanh thu, số lượng đơn hàng và người dùng mới theo thời gian thực.
* **Quản lý sản phẩm:** Thêm, sửa, xóa sản phẩm, quản lý kho hàng (inventory), danh mục và biến thể (màu sắc, kích thước, định dạng...).
* **Quản lý đơn hàng:** Tiếp nhận, cập nhật trạng thái đơn hàng (Chờ xử lý, Đang giao, Đã giao, Hủy đơn).
* **Quản lý người dùng:** Phân quyền tài khoản (Admin, Nhân viên, Khách hàng), khóa/mở khóa tài khoản khi cần thiết.

---

## 🛠️ Công Nghệ Sử Dụng

Dự án được phát triển dựa trên các công nghệ tiên tiến nhằm đảm bảo hiệu năng và khả năng mở rộng:

* **Frontend:** React.js / Next.js (hoặc HTML5, CSS3, JavaScript, TailwindCSS / Bootstrap)
* **Backend:** Node.js (Express) / Python (Django/FastAPI) / Java (Spring Boot)
* **Cơ sở dữ liệu:** MongoDB / MySQL / PostgreSQL
* **Xác thực:** JSON Web Token (JWT) / Firebase Auth
* **Quản lý trạng thái:** Redux Toolkit / Context API
* **Công cụ khác:** Git, Docker, Axios, Mongoose

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
KDP_Store/
├── client/               # Mã nguồn giao diện người dùng (Frontend)
│   ├── public/           # Tài sản tĩnh (Hình ảnh, Thư mục biểu tượng)
│   └── src/
│       ├── components/   # Các thành phần tái sử dụng (Navbar, Footer, Card...)
│       ├── pages/        # Các trang chính (Home, Shop, Cart, Admin...)
│       ├── redux/        # Quản lý trạng thái ứng dụng (Slices, Store)
│       └── utils/        # Các hàm tiện ích hỗ trợ
├── server/               # Mã nguồn xử lý logic và API (Backend)
│   ├── config/           # Cấu hình cơ sở dữ liệu, biến môi trường
│   ├── controllers/      # Hàm xử lý logic cho các tuyến đường (Routes)
│   ├── models/           # Định nghĩa cấu trúc dữ liệu (Database Schemas)
│   ├── middleware/       # Kiểm tra quyền truy cập, xác thực JWT
│   └── routes/           # Định nghĩa các Endpoint API (User, Product, Order)
├── .gitignore            # Các tệp tin Git bỏ qua không lưu trữ
├── README.md             # Tài liệu hướng dẫn dự án này
└── package.json          # Danh sách thư viện phụ thuộc của dự án
```
🚀 Hướng Dẫn Cài Đặt & Khởi Chạy
Để chạy dự án này dưới môi trường Local (máy tính cá nhân), hãy thực hiện theo các bước sau:

📋 Yêu cầu hệ thống
Đã cài đặt Node.js (Phiên bản khuyến nghị: >= 16.x)

Đã cài đặt Git

Hệ quản trị cơ sở dữ liệu tương ứng (MongoDB, MySQL...) đang chạy.

📦 Các bước thực hiện
Bước 1: Clone (Tải) kho lưu trữ về máy

```Bash
git clone [https://github.com/Jye-a-dev/KDP_Store.git](https://github.com/Jye-a-dev/KDP_Store.git)
cd KDP_Store
```
Bước 2: Cấu hình biến môi trường (Environment Variables)

Di chuyển vào thư mục server/ (hoặc thư mục gốc tùy cấu trúc backend của bạn). Tạo tệp .env dựa trên tệp mẫu và điền các thông số cần thiết:

Đoạn mã
```.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/kdp_store
JWT_SECRET=chuoibaomatcuaban_o_day
PAYMENT_GATEWAY_KEY=khoa_thanh_toan_cua_ban
```
Bước 3: Cài đặt thư viện & Khởi chạy Backend

```Bash
cd server
npm install
npm start # hoặc npm run dev
```
Backend của bạn sẽ chạy tại địa chỉ: http://localhost:5000

Bước 4: Cài đặt thư viện & Khởi chạy Frontend

```Bash
cd ../client
npm install
npm start # hoặc npm run dev
```
Giao diện ứng dụng sẽ tự động mở tại địa chỉ: http://localhost:3000
