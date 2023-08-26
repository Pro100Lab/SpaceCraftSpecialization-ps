<template>
    <div>
        <v-card-title class="ma-0 pa-0">{{title}}</v-card-title>
        <el-tiptap v-model="content"  :extensions="extensions" />
    </div>
</template>

<script>
    import {
        // necessary extensions
        Doc,
        Text,
        Paragraph,
        Heading,
        Bold,
        Underline,
        Italic,
        Strike,
        Code,
        Link,
        Image,
        Blockquote,
        ListItem,
        BulletList,
        OrderedList,
        TodoItem,
        TodoList,
        TextAlign,
        Indent,
        HardBreak,
        HorizontalRule,
        Fullscreen,
    } from 'element-tiptap';
    export default {
        name: "RichEditorField",
        props: ['value', 'title'],
        data () {
            // editor extensions
            // they will be added to menubar and bubble menu by the order you declare.
            return {
                extensions: [
                    new Doc(),
                    new Text(),
                    new Paragraph(),
                    new Heading({ level: 5 }),
                    new Bold({ bubble: true }),
                    new Underline({ bubble: true }),
                    new Italic({ bubble: true }),
                    new Strike({ bubble: true }),
                    new Code(),
                    new Link({ bubble: true }),
                    new Image(),
                    new Blockquote(),
                    new TextAlign(),
                    new ListItem(),
                    new BulletList({ bubble: true }),
                    new OrderedList({ bubble: true }),
                    new TodoItem(),
                    new TodoList(),
                    new Indent(),
                    new HardBreak(),
                    new HorizontalRule({ bubble: true }),
                    new Fullscreen(),
                ],
                content: this.value
            };

        },
        mounted() {

        },
        destroyed() {
          this.content = null;
        },
        methods: {
            handleInput () {
                this.$emit('input', this.content)
            }
        },
        watch: {
            content() {
              this.handleInput();
            },
            value(text) {
                if(text!==this.content)
                    this.content = text;
            }
        }
    }
</script>

<style scoped>

</style>
