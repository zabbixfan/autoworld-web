<template>
    <div>
    <div class="panel" v-if='$route.meta.show'>

        <panel-title title="请选择工单类型"></panel-title>

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

    export default {
        data() {
            return {
//                options: [{
//                      value: 'projectapply',
//                      label: 'Onekit工程申请'
//                    }, {
//                      value: 'codehub',
//                      label: 'Codehub仓库申请'
//                    }],
                options: [{
                      value: 'projectapply',
                      label: 'Onekit工程申请'
                    }, {
                      value: 'projectrestart',
                      label: 'Onekit工程重启'
                    }, {
                      value: 'kvmapply',
                      label: 'KVM虚拟机申请'
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
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
