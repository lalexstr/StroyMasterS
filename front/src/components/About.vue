<template>
  <section id="about" class="about section">
    <div class="container">
      <h2 class="section-title">О компании</h2>
      <div class="about-content">
        <div class="about-image">
          <img src="/src/assets/about.png" alt="О компании">
        </div>
        <div class="about-text">
          <h3 class="about-subtitle">10 лет на рынке. 500+ довольных клиентов. Собственный автопарк.</h3>
          <p class="about-description">
            Мы специализируемся на организации грузоперевозок и поставках строительных материалов по всему Дальнему Востоку.
            Наша компания гарантирует качество услуг, соблюдение сроков и индивидуальный подход к каждому клиенту.
          </p>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">20+</div>
              <div class="stat-label">Лет опыта</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">Клиентов</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100+</div>
              <div class="stat-label">Единиц техники</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
@import '../assets/styles/components/about.css';
</style>