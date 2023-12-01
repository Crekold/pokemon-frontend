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
  background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2a2ada8d-131b-4ff0-adae-b28c3e2a584f/dagz9wr-ba9c6d79-6e33-4983-8d70-914d2fe4fdf5.png/v1/fill/w_1024,h_577,q_80,strp/legendary_birds__pokemon__minimalist_wallpaper_by_slezzy7_dagz9wr-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc3IiwicGF0aCI6IlwvZlwvMmEyYWRhOGQtMTMxYi00ZmYwLWFkYWUtYjI4YzNlMmE1ODRmXC9kYWd6OXdyLWJhOWM2ZDc5LTZlMzMtNDk4My04ZDcwLTkxNGQyZmU0ZmRmNS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.2vdPn2oY_M8Qxa9C3zJ0lywVVkJDLdUJE19IoejdsAA'); /* Añade un fondo temático */
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
