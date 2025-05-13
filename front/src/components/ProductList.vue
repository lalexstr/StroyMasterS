<template>
  <div class="product-list">
    <div v-for="product in products" :key="product.id" class="product-item">
      <div class="product-info">
        <h4>{{ product.name }}</h4>
        <p>{{ product.description }}</p>
        <p><strong>Цена:</strong> {{ product.price }} руб.</p>
        <p><strong>ID:</strong> {{ product.id }}</p>
      </div>
      
      <div class="product-actions">
        <button 
          @click="confirmDelete(product.id)" 
          class="delete-btn"
          :disabled="deletingId === product.id"
        >
          <span v-if="deletingId !== product.id">Удалить</span>
          <span v-else>Удаление...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify, Confirm } from 'notiflix';

export default {
  props: {
    products: {
      type: Array,
      required: true,
      validator: value => Array.isArray(value)
    }
  },
  data() {
    return {
      deletingId: null
    };
  },
  methods: {
    confirmDelete(id) {
      Confirm.show(
        'Удаление продукта',
        'Вы уверены, что хотите удалить этот продукт?',
        'Да',
        'Нет',
        () => this.emitDelete(id),
        () => Notify.info('Удаление отменено')
      );
    },
    emitDelete(id) {
      this.deletingId = id;
      this.$emit('product-deleted', id);
      this.deletingId = null;
    }
  }
};
</script>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-item {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.product-info {
  flex: 1;
}

.product-actions {
  margin-top: 15px;
  text-align: right;
}

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-btn:hover:not(:disabled) {
  background: #d32f2f;
}

.delete-btn:disabled {
  background: #ff9e9e;
  cursor: not-allowed;
}
</style>