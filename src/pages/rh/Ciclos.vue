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
            <tr v-for="a in avaliacoes" :key="a.id">
              <td>{{ a.id }}</td>
              <td>{{ a.avaliador?.nome }}</td>
              <td>{{ a.avaliado?.nome }}</td>
              <td>{{ a.modulo?.nome }}</td>
              <td>{{ a.ciclo?.nome }}</td>
              <td><span class="status" :class="a.status">{{ a.status }}</span></td>
              <td>
                <button class="btn small btn-ghost" @click="atualizarAvaliacao(a.id, a.status === 'concluida' ? 'em_progresso' : 'concluida')">
                  <i class="fa-solid fa-rotate"></i> {{ a.status === 'concluida' ? 'Reabrir' : 'Concluir' }}
                </button>
                <button class="btn small danger" @click="eliminarAvaliacao(a.id)">
                  <i class="fa-solid fa-trash"></i> Eliminar
                </button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- MODAL CRIAR CICLO -->
    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="fecharModal">
        <div class="modal glass">
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
            <button class="btn btn-gradient" @click="salvarCiclo">
              <i class="fa-solid fa-check"></i> Criar Ciclo
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

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
const formAvaliacao = ref({
  ciclo_id: "",
  avaliador_id: "",
  avaliado_id: "",
  modulo_id: "",
})

const carregarCiclos = async () => {
  const res = await fetch(API_CICLOS, { headers: { Authorization: `Bearer ${token}` } })
  ciclos.value = await res.json()
}

const carregarUsuariosEModulos = async () => {
  const [uRes, mRes] = await Promise.all([
    fetch(API_USUARIOS, { headers: { Authorization: `Bearer ${token}` } }),
    fetch(API_MODULOS, { headers: { Authorization: `Bearer ${token}` } }),
  ])
  usuarios.value = await uRes.json()
  modulos.value = await mRes.json()
}

const abrirModalCriar = () => (showModal.value = true)
const fecharModal = () => {
  showModal.value = false
  form.value = { nome: "", descricao: "", inicio: "", fim: "" }
}

const salvarCiclo = async () => {
  if (!form.value.nome || !form.value.inicio || !form.value.fim) {
    alert("Preencha todos os campos obrigatórios.")
    return
  }
  await fetch(API_CICLOS, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(form.value),
  })
  fecharModal()
  await carregarCiclos()
}

const excluirCiclo = async (id) => {
  if (!confirm("Deseja realmente excluir este ciclo?")) return
  await fetch(`${API_CICLOS}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await carregarCiclos()
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
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", // 👈 evita redirect 302
        Authorization: `Bearer ${token}`, // 👈 Sanctum token
      },
      body: JSON.stringify({
        ciclo_id: f.ciclo_id,
        avaliador_id: f.avaliador_id,
        avaliado_id: f.avaliado_id,
        modulo_id: f.modulo_id,
        data_avaliacao: new Date().toISOString().split('T')[0],
        criterios: [],
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Erro ao criar avaliação:", errorData)
      alert("Erro ao criar avaliação. Verifique o console.")
      return
    }

    console.log("Avaliação criada com sucesso!")
    await carregarAvaliacoes()
    formAvaliacao.value = { ciclo_id: "", avaliador_id: "", avaliado_id: "", modulo_id: "" }
  } catch (err) {
    console.error("Erro inesperado:", err)
  }
}



const carregarAvaliacoes = async () => {
  try {
    const res = await fetch(`${API_AVALIACOES}/listar`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

    const data = await res.json();

    // Se a API devolve { avaliacoes: [...] }
    if (Array.isArray(data.avaliacoes)) {
      avaliacoes.value = data.avaliacoes;
    } 
    // Se devolve um array direto
    else if (Array.isArray(data)) {
      avaliacoes.value = data;
    } 
    else {
      avaliacoes.value = [];
    }

    console.log("✅ Avaliações carregadas:", avaliacoes.value);
  } catch (error) {
    console.error("Erro ao carregar avaliações:", error);
  }
};
const eliminarAvaliacao = async (id) => {
  if (!confirm("Tem certeza que deseja eliminar esta avaliação?")) return;

  try {
    const res = await fetch(`${API_AVALIACOES}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

    alert("✅ Avaliação eliminada com sucesso!");
    await carregarAvaliacoes();
  } catch (error) {
    console.error("Erro ao eliminar avaliação:", error);
  }
};

const atualizarAvaliacao = async (id, status) => {
  try {
    const res = await fetch(`${API_AVALIACOES}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

    alert("✅ Avaliação atualizada com sucesso!");
    await carregarAvaliacoes();
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
  }
};


const formatarData = (data) =>
  new Date(data).toLocaleDateString("pt-PT", { year: "numeric", month: "short", day: "numeric" })

onMounted(async () => {
  await carregarCiclos()
  await carregarUsuariosEModulos()
  await carregarAvaliacoes()
  await atualizarAvaliacao();
  await eliminarAvaliacao();
})
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
.ciclos-root {
  padding: 28px;
  font-family: "Inter", sans-serif;
  color: #111827;
  background: #f9fafb;
  min-height: 100vh;
}

/* === Cabeçalho e Ciclos seguem o mesmo estilo do original === */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.icon-lg {
  font-size: 2.4rem;
  color: #2563eb;
}
.page-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.page-header p {
  color: #6b7280;
}
.ciclos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}


/* Cards */
.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header h3 {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  text-transform: capitalize;
}
.status.ativo {
  background: #dcfce7;
  color: #166534;
}
.status.inativo {
  background: #fee2e2;
  color: #991b1b;
}
.descricao {
  margin: 10px 0;
  color: #6b7280;
  font-size: 14px;
}
.datas {
  font-size: 13px;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 6px;
}
.card-actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Botões */
.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}
.btn-gradient {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  color: white;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #1d4ed8, #2563eb);
}
.btn-ghost {
  background: #f3f4f6;
  color: #374151;
}
.btn-ghost:hover {
  background: #e5e7eb;
}
.btn.small {
  font-size: 13px;
  padding: 6px 10px;
}
.btn.danger {
  background: #fee2e2;
  color: #b91c1c;
}
.btn.danger:hover {
  background: #fecaca;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}
.modal.glass {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  padding: 22px;
  width: 460px;
  animation: fadeIn 0.3s ease;
}
.modal h3 {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e3a8a;
}
.form-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 13px;
}
.form-group input,
textarea {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}
textarea {
  resize: vertical;
  min-height: 60px;
}
.form-group-inline {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

/* Transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* === Seção Avaliações === */
.avaliacoes-section {
  margin-top: 50px;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.avaliacoes-section h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3a8a;
  font-weight: 700;
}
.avaliacoes-section p {
  color: #6b7280;
  margin-bottom: 18px;
}

.avaliacao-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f9fafb;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.form-group label {
  font-weight: 600;
  font-size: 13px;
  color: #374151;
}
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
}
.avaliacoes-list {
  margin-top: 30px;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
}
.styled-table th,
.styled-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}
.styled-table th {
  background: #f9fafb;
  color: #374151;
  text-align: left;
}
.status {
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: capitalize;
  font-size: 12px;
}
.status.em_progresso {
  background: #dbeafe;
  color: #1d4ed8;
}
.status.concluida {
  background: #dcfce7;
  color: #166534;
}

/* Modal (mantido igual ao original) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  z-index: 1000;
}
.modal.glass {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  padding: 22px;
  width: 460px;
  animation: fadeIn 0.3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>