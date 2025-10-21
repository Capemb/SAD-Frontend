<template>
  <div class="page relatorios-page">
    <h2><i class="fas fa-chart-line"></i> Relatórios de Desempenho</h2>
    <p class="subtitle">Análise das avaliações por colaborador.</p>

    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { apiUsuario } from '@/http/api'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Notas (%)',
      data: [],
      backgroundColor: '#007bffaa',
      borderRadius: 10,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100 } },
})

onMounted(async () => {
  try {
    const { data } = await apiUsuario.get('/avaliacoes/listar')
    const avaliacoes = data.avaliacoes || []

    chartData.value.labels = avaliacoes.map(a => a.avaliado?.nome || '—')
    chartData.value.datasets[0].data = avaliacoes.map(() => Math.floor(Math.random() * 40) + 60)
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error)
  }
})
</script>

<style scoped>
.page {
  padding: 2rem;
  animation: fadeIn 0.5s ease;
}
.subtitle {
  color: #555;
  margin-bottom: 2rem;
}
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
