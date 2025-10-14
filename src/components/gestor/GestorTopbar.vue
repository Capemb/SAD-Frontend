<template>
  <header class="topbar">
    <button class="toggle-btn" @click="$emit('toggle')">
      <i class="fas fa-bars"></i>
    </button>
    <div class="topbar-right">
      <i class="fas fa-bell"></i>
      <div class="user-menu">
        <i class="fas fa-user-circle"></i>
        <span>{{ user?.nome || 'Gestor' }}</span>
      </div>
      <i class="fas fa-sign-out-alt" @click="logout"></i>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const user = JSON.parse(localStorage.getItem('user') || '{}')

const logout = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    await fetch('http://localhost:8000/api/usuarios/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (e) {
    console.error('Erro ao fazer logout:', e)
  } finally {
    localStorage.clear()
    router.push('/login')
  }
}
</script>

<style scoped>
.topbar {
  background: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.toggle-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.3rem;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
.user-menu span {
  color: #333;
}
.topbar-right i {
  cursor: pointer;
  color: #444;
  transition: color 0.3s;
}
.topbar-right i:hover {
  color: #007bff;
}
</style>
