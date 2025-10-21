<template>
  <div class="page avaliacao-page">
    <h2><i class="fas fa-tasks"></i> Minhas Avaliações</h2>
    <p class="subtitle">Veja e gerencie as avaliações associadas a você.</p>

    <table class="styled-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Avaliado</th>
          <th>Módulo</th>
          <th>Ciclo</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in avaliacoes" :key="a.id">
          <td>{{ a.id }}</td>
          <td>{{ a.avaliado?.nome }}</td>
          <td>{{ a.modulo?.nome }}</td>
          <td>{{ a.ciclo?.nome || '—' }}</td>
          <td><span class="status" :class="a.status">{{ a.status }}</span></td>
          <td>
            <button class="btn-action" @click="avaliar(a)">
              <i class="fas fa-pen"></i> Avaliar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiUsuario } from '@/http/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const avaliacoes = ref([])

onMounted(async () => {
  try {
    const { data } = await apiUsuario.get('/usuarios/listar-avaliacoes-gestor')
    console.log('Avaliações carregadas:', data)
    avaliacoes.value = data.avaliacoes || []
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error)
  }
})

const avaliar = (avaliacao) => {
  router.push(`/dashboard-gestor/avaliacoes/${avaliacao.id}`)
}

</script>

<style scoped>
.page { padding: 2rem; animation: fadeIn 0.5s ease; }
.subtitle { color: #555; margin-bottom: 1.5rem; }
.styled-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.styled-table th, .styled-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.status {
  text-transform: capitalize;
  font-weight: 600;
}
.status.em_progresso { color: #007bff; }
.status.pendente { color: #e67e22; }
.btn-action {
  border: none;
  background: #007bff;
  color: white;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-action:hover { background: #0056b3; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
