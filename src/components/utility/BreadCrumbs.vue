<template>
    <v-card class="fill-height rounded-b-0 elevation-0 py-0" :color="background">
        <v-breadcrumbs :dark="schema === 'dark'" :items="crumbs" v-if="crumbs && showCrumbs">
        </v-breadcrumbs>
    </v-card>
</template>

<script>
    import getLoader from "../../utils/customizeOptions";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "BreadCrumbs",
        props: ['crumbs'],
        data: () => {
              return {
                  background: 'transparent',
                  activeColor: 'blue',
                  inactiveColor: 'gray',
                  schema: null,
                  showCrumbs: true,
              }
        },
        computed: {
            isMobile: function() {
                return window.innerWidth < 960;
            }
        },
        async beforeMount() {
            await getLoader().loadOptions();

            this.schema = getLoader().getOption(['Common', 'Schema']);
            this.showCrumbs = getLoader().getBool(['Common', 'BreadCrumbs'], this.isMobile);

            console.log('show crumbs', this.showCrumbs);
        },
        watch: {
            crumbs: function() {
                eventBus.$emit('navigation-changed', this.crumbs);
            }
        }
    }
</script>

<style scoped>

</style>
