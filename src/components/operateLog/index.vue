<template>
    <div class="panel-body" v-show="logShow()">
        <label style="margin-bottom: 100px">执行日志</label>
        <el-steps :space="100" direction="vertical" :active="1" style="margin-top: 30px">
            <el-step v-for="log in logs" :title="log" :key="log"></el-step>
        </el-steps>
    </div>
</template>
<script>
    import * as http from '../../http'
    import api from '../../api'
    export default {
        data: function () {
            return {
                logs: []
            }
        },
        props: {
            tid: {
                type: String
            }
        },
        methods: {
            getLog() {
                http.fetch(api.ticketLogs(this.tid)).then(res => {
                    this.logs = res.data.map(item => {
                        return item.time + ': ' + item.status
                    })
                })
            },
            logShow() {
                if (this.tid) {
                    return true
                } else {
                    return false
                }
            }
        },
        created() {
            this.getLog()
        }
    }
</script>
<style>

</style>
