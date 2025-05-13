<template>
    <div>
      <Hero />
      <Services />
      <About />
      <Workflow />
      <Cta />
    </div>
  </template>
  
  <script>
  import Hero from '@/components/Hero.vue'
  import Services from '@/components/Services.vue'
  import About from '@/components/About.vue'
  import Workflow from '@/components/Workflow.vue'
  import Cta from '@/components/Cta.vue'
  
  export default {
    name: 'HomePage',
    components: {
      Hero,
      Services,
      About,
      Workflow,
      Cta
    }
  }
  </script>