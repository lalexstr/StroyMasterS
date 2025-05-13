<template>
  <section id="services" class="services section">
    <div class="container">
      <h2 class="section-title">Услуги</h2>
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 17h4V5H2v12h3"></path>
              <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"></path>
              <circle cx="7.5" cy="17.5" r="2.5"></circle>
              <circle cx="17.5" cy="17.5" r="2.5"></circle>
            </svg>
          </div>
          <h3 class="service-title">Перевозка крупногабаритных грузов</h3>
          <p class="service-description">
            Безопасная и своевременная доставка негабаритных грузов по всему Хабаровскому краю
          </p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 class="service-title">Поставка инертных материалов</h3>
          <p class="service-description">
            Обеспечим ваш объект песком, щебнем, грунтом и другими материалами
          </p>
        </div>

        <div class="service-card">
          <div class="service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M2 10h20"></path>
              <path d="M10 4v16"></path>
            </svg>
          </div>
          <h3 class="service-title">Аренда спецтехники с оператором</h3>
          <p class="service-description">
            Предоставляем в аренду широкий парк строительной и грузоподъёмной техники с квалифицированными операторами
          </p>
        </div>
      </div>
      
      <!-- Добавленная кнопка для перехода к продуктам -->
      <div class="text-center mt-12">
        <router-link 
          to="/products" 
          class="inline-block px-6 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-hover)] transition-colors"
        >
          Смотреть все продукты и услуги
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Services'
}
</script>

<style scoped>
/* Ваши существующие стили остаются без изменений */
@import '../assets/styles/components/services.css';

/* Добавленные стили для кнопки */
.text-center {
  text-align: center;
}

.mt-12 {
  margin-top: 3rem;
}

.inline-block {
  display: inline-block;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.text-white {
  color: white;
}

.rounded-md {
  border-radius: 0.375rem;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>