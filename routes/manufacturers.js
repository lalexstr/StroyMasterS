import express from 'express';
import { pool } from '../db.js'; // Убедитесь, что вы добавили .js

const router = express.Router();

/**
 * Получение всех производителей
 */
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // 1. Проверяем наличие дубликатов
    const [duplicates] = await connection.query(`
      SELECT name, COUNT(*) as count 
      FROM manufacturers 
      GROUP BY name 
      HAVING count > 1
    `);
    
    if (duplicates.length > 0) {
      console.warn('Обнаружены дубликаты производителей:', duplicates);
      
      // Автоматически чистим дубликаты
      await connection.query(`
        CREATE TEMPORARY TABLE temp_manufacturers AS
        SELECT MIN(id) as id, name, description
        FROM manufacturers
        GROUP BY name;
        
        DELETE FROM manufacturers;
        
        INSERT INTO manufacturers (id, name, description)
        SELECT id, name, description FROM temp_manufacturers;
        
        DROP TEMPORARY TABLE temp_manufacturers;
      `);
    }

    // 2. Получаем всех производителей
    const [manufacturers] = await connection.query(`
      SELECT 
        id,
        name,
        description,
        (SELECT COUNT(*) FROM products WHERE manufacturer_id = manufacturers.id) as product_count
      FROM manufacturers
      ORDER BY id ASC
    `);

    res.json(manufacturers);
  } catch (error) {
    console.error('Ошибка при получении производителей:', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    if (connection) await connection.release();
  }
});

// Экспортируем маршрутизатор
export default router;
