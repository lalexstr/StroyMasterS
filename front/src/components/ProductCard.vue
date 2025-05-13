<template>
  <div 
    @click="navigateToProduct"
    class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
  >
    <div class="relative h-48 overflow-hidden bg-gray-100">
      <!-- Основное изображение -->
      <img 
        v-if="mainPhoto"
        :src="mainPhoto" 
        :alt="product.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
        loading="eager"
      >
      <!-- Заглушка, если нет фото -->
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        <span>Нет изображения</span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-gray-800 font-bold text-lg mb-2">{{ product.name }}</h3>
      <div class="flex justify-between items-center">
        <span class="text-blue-600 font-bold">Запросить цену</span>
        <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
          {{ product.category_name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (product) => {
      return product.id && product.name;
    }
  }
});

const router = useRouter();
const imageError = ref(false);

// Получаем главное фото
const mainPhoto = computed(() => {
  if (!props.product.photos || props.product.photos.length === 0) {
    return null;
  }
  
  // Берем первое фото из массива
  let photo = props.product.photos[0];
  
  // Если путь уже абсолютный (начинается с /uploads)
  if (photo.startsWith('/uploads')) {
    return photo;
  }
  
  // Добавляем /uploads если его нет
  return photo.startsWith('uploads/') ? `/${photo}` : `/uploads/${photo}`;
});

// Форматирование цены
const formattedPrice = computed(() => {
  const price = parseFloat(props.product.price);
  return isNaN(price) ? 'Цена не указана' : `${price.toFixed(2)} ₽`;
});

// Обработчик ошибок загрузки изображения
const handleImageError = () => {
  imageError.value = true;
};

const navigateToProduct = () => {
  router.push(`/products/${props.product.id}`);
};
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>