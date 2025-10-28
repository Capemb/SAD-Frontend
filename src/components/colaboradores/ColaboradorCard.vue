<template>
  <div class="card">
    <h3>{{ avaliacao.modulo?.nome || 'Módulo Desconhecido' }}</h3>
    <p><strong>Ciclo:</strong> {{ avaliacao.ciclo?.nome || '—' }}</p>
    <p><strong>Status:</strong> 
      <span :class="avaliacao.status">{{ avaliacao.status }}</span>
    </p>
    <div class="nota">
      <span>{{ avaliacao.nota_final }}%</span>
    </div>
    <button class="btn-pdf" @click="baixarPDF">
      <i class="fas fa-file-pdf"></i> Baixar Relatório
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  avaliacao: Object
})

const baixarPDF = async () => {
  const token = localStorage.getItem('auth_token_usuario')
  const response = await fetch(`http://localhost:8000/api/avaliacoes/${props.avaliacao.id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const blob = await response.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `Relatorio_Avaliacao_${props.avaliacao.id}.pdf`
  link.click()
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 1.5rem;
  transition: transform 0.3s;
}
.card:hover {
  transform: translateY(-3px);
}
.nota {
  font-size: 2rem;
  font-weight: bold;
  color: #0d6efd;
  margin: 1rem 0;
}
.btn-pdf {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-pdf:hover {
  background: #b02a37;
}
</style>
