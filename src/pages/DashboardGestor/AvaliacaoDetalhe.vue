<template>
  <div class="avaliacao-detalhe">
    <h2><i class="fas fa-star"></i> Avaliar Colaborador</h2>
    <p class="subtitle">Atribua notas aos critérios deste módulo de avaliação.</p>

    <!-- 🔹 Informações da Avaliação -->
    <div v-if="avaliacao" class="avaliacao-info">
      <p><strong>Avaliado:</strong> {{ avaliacao.avaliado?.nome }}</p>
      <p><strong>Módulo:</strong> {{ avaliacao.modulo?.nome }}</p>
      <p><strong>Status:</strong> 
        <span class="status" :class="avaliacao.status">{{ avaliacao.status }}</span>
      </p>
    </div>

    <!-- 🔹 Lista de Critérios -->
    <div v-if="criterios.length" class="criterios-list">
      <table class="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Critério</th>
            <th>Descrição</th>
            <th>Nota (1–5)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(criterio, index) in criterios" :key="criterio.id">
            <td>{{ index + 1 }}</td>
            <td>{{ criterio.nome }}</td>
            <td>{{ criterio.descricao || '—' }}</td>
            <td>
              <input 
                type="number" 
                min="1" 
                max="5" 
                v-model.number="criterio.nota"
                @input="calcularNotaFinal"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 🔹 Nota Final -->
      <div class="nota-final" v-if="notaFinal !== null">
        <h3>
          <i class="fas fa-percentage"></i> Nota Final: 
          <span :class="notaClass">{{ notaFinal }}%</span>
        </h3>
      </div>

      <!-- 🔹 Botão Salvar -->
      <button class="btn-salvar" @click="salvarNotas" :disabled="loading">
        <i class="fas fa-save"></i>
        {{ loading ? 'Salvando...' : 'Salvar Avaliação' }}
      </button>

      <!-- 🔹 Mensagem de sucesso -->
      <p v-if="mensagem" class="mensagem-sucesso">{{ mensagem }}</p>
    </div>

    <div v-else class="loading">
      <i class="fas fa-spinner fa-spin"></i> Carregando critérios...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiUsuario } from '@/http/api'

const route = useRoute()
const router = useRouter()
const avaliacaoId = ref(route.params.id)

const avaliacao = ref(null)
const criterios = ref([])
const loading = ref(false)
const mensagem = ref('')
const notaFinal = ref(null)

// 🔹 Busca detalhes da avaliação
onMounted(async () => {
  try {
    const { data } = await apiUsuario.get(`/avaliacoes/${avaliacaoId.value}`)
    avaliacao.value = data.avaliacao
    criterios.value = data.criterios || []
    calcularNotaFinal()
  } catch (error) {
    console.error('Erro ao carregar detalhes da avaliação:', error)
    router.push('/dashboard-gestor')
  }
})

// 🔹 Calcula a nota final em tempo real
const calcularNotaFinal = () => {
  if (!criterios.value.length) return
  const soma = criterios.value.reduce((acc, c) => acc + (c.nota || 0), 0)
  const total = criterios.value.length * 5
  notaFinal.value = ((soma / total) * 100).toFixed(1)
}

// 🔹 Classe visual da nota
const notaClass = computed(() => {
  if (notaFinal.value >= 80) return 'alta'
  if (notaFinal.value >= 60) return 'media'
  return 'baixa'
})

// 🔹 Envia notas ao backend
const salvarNotas = async () => {
  loading.value = true
  mensagem.value = ''
  const token = localStorage.getItem('auth_token_usuario')

  try {
    const response = await fetch('http://localhost:8000/api/avaliacoes/salvar-notas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        avaliacao_id: avaliacaoId.value,
        notas: criterios.value.map(c => ({
          criterio_id: c.id,
          nota: c.nota,
        })),
      }),
    })

    const result = await response.json()
    if (!response.ok) throw result

    mensagem.value = 'Notas salvas com sucesso ✅'
    avaliacao.value.status = 'concluída'
  } catch (error) {
    console.error('Erro ao salvar notas:', error)
    mensagem.value = 'Falha ao salvar notas. Tente novamente.'
  } finally {
    loading.value = false
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

.avaliacao-info {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-left: 5px solid #007bff;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.status {
  font-weight: bold;
  text-transform: capitalize;
}
.status.concluida { color: #28a745; }
.status.em_progresso { color: #007bff; }

.styled-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.styled-table th, .styled-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #eee;
}
.styled-table th {
  background: #007bff;
  color: #fff;
  text-align: left;
}
input[type="number"] {
  width: 70px;
  padding: 0.3rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-align: center;
  font-weight: bold;
}

.btn-salvar {
  margin-top: 1.2rem;
  padding: 0.7rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-salvar:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.mensagem-sucesso {
  color: #28a745;
  font-weight: 500;
  margin-top: 1rem;
}

.nota-final {
  margin-top: 1rem;
  background: #f4f9ff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}
.nota-final h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.nota-final span {
  font-weight: bold;
  margin-left: 0.5rem;
}
.nota-final .alta { color: #28a745; }
.nota-final .media { color: #f39c12; }
.nota-final .baixa { color: #e74c3c; }

.loading {
  text-align: center;
  margin-top: 2rem;
  color: #007bff;
  font-size: 1.2rem;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
