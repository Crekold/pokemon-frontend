<template>
  <div class="bg-gray-900 text-gray-300 w-64 min-h-screen p-4">
    <!-- Header -->
    <h1 class="text-2xl font-semibold mb-4 text-white">Admin One</h1>

    <!-- Menu Items -->
    <ul>
      <li class="mb-2 hover:bg-gray-700 px-2 py-1 rounded"><router-link to="/" class="block text-gray-300 hover:text-white">Home</router-link></li>
      <li v-if="isAuthenticated" class="mb-2 hover:bg-gray-700 px-2 py-1 rounded"><router-link to="/menu" class="block text-gray-300 hover:text-white">Menú Principal</router-link></li>
    </ul>

    <!-- Auth0 Login -->
    <ul class="lg:flex lg:gap-6 lg:ml-auto mt-4 lg:mt-0">
      <li v-if="!isAuthenticated && !isLoading">
        <button @click.prevent="login" class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">Login</button>
      </li>

      <li v-if="isAuthenticated" class="relative group">
    <a href="#" class="flex items-center gap-2 cursor-pointer">
        <img :src="user.picture" alt="User's profile picture" class="w-10 h-10 rounded-full">
    </a>
    <div class="absolute right-0 mt-2 w-48 bg-white text-black p-2 rounded shadow-lg group-hover:flex flex-col hidden z-50">

        <p class="text-black text-sm mb-2">{{ user.name }}</p>
        <router-link to="/profile" class="block text-black hover:bg-gray-200 p-2 rounded">Profile</router-link>
        <a href="#" @click.prevent="logout" class="block text-black hover:bg-gray-200 p-2 rounded">Log out</a>
    </div>
</li>

    </ul>
  </div>
</template>

<script lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  name: "NavBar",
  setup() {
    const auth0 = useAuth0();
    
    return {
      isAuthenticated: auth0.isAuthenticated,
      isLoading: auth0.isLoading,
      user: auth0.user,
      login() {
        auth0.loginWithRedirect();
      },
      logout() {
        auth0.logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      }
    }
  }
};
</script>

<style>
/* Puedes agregar estilos adicionales aquí si lo necesitas */
</style>
