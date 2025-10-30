<template>
  <main class="content">
    <section class="modules-section">
      <header class="modules-header">
        <h2>Módulos de Avaliação</h2>
        <button class="btn primary" @click="openCreateModule">
          <i class="fa-solid fa-plus"></i> Novo Módulo
        </button>
      </header>

      <div v-if="modulesLoading">
        <div class="skeleton-row" v-for="n in 4" :key="n"></div>
      </div>

      <ul v-else class="modules-list">
        <li v-for="m in modules" :key="m.id" class="module-item">
          <div>
            <strong>{{ m.nome }}</strong>
            <div class="muted small">{{ m.descricao || 'Sem descrição' }}</div>
            <div class="muted small">Peso: {{ m.peso }}%</div>
          </div>
          <div class="module-actions">
            <button class="icon" title="Editar" @click="editModule(m)">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="icon danger" title="Remover" @click="removeModule(m)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- Modal -->
   <transition name="modal-fade">
  <div v-if="showModuleModal" class="modal-overlay" @click.self="closeModuleModal">
    <div class="modal-content">
      <header class="modal-header">
        <h3>
          <i class="fa-solid fa-layer-group"></i>
          {{ editingModule ? 'Editar Módulo de Avaliação' : 'Criar Novo Módulo' }}
        </h3>
        <button class="close-btn" @click="closeModuleModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </header>

      <form @submit.prevent="saveModule" class="modal-form">
        <div class="form-group">
          <label>Nome do módulo</label>
          <input v-model="moduleForm.nome" required maxlength="100" placeholder="Ex: Avaliação de Desempenho" />
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="moduleForm.descricao" rows="3" placeholder="Descreva brevemente o propósito do módulo"></textarea>
        </div>

        <div class="form-group">
          <label for="peso">Peso (%)</label>
          <input
            id="peso"
            type="number"
            v-model.number="moduleForm.peso"
            min="0.1"
            max="100"
            step="0.01"
            placeholder="Ex: 12.5"
          />
        </div>

        <footer class="modal-actions">
          <button type="button" class="btn ghost" @click="closeModuleModal">
            <i class="fa-solid fa-xmark"></i> Cancelar
          </button>
          <button type="submit" class="btn primary" :disabled="moduleLoading">
            <i class="fa-solid fa-save"></i>
            {{ moduleLoading ? 'Aguarde...' : (editingModule ? 'Atualizar' : 'Criar') }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</transition>

  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const modules = ref([])
const modulesLoading = ref(false)
const showModuleModal = ref(false)
const editingModule = ref(null)
const moduleLoading = ref(false)
const moduleForm = reactive({ id: null, nome: '', descricao: '', peso: 0.0 })

// 🔹 Carrega módulos da API
const carregarModulos = async () => {
  modulesLoading.value = true
  try {
    const token = localStorage.getItem('auth_token_rh')
    const response = await fetch('http://localhost:8000/api/modulos-avaliacao/listar-modulo', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    modules.value = data
  } catch (error) {
    console.error('Erro ao carregar módulos:', error)
  } finally {
    modulesLoading.value = false
  }
}

// 🔹 Criação e edição
const openCreateModule = () => {
  editingModule.value = null
  moduleForm.id = null
  moduleForm.nome = ''
  moduleForm.descricao = ''
  moduleForm.peso = 0.0
  showModuleModal.value = true
}

const editModule = (m) => {
  editingModule.value = m.id
  moduleForm.id = m.id
  moduleForm.nome = m.nome
  moduleForm.descricao = m.descricao
  moduleForm.peso = m.peso
  showModuleModal.value = true
}

const closeModuleModal = () => (showModuleModal.value = false)

const saveModule = async () => {
  if (!moduleForm.nome.trim()) return
  moduleLoading.value = true

  const token = localStorage.getItem('auth_token_rh')
  const url = editingModule.value
    ? `http://localhost:8000/api/modulos-avaliacao/atualizar-modulo/${moduleForm.id}`
    : 'http://localhost:8000/api/modulos-avaliacao/criar-modulo'

  const method = editingModule.value ? 'PUT' : 'POST'

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nome: moduleForm.nome,
        descricao: moduleForm.descricao,
        peso: moduleForm.peso
      })
    })

    if (!response.ok) throw new Error('Erro ao salvar módulo')

    await carregarModulos()
    showModuleModal.value = false
  } catch (error) {
    console.error('Erro ao salvar módulo:', error)
    alert('Erro ao salvar módulo')
  } finally {
    moduleLoading.value = false
  }
}

// 🔹 Remoção
const removeModule = async (m) => {
  if (!confirm(`Remover módulo "${m.nome}"?`)) return
  try {
    const token = localStorage.getItem('auth_token_rh')
    const response = await fetch(`http://localhost:8000/api/modulos-avaliacao/eliminar-modulo/${m.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!response.ok) throw new Error('Erro ao remover módulo')

    await carregarModulos()
  } catch (error) {
    console.error('Erro ao remover módulo:', error)
  }
}

onMounted(() => {
  carregarModulos()
})
</script>

<style scoped>
.content {
  padding: 22px;
}

.modules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.module-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.module-actions .icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.icon.danger {
  color: #ef4444;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  width: 380px;
  max-width: 90%;
}

/* ===== Modal Overlay ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55); /* fundo escurecido */
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeInBg 0.25s ease;
}

/* ===== Modal Box ===== */
.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  width: 440px;
  max-width: 90%;
  animation: popIn 0.3s ease;
  overflow: hidden;
}

/* ===== Header ===== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: #fff;
  padding: 1rem 1.3rem;
}

.modal-header h3 {
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.close-btn:hover {
  opacity: 0.8;
}

/* ===== Form ===== */
.modal-form {
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
  margin-bottom: 0.4rem;
  display: block;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  outline: none;
}

/* ===== Buttons ===== */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn.primary {
  background: #2563eb;
  color: #fff;
}
.btn.primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn.ghost {
  background: #f3f4f6;
  border: 1px solid #e2e8f0;
  color: #374151;
}
.btn.ghost:hover {
  background: #e5e7eb;
}

/* ===== Animations ===== */
@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes fadeInBg {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}


.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.btn.primary {
  background: #2563eb;
  color: white;
}
.btn.ghost {
  background: #f3f4f6;
  border: 1px solid #e6e9ef;
}
</style>
