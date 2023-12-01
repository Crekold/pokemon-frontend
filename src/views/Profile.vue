<template>
  <div class="container mt-4">
    <div class="row align-items-center profile-header mb-5 text-center text-md-left">
      <div class="col-md-2 mb-3">
        <img
          :src="user?.picture"
          alt="User's profile picture"
          class="rounded-circle img-fluid profile-picture"
        />
      </div>
      <div class="col-md">
        <h2>{{ user?.nickname }}</h2>
        <p class="lead text-muted">{{ user?.email }}</p>
        <p>Número de Equipos: {{ teamCount }}</p>
        <!-- Aquí puedes añadir más información relevante del usuario -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';

export default {
  name: "profile-view",
  setup() {
    const auth0 = useAuth0();
    const teamCount = ref(0);
    const sub = ref(auth0.user.value.sub);
    onMounted(async () => {
      // Reemplaza la URL con la de tu backend y asegúrate de enviar cualquier token necesario
      const response = await axios.get(`http://localhost:3030/teams/user/${sub}`);
      teamCount.value = response.data.count;
    });

    return {
      user: auth0.user,
      teamCount
    }
  }
};
</script>

<style>
.profile-header {
  margin-bottom: 20px;
}

.profile-picture {
  width: 150px; /* Ajusta el tamaño de la imagen según necesites */
}

/* Aquí puedes añadir más estilos personalizados si lo deseas */
</style>
