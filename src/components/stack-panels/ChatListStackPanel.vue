<template>
    <v-list class="px-6">
        <template v-if="chats.length > 0">
        <div style="max-height: 60vh; overflow-y: auto">
            <template v-for="(chat, index) of chats">
                <v-divider v-if="index !== 0" :key="`app-item-divider-${index}`" class="ml-4"></v-divider>

                <v-list-item  :key="`chat-${chat['@Conversation']}`" v-on:click="openChat(chat['@Conversation'])">
                    <v-list-item-title>
                        Чат от {{chat.CreationDate}}
                    </v-list-item-title>
                    <v-list-item-icon>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </template>
        </div>
        </template>

        <template v-else>
            <v-list-item>
                <v-list-item-title class="text-center">
                    Нет активных чатов
                </v-list-item-title>
            </v-list-item>
        </template>
        <v-list-item class="rounded-b-pill elevation-4" style="background-color: #7e63ff;" dark link>
            <v-list-item-title class="text-center" v-on:click="createChat">
                Напишите нам по любому вопросу
            </v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script>
    import axios from "axios";
    import {getURL} from "../../utils/settings";
    import eventBus from "../../utils/eventBus";

    export default {
        name: "ChatListStackPanel",
        data: () => {
            return {
                chats: [],
                loading: true,
            }
        },
        beforeDestroy() {
            eventBus.$off('conversation-created', this.loadChatsList);
        },
        mounted() {
            this.loadChatsList();

            eventBus.$on('conversation-created', this.loadChatsList);
        },
        methods: {
            openChat(dialogId) {
                eventBus.$emit('stack-panel-push', 'chat', {dialogId: dialogId});
            },
            loadChatsList() {
                axios.get(getURL('docflow/conversation/my_list'), {withCredentials: true}).then(res => {
                    this.chats = res.data;
                })
            },
            createChat() {
                axios.post(getURL('docflow/conversation/create'), {
                    key: Math.floor(Math.random() * 1000)
                }, {withCredentials: true}).then(res => {
                    this.dialogId = res.data.conversation;
                    this.openChat(this.dialogId);
                })
            }
        }
    }
</script>

<style scoped>

</style>
