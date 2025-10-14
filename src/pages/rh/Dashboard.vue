<template>
  <div class="dashboard-root" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- SIDEBAR -->
    <sidebar>

    </sidebar>
    <!-- MAIN -->
    <div class="main">
      <!-- TOPBAR -->
      <topbar>

      </topbar>
          
      <!-- CONTENT -->
     
   <main class="content">
        <router-view />
    </main>
    </div>

    <!-- MODAL: Criar/Editar Módulo -->
   
  </div>


</template>

<script setup>
import DashPrincipal from './layout/DashPrincipal.vue'
import Sidebar from './layout/Sidebar.vue'
import Topbar from './layout/Topbar.vue'


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
