<template>
    <div class="container">
                   <el-select
                    ref="serverSelect"
                    v-model="envForm.servers"
                    filterable
                    remote
                    multiple
                    :remote-method="remoteMethod">
                    <el-option
                      v-for="item in serverList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
    </div>
</template>
<script>
    import * as http from '../../http'
    import api from '../../api'
    export default {
        data() {
            return {
                projectId: this.$route.params.id,
                project: {
                    name: '',
                    group: {
                        name: ''
                    }
                },
                saveProjectVisible: false,
                saveProjectForm: {},
                managerInfo: {},
                EnvFormVisible: false,
                envForm: {
                    envType: '',
                    envCode: 'default',
                    servers: []

                },
                serverOptions: [],
                isRun: false,
                servers: []
            }
        },
        computed: {
            serverList: function () {
                return this.serverOptions.map(item => {
                    return { value: item.id, label: item.internalIp }
              })
            }
        },
        methods: {
            searchServers(kw) {
                console.log(kw)
                http.fetch(api.servers, {
                    'keyword': kw + '*',
                    'dataTake': '65535'
                }).then(res => {
                    this.serverOptions = res.data.dataList
                    console.log(this.serverOptions)
                })
            },
            remoteMethod(query) {
                if (!this.isRun) {
                    this.isRun = true
                    let local = this
                    setTimeout(function () {
                        local.searchServers(local.$refs['serverSelect'].query)
                        local.isRun = false
                    }, 1000)
                }
            },
            clearOption() {
                this.serverOptions = []
            }
        }
    }

</script>
<style>

  .el-row {
    margin-top: 20px;
  }
  .el-col {
    border-radius: 4px;
  }




</style>
