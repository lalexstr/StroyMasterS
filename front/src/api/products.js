export const fetchProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products')
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const data = await response.json()
  console.log('API Response:', data) // Для отладки
  return data
}

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    
    // Проверяем статус ответа перед анализом Content-Type
    if (response.status === 404) {
      throw new Error('Товар не найден');
    }
    
    if (response.status === 500) {
      throw new Error('Ошибка сервера');
    }

    // Проверяем Content-Type только для успешных ответов
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error(`Неверный формат ответа: ${contentType}`);
      }
      return await response.json();
    }

    // Для всех других ошибок
    throw new Error(`HTTP error! status: ${response.status}`);
    
  } catch (error) {
    console.error('Ошибка в fetchProductById:', error);
    throw new Error(error.message || 'Не удалось загрузить данные товара');
  }
};