<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="Username" />
        <input v-model="password" type="password" placeholder="Password" />
        <button type="submit">Register</button>
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
  
      // Fonction d'enregistrement
      const register = async () => {
        try {
          await axios.post('http://localhost:5000/register', {
            username: username.value,
            password: password.value,
          });
          alert('Registration successful');
          // Redirige vers la page de connexion
          window.location.href = '/login'; // Redirection simple
        } catch (error) {
          alert('Registration failed');
        }
      };
  
      // Retourner les valeurs et méthodes à utiliser dans le template
      return {
        username,
        password,
        register,
      };
    },
  };
  </script>
  