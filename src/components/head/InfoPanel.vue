<template>
    <div :style="background">
        <v-card :style="cssProps" class="rounded-0 elevation-0 mx-auto info-panel__main-scope">
            <v-card-actions class="d-flex flex-row justify-start">
                <v-btn v-for="btn of infoItems" :key="btn.name"
                       class="transparent text-capitalize"
                       elevation="0"
                       :to="btn.value"
                       style="height: inherit;">
                    <span class="info-panel__adaptive-font">{{btn.name}}</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import loader from "../../utils/customizeOptions";

    export default {
        name: "InfoPanel",
        data () {
            return {
                infoItems: [],
                cssProps: {},
                background: {backgroundColor: 'yellow'}
            }
        },
        async mounted() {
            await loader().loadOptions();
            this.infoItems = loader().getOptions(['Header', 'InfoBar', 'Links']);
            this.cssProps.backgroundColor = loader().getOption(['Header', 'InfoBar', 'Background']);
            this.background.backgroundColor = loader().getOption(['Header', 'InfoBar', 'Mount']);
        }
    }
</script>

<style>

    .info-panel__main-scope {
        overflow: auto;
        overflow-y: hidden;
        width: 70vw;
    }

    .info-panel__adaptive-font {
        font-size: calc(var(--index) * 0.5);
        font-weight: initial;
    }
    @media screen and (max-width: 1280px){
        .info-panel__main-scope {
            overflow: auto;
            overflow-y: hidden;
            width: 85%;
            margin: 0 auto;
        }
        .info-panel__adaptive-font {
            font-size: calc(var(--index) * 0.8);
        }
    }
    @media screen and (max-width: 960px){
        .info-panel__main-scope {
            width: 100%;
            margin: 0 auto;
        }
        .info-panel__adaptive-font {
            font-size: calc(var(--index) * 0.8);
        }
    }
</style>
