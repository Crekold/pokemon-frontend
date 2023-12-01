<template>
  <div id="app">
    <nav-bar />
  
      <error />
        <router-view />
      
    
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
/* Estilos para el footer */
footer {
  background-color: #f5f5f5; /* Un color claro que no distraiga */
  color: #3B4CCA; /* Un azul que recuerde al color de los juegos de Pokémon */
  padding: 20px 0;
  font-family: 'Ketchum', 'Arial', sans-serif; /* Ketchum es una fuente similar a la de Pokémon, si no está disponible, se usará Arial */
  border-top: 3px solid #FFCB05; /* Una línea superior amarilla para simbolizar la Pokebola */
}

.footer-logo {
  width: 80px; /* Tamaño del logo */
  height: auto;
  margin-bottom: 10px;
}

p {
  margin: 5px 0; /* Espaciado entre líneas de texto */
}

/* Estilos para el texto 'Powered by' */
footer p {
  font-size: 1rem; /* Tamaño del texto */
  color: #333; /* Color oscuro para el texto */
}

/* Aumentar la fuente y el color para 'Pokémon Team Builder' */
footer strong {
  font-size: 1.2rem;
  color: #FF0000; /* Rojo Pokémon */
}

/* Añadir un efecto hover al logo para un poco de interactividad */
.footer-logo:hover {
  transform: scale(1.1); /* Aumentar ligeramente el tamaño */
  transition: transform 0.2s; /* Suavizar la transición */
}
  
</style>