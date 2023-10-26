<template>
  <div class="nav-container mb-3 bg-gray-800 text-white">
    <nav class="container mx-auto py-2">
      <!-- Logo -->
      <div class="flex items-center justify-between">
        <a class="flex items-center" href="#">
          <img src="../assets/png-transparent-8-bit-pokemon-pixel-art-poke-ball-others-rectangle-bitcoin-pokemon-removebg-preview (1).png" alt="Mi Logo" class="app-logo mr-2">
          <span class="text-lg font-semibold">Pokemon Team</span>
        </a>

        <!-- Mobile Toggle Button -->
        <button @click="showMenu = !showMenu" class="lg:hidden p-1 rounded bg-gray-700 hover:bg-gray-600">
          &#x2630; <!-- Este es un carácter para el menú "hamburger" -->
        </button>
      </div>

      <!-- Navigation Links -->
      <div :class="{'hidden': !showMenu}" class="mt-4 lg:flex lg:mt-0">
        <ul class="lg:flex lg:gap-6">
          <li>
            <router-link to="/" class="text-white hover:text-gray-400">Home</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/menu" class="text-white hover:text-gray-400">Menú Principal</router-link>
          </li>
        </ul>

        <!-- Right-aligned links -->
        <ul class="lg:flex lg:gap-6 lg:ml-auto mt-4 lg:mt-0">
          <li v-if="!isAuthenticated && !isLoading">
            <button @click.prevent="login" class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white">Login</button>
          </li>

          <li v-if="isAuthenticated" class="relative group">
            <a href="#" class="flex items-center gap-2 cursor-pointer">
              <img :src="user.picture" alt="User's profile picture" class="w-10 h-10 rounded-full">
            </a>
            <div class="absolute right-0 mt-2 w-48 bg-white text-black p-2 rounded shadow-lg group-hover:block hidden">
              <p class="text-black text-sm mb-2">{{ user.name }}</p>
              <router-link to="/profile" class="block text-black hover:bg-gray-200 p-2 rounded">Profile</router-link>
              <a href="#" @click.prevent="logout" class="block text-black hover:bg-gray-200 p-2 rounded">Log out</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export default {
  name: "NavBar",
  setup() {
    const showMenu = ref(false);
    const auth0 = useAuth0();

    return {
      showMenu,
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
    };
  }
};
</script>

<style>
.app-logo {
  width: 50px;
  height: 50px;
}
</style>
