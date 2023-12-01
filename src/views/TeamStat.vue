<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="row">
        <div class="col-12 text-center mb-4">
          <h1>Estadísticas del Equipo {{ teamName }}</h1>
          <button class="btn btn-secondary mb-3" @click="goBack">Volver</button>
        </div>
        <div class="col-12">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title">{{ teamName }}</h5>
              <div class="my-2">
                <div class="stat">
                  <span class="stat-label">HP Promedio:</span>
                  <span class="stat-value">{{ teamStats.hpProm }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Ataque Promedio:</span>
                  <span class="stat-value">{{ teamStats.attackProm }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Defensa Promedio:</span>
                  <span class="stat-value">{{ teamStats.defenseProm }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Ataque Especial Promedio:</span>
                  <span class="stat-value">{{ teamStats.saProm }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Defensa Especial Promedio:</span>
                  <span class="stat-value">{{ teamStats.seProm }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import axios from 'axios';
  
  export default defineComponent({
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        teamName: '',
        teamStats: {
          hpProm: 0,
          attackProm: 0,
          defenseProm: 0,
          saProm: 0,
          seProm: 0,
        },
      };
    },
    methods: {
      async fetchTeamStats() {
        try {
          const response = await axios.get(`http://localhost:3030/team-stats/team/${this.id}`);
          const data = response.data.result;
          this.teamName = data.team.teamName;
          this.teamStats = {
            hpProm: data.hpProm,
            attackProm: data.attackProm,
            defenseProm: data.defenseProm,
            saProm: data.saProm,
            seProm: data.seProm,
          };
        } catch (error) {
          console.error('Error al obtener las estadísticas del equipo:', error);
        }
      },
      goBack() {
        this.$router.go(-1);
      },
    },
    mounted() {
      this.fetchTeamStats();
    },
  });
  </script>
  
  <style scoped>
  /* Tus estilos existentes */
  </style>
  