<template>
    <div>
    <div class="panel" v-if='$route.meta.show'>
        <panel-title title="请选择操作内容"></panel-title>

        <div class="panel-body" >
              <el-select v-model="pathvalue"  placeholder="请选择" @change="buttonShow">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                <el-button type="primary" v-bind:disabled="isShow"  @click="goto">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
        <router-view></router-view>

    </div>
</template>

<script>
    import panelTitle from '../../components/panelTitle'
    import bottomToolBar from '../../components/bottomToolBar'
    import {
        mapGetters
    } from 'vuex'
    import {
    Message
    } from 'element-ui'
    export default {
        data() {
            return {
                options: [{
                      value: 'creategroup',
                      label: '创建工程组'
                    }, {
                      value: 'kvmmanager',
                      label: 'KVM虚拟机管理'
                    }],
                pathvalue: '请选择',
                isShow: true

            }
        },
        components: {
            panelTitle,
            bottomToolBar
        },
        methods: {
            buttonShow() {
                this.isShow = false
            },
            goto() {
                this.$router.push({path: this.pathvalue})
            }
        },
        computed: {
            ...mapGetters(['userRole'])
        },
        mounted() {
            if (this.userRole !== 'admin') {
                Message.info('没有权限操作')
                this.$router.push({path: '/'})
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
