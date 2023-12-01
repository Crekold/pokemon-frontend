<template>
    <div class="container mt-5">
      <div class="row justify-content-center mb-4">
        <div class="col-12 text-center">
          <h1 v-if="teamPokemons.length > 0">Equipo: {{ teamPokemons[0].team.teamName }}</h1>
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

  
      <!-- Sección de Estadísticas del Equipo -->
      <div v-if="Object.keys(teamTypeStats.offensiveEfficiency).length > 0" class="mt-4">
        <div class="text-center">
          <h2>Estadísticas de Tipos del Equipo</h2>
          <button class="btn btn-info" @click="goToTeamStats">Ver stats generales del team</button>
        </div>

        <div class="stats-section">
          <!-- Eficiencia Ofensiva -->
          <div class="stats-block">
            <h3>Eficiencia Ofensiva</h3>
            <div class="stats-content">
              <div v-for="(count, type) in teamTypeStats.offensiveEfficiency" :key="'offensive-' + type" class="stats-item">
                <span class="badge" :class="typeColor(type)">{{ type }}</span>
                <span class="stats-count">{{ count }}</span>
              </div>
            </div>
          </div>

          <!-- Resistencia Defensiva -->
          <div class="stats-block">
            <h3>Resistencia Defensiva</h3>
            <div class="stats-content">
              <div v-for="(count, type) in teamTypeStats.defensiveResistance" :key="'resistance-' + type" class="stats-item">
                <span class="badge" :class="typeColor(type)">{{ type }}</span>
                <span class="stats-count">{{ count }}</span>
              </div>
            </div>
          </div>
          <!-- Debilidades Defensivas -->
          <div class="stats-block">
            <h3>Debilidades Defensivas</h3>
            <div class="stats-content">
              <div v-for="(count, type) in teamTypeStats.defensiveWeakness" :key="'weakness-' + type" class="stats-item">
                <span class="badge" :class="typeColor(type)">{{ type }}</span>
                <span class="stats-count">{{ count }}</span>
              </div>
            </div>
          </div>
          <!-- Inmunidades -->
          <div class="stats-block">
            <h3>Inmunidades</h3>
            <div class="stats-content">
              <div v-for="(count, type) in teamTypeStats.typeImmunity" :key="'immunity-' + type" class="stats-item">
                <span class="badge" :class="typeColor(type)">{{ type }}</span>
                <span class="stats-count">{{ count }}</span>
              </div>
            </div>
          </div>

          <!-- ... similar para las demás estadísticas ... -->
          
        </div>
      </div>
  
      <!-- Botones de acción -->
      <div class="row">
        <div class="col-12 d-flex justify-content-center">
          <!-- Botón para volver a la página anterior -->
        <button class="btn btn-secondary mx-2" @click="goBack">Volver</button>
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
  import { defineComponent, onMounted, ref, reactive } from 'vue';
  import Swal from 'sweetalert2';
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
    const goToTeamStats = () => {
      // Comprobar si hay al menos un Pokémon en el equipo para obtener el teamId
      if (teamPokemons.value.length > 0) {
        const teamId = teamPokemons.value[0].team.teamId;
        router.push({ name: 'teamStats', params: { id: teamId } });
      } else {
        // Mostrar un mensaje de error o manejar esta situación según sea necesario
        console.error('No hay Pokémon en el equipo.');
      }
    };

    const goBack = () => {
      router.go(-1);
    };
    const typeChart = {
  steel: {
    effective: ['ice', 'rock', 'fairy'],
    notEffective: ['steel', 'fire', 'water', 'electric'],
    weak: ['fire', 'fighting', 'ground'],
    immune: ['poison'],
  },
  flying: {
    effective: ['grass', 'fighting', 'bug'],
    notEffective: ['electric', 'rock', 'steel'],
    weak: ['electric', 'ice', 'rock'],
    immune: [],
  },
  water: {
    effective: ['fire', 'ground', 'rock'],
    notEffective: ['water', 'grass', 'dragon'],
    weak: ['electric', 'grass'],
    immune: [],
  },
  ice: {
    effective: ['grass', 'ground', 'flying', 'dragon'],
    notEffective: ['fire', 'water', 'ice', 'steel'],
    weak: ['fire', 'fighting', 'rock', 'steel'],
    immune: [],
  },
  grass: {
    effective: ['water', 'ground', 'rock'],
    notEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
    weak: ['fire', 'ice', 'poison', 'flying', 'bug'],
    immune: [],
  },
  bug: {
    effective: ['grass', 'psychic', 'dark'],
    notEffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
    weak: ['fire', 'flying', 'rock'],
    immune: [],
  },
  electric: {
    effective: ['water', 'flying'],
    notEffective: ['electric', 'grass', 'dragon'],
    weak: ['ground'],
    immune: [],
  },
  normal: {
    effective: [],
    notEffective: ['rock', 'steel'],
    weak: ['fighting'],
    immune: ['ghost'],
  },
  rock: {
    effective: ['fire', 'ice', 'flying', 'bug'],
    notEffective: ['fighting', 'ground', 'steel'],
    weak: ['water', 'grass', 'fighting', 'ground', 'steel'],
    immune: [],
  },
  fighting: {
    effective: ['normal', 'ice', 'rock', 'dark', 'steel'],
    notEffective: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    weak: ['flying', 'psychic', 'fairy'],
    immune: [],
  },
  fairy: {
    effective: ['fighting', 'dragon', 'dark'],
    notEffective: ['fire', 'poison', 'steel'],
    weak: ['poison', 'steel'],
    immune: [],
  },
  psychic: {
    effective: ['fighting', 'poison'],
    notEffective: ['psychic', 'steel'],
    weak: ['bug', 'ghost', 'dark'],
    immune: [],
  },
  poison: {
    effective: ['grass', 'fairy'],
    notEffective: ['poison', 'ground', 'rock', 'ghost'],
    weak: ['ground', 'psychic'],
    immune: [],
  },
  dragon: {
    effective: ['dragon'],
    notEffective: ['steel'],
    weak: ['ice', 'dragon', 'fairy'],
    immune: [],
  },
  // ... (continúa con los tipos restantes si los hay)
};

    const teamTypeStats = reactive({
      offensiveEfficiency: {} as Record<string, number>,
      defensiveResistance: {} as Record<string, number>,
      defensiveWeakness: {} as Record<string, number>,
      typeImmunity: {} as Record<string, number>
    });

    // Definir calculateTeamTypeStats directamente dentro de setup
