<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar/>
  <main>
    <router-view/>
  </main>
</template>

<style scoped>

</style>
