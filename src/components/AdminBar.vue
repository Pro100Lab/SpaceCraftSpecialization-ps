<template>
    <v-app-bar
            hide-on-scroll
            elevation="4"
            absolute
    >
        <router-link style="text-decoration: none" to="/">
        <v-toolbar-title style="font-size: 24px">Флагман админ</v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <v-btn color="transparent" elevation="0" class="d-flex flex-row justify-center" style="height: 50px;">
        <v-avatar>
            <v-img :src="'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'"
            contain>

            </v-img>
        </v-avatar>
        <h4 class="mx-2">Главный администратор</h4>
        </v-btn>
        <v-divider vertical class="mx-2"/>
        <v-btn color="transparent" elevation="0">
            <v-icon>
                mdi-exit-run
            </v-icon>
            Выход
        </v-btn>
    </v-app-bar>
</template>

<script>
    export default {
        name: "AdminBar"
    }
</script>

<style scoped>

</style>
