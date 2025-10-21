<template>
  <div class="page perfil-page">
    <h2><i class="fas fa-user-cog"></i> Meu Perfil</h2>
    <p class="subtitle">Gerencie suas informações e credenciais.</p>

    <form class="perfil-form">
      <label>Nome</label>
      <input type="text" v-model="perfil.nome" />

      <label>Email</label>
      <input type="email" v-model="perfil.email" />

      <label>Cargo</label>
      <input type="text" v-model="perfil.cargo" />

      <button class="btn-salvar" @click.prevent="salvarPerfil">
        <i class="fas fa-save"></i> Salvar Alterações
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiUsuario } from '@/http/api'

const perfil = ref({ nome: '', email: '', cargo: '' })

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) perfil.value = user
})

const salvarPerfil = async () => {
  try {
    await apiUsuario.put(`/usuarios/atualizar-usuario/${perfil.value.id}`, perfil.value)
    alert('Perfil atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
  }
}
</script>

<style scoped>
.page { padding: 2rem; animation: fadeIn 0.5s ease; }
.subtitle { color: #555; margin-bottom: 1.5rem; }
.perfil-form {
  max-width: 500px;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.perfil-form label {
  font-weight: 600;
  color: #333;
}
.perfil-form input {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.btn-salvar {
  background: #007bff;
  border: none;
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-salvar:hover { background: #0056b3; }
</style>
