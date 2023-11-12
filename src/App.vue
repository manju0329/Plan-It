<script setup>
import { RouterView } from "vue-router";
import Header from "@/components/layout/Header.vue";
</script>

<template>
  <div>
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
