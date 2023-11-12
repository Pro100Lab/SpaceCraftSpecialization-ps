<template>
    <task-conversation
            :idx="prop.dialogId"
            schema="light"
            full-width="true"
            start-dialog-text="Чем я могу помочь?"
            :disable-receivers="true"
    ></task-conversation>
</template>

<script>
    import TaskConversation from "../products/utils/Conversation";
    export default {
        name: "ChatStackPanel",
        props: ['prop'],
        components: {TaskConversation}
    }
</script>

<style scoped>

</style>
