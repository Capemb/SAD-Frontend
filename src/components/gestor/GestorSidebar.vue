<template>
  <aside class="sidebar" :class="{ collapsed }">
    <!-- LOGO -->
    <div class="sidebar-logo">
      <i class="fas fa-user-tie logo-icon"></i>
      <transition name="fade">
        <span v-if="!collapsed" class="logo-text">Gestor</span>
      </transition>
    </div>

    <!-- MENU -->
    <nav>
      <ul>
        <li v-for="item in menu" :key="item.label">
          <router-link
            :to="item.route"
            class="menu-item"
            active-class="active"
          >
            <i :class="item.icon"></i>
            <transition name="slide-fade">
              <span v-if="!collapsed">{{ item.label }}</span>
            </transition>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer" v-if="!collapsed">
      <small>&copy; 2025 SAD RH</small>
    </div>
  </aside>
</template>

<script setup>
defineProps({ collapsed: Boolean })

// ✅ Menu do Gestor
const menu = [
  { label: 'Início', icon: 'fas fa-home', route: '/dashboard-gestor' },
  { label: 'Equipa', icon: 'fas fa-users', route: '/dashboard-gestor/equipa' },
  { label: 'Avaliações', icon: 'fas fa-tasks', route: '/dashboard-gestor/avaliacoes' },
  { label: 'Relatórios', icon: 'fas fa-chart-line', route: '/dashboard-gestor/relatorios' },
  { label: 'Perfil', icon: 'fas fa-user-cog', route: '/dashboard-gestor/perfil' },
]
</script>

<style scoped>
/* =========================
   ESTILO GERAL DA SIDEBAR
========================= */
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #001f3f, #002b5c);
  color: white;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}
.sidebar.collapsed {
  width: 80px;
}

/* LOGO */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  padding: 1rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.logo-icon {
  color: #00bcd4;
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* MENU */
nav ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #dce3ec;
  text-decoration: none;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  margin: 0.2rem 0.6rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}
.menu-item i {
  width: 20px;
  text-align: center;
  transition: transform 0.2s;
}
.menu-item:hover {
  background: rgba(0, 188, 212, 0.2);
  color: #fff;
  transform: translateX(4px);
}
.menu-item:hover i {
  transform: scale(1.1);
}
.menu-item.active {
  background: #00bcd4;
  color: white;
  font-weight: 600;
}

/* FOOTER */
.sidebar-footer {
  padding: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* TRANSIÇÕES */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
