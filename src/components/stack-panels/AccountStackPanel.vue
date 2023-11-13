<template>
    <v-card id='cart-card' ref="cartCard" class="fill-height elevation-0 overflow-x-hidden" color="rgba(0,23,228,0.03)">
        <template  v-if="!authorized">
            <v-card color="blue lighten-5" class="elevation-0 d-flex flex-column rounded-xl">

            <v-card-title class="text-break">
                Войдите или<br/>
                зарегистрируйтесь
            </v-card-title>
            <v-card-subtitle>
                Чтобы отслеживать заказы и пользоваться персональными скидками
            </v-card-subtitle>
            <v-btn color="blue darken-3"
                   class="ma-4 mr-10 rounded-lg text-lowercase"
                   dark
                   v-on:click="pushLogInStackPanel"
            >Войти или зарегистрироваться</v-btn>
            </v-card>
        </template>

        <template v-else>
            <div class="d-flex flex-column rounded-xl" style="background-color: #E3F2FD">
                <v-card color="transparent" class="ma-3 elevation-0 ">
                    <v-card-subtitle class="black--text pt-0">Профиль</v-card-subtitle>
                    <div class="d-flex flex-row align-center">
                        <v-avatar class="mx-4">
                            <v-img v-if="getUser().user.Avatar" :src="getStatic(getUser().user.Avatar)" alt="profile image"></v-img>
                            <v-icon v-else x-large color="white">mdi-account-circle</v-icon>
                        </v-avatar>
                        <div class="d-flex flex-column">
                            <v-card-actions>
                                <v-sheet class="rounded-xl text-center" color="gray" style="width: 45%">
                                    <v-card-subtitle class="py-0 text-truncate">{{getUser().user.Name}}</v-card-subtitle>
                                </v-sheet>
                                <v-sheet v-if="getUser().user.Profile && getUser().user.Profile.phone" class="rounded-xxl text-center mx-1 " color="gray" style="width: 45%">
                                    <v-card-subtitle class="py-0 text-truncate">{{getUser().user.Profile.phone}}</v-card-subtitle>
                                </v-sheet>
                            </v-card-actions>
                            <v-card-actions class="py-0">
                                <v-sheet v-if="getUser().user.Profile && getUser().user.Profile.email" class="rounded-xxl text-center" color="gray" style="width: 92%">
                                    <v-card-subtitle class="py-0 text-truncate">{{getUser().user.Profile.email}}</v-card-subtitle>
                                </v-sheet>
                            </v-card-actions>
                        </div>
                    </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="blue" elevation="0"
                                small
                                class="rounded-xl white--text text-lowercase"
                                v-on:click="pushEditProfileStackPanel"
                        >
                            Редактировать
                        </v-btn>
                        <v-btn color="blue" elevation="0"
                               small
                               class="rounded-xl white--text text-lowercase"
                               v-on:click="getUser().logOut()">Выйти</v-btn>
                    </v-card-actions>
                </v-card>
            </div>

        </template>

        <div class="pa-4">
        <v-card-subtitle class="px-0">Приложение</v-card-subtitle>

        <v-card elevation="0" class="rounded-xl">
            <v-list class="py-0">
                <template v-for="(item, index) of appItems">
                    <v-divider v-if="index !== 0" :key="`app-item-divider-${index}`" class="ml-4"></v-divider>

                    <v-list-item dense class="py-0" :key="`app-item-${item.Name}`" v-on:click="onAppItemClicked(item)">
                    <v-list-item-title v-html="item.Name">

                    </v-list-item-title>
                    <v-list-item-action>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-action>
                </v-list-item>
                </template>
            </v-list>
        </v-card>
        </div>
    </v-card>
</template>

<script>
    import eventBus from "../../utils/eventBus";
    import getLoader from "../../utils/customizeOptions";
    import {getUser} from "../../utils/profile";
    import {getStatic} from "../../utils/settings";

    export default {
        name: "AccountStackPanel",
        data: () => {
            return {
                appItems: [],
                authorized: false,
                profile: {}
            }
        },
        methods: {
            getUser, getStatic,
            onAppItemClicked(item) {
                eventBus.$emit('stack-panel-push', item.StackPanel)
            },
            pushLogInStackPanel() {
                eventBus.$emit('stack-panel-push', 'authorize');
            },
            pushEditProfileStackPanel() {
                eventBus.$emit('stack-panel-push', 'edit-profile');
            },
            onAuthorized() {
                this.authorized = getUser().authorized;
                this.profile = getUser().user;
            },
            onLogOut() {
                this.authorized = getUser().authorized;
            }
        },
        async beforeDestroy() {
            eventBus.$on('authorized', this.onAuthorized);
            eventBus.$on('user/log-out', this.onLogOut);
        },
        async beforeMount() {
            await getLoader().loadOptions();

            this.appItems = getLoader().getAsObjects(['StackPanels', 'Account', 'ApplicationLinks']);
            console.log('app items: ', this.appItems);

            this.authorized = getUser().authorized;
            this.profile = getUser().user;

            eventBus.$on('authorized', this.onAuthorized);
            eventBus.$on('user/log-out', this.onLogOut);
        }
    }
</script>

<style scoped>

</style>
