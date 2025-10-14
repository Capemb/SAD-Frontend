<template>
  <div class="perfis-root">
    <!-- Header -->
    <div class="page-header">
      <h2><i class="fa-solid fa-shield-halved"></i> Gestão de Perfis & Permissões</h2>
      <p class="subtitle">Defina acessos de colaboradores e gestores de forma intuitiva.</p>
    </div>

    <!-- Perfis -->
    <div class="card">
      <div class="card-header">
        <h3><i class="fa-solid fa-users-gear"></i> Perfis</h3>
      </div>
      <div class="card-body">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Permissões</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in perfis" :key="role.id">
              <td><span class="badge-role">{{ role.name }}</span></td>
              <td>
                <span
                  v-for="p in role.permissions"
                  :key="p.id"
                  class="badge-perm"
                  :class="getPermClass(p.name)"
                  :title="p.name"
                >
                  <i class="fa-solid fa-key"></i> {{ p.name }}
                  <i
                    class="fa-solid fa-xmark remove-icon"
                    @click="removerPermissao(role.id, p.id)"
                  ></i>
                </span>
              </td>
              <td>
                <button class="btn btn-gradient small" @click="abrirModalRole(role)">
                  <i class="fa-solid fa-plus"></i> Adicionar
                  
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Usuários -->
    <div class="card mt-4">
      <div class="card-header">
        <h3><i class="fa-solid fa-user-shield"></i> Usuários (Permissões Extras)</h3>
      </div>
      <div class="card-body">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Perfil</th>
              <th>Permissões Extras</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.nome }}</td>
              <td><span class="badge-role">{{ u.role }}</span></td>
              <td>
                <span
                  v-for="p in u.permissoes"
                  :key="p.id"
                  class="badge-perm"
                  :class="getPermClass(p.name)"
                  :title="p.name"
                >
                  {{ p.name }}
                  <i
                    class="fa-solid fa-xmark remove-icon"
                    @click="removerPermissaoUsuario(u.id, p.id)"
                  ></i>
                </span>
              </td>
              <td>
                <button class="btn btn-primary small" @click="abrirModalUsuario(u)">
                  <i class="fa-solid fa-plus"></i> Adicionar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL PERFIS -->
    <transition name="fade">
      <!-- MODAL PERFIS -->
<div v-if="showModalRole" class="modal-overlay" @click.self="fecharModalRole">
  <div class="modal glass">
    <h3><i class="fa-solid fa-key"></i> Atribuir Permissões ao Perfil</h3>
    <p v-if="roleSelecionado">Selecionando: <b>{{ roleSelecionado.name }}</b></p>
    <p v-else>Nenhum perfil selecionado</p>

    <div class="checkbox-grid">
      <label v-for="p in todasPermissoes" :key="p.id" class="checkbox-item">
        <input type="checkbox" :value="p.name" v-model="permissoesSelecionadas" />
        <span>{{ p.name }}</span>
      </label>
    </div>

    <div class="modal-actions">
      <button class="btn btn-ghost" @click="fecharModalRole">Cancelar</button>
      <button class="btn btn-gradient" @click="atribuirRole">
        <i class="fa-solid fa-check"></i> Salvar
      </button>
    </div>
  </div>
</div>

    </transition>

    <!-- MODAL USUÁRIOS -->
    <transition name="fade">
      <div v-if="showModalUsuario" class="modal-overlay" @click.self="fecharModalUsuario">
        <div class="modal glass">
          <h3><i class="fa-solid fa-key"></i> Atribuir Permissões ao Usuário</h3>
          <p class="modal-subtitle">
            Selecione as permissões para <b>{{ usuarioSelecionado?.nome }}</b>.
          </p>

          <div class="checkbox-grid">
            <label
              v-for="p in todasPermissoes"
              :key="p.id"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :value="p.name"
                v-model="permissoesSelecionadas"
              />
              <span>{{ p.name }}</span>
            </label>
          </div>

          <div class="modal-actions">
            <button class="btn btn-ghost" @click="fecharModalUsuario">Cancelar</button>
            <button class="btn btn-gradient" @click="atribuirUsuario">
              <i class="fa-solid fa-check"></i> Salvar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>



<script setup>
import { ref, onMounted } from "vue"

const perfis = ref([])
const usuarios = ref([])
const todasPermissoes = ref([])

const showModalRole = ref(false)
const showModalUsuario = ref(false)

const permissoesSelecionadas = ref([])
const roleSelecionado = ref(null)
const usuarioSelecionado = ref(null)

const token = localStorage.getItem("auth_token")
const API = "http://localhost:8000/api"

/* -------------------------
   Função utilitária: classes de estilo
   ------------------------- */
const getPermClass = (perm) => {
  if (!perm) return "perm-default"
  const lower = perm.toLowerCase()
  if (lower.includes("ver")) return "perm-view"
  if (lower.includes("criar") || lower.includes("atribuir")) return "perm-action"
  if (lower.includes("editar") || lower.includes("fechar")) return "perm-manage"
  return "perm-default"
}

