<template>
    <div class="panel">
        <panel-title title="日志查看申请"></panel-title>
        <div class="panel-body">
            <div class="form-box" style="width: 50%" v-if="formShow">
                <el-alert
                    style="margin-bottom: 30px;"
                    title=""
                    type="info"
                    description="请输入表单中的内容"
                    show-icon
                    :closable="false">
                </el-alert>
                <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码" prop="identity_card">
                        <el-input v-model="form.identity_card"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="telephone">
                        <el-input v-model="form.telephone"></el-input>
                    </el-form-item>
                    <el-form-item label="公司" prop="company">
                        <el-input v-model="form.company"></el-input>
                    </el-form-item>
                    <el-form-item label="进出机房事由" prop="reason">
                        <el-input v-model="form.reason"></el-input>
                    </el-form-item>
                    <el-form-item label="进出机房时间" prop="time">
                        <el-input v-model="form.time"></el-input>
                    </el-form-item>
                    <el-form-item label="访问区域" prop="area">
                        <el-input v-model="form.area"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" v-if="submitShow()" @click="onSubmit('form')">提交</el-button>
                        <el-button  type="success" v-if="auditShow()" @click="auditDialogVisible = true">审核</el-button>
                        <el-button  @click="onCancel">取消</el-button>
                    </el-form-item>
                </el-form>
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
                    name: '',
                    identity_card: '',
                    telephone: '',
                    company: '',
                    reason: '',
                    time: '',
                    area: ''
                },
                status: '',
                rules: {
                    name: [{ required: true, message: '请输入访问人姓名', trigger: 'blur' }],
                    identity_card: [
                        { required: true, message: '身份证输入有误', trigger: 'change' },
                        { pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '证件号码格式有误！', trigger: 'blur' }
                        ],
                    telephone: [
                        { required: true, message: '请输入访问人联系电话', trigger: 'blur' },
                        {pattern: /(^1[345678]\d{9}|\d{8}$)/, message: '手机号码格式有误！', trigger: 'blur'}

                    ],
                    company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
                    reason: [{ required: true, message: '请输入进出事由', trigger: 'blur' }],
                    time: [{ required: true, message: '请输入进入时间', trigger: 'blur' }],
                    area: [{ required: true, message: '请输入访问区域', trigger: 'blur' }]
                },
                auditDialogVisible: false,
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
                } else if (index === 0 && this.form.name) {
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
                if (this.userLoginName === this.request_man || this.request_man === '') {
                    return true
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
                        if (this.id) {
                            this.requestBody = {
                                    'type': 'dcrecord',
                                    'data': this.form,
                                    'user': this.userLoginName,
                                    'action': this.action,
                                    'comment': this.comment
                            }
                            var myDate = new Date()
                            console.log(myDate.toLocaleString())
                            console.log(this.requestBody)
                            http.put(api.Ticket(this.id), this.requestBody).then(data => {
                                this.$message.success('提交成功！')
                                this.onCancel()
                            })
                        } else {
                            this.requestBody = {
                                    'type': 'dcrecord',
                                    'data': this.form,
                                    'request_man': this.userLoginName
                            }
                            http.post(api.Tickets, this.requestBody).then(data => {
                                this.$message.success('提交成功！')
                                this.onCancel()
                            })
                        }
                    } else {
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
            getTicketInfo() {
                http.fetch(api.Ticket(this.id)).then(data => {
                    if (data.status) {
                        this.form = data.data
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
            if (Boolean(this.id) === true) {
                  this.getTicketInfo()
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