function calculateTeamTypeStats(teamPokemons: TeamPokemon[]) {
  // Limpia las estadísticas anteriores
  Object.keys(teamTypeStats.offensiveEfficiency).forEach(key => delete teamTypeStats.offensiveEfficiency[key]);
  Object.keys(teamTypeStats.defensiveResistance).forEach(key => delete teamTypeStats.defensiveResistance[key]);
  Object.keys(teamTypeStats.defensiveWeakness).forEach(key => delete teamTypeStats.defensiveWeakness[key]);
  Object.keys(teamTypeStats.typeImmunity).forEach(key => delete teamTypeStats.typeImmunity[key]);

  // Iterar sobre cada Pokémon y sus tipos
  teamPokemons.forEach((teamPokemon) => {
    teamPokemon.pokemon.types?.forEach((typeElement) => {
      // Normalizar el nombre del tipo para coincidir con las claves en typeChart
      const typeName = typeElement.typeElementName.toLowerCase();
      const typeData = typeChart[typeName];

      if (!typeData) {
        console.error(`Tipo no encontrado en typeChart: ${typeName}`);
        return; // Saltar este tipo si no se encuentra
      }

        // Actualizar eficiencia ofensiva
        typeData.effective.forEach((effectiveAgainst) => {
        teamTypeStats.offensiveEfficiency[effectiveAgainst] = 
          (teamTypeStats.offensiveEfficiency[effectiveAgainst] || 0) + 1;
      });

      // Actualizar resistencia defensiva
      typeData.notEffective.forEach((notEffectiveAgainst) => {
        teamTypeStats.defensiveResistance[notEffectiveAgainst] = 
          (teamTypeStats.defensiveResistance[notEffectiveAgainst] || 0) + 1;
      });

      // Actualizar debilidades defensivas
      typeData.weak.forEach((weakAgainst) => {
        teamTypeStats.defensiveWeakness[weakAgainst] = 
          (teamTypeStats.defensiveWeakness[weakAgainst] || 0) + 1;
      });

      // Actualizar inmunidades
      typeData.immune.forEach((immuneAgainst) => {
        teamTypeStats.typeImmunity[immuneAgainst] = 
          (teamTypeStats.typeImmunity[immuneAgainst] || 0) + 1;
      });
    });
  });
}




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
    // Paso 1: Incluir la tabla de relaciones de tipos (debes completarla basándote en la tabla que proporcionaste)

    onMounted(async () => {
      await fetchTeamPokemonsWithTypes();
      // Asegúrate de asignar un nuevo objeto a la referencia para que Vue pueda rastrearlo reactivamente
      teamTypeStats.value = calculateTeamTypeStats(teamPokemons.value);
    });
        
      return {
        teamPokemons, // Ahora puedes acceder a esta referencia en tu plantilla
        isLoading,
        goToPokemonStats,
        goBack,
        teamTypeStats,
        goToTeamStats,  
      };
    },
    methods: {
  typeColor(typeName) {
    // Asegúrate de que el nombre de tipo se convierte a minúsculas para la comparación
    const className = `type-${typeName.toLowerCase()}`;
    return className;
  },
  async deleteTeam() {
  const result = await Swal.fire({
    title: '¿Estás seguro de que quieres eliminar este equipo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar!',
    cancelButtonText: 'No, cancelar!'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3030/teams/${this.id}`);
      Swal.fire('Eliminado!', 'Equipo eliminado con éxito.', 'success');
      this.$router.push({ name: 'yourteam' });
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
      Swal.fire('Error!', 'Ocurrió un error al intentar eliminar el equipo.', 'error');
    }
  }
},
  //metodo para ir a la vista de modificar equipo
  viewTeam() {
    this.$router.push({ name: 'modifyTeam', params: { id: this.id } });
  },
  
},
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
/* Estilos para el componente */
.container {
  background-color: #f8f9fa; /* Fondo claro */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #ffcb05; /* Color amarillo Pokémon */
  text-shadow: 1px 1px 2px #000; /* Sombra para mejorar la legibilidad */
}

/* Estilos para las tarjetas de Pokémon */
.card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.card-body {
  text-align: center;
}

/* Estilos para los botones */
.btn {
  border-radius: 5px;
  margin: 5px;
  transition: all 0.3s ease;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-warning {
  background-color: #ffc107;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-info {
  background-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
}

/* Estilos para los badges de tipos */
.badge {
  margin: 2px;
  border-radius: 10px;
  padding: 5px 10px;
}

/* Colores específicos para cada tipo de Pokémon */
.type-normal { background-color: #A8A77A; }
/* ... otros estilos de tipos ... */
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
.stats-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.stats-block {
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  width: 45%; /* Ajusta según la disposición */
}

.stats-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}

.stats-item {
  margin: 5px;
  display: flex;
  align-items: center;
}

.stats-count {
  margin-left: 10px;
}

  </style>
  