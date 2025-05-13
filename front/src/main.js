import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Убедитесь, что этот импорт существует
import './assets/styles/main.css'
import { Notify, Loading, Confirm } from 'notiflix';

Notify.init({
  position: 'right-top',
  timeout: 3000
});

Loading.init({
  svgColor: '#42b983'
});

const app = createApp(App)

app.use(store) // Подключение хранилища
app.use(router)

app.mount('#app')