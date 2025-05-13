<template>
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
    <div class="login-page">
      <h1>Вход для администратора</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Логин:</label>
          <input v-model="username" type="text" required>
        </div>
        <div class="form-group">
          <label>Пароль:</label>
          <input v-model="password" type="password" required>
        </div>
        <button type="submit" class="login-btn">Войти</button>
      </form>
    </div>
  </template>
  
  <script>
 export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    handleLogin() {
      this.error = ''

      // Жёсткая проверка (только admin:admin)
      if (this.username === 'admin' && this.password === 'admin') {
        localStorage.setItem('token', 'fake-jwt-token')
        localStorage.setItem('isAdmin', 'true')

        // Редирект на /admin или сохранённый URL
        const redirect = this.$route.query.redirect || '/admin'
        this.$router.push(redirect)
      } else {
        this.error = 'Доступ только для администратора (логин: admin, пароль: admin)'
      }
    }
  }
}
  </script>
  
  <style scoped>
  .login-page {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .login-btn {
    background: #42b983;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  </style>