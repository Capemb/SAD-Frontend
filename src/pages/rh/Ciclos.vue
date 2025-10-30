<template>
  <div class="ciclos-root">
    <!-- Cabeçalho -->
    <header class="page-header">
      <div class="header-left">
        <i class="fa-solid fa-calendar-check icon-lg"></i>
        <div>
          <h2>Gestão de Ciclos e Avaliações</h2>
          <p>Crie ciclos de avaliação e associe avaliações aos colaboradores e gestores.</p>
        </div>
      </div>
      <button class="btn btn-gradient" @click="abrirModalCriar">
        <i class="fa-solid fa-plus"></i> Novo Ciclo
      </button>
    </header>

    <!-- Lista de Ciclos -->
    <div class="ciclos-grid">
      <div
        v-for="c in ciclos"
        :key="c.id"
        class="card ciclo-card"
        :class="{ ativo: c.status === 'ativo' }"
      >
        <div class="card-header">
          <h3><i class="fa-solid fa-layer-group"></i> {{ c.nome }}</h3>
          <span class="status" :class="c.status">{{ c.status }}</span>
        </div>
        <p class="descricao">{{ c.descricao || 'Sem descrição informada.' }}</p>
        <div class="datas">
          <i class="fa-regular fa-clock"></i>
          <span>{{ formatarData(c.inicio) }} — {{ formatarData(c.fim) }}</span>
        </div>
        <div class="card-actions">
          <button class="btn small danger" @click="excluirCiclo(c.id)">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- SEÇÃO DE AVALIAÇÕES -->
    <section class="avaliacoes-section">
      <h2><i class="fa-solid fa-clipboard-list"></i> Criar Avaliação</h2>
      <p>Associe uma avaliação a um ciclo existente, selecionando gestor, avaliado e módulo.</p>

      <div class="avaliacao-form">
        <div class="form-row">
          <div class="form-group">
            <label>Ciclo</label>
            <select v-model="formAvaliacao.ciclo_id">
              <option value="">Selecione um ciclo</option>
              <option v-for="c in ciclos" :key="c.id" :value="c.id">{{ c.nome }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Avaliador (Gestor)</label>
            <select v-model="formAvaliacao.avaliador_id">
              <option value="">Selecione o gestor</option>
              <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nome }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Avaliado</label>
            <select v-model="formAvaliacao.avaliado_id">
              <option value="">Selecione o avaliado</option>
              <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.nome }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Módulo</label>
            <select v-model="formAvaliacao.modulo_id">
              <option value="">Selecione o módulo</option>
              <option v-for="m in modulos" :key="m.id" :value="m.id">{{ m.nome }}</option>
            </select>
          </div>
        </div>

        <button class="btn btn-gradient" @click="criarAvaliacao">
          <i class="fa-solid fa-check"></i> Criar Avaliação
        </button>
      </div>

      <div class="avaliacoes-list" v-if="avaliacoes.length > 0">
        <h3><i class="fa-solid fa-list"></i> Avaliações Criadas</h3>
        <div class="search-bar">
          <input type="text" v-model="search" placeholder="🔍 Pesquisar por nome do avaliado ou módulo..." />
        </div>

        <table class="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Gestor</th>
              <th>Avaliado</th>
              <th>Módulo</th>
              <th>Ciclo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, index) in filteredAvaliacoes" :key="a.id">
              <td>{{ index + 1 }}</td>
              <td>{{ a.avaliador?.nome }}</td>
              <td>{{ a.avaliado?.nome }}</td>
              <td>{{ a.modulo?.nome }}</td>
              <td>{{ a.ciclo?.nome }}</td>
              <td><span class="status" :class="a.status">{{ a.status }}</span></td>
              <td>
                <button class="btn small btn-ghost" @click="atualizarAvaliacao(a.id, a.status === 'concluida' ? 'em_progresso' : 'concluida')">
                  <i class="fa-solid fa-rotate"></i>
                  {{ a.status === 'concluida' ? 'Reabrir' : 'Concluir' }}
                </button>
                <button class="btn small danger" @click="eliminarAvaliacao(a.id)">
                  <i class="fa-solid fa-trash"></i> Eliminar
                </button>
              </td>
            </tr>

            <tr v-if="filteredAvaliacoes.length === 0">
              <td colspan="7" style="text-align:center; color:#6b7280; padding:12px;">
                Nenhuma avaliação encontrada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- MODAL CRIAR CICLO (REPARADO) -->
    <transition name="fade">
      <div v-if="showModal" class="ciclo-modal-overlay" @click.self="fecharModal" aria-modal="true" role="dialog">
        <div class="ciclo-modal glass" ref="modalRoot">
          <h3><i class="fa-solid fa-circle-plus"></i> Criar Novo Ciclo</h3>

          <div class="form-group">
            <label>Nome</label>
            <input v-model="form.nome" type="text" placeholder="Ex: Avaliação 1º Semestre 2025" />
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <textarea v-model="form.descricao" placeholder="Objetivo e detalhes deste ciclo"></textarea>
          </div>

          <div class="form-group-inline">
            <div>
              <label>Data de Início</label>
              <input v-model="form.inicio" type="date" />
            </div>
            <div>
              <label>Data de Fim</label>
              <input v-model="form.fim" type="date" />
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-ghost" @click="fecharModal">Cancelar</button>
            <button class="btn btn-gradient" @click="salvarCiclo"> <i class="fa-solid fa-check"></i> Criar Ciclo</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'

