<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/planning" v-if="isAuthenticated">Planning</router-link>
      <button v-if="isAuthenticated" @click="logout">Logout</button>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    // Utilisation de ref pour l'état d'authentification
    const isAuthenticated = ref(!!localStorage.getItem('token'));

    // Fonction pour déconnecter l'utilisateur
    const logout = () => {
      localStorage.removeItem('token');
      isAuthenticated.value = false;
      // Redirige vers la page d'accueil
      window.location.href = '/'; // Redirection simple
    };

    // Retourner les valeurs à utiliser dans le template
    return {
      isAuthenticated: computed(() => isAuthenticated.value),
      logout,
    };
  },
};
</script>
