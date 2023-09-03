<template>
    <v-sheet class="transparent d-flex flex-column justify-center mx-auto" style="width: 70%">
        <v-card class="pa-6">
            <v-card-title>
                Авторизация
            </v-card-title>
            <v-form>
                <v-text-field required label="Логин" v-model="login">

                </v-text-field>
                <v-text-field required label="Пароль" v-model="password">

                </v-text-field>
                <v-btn block color="blue" v-on:click="tryAuthorize">
                    Войти
                </v-btn>
                <v-card-subtitle style="color:red" v-if="incorrectLogin">
                    Неверный логин или пароль!
                </v-card-subtitle>
            </v-form>
        </v-card>
    </v-sheet>
</template>

<script>
    import axios from 'axios';
    import {getURL} from '../utils/settings.js';

    export default {
        name: "Authorization",
        data () {
            return {
                login: '',
                password: '',
                incorrectLogin: false
            }
        },

        methods: {
            tryAuthorize() {
                if(this.login && this.login.length > 1 && this.password && this.password.length > 1)
                {
                    axios.post(getURL('user/auth'), {login: this.login, password: this.password},
                        {withCredentials: true})
                    .then( (response) => {
                        const authData = response.data;
                        if( authData.success ) {
                            this.$router.push('/category/5');
                        }
                        else {
                            this.incorrectLogin = true
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
