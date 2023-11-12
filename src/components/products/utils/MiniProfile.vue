<template>
    <v-card class="elevation-0 transparent">
        <v-card-actions class="d-flex flex-row align-center" v-if="this.selfInfo">
            <v-avatar :size="size ? size : 64">
                <v-img :src="getStatic(this.selfInfo.Avatar)" v-if="selfInfo.Avatar"></v-img>
                <v-icon v-else :size="size">mdi-account-circle</v-icon>
            </v-avatar>
            <div class="d-flex flex-column">
            <v-card-title :class="(showRole && roleName? 'pt-0' : 'py-0' ) + ' pl-2'" class="text-break" style="font-size: 12px; line-height: 14px;" v-html="selfInfo.Name">
            </v-card-title>
                <v-card-subtitle class="pb-0 pl-2" v-if="showRole && roleName" v-html="roleName"></v-card-subtitle>
            </div>
        </v-card-actions>
        <v-card-title v-else>
            Без имени
        </v-card-title>
    </v-card>
</template>

<script>
    import {getStatic, getURL} from "../../../utils/settings";
    import axios from 'axios';

    export default {
        name: "MiniProfile",
        props: ['idx', 'info', 'size', 'showRole'],
        data: () => {
            return {
                selfInfo: {},
                roleName: null
            }
        },
        mounted() {
            if( this.info ) {
                this.selfInfo = this.info;
            }
            if( this.idx && !this.info )
                this.loadProfile(this.idx);
        },
        methods: {
            getRole() {
                if(this.selfInfo['Role']) {
                    axios.get(getURL(`role/${this.selfInfo['Role']}`)).then(res => {
                        this.roleName = res.data.name;
                    });
                }
            },
            loadProfile(idx) {
                axios.get(getURL(`user/${idx}`)).then(resp=>{
                        this.selfInfo = resp.data;
                        this.getRole();
                    }
                )
            },
            getURL, getStatic
        },
        watch: {
            idx() {
                this.loadProfile(this.idx);
            }
        }
    }
</script>

<style scoped>

</style>
