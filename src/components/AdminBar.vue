<template>
    <v-app-bar
            hide-on-scroll
            elevation="4"
            absolute
    >
        <router-link style="text-decoration: none" to="/" class="toolbar__header">
            <v-toolbar-title style="font-size: 24px" >Galaxy Hotels Admin</v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <v-sheet :ripple="false" color="transparent" elevation="0" class="d-flex flex-row justify-center" style="height: 50px;">
            <v-avatar>
                <v-img v-if="profile.Avatar"
                       contain
                       :src="getURL(`static/${profile.Avatar}`)" alt="avatar"/>
                <v-icon v-else> mdi-star-face</v-icon>
            </v-avatar>
            <v-card-subtitle class="mx-2">{{profile.Name}}</v-card-subtitle>
        </v-sheet>
        <v-divider vertical class="mx-2"/>
        <v-btn color="transparent" elevation="0" v-on:click="exit">
            <v-icon>
                mdi-exit-run
            </v-icon>
            Выход
        </v-btn>
    </v-app-bar>
</template>

<script>
    import eventBus from "../utils/eventBus";
    import { getURL } from "../settings";

    export default {
        props: ['exit'],
        name: "AdminBar",
        data: () => {
            return {
                profile: {}
            }
        },
        methods: {
            getURL
        },
        beforeMount() {
            eventBus.$on('profile-set', profile => {
                console.log('profile set: ', JSON.stringify(profile))
                this.profile = profile;
            })
        }
    }
</script>

<style scoped>

    .toolbar__header {
        color: black;
    }
</style>
