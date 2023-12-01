<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="row">
        <div class="col-12 text-center mb-4">
          <h1>Estadísticas de {{ pokemonName }}</h1>
          <button class="btn btn-secondary mb-3" @click="goBack">Volver</button>
        </div>
        <div class="col-12 col-md-6">
          <!-- Mostrar las estadísticas del Pokémon -->
    
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title">{{ pokemonName }}</h5>
              <!-- Aquí van las estadísticas del Pokémon -->
              <div class="my-2">
                <div class="stat">
                  <span class="stat-label">HP:</span>
                  <span class="stat-value">{{ pokemonStats.hp }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Ataque:</span>
                  <span class="stat-value">{{ pokemonStats.attack }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Defensa:</span>
                  <span class="stat-value">{{ pokemonStats.defense }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Ataque Especial:</span>
                  <span class="stat-value">{{ pokemonStats.specialAttack }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Defensa Especial:</span>
                  <span class="stat-value">{{ pokemonStats.specialDefense }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <!-- Mostrar la imagen del Pokémon -->
          <div class="card shadow">
            <div class="card-body">
              <img :src="pokemonImage" alt="Imagen de {{ pokemonName }}" class="img-fluid">
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import axios from 'axios';
  
  export default defineComponent({
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        pokemonName: '',
        pokemonImage: '',
        pokemonStats: {
          hp: 0,
          attack: 0,
          defense: 0,
          specialAttack: 0,
          specialDefense: 0,
        },
      };
    },
    methods: {
      async fetchPokemonStats() {
  try {
    const response = await axios.get(`http://localhost:3030/pokemon-stats/${this.id}`);
    const data = response.data.result;
            
    console.log(data); // Supongo que la respuesta contiene un solo elemento
    this.pokemonName = data.pokemon.pokemonName;
    this.pokemonImage = data.pokemon.imageUrl;
    this.pokemonStats = {
      hp: data.hp,
      attack: data.attack,
      defense: data.defense,
      specialAttack: data.specialAttack,
      specialDefense: data.specialDefense,
    };
  } catch (error) {
    console.error(error);
  }
},
goBack() {
      this.$router.go(-1);
    }
    },
    mounted() {
      this.fetchPokemonStats();
    },
  });
  </script>
  
  <style scoped>
 /* Estilos generales del componente */
.container {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* Estilo para el título y botón de volver */
h1 {
  color: #ffcb05; /* Color amarillo Pokémon */
  text-shadow: 2px 2px 4px #000;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #545b62;
}

/* Estilos para las tarjetas que muestran las estadísticas y la imagen */
.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

/* Estilo para las estadísticas del Pokémon */
.stat-label {
  font-weight: bold;
  color: #303030; /* Color oscuro para los textos de las etiquetas */
}

.stat-value {
  color: #007bff; /* Color azul para resaltar el valor de la estadística */
  font-weight: bold;
}

/* Estilo para la imagen del Pokémon */
.card-body img {
  width: 100%; /* La imagen ocupa todo el ancho de la tarjeta */
  height: auto; /* La altura es automática */
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}

  </style>

  