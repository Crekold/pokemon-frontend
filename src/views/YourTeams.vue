<template>
  <div class="container mt-5">
    <h1 class="mb-4">Teams Creados</h1>
    
    <div v-for="team in teams" :key="team.teamId" class="mb-4">
      <h3>{{ team.teamName }}</h3>
      <div class="d-flex flex-row flex-nowrap overflow-auto">
        <PokemonCard 
          v-for="pokemon in team.pokemons" 
          :key="pokemon.pokemonId" 
          :pokemon="pokemon" 
          class="flex-shrink-0" 
          style="min-width: 150px;" />
      </div>
      <button class="btn btn-primary mt-2" @click="viewTeam(team.teamId)">Ver team</button>
    </div>

    <div class="add-team-button">
    <button class="btn btn-success btn-circle btn-lg" @click="redirectToCreateTeam">+</button>
  </div>
  </div>
</template>


<script lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import PokemonCard from '../components/YourTeam/PokemonCard.vue';

interface Pokemon {
  pokemonId: string;
  pokemonName: string;
  imageUrl: string;
}

interface Team {
  teamId: string;
  teamName: string;
  pokemons: Pokemon[];
}

export default {
  components: {
    PokemonCard
  },
  
  setup() {
    const teams = ref<Team[]>([]);
      const { user } = useAuth0();
      const router = useRouter();
      const redirectToCreateTeam = () => {
      router.push('/agregarTeam');
    };
    

    onMounted(async () => {
      try {
        const userId = user.value.sub; // Ajusta según tu lógica de autenticación
        const teamsResponse = await axios.get(`http://localhost:3030/teams/user/${userId}`);
        const teamsData = teamsResponse.data.result;

        for (const team of teamsData) {
          const pokemonsResponse = await axios.get(`http://localhost:3030/team-pokemon/team/${team.teamId}`);
          // Asignar directamente los Pokémon al equipo
          team.pokemons = pokemonsResponse.data.result.map(tp => tp.pokemon);
        }

        teams.value = teamsData;
      } catch (error) {
        console.error(error);
        // Manejar el error
      }
    });
    const viewTeam = (teamId) => {
  router.push({ name: 'selectedTeam', params: { id: teamId } });
};

    return {
      teams,
      redirectToCreateTeam,
      viewTeam
    };
  }
}
</script>

<style scoped>
/* Estilos para el componente 'Teams Creados' */
/* Estilos para el componente 'Teams Creados' */
.container {
  background-image: url('ruta/a/imagen/pokemon/fondo.jpg'); /* Añade un fondo temático */
  background-size: cover;
  color: #333;
}

h1 {
  color: #ffcb05; /* Color amarillo Pokémon */
  text-shadow: 1px 1px 2px #000; /* Sombra para mejorar la legibilidad */
}

h3 {
  color: #007bff;
}

.card {
  background-color: rgba(255, 255, 255, 0.9); /* Fondo semi-transparente */
  margin: 10px 0;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.add-team-button .btn-circle {
  background-color: #ff0000; /* Rojo Pokémon */
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.add-team-button .btn-circle:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transform: scale(1.1);
}


</style>
