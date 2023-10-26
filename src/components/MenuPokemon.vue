<template>
    <div>
      <div class="container my-5">
        <h1 class="text-center mb-4">Menu Principal</h1>
  
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary mr-2" @click="addTeam">Agregar Equipo</button>
          <button class="btn btn-secondary" @click="viewTeams">Ver Equipos</button>
        </div>
  
        <div class="d-flex justify-content-center mt-4">
          <button class="btn btn-danger" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useAuth0 } from '@auth0/auth0-vue';
  
  export default defineComponent({
    name: 'MainMenu',
    setup() {
      const auth0 = useAuth0();
  
      const addTeam = () => {
        console.log("Agregar equipo");
      };
  
      const viewTeams = () => {
        console.log("Ver equipos");
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
  