 <template>
     <div class="container my-4">
    <div class="row mb-3">
      <h2 class="col-12">Tu selección:</h2>
      <!-- Aquí se mostrarán los Pokémon seleccionados -->
      <div class="col-md-1-5" v-for="pokemon in team" :key="pokemon.id">
        <div class="card">
          <img :src="pokemon.image" :alt="pokemon.name" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">{{ pokemon.name }}</h5>
            <p class="card-text">
              <!-- Muestra los tipos del Pokémon seleccionado -->
              <span v-for="type in pokemon.type" :key="type" class="badge bg-secondary">{{ type }}</span>
            </p>
            <button class="btn btn-danger" @click="removeFromTeam(pokemon)">Quitar</button>
          </div>
        </div>
      </div>
      
    </div>
    <div class="row">
      <h2 class="col-12">Disponibles:</h2>
      <div class="col-md-1-5" v-for="pokemon in availablePokemons" :key="pokemon.id">
        <div class="card">
          <img :src="pokemon.image" :alt="pokemon.name" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">{{ pokemon.name }}</h5>
            <p class="card-text">
              <span v-for="type in pokemon.type" :key="type" class="badge badge-primary mr-1">
                {{ type }}
              </span>
            </p>

            <button class="btn btn-primary" @click="addToTeam(pokemon)">Agregar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


  
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';
  
  interface Pokemon {
    id: number;
    name: string;
    image: string;
    type: string[];
  }
  
  export default defineComponent({
    name: 'PokemonTeamSelector',
    setup() {
      const team = ref<Pokemon[]>([]);
      const availablePokemons = ref<Pokemon[]>([]);
      const baseURL = 'https://pokeapi.co/api/v2/pokemon/';
  
      const fetchAvailablePokemons = async () => {
        try {
          // Fetch only first generation pokemons: IDs 1 through 151
          for (let i = 1; i <= 151; i++) {
            const response = await axios.get(`${baseURL}${i}`);
            const pokemon: Pokemon = {
              id: response.data.id,
              name: response.data.name,
              image: response.data.sprites.front_default,
              type: response.data.types.map((t: any) => t.type.name),
            };
            availablePokemons.value.push(pokemon);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      const addToTeam = (pokemon: Pokemon) => {
        if (team.value.length < 6) {
          team.value.push(pokemon);
          availablePokemons.value = availablePokemons.value.filter(p => p.id !== pokemon.id);
        } else {
          alert('Tu equipo ya tiene 6 pokémons.');
        }
      };
  
      const removeFromTeam = (pokemon: Pokemon) => {
        availablePokemons.value.push(pokemon);
        team.value = team.value.filter(p => p.id !== pokemon.id);
      };
  
      onMounted(() => {
        fetchAvailablePokemons();
      });
  
      return {
        team,
        availablePokemons,
        addToTeam,
        removeFromTeam,
      };
    },
  });
  </script>
  
  <style scoped>
 .col-md-1-5 {
  flex: 0 0 auto;
  width: 12.5%;
}

.card {
  margin: 0.5rem;
}

/* Ajusta los estilos de la imagen para que encaje bien en la tarjeta */
.card-img-top {
  width: 100%;
  height: auto;
}
  </style>
  


  