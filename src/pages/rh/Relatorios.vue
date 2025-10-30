<template>
  <div class="relatorios-page">
    <!-- 🔹 Cabeçalho -->
    <div class="header">
      <h2><i class="fa-solid fa-file-lines"></i> Relatórios de Desempenho</h2>
      <p class="subtitle">
        Visualize todos os relatórios de avaliação e baixe em formato PDF.
      </p>
    </div>

    <!-- 🔹 Estado de carregamento -->
    <div v-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Carregando relatórios...
    </div>

    <!-- 🔹 Mensagem de erro -->
    <div v-else-if="erro" class="erro-msg">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ erro }}
    </div>

    <!-- 🔹 Lista de relatórios -->
    <div v-else class="relatorios-container">
      <div
        v-for="relatorio in relatorios"
        :key="relatorio.id"
        class="relatorio-card glass"
      >
        <div class="info">
          <h4><i class="fa-solid fa-chart-pie"></i> {{ relatorio.titulo }}</h4>
          <p>
            <i class="fa-solid fa-user"></i>
            {{ relatorio.usuario?.nome || 'Desconhecido' }}
          </p>
          <p class="data">
            <i class="fa-solid fa-calendar"></i>
            {{ formatarData(relatorio.created_at) }}
          </p>
        </div>

        <div class="actions">
          <button class="btn-download" @click="baixarPDF(relatorio.id)">
            <i class="fa-solid fa-download"></i> Baixar PDF
          </button>
        </div>
      </div>

      <!-- Caso não haja relatórios -->
      <div v-if="!relatorios.length" class="no-data">
        <i class="fa-solid fa-folder-open"></i> Nenhum relatório disponível.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiUsuario } from '@/http/api'

const relatorios = ref([])
const loading = ref(true)
const erro = ref(null)

// 🔹 Carrega os relatórios ao montar
onMounted(async () => {
  try {
    const { data } = await apiUsuario.get('/avaliacoes/relatorio-geral')
    relatorios.value = data.avaliacoes || []
  } catch (e) {
    console.error('Erro ao carregar relatórios:', e)
    erro.value = 'Erro ao carregar relatórios. Tente novamente mais tarde.'
  } finally {
    loading.value = false
  }
})

// 🔹 Formata a data
const formatarData = (data) => {
  const d = new Date(data)
  return d.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// 🔹 Baixar PDF
const baixarPDF = async (id) => {
  try {
    const response = await apiUsuario.get(`/avaliacoes/${id}/pdf`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `relatorio_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
    alert('Não foi possível baixar o PDF.')
  }
}
</script>

<style scoped>
.relatorios-page {
  padding: 2rem;
  animation: fadeIn 0.4s ease;
  font-family: 'Inter', sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

/* Cabeçalho */
.header {
  margin-bottom: 1.5rem;
}
.header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e40af;
}
.subtitle {
  color: #555;
  font-size: 0.95rem;
}

/* Loading e erro */
.loading,
.erro-msg,
.no-data {
  text-align: center;
  margin-top: 2rem;
  font-size: 1rem;
}
.loading {
  color: #2563eb;
}
.erro-msg {
  color: #dc2626;
}
.no-data {
  color: #64748b;
}

/* Container de relatórios */
.relatorios-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.2rem;
}

/* Cartão */
.relatorio-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.2rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.relatorio-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.relatorio-card h4 {
  margin: 0;
  color: #1e293b;
}
.relatorio-card .data {
  font-size: 0.85rem;
  color: #64748b;
}
.relatorio-card .actions {
  display: flex;
  align-items: center;
}
.btn-download {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn-download:hover {
  background: linear-gradient(90deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
}

/* Animação */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
