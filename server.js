const express = require('express');
const path = require('path');
const { init, getPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function validasi(body) {
  const { nim, nama, jurusan } = body;
  if (!nim || !nama || !jurusan) return 'NIM, nama, dan jurusan wajib diisi.';
  return null;
}

// Pembungkus agar error async ditangani satu tempat
const aman = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ pesan: 'NIM sudah terdaftar.' });
    console.error(e);
    res.status(500).json({ pesan: 'Terjadi kesalahan pada server.' });
  });

// READ - semua data (opsional pencarian ?q=)
app.get('/api/mahasiswa', aman(async (req, res) => {
  const q = (req.query.q || '').trim();
  const [rows] = q
    ? await getPool().query(
        `SELECT * FROM mahasiswa
         WHERE nim LIKE ? OR nama LIKE ? OR jurusan LIKE ?
         ORDER BY id DESC`, [`%${q}%`, `%${q}%`, `%${q}%`])
    : await getPool().query('SELECT * FROM mahasiswa ORDER BY id DESC');
  res.json(rows);
}));

// READ - satu data
app.get('/api/mahasiswa/:id', aman(async (req, res) => {
  const [rows] = await getPool().query('SELECT * FROM mahasiswa WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ pesan: 'Data tidak ditemukan.' });
  res.json(rows[0]);
}));

// CREATE
app.post('/api/mahasiswa', aman(async (req, res) => {
  const err = validasi(req.body);
  if (err) return res.status(400).json({ pesan: err });
  const { nim, nama, jurusan, email } = req.body;
  const [hasil] = await getPool().query(
    'INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES (?, ?, ?, ?)',
    [nim.trim(), nama.trim(), jurusan.trim(), (email || '').trim()]
  );
  const [rows] = await getPool().query('SELECT * FROM mahasiswa WHERE id = ?', [hasil.insertId]);
  res.status(201).json(rows[0]);
}));

// UPDATE
app.put('/api/mahasiswa/:id', aman(async (req, res) => {
  const err = validasi(req.body);
  if (err) return res.status(400).json({ pesan: err });
  const { nim, nama, jurusan, email } = req.body;
  const [hasil] = await getPool().query(
    'UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ?, email = ? WHERE id = ?',
    [nim.trim(), nama.trim(), jurusan.trim(), (email || '').trim(), req.params.id]
  );
  if (hasil.affectedRows === 0) return res.status(404).json({ pesan: 'Data tidak ditemukan.' });
  const [rows] = await getPool().query('SELECT * FROM mahasiswa WHERE id = ?', [req.params.id]);
  res.json(rows[0]);
}));

// DELETE
app.delete('/api/mahasiswa/:id', aman(async (req, res) => {
  const [hasil] = await getPool().query('DELETE FROM mahasiswa WHERE id = ?', [req.params.id]);
  if (hasil.affectedRows === 0) return res.status(404).json({ pesan: 'Data tidak ditemukan.' });
  res.json({ pesan: 'Data berhasil dihapus.' });
}));

// Jalankan server setelah koneksi database siap
init()
  .then(() => app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('Gagal terhubung ke MySQL:', e.message);
    console.error('Pastikan MySQL sudah menyala dan user/password di db.js sudah benar.');
    process.exit(1);
  });
