<template>
  <header class="topbar">
    <!-- BOTÃO DE MENU -->
    <button class="toggle-btn" @click="$emit('toggleSidebar')" title="Abrir/Fechar menu">
      <i class="fas fa-bars"></i>
    </button>

    <!-- SAUDAÇÃO E INFO -->
    <div class="welcome">
      <transition name="fade">
        <h2 v-if="user">👋 Olá, {{ user.nome }}!</h2>
      </transition>
    </div>

    <!-- MENU DIREITO -->
    <div class="topbar-right">
      <div class="icon-container" title="Notificações">
        <i class="fas fa-bell"></i>
        <span class="badge">3</span>
      </div>

      <div class="user-info" title="Perfil">
        <i class="fas fa-user-circle"></i>
        <span class="username" v-if="user">{{ user.role }}</span>
      </div>

      <button class="logout-btn" @click="handleLogout" :disabled="isLoggingOut" title="Sair">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!isLoggingOut">Sair</span>
        <span v-else>Sair...</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiUsuario } from "@/http/api"; // usa a API correta

const router = useRouter();
const isLoggingOut = ref(false);
const user = ref(null);

// ✅ Carregar o usuário do localStorage
onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});

// ✅ Função de logout
const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await apiUsuario.post("/usuarios/logout");
  } catch (error) {
    console.warn("Logout falhou (sem endpoint dedicado ou token expirado)", error);
  } finally {
    // limpar localStorage do usuário
    localStorage.removeItem("auth_token_usuario");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");

    isLoggingOut.value = false;
    router.push("/login");
  }
};
</script>

<style scoped>
.topbar {
  background: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: #004080;
  transition: transform 0.2s, color 0.2s;
}
.toggle-btn:hover {
  transform: rotate(90deg);
  color: #007bff;
}

.welcome h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

/* ÍCONES DIREITOS */
.icon-container {
  position: relative;
  cursor: pointer;
  color: #444;
  transition: color 0.3s, transform 0.3s;
}
.icon-container:hover {
  color: #007bff;
  transform: scale(1.1);
}
.badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: #e74c3c;
  color: #fff;
  border-radius: 50%;
  font-size: 0.7rem;
  padding: 2px 6px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s;
}
.user-info:hover {
  color: #007bff;
}
.user-info i {
  font-size: 1.4rem;
}
.username {
  font-weight: 500;
  text-transform: capitalize;
}

/* BOTÃO DE SAIR */
.logout-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  color: #444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.05);
}
.logout-btn:disabled {
  background: #ccc;
  color: #777;
  cursor: not-allowed;
}

/* ANIMAÇÕES */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
