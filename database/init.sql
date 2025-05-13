  -- Сначала создаем таблицы
  CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS manufacturers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    manufacturer_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
  );

  CREATE TABLE IF NOT EXISTS photos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    photo_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE TABLE categories;
  TRUNCATE TABLE manufacturers;
  SET FOREIGN_KEY_CHECKS = 1;
  -- Затем добавляем новые записи
 -- Вставка данных в таблицу categories
INSERT INTO categories (name, description) VALUES
('Экскаватор на гусеничном ходу', NULL),
('Экскаватор на колесном ходу', NULL),
('Самосвал', NULL),
('Фронтальный погрузчик', NULL),
('Автокран «Урал»', NULL),
('Автобетоносмесители', NULL),
('Грузовой тягач', NULL),
('Грузовой тягач с полуприцепом', NULL),
('Доставка и вывоз экскаватора', NULL),
('Грузовик бортовой с гидроманипулятором', NULL),
('Грузовой фургон «бабочка»', NULL),
('Илосос', NULL),
('Вкручивание винтовых свай', NULL),
('Автовышка на базе автокрана', NULL),
('Скальник, сланец', NULL),
('ПГС', NULL),
('Песок речной', NULL),
('Песок амурский', NULL),
('Щебень', NULL),
('Отсев', NULL),
('Глина', NULL);

-- Вставка данных в таблицу manufacturers
INSERT INTO manufacturers (name, description) VALUES
('СтройМастер', NULL);
