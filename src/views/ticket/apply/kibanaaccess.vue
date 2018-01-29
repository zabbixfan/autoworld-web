<template>
    <div class="panel">
        <panel-title title="日志查看申请"></panel-title>
        <div class="panel-body">
            <div class="form-box" style="width: 50%" v-if="formShow">
                <el-alert
                    style="margin-bottom: 30px;"
                    title=""
                    type="info"
                    description="选择需要查看的日志索引，及过期时间"
                    show-icon
                    :closable="false">
                </el-alert>
                <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                    <el-form-item label="索引名称" prop="es_index">
                        <el-select v-model="form.es_index" multiple placeholder="请选择" :disabled="data_disable">
                            <el-option
                            v-for="item in index_list"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请期限" prop="effective_time">
                        <el-select v-model="form.effective_time" placeholder="请选择" :disabled="data_disable">
                            <el-option
                            v-for="item in effective_time_list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" v-if="submitShow()" @click="submitDialogVisible = true">提交</el-button>
                        <el-button  type="success" v-if="auditShow()" @click="auditDialogVisible = true">审核</el-button>
                        <el-button  @click="onCancel">取消</el-button>
                    </el-form-item>
                </el-form>
                <el-dialog
                    width="20%"
                    title="提示"
                    :visible.sync="submitDialogVisible"
                    >
                    <span>需要查看的日志索引是:</span>
                    <li v-for="item in form.es_index" :key="item">
                        <span>{{item}}</span>
                    </li>
                    <span>是否提交</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="submitDialogVisible = false">取 消</el-button>
                        <el-button type="primary"  @click="onSubmit('form')">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog :visible.sync="auditDialogVisible">
                <el-form>
                    <el-form-item label="审核结果" >
                    <el-select v-model="auditor_result" placeholder="请选择审核结果">
                        <el-option label="通过" value='agree'></el-option>
                        <el-option label="驳回" value='disagree'></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="评论" label-width='68px'>
                        <el-input type="textarea" v-model="comment" :rows="3"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :disabled="auditor_disable" @click="on_audit">确 定</el-button>
                </div>
                </el-dialog>
            </div>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '@/components/panelTitle'
    import bottomToolBar from '@/components/bottomToolBar'
    import * as http from '../../../http.js'
    import api from '../../../api'
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                requestBody: {},
                form: {
                    es_index: [],
                    effective_time: ''
                },
                status: '',
                index_list: [],
                effective_time_list: [
                    {'label': '1天', 'value': 1},
                    {'label': '1周', 'value': 7},
                    {'label': '1月', 'value': 30},
                    {'label': '1年', 'value': 365},
                    {'label': '长期', 'value': 9999}
                ],
                rules: {
                    es_index: [{ required: true, message: '请选择日志索引', trigger: 'change' }],
                    effective_time: [
                        { required: true, message: '请选择有效期限', trigger: 'change' }
                    ]
                },
                auditDialogVisible: false,
                submitDialogVisible: false,
                id: this.$route.params.id,
                auditor_result: '',
                auditors: [],
                request_man: '',
                action: 'submit',
                comment: ' ',
                auditor_disable: true
            }
        },
        components: {
            panelTitle,
            bottomToolBar
        },
        computed: {
            formShow: function () {
                var index = this.$route.path.indexOf('/ticketlist')
                if (index === -1) {
                    return true
                } else if (index === 0 && this.form.effective_time) {
                    return true
                } else {
                    return false
                }
            },
            data_disable() {
                return !this.submitShow()
            },
            ...mapGetters(['userLoginName'])
        },
        methods: {
            submitShow() {
                if (this.status === '' || this.status === 'refuse' || this.status === 'apply') {
                    if (this.userLoginName === this.request_man || this.request_man === '') {
                         return true
                    } else {
                        return false
                    }
                } else {
                    return false
                }
            },
            auditShow() {
                var index = this.$route.path.indexOf('/ticketlist')
                if (index === 0 && this.auditors.indexOf(this.userLoginName) !== -1) {
                    return true
                } else {
                    return false
                }
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // if (JSON.stringify(this.requestBody) === '{}') {
                        //     this.requestBody = {
                        //             'type': 'kibanaaccess',
                        //             'data': this.form,
                        //             'request_man': this.userLoginName
                        //     }
                        // }
                        if (this.id) {
                            this.requestBody = {
                                    'type': 'kibanaaccess',
                                    'data': this.form,
                                    'user': this.userLoginName,
                                    'action': this.action,
                                    'comment': this.comment
                            }
                            var myDate = new Date()
                            console.log(myDate.toLocaleString())
                            http.put(api.Ticket(this.id), this.requestBody).then(data => {
                                this.$message.success('提交成功！')
                                this.onCancel()
                            })
                        } else {
                            this.requestBody = {
                                    'type': 'kibanaaccess',
                                    'data': this.form,
                                    'request_man': this.userLoginName
                            }
                            http.post(api.Tickets, this.requestBody).then(data => {
                                this.$message.success('提交成功！')
                                this.onCancel()
                            })
                        }
                    } else {
                        this.submitDialogVisible = false
                        return false
                    }
                })
            },
            on_audit() {
                this.action = this.auditor_result
                this.auditDialogVisible = false
                this.onSubmit('form')
            },
            onCancel() {
                this.$router.push({
                    path: '/ticketlist'
                })
            },
            get_index_list: function() {
                if (this.index_list.length === 0) {
                    http.fetch(api.esIndexList, {}).then(data => {
                        this.index_list = data.indices
                    })
                }
            },
            getTicketInfo() {
                http.fetch(api.Ticket(this.id)).then(data => {
                    if (data.status) {
                        this.form.es_index = data.data.es_index
                        this.form.effective_time = data.data.effective_time
                        this.status = data.status
                        this.auditors = data.auditor
                        this.request_man = data.requestMan
                    } else {
                        this.$router.push({
                            path: '/404'
                        })
                    }

                })
            }
        },
        watch: {
            auditor_result(curVal, oldVal) {
                if (this.auditor_result) {
                    this.auditor_disable = false
                }
            }
        },
        created() {
            this.get_index_list()
            if (Boolean(this.id) === true) {
                  this.getTicketInfo()
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
