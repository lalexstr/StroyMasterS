import axios from 'axios';
import { Notify } from 'notiflix';

// Создаем экземпляр axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/',
  timeout: 10000,
});

// Добавляем перехватчик ошибок
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const message = error.response.data?.message || 'Ошибка сервера';
      Notify.failure(message);
    }
    return Promise.reject(error);
  }
);

// Экспортируем методы API
export default {
  // Получение продуктов
  getProducts() {
    return instance.get('/products')
      .then(response => response.data)
      .catch(error => {
        console.error('Get products error:', error);
        throw error;
      });
  },

  // Добавление продукта (с поддержкой FormData)
  addProduct(productData) {
    const formData = new FormData();
    
    // Добавляем все поля кроме photos
    Object.keys(productData).forEach(key => {
      if (key !== 'photos') {
        formData.append(key, productData[key]);
      }
    });
    
    // Добавляем фотографии
    if (productData.photos) {
      productData.photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }

    return instance.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Add product error:', error);
      throw error;
    });
  },

  // Удаление продукта
  deleteProduct(id) {
    return instance.delete(`/products/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Delete product error:', error);
        throw error;
      });
  }
};