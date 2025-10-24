<template>
  <div class="page relatorios-page">
    <h2><i class="fas fa-chart-line"></i> Relatórios de Desempenho</h2>
    <p class="subtitle">Visualize o desempenho dos colaboradores avaliados.</p>

    <!-- 🔹 Estado de carregamento -->
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Carregando dados...
    </div>

    <!-- 🔹 Mensagem de erro -->
    <div v-else-if="erro" class="erro-msg">
      <i class="fas fa-exclamation-triangle"></i> {{ erro }}
    </div>

    <!-- 🔹 Gráfico -->
    <div v-else class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { apiUsuario } from '@/http/api'

// Registrar módulos necessários do Chart.js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// 🔹 Estados reativos
const loading = ref(true)
const erro = ref(null)
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Nota Final (%)',
      data: [],
      backgroundColor: '#007bffbb',
      borderColor: '#0056b3',
      borderWidth: 1,
      borderRadius: 6
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx => `${ctx.parsed.y.toFixed(1)}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: { display: true, text: 'Nota (%)' }
    },
    x: {
      ticks: { autoSkip: false, maxRotation: 40, minRotation: 0 }
    }
  }
})

// 🔹 Carrega dados reais do backend
onMounted(async () => {
  try {
    const { data } = await apiUsuario.get('/avaliacoes/relatorio-geral')
    const avaliacoes = data.avaliacoes || []

    if (!avaliacoes.length) {
      erro.value = 'Nenhuma avaliação concluída encontrada.'
      return
    }

    // Monta o gráfico com nomes e notas
    chartData.value.labels = avaliacoes.map(a => a.avaliado?.nome || '—')
    chartData.value.datasets[0].data = avaliacoes.map(a =>
      parseFloat(a.nota_final || 0)
    )
  } catch (e) {
    console.error('Erro ao carregar relatórios:', e)
    erro.value = 'Erro ao carregar dados. Tente novamente.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page {
  padding: 2rem;
  animation: fadeIn 0.5s ease;
  font-family: "Inter", sans-serif;
}

.subtitle {
  color: #555;
  margin-bottom: 1.5rem;
}

.loading,
.erro-msg {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  border-radius: 10px;
}

.loading {
  color: #007bff;
  background: #eef5ff;
}

.erro-msg {
  color: #d9534f;
  background: #fdecea;
}

.chart-container {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  margin: auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
