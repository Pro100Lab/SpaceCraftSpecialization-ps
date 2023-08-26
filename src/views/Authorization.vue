<template>
    <kinesis-container style="width: 100vw; height: 100vh; background: black" class="d-flex flex-row justify-center align-center">
        <kinesis-element :strength="10" style="position: absolute; height: 100vh;">
            <v-img src="../assets/auth/auth_background.jpg" class="v-image__image--cover" style="z-index: -5" ></v-img>
        </kinesis-element>
        <kinesis-element  :strength="40"
                         v-for="i of 60" :key="`star-20-${i}`"
                         :style="{'position': 'absolute',
                          'top': `${randomsY[i]}%`,
                           'left': `${randomsX[i]}%`,
                             'width': '100%',
                              'z-index': '5'}">
            <v-icon
                    :style="{'animation-delay': `${randomsAnime[i]}ms`}"
                    class="scale-out-center"
                    color="white" x-small>mdi-star-four-points</v-icon>
        </kinesis-element>

        <kinesis-element  :strength="80"
                         v-for="i of 40" :key="`star-30-${i}`"
                         :style="{'position': 'absolute',
                          'top': `${randomsY[100 + i]}%`,
                           'left': `${randomsX[100 + i]}%`,
                             'width': '100%',
                              'z-index': '5'}">
            <v-icon
                    :style="{'animation-delay': `${randomsAnime[ 15 + i ]}ms`}"
                    class="scale-out-center"
                    color="white" x-small>mdi-star-four-points</v-icon>
        </kinesis-element>

        <kinesis-element  :strength="120"
                         v-for="i of 20" :key="`star-40-${i}`"
                         :style="{'position': 'absolute',
                          'top': `${randomsY[200 + i]}%`,
                           'left': `${randomsX[200 + i]}%`,
                             'width': '100%',
                              'z-index': '5'}">
            <v-icon
                    :style="{'animation-delay': `${randomsAnime[ 30 + i ]}ms`}"
                    class="scale-out-center" color="white" x-small>mdi-star-four-points</v-icon>
        </kinesis-element>

        <v-card dark class="elevation-16 d-flex flex-column justify-space-around align-center auth__card transparent"
                                                        style="width: 50vw; height: 50vh">
            <v-card-title class="main-card__title text-break">
                Galaxy Hotels
            </v-card-title>
            <v-form class="elevation-2 pa-4 my-2 rounded-l" style="background-color: rgba(0,0,0,0.4)">
                <v-text-field placeholder="Логин" v-model="login">
                </v-text-field>
                <v-text-field type="password" placeholder="Пароль" v-model="password">

                </v-text-field>
                <v-card-subtitle style="color:#ffaeae" v-if="incorrectLogin">
                    Неверный логин или пароль!
                </v-card-subtitle>
                <v-btn elevation="0" v-on:click="tryAuthorize" block>Вход</v-btn>
            </v-form>
        </v-card>
    </kinesis-container>
</template>

<script>
    import axios from 'axios';
    import { getURL } from "../settings";
    import eventBus from "../utils/eventBus";

    export default {
        name: "Authorization",
        props: ['authorizedCallBack'],
        data: () => {
            return {
                login: '',
                password: '',
                incorrectLogin: false,
                randomsX: [],
                randomsY: [],
                randomsAnime: []
            }
        },
        mounted() {
            for( let i = 0; i < 1000; i++ )
            {
                this.randomsX.push(Math.random() * 100);
                this.randomsY.push(Math.random() * 100 / 2.5);
                this.randomsAnime.push(Math.random() * 3000);
            }
            const token = window.localStorage.getItem('auth-token');
            if(!token)
                return;
            axios.post(getURL('user/auth'), {token}, {withCredentials: true}).then(res => {
                const authData = res.data;
                if( authData.success ) {
                    this.setProfile(authData.user);
                    this.authorizedCallBack();
                }
            })
        },
        methods: {
            randomColor() {
              // let yellow = Math.random() > 0.51;
              return 'white';
              //   `rgba(${ yellow ? Math.random() * 155 + 100 : 0},
              // ${ yellow ? Math.random() * 155 + 100 : 0},
              //  ${yellow ? 0 : Math.random() * 155 + 100}, ${Math.random() * 0.5 + 0.5})`;
            },
            setProfile(profile) {
                setTimeout(()=>{
                    eventBus.$emit('profile-set', profile);
                }, 1000);
            },
            tryAuthorize() {
                if(this.login && this.login.length > 1 && this.password && this.password.length > 1)
                {
                    axios.post(getURL('user/auth'), {login: this.login, password: this.password, action: 'admin'},
                        {withCredentials: true})
                        .then( (response) => {
                            const authData = response.data;
                            if( authData.success ) {
                                this.incorrectLogin = false;
                                this.authorizedCallBack();
                                this.setProfile(authData.user);
                                window.localStorage.setItem('auth-token', authData.session);
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

<style>
    :root {
        --index: calc(1vh + 1vw);
    }

    .main-card__title {
        font-size: calc(var(--index) * 3);
        font-family: 'Candara';
    }
    .auth__card {
        background: rgb(121, 171, 172);
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%);
        z-index: 10;
    }

    .scale-out-center {
        animation-name: scale-out-center;
        animation-timing-function: linear;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
    }

    @keyframes scale-out-center {
        50% {
            opacity: 0;
        }
    }
</style>
