<template>
  <div class="container my-4">
    <!-- Campo para ingresar el nombre del equipo -->
    <div class="row mb-3">
      <div class="col-12">
        <input type="text" class="form-control mb-3" placeholder="Nombre del equipo" v-model="teamName" />
      </div>
    </div>
    <!-- Sección de búsqueda -->
    <div class="row mb-3">
      <div class="col-12">
        <input type="text" class="form-control" placeholder="Buscar Pokémon..." v-model="searchQuery" />
      </div>
    </div>
    
    <!-- Sección de Pokémon seleccionados -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h2>Tu selección:</h2>
            <button class="btn btn-success" @click="createTeam" :disabled="team.length === 0">Crear equipo</button>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-1-5" v-for="pokemon in team" :key="pokemon.pokemonId">
                <div class="card">
                  <img :src="pokemon.imageUrl" class="card-img-top" :alt="pokemon.pokemonName" />
                  <div class="card-body">
                    <h5 class="card-title">{{ pokemon.pokemonName }}</h5>
                    <!-- Mostrar los tipos de Pokémon con colores -->
                    <div v-for="type in pokemon.types" :key="type.typeElementId" :class="['badge', typeColor(type.typeElementName)]">
                      {{ type.typeElementName }}
                    </div>
                    
                    <button class="btn btn-danger" @click="removeFromTeam(pokemon)">Quitar</button>
                  
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Pokémon disponibles -->
    <div class="row">
      <div class="col-12">
        <h2>Disponibles:</h2>
      </div>
      <!-- Indicador de carga para Pokémon disponibles -->
      <div v-if="isLoading" class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden"></span>
        </div>
      </div>

      <div class="col-sm-6 col-md-4 col-lg-3" v-for="pokemon in filteredPokemons" :key="pokemon.pokemonId">
        <div class="card h-100">
          <img :src="pokemon.imageUrl" class="card-img-top" :alt="pokemon.pokemonName" />
          <div class="card-body">
            <h5 class="card-title">{{ pokemon.pokemonName }}</h5>
            <!-- Mostrar los tipos de Pokémon con colores -->
            <div v-for="type in pokemon.types" :key="type.typeElementId" :class="['badge', typeColor(type.typeElementName)]">
              {{ type.typeElementName }}
            
              </div>
            <button class="btn btn-primary" @click="addToTeam(pokemon)">Agregar</button>
          
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
 


  
<script lang="ts">
  import { defineComponent, ref, onMounted, computed, } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useAuth0 } from '@auth0/auth0-vue';
  
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

  export default defineComponent({
    name: 'PokemonTeamSelector',
    setup() {
      const isLoading = ref(true);
      const team = ref<Pokemon[]>([]);
      const availablePokemons = ref<Pokemon[]>([]);
      const searchQuery = ref('');
      const teamName = ref('');
      const router = useRouter();
      const { user } = useAuth0();

      const filteredPokemons = computed(() => {
      if (!searchQuery.value) {
        return availablePokemons.value;
      }
      return availablePokemons.value.filter((pokemon) =>
        pokemon.pokemonName.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
  
    const fetchAvailablePokemons = async () => {
      try {
        // Asumiendo que tienes un endpoint así para obtener los pokémons
        const pokemonResponse = await axios.get('http://localhost:3030/pokemons');
        const typeResponse = await axios.get('http://localhost:3030/type-elements');
        const pokemonTypes = await axios.get('http://localhost:3030/pokemon-type');

        // Mapear los pokémons con sus tipos
        const pokemonsWithTypes = pokemonResponse.data.result.map((pokemon: Pokemon) => {
          pokemon.types = pokemonTypes.data.result
            .filter((pt: any) => pt.pokemon.pokemonId === pokemon.pokemonId)
            .map((pt: any) => pt.typeElement);
          return pokemon;
        });

        availablePokemons.value = pokemonsWithTypes;
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };


      const addToTeam = (pokemon: Pokemon) => {
        if (team.value.length < 6) {
          team.value.push(pokemon);
          availablePokemons.value = availablePokemons.value.filter(p => p.pokemonId !== pokemon.pokemonId);
        } else {
          alert('Tu equipo ya tiene 6 pokémons.');
        }
      };

      const createTeam = async () => {
      if (team.value.length === 0) {
        alert('No puedes crear un equipo vacío.');
        return;
      }
      if (teamName.value.trim() === '') {
        alert('Por favor ingresa un nombre para el equipo.');
        return;
      }

      try {
        const userId = user.value.sub; // 'sub' es el ID del usuario en Auth0
        const nickname = user.value.nickname;
        const newTeam = {
          teamName: teamName.value,
          user: {
            userId, // Aquí usas el ID de Auth0
            nickname // Aquí usas el nickname de Auth0// Asegúrate de actualizar esto con el ID de usuario correspondiente
          }
        };

        await axios.post('http://localhost:3030/teams', newTeam);
        
        // Obtener el último equipo creado por el usuario
         // Actualizar con el ID de usuario correcto
        const lastTeamResponse = await axios.get(`http://localhost:3030/teams/last/${userId}`);
        if (lastTeamResponse.data && lastTeamResponse.data.result && lastTeamResponse.data.result.teamId) {
          const teamId = lastTeamResponse.data.result.teamId;

          // Asociar cada Pokémon seleccionado con el equipo creado
          for (const pokemon of team.value) {
            const newTeamPokemon = {
              pokemon: {
                pokemonId: pokemon.pokemonId 
              },
              team: {
                teamId: teamId 
              }
            };

            await axios.post('http://localhost:3030/team-pokemon', newTeamPokemon);
          }

          alert('Equipo creado con éxito.');
          router.push({ path: '/menu' });
        } else {
          alert('Error al obtener el ID del equipo.');
        }
      } catch (error) {
        console.error('Hubo un error al crear el equipo:', error);
        alert('Error al crear el equipo. Por favor, inténtalo de nuevo.');
      }
    };

const removeFromTeam = (pokemon: Pokemon) => {
  // Añade el Pokémon de nuevo a la lista de disponibles
  availablePokemons.value.push(pokemon);
  // Ordena los Pokémon disponibles por ID para mantener el orden original
  availablePokemons.value.sort((a, b) => parseInt(a.pokemonId) - parseInt(b.pokemonId));
  // Filtra el Pokémon quitado de la lista de seleccionados
  team.value = team.value.filter(p => p.pokemonId !== pokemon.pokemonId);
};

  
      onMounted(() => {
        fetchAvailablePokemons();
      });
  
      return {
        team,
        availablePokemons,
        addToTeam,
        isLoading,
        searchQuery,
        filteredPokemons,   
        removeFromTeam,
        teamName,
        createTeam,
      };
      
    },
    methods: {
    typeColor(type: string) {
      return `type-${type}`;
    },
    
  },
  });
  </script>
  
  <style scoped>
.card {
  display: flex;
  flex-direction: column;
}

.card-body {
  flex-grow: 1;
}

/* Asegúrate de que las imágenes de los Pokémon se ajusten bien dentro de las tarjetas */
.card-img-top {
  width: 100%; /* o podría ser auto dependiendo de tus necesidades */
  height: auto;
}

@media (max-width: 768px) {
  .col-md-1-5 {
    width: 50%; /* O ajusta según tu diseño específico */
  }
}

@media (max-width: 576px) {
  .col-md-1-5 {
    width: 100%; /* O ajusta según tu diseño específico */
  }
}

/* Estilos adicionales para el botón si son necesarios */

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
  


  