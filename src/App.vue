<template>
  <div id="app" class="d-flex flex-column h-100">
    <nav-bar />
    <Darkmode />

    <div class="container flex-grow-1">
      <error />
      <div class="mt-5">
        <router-view />
      </div>
    </div>
    <footer class="bg-light text-center p-3">
      <!-- Modificación del logo en el footer. Puedes usar un logo personalizado de Pokémon aquí. -->
      <img src="./assets/png-transparent-8-bit-pokemon-pixel-art-poke-ball-others-rectangle-bitcoin-pokemon-removebg-preview (1).png" alt="Pokémon Team Builder Logo" class="footer-logo app-logo">
      <p>
        Powered by
        <strong>Pokémon Team Builder</strong>
      </p>
      <p>
        Gotta Build 'Em All!
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import NavBar from "./components/NavBar.vue";
import Darkmode from "./components/Darkmode.vue";
import Error from "./components/Error.vue";

export default {
  components: {
    NavBar,
    Darkmode,
    Error
  }
};
</script>

<style>
.footer-logo {
  width: 100px;
  height: auto;
  margin-bottom: 10px;
}
:root { /* light mode */
    --font-color: #000;
    --link-color:#1C75B9;
    --link-white-color:#fff;
    --bg-color: rgb(243,243,243);
}
[data-theme="dark"] {
    --font-color: #bdbab8;
    --link-color:#0a86da;
    --link-white-color:#bdbab8;
    --bg-color: #333;
}
body
{
    color:#000;
    color:var(--font-color);
    background:rgb(243,243,243);
    background:var(--bg-color);
}
</style>