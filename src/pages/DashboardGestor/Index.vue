<template>
  <div class="dashboard-container">
    <GestorSidebar :collapsed="collapsed" />
    <div class="main">
      <GestorTopbar @toggle="collapsed = !collapsed" />
      <main class="content">
        <h2 class="title">Bem-vindo(a), {{ user?.nome || 'Gestor' }} 👨‍💼</h2>
        <transition name="fade">
          <div class="cards">
            <GestorCard icon="fas fa-users" title="Colaboradores" subtitle="12 ativos" color="#007bff" />
            <GestorCard icon="fas fa-tasks" title="Avaliações em Progresso" subtitle="5 em andamento" color="#28a745" />
            <GestorCard icon="fas fa-chart-line" title="Último Relatório" subtitle="Emitido ontem" color="#ffc107" />
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GestorSidebar from '@/components/gestor/GestorSidebar.vue'
import GestorTopbar from '@/components/gestor/GestorTopbar.vue'
import GestorCard from '@/components/gestor/GestorCard.vue'


const collapsed = ref(false)
const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  } else {
    console.warn("Usuário não encontrado no localStorage. Redirecionando para login...")
    window.location.href = '/login'
  }
})
</script>


<style scoped>
.dashboard-container {
  display: flex;
  background: #f8f9fb;
  min-height: 100vh;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content {
  padding: 2rem;
  animation: fadeIn 0.5s ease;
}
.title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
