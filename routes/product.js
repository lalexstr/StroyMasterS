import express from 'express';
import { pool } from '../db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


export default (upload) => {
 
// Вставка нового товара
router.post('/', upload.array('photos'), async (req, res) => {
  let connection;
  try {
    const { name, description, price, category_id, manufacturer_id } = req.body;
    
    // Проверка обязательных полей
    if (!name || !price || !category_id || !manufacturer_id) {
      return res.status(400).json({ error: "Не заполнены обязательные поля" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Создаем товар
      const [productResult] = await connection.query(
        'INSERT INTO products (name, description, price, category_id, manufacturer_id) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, category_id, manufacturer_id]
      );
      
      const productId = productResult.insertId;

      // 2. Сохраняем фотографии
      if (req.files && req.files.length > 0) {
        const photoValues = req.files.map(file => [
          productId,
          `/uploads/${file.filename}`
        ]);

        await connection.query(
          'INSERT INTO photos (product_id, photo_path) VALUES ?',
          [photoValues]
        );
      }

      await connection.commit();

      // 3. Получаем созданный товар с фотографиями
      const [newProduct] = await connection.query(`
        SELECT p.*, 
          GROUP_CONCAT(ph.photo_path) as photos,
          c.name as category_name,
          m.name as manufacturer_name
        FROM products p
        LEFT JOIN photos ph ON p.id = ph.product_id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
        WHERE p.id = ?
        GROUP BY p.id
      `, [productId]);

      // Преобразуем photos из строки в массив
      const product = {
        ...newProduct[0],
        photos: newProduct[0].photos ? newProduct[0].photos.split(',') : []
      };

      res.status(201).json(product);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Ошибка при создании товара:', error);
    res.status(500).json({ 
      error: "Ошибка сервера",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
});

// Удаление товара
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Сначала удаляем все фотографии товара
      await connection.query('DELETE FROM photos WHERE product_id = ?', [productId]);

      // 2. Затем удаляем сам товар
      const [result] = await connection.query('DELETE FROM products WHERE id = ?', [productId]);

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Товар не найден' });
      }

      await connection.commit();
      res.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    res.status(500).json({ 
      error: 'Не удалось удалить товар',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Получение категорий
router.get('/categories', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM categories');
    res.json(results);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Получение производителей
router.get('/manufacturers', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM manufacturers');
    res.json(results);
  } catch (error) {
    console.error('Ошибка при получении производителей:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Получение всех товаров с фотографиями
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Получаем товары (без created_at)
    const [products] = await connection.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        p.manufacturer_id,
        c.name as category_name,
        m.name as manufacturer_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      ORDER BY p.id DESC
    `);

    // 2. Получаем все фотографии одним запросом
    const [photos] = await connection.query(`
      SELECT product_id, photo_path 
      FROM photos
      WHERE photo_path IS NOT NULL
    `);

    // 3. Группируем фотографии
    const photosMap = photos.reduce((map, photo) => {
      map[photo.product_id] = map[photo.product_id] || [];
      map[photo.product_id].push(photo.photo_path);
      return map;
    }, {});

    // 4. Формируем ответ
    const result = products.map(product => ({
      ...product,
      photos: photosMap[product.id] || []
    }));

    res.json(result);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
});

// Получение товара по ID
router.get('/:id', async (req, res) => {
  const productId = req.params.id;

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Неверный ID товара' });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Получаем основную информацию о товаре
    const [products] = await connection.query(`
      SELECT 
        p.*,
        c.name as category_name,
        m.name as manufacturer_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
      WHERE p.id = ?
      LIMIT 1
    `, [productId]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // 2. Отдельным запросом получаем фотографии
    const [photos] = await connection.query(
      `SELECT photo_path FROM photos WHERE product_id = ? AND photo_path IS NOT NULL`,
      [productId]
    );

    // 3. Формируем результат
    const product = {
      ...products[0],
      photos: photos.map(p => p.photo_path)
    };

    res.json(product);
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) connection.release();
  }
});

  return router;
};