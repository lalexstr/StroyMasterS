<template>
    <header class="header">
      <div class="header-container container">
        <div class="logo">
          <span>СтройМастер</span>
        </div>
        
        <nav class="nav" :class="{ 'mobile-nav-open': isMobileNavOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileNav">Главная</router-link>
          <router-link to="/products" class="nav-link" @click="closeMobileNav">Продукты</router-link>
          <router-link to="/about" class="nav-link" @click="closeMobileNav">О компании</router-link>
          <router-link to="/how-we-work" class="nav-link" @click="closeMobileNav">Как мы работаем</router-link>
          <router-link to="/case" class="nav-link" @click="closeMobileNav">Наши кейсы</router-link>
          <a href="#contact" class="nav-link" @click="closeMobileNav">Контакты</a>
          <a href="tel:+7XXXXXXXXXX" class="nav-phone mobile-only">+7 (XXX) XXX-XX-XX</a>
        </nav>
        
        <a href="tel:+7XXXXXXXXXX" class="phone-link desktop-only">+7 (XXX) XXX-XX-XX</a>
        
        <button class="burger-menu" @click="toggleMobileNav">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'Header',
    setup() {
      const isMobileNavOpen = ref(false);
      
      const toggleMobileNav = () => {
        isMobileNavOpen.value = !isMobileNavOpen.value;
      };
      
      const closeMobileNav = () => {
        isMobileNavOpen.value = false;
      };
      
      return {
        isMobileNavOpen,
        toggleMobileNav,
        closeMobileNav
      };
    }
  }
  </script>
  
  <style scoped>
  @import '../assets/styles/components/header.css';
  </style>