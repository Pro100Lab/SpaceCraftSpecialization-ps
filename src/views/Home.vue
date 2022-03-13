<template>
    <div class="main__view">
        <v-carousel hide-delimiters height="100%" class="elevation-4">
          <v-carousel-item :src="require('../assets/free_banner.png')" contain>
          </v-carousel-item>
        </v-carousel>
        <v-sheet color="white" class="my-6 elevation-4" min-height="23rem">
            <h2 class="my-6 text-center">Наши преимущества</h2>
            <h3 style="color: gray" class="mx-4">Быстро бегать</h3>
            <h3 style="color: gray" class="mx-4">Высоко прыгать</h3>
            <h3 style="color: gray" class="mx-4">Громко кричать</h3>
        </v-sheet>
    </div>
</template>

<style>
    .main__view {
        display: flex;
        width: 70%;
        flex-direction: column;
        justify-content: space-between;
        margin: 0 auto;
    }
</style>
<script>

  export default {
    name: 'Home',

  }
</script>
