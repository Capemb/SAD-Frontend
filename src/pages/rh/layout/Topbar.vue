<template>
   <header class="topbar">
        <div class="left">
          <button class="menu-toggle" @click="toggleSidebar"><i class="fa-solid fa-bars"></i></button>
          <h1 class="page-title">Painel do RH</h1>
        </div>

        <div class="right">
          <div class="search">
            <input v-model="search" placeholder="Pesquisar colaborador, módulo ou ciclo..." />
            <button @click="onSearch" :aria-label="'Pesquisar'"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>

          <button class="icon-btn" title="Notificações">
            <i class="fa-regular fa-bell"></i>
            <span v-if="notificationsCount" class="notif-dot">{{ notificationsCount }}</span>
          </button>

           <div class="user" @click="toggleUserMenu" ref="userBtn">
            <img class="avatar" :src="user.avatar" alt="avatar" />
            <div class="user-info" v-if="!isCollapsed">
              <div class="name">{{ user.name }}</div>
              <div class="role">RH</div>
            </div>
            <transition name="fade">
              <div v-if="userMenuOpen" class="user-menu" @click.stop>
                <button @click="goToProfile"><i class="fa-regular fa-user"></i> Meu Perfil</button>
                <button @click="openChangeProfileModal"><i class="fa-solid fa-sync"></i> Mudar Perfil</button>
                <button @click="handleLogout" class="danger"><i class="fa-solid fa-right-from-bracket"></i> Sair</button>
              </div>
            </transition>
          </div>
        </div>
      </header>

</template>

<script setup>

import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/http/api' // ajusta o caminho conforme necessário


// import api from '@/http/api' // descomenta e usa quando ligares ao backend

const router = useRouter()
const isCollapsed = ref(false)
const routeName = ref('dashboard')
const search = ref('')
const notificationsCount = ref(3)
const userMenuOpen = ref(false)
const user = reactive({
  name: '',
  
})

const menu = [
  { name: 'dashboard', label: 'Dashboard', route: 'home', icon: 'fa-solid fa-house' },
  { name: 'colaboradores', label: 'Colaboradores', route: 'colaboradores', icon: 'fa-solid fa-users' },
  { name: 'perfis', label: 'Perfis e Permissões', route: 'perfis', icon: 'fa-solid fa-id-badge' },
  { name: 'modulos', label: 'Módulos de Avaliação', route: 'modulos', icon: 'fa-solid fa-layer-group' },
  { name: 'criterios', label: 'Critérios', route: 'criterios', icon: 'fa-solid fa-list-check' },
  { name: 'ciclos', label: 'Ciclos de Avaliação', route: 'ciclos', icon: 'fa-solid fa-calendar-days' },
  { name: 'relatorios', label: 'Relatórios', route: 'relatorios', icon: 'fa-solid fa-chart-line' },
  { name: 'config', label: 'Configurações', route: 'config', icon: 'fa-solid fa-gear' }
]

/* KPI placeholders */
const kpis = [
  { title: 'Avaliações Ativas', value: '4', sub: 'Em andamento', icon: 'fa-solid fa-spinner' },
  { title: 'Colaboradores', value: '1.248', sub: 'Total', icon: 'fa-solid fa-users' },
  { title: 'Completo (%)', value: '72%', sub: 'Último ciclo', icon: 'fa-solid fa-circle-check' },
  { title: 'Relatórios', value: '23', sub: 'Gerados', icon: 'fa-solid fa-file-lines' },
]

/* Modules + cycles + reports (fake data for UI) */
const modulesLoading = ref(false)
const modules = ref([

])

const cycles = ref([
  { id: 1, nome: 'Semestral 2025', inicio: '01/06/2025', fim: '30/06/2025', status: 'in-progress', statusLabel: 'Em andamento', progress: 72 },
  { id: 2, nome: 'Anual 2024', inicio: '01/01/2024', fim: '31/01/2024', status: 'completed', statusLabel: 'Concluído', progress: 100 },
])

const reports = ref([
  { id: 1, title: 'Relatório Semestral RH', date: '01 set 2025' },
  { id: 2, title: 'Matriz de Competências', date: '20 jul 2025' },
])

const chartData = ref([40, 70, 60, 85, 45]) // simples placeholder

