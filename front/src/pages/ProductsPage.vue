<template>
  <div class="products-page">
    <h1>Наши товары</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ProductsGrid v-else :products="products" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductsGrid from '@/components/ProductsGrid.vue'
import { fetchProducts } from '@/api/products.js'

const products = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  console.log('Начало загрузки продуктов')
  try {
    console.log('Перед вызовом fetchProducts')
    const data = await fetchProducts()
    console.log('Данные получены:', data)
    
    if (!Array.isArray(data)) {
      throw new Error('API вернул не массив данных')
    }
    
    products.value = data
  } catch (err) {
    error.value = 'Не удалось загрузить товары'
    console.error('Ошибка загрузки:', err)
  } finally {
    loading.value = false
    console.log('Загрузка завершена', { 
      loading: loading.value,
      error: error.value,
      products: products.value.length
    })
  }
})
</script>

<style scoped>
.error {
  color: red;
  padding: 1rem;
  background: #ffeeee;
  border-radius: 4px;
}
</style>