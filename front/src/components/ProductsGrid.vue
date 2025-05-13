<template>
  <div v-if="loading" class="loading">Загрузка товаров...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else-if="!products.length" class="empty">Товары не найдены</div>
  
  <div v-else class="products-grid">
    <div 
      v-for="(product, index) in products" 
      :key="product.id" 
      class="product-card"
      @click="$router.push(`/products/${product.id}`)"
      :style="{'--index': index}"
    >
      <div class="image-container">
        <img 
          :src="getImageUrl(product)"
          @error="(e) => handleImageError(e, product.id)"
          loading="lazy"
        />
      </div>
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <div class="meta">
          <span class="category">{{ product.category_name }}</span>
          <span class="manufacturer">{{ product.manufacturer_name }}</span>
        </div>
        <p class="price">Запросить цену</p>
        <button class="details-btn">Подробнее</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  products: Array,
  loading: Boolean,
  error: String
});

const failedImages = ref({});

const formatPrice = (price) => {
  const num = parseFloat(price);
  return isNaN(num) ? 'Цена не указана' : num.toLocaleString('ru-RU', {
    style: 'currency',
    currency: 'RUB'
  });
};

const getImageUrl = (product) => {

  // Если уже была ошибка - заглушка
  if (failedImages.value[product.id]) return '/placeholder-product.jpg';

  // Если нет фото - заглушка
  if (!product.photos?.length) return '/placeholder-product.jpg';

  // Получаем путь к фото
  let photoPath = product.photos[0];

  // Удаляем лишние слеши
  photoPath = photoPath.replace(/^\/+/, '');

  // Формируем полный URL (в development режиме добавляем хост)
  const baseUrl = import.meta.env.DEV ? 'http://localhost:3000' : '';
    return `${baseUrl}/${photoPath}`;
};

const handleImageError = (e, productId) => {
  failedImages.value[productId] = true;
  e.target.src = '/placeholder-product.jpg';
  e.target.classList.add('placeholder-image');
};
</script>

<style scoped>
/* Ваши существующие стили */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 20px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-delay: calc(var(--index) * 0.1s);
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image {
  position: absolute;
  width: 100%;
  height: 200px;
  object-fit: contain;
  object-position: center;
  transition: opacity 0.3s;
}

.placeholder-image {
  object-fit: contain !important;
  padding: 20px;
  background: #f0f0f0;
}

.product-info {
  padding: 16px;
}

.meta {
  display: flex;
  gap: 10px;
  margin: 8px 0;
  font-size: 0.9em;
  color: #666;
}

.price {
  font-weight: bold;
  color: #2a5c8b;
  font-size: 1.2em;
  margin: 12px 0;
}

.details-btn {
  width: 100%;
  padding: 10px;
  background: #2a5c8b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.details-btn:hover {
  background: #1e4a7a;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #d32f2f;
}
</style>