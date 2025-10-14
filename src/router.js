// routes.js
import { createRouter, createWebHistory } from 'vue-router'


import Login from './pages/Login.vue'
import RHLogin from './pages/rh/Login.vue'
import RHDashboard from './pages/rh/Dashboard.vue'
import Criterios from './pages/rh/Criterios.vue'
import DashPrincipal from './pages/rh/layout/DashPrincipal.vue'
import Ciclos from './pages/rh/Ciclos.vue'
import Colaboradores from './pages/rh/Colaboradores.vue'
import Config from './pages/rh/Config.vue'
import Modulos from './pages/rh/Modulos.vue'
import Perfis from './pages/rh/Perfis.vue'
import Relatorios from './pages/rh/Relatorios.vue'
import DashboardColaborador from '@/pages/DashboardColaborador/Index.vue'
import DashboardGestor from '@/pages/DashboardGestor/Index.vue'






const routes = [
  // Rota para o login
  {
    path: '/login',
    name: 'login',
    component: Login,
  },

  {
    path: '/dashboard-colaborador',
    name: 'dashboard-colaborador',
    component: DashboardColaborador,
    meta: { requiresAuth: true, role: 'colaborador' }
  },

  {
     path: '/dashboard-gestor',
    name: 'dashboard-gestor',
    component: DashboardGestor,
    meta: { requiresAuth: true, role: 'gestor' }
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },


  { path: '/rh/login', name: 'rh-login', component: RHLogin },

  /*{
    path: '/rh/dashboard',
    name: 'rh-dashboard',
    component: RHDashboard,
    meta: { requiresRHAuth: true }, // opcional, se quiseres autenticação diferente
  },
  {
    path: '/rh/criterios',
    name: 'criterios',
    component: Criterios,
    meta: { requiresRHAuth: true }, // opcional, se quiseres autenticação diferente
  },*/
    {
     path: '/rh/dashboard',
    component: RHDashboard,
    children: [
      { path: 'dash-principal', name: 'dash-principal', component: DashPrincipal },
      { path: 'criterios', name: 'criterios', component: Criterios },
      { path: 'colaboradores', name: 'colaboradores', component: Colaboradores },
      { path: 'perfis', name: 'perfis', component: Perfis },
      { path: 'modulos', name: 'modulos', component: Modulos },
      { path: 'ciclos', name: 'ciclos', component: Ciclos },
      { path: 'relatorios', name: 'relatorios', component: Relatorios },
      
      { path: 'config', name: 'config', component: Config },
    
    ] // ✨ Sinaliza que esta rota e seus filhos precisam de autenticação
  },
  // Rotas protegidas com o layout padrão
 
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✨ Guardião de Navegação (Navigation Guard)






export default router