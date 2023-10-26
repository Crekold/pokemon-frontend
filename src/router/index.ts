import { createRouter as createVueRouter, createWebHashHistory, Router } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import MenuPokemonVue from "../views/MenuPokemon.vue";
import YourTeams from "../views/YourTeams.vue";
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
      }
    ],
    history: createWebHashHistory()
  })
}
