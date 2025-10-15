<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Sistema de Avaliação de Desempenho</h2>
      <p class="subtitle">Acesse sua conta</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" type="email" placeholder="Digite seu e-mail" required />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input id="password" v-model="password" type="password" placeholder="Digite sua senha" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { apiUsuario } from '@/http/api'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const router = useRouter()

const handleLogin = async () => {
  error.value = null
  loading.value = true

  try {
    const { data } = await apiUsuario.post('/usuarios/login-colaborador', {
      email: email.value,
      password: password.value
    })

    // ✅ Guarda token e dados do usuário corretamente
    localStorage.setItem('auth_token_usuario', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // ✅ Redireciona conforme o role
    if (data.user.role === 'gestor') {
      router.push('/dashboard-gestor')
    } else if (data.user.role === 'colaborador') {
      router.push('/dashboard-colaborador')
    } else {
      router.push('/login') // fallback
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Falha ao entrar, tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
/* estilos do login que já tinhas */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  height: 100vh;
}
.login-box {
  background-color: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  font-family: 'Inter', sans-serif;
}
.login-box h2 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.form-group {
  text-align: left;
  margin-bottom: 1rem;
}
.form-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #374151;
}
.form-group input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}
.form-group input:focus {
  outline: none;
  border-color: #2563eb;
}
button {
  width: 100%;
  padding: 0.7rem;
  background-color: #2563eb;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #1d4ed8;
}
button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
.error-message {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.8rem;
}
</style>
