<template>
  <div class="page equipe">
    <h2><i class="fas fa-users"></i> Equipa</h2>
    <p>Veja os colaboradores associados a você como gestor.</p>

    <div class="card-grid">
      <div v-for="c in colaboradores" :key="c.id" class="card">
        <i class="fas fa-user"></i>
        <h4>{{ c.nome }}</h4>
        <p>{{ c.cargo }}</p>
        <p class="departamento">{{ c.departamento }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/http/api'

const colaboradores = ref([])

const carregarColaboradores = async () => {
  const token = localStorage.getItem('auth_token_usuario')
  const { data } = await api.get('/usuarios/listar-usuarios', {
    headers: { Authorization: `Bearer ${token}` }
  })
  colaboradores.value = data
}

onMounted(carregarColaboradores)
</script>

<style scoped>
.page {
  padding: 2rem;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: 0.3s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}
.card i {
  color: #2563eb;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.departamento {
  color: #6b7280;
  font-size: 0.9rem;
}
</style>
