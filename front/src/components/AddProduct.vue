<template>
  <div class="add-product-form">
    <h3>Добавить новый продукт</h3>
    <form @submit.prevent="handleSubmit">
      <!-- Поля формы остаются без изменений -->
      <div class="form-group">
        <label>Название:</label>
        <input v-model="product.name" type="text" required :disabled="loading">
      </div>
      
      <div class="form-group">
        <label>Описание:</label>
        <textarea v-model="product.description" :disabled="loading"></textarea>
      </div>
      
      <div class="form-group">
        <label>Цена:</label>
        <input v-model="product.price" type="number" step="0.01" required :disabled="loading">
      </div>
      
      <div class="form-group">
        <label>Категория:</label>
        <select v-model="product.category_id" required :disabled="loading">
          <option value="1">Экскаватор на гусеничном ходу</option>
          <option value="2">Экскаватор на колесном ходу</option>
          <option value="3">Самосвал</option>
          <option value="4">Фронтальный погрузчик</option>
          <option value="5">Автокран «Урал»</option>
          <option value="6">Автобетоносмесители</option>
          <option value="7">Грузовой тягач</option>
          <option value="8">Грузовой тягач с полуприцепом</option>
          <option value="9">Доставка и вывоз экскаватора</option>
          <option value="10">Грузовик бортовой с гидроманипулятором</option>
          <option value="11">Грузовой фургон «бабочка»</option>
          <option value="12">Илосос</option>
          <option value="13">Вкручивание винтовых свай</option>
          <option value="14"> Автовышка на базе автокрана</option>
          <option value="15">Скальник, сланец</option>
          <option value="16">ПГС</option>
          <option value="17">Песок речной</option>
          <option value="18">Песок амурский</option>
          <option value="19">Щебень</option>
          <option value="20">Отсев</option>
          <option value="21">Глина</option>
          <!-- дальше по той же тактике, не забудь в sqlke добавить -->
        </select>
      </div>
      
      <div class="form-group">
        <label>Производитель:</label>
        <select v-model="product.manufacturer_id" required :disabled="loading">
          <option value="1">СтройМастер</option>
          <!-- дальше по той же тактике, не забудь в sqlke добавить -->
        </select>
      </div>
      
      <div class="form-group">
        <label>Фотографии:</label>
        <input 
          type="file" 
          multiple 
          @change="handleFileUpload" 
          accept="image/*"
          required
          :disabled="loading"
        >
        <div v-if="product.photos.length > 0" class="file-list">
          Выбрано файлов: {{ product.photos.length }}
        </div>
      </div>
      
      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="!loading">Добавить продукт</span>
        <span v-else>Отправка...</span>
      </button>
    </form>
  </div>
</template>

<script>
import { Notify, Loading } from 'notiflix';
import axios from 'axios';

export default {
  data() {
    return {
      product: {
        name: '',
        description: '',
        price: 0,
        category_id: 1,
        manufacturer_id: 1,
        photos: []
      },
      loading: false
    };
  },
  methods: {
    handleFileUpload(e) {
      this.product.photos = Array.from(e.target.files);
    },
    async handleSubmit() {
      if (this.loading) return;
      
      this.loading = true;
      try {
        Loading.circle('Добавление продукта...');
        
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('description', this.product.description);
        formData.append('price', this.product.price.toString());
        formData.append('category_id', this.product.category_id.toString());
        formData.append('manufacturer_id', this.product.manufacturer_id.toString());
        
        this.product.photos.forEach(file => {
          formData.append('photos', file);
        });

        // 1. Убедитесь, что URL правильный (должен быть /api/products, а не /api/)
        const response = await axios.post('http://localhost:3000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        Notify.success('Продукт успешно добавлен');
        this.$emit('product-added');
        this.resetForm();
      } catch (error) {
        console.error('Add product error:', error);
        let errorMessage = 'Не удалось добавить продукт';
        
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = 'URL API не найден. Проверьте адрес сервера.';
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          }
        }
        
        Notify.failure(errorMessage);
      } finally {
        this.loading = false;
        Loading.remove();
      }
    },
    resetForm() {
      this.product = {
        name: '',
        description: '',
        price: 0,
        category_id: 1,
        manufacturer_id: 1,
        photos: []
      };
      this.$nextTick(() => {
        const fileInput = this.$el.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      });
    }
  }
};
</script>

<style scoped>
.add-product-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border 0.3s;
}

input:disabled, 
textarea:disabled, 
select:disabled {
  background: #f0f0f0;
  cursor: not-allowed;
}

textarea {
  min-height: 100px;
}

.file-list {
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
}

.submit-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  background: #3aa876;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>