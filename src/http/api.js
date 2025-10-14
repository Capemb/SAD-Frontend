import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // ✨ Corrigido
  withCredentials: true,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}


export async function csrfCookie() {
  //sem o sanctum, apenas com apitoken

}

export async function login(credentials) {
  return api.post('/login', credentials) // ou o caminho que definiste
}

export async function logout() {
  return api.post('/logout')
}

export async function fetchUser() {
  return axios.get('http://localhost:8000/api/user', { withCredentials: true })
}


export default api
