<template>
    <div class="container my-4">
      <!-- Campo para mostrar y editar el nombre del equipo -->
      <div class="row mb-3">
        <div class="col-12">
          <input type="text" class="form-control mb-3" placeholder="Nombre del equipo" v-model="teamName"/>
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
  import swal from 'sweetalert2';
  import { useAuth0 } from '@auth0/auth0-vue';
  
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
      const { user } = useAuth0();
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
            swal.fire({
                title: '¡Equipo lleno!',
                text: 'No puedes tener más de 6 Pokémon en tu equipo.',
                icon: 'error',
            });
        }
      };

  
     
      const updateTeam = async () => {
  try {
    const updatedTeam = {
      teamName: teamName.value,
      userId: user.value?.sub, // Asegúrate de obtener el ID del usuario correctamente
      pokemonIds: team.value.map(pokemon => pokemon.pokemonId)
    };

    await axios.put(`http://localhost:3030/teams/${props.id}/update-with-pokemons`, updatedTeam);

    swal.fire({
      title: '¡Equipo actualizado!',
      text: 'Tu equipo ha sido actualizado con éxito.',
      icon: 'success',
    });
    router.go(-1); // Reemplaza con tu ruta de redirección deseada
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

    // Ordenar los Pokémon por su ID
    pokemonsWithTypes.sort((a, b) => parseInt(a.pokemonId) - parseInt(b.pokemonId));

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
        searchQuery,
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
  /* Estilos para el componente */
/* Estilos Generales del Componente */
.container {
  background-color: #ffffff; /* Fondo blanco para una apariencia limpia */
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

/* Estilo del Encabezado y Botones */
.card-header {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dedede;
}

h2 {
  color: #ffcb05; /* Color amarillo Pokémon */
  text-shadow: 1px 1px 2px #000;
}

button.btn-success, button.btn-warning {
  border: none;
  border-radius: 20px;
  transition: background-color 0.2s;
}

button.btn-success:hover {
  background-color: #218838;
}

button.btn-warning:hover {
  background-color: #d39e00;
}

button.btn-danger {
  border-radius: 20px;
}

/* Estilos para las Tarjetas de Pokémon */
.card {
  margin: 10px 0;
  border-radius: 15px;
  overflow: hidden; /* Asegura que los elementos internos no sobresalgan */
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

/* Asegúrate de que las imágenes de los Pokémon resalten */
.card-img-top {
  width: 100%; /* Ajusta la imagen para llenar el ancho */
  height: 280px; /* Altura fija para que las imágenes sean grandes */
  object-fit: cover; /* Asegura que la imagen cubra el espacio asignado */
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

/* Estilos para los Badges de Tipos de Pokémon */
.badge {
  display: inline-block;
  margin: 5px;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  text-transform: capitalize; /* Capitaliza los tipos de Pokémon */
}

/* Colores específicos para cada tipo de Pokémon */
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
/* ... otros estilos de tipos ... */
/* Media queries para ajustes responsivos */
@media (max-width: 768px) {
  .col-md-1-5 {
    width: 100%;
  }
}

/* Estilos para la sección de búsqueda */
.form-control {
  border-radius: 20px;
  border: 1px solid #ced4da;
  padding: .375rem .75rem;
}

/* Estilo para la sección de Pokémon seleccionados */
.selected {
  border: 2px solid #4CAF50; /* Un borde para destacar que está seleccionado */
}

/* Estilo para los botones dentro de las tarjetas */
.card .btn {
  margin-top: auto; /* Empuja el botón hacia la parte inferior de la tarjeta */
  border-radius: 20px;
}

/* Estilos para cuando la tarjeta está seleccionada */
.selected {
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5); /* Sombra verde alrededor de la tarjeta seleccionada */
}

/* Animación de selección para las tarjetas */
@keyframes selected-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.selected {
  animation: selected-animation 0.5s ease;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Esto empujará el botón hacia abajo */
}
    </style>
    
  
  
    

  