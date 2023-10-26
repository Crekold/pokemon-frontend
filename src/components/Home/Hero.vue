<template>
  <div class="text-center hero">
    <img class="mb-3 app-logo" src="../../assets/images/LogoPokemon.png" alt="Pokemon logo" />
    <h1 class="mb-4">Pokemon Team Builder</h1>
    <p class="lead">
      ¡Bienvenido a Pokémon Team Builder! Tu plataforma para crear equipos Pokémon competitivos. 
      Regístrate y empieza a armar tu equipo de ensueño con estadísticas detalladas.
    </p>
  </div>
</template>

<script lang="ts">
export default {
  name: "HeroContent"
};
</script>

<style scoped>

.text-center.hero .app-logo {
  max-width: none !important;
  width: 300px !important;
  height: auto !important;
}
</style>
