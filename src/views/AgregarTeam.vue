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
    <div class="card h-100" :class="{'selected': isSelected(pokemon)}" @click="selectPokemon(pokemon)">
      <img :src="pokemon.imageUrl" class="card-img-top" :alt="pokemon.pokemonName" />
      <div class="card-body">
        <h5 class="card-title">{{ pokemon.pokemonName }}</h5>
        <!-- Mostrar los tipos de Pokémon con colores -->
        <div v-for="type in pokemon.types" :key="type.typeElementId" :class="['badge', typeColor(type.typeElementName)]">
          {{ type.typeElementName }}

        </div>
        <button class="btn btn-primary" @click.stop="addToTeam(pokemon)">Agregar</button>
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
  import Swal from 'sweetalert2';
  
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

    // Ordenar los Pokémon por su ID
    pokemonsWithTypes.sort((a, b) => parseInt(a.pokemonId) - parseInt(b.pokemonId));

    availablePokemons.value = pokemonsWithTypes;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

      const addToTeam = (pokemon: Pokemon) => {
        console.log("Agregando Pokémon con ID:", pokemon.pokemonId);
        if (team.value.length < 6) {
          team.value.push(pokemon);
          availablePokemons.value = availablePokemons.value.filter(p => p.pokemonId !== pokemon.pokemonId);
        } else {
          alert('Tu equipo ya tiene 6 pokémons.');
        }
      };
      const selectPokemon = (pokemon: Pokemon) => {
      addToTeam(pokemon);
      // Aquí puedes añadir más lógica si es necesario
    };

    const isSelected = (pokemon: Pokemon) => {
      return team.value.some(teamPokemon => teamPokemon.pokemonId === pokemon.pokemonId);
    };
      const createTeam = async () => {
        if (team.value.length === 0) {
        Swal.fire({
          title: 'Error!',
          text: 'No puedes crear un equipo vacío.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      if (teamName.value.trim() === '') {
        Swal.fire({
          title: 'Error!',
          text: 'Por favor ingresa un nombre para el equipo.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

  try {
    const newTeam = {
      teamName: teamName.value,
      userId: user.value.sub, // Asumiendo que 'sub' es el ID del usuario en Auth0
      pokemonIds: team.value.map(pokemon => pokemon.pokemonId)
    };

    await axios.post('http://localhost:3030/teams/create-with-pokemons', newTeam);
    Swal.fire({
      title: 'Éxito!',
      text: 'Equipo creado con éxito.',
      icon: 'success',
      confirmButtonText: 'OK'
        });
    router.push({ path: '/menu' });
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
        selectPokemon,
        isSelected,
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
  /* Estilos Generales del Componente */
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

button.btn-success {
  background-color: #28a745; /* Color verde para 'Crear equipo' */
  border-color: #28a745;
  border-radius: 20px;
}

button.btn-danger {
  background-color: #dc3545; /* Color rojo para 'Quitar' */
  border-color: #dc3545;
  border-radius: 20px;
}

button.btn-primary {
  background-color: #007bff; /* Color azul para 'Agregar' */
  border-color: #007bff;
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

.card-img-top {
  width: 100%; /* Imagen ocupa todo el ancho */
  height: 280px; /* Altura fija para hacer la imagen más grande y prominente */
  object-fit: cover; /* Asegura que la imagen cubra el espacio asignado */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
  border: 2px solid #4CAF50; /* Borde para indicar selección */
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
  


  