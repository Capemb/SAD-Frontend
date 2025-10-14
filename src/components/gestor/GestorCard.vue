<template>
  <div class="card" :style="{ '--color': color }">
    <i :class="icon"></i>
    <h3>{{ title }}</h3>
    <p>{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  subtitle: String,
  color: String
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
  padding: 1.8rem 1.2rem;
  transition: all 0.3s ease;
  border-top: 4px solid var(--color);
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
}
.card i {
  font-size: 2rem;
  color: var(--color);
  margin-bottom: 0.5rem;
}
.card h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.4rem;
}
.card p {
  color: #555;
  font-size: 0.95rem;
}
</style>
