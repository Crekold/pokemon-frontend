<template>
  <div class="card" style="width: 18rem;">
    <img :src="pokemon.imageUrl" class="card-img-top" :alt="pokemon.pokemonName">
    <div class="card-body">
      <h5 class="card-title">{{ pokemon.pokemonName }}</h5>
      <!-- Aquí podrías agregar más detalles si lo necesitas -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

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
  props: {
    pokemon: {
      type: Object as PropType<Pokemon>,
      required: true
    }
  }
});
</script>

<style scoped>
.pokemon-card {
  width: 100px; 
  height: 150px; 
  border: 1px solid black;
}
</style>








