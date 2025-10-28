<template>
  <div class="dashboard">
    <ColaboradorSidebar />
    <div class="main">
      <ColaboradorTopbar />

      <div class="content">
        <h2><i class="fas fa-chart-line"></i> Meu Desempenho</h2>
        <p class="subtitle">Visualize seu progresso e baixe seu relatório individual.</p>

        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Carregando avaliações...
        </div>

        <div v-else-if="avaliacoes.length === 0" class="no-data">
          Nenhuma avaliação encontrada.
        </div>

        <div v-else class="cards">
          <ColaboradorCard
            v-for="a in avaliacoes"
            :key="a.id"
            :avaliacao="a"
            @baixarPDF="baixarRelatorio"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiUsuario } from '@/http/api'
import ColaboradorSidebar from '@/components/colaboradores/ColaboradorSidebar.vue'
import ColaboradorTopbar from '@/components/colaboradores/ColaboradorTopbar.vue'
import ColaboradorCard from '@/components/colaboradores/ColaboradorCard.vue'

const avaliacoes = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await apiUsuario.get('/avaliacoes/colaborador-avaliacao')
    avaliacoes.value = data.avaliacoes || []
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error)
  } finally {
    loading.value = false
  }
})

const baixarRelatorio = async (id) => {
  try {
    const response = await apiUsuario.get(`/avaliacoes/${id}/pdf`, {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Relatorio_Avaliacao_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.error('Erro ao baixar PDF:', error)
    alert('Erro ao gerar PDF. Tente novamente.')
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}
.main {
  flex: 1;
  margin-left: 250px;
}
.content {
  padding: 6rem 2rem 2rem;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}
.subtitle {
  color: #666;
  margin-bottom: 2rem;
}
.loading, .no-data {
  text-align: center;
  margin-top: 3rem;
  color: #777;
  font-size: 1.1rem;
}
</style>
