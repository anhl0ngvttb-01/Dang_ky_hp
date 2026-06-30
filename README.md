# Hệ thống đăng ký học phần

## Cài đặt nhanh

1. Cài đặt dependencies:
   npm install

2. Tạo file môi trường:
   cp .env.example .env

3. Tạo database:
   mysql -u root -p < database/database.sql
   mysql -u root -p < database/seed.sql

4. Chạy ứng dụng:
   npm start

## Cấu trúc dự án

- app.js: điểm vào chính
- config/: cấu hình chung
- controllers/: xử lý request
- models/: truy vấn dữ liệu
- routes/: định tuyến
- views/: giao diện EJS
- public/: tài nguyên tĩnh
- database/: schema và seed
