<template>
 

    
      
      <main class="content">
        <router-view />
      </main>


</template>

<script setup>
import Topbar from '@/components/Topbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column; /* empilha topbar em cima */
  min-height: 100vh;
}

.main-area {
  display: flex;
  flex: 1; /* ocupa o restante da tela abaixo do topbar */
}

/* Sidebar ocupa largura fixa */
.sidebar {
  width: 250px;
  background-color: #0d1b2a;
}

/* Conteúdo cresce para preencher o resto */
.content {
  flex: 1;
  background: #f4f6f8;
  padding: 2rem;
}
</style>
