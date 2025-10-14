<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-logo">
      <i class="fas fa-user-tie"></i>
      <span v-if="!collapsed">Gestor</span>
    </div>
    <nav>
      <ul>
        <li v-for="item in menu" :key="item.label" @click="navigate(item.route)">
          <i :class="item.icon"></i>
          <span v-if="!collapsed">{{ item.label }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({ collapsed: Boolean })
const router = useRouter()

const menu = [
  { label: 'Início', icon: 'fas fa-home', route: '/gestor' },
  { label: 'Equipa', icon: 'fas fa-users', route: '/gestor/equipa' },
  { label: 'Avaliações', icon: 'fas fa-tasks', route: '/gestor/avaliacoes' },
  { label: 'Relatórios', icon: 'fas fa-chart-line', route: '/gestor/relatorios' },
  { label: 'Perfil', icon: 'fas fa-user-cog', route: '/gestor/perfil' },
]

const navigate = (route) => {
  router.push(route)
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #001f3f, #003366);
  color: #fff;
  height: 100vh;
  padding: 1rem;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}
.sidebar.collapsed {
  width: 80px;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
  font-weight: bold;
  font-size: 1.1rem;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
}
.sidebar nav ul li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.9rem;
  margin-bottom: 5px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.sidebar nav ul li:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}
.sidebar nav ul li i {
  width: 20px;
  text-align: center;
}
</style>
