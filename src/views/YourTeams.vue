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
      <button class="btn btn-primary mt-2">Ver team</button>
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

    return {
      teams,
      redirectToCreateTeam
    };
  }
}
</script>

<style scoped>
/* Tus estilos */
.add-team-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.btn-circle {
  border-radius: 50%;
  padding: 10px 16px;
}
</style>
