<template>
    <transition name="slide-fade" >
        <div>
            <v-overlay
                    style="position:fixed;"
                    :value="show"
                    v-on:click="closeStackPanel"
                    :absolute="true"
            />
            <v-card
                    v-if="show"
                    color="white"
                    ref="stackWrap"
                    class="fill-height main__stack-panel-right"
                    style="z-index: 5"
            >
                <v-card-actions v-if="panelName !== 'cart'">
                    <v-card-title>
                        {{panelNames[panelName]}}
                    </v-card-title>
                    <v-spacer/>
                    <v-btn
                            v-on:click="closeStackPanel"
                            class="transparent elevation-0">
                        Закрыть
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-card-actions>
                <v-divider class="my-2" v-if="panelName !== 'cart'"/>
                <CompareStackPanel v-if="panelName==='compare'" :prop="props"/>
                <FavouriteStackPanel v-else-if="panelName==='favourite'" :prop="props"/>
                <CartStackPanel v-else-if="panelName==='cart'" :prop="props"/>
                <CalculateStackPanel v-else-if="panelName==='calculate'" :prop="props"/>
                <SearchStackPanel v-else-if="panelName==='search'" :prop="props"/>
            </v-card>
        </div>
    </transition>
</template>

<script>
    import CompareStackPanel from "./CompareStackPanel";
    import FavouriteStackPanel from "./FavouriteStackPanel";
    import CartStackPanel from "./CartStackPanel";
    import CalculateStackPanel from "./CalculateStackPanel";
    import eventBus from "../../utils/eventBus";
    import SearchStackPanel from "./SearchStackPanel";

    export default {
        name: "StackPanel",
        data() {
            return {
                eventBus,
                panelNames: {'compare': 'Сравнить',
                    'favourite': 'Избранное',
                    'cart': 'Корзина',
                    'search': 'Поиск',
                    'calculate': 'Рассчет мощности охлаждения'
                },
                showActions: true,
                show: false,
                panelName: '',
            }
        },
        methods: {
            openStackPanel(contentType, props) {
                if (contentType === 'compare' )
                    this.$router.push('/compare')
                else {
                    this.show = true;
                    this.panelName = contentType;
                    this.props = props;
                    return contentType;
                }
            },
            closeStackPanel() {
                this.show = false;
            }
        },
        mounted() {
            eventBus.$on('show-actions-changed', value => {
                this.showActions = value;
            })
            eventBus.$on('stack-panel-open', (panelName, props) => {
                this.openStackPanel(panelName, props);
            });
            eventBus.$on('stack-panel-close', () => {
                this.show = false;
            });
        },
        components: {SearchStackPanel, CalculateStackPanel, CartStackPanel, FavouriteStackPanel, CompareStackPanel}
    }
</script>

<style scoped>
    .main__stack-panel-right {
        position: fixed;
        right: 0;
        top: 0;
        height: 100%;
        z-index: 100;
        width: 40vw;
        min-width: 480px;
    }
    .slide-fade-enter-active {
        transition: all .3s;
    }
    .slide-fade-leave-active {
        transition: all .3s;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(200px);
        opacity: 0;
    }
</style>
