<template>
    <div :style="background">
        <v-card :style="cssProps" class="rounded-0 elevation-0 mx-auto info-panel__main-scope d-flex flex-row">
            <v-card-actions class="d-flex flex-row justify-start px-0">
                <v-btn v-for="btn of infoItems" :key="btn.name"
                       class="transparent text-capitalize px-0 mr-4"
                       elevation="0"
                       :to="btn.value"
                       style="height: inherit;">
                    <span class="info-panel__adaptive-font hover-underline-animation"
                    :style="{color: cssProps.color}">{{btn.name}}</span>
                </v-btn>
            </v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                    <v-icon
                            class="px-2"
                            v-on="on"
                            v-bind="attrs"
                            v-on:click="openChatStackPanel" color="white">mdi-chat</v-icon>
                </template>
                <span>Напишите нам</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                    <v-icon
                            v-on="on"
                            v-bind="attrs"
                            v-on:click="openAccountStackPanel" color="white">mdi-account-circle</v-icon>
                </template>
                <span>Профиль</span>
            </v-tooltip>
        </v-card>
    </div>
</template>

<script>
    import loader from "../../utils/customizeOptions";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "InfoPanel",
        data () {
            return {
                infoItems: [],
                cssProps: {
                    width: '100vw',
                    background: 'white',
                    color: 'black'
                },
                background: {background: null},
                schema: null,
            }
        },
        methods: {
            openAccountStackPanel() {
                eventBus.$emit('stack-panel-push', 'account');
            },
            openChatStackPanel() {
                eventBus.$emit('stack-panel-push', 'chat_list');
            }
        },
        async mounted() {
            await loader().loadOptions();
            this.cssProps.width = loader().getOption(['Header', 'InfoBar', 'Width']);
            this.infoItems = loader().getOptions(['Header', 'InfoBar', 'Links']);
            this.cssProps.background = loader().getOption(['Header', 'InfoBar', 'Background']);
            this.cssProps.color = loader().getOption(['Header', 'InfoBar', 'Text']);
            this.background.background = loader().getOption(['Header', 'InfoBar', 'Mount']);

            this.schema = loader().getOption(['Header','InfoBar', 'Schema']);
        }
    }
</script>

<style>

    .info-panel__main-scope {
        overflow: hidden;
    }

    .info-panel__adaptive-font {
        font-size: calc(var(--index) * 0.5);
        font-weight: initial;
    }
    @media screen and (max-width: 1280px){
        .info-panel__main-scope {
            overflow: hidden;
            margin: 0 auto;
        }
        .info-panel__adaptive-font {
            font-size: calc(var(--index) * 0.8);
        }
    }
    @media screen and (max-width: 960px){
        .info-panel__main-scope {
            margin: 0 auto;
        }
        .info-panel__adaptive-font {
            font-size: calc(var(--index) * 0.8);
        }
    }
</style>
