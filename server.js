import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Импорты роутов
import productRoutes from './routes/product.js';
import manufacturersRouter from './routes/manufacturers.js';
import categoriesRouter from './routes/categories.js';

// Инициализация Express
const app = express();

// Создаем папку uploads, если её нет
const uploadsDir = path.join(__dirname,) 
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Настройка Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB лимит
});

// Подключение роутов с передачей upload
app.use('/api/products', productRoutes(upload));
app.use('/api/categories', categoriesRouter);
app.use('/api/manufacturers', manufacturersRouter);

// Тестовый роут для загрузки файлов
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Подключение к MySQL (если используется)
import { pool } from './db.js';
pool.getConnection()
  .then(conn => {
    console.log('MySQL connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

  const path = require('path');

  app.use(express.static(path.join(__dirname, 'public/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dist/index.html'));
  });

// Запуск сервера
const PORT = process.env.PORT || 3000;

console.log('Проверьте доступность файлов:');
console.log(`- Пример файла: http://localhost:${PORT}/uploads/1745077503631-812454143.jpg`);
console.log('- Физический путь:', uploadsDir);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});