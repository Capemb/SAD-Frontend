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

          <td>
            <span class="status" :class="a.status">
              {{ a.status.replace('_', ' ') }}
            </span>
          </td>

          <td class="actions">
            <!-- Avaliar -->
            <button
              class="btn-action"
              :class="{ concluida: a.status === 'concluida' }"
              :disabled="a.status === 'concluida'"
              @click="avaliar(a)"
            >
              <i :class="a.status === 'concluida' ? 'fas fa-check-circle' : 'fas fa-pen'"></i>
              {{ a.status === 'concluida' ? 'Concluída' : 'Avaliar' }}
            </button>

            <!-- Ver Notas -->
            <button
              class="btn-secondary"
              @click="verNotas(a.id)"
            >
              <i class="fas fa-eye"></i> Ver Notas
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
    avaliacoes.value = data.avaliacoes || []
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error)
  }
})

const avaliar = (avaliacao) => {
  if (avaliacao.status === 'concluida') return
  router.push(`/dashboard-gestor/avaliacoes/${avaliacao.id}`)
}

const verNotas = (id) => {
  router.push(`/dashboard-gestor/avaliacoes/${id}?visualizar=true`)
}
</script>

<style scoped>
.page {
  padding: 2rem;
  animation: fadeIn 0.5s ease;
}
.subtitle {
  color: #555;
  margin-bottom: 1.5rem;
}
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
.status.concluida { color: #28a745; }

.btn-action,
.btn-secondary {
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  margin-right: 6px;
}

.btn-action {
  background: #007bff;
  color: white;
}
.btn-action.concluida {
  background: #ccc;
  color: #555;
  cursor: not-allowed;
}
.btn-secondary {
  background: #f3f4f6;
  color: #333;
}
.btn-secondary:hover {
  background: #e5e7eb;
}
.actions {
  display: flex;
  gap: 6px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
