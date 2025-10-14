<template>
  <aside :class="['sidebar', { collapsed }]">
    <div class="sidebar-header">
      <h1 class="brand">SAD</h1>
      <button class="toggle" @click="toggleSidebar">
        <i class="fa-solid" :class="collapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>
    <nav class="menu">
      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="menu-item"
      >
        <i :class="['fa-solid', item.icon]"></i>
        <span v-if="!collapsed">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const collapsed = ref(false)
const toggleSidebar = () => (collapsed.value = !collapsed.value)

const menuItems = [
  { to: '/', label: 'Dashboard', icon: 'fa-chart-line' },
  { to: '/avaliacoes', label: 'Avaliações', icon: 'fa-clipboard-list' },
  { to: '/usuarios', label: 'Usuários', icon: 'fa-users' },
  { to: '/perfil', label: 'Meu Perfil', icon: 'fa-user' },
]
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e3a8a, #1e40af); /* degradê azul moderno */
  color: #f1f5f9;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 999;
  box-shadow: 2px 0 12px rgba(0,0,0,0.1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.toggle {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #f1f5f9;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  transition: background 0.3s ease, transform 0.2s ease;
}

.toggle:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.05);
}

.menu {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  color: #cbd5e1;
  text-decoration: none;
  transition: background 0.25s ease, color 0.25s ease, padding-left 0.25s ease;
  font-weight: 500;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  padding-left: 1.5rem;
  border-left: 3px solid #3b82f6; /* azul claro */
}

.menu-item.router-link-active {
  background: rgba(59, 130, 246, 0.2);
  color: #ffffff;
  font-weight: 600;
  border-left: 3px solid #3b82f6;
  box-shadow: inset 4px 0 rgba(37, 99, 235, 0.8);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
    transform: translateX(-100%);
  }
  .sidebar.collapsed {
    transform: translateX(0);
  }
}

.sidebar {
  font-family: 'Inter', sans-serif;
}
</style>
