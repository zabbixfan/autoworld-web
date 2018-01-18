<template>
    <div class="panel">
        <panel-title title="首页">
        </panel-title>
        <div class="panel-body">
            <div class="hello">
            </div>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '../components/panelTitle'
    import bottomToolBar from '../components/bottomToolBar'
    export default {
        name: 'hello',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        components: {
            panelTitle,
            bottomToolBar
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1,
    h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

</style>
