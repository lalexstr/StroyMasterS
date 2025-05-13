<template>
    <div class="login">
      <h1>Вход для администратора</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label>Логин:</label>
          <input v-model="username" type="text" required>
        </div>
        <div>
          <label>Пароль:</label>
          <input v-model="password" type="password" required>
        </div>
        <button type="submit">Войти</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      ...mapActions(['login']),
      async handleLogin() {
        this.error = '';
        const success = await this.login({
          username: this.username,
          password: this.password
        });
        
        if (success) {
          this.$router.push('/admin');
        } else {
          this.error = 'Неверные учетные данные';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  form div {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background: #45a049;
  }
  
  .error {
    color: #f44336;
    margin-top: 10px;
  }
  </style>