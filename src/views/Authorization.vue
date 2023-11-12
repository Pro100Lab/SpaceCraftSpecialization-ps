<template>
    <v-sheet class="transparent d-flex flex-column justify-center mx-auto" style="width: 70%">
        <v-card class="elevation-0 ">
            <v-tabs fixed-tabs v-model="selectedTab" class="py-6">
                <v-tab v-for="tab of tabs" :key="`authorize-tab-${tab}`" :value="tab">
                    {{tab}}
                </v-tab>
            </v-tabs>
            <template v-if="selectedTab===0">
                <v-form>
                    <v-text-field required label="Логин или Email" v-model="login">

                    </v-text-field>
                    <v-text-field required label="Пароль" v-model="password">

                    </v-text-field>
                    <v-btn class="rounded-xxl" block color="blue" dark v-on:click="tryAuthorize">
                        Войти
                    </v-btn>
                    <v-card-subtitle style="color:red" v-if="incorrectLogin">
                        Неверный логин или пароль!
                    </v-card-subtitle>
                </v-form>
            </template>
            <template v-else-if="selectedTab === 1">
                <v-form v-model="registerValid">
                    <v-text-field
                            required
                            label="Ваше имя"
                            v-model="name"
                            :rules = "[v => !!v || 'Обязательное поле']"
                    >

                    </v-text-field>

                    <v-text-field required
                                  label="Логин или Email"
                                  :rules = "[v => !!v || 'Обязательное поле']"
                                  v-model="login">

                    </v-text-field>
                    <v-text-field
                            type="password"
                            required
                            label="Пароль"
                            v-model="password"
                            :rules = "[v => !!v || 'Обязательное поле']"
                    >

                    </v-text-field>
                    <v-text-field
                            type="password"
                            required
                            label="Повторите пароль"
                            v-model="passwordRepeat"
                            :rules = "[v => !!v && !repeatError || 'Пароли не совпадают']"
                    >

                    </v-text-field>
                    <v-btn :disabled="!registerValid" block color="blue" class="rounded-xxl white--text my-4" v-on:click="tryRegister">
                        Зарегистрироваться
                    </v-btn>
                </v-form>
            </template>
        </v-card>
    </v-sheet>
</template>

<script>
    import eventBus from "../utils/eventBus";
    import {getUser} from "../utils/profile";

    export default {
        name: "Authorization",
        data () {
            return {
                name: '',
                login: '',
                password: '',
                incorrectLogin: false,
                tabs: ['Авторизация', 'Регистрация'],
                selectedTab: 'Авторизация',
                passwordRepeat: '',
                repeatError: null,
                registerValid: false,
                loginValid: false,
                email: null,
            }
        },
        mounted() {
            console.log('authorization mounted');

            eventBus.$on('authorized', this.onAuthorized);
            eventBus.$on('authorization-failed', this.onAuthorizationFailed);
        },
        beforeDestroy() {
            console.log('authorization before destroy');

            eventBus.$off('authorized', this.onAuthorized);
            eventBus.$off('authorization-failed', this.onAuthorizationFailed);
        },
        methods: {
            onAuthorized() {
                eventBus.$emit('stack-panel-pop');
            },
            onAuthorizationFailed() {
                this.incorrectLogin = true;
            },
            tryAuthorize() {
                getUser().tryAuth(this.login, this.password);
            },
            tryRegister() {
                getUser().tryRegister({
                    Login: this.login,
                    Password: this.password, Name: this.name, Profile: {
                        email: this.email
                    }})
            }
        },
        watch: {
            passwordRepeat() {
                if(this.passwordRepeat && this.password && this.passwordRepeat !== this.password)
                {
                    this.repeatError = 'Пароли не совпадают'
                } else {
                    this.repeatError = null;
                }
            },
            login() {
                if(this.login.indexOf('@') !== -1)
                    this.email = this.login;
            }
        }
    }
</script>

<style scoped>

</style>
