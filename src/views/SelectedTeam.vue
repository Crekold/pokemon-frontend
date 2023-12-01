<template>
    <div class="container mt-5">
      <div class="row justify-content-center mb-4">
        <div class="col-12 text-center">
          <h1 v-if="teamPokemons.length > 0">Equipo #{{ teamPokemons[0].team.teamName }}</h1>
          <h1 v-else>Cargando...</h1>
        </div>
      </div>
  
      <div class="row">
  <!-- Iterar a través de los Pokémon del equipo -->
  <div class="col-sm-4 mb-3" v-for="teamPokemon in teamPokemons" :key="teamPokemon.teamPokemonId">
  <div class="card" @click="goToPokemonStats(teamPokemon.pokemon.pokemonId)">

    <div class="card">
      <img :src="teamPokemon.pokemon.imageUrl" class="card-img-top" alt="Imagen de Pokémon">
      <div class="card-body text-center">
        <h5 class="card-title">{{ teamPokemon.pokemon.pokemonName }}</h5>
        <div class="my-2">
          <!-- Mostrar los tipos de Pokémon -->
<div v-for="type in teamPokemon.pokemon.types" :key="type.typeElementId" class="my-2">
  <span :class="['badge', typeColor(type.typeElementName)]">
    {{ type.typeElementName }}

  </span>
</div>

    
        </div>
      </div>
    </div>
  </div>
</div>
      </div>

  
      <!-- Leyenda de eficiencia (aquí puedes agregar tu propia lógica de leyenda) -->
      <div class="row">
        <div class="col-12 mb-3">
          <div class="d-flex justify-content-center">
            <!-- Ejemplo de leyenda de tipos -->
            <div class="mx-2">
              <span class="badge bg-primary">Agua</span>
              <span>Resistencia a tipos</span>
            </div>
            <div class="mx-2">
              <span class="badge bg-danger">Fuego</span>
              <span>Eficiencia a tipos</span>
            </div>
            <!-- ... -->
          </div>
        </div>
      </div>
  
      <!-- Botones de acción -->
      <div class="row">
        <div class="col-12 d-flex justify-content-center">
          <!-- Botón para volver a la página anterior -->
        <button class="btn btn-secondary mx-2" @click="">Volver</button>
        <!-- Botón para eliminar el equipo -->
        <button class="btn btn-danger mx-2" @click="deleteTeam">Eliminar team</button>
        <!-- Botón para modificar el equipo -->
        <button class="btn btn-warning mx-2" @click="viewTeam">Modificar team</button>
        <!-- Botón para sugerencias -->
        <button class="btn btn-info mx-2">Sugerencias</button>
        </div>
      </div>
    </div>
  </template>
  
  
  <script lang="ts">
  import axios from 'axios';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router'; 
  interface TypeElement{
    typeElementId: number;
    typeElementName: string;
  }
  
  interface Pokemon {
  pokemonId: string;
  pokemonName: string;
  imageUrl: string;
  types?: TypeElement[]; // Añadir los tipos como una propiedad opcional
}

  interface TeamPokemon {
    teamPokemonId: number;
    pokemon: Pokemon;
  }
  
  export default defineComponent({
    props: {
      id: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const teamPokemons = ref<TeamPokemon[]>([]);
      const isLoading = ref(true);
      const router = useRouter();
      const goToPokemonStats = (pokemonId) => {
  router.push({ name: 'pokemonStats', params: { id: pokemonId } });
    };
      const fetchTeamPokemonsWithTypes = async () => {
      try {
        const teamPokemonResponse = await axios.get(`http://localhost:3030/team-pokemon/team/${props.id}`);
        const typeResponse = await axios.get('http://localhost:3030/type-elements');
        const pokemonTypes = await axios.get('http://localhost:3030/pokemon-type');

        const typeElements = typeResponse.data.result;

        teamPokemons.value = teamPokemonResponse.data.result.map((teamPokemon: TeamPokemon) => {
          teamPokemon.pokemon.types = pokemonTypes.data.result
            .filter(pt => pt.pokemon.pokemonId === teamPokemon.pokemon.pokemonId)
            .map(pt => typeElements.find(te => te.typeElementId === pt.typeElement.typeElementId));
          return teamPokemon;
        });
      } catch (error) {
        console.error('Error fetching team pokemons with types:', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      // Reemplaza con el ID del equipo que deseas cargar
      fetchTeamPokemonsWithTypes();
    });
    
        
      return {
        teamPokemons, // Ahora puedes acceder a esta referencia en tu plantilla
        isLoading,
        goToPokemonStats
      };
    },
    methods: {
  typeColor(typeName) {
    // Asegúrate de que el nombre de tipo se convierte a minúsculas para la comparación
    const className = `type-${typeName.toLowerCase()}`;
    return className;
  },
  async deleteTeam() {
    if (!confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3030/teams/${this.id}`);
      alert('Equipo eliminado con éxito.');
      // Redirige al usuario después de eliminar el equipo
      // (asumiendo que estás usando Vue Router)
      this.$router.push({ name: 'yourteam' });
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
      alert('Ocurrió un error al intentar eliminar el equipo.');
    }
  },
  //metodo para ir a la vista de modificar equipo
  viewTeam() {
    this.$router.push({ name: 'modifyTeam', params: { id: this.id } });
  }
  
},
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */

  
.type-normal { background-color: #A8A77A; }
.type-fire { background-color: #EE8130; }
.type-water { background-color: #6390F0; }
.type-electric { background-color: #F7D02C; }
.type-grass { background-color: #7AC74C; }
.type-ice { background-color: #96D9D6; }
.type-fighting { background-color: #C22E28; }
.type-poison { background-color: #A33EA1; }
.type-ground { background-color: #E2BF65; }
.type-flying { background-color: #A98FF3; }
.type-psychic { background-color: #F95587; }
.type-bug { background-color: #A6B91A; }
.type-rock { background-color: #B6A136; }
.type-ghost { background-color: #735797; }
.type-dragon { background-color: #6F35FC; }
.type-dark { background-color: #705746; }
.type-steel { background-color: #B7B7CE; }
.type-fairy { background-color: #D685AD; }

.badge {
  color: white;
  margin-right: .5em;
  padding: .25em .4em;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25rem;
}
  </style>
  