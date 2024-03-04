<template>
    <v-sheet :color="background">
        <v-toolbar elevation="0"
                   class="mx-auto px-0 transparent bottom-bar__main-scope" :dark="schema === 'dark'"
        >
            <div class="text-center d-flex flex-column justify-center" v-for="root in rootCategories" :key="root.id">
                <v-menu offset-y open-on-hover >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                                color="transparent"
                                v-bind="attrs"
                                elevation="0"
                                v-on="on"
                                :to="`/category/${root.id}`"
                        >
                        <span class="minor-bar__adaptive-font"  :style="text">{{root.title}}</span>
                            <v-icon v-if="root.children && root.children.length > 0"  :style="text">
                                mdi-chevron-down
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list v-if="root.children && root.children.length > 0">
                        <v-list-item
                                v-for="child in root.children"
                                :key="child.id"
                                link
                                :to="`/category/${child.id}`"
                        >
                            <v-list-item-title  >
                                <span class="minor-bar__adaptive-font">{{ child.title }}</span></v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-divider vertical/>
            </div>
        </v-toolbar>
    </v-sheet>
</template>

<script>
    import {getURL} from "../../utils/settings";
    import axios from "axios";
    import loader from "../../utils/customizeOptions";

    export default {
        name: "MinorAppBar",
        data: () => ({
            rootCategories: [],
            background: 'white',
            text: {
                color: null,
                size: null,
                font: null
            },
            schema: null,
        }),
        async beforeCreate() {
            axios.get(getURL('categories'), {withCredentials: true})
                .then(response => {
                    this.rootCategories = response.data;
                })
            await loader().loadOptions();

            this.background = loader().getOption(['Header', 'MinorBar', 'Background']);
            this.text = loader().getAsObject(['Header', 'MinorBar', 'Text']);
            console.log('text options: ', this.text);
            this.schema = loader().getOption(['Common', 'Schema']);
        }
    }
</script>

<style>

    .bottom-bar__main-scope {
        overflow: auto;
        overflow-y: hidden;
        width: 70vw;
    }

    .v-toolbar__content {
        padding: 0 !important;
    }

    .minor-bar__adaptive-font {
        font-size: calc(var(--index) * 0.6)
    }

    @media screen and (max-width: 1280px){
        .bottom-bar__main-scope {
            width: 85%;
            overflow: auto;
            overflow-y: hidden;
        }
        .minor-bar__adaptive-font {
            font-size: calc(var(--index) * 0.8)
        }
    }
    @media screen and (max-width: 960px){
        .bottom-bar__main-scope {
            width: 100%;
            overflow: auto;
            overflow-y: hidden;
        }
        .minor-bar__adaptive-font {
            font-size: calc(var(--index) * 1.5)
        }
    }
</style>
