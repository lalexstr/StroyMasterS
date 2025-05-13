<template>
  <div class="cases-page">
    <main class="main-content">
      <!-- Шапка страницы -->
      <section class="page-header">
        <div class="container">
          <div class="header-content">
            <h1 class="title">Наши кейсы</h1>
            <p class="subtitle">
              Успешно реализованные проекты по грузоперевозкам и поставкам строительных материалов
            </p>
          </div>
        </div>
      </section>

      <!-- Табы с кейсами -->
      <section class="cases-tabs">
        <div class="container">
          <div class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              :class="['tab-button', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="tab-content">
            <div
              v-for="card in filteredCards"
              :key="card.id"
              class="case-card"
            >
              <img :src="card.image" alt="Кейс" class="card-image" />
              <div class="card-content">
                <h3 class="card-title">{{ card.title }}</h3>
                <p class="card-description">{{ card.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'


import id1 from '@/assets/image1.png';
import id2 from '@/assets/image2.png';
import id3 from '@/assets/image3.png';
import id4 from '@/assets/image4.png';
import id5 from '@/assets/image5.png';

const activeTab = ref('delivery')

const tabs = [
  { key: 'delivery', label: 'Грузоперевозки' },
  { key: 'construction', label: 'Стройматериалы' },
]

const cards = [
  {
    id: 1,
    type: 'delivery',
    title: 'Перевозка техники в Хабаровск',
    description: 'Осуществили доставку техники в г.Хабаровск',
    image: id1,
  },
  {
    id: 2,
    type: 'construction',
    title: 'Поставка лотков водоотводных',
    description: 'Комплексная поставка водоотводных лотков на крупный объект.',
    image: id2,
  },
  {
    id: 3,
    type: 'delivery',
    title: 'Транспортировка торгового павильона',
    description: 'Выполнена транспортировка торгового павильона в г.Хабаровск',
    image: id3,
  },
  {
    id: 3,
    type: 'delivery',
    title: 'Транспортировка асфальтоукладочного оборудования',
    description: 'Выполнена транспортировка асфальтоукладочного оборудования в другой регион',
    image: id4,
  },
  {
    id: 3,
    type: 'delivery',
    title: 'Перевозка сена',
    description: 'Осуществлена транспортировка сена от места сбора до пункта хранения',
    image: id5,
  },
]

const filteredCards = computed(() =>
  cards.filter((card) => card.type === activeTab.value)
)
</script>

<style scoped>
.cases-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.page-header {
  background-color: #1e3a8a;
  padding: 64px 0;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}

.header-content {
  max-width: 720px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  color: white;
  margin-bottom: 16px;
  font-family: 'Roboto', sans-serif;
}

.subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Open Sans', sans-serif;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 12px;
  margin: 40px 0 20px;
}

.tab-button {
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px 16px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.tab-button:hover {
  background-color: #f0f0f0;
}

.tab-button.active {
  background-color: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

/* Cards */
.tab-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 40px;
}

.case-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.case-card:hover {
  transform: translateY(-4px);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-description {
  font-size: 14px;
  color: #555;
}
</style>