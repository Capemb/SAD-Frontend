<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api, { setAuthToken } from '../http/api'

// Ícones
import { Bell, User, LogOut, Search, Repeat } from 'lucide-vue-next'

const user = ref(null)
const isDropdownOpen = ref(false)
const showModal = ref(false)
const perfisDisponiveis = ref([])
const router = useRouter()

</script>

<template>
  <header class="topbar">
    <div class="topbar-right">
      <!-- Pesquisa -->
      <div class="search-box">
        <Search size="18" />
        <input type="text" placeholder="Pesquisar..." />
      </div>

      <!-- Notificações -->
      <button class="icon-btn">
        <Bell size="20" />
      </button>

      <!-- Usuário -->
      <div class="user-section">
        <button @click="toggleDropdown" class="user-btn">
          <User size="20" />
          <span class="username">Sem nome</span>
        </button>
       
      </div>
    </div>
  </header>

  <!-- Modal para mudar perfil -->

</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}
.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
}

.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  color: #374151;
}

.user-section { position: relative; }
.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #111827;
}
.username { font-size: 0.875rem; }

.dropdown-menu {
  position: absolute;
  right: 0; top: 110%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dropdown-menu button {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}
.dropdown-menu button:hover {
  background: #f3f4f6;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}
.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: fadeIn 0.3s ease-out;
}
.modal-content h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}
.perfil-item {
  list-style: none;
  margin: .4rem 0;
  padding: .6rem;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: background .2s;
}
.perfil-item:hover {
  background: #e5e7eb;
}
.close-btn {
  margin-top: 1rem;
  background: #d1d5db;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.close-btn:hover {
  background: #9ca3af;
}

/* animação suave */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
