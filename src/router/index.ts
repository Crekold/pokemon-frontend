import { createRouter as createVueRouter, createWebHashHistory, Router } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import MenuPokemonVue from "../views/MenuPokemon.vue";
import YourTeams from "../views/YourTeams.vue";
import AgregarTeam from "../views/AgregarTeam.vue";
import SelectedTeam from "../views/SelectedTeam.vue";
import ModifyTeam from "../views/ModifyTeam.vue";
import PokemonStats from "../views/PokemonStats.vue";
import { createAuthGuard } from "@auth0/auth0-vue";
import { App } from 'vue';

export function createRouter(app: App): Router {
  return createVueRouter({
    routes: [
      {
        path: "/",
        name: "home",
        component: Home
      },
      {
        path: "/profile",
        name: "profile",
        component: Profile,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/menu",
        name: "menu",
        component: MenuPokemonVue,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/yourteam",
        name: "yourteam",
        component: YourTeams,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/agregarTeam",
        name: "agregarTeam",
        component: AgregarTeam,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/selectedTeam/:id",
        name: "selectedTeam",
        component: SelectedTeam,
        props: true,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: "/modifyTeam/:id",
        name: "modifyTeam",
        component: ModifyTeam,
        props: true,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/selectedTeam/pokemon/:id',
        name: 'pokemonStats',
        component: PokemonStats, // Asegúrate de crear este componente
        props: true,
        beforeEnter: createAuthGuard(app) // Permite pasar props a la vista del Pokémon
      }
    ],
    history: createWebHashHistory()
  })
}
