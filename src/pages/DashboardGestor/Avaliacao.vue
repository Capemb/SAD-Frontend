<template>
  <div class="page avaliacoes">
    <h2><i class="fas fa-tasks"></i> Minhas Avaliações</h2>
    <p>Veja as avaliações dos seus colaboradores e atribua notas aos critérios.</p>

    <table class="styled-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Colaborador</th>
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
            <button class="btn small" @click="avaliar(a)">
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
import api from '@/http/api'

const avaliacoes = ref([])

const carregarAvaliacoes = async () => {
  const token = localStorage.getItem('auth_token_usuario')
  const { data } = await api.get('/avaliacoes/listar', {
    headers: { Authorization: `Bearer ${token}` }
  })
  avaliacoes.value = data.avaliacoes || []
}

const avaliar = (avaliacao) => {
  alert(`Abrindo avaliação #${avaliacao.id} de ${avaliacao.avaliado?.nome}`)
}

onMounted(carregarAvaliacoes)
</script>

<style scoped>
.page {
  padding: 2rem;
}
.styled-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
}
th, td {
  padding: 12px;
  text-align: left;
}
th {
  background: #f3f4f6;
  color: #374151;
}
tr:hover {
  background: #f9fafb;
}
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  text-transform: capitalize;
}
.status.em_progresso {
  background: #dbeafe;
  color: #1e3a8a;
}
.btn.small {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
}
.btn.small:hover {
  background: #1d4ed8;
}
</style>
