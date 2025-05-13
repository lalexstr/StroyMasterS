<template>
    <div class="admin-container">
      <header class="admin-header">
        <h1>Админ панель</h1>
        <router-link to="/" class="back-link">← На главную</router-link>
        <button @click="handleLogout" class="logout-btn">Выйти</button>
      </header>
  
      <div class="admin-content">
        <section class="product-management">
          <h2>Управление продуктами</h2>
          
          <AddProduct @product-added="loadProducts" />
          
          <div class="product-list-container">
            <h3>Список продуктов</h3>
            <div v-if="loading" class="loading">Загрузка...</div>
            <div v-else-if="products.length === 0" class="no-products">
              Нет доступных продуктов
            </div>
            <ProductList 
              v-else 
              :products="products" 
              @product-deleted="handleProductDeleted" 
            />
          </div>
        </section>
  
        <footer class="company-info">
          <h3>ТрансЛогистика</h3>
          <div class="contacts">
            <p><strong>Контакты</strong></p>
            <p>+7 (XXX) XXX-XX-XX</p>
            <p>info@translogistika.ru</p>
            <p>г. Москва, ул. Примерная, 123</p>
          </div>
          <p class="copyright">© 2024 ТрансЛогистика. Все права защищены.</p>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
import { mapActions, mapState } from 'vuex';
import AddProduct from '@/components/AddProduct.vue';
import ProductList from '@/components/ProductList.vue';
import { Notify, Loading } from 'notiflix';

export default {
  name: 'AdminPage',
  components: {
    AddProduct,
    ProductList
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(['products'])
  },
  async created() {
    // Проверка авторизации
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token || !isAdmin) {
      this.$router.replace('/login');
      return; // Важно выйти, чтобы не продолжать выполнение
    }

    // Загрузка продуктов
    await this.loadProducts();
  },
  methods: {
    ...mapActions(['fetchProducts', 'deleteProduct', 'logout']),
    
    async loadProducts() {
      this.loading = true;
      try {
        await this.fetchProducts();
      } catch (error) {
        Notify.failure('Ошибка загрузки продуктов');
        console.error('Ошибка загрузки продуктов:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async handleProductDeleted(productId) {
      try {
        Loading.circle('Удаление...');
        await this.deleteProduct(productId);
        Notify.success('Продукт успешно удален');
        await this.loadProducts();
      } catch (error) {
        Notify.failure('Не удалось удалить продукт');
        console.error('Ошибка удаления продукта:', error);
      } finally {
        Loading.remove();
      }
    },
    
    async handleLogout() {
      try {
        Loading.circle('Выход...');
        await this.logout();
        // Очищаем данные авторизации
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        Notify.success('Вы успешно вышли');
        this.$router.push('/login');
      } catch (error) {
        Notify.failure('Ошибка при выходе');
        console.error('Ошибка выхода:', error);
      } finally {
        Loading.remove();
      }
    }
  }
};
</script>
  
  <style scoped>
  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .back-link {
    color: #42b983;
    text-decoration: none;
    font-size: 16px;
  }
  
  .logout-btn {
    background: #f44336;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .logout-btn:hover {
    background: #d32f2f;
  }
  
  .admin-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .product-management {
    flex: 1;
    margin-bottom: 30px;
  }
  
  .product-list-container {
    margin-top: 30px;
  }
  
  .loading, .no-products {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  
  .company-info {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    text-align: center;
    color: #666;
    font-size: 14px;
  }
  
  .contacts {
    margin: 15px 0;
  }
  
  .copyright {
    margin-top: 20px;
    font-size: 12px;
  }
  </style>