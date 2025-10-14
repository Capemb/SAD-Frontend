<template>
  <div class="dashboard">
    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo">
        <i class="fas fa-user-circle"></i>
        <span v-if="!isCollapsed"> Colaborador </span>
      </div>
      <nav>
        <ul>
          <li><i class="fas fa-home"></i><span v-if="!isCollapsed"> Início</span></li>
          <li><i class="fas fa-tasks"></i><span v-if="!isCollapsed"> Minhas Avaliações</span></li>
          <li><i class="fas fa-chart-line"></i><span v-if="!isCollapsed"> Progresso</span></li>
          <li><i class="fas fa-user-cog"></i><span v-if="!isCollapsed"> Editar Perfil</span></li>
          <li><i class="fas fa-lock"></i><span v-if="!isCollapsed"> Alterar Senha</span></li>
        </ul>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="main">
      <!-- TOPBAR -->
      <header class="topbar">
        <button class="toggle-btn" @click="isCollapsed = !isCollapsed">
          <i class="fas fa-bars"></i>
        </button>
        <div class="topbar-right">
          <i class="fas fa-bell"></i>
          <i class="fas fa-user"></i>
          <i class="fas fa-sign-out-alt"></i>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="content">
        <h2>Bem-vindo(a), Colaborador 👋</h2>
        <div class="cards">
          <div class="card">
            <i class="fas fa-star"></i>
            <h3>Última Avaliação</h3>
            <p>85% concluída</p>
          </div>
          <div class="card">
            <i class="fas fa-bullseye"></i>
            <h3>Metas Ativas</h3>
            <p>3 objetivos</p>
          </div>
          <div class="card">
            <i class="fas fa-envelope"></i>
            <h3>Notificações</h3>
            <p>2 novas mensagens</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isCollapsed = ref(false);
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f4f6f9;
  color: #333;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: #0d1b2a;
  color: white;
  transition: width 0.3s;
  padding: 1rem;
}
.sidebar.collapsed {
  width: 80px;
}
.sidebar .logo {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
}
.sidebar nav ul li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.sidebar nav ul li:hover {
  background: #1b263b;
}

/* Main */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.topbar {
  background: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.topbar-right i {
  margin-left: 1.2rem;
  cursor: pointer;
}
.content {
  padding: 2rem;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}
.card i {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 0.5rem;
}
</style>


