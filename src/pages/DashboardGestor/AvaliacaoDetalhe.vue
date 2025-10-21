<template>
  <div class="avaliacao-detalhe">
    <h2><i class="fas fa-star"></i> Avaliar Colaborador</h2>
    <p class="subtitle">Atribua notas aos critérios do módulo desta avaliação.</p>

    <div v-if="avaliacao" class="avaliacao-info">
      <p><strong>Avaliado:</strong> {{ avaliacao.avaliado?.nome }}</p>
      <p><strong>Módulo:</strong> {{ avaliacao.modulo?.nome }}</p>
      <p><strong>Status:</strong> <span class="status">{{ avaliacao.status }}</span></p>
    </div>

    <div v-if="criterios.length" class="criterios-list">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Critério</th>
            <th>Descrição</th>
            <th>Nota (1–5)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(criterio, index) in criterios" :key="criterio.id">
            <td>{{ criterio.nome }}</td>
            <td>{{ criterio.descricao }}</td>
            <td>
              <input type="number" min="1" max="5" v-model.number="criterio.nota" />
            </td>
          </tr>
        </tbody>
      </table>

      <button class="btn-salvar" @click="salvarNotas">
        <i class="fas fa-save"></i> Salvar Avaliação
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiUsuario } from '@/http/api'

const route = useRoute()
const router = useRouter()

const avaliacao = ref(null)
const criterios = ref([])

onMounted(async () => {
  const id = route.params.id
  try {
    const { data } = await apiUsuario.get(`/avaliacoes/${id}`)
    avaliacao.value = data.avaliacao
    criterios.value = data.criterios || []
  } catch (error) {
    console.error('Erro ao carregar detalhes da avaliação:', error)
    router.push('/dashboard-gestor')
  }
})

const salvarNotas = async () => {
  try {
    const id = route.params.id
    const payload = { criterios: criterios.value }
    await apiUsuario.post(`/avaliacoes/${id}/avaliar`, payload)
    alert('✅ Avaliação salva com sucesso!')
    router.push('/dashboard-gestor/avaliacoes')
  } catch (error) {
    console.error('Erro ao salvar notas:', error)
    alert('❌ Falha ao salvar avaliação.')
  }
}
</script>

<style scoped>
.avaliacao-detalhe {
  padding: 2rem;
  animation: fadeIn 0.5s ease;
}
.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.styled-table th, .styled-table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #eee;
}
input[type="number"] {
  width: 70px;
  padding: 0.3rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-align: center;
}
.btn-salvar {
  margin-top: 1rem;
  padding: 0.7rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-salvar:hover {
  background: #0056b3;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
