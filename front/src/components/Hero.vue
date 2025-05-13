<template>
  <section class="hero">
    <div class="hero-image">
      <div class="hero-overlay"></div>
      <img src="/src/assets/hero.png" alt="Грузовик на фоне стройки">
    </div>
    <!-- если кто-то когда-то будет смотреть код страницы, пж не говорите никому что такие сайты существуют :) и единственный совет, не используйте еб#ный sql лучше могодб юзайте:) -->
    <div class="hero-content container">
      <h1 class="hero-title">
        Надежные грузоперевозки и поставки инертных материалов
      </h1>
      <p class="hero-subtitle">
        Профессиональные услуги по перевозке грузов и поставке строительных материалов для вашего бизнеса
      </p>
    </div>
  </section>
  <p>&nbsp;</p>
</template>

<script>
export default {
  name: 'Hero'
}
</script>

<style scoped>
@import '../assets/styles/components/hero.css';
</style>