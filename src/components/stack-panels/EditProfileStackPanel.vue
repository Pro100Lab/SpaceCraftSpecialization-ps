<template>
    <v-form class="d-flex flex-column align-center">
        <v-avatar>
            <v-img v-if="user.Avatar" :src="getStatic(user.Avatar)"></v-img>
            <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <v-btn x-small elevation="0" class="mb-4" color="transparent">Загрузить изображение</v-btn>

        <v-text-field label="Имя" readonly v-model="user.Name"></v-text-field>
        <v-text-field label="Телефон" v-model="user.Profile.phone"></v-text-field>
        <v-text-field label="Почта" v-model="user.Profile.email"></v-text-field>
        <v-btn color="blue" class="white--text rounded-xxl" elevation="0" v-on:click="updateProfile">Обновить профиль</v-btn>
    </v-form>
</template>

<script>
    import {getUser} from "../../utils/profile";
    import {getStatic} from "../../utils/settings";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "EditProfileStackPanel",
        methods: {
            getStatic,
            updateProfile() {
                getUser().update(this.user);
            },
            onProfileUpdated() {
                eventBus.$emit('stack-panel-pop');
            }
        },
        data: () => {
            return {
                user: {
                    Profile: {}
                }
            }
        },
        beforeDestroy() {
            eventBus.$on('user/profile-updated', this.onProfileUpdated);
        },
        mounted() {
            this.user = getUser().user;

            eventBus.$on('user/profile-updated', this.onProfileUpdated);
        }
    }
</script>

<style scoped>

</style>
