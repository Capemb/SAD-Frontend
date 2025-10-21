<template>
  <div class="dashboard-gestor">
    <!-- SIDEBAR -->
    <GestorSidebar :collapsed="collapsed" @toggle="toggleSidebar" />

    <!-- CONTEÚDO PRINCIPAL -->
    <div class="main-content">
      <GestorTopbar @toggleSidebar="toggleSidebar" />

      <transition name="slide-fade" mode="out-in">
        <!-- Aqui o Vue renderiza as páginas internas -->
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GestorSidebar from '@/components/gestor/GestorSidebar.vue'
import GestorTopbar from '@/components/gestor/GestorTopbar.vue'

const collapsed = ref(false)
const toggleSidebar = () => (collapsed.value = !collapsed.value)

// Verifica se o usuário está logado
onMounted(() => {
  const token = localStorage.getItem('auth_token_usuario')
  const user = localStorage.getItem('user')

  if (!token || !user) {
    window.location.href = '/login'
  }
})

</script>

<style scoped>
.dashboard-gestor {
  display: flex;
  min-height: 100vh;
  background-color: #f4f6f9;
  color: #333;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  overflow-x: hidden;
}

/* Animação entre páginas */
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
  opacity: 0;
}
.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}
</style>
