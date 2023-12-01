<template>
  <div class="background">
    <div class="container my-5">
      <h1 class="text-center mb-4">Menu Principal</h1>

      <div class="d-flex flex-column align-items-center">
        <div class="card" style="width: 18rem;">
          <div class="d-flex justify-content-center align-items-center" style="height: 100px;">
          <img src="https://i.pinimg.com/originals/02/c7/05/02c70572482476ba3ec8c4962f883705.png" class="card-img-top pokemon-image" alt="pokemon-1">
          </div>
          <div class="card-body">
            <button class="btn btn-primary btn-lg mb-2" @click="addTeam">
              <font-awesome-icon :icon="['fas', 'plus']" class="mr-2" /> Agregar Equipo
            </button>
          </div>
        </div>
        <div class="card" style="width: 18rem;">
          <div class="d-flex justify-content-center align-items-center" style="height: 100px;">
          <img src="https://images.wikidexcdn.net/mwuploads/wikidex/thumb/c/c9/latest/20130204042256/EP672_Guarder%C3%ADa_Pok%C3%A9mon.png/250px-EP672_Guarder%C3%ADa_Pok%C3%A9mon.png" class="card-img-top pokemon-image" alt="pokemon-2">
        </div>
          <div class="card-body">
            <button class="btn btn-secondary btn-lg mb-2" @click="viewTeams">
              Tus equipos
            </button>
          </div>
        </div>
        <div class="card" style="width: 18rem;">
          <div class="d-flex justify-content-center align-items-center" style="height: 100px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfdiNKyh8l4qkWDZTGQqKNyKypMxVt7uO-5IHnmqVjPw&s" class="card-img-top pokemon-image" alt="pokemon-3">
        </div>
          <div class="card-body">
            <button class="btn btn-danger btn-lg mt-3" @click="logout">
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-2" /> Logout
            </button>
          </div>
        </div>
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
      router.push('/agregarTeam');
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
/* Estilos del componente (si los tienes) */.pokemon-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%; /* Hace las imágenes redondas */
}

.background {
  background-image: url('https://i.pinimg.com/originals/ab/58/cc/ab58cc75dcb2e42555cf7e614216350a.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
}

.card {
  width: 18rem;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-body {
  text-align: center;
}

.card-body .btn {
  width: 100%;
  margin-top: 10px;
}

/* Estilos para los botones */
.btn-primary {
  background-color: #007bff;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-primary:hover, .btn-secondary:hover, .btn-danger:hover {
  opacity: 0.9;
}

</style>
