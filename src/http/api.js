// src/http/api.js
import axios from 'axios'

// ==========================
// 🔹 CONFIGURAÇÕES GERAIS
// ==========================
const BASE_URL = 'http://localhost:8000/api'

// ==========================
// 🔹 API DO RH
// ==========================
export const apiRh = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})


// Interceptor: adiciona token do RH automaticamente
apiRh.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token_rh')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ==========================
// 🔹 API DOS GESTORES E COLABORADORES
// ==========================
export const apiUsuario = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor: adiciona token do usuário (gestor/colaborador)
apiUsuario.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token_usuario')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ==========================
// 🔹 FUNÇÕES AUXILIARES
// ==========================

// ----- RH -----
export async function loginRh(credentials) {
  return apiRh.post('/auth/login', credentials)
}

export async function logoutRh() {
  return apiRh.post('/auth/logout')
}

// ----- Gestores / Colaboradores -----
export async function loginUsuario(credentials) {
  return apiUsuario.post('/usuarios/login-colaborador', credentials)
}

export async function logoutUsuario() {
  return apiUsuario.post('/usuarios/logout')
}

export default { apiRh, apiUsuario, loginRh, loginUsuario, logoutRh, logoutUsuario }
