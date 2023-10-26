<template>
    <div>
      <h1>Teams Creados</h1>
      
      <!-- Podrías utilizar un v-for si estás manejando un array de equipos -->
      <div class="team-container">
        <h3>Nombre del team 1</h3>
        <div class="pokemon-cards">
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
        </div>
        <button>Ver team</button>
      </div>
      
      <div class="team-container">
        <h3>Nombre del team 2</h3>
        <div class="pokemon-cards">
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
        </div>
        <button>Ver team</button>
      </div>
      
      <!-- ... (otros equipos) ... -->
  
      <div class="add-team-button">
        <!-- Botón para agregar un nuevo equipo -->
        <button>+</button>
      </div>
    </div>
  </template>
  
  <script>
  import PokemonCard from '../components/YourTeam/PokemonCard.vue';

  
  export default {
    components: {
      PokemonCard
    }
  }
  </script>
  
  <style scoped>
  /* Estilos básicos para este componente, puedes modificar/adaptar a tus necesidades */
  .team-container {
    margin-bottom: 20px;
  }
  
  .pokemon-cards {
    display: flex;
    gap: 10px;
  }
  
  .add-team-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  </style>
  