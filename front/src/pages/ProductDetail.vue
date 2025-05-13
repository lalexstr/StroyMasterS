<template>
  <div v-if="loading" class="loading">
    <div class="loader"></div>
    <p>Загрузка товара...</p>
  </div>
  
  <div v-else-if="error" class="error">
    {{ error }}
    <button @click="loadProduct" class="retry-btn">Попробовать снова</button>
  </div>
  
  <div v-else-if="product" class="product-detail">
    <div class="product-content">
      <div class="gallery">
        <template v-if="product.photos && product.photos.length">
          <img 
            :src="optimizedImageUrl"
            :alt="product.name"
            @error="handleImageError"
            loading="lazy"
            class="gallery-image"
            width="400"
            height="400"
          />
        </template>
        <div v-else class="no-photos">
          <img 
            :src="noImage" 
            class="no-image-placeholder" 
            alt="No image"
            width="400"
            height="400"
            loading="lazy"
          >
        </div>
      </div>
      
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <p class="price">Запросить цену</p>
        <p class="category">Категория: {{ product.category_name }}</p>
        <p class="manufacturer">Производитель: {{ product.manufacturer_name }}</p>
        <p class="description">{{ product.description || 'Описание отсутствует' }}</p>
      </div>
    </div>
  </div>
  
  <div v-else class="not-found">
    Товар не найден
  </div>
</template>

<script>
import { fetchProductById } from '@/api/products';
import noImage from '@/assets/noImage.png';

export default {
  data() {
    return {
      product: null,
      loading: false,
      error: null,
      imageErrors: {},
      tonnage: null,
      totalPrice: 0
    }
  },
  computed: {
    optimizedImageUrl() {
      if (!this.product?.photos?.length) return noImage;
      
      const photoPath = this.product.photos[0].replace(/^\/+/, '');
      const baseUrl = import.meta.env.DEV ? 'http://localhost:3000' : '';
      
      // Добавляем параметры для оптимизации изображения (если ваш бэкенд поддерживает)
      return `${baseUrl}/${photoPath}?w=800&h=800&fit=cover&q=80`;
    }
  },
  async created() {
    await this.loadProduct();
  },
  methods: {
    async loadProduct() {
      this.loading = true;
      this.error = null;
      this.imageErrors = {};
      
      try {
        const productId = this.$route.params.id;
        if (!productId) throw new Error('ID товара не указан');
        
        const response = await fetchProductById(productId);
        
        // Нормализация данных
        this.product = {
          ...response,
          photos: response.photos 
            ? Array.isArray(response.photos) 
              ? response.photos 
              : [response.photos]
            : []
        };
        
      } catch (err) {
        console.error('Ошибка загрузки товара:', err);
        this.error = this.getErrorMessage(err);
      } finally {
        this.loading = false;
      }
    },
    
    formatPrice(price) {
      const priceNumber = parseFloat(price);
      return isNaN(priceNumber) 
        ? 'Цена не указана' 
        : new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(priceNumber);
    },
    
    handleImageError(e) {
      e.target.src = noImage;
      e.target.classList.add('error-image');
    },
    
    getErrorMessage(err) {
      if (err.message.includes('404')) return 'Товар не найден';
      if (err.message.includes('Network Error')) return 'Ошибка соединения с сервером';
      return 'Не удалось загрузить информацию о товаре';
    },
    
    calculate() {
      if (this.tonnage === null || this.tonnage === '' || isNaN(this.product.price)) {
        this.totalPrice = 0;
        return;
      }
      
      const tons = parseFloat(this.tonnage);
      const pricePerTon = parseFloat(this.product.price);
      
      this.totalPrice = !isNaN(tons) && !isNaN(pricePerTon) 
        ? tons * pricePerTon 
        : 0;
    }
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.product-content {
  display: flex;
  gap: 2rem;
}

.gallery {
  width: 40%;
  min-width: 400px;
}

.gallery-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  aspect-ratio: 1/1;
  background: #f5f5f5;
}

.gallery-image.error-image {
  object-fit: contain;
  padding: 20px;
}

.no-photos {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
}

.no-image-placeholder {
  max-width: 100%;
  max-height: 100%;
  opacity: 0.6;
  object-fit: contain;
}

.product-info {
  width: 30%;
  padding: 0 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 1rem 0;
}

.category,
.manufacturer {
  margin: 0.5rem 0;
  color: #555;
}

.description {
  margin-top: 1rem;
  line-height: 1.5;
}

/* Оптимизированные стили калькулятора */
.calculator {
  width: 30%;
  min-width: 300px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
  position: sticky;
  top: 20px;
  align-self: flex-start;
}

.calculator-title {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  word-break: break-word;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin: 1rem 0;
}

.input-group {
  margin-bottom: 1rem;
}

.tonnage-input {
  width: 90%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;

}

.tonnage-input::-webkit-outer-spin-button,
.tonnage-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-hint {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: 0.5rem;
}

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  color: #2c3e50;
  word-break: break-word;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.error {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #2980b9;
}

.not-found {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #7f8c8d;
}

@media (max-width: 992px) {
  .product-content {
    flex-direction: column;
  }
  
  .gallery,
  .product-info,
  .calculator {
    width: calc(100% - 10px); /* Добавляем отступ слева */
    min-width: auto;
    margin-left: 10px; /* Сдвигаем на 10px влево */
  }
  
  .calculator {
    position: static;
    margin-top: 2rem;
  }
}

/* Добавим дополнительный медиазапрос для очень маленьких экранов */
@media (max-width: 576px) {
  .product-detail {
    padding: 1rem;
  }
  
  .gallery,
  .product-info,
  .calculator {
    width: calc(90% - 10px);
    margin-left: 10px;
  }
  
  .calculator {
    padding: 1.25rem; /* Немного уменьшим padding */
  }
}
</style>