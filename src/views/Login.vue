<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
</template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      // Définir les propriétés réactives
      const username = ref('');
      const password = ref('');
  
      // Fonction de connexion
      const login = async () => {
        try {
          const response = await axios.post('http://localhost:5000/login', {
            username: username.value,
            password: password.value,
          });
          localStorage.setItem('token', response.data.token);
          // Redirige vers la page 'planning'
          window.location.href = '/'; // Redirection simple
        } catch (error) {
          alert('Login failed');
        }
      };
  
      // Retourner les valeurs et méthodes à utiliser dans le template
      return {
        username,
        password,
        login,
      };
    },
  };
  </script>
  