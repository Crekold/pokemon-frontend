<template>
  <div>
    <hero />
    <hr />
    <home-content />
  </div>
</template>

<script lang="ts">
import Hero from "../components/Home/Hero.vue";
import HomeContent from "../components/Home/HomeContent.vue";

export default {
  name: "home-view",
  components: {
    Hero,
    HomeContent,
  },
};
</script>

<style lang="css" scoped>
.next-steps .fa-link {
    margin-right: 5px;
}
</style>
