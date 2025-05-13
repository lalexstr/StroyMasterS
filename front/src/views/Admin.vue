<template>
    <div class="admin">
      <h1>Админ панель</h1>
      <button @click="logout">Выйти</button>
      
      <AddProduct @product-added="fetchProducts" />
      
      <ProductList 
        :products="products" 
        @product-deleted="deleteProduct" 
      />
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  import AddProduct from '@/components/AddProduct.vue';
  import ProductList from '@/components/ProductList.vue';
  
  export default {
    components: {
      AddProduct,
      ProductList
    },
    computed: {
      ...mapState(['products'])
    },
    created() {
      this.fetchProducts();
    },
    methods: {
      ...mapActions(['fetchProducts', 'deleteProduct', 'logout'])
    }
  };
  </script>
  
  <style scoped>
  .admin {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  button {
    background: #f44336;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  button:hover {
    background: #d32f2f;
  }
  </style>