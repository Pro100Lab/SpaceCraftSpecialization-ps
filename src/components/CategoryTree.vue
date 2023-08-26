<template>
    <v-treeview
            hoverable
            activatable
            style="cursor: pointer"
            :open.sync="openNodes"
            color="warning"
            :items="tree"
            :active.sync="active"

    >

    </v-treeview>
</template>

<script>
    import eventBus from "../utils/eventBus";
    export default {
        name: "CategoryTree",
        props: ['items'],
        data: () => {
            return {
                tree: [],
                active: [],
                openNodes: []
            }
        },
        watch: {
          items: function() {
              if(this.items.length > 0)
              {
                  this.tree = [];
                  this.openNodes = [];
                  this.buildTree();
              }
          },
            active: function(newActive) {
              console.log('new active: ', newActive)
              eventBus.$emit('category-parents-changed', newActive)
            }
        },
        methods: {
            buildTree() {
                let index = {};
                let delayedNodes = [];
                for(let item of this.items) {
                    const idx = item['@Category']
                    const parentIdx = item['Section']

                    let parentNode = index[parentIdx];

                    let node = {id: idx, name: `${idx}: ${item['Title']}`, section: parentIdx, children: []}

                    index[idx] = node;

                    if (parentIdx) {
                        if( this.openNodes.indexOf(parentIdx) === -1 )
                            this.openNodes.push(parentIdx);
                        if (parentNode)
                            parentNode.children.push(node);
                        else
                            delayedNodes.push(node);
                    }
                    else
                        this.tree.push(node);
                }
                for(let node of delayedNodes) {
                    index[node.section].children.push(node);
                }
            }
        }
    }

</script>

<style scoped>

</style>
