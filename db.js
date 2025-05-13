import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export const pool = mysql.createPool({
  host: '127.0.0.1', // или 'localhost' - оба варианта работают для локального подключения
  user: 'root',      // имя пользователя из изображения
  password: 'admin', // ваш пароль из кода (в изображении пароль не указан)
  database: 'shop',  // название вашей БД (в изображении default schema не указан)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

export async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    
    const sqlScript = fs.readFileSync(
      path.join(process.cwd(), './database/init.sql'), 
      'utf8'
    );

    const queries = sqlScript.split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    for (const query of queries) {
      try {
        await connection.query(`${query};`);
      } catch (error) {
        console.warn(`Предупреждение при выполнении запроса: ${error.message}`);
      }
    }
    
    console.log('База данных инициализирована успешно');
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}


export const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173/admin', 
  credentials: true
}));

export async function startServer() {
  try {
    await initializeDatabase();


    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
    process.exit(1);
  }
}

if (import.meta.url === new URL(import.meta.url).href) {
  startServer();
}
