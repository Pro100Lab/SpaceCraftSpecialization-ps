<template>
    <div class="d-flex flex-column justify-space-between px-2">
        <v-card-actions>
            <v-card-subtitle>В диалоге:</v-card-subtitle>
            <mini-profile v-for="participant of participants"
                          :key="`conv-pariticpant-${participant}`"
                          :idx="participant"
                          size="16"
                          :show-role="true"
            >

            </mini-profile>
        </v-card-actions>
        <v-list color="transparent" :style="{'height': fullWidth ? '60vh' : '20vh', 'overflow-y': 'auto'}">
            <template v-if="conversation.length > 0">
                <v-list-item v-for="msg of conversation"
                             :key="msg['@ConversationMessage']"
                             :style="{'cursor' : disableReceivers ? '' : 'pointer'}"
                             :id="`msg-${msg['@ConversationMessage']}`"
                >
                    <v-list-item-content class="py-0" v-on:click="receivers = disableReceivers ? [] : [msg.UserFrom]">
                        <v-sheet color="transparent">
                            <v-card-subtitle v-if="showDateTime" class="pa-0">{{msg.DateTime.slice(0, 20)}}</v-card-subtitle>
                            <div class="d-flex flex-row align-center">
                                <mini-profile :idx="msg.UserFrom"
                                              :size="32"
                                              :show-role="false"
                                ></mini-profile>
                                <v-card-subtitle class="pa-0 ">
                                    <v-icon v-if="msg.UsersTo && msg.UsersTo.length > 0">mdi-arrow-right</v-icon>{{msg.Action}}
                                </v-card-subtitle>
                                <mini-profile
                                        v-for="userTo of msg.UsersTo"
                                        :key="`msg-${msg['@ConversationMessage']}-userto-${userTo}}`"
                                        :idx="userTo" :size="32"
                                        :show-role="false"
                                >

                                </mini-profile>
                            </div>
                            <v-card-subtitle
                                    class="py-0 rounded-xl rounded-tl-0"
                                    :style="{'background-color': schema === 'light' ? 'lightgray!important' : 'white!important'}"
                                    v-html="msg['Text']">
                            </v-card-subtitle>
                        </v-sheet>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <template v-else>
                <p class="text-center" v-html="startDialogText ? startDialogText : 'Начните диалог'"></p>
            </template>
        </v-list>
        <v-select placeholder="Выберите получателей"
                  v-if="!disableReceivers"
                  color="green"
                  item-color="green"
                  multiple
                  dense
                  hide-details
                  prepend-icon="mdi-account"
                  :items="employees"
                  v-model="receivers"
                  item-value="@User"
                  item-text="Name"></v-select>
        <div class="d-flex flex-row justify-center align-center py-1">
            <v-text-field
                    class="rounded-xl"
                    hide-details
                    outlined
                    color="green"
                    style="background: white"
                    dense
                    v-model="writtenText"
                    placeholder="Напишите сообщение.."
                    v-on:keyup.enter="sendMessage"
            ></v-text-field>
            <v-icon v-on:click="sendMessage" :color="writtenText ? 'green' : 'gray'" class="ml-4">mdi-send-variant</v-icon>
        </div>
    </div>

</template>

<script>
    import axios from 'axios';
    import {getURL, getWSSUrl} from "../../../utils/settings";
    import MiniProfile from "./MiniProfile";
    import eventBus from "../../../utils/eventBus";

    export default {
        name: "TaskConversation",
        components: {MiniProfile},
        props: ['idx', 'disableReceivers', 'startDialogText', 'schema', 'showDateTime', 'fullWidth'],
        data: () => {
            return {
                conversation: [],
                writtenText: null,
                receivers: [],
                participants: [],
                employees: [],
                shouldUpdate: false,
                websocket: null
            }
        },
        mounted() {
            this.loadConversation();
            this.loadEmployees();
            this.makeSocket();
        },
        updated() {
            if(this.conversation.length > 0 && this.shouldUpdate)
            {
                const lastMessage = this.conversation[this.conversation.length - 1];
                const lastMessageId = `msg-${lastMessage['@ConversationMessage']}`;
                const lastMessageElement = document.getElementById(lastMessageId);
                console.log('last id: ', lastMessageId)
                if(lastMessageElement) {
                    console.log('has element')
                    lastMessageElement.scrollIntoView({block: "nearest", inline: "nearest"});
                    this.shouldUpdate = false;
                }
            }
        },
        beforeDestroy() {
            if(this.websocket) {
                this.websocket.close();
                this.websocket = null;
            }
        },
        methods: {
            makeSocket() {
              this.websocket = new WebSocket(getWSSUrl('ws'));
              this.websocket.onopen = (e) => {
                  console.log('socket opened ', e);
              };

              this.websocket.onclose  = (e) => {
                  console.log('socket closed ', e);
              };

              this.websocket.onerror = (e) => {
                  console.log('socket on error', e)
              }

              this.websocket.onmessage = (e) => {
                  const ws_message = e.data;
                  let msg_tokens = ws_message.split(':');
                  if(msg_tokens
                      && msg_tokens.length === 2
                      && msg_tokens[0] === 'chat-updated'
                      && msg_tokens[1] === String(this.idx) ) {
                      this.loadConversation();
                  }
                  console.log('socket on message ', e.data)
              }
            },
            loadEmployees() {
                axios.get(getURL('admin/user_list')).then(res => {
                    this.employees = res.data;
                })
            },
            loadConversation() {
                if(this.idx)
                    axios.get(getURL(`docflow/conversation/${this.idx}`), {withCredentials: true}).then(res => {
                        if(res.data.Messages && this.conversation.length !== res.data.Messages)
                            this.shouldUpdate = true;
                        this.conversation = res.data.Messages || [];
                        this.participants = res.data.Participants || [];
                    })
            },
            sendMessage() {
                axios.post(getURL('docflow/conversation/send_message'), {
                    user: window.localStorage.getItem('userId'),
                    index: this.idx,
                    receivers: this.receivers,
                    text: this.writtenText,
                    key: this.$route.params.product_id,
                    content: []
                }, {withCredentials: true}).then(() => {
                    if(this.conversation.length > 1) {
                        // Чат создаётся только после того, как напишет сам пользователь,
                        // До этого момента в диалоге только 1 сообщение - от менеджера
                        eventBus.$emit('conversation-created');
                    }
                    this.loadConversation();
                    this.writtenText = null
                })
            },
        },
        watch: {
            idx: function() {
                  this.loadConversation();
            }
        }
    }
</script>

<style scoped>

</style>
