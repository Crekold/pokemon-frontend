<template>
    <div class="container my-4">
      <!-- Campo para mostrar y editar el nombre del equipo -->
      <div class="row mb-3">
        <div class="col-12">
          <input type="text" class="form-control mb-3" placeholder="Nombre del equipo" v-model="teamName"/>
        </div>
      </div>
  
      <!-- Sección de Pokémon seleccionados -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h2>Tu selección:</h2>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-1-5" v-for="pokemon in team" :key="pokemon.pokemonId">
                  <div class="card">
                    <img :src="pokemon.imageUrl" class="card-img-top" :alt="pokemon.pokemonName" />
                    <div class="card-body">
                      <h5 class="card-title">{{ pokemon.pokemonName }}</h5>
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
  
      <!-- Botón para actualizar el equipo -->
      <div class="row mb-3">
        <div class="col-12 text-center">
          <button class="btn btn-warning" @click="updateTeam">Actualizar equipo</button>
        </div>
      </div>
  
      <!-- Sección de Pokémon disponibles -->
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
      <!-- ... (Similar a tu componente existente para agregar Pokémon al equipo) ... -->
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  interface TypeElement {
    typeElementId: number;
    typeElementName: string;
  }
  
  interface Pokemon {
    pokemonId: string;
    pokemonName: string;
    imageUrl: string;
    types?: TypeElement[];
  }
  
  export default defineComponent({
    name: 'PokemonTeamEditor',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const isLoading = ref(true);
      const team = ref<Pokemon[]>([]);
      const availablePokemons = ref<Pokemon[]>([]);
      const teamName = ref('');
      const searchQuery = ref('');
      const router = useRouter();
  
      onMounted(async () => {
        await fetchTeam();
        await fetchAvailablePokemons();
      });
  
      const fetchTeam = async () => {
  try {
    // Obtener los detalles generales del equipo
    const teamResponse = await axios.get(`http://localhost:3030/teams/${props.id}`);
    teamName.value = teamResponse.data.result.teamName;
    
    // Obtener los Pokémon asociados con el equipo
    const teamPokemonResponse = await axios.get(`http://localhost:3030/team-pokemon/team/${props.id}`);
    
    // Obtener los tipos de Pokémon
    const typeResponse = await axios.get('http://localhost:3030/type-elements');
    const pokemonTypes = await axios.get('http://localhost:3030/pokemon-type');
    const typeElements = typeResponse.data.result;

    // Asignar los Pokémon al equipo incluyendo los tipos
    team.value = teamPokemonResponse.data.result.map((teamPokemon) => {
      teamPokemon.pokemon.types = pokemonTypes.data.result
        .filter(pt => pt.pokemon.pokemonId === teamPokemon.pokemon.pokemonId)
        .map(pt => typeElements.find(te => te.typeElementId === pt.typeElement.typeElementId));
      return {
        pokemonId: teamPokemon.pokemon.pokemonId,
        pokemonName: teamPokemon.pokemon.pokemonName,
        imageUrl: teamPokemon.pokemon.imageUrl,
        types: teamPokemon.pokemon.types, // Incluir la propiedad 'types'
      };
    });
  } catch (error) {
    console.error('Error fetching team:', error);
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

  
     
      const updateTeam = async () => {
  try {
    // Actualizar los detalles generales del equipo
    await axios.put(`http://localhost:3030/teams/${props.id}`, {
      teamName: teamName.value,
      // ... otros datos que necesites enviar para la actualización
    });

    // Obtener los Pokémon actuales del equipo
    const currentTeamResponse = await axios.get(`http://localhost:3030/team-pokemon/team/${props.id}`);
    const currentTeam = currentTeamResponse.data.result.map(pokemon => pokemon.pokemonId);

    // Lógica para actualizar los Pokémon del equipo
    for (let pokemon of team.value) {
      // Verificar si el Pokémon ya está en el equipo
      if (!currentTeam.includes(pokemon.pokemonId)) {
        // Si el Pokémon no está en el equipo, agregarlo
        await axios.put(`http://localhost:3030/team-pokemon/${pokemon.pokemonId}`, {
          pokemon: {
            pokemonId: pokemon.pokemonId,
          },
          team: {
            teamId: props.id,
          },
        });
      }
    }

    alert('Equipo actualizado con éxito.');
    router.push('/tu-ruta-de-redireccion'); // Redirigir a donde corresponda
  } catch (error) {
    console.error('Error updating team:', error);
    alert('Error al actualizar el equipo.');
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

const filteredPokemons = computed(() => {
  // Primero, obtén los IDs de los Pokémon que ya están en el equipo
  const teamPokemonIds = new Set(team.value.map(pokemon => pokemon.pokemonId));

  // Luego, devuelve aquellos Pokémon que no estén en el equipo
  return availablePokemons.value
    .filter(pokemon => !teamPokemonIds.has(pokemon.pokemonId))
    .filter(pokemon =>
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
      // ... restante de tus métodos y propiedades computadas
  
      return {
        isLoading,
        team,
        teamName,
        updateTeam,
        addToTeam,
        removeFromTeam,
        filteredPokemons,
        // ... resto de tus métodos y propiedades computadas
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
    
  
  
    

  