const token = localStorage.getItem("auth_token_rh")
const API_CICLOS = "http://localhost:8000/api/ciclos"
const API_AVALIACOES = "http://localhost:8000/api/avaliacoes"
const API_USUARIOS = "http://localhost:8000/api/usuarios/listar-usuarios"
const API_MODULOS = "http://localhost:8000/api/modulos-avaliacao/listar-modulo"

const ciclos = ref([])
const usuarios = ref([])
const modulos = ref([])
const avaliacoes = ref([])

const showModal = ref(false)
const form = ref({ nome: "", descricao: "", inicio: "", fim: "" })
const formAvaliacao = ref({ ciclo_id: "", avaliador_id: "", avaliado_id: "", modulo_id: "" })

const search = ref("")

// carregar dados
const carregarCiclos = async () => {
  try {
    const res = await fetch(API_CICLOS, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    ciclos.value = await res.json()
  } catch (err) {
    console.error("Erro ao carregar ciclos:", err)
  }
}

const carregarUsuariosEModulos = async () => {
  try {
    const [uRes, mRes] = await Promise.all([
      fetch(API_USUARIOS, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(API_MODULOS, { headers: { Authorization: `Bearer ${token}` } })
    ])
    if (!uRes.ok || !mRes.ok) throw new Error('Erro carregando usuários ou módulos')
    usuarios.value = await uRes.json()
    modulos.value = await mRes.json()
  } catch (err) {
    console.error("Erro ao carregar usuários/modulos:", err)
  }
}

const carregarAvaliacoes = async () => {
  try {
    const res = await fetch(`${API_AVALIACOES}/listar`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    const data = await res.json()
    if (Array.isArray(data.avaliacoes)) avaliacoes.value = data.avaliacoes
    else if (Array.isArray(data)) avaliacoes.value = data
    else avaliacoes.value = []
  } catch (err) {
    console.error("Erro ao carregar avaliações:", err)
  }
}

// modal handlers
const abrirModalCriar = async () => {
  form.value = { nome: "", descricao: "", inicio: "", fim: "" }
  showModal.value = true
  await nextTick()
  // impedir scroll do body enquanto modal aberto
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}
const fecharModal = () => {
  showModal.value = false
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  form.value = { nome: "", descricao: "", inicio: "", fim: "" }
}

// operações CRUD
const salvarCiclo = async () => {
  if (!form.value.nome || !form.value.inicio || !form.value.fim) {
    alert("Preencha todos os campos obrigatórios.")
    return
  }
  try {
    const res = await fetch(API_CICLOS, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) {
      const err = await res.json().catch(()=>({}))
      console.error("Erro ao criar ciclo:", err)
      alert("Erro ao criar ciclo. Ver console.")
      return
    }
    await carregarCiclos()
    fecharModal()
  } catch (err) {
    console.error("Erro ao salvar ciclo:", err)
    alert("Erro inesperado. Veja o console.")
  }
}

const excluirCiclo = async (id) => {
  if (!confirm("Deseja realmente excluir este ciclo?")) return
  try {
    const res = await fetch(`${API_CICLOS}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    await carregarCiclos()
  } catch (err) {
    console.error("Erro ao excluir ciclo:", err)
    alert("Erro ao excluir. Veja o console.")
  }
}

const criarAvaliacao = async () => {
  const f = formAvaliacao.value
  if (!f.ciclo_id || !f.avaliador_id || !f.avaliado_id || !f.modulo_id) {
    alert("Preencha todos os campos obrigatórios para criar uma avaliação.")
    return
  }
  try {
    const res = await fetch(`${API_AVALIACOES}/criar`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ciclo_id: f.ciclo_id,
        avaliador_id: f.avaliador_id,
        avaliado_id: f.avaliado_id,
        modulo_id: f.modulo_id,
        data_avaliacao: new Date().toISOString().split('T')[0],
        criterios: []
      })
    })
    if (!res.ok) {
      const err = await res.json().catch(()=>({}))
      console.error("Erro ao criar avaliação:", err)
      alert("Erro ao criar avaliação. Ver console.")
      return
    }
    await carregarAvaliacoes()
    formAvaliacao.value = { ciclo_id: "", avaliador_id: "", avaliado_id: "", modulo_id: "" }
    alert("Avaliação criada com sucesso")
  } catch (err) {
    console.error("Erro inesperado:", err)
    alert("Erro inesperado. Veja o console.")
  }
}

const eliminarAvaliacao = async (id) => {
  if (!confirm("Tem certeza que deseja eliminar esta avaliação?")) return
  try {
    const res = await fetch(`${API_AVALIACOES}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    await carregarAvaliacoes()
  } catch (err) {
    console.error("Erro ao eliminar avaliação:", err)
    alert("Erro ao eliminar. Veja o console.")
  }
}

const atualizarAvaliacao = async (id, status) => {
  try {
    const res = await fetch(`${API_AVALIACOES}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
    await carregarAvaliacoes()
  } catch (err) {
    console.error("Erro ao atualizar avaliação:", err)
    alert("Erro ao atualizar. Veja o console.")
  }
}

const filteredAvaliacoes = computed(() => {
  if (!search.value) return avaliacoes.value || []
  const term = search.value.toLowerCase()
  return (avaliacoes.value || []).filter(a =>
    a.avaliado?.nome?.toLowerCase().includes(term) ||
    a.modulo?.nome?.toLowerCase().includes(term)
  )
})

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-PT", { year: "numeric", month: "short", day: "numeric" }) : '-'

// mounted
onMounted(async () => {
  await carregarCiclos()
  await carregarUsuariosEModulos()
  await carregarAvaliacoes()
  // NOTA: não chamar atualizarAvaliacao() e eliminarAvaliacao() sem argumentos
})
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
.ciclos-root { padding: 28px; font-family: "Inter", sans-serif; color: #111827; background: #f9fafb; min-height: 100vh; }

/* header, cards, forms ... (mantém teu CSS original) */
.page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; }
.header-left { display:flex; align-items:center; gap:14px; }
.icon-lg { font-size:2.4rem; color:#2563eb; }
.page-header h2 { font-size:1.5rem; font-weight:700; margin-bottom:4px; }
.page-header p { color:#6b7280; }

/* grid e cards */
.ciclos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; }
.card { background:#fff; border-radius:16px; padding:18px; box-shadow:0 4px 12px rgba(0,0,0,0.05); transition:transform .25s, box-shadow .25s; }
.card:hover { transform:translateY(-4px); box-shadow:0 8px 20px rgba(0,0,0,0.08); }
.card-header { display:flex; justify-content:space-between; align-items:center; }
.card-header h3 { font-size:1.1rem; display:flex; align-items:center; gap:8px; }
.status { padding:4px 10px; border-radius:8px; font-size:12px; text-transform:capitalize; }
.status.ativo { background:#dcfce7; color:#166534; }
.status.inativo { background:#fee2e2; color:#991b1b; }
.descricao { margin:10px 0; color:#6b7280; font-size:14px; }
.datas { font-size:13px; color:#4b5563; display:flex; align-items:center; gap:6px; }
.card-actions { margin-top:12px; display:flex; justify-content:space-between; align-items:center; }

/* forms */
.btn { border:none; border-radius:8px; padding:8px 14px; cursor:pointer; font-weight:600; font-size:14px; transition:all .2s; }
.btn-gradient { background:linear-gradient(90deg,#2563eb,#3b82f6); color:white; }
.btn-gradient:hover { background:linear-gradient(90deg,#1d4ed8,#2563eb); }
.btn-ghost { background:#f3f4f6; color:#374151; }
.btn.small { font-size:13px; padding:6px 10px; }
.btn.danger { background:#fee2e2; color:#b91c1c; }

/* avaliação section & tabela */
.avaliacoes-section { margin-top:50px; background:#fff; padding:24px; border-radius:16px; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
.avaliacoes-section h2 { display:flex; align-items:center; gap:10px; color:#1e3a8a; font-weight:700; }
.avaliacoes-section p { color:#6b7280; margin-bottom:18px; }
.avaliacao-form { display:flex; flex-direction:column; gap:14px; background:#f9fafb; padding:16px; border-radius:10px; border:1px solid #e5e7eb; }
.form-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; }
.form-group label { font-weight:600; font-size:13px; color:#374151; }
.form-group select, .form-group input, textarea { width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; background:#fff; }
.styled-table { width:100%; border-collapse:collapse; }
.styled-table th, .styled-table td { padding:10px 8px; border-bottom:1px solid #e5e7eb; font-size:14px; }
.styled-table th { background:#f9fafb; color:#374151; text-align:left; }

/* ========== Modal corrigido ========== */
.ciclo-modal-overlay {
  position: fixed;
  inset: 0; /* top:0; right:0; bottom:0; left:0; */
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  z-index: 9999;
  padding: 20px; /* garante espaçamento em telas pequenas */
}

.ciclo-modal {
  background: #fff;
  border-radius: 14px;
  padding: 22px;
  width: 100%;
  max-width: 520px; /* tamanho confortável */
  box-shadow: 0 12px 40px rgba(2,6,23,0.18);
  transform-origin: center;
  animation: modalIn .22s ease;
}

/* ===== Overlay ===== */
.ciclo-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeInBg 0.25s ease;
}

/* ===== Modal Container ===== */
.ciclo-modal {
  background: #fff;
  border-radius: 16px;
  width: 480px;
  max-width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  animation: popIn 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== Header ===== */
.ciclo-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: #fff;
  padding: 1rem 1.3rem;
}

.ciclo-modal-header h3 {
  margin: 0;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.close-btn:hover {
  opacity: 0.8;
}

/* ===== Body ===== */
.ciclo-modal-body {
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

/* ===== Inline Fields ===== */
.form-group-inline {
  display: flex;
  gap: 1rem;
}
.form-group-inline div {
  flex: 1;
}

/* ===== Footer ===== */
.ciclo-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding: 1rem 1.4rem;
  border-top: 1px solid #e2e8f0;
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(8px) scale(.995); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* responsividade */
@media (max-width: 540px) {
  .ciclo-modal { padding:18px; max-width: 95%; }
}

/* pequenas melhorias visuais */
.search-bar { margin-bottom: 15px; display:flex; justify-content:flex-end; }
.search-bar input { width:280px; padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; outline:none; transition:.2s; }
.search-bar input:focus { border-color:#2563eb; box-shadow:0 0 0 4px rgba(37,99,235,0.06); }

/* util */
.form-group-inline { display:flex; gap:10px; justify-content:space-between; }
</style>
