<template>
  <header class="topbar">
    <button class="toggle-btn" @click="$emit('toggleSidebar')">
      <i class="fas fa-bars"></i>
    </button>

    <div class="topbar-right">
      <i class="fas fa-bell"></i>
      <i class="fas fa-user"></i>
      <button
        class="logout-btn"
        @click="handleLogout"
        :disabled="isLoggingOut"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!isLoggingOut">Sair</span>
        <span v-else>Sair...</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const isLoggingOut = ref(false);

const handleLogout = async () => {
  isLoggingOut.value = true;

  try {
    const token = localStorage.getItem("auth_token_usuario");

    if (token) {
      await fetch("http://localhost:8000/api/usuarios/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {}); // Ignora caso não exista o endpoint
    }
  } catch (error) {
    console.error("Erro ao sair:", error);
  } finally {
    // Limpar apenas o contexto do usuário (gestor/colaborador)
    localStorage.removeItem("auth_token_usuario");
    localStorage.removeItem("user");
    localStorage.removeItem("user_role");

    isLoggingOut.value = false;

    // Redireciona para login dos usuários
    router.push({ name: "login" });
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
.logout-btn {
  background: transparent;
  border: none;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}
.logout-btn:hover {
  color: #e74c3c;
  transform: scale(1.05);
}
.logout-btn:disabled {
  color: gray;
  cursor: not-allowed;
}
</style>