/* Module modal */
const showModuleModal = ref(false)
const editingModule = ref(null)
const moduleForm = reactive({ id: null, nome: '', descricao: '' })
const moduleLoading = ref(false)

/* Actions */
const toggleSidebar = () => (isCollapsed.value = !isCollapsed.value)
const navigate = (item) => {
  routeName.value = item.route
  // exemplo: podes usar router.push dependendo da tua estrutura real
  // router.push({ name: item.route })
}
const onSearch = () => {
  // conecta com API de busca se necessário
  alert(`Pesquisar: ${search.value}`)
}
const toggleUserMenu = () => (userMenuOpen.value = !userMenuOpen.value)
const goToProfile = () => {
  // router.push({ name: 'perfil' })
  alert('Ir para meu perfil (implementa navegação)')
}
const openChangeProfileModal = () => {
  alert('Abrir modal de mudar perfil (já tens no fluxo de perfis)')
}

const handleLogout = async () => {
  const token = localStorage.getItem('auth_token') // pega antes de apagar

  try {
    await api.post('auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (error) {
    console.error('Erro ao fazer logout no servidor.', error)
  } finally {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('perfilAtivo')
    
    router.push({ name: 'rh-login' })
  }
}


/* module modal actions */
const openCreateModule = () => {
  editingModule.value = null
  moduleForm.id = null
  moduleForm.nome = ''
  moduleForm.descricao = ''
  showModuleModal.value = true
}
const editModule = (m) => {
  editingModule.value = m.id
  moduleForm.id = m.id
  moduleForm.nome = m.nome
  moduleForm.descricao = m.descricao
  showModuleModal.value = true
}

const closeModuleModal = () => (showModuleModal.value = false)

const saveModule = async () => {
  if (!moduleForm.nome.trim()) return
  moduleLoading.value = true
   try{

     const token = localStorage.getItem('auth_token') // se usas token separado pra RH
     const response = await fetch('http://localhost:8000/api/modulos-avaliacao/criar-modulo', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`},
        body: JSON.stringify({
         nome: moduleForm.nome,
         descricao: moduleForm.descricao}
        ),
      })
      if(!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      modules.value.unshift(data)
      showModuleModal.value = false

   } catch (error) {
     console.error('Erro ao salvar módulo:', error)
     alert('Erro ao salvar módulo. Tente novamente.')
   } finally {
     moduleLoading.value = false
   }
  
    
}

const removeModule = async (m) => {
  if (!confirm(`Remover módulo "${m.nome}"?`)) return
  // se tiver backend: await api.delete(`/modulos-avaliacao/${m.id}`)
  modules.value = modules.value.filter((x) => x.id !== m.id)
}

const openCreateCycle = () => alert('Abrir modal de criação de ciclo (implementar)')
const openReports = () => alert('Abrir painel de relatórios')
const viewCycle = (c) => alert(`Ver ciclo: ${c.nome}`)
const downloadReport = (r) => alert(`Download: ${r.title}`)

/* fake load to simulate API */
onMounted(async () => {
 try {
    const token = localStorage.getItem('auth_token') // se usas token separado pra RH
    const { data } = await api.get('auth/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user.name = data.name  // <-- pega o name da tabela users
    // se a tabela tiver foto ou outro campo, pode atualizar avatar também
    // user.avatar = data.avatar_url || '...'
  } catch (error) {
    console.error('Erro ao buscar usuário logado', error)
  }
})


onMounted(async () => {
  modulesLoading.value = true
  try {
    const token = localStorage.getItem('auth_token') // o mesmo token que usas para criar
    const response = await fetch('http://localhost:8000/api/modulos-avaliacao/listar-modulo', {
      headers: {
          credentials: 'include',
           headers: { 'Accept': 'application/json' },
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    const data = await response.json()
    // Aqui assumes que o controller retorna um array de módulos:
    // ex: [{ id: 1, nome: '...', descricao: '...' }]
    modules.value = data
  } catch (err) {
    console.error('Erro ao buscar módulos', err)
    alert('Erro ao buscar módulos')
  } finally {
    modulesLoading.value = false
  }
})



</script>

<style scoped>
:root { --bg: #f5f7fb; --card: #ffffff; --muted: #6b7280; --blue-600: #2563eb; --blue-500: #3b82f6; --danger: #ef4444; font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

.dashboard-root { display: flex; min-height: 100vh; background: var(--bg); color: #0f172a; }

/* SIDEBAR */
.sidebar { width: 260px; background: linear-gradient(180deg,#ffffff,#f8fbff); border-right: 1px solid #e6e9ef; padding: 18px; display:flex; flex-direction:column; transition: width .22s; box-shadow: 0 2px 10px rgba(22,28,45,0.03); }
.sidebar-collapsed .sidebar { width: 72px; }
.brand { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; gap:8px; }
.logo { font-weight:800; font-size:18px; color:var(--blue-600); background: transparent; padding:8px 12px; border-radius:10px; }
.collapse-btn { border: none; background: none; cursor: pointer; color:var(--muted); font-size:14px; }

/* menu */
.menu { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
.menu-item { display:flex; align-items:center; gap:12px; padding:10px; border-radius:10px; color:#0f172a; text-decoration:none; cursor:pointer; transition: background .12s, transform .08s; }
.menu-item i { width:20px; text-align:center; color:var(--blue-600); }
.menu-item .label { font-weight:600; }
.menu-item .badge { background:#eef6ff; color:var(--blue-600); padding:2px 8px; border-radius:999px; font-size:12px; margin-left:auto; }
.menu-item:hover { background:#f3f7ff; transform: translateY(-1px); }
.menu-item.active { background: linear-gradient(90deg,#f0f6ff,#f7fbff); box-shadow: 0 6px 18px rgba(59,130,246,0.06); }

/* sidebar footer */
.sidebar-footer { margin-top:auto; font-size:12px; color:var(--muted); text-align:center; }

/* MAIN */
.main { flex:1; display:flex; flex-direction:column; min-height:100vh; }
.topbar { display:flex; justify-content:space-between; align-items:center; padding:14px 22px; background:transparent; border-bottom:1px solid rgba(15,23,42,0.03); position:sticky; top:0; z-index:30; }
.topbar .left { display:flex; gap:12px; align-items:center; }
.menu-toggle { display:inline-flex; border:none; background:none; font-size:16px; cursor:pointer; }
.page-title { font-size:16px; font-weight:700; color:#0f172a; margin:0; }
.topbar .right { display:flex; align-items:center; gap:12px; }

/* search */
.search { display:flex; align-items:center; gap:8px; background:#fff; padding:6px; border-radius:8px; border:1px solid #e6e9ef; }
.search input { border:none; outline:none; width:260px; padding:6px; font-size:14px; }
.search button { border:none; background:none; cursor:pointer; color:var(--muted); }

/* icons & user */
.icon-btn { position:relative; border:none; background:none; cursor:pointer; padding:8px; border-radius:8px; color:var(--muted); }
.notif-dot { position:absolute; top:4px; right:4px; background:var(--danger); color:white; border-radius:999px; font-size:11px; padding:2px 6px; }

.user { display:flex; align-items:center; gap:10px; cursor:pointer; position:relative; }
.avatar { width:40px; height:40px; border-radius:999px; object-fit:cover; border:2px solid rgba(15,23,42,0.06); }
.user-info { display:flex; flex-direction:column; }
.name { font-weight:600; }
.role { color:var(--muted); font-size:12px; }

/* user menu */
.user-menu { position:absolute; right:0; top:56px; width:220px; background:var(--card); border:1px solid #e9eef7; border-radius:10px; box-shadow:0 10px 30px rgba(17,24,39,0.06); padding:8px; display:flex; flex-direction:column; gap:6px; }
.user-menu button { display:flex; gap:8px; align-items:center; background:none; border:none; padding:8px; border-radius:8px; cursor:pointer; text-align:left; }
.user-menu button.danger { color:var(--danger); }

/* content */
.content { padding:22px; }

/* KPI grid */
.kpis { margin-bottom:18px; }
.kpi-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap:12px; }
.kpi-card { background:var(--card); border-radius:12px; padding:14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 6px 18px rgba(17,24,39,0.03); transform-origin:left top; animation: fadeUp .35s ease both; }
.kpi-title { color:var(--muted); font-size:13px; }
.kpi-value { font-size:20px; font-weight:700; margin-top:6px; }
.kpi-sub { color:var(--muted); font-size:12px; margin-top:6px; }
.kpi-icon i { font-size:22px; color:var(--blue-600); }

/* layout */
.grid-2 { display:grid; grid-template-columns: 1fr 420px; gap:12px; margin-bottom:12px; }
.grid-3 { display:grid; grid-template-columns: 1fr 1fr 360px; gap:12px; }

/* cards */
.card { background:var(--card); border-radius:12px; padding:12px; box-shadow:0 8px 24px rgba(17,24,39,0.04); }
.card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.card-body { max-height:360px; overflow:auto; }

/* modules */
.modules-list { display:flex; flex-direction:column; gap:8px; padding:6px 0; }
.module-item { display:flex; justify-content:space-between; align-items:center; padding:10px; border-radius:10px; border:1px solid #eef4ff; background:linear-gradient(180deg,#ffffff,#fbfdff); }
.module-actions .icon { background:none; border:none; padding:8px; border-radius:8px; cursor:pointer; color:var(--muted); }
.module-actions .icon.danger { color:var(--danger); }

/* table */
.cycles-table { width:100%; border-collapse:collapse; font-size:14px; }
.cycles-table th { text-align:left; color:var(--muted); font-weight:600; padding:8px 6px; }
.cycles-table td { padding:8px 6px; border-top:1px solid #f3f6ff; vertical-align:middle; }
.status { padding:6px 8px; border-radius:999px; font-weight:600; font-size:12px; }
.status.in-progress { background:#fff7ed; color:#b45309; }
.status.completed { background:#eefaf1; color:#065f46; }

/* progress */
.progress { height:8px; background:#eef6ff; border-radius:999px; overflow:hidden; width:110px; display:inline-block; margin-right:8px; }
.bar { height:100%; background:linear-gradient(90deg,var(--blue-500),var(--blue-600)); }

/* quick actions */
.quick-grid { display:flex; gap:8px; flex-direction:column; }
.quick-btn { display:flex; gap:10px; align-items:center; border:none; padding:10px; border-radius:8px; cursor:pointer; background:#f8fafc; }

/* chart */
.chart-placeholder { height:110px; display:flex; align-items:center; justify-content:center; }
.chart-svg rect { fill: #cfe3ff; rx:4; transition: all .3s ease; }

/* reports */
.reports-list { display:flex; flex-direction:column; gap:8px; }

/* ===== Modal Base ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: left; /* mais profissional que center */
  animation: fadeIn 0.3s ease-out;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.modal-content h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

/* ===== Form ===== */
.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-content label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #374151; /* cinza elegante */
}

.modal-content input,
.modal-content textarea {
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.modal-content input:focus,
.modal-content textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.3);
  outline: none;
}

/* ===== Botões ===== */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, transform 0.2s ease;
}


.btn.primary {
  background: #007bff;
  color: white;
}

.btn.primary:hover {
  background: #2563eb;
  transform: scale(1.02);
}

.btn.ghost {
  background: #f3f4f6;
  color: #374151;
}

.btn.ghost:hover {
  background: #e5e7eb;
  transform: scale(1.02);
}






.modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:12px; }
.btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; background:#eef6ff; color:var(--blue-600); font-weight:600; }
.btn.primary { background:var(--blue-600); color:white; }
.btn.ghost { background: transparent; border:1px solid #e6e9ef; }

/* small utils */
.muted { color:var(--muted); }
.small { font-size:12px; }

/* animations */
@keyframes fadeUp { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.stagger-enter-from { opacity: 0; transform: translateY(6px); }
.stagger-enter-active { transition: all .35s cubic-bezier(.2,.8,.2,1); }
.modal-fade-enter-active { animation: fadeIn .18s ease-out both; }
@keyframes fadeIn { from { opacity:0; transform: scale(.98) translateY(6px); } to { opacity:1; transform: scale(1) translateY(0); } }

/* responsiveness */
@media (max-width: 980px) {
  .grid-2 { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr; }
  .sidebar { position:fixed; z-index:80; left:0; top:0; bottom:0; transform:translateX(0); }
  .sidebar-collapsed .sidebar { transform: translateX(-100%); }
}
</style>