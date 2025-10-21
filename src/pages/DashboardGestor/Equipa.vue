<template>
  <div class="page equipe-page">
    <h2><i class="fas fa-users"></i> Minha Equipa</h2>
    <p class="subtitle">Visualize os colaboradores que estão sob sua gestão.</p>

    <div class="equipe-grid">
      <div v-for="colab in colaboradores" :key="colab.id" class="colaborador-card">
        <div class="avatar">
          <i class="fas fa-user"></i>
        </div>
        <h4>{{ colab.nome }}</h4>
        <p>{{ colab.cargo }}</p>
        <span class="departamento">{{ colab.departamento }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiUsuario } from '@/http/api'

const colaboradores = ref([])

onMounted(async () => {
  try {
    const { data } = await apiUsuario.get('/usuarios/listar-usuarios')
    colaboradores.value = data || []
  } catch (error) {
    console.error('Erro ao carregar equipa:', error)
  }
})
</script>

<style scoped>
.page {
  padding: 2rem;
  animation: fadeIn 0.6s ease;
}
.subtitle {
  color: #555;
  margin-bottom: 2rem;
}
.equipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
.colaborador-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.colaborador-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}
.avatar {
  background: #007bff22;
  color: #007bff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.departamento {
  font-size: 0.85rem;
  color: #777;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
