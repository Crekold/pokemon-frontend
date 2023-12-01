<template>
  <div id="app" class="d-flex flex-column h-100">
    <nav-bar />
    <div class="container flex-grow-1">
      <error />
      <div class="mt-5">
        <router-view />
      </div>
    </div>
    <footer class="bg-light text-center p-3">
      <!-- Modificación del logo en el footer. Puedes usar un logo personalizado de Pokémon aquí. -->
      <img src="././assets/images/png-transparent-8-bit-pokemon-pixel-art-poke-ball-others-rectangle-bitcoin-pokemon-removebg-preview (1).png" alt="Pokémon Team Builder Logo" class="footer-logo app-logo">
      <p>
        Powered by
        <strong>Pokémon Team Builder</strong>
      </p>
      <p>
        Gotta Build 'Em All!
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import NavBar from "./components/Home/NavBar.vue";
import Error from "./components/Error.vue";
import axios from 'axios';
import { onMounted } from 'vue';

export default {
  components: {
    NavBar,
    Error
  },
  setup() {
    const checkAndImportPokemons = async () => {
  try {
    // Verificar si ya existen pokémons
    const response = await axios.get('http://localhost:3030/pokemons');
    if (response.data && response.data.result && response.data.result.length === 0) {
      // Si no hay pokémons, importar de la PokeAPI
      const startId = 1;
      const endId = 151;
      await axios.get(`http://localhost:3030/pokemons/import-range?startId=${startId}&endId=${endId}`);
      console.log('Pokémons importados con éxito.');
    } else {
      console.log('Los pokémons ya están en la base de datos.');
    }
  } catch (error) {
    console.error('Error al importar pokémons:', error);
  }
};


    onMounted(() => {
      checkAndImportPokemons();
    });
  }
};
</script>


<style>
.footer-logo {
  width: 100px;
  height: auto;
  margin-bottom: 10px;
}
</style>