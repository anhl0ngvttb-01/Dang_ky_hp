INSERT INTO vai_tro (ma_vai_tro, ten_vai_tro, mo_ta) VALUES
(1, 'admin', 'Quản trị viên toàn quyền hệ thống'),
(2, 'student', 'Sinh viên đăng ký học phần'),
(3, 'teacher', 'Giảng viên giảng dạy');

-- Mật khẩu gốc của tất cả tài khoản dưới đây là: 123456
INSERT INTO nguoi_dung (ma_nguoi_dung, ten_dang_nhap, mat_khau, email, ma_vai_tro, trang_thai) VALUES
(1, 'admin01', '$2b$10$P3rfR0zf4oXbqy1NcoDEzOvHovWFTN6SOxpt4C.vOftIJZvXRBxOG', 'admin@school.edu.vn', 1, 'hoat_dong'),
(2, 'sv202601', '$2b$10$P3rfR0zf4oXbqy1NcoDEzOvHovWFTN6SOxpt4C.vOftIJZvXRBxOG', 'nguyenvana@student.edu.vn', 2, 'hoat_dong'),
(3, 'sv202602', '$2b$10$P3rfR0zf4oXbqy1NcoDEzOvHovWFTN6SOxpt4C.vOftIJZvXRBxOG', 'lethib@student.edu.vn', 2, 'hoat_dong'),
(4, 'gv_minh', '$2b$10$P3rfR0zf4oXbqy1NcoDEzOvHovWFTN6SOxpt4C.vOftIJZvXRBxOG', 'nguyenvanminh@teacher.edu.vn', 3, 'hoat_dong');

INSERT INTO sinh_vien (ma_sinh_vien_id, ma_nguoi_dung, ma_sinh_vien, ho_ten, gioi_tinh, ngay_sinh, so_dien_thoai, email, dia_chi, lop, nganh_hoc, khoa, trang_thai) VALUES
(1, 2, 'SV001', 'Nguyễn Văn A', 'Nam', '2005-05-15', '0912345678', 'nguyenvana@student.edu.vn', '123 Đường Láng, Hà Nội', 'KHMT-K15', 'Khoa học máy tính', '2026', 'dang_hoc'),
(2, 3, 'SV002', 'Lê Thị B', 'Nữ', '2005-09-20', '0987654321', 'lethib@student.edu.vn', '456 Cầu Giấy, Hà Nội', 'CNTT-K15', 'Công nghệ thông tin', '2026', 'dang_hoc');

INSERT INTO giang_vien (ma_giang_vien_id, ma_nguoi_dung, ma_giang_vien, ho_ten, email, so_dien_thoai, bo_mon, hoc_ham, trang_thai) VALUES
(1, 4, 'GV001', 'Nguyễn Văn Minh', 'nguyenvanminh@teacher.edu.vn', '0901234567', 'Kỹ thuật phần mềm', 'TS', 'dang_day');

INSERT INTO mon_hoc (ma_mon_hoc_id, ma_mon_hoc, ten_mon_hoc, so_tin_chi, mo_ta, bat_buoc) VALUES
(1, 'INT1306', 'Cấu trúc dữ liệu và Giải thuật', 3, 'Môn học cơ sở ngành CNTT', 1),
(2, 'INT1339', 'Lập trình Web nâng cao', 3, 'Xây dựng ứng dụng Web với Node.js, PHP', 1),
(3, 'MAT1101', 'Giải tích 1', 4, 'Toán cao cấp dành cho kỹ sư', 1);

-- FIX: ngày đăng ký giờ nằm ở cấp học kỳ (cửa sổ mặc định cho toàn bộ các lớp)
INSERT INTO hoc_ky (ma_hoc_ky_id, ten_hoc_ky, ma_hoc_ky, ngay_bat_dau, ngay_ket_thuc, ngay_bat_dau_dk, ngay_ket_thuc_dk, trang_thai) VALUES
(1, 'Học kỳ 1 Năm học 2026-2027', 'HK261', '2026-08-15', '2026-12-30', '2026-07-01', '2026-07-15', 'dang_mo');

-- Ví dụ mở đăng ký so le theo khóa (K15 đăng ký trước, các khóa khác dùng cửa sổ mặc định ở hoc_ky)
INSERT INTO dot_dang_ky (ma_dot_id, ma_hoc_ky, khoa, ngay_bat_dau, ngay_ket_thuc) VALUES
(1, 1, '2026', '2026-07-01', '2026-07-03');

-- FIX: so_sv_hien_tai để 0, trigger sẽ tự tăng khi có chi_tiet_dang_ky
-- FIX: bỏ ngay_bat_dau_dk/ngay_ket_thuc_dk (đã chuyển lên hoc_ky/dot_dang_ky)
INSERT INTO hoc_phan (ma_hoc_phan_id, ma_hoc_phan, ma_mon_hoc, ma_giang_vien, ma_hoc_ky, thu, tiet_bat_dau, tiet_ket_thuc, phong_hoc, so_tin_chi, so_sv_max, so_sv_hien_tai, trang_thai) VALUES
(1, 'HP001', 1, 1, 1, 2, 1, 3, 'Phòng 301-A2', 3, 60, 0, 'mo_dang_ky'),
(2, 'HP002', 2, 1, 1, 4, 4, 6, 'Phòng 502-B1', 3, 45, 0, 'mo_dang_ky'),
(3, 'HP003', 3, 1, 1, 2, 4, 6, 'Phòng 101-A1', 4, 80, 0, 'mo_dang_ky');

-- FIX: tong_tin_chi để 0, trigger sẽ tự cộng dồn khi insert chi_tiet_dang_ky bên dưới
INSERT INTO dang_ky (ma_dang_ky, ma_sinh_vien, ma_hoc_ky, ngay_dang_ky, tong_tin_chi, trang_thai) VALUES
(1, 1, 1, '2026-07-01 08:30:00', 0, 'da_duyet');

-- Khi 2 dòng dưới đây được insert, trigger sẽ tự động:
--   - Tăng hoc_phan.so_sv_hien_tai của HP001 và HP002 lên 1
--   - Cộng tong_tin_chi của dang_ky #1 lên 3 + 3 = 6
INSERT INTO chi_tiet_dang_ky (ma_chi_tiet, ma_dang_ky, ma_hoc_phan, trang_thai) VALUES
(1, 1, 1, 'da_dang_ky'),
(2, 1, 2, 'da_dang_ky');