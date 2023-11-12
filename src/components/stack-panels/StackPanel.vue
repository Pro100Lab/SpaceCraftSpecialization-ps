<template>
    <v-card
            color="white"
            ref="stackWrap"
            class="fill-height main__stack-panel-right rounded-0"
            :style="{'z-index': prop.zIndex}"
    >
        <v-card-actions class="py-0">
            <v-icon v-if="prop.back" v-on:click="goBack">mdi-chevron-left</v-icon>
            <v-card-title class="py-0">
                {{prop.name}}
            </v-card-title>
            <v-spacer/>
            <v-btn
                    v-if="!prop.back"
                    v-on:click="closeStackPanel"
                    class="transparent elevation-0">
                Закрыть
                <v-icon>
                    mdi-close
                </v-icon>
            </v-btn>
        </v-card-actions>
        <CompareStackPanel v-if="prop.panelName==='compare'" :prop="prop"/>
        <FavouriteStackPanel v-else-if="prop.panelName==='favourite'" :prop="prop"/>
        <CartStackPanel v-else-if="prop.panelName==='cart'" :prop="prop"/>
        <CalculateStackPanel v-else-if="prop.panelName==='calculate'" :prop="prop"/>
        <SearchStackPanel v-else-if="prop.panelName==='search'" :prop="prop"/>
        <AccountStackPanel v-else-if="prop.panelName==='account'" :prop="prop"/>
        <ChatListStackPanel v-else-if="prop.panelName==='chat_list'" :prop="prop"/>
        <ChatStackPanel v-else-if="prop.panelName==='chat'" :prop="prop"/>
        <InformationsListStackPanel v-else-if="prop.panelName==='information_list'" :prop="prop"/>
        <AuthorizationStackPanel v-else-if="prop.panelName==='authorize'" :prop="prop"/>
        <OrdersHistory v-else-if="prop.panelName==='orders'" :prop="prop"/>
        <CurrencyStackPanel v-else-if="prop.panelName==='currency'" :prop="prop"/>
        <EditProfileStackPanel v-else-if="prop.panelName==='edit-profile'" :prop="prop"/>
        <InformationStackPanel v-else-if="prop.panelName==='information'"  :prop="prop"></InformationStackPanel>
    </v-card>
</template>

<script>
    import CompareStackPanel from "./CompareStackPanel";
    import FavouriteStackPanel from "./FavouriteStackPanel";
    import CartStackPanel from "./CartStackPanel";
    import CalculateStackPanel from "./CalculateStackPanel";
    import eventBus from "../../utils/eventBus";
    import SearchStackPanel from "./SearchStackPanel";
    import AccountStackPanel from "./AccountStackPanel";
    import ChatListStackPanel from "./ChatListStackPanel";
    import InformationsListStackPanel from "./InformationsListStackPanel";
    import AuthorizationStackPanel from "./AuthorizationStackPanel";
    import OrdersHistory from "./OrdersHistory";
    import CurrencyStackPanel from "./CurrencyStackPanel";
    import ChatStackPanel from "./ChatStackPanel";
    import EditProfileStackPanel from "./EditProfileStackPanel";
    import InformationStackPanel from "./InformationStackPanel";

    export default {
        name: "StackPanel",
        props: ['prop'],
        data() {
            return {
                showActions: true,
            }
        },
        methods: {
            closeStackPanel() {
                eventBus.$emit('stack-panel-close');
            },
            goBack() {
                eventBus.$emit('stack-panel-pop');
            },
            onShowActionsChanged(value) {
                this.showActions = value;
            }
        },
        mounted() {
            eventBus.$on('show-actions-changed', this.onShowActionsChanged);
        },
        beforeDestroy() {
          eventBus.$off('show-actions-changed', this.onShowActionsChanged);
        },
        components: {
            InformationStackPanel,
            EditProfileStackPanel,
            ChatStackPanel,
            CurrencyStackPanel,
            OrdersHistory,
            AuthorizationStackPanel,
            InformationsListStackPanel,
            ChatListStackPanel,
            AccountStackPanel,
            SearchStackPanel,
            CalculateStackPanel,
            CartStackPanel,
            FavouriteStackPanel,
            CompareStackPanel}
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

    @media screen and (max-width: 640px) {
        .main__stack-panel-right {
            width: 100vw;
        }
    }
</style>
