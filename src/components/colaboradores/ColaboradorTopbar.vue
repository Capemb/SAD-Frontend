<template>
  <header class="topbar">
    <div class="welcome">
      <i class="fas fa-smile"></i>
      <span>Bem-vindo(a), {{ user.nome }}</span>
    </div>
    <button class="logout-btn" @click="logout">
      <i class="fas fa-sign-out-alt"></i> Sair
    </button>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { apiUsuario } from '@/http/api'

const user = ref(JSON.parse(localStorage.getItem('user')) || {})

const logout = async () => {
  try {
    await apiUsuario.post('/logout')
  } catch (e) {
    console.warn('Erro ao sair:', e)
  } finally {
    localStorage.removeItem('auth_token_usuario')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}
</script>

<style scoped>
.topbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  position: fixed;
  left: 250px;
  right: 0;
  top: 0;
  z-index: 10;
}
.welcome {
  color: #333;
  font-weight: 500;
}
.logout-btn {
  background: #dc3545;
  border: none;
  color: #fff;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition: 0.3s;
}
.logout-btn:hover {
  background: #b02a37;
}
</style>
