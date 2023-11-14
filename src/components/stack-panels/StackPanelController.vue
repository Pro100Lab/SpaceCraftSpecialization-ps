<template>
    <div>
        <v-overlay
                style="position:fixed;"
                id="stack-panel-overlay"
                :value="stackPanelStack.length > 0"
                v-on:click="closeStackPanel"
                :absolute="true"
        />
        <transition-group name="slide-fade" >
                <stack-panel
                        v-for="(stackPanel, index) of stackPanelStack"
                        :key="`stack-${index}-panel-${stackPanel.name}`"
                        :prop="stackPanel.props"
                ></stack-panel>
        </transition-group>
    </div>
</template>

<script>
    import StackPanel from "./StackPanel";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "StackPanelController",
        components: {StackPanel},
        data: () => {
            return {
                show: false,
                stackPanelStack: [],
                panelNames: {'compare': 'Сравнить',
                    'favourite': 'Избранное',
                    'cart': 'Корзина',
                    'search': 'Поиск',
                    'calculate': 'Рассчет мощности охлаждения',
                    'account': 'Аккаунт',
                    'chat': 'Чат',
                    'chat_list': 'Чаты',
                    'authorize': 'Авторизация',
                    'orders': 'Мои заказы',
                    'currency': 'Валюта',
                    'information': 'Информация',
                    'edit-profile': 'Профиль',
                    'information_list': 'Информация'
                },
                zIndex: 102
            }
        },
        methods: {
            pushStackPanel(panelName, props) {
                props = props || {};
                props.zIndex = this.zIndex + this.stackPanelStack.length;
                props.name = props.userName || this.panelNames[panelName];
                props.panelName = panelName;
                if(this.stackPanelStack.length > 0) {
                    props.back = this.stackPanelStack[this.stackPanelStack.length - 1].panelName;
                }

                this.stackPanelStack.push({panelName: panelName, props: props});
                console.log('pushed stack panel item', this.stackPanelStack);
            },
            closeStackPanel() {
                this.stackPanelStack = [];
            },
            onStackPanelPop() {
                this.stackPanelStack.pop();
            }
        },
        beforeDestroy() {
            console.log('stack panel controller before destroy');
            eventBus.$off('stack-panel-push', this.pushStackPanel);
            eventBus.$off('stack-panel-close', this.closeStackPanel);
            eventBus.$off('stack-panel-pop', this.onStackPanelPop);
        },
        mounted() {
            console.log('stack panel controller mounted');
            eventBus.$on('stack-panel-push', this.pushStackPanel);
            eventBus.$on('stack-panel-close', this.closeStackPanel);
            eventBus.$on('stack-panel-pop', this.onStackPanelPop);
        }
    }
</script>

<style scoped>

</style>
