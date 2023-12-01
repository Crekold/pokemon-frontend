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
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.card-img-top {
  width: 100%;
  height: auto;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.card-body {
  text-align: center;
}

</style>








