<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Каталог материалов</h1>
      <ProductsGrid :products="products" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import ProductsGrid from '@/components/ProductsGrid.vue';
  import productsAPI from '@/api/products';
  
  const products = ref([]);
  
  onMounted(async () => {
    products.value = await productsAPI.getAll();
  });
  </script>