import express from 'express';
import { pool } from '../db.js'; // Убедитесь, что вы добавили .js

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить все категории
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT 
        id,
        name,
        description,
        (SELECT COUNT(*) FROM products WHERE category_id = categories.id) as products_count
      FROM categories
      ORDER BY name ASC
    `);
    
    res.json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Экспортируем маршрутизатор
export default router;
