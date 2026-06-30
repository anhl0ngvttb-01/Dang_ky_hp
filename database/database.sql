-- ============================================================
-- SYSTEM: HỆ THỐNG ĐĂNG KÝ HỌC PHẦN CHO SINH VIÊN

DROP DATABASE IF EXISTS course_registration;
CREATE DATABASE course_registration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE course_registration;

-- ============================================================
-- 1. BẢNG: vai_tro (roles)
-- ============================================================
CREATE TABLE vai_tro (
    ma_vai_tro INT AUTO_INCREMENT PRIMARY KEY,
    ten_vai_tro VARCHAR(50) NOT NULL UNIQUE,
    mo_ta VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. BẢNG: nguoi_dung (users)
-- ============================================================
CREATE TABLE nguoi_dung (
    ma_nguoi_dung INT AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL, -- Sẽ được hash bằng bcrypt
    email VARCHAR(100) DEFAULT NULL,
    ma_vai_tro INT NOT NULL,
    trang_thai ENUM('hoat_dong', 'khoa') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_nguoi_dung_vaitro FOREIGN KEY (ma_vai_tro) REFERENCES vai_tro(ma_vai_tro) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_nguoi_dung_username ON nguoi_dung(ten_dang_nhap);

-- ============================================================
-- 3. BẢNG: sinh_vien (students)
-- ============================================================
CREATE TABLE sinh_vien (
    ma_sinh_vien_id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT DEFAULT NULL,
    ma_sinh_vien VARCHAR(20) NOT NULL UNIQUE, -- VD: SV001, SV002
    ho_ten VARCHAR(100) NOT NULL,
    gioi_tinh ENUM('Nam', 'Nữ') DEFAULT 'Nam',
    ngay_sinh DATE DEFAULT NULL,
    so_dien_thoai VARCHAR(15) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    dia_chi VARCHAR(255) DEFAULT NULL,
    lop VARCHAR(50) NOT NULL,
    nganh_hoc VARCHAR(100) NOT NULL,
    khoa VARCHAR(10) NOT NULL, -- Khóa tuyển sinh (VD: K14, 2023)
    trang_thai ENUM('dang_hoc', 'bao_luu', 'thoi_hoc') DEFAULT 'dang_hoc',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sinh_vien_user FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX idx_sinh_vien_code ON sinh_vien(ma_sinh_vien);
CREATE INDEX idx_sinh_vien_lop ON sinh_vien(lop);

-- ============================================================
-- 4. BẢNG: mon_hoc (subjects)
-- ============================================================
CREATE TABLE mon_hoc (
    ma_mon_hoc_id INT AUTO_INCREMENT PRIMARY KEY,
    ma_mon_hoc VARCHAR(20) NOT NULL UNIQUE, -- VD: MON001
    ten_mon_hoc VARCHAR(150) NOT NULL,
    so_tin_chi INT NOT NULL CHECK (so_tin_chi > 0),
    mo_ta TEXT DEFAULT NULL,
    bat_buoc BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_mon_hoc_code ON mon_hoc(ma_mon_hoc);

-- ============================================================
-- 5. BẢNG: hoc_ky (semesters)
-- ============================================================
CREATE TABLE hoc_ky (
    ma_hoc_ky_id INT AUTO_INCREMENT PRIMARY KEY,
    ten_hoc_ky VARCHAR(100) NOT NULL, -- VD: Học kỳ 1 2024-2025
    ma_hoc_ky VARCHAR(20) NOT NULL UNIQUE, -- VD: HK241 (Năm 24 Học kỳ 1)
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai ENUM('chu_mo', 'dang_mo', 'da_ket_thuc') DEFAULT 'chu_mo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. BẢNG: giang_vien (teachers)
-- ============================================================
CREATE TABLE giang_vien (
    ma_giang_vien_id INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung INT DEFAULT NULL,
    ma_giang_vien VARCHAR(20) NOT NULL UNIQUE, -- VD: GV001
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    so_dien_thoai VARCHAR(15) DEFAULT NULL,
    bo_mon VARCHAR(100) DEFAULT NULL,
    hoc_ham VARCHAR(20) DEFAULT NULL, -- VD: ThS, TS, PGS
    trang_thai ENUM('dang_day', 'tam_nghi', 'da_nghi') DEFAULT 'dang_day',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_giang_vien_user FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================================
-- 7. BẢNG: hoc_phan (courses - các lớp học phần mở trong kỳ)
-- ============================================================
CREATE TABLE hoc_phan (
    ma_hoc_phan_id INT AUTO_INCREMENT PRIMARY KEY,
    ma_hoc_phan VARCHAR(20) NOT NULL UNIQUE, -- VD: HP001
    ma_mon_hoc INT NOT NULL,
    ma_giang_vien INT NOT NULL,
    ma_hoc_ky INT NOT NULL,
    thu INT NOT NULL CHECK (thu BETWEEN 2 AND 8), -- Thứ 2 đến Chủ nhật (8)
    tiet_bat_dau INT NOT NULL CHECK (tiet_bat_dau BETWEEN 1 AND 12),
    tiet_ket_thuc INT NOT NULL CHECK (tiet_ket_thuc BETWEEN 1 AND 12),
    phong_hoc VARCHAR(50) NOT NULL,
    so_tin_chi INT NOT NULL CHECK (so_tin_chi > 0),
    so_sv_max INT NOT NULL DEFAULT 50,
    so_sv_hien_tai INT NOT NULL DEFAULT 0,
    ngay_bat_dau_dk DATE NOT NULL,
    ngay_ket_thuc_dk DATE NOT NULL,
    trang_thai ENUM('mo_dang_ky', 'khoa_dang_ky', 'huy_lop') DEFAULT 'mo_dang_ky',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hoc_phan_mon FOREIGN KEY (ma_mon_hoc) REFERENCES mon_hoc(ma_mon_hoc_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_hoc_phan_gv FOREIGN KEY (ma_giang_vien) REFERENCES giang_vien(ma_giang_vien_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_hoc_phan_hk FOREIGN KEY (ma_hoc_ky) REFERENCES hoc_ky(ma_hoc_ky_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_tiet_hoc CHECK (tiet_ket_thuc >= tiet_bat_dau)
);

CREATE INDEX idx_hoc_phan_code ON hoc_phan(ma_hoc_phan);
CREATE INDEX idx_hoc_phan_kỳ ON hoc_phan(ma_hoc_ky);

-- ============================================================
-- 8. BẢNG: dang_ky (registrations - Phiếu đăng ký tổng)
-- ============================================================
CREATE TABLE dang_ky (
    ma_dang_ky INT AUTO_INCREMENT PRIMARY KEY,
    ma_sinh_vien INT NOT NULL,
    ma_hoc_ky INT NOT NULL,
    ngay_dang_ky DATETIME DEFAULT CURRENT_TIMESTAMP,
    tong_tin_chi INT DEFAULT 0,
    trang_thai ENUM('cho_duyet', 'da_duyet', 'da_huy') DEFAULT 'da_duyet',
    ghi_chu TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_dang_ky_sv FOREIGN KEY (ma_sinh_vien) REFERENCES sinh_vien(ma_sinh_vien_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_dang_ky_hk FOREIGN KEY (ma_hoc_ky) REFERENCES hoc_ky(ma_hoc_ky_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_sv_hk UNIQUE(ma_sinh_vien, ma_hoc_ky) -- Đảm bảo một kỳ sinh viên chỉ có 1 phiếu đăng ký tổng
);

-- ============================================================
-- 9. BẢNG: chi_tiet_dang_ky (registration_details)
-- ============================================================
CREATE TABLE chi_tiet_dang_ky (
    ma_chi_tiet INT AUTO_INCREMENT PRIMARY KEY,
    ma_dang_ky INT NOT NULL,
    ma_hoc_phan INT NOT NULL,
    trang_thai ENUM('da_dang_ky', 'da_huy') DEFAULT 'da_dang_ky',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ctdk_dang_ky FOREIGN KEY (ma_dang_ky) REFERENCES dang_ky(ma_dang_ky) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctdk_hoc_phan FOREIGN KEY (ma_hoc_phan) REFERENCES hoc_phan(ma_hoc_phan_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_phiu_hoc_phan UNIQUE(ma_dang_ky, ma_hoc_phan) -- Tránh đăng ký trùng lặp một lớp trên cùng một phiếu
);



