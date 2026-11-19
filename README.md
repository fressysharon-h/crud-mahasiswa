# CRUD Mahasiswa (Express.js + MySQL)

## Persiapan
1. Pasang Node.js (v18+) dan nyalakan MySQL (XAMPP / Laragon / MySQL Server).
2. Buka `db.js`, sesuaikan `user` dan `password` dengan MySQL-mu
   (XAMPP biasanya user `root` dengan password kosong).
   Database `db_mahasiswa` dan tabel `mahasiswa` dibuat otomatis saat aplikasi berjalan.
   (File `schema.sql` disediakan jika ingin membuatnya manual.)

## Menjalankan
```
npm install
npm start
```
Buka http://localhost:3000

## Endpoint API
| Method | URL                  | Fungsi                    |
|--------|----------------------|---------------------------|
| GET    | /api/mahasiswa       | Ambil semua (?q= cari)    |
| GET    | /api/mahasiswa/:id   | Ambil satu data           |
| POST   | /api/mahasiswa       | Tambah data               |
| PUT    | /api/mahasiswa/:id   | Ubah data                 |
| DELETE | /api/mahasiswa/:id   | Hapus data                |
