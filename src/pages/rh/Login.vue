<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Sistema de Avaliação de Desempenho</h2>
      <p class="subtitle">Acesse sua conta</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input  v-model="email"  id="email" type="email" placeholder="Digite seu e-mail" required />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input v-model="password" id="password"  type="password" placeholder="Digite sua senha" required />
        </div>

        <button type="submit" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      </form>
    </div>

    <!-- Modal interativa de escolha de perfil -->
    
   
        </div>
 
  

</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiRh } from '@/http/api'


const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false) 


const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const { data } = await apiRh.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('auth_token_rh', data.token)
    localStorage.setItem('rh_user', JSON.stringify(data.user))

    // 🚨 Remove qualquer token do usuário comum (gestor/colaborador)
    localStorage.removeItem('auth_token_usuario')
    localStorage.removeItem('user')

    router.push('/rh/dashboard')
  } catch (error) {
    errorMessage.value = 'Erro ao fazer login. Verifique suas credenciais.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

</script>


<style scoped>
/* login */
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

/* modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  width: 95%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideIn .3s ease-out;
}

.modal-content h3 {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.modal-content p {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.perfil-list {
  display: flex;
  flex-direction: column;
  gap: .8rem;
}

.perfil-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: .75rem;
  padding: .75rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all .2s ease;
}

.perfil-card:hover {
  background: #eef2ff;
  border-color: #c7d2fe;
}

.perfil-info {
  text-align: left;
}

.perfil-info strong {
  display: block;
  font-weight: 600;
  color: #1f2937;
}

.perfil-info small {
  color: #6b7280;
}

.perfil-select {
  font-size: .85rem;
  font-weight: 600;
  color: #4f46e5;
}

@keyframes slideIn {
  from {
    transform: translateY(-15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
