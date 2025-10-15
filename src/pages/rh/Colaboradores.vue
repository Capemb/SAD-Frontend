<template>
  <div class="usuarios-root">
    <div class="card">
      <div class="card-header">
        <h3>Gestores e Colaboradores</h3>
        <button class="btn primary" @click="openCreateUser">+ Novo Usuário</button>
      </div>

      <div class="card-body">
        <template v-if="loading">
          <p>Carregando usuários...</p>
        </template>

        <table v-else class="usuarios-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Role</th>
              <th>Gestor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.nome }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.telefone }}</td>
              <td>{{ u.cargo }}</td>
              <td>{{ u.departamento }}</td>
              <td>
                <span :class="['badge', u.role === 'gestor' ? 'badge-gestor' : 'badge-colaborador']">
                  {{ u.role }}
                </span>
              </td>
              <td>{{ u.gestor?.nome || '-' }}</td>
              <td>
                <button class="icon" @click="editUser(u)">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="icon danger" @click="removeUser(u)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Criar/Editar Usuário -->
    <transition name="modal-fade">
      <div
        v-if="showUserModal"
        class="modal-overlay"
        @click.self="closeUserModal"
      >
        <div class="modal-content">
          <h3>{{ editingUser ? "Editar Usuário" : "Novo Usuário" }}</h3>

          <form @submit.prevent="saveUser">
            <label>Nome</label>
            <input v-model="userForm.nome" required />

            <label>Email</label>
            <input v-model="userForm.email" type="email" required />

            <label>Telefone</label>
            <input v-model="userForm.telefone" />

            <label>Cargo</label>
            <input v-model="userForm.cargo" />

            <label>Departamento</label>
            <input v-model="userForm.departamento" />

            <label>Role</label>
            <select v-model="userForm.role" required>
              <option value="gestor">Gestor</option>
              <option value="colaborador">Colaborador</option>
            </select>
            <label v-if="userForm.role === 'colaborador'">Gestor</label>
            <select v-if="userForm.role === 'colaborador'" v-model="userForm.gestor_id">
              <option value="">-- Selecionar Gestor --</option>
              <option v-for="g in gestores" :key="g.id" :value="g.id">
                {{ g.nome }}
              </option>
            </select>

            <label>Password</label>
            <input v-model="userForm.password" type="password" :required="!editingUser" />

            <div class="modal-actions">
              <button type="button" class="btn ghost" @click="closeUserModal">Cancelar</button>
              <button type="submit" class="btn primary" :disabled="loading">
                {{ loading ? "Aguarde..." : (editingUser ? "Atualizar" : "Criar") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"

const usuarios = ref([])
const gestores = ref([])
const loading = ref(false)

const showUserModal = ref(false)
const editingUser = ref(null)
const userForm = reactive({
  id: null,
  nome: "",
  email: "",
  telefone: "",
  cargo: "",
  departamento: "",
  role: "colaborador",
  gestor_id: "",
  password: ""
})

/* ===== API Helpers ===== */
const API_URL = "http://localhost:8000/api/usuarios"
const token = localStorage.getItem("auth_token_rh")

const fetchUsuarios = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/listar-usuarios`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    })
    const data = await res.json()
    usuarios.value = data
    gestores.value = data.filter((u) => u.role === "gestor")
  } catch (err) {
    console.error("Erro ao carregar usuários:", err)
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  loading.value = true

  // Se for criação e não tiver senha → bloquear
  if (!editingUser.value && !userForm.password) {
    alert("Defina uma senha para o novo usuário")
    loading.value = false // 🔥 não esquece de resetar
    return
  }

  try {
    const method = editingUser.value ? "PUT" : "POST"
    const url = editingUser.value
      ? `${API_URL}/atualizar-usuario/${userForm.id}`
      : `${API_URL}/criar-usuarios`

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      body: JSON.stringify(userForm)
    })

    if (!res.ok) {
      if (res.status === 422) {
        const errData = await res.json()
        console.warn("Validação falhou:", errData.errors)
        alert("Erro de validação: " + JSON.stringify(errData.errors))
      }
      throw new Error("Erro HTTP: " + res.status)
    }

    await fetchUsuarios()
    closeUserModal()
  } catch (err) {
    console.error("Erro ao salvar usuário:", err)
    alert("Erro ao salvar usuário")
  } finally {
    loading.value = false
  }
}


const removeUser = async (u) => {
  if (!confirm(`Remover usuário ${u.nome}?`)) return
  try {
    const res = await fetch(`${API_URL}/eliminar-usuario/${u.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    })
    if (!res.ok) throw new Error("Erro HTTP: " + res.status)
    usuarios.value = usuarios.value.filter((x) => x.id !== u.id)
  } catch (err) {
    console.error("Erro ao remover usuário:", err)
    alert("Erro ao remover usuário")
  }
}

/* ===== Form helpers ===== */
const openCreateUser = () => {
  editingUser.value = null
  Object.assign(userForm, {
    id: null,
    nome: "",
    email: "",
    telefone: "",
    cargo: "",
    departamento: "",
    role: "colaborador",
    gestor_id: "",
    password: ""
  })
  showUserModal.value = true
}

const editUser = (u) => {
  editingUser.value = u.id
  Object.assign(userForm, {
    id: u.id,
    nome: u.nome,
    email: u.email,
    telefone: u.telefone,
    cargo: u.cargo,
    departamento: u.departamento,
    role: u.role,
    gestor_id: u.gestor_id,
     // vazio porque não alteramos se não for trocado
  })
  showUserModal.value = true
}

const closeUserModal = () => (showUserModal.value = false)

/* Initial load */
onMounted(fetchUsuarios)
</script>

<style scoped>
.usuarios-root { padding: 22px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }

.usuarios-table { width: 100%; border-collapse: collapse; }
.usuarios-table th, .usuarios-table td { padding: 8px; border-bottom: 1px solid #eee; text-align: left; }

.badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-gestor { background: #e0f2fe; color: #0369a1; }
.badge-colaborador { background: #fef9c3; color: #92400e; }

.icon { background: none; border: none; cursor: pointer; margin: 0 4px; }
.icon.danger { color: red; }

.modal-overlay { position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.4); }
.modal-content { background: #fff; padding: 20px; border-radius: 10px; max-width: 400px; width: 90%; }
.modal-content form { display: flex; flex-direction: column; gap: 10px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

.btn { padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
.btn.primary { background: #2563eb; color: white; }
.btn.ghost { background: #f3f4f6; color: #374151; }
</style>
