// routes.js
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import Home from './pages/Home.vue'
import Avaliacoes from './pages/Avaliacoes.vue'
import Perfil from './pages/Perfil.vue'
import Login from './pages/Login.vue'
import Login from './rh/Login.vue'

const routes = [
  // Rota para o login
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  
  // Rotas protegidas com o layout padrão
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'avaliacoes', name: 'avaliacoes', component: Avaliacoes },
      { path: 'perfil', name: 'perfil', component: Perfil },
    ],
    meta: { requiresAuth: true }, // ✨ Sinaliza que esta rota e seus filhos precisam de autenticação
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✨ Guardião de Navegação (Navigation Guard)
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('auth_token') // Exemplo de verificação

  // Caso 1: Se o usuário já está autenticado e tenta ir para o login, redireciona para a home
  if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  // Caso 2: Se a rota precisa de autenticação (meta: requiresAuth: true) e o usuário NÃO está autenticado
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  // Caso 3: Permite a navegação para qualquer outra rota
  } else {
    next()
  }
})

export default router