/* -------------------------
   Carregar dados
   ------------------------- */
const carregarUsuarios = async () => {
  const res = await fetch(`${API}/usuarios/listar-usuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  usuarios.value = await res.json()
}

const carregarPerfis = async () => {
  const res = await fetch(`${API}/perfis`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  perfis.value = await res.json()
}

const carregarPermissoes = async () => {
  const res = await fetch(`${API}/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  todasPermissoes.value = await res.json()
}

/* -------------------------
   Modal perfis
   ------------------------- */
const abrirModalRole = (role) => {
  console.log("Abrindo modal para role:", role)
  roleSelecionado.value = role
  permissoesSelecionadas.value = []
  showModalRole.value = true
  console.log("showModalRole agora:", showModalRole.value)
}
const fecharModalRole = () => {
  roleSelecionado.value = null
  permissoesSelecionadas.value = []
  showModalRole.value = false
}
const atribuirRole = async () => {
  if (!permissoesSelecionadas.value.length) return
  await fetch(`${API}/perfis/${roleSelecionado.value.id}/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ permissions: permissoesSelecionadas.value }),
  })
  await carregarPerfis()
  fecharModalRole()
}

/* -------------------------
   Modal usuários
   ------------------------- */
const abrirModalUsuario = (usuario) => {
  usuarioSelecionado.value = usuario
  permissoesSelecionadas.value = []
  showModalUsuario.value = true
}
const fecharModalUsuario = () => {
  usuarioSelecionado.value = null
  permissoesSelecionadas.value = []
  showModalUsuario.value = false
}
const atribuirUsuario = async () => {
  if (!permissoesSelecionadas.value.length) return
  await fetch(`${API}/usuarios/${usuarioSelecionado.value.id}/permissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ permissions: permissoesSelecionadas.value }),
  })
  await carregarUsuarios()
  fecharModalUsuario()
}

/* -------------------------
   Remover permissões
   ------------------------- */
const removerPermissao = async (roleId, permId) => {
  await fetch(`${API}/perfis/${roleId}/permissions/${permId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await carregarPerfis()
}
const removerPermissaoUsuario = async (userId, permId) => {
  await fetch(`${API}/usuarios/${userId}/permissions/${permId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  await carregarUsuarios()
}

/* -------------------------
   Ciclo de vida
   ------------------------- */
onMounted(() => {
  carregarPerfis()
  carregarUsuarios()
  carregarPermissoes()
})
</script>



<style scoped>

/* Checkboxes em grid para UX melhor */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
}
.checkbox-item {
  background: #f9fafb;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}
.checkbox-item:hover {
  background: #eef2ff;
  border-color: #6366f1;
}
.checkbox-item input {
  accent-color: #2563eb;
}

/* Layout */
.perfis-root { padding: 24px; font-family: 'Inter', sans-serif; }
.page-header h2 { margin-bottom: 6px; font-weight: 700; }
.page-header .subtitle { color: #6b7280; font-size: 14px; }

/* Card */
.card { background: #fff; border-radius: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 20px; }
.card-header { padding: 14px 18px; border-bottom: 1px solid #f0f0f0; font-weight: 600; }
.card-body { padding: 18px; }

/* Table */
.styled-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.styled-table th, .styled-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: left; }
.styled-table tbody tr:hover { background: #f9fafb; transition: 0.2s; }

/* Badges */
.badge-role { background: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 6px; font-weight: 600; }
.badge-perm { padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; margin: 3px; display: inline-flex; align-items: center; transition: 0.2s; }
.badge-perm:hover { transform: scale(1.05); box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
.remove-icon { margin-left: 8px; cursor: pointer; color: #ef4444; }
.perm-view { background: #eef2ff; color: #3730a3; }
.perm-action { background: #ecfdf5; color: #065f46; }
.perm-manage { background: #fef3c7; color: #92400e; }
.perm-default { background: #f3f4f6; color: #374151; }

/* Botões */
.btn { padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: all 0.2s; }
.btn.small { font-size: 13px; padding: 6px 10px; }
.btn-gradient { background: linear-gradient(90deg,#2563eb,#3b82f6); color: white; }
.btn-gradient:hover { background: linear-gradient(90deg,#1d4ed8,#2563eb); transform: translateY(-1px); }
.btn-ghost { background: #f9fafb; color: #374151; }
.btn-ghost:hover { background: #e5e7eb; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999 !important;
}

.modal.glass {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  z-index: 100000 !important;
}


.modal h3 { margin-bottom: 8px; font-weight: 600; }
.modal-subtitle { color: #6b7280; font-size: 13px; margin-bottom: 14px; }
.modal-actions { margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; }

/* Checkboxes */
.checkbox-list { display: flex; flex-direction: column; gap: 10px; max-height: 220px; overflow-y: auto; }
.checkbox-item { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
.checkbox-item input { accent-color: #2563eb; }

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity .3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
