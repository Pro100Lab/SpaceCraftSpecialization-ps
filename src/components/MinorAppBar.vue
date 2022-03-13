<template>
    <v-card dark>
    <v-toolbar elevation="0"
               class="mx-auto transparent"
               dark
               width="60%"
    >
        <div class="text-center" v-for="root in rootCategories" :key="root.id">
            <v-menu offset-y open-on-hover>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                            color="transparent"
                            v-bind="attrs"
                            v-on="on"
                            :to="`/category/${root.id}`"
                    >
                        {{root.title}}
                        <v-icon v-if="root.children && root.children.length > 0">
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="child in root.children"
                            :key="child.id"
                            link
                            :to="`/category/${child.id}`"
                    >
                        <v-list-item-title >{{ child.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-divider vertical/>
        </div>
    </v-toolbar>
    </v-card>
</template>

<script>
    import {getURL} from "../settings";
    import axios from "axios";

    export default {
        name: "MinorAppBar",
        data: () => ({
            rootCategories: []
        }),
        beforeCreate() {
            axios.get(getURL('categories'), {withCredentials: true})
                .then(response => {
                    this.rootCategories = response.data;
                })
        }
    }
</script>

<style scoped>

</style>
