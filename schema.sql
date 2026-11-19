-- Jalankan manual jika ingin membuat database & tabel sendiri (opsional,
-- karena aplikasi sudah membuatnya otomatis saat start).
CREATE DATABASE IF NOT EXISTS db_mahasiswa;
USE db_mahasiswa;

CREATE TABLE IF NOT EXISTS mahasiswa (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nim        VARCHAR(20)  NOT NULL UNIQUE,
  nama       VARCHAR(100) NOT NULL,
  jurusan    VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
