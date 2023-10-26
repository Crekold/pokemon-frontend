<template>
  <div>
    <div class="container my-5">
      <h1 class="text-center mb-4">Menu Principal</h1>

      <div class="d-flex flex-column align-items-center">
        <button class="btn btn-primary btn-lg mb-2" @click="addTeam">
          <font-awesome-icon :icon="['fas', 'plus']" class="mr-2" /> Agregar Equipo
        </button>
        <button class="btn btn-secondary btn-lg mb-2" @click="viewTeams">
          Tus equipos
        </button>
        <button class="btn btn-danger btn-lg mt-3" @click="logout">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-2" /> Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainMenu',
  setup() {
    const auth0 = useAuth0();
    const router = useRouter();

    const addTeam = () => {
      console.log("Agregar equipo");
    };

    const viewTeams = () => {
      console.log("Ver equipos");
      router.push('/yourteam');
    };

    const logout = () => {
      auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    };

    return {
      addTeam,
      viewTeams,
      logout
    };
  }
});
</script>

<style scoped>
/* Estilos del componente (si los tienes) */
</style>
