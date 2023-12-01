<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="row">
        <div class="col-12 text-center mb-4">
          <h1>Estadísticas de {{ pokemonName }}</h1>
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
}
    },
    mounted() {
      this.fetchPokemonStats();
    },
  });
  </script>
  
  <style scoped>
  /* Estilos personalizados para la vista de estadísticas del Pokémon */
  .stat {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .stat-label {
    font-weight: bold;
  }
  
  .stat-value {
    color: #007bff; /* Color azul para resaltar el valor de la estadística */
  }
  </style>

  