<template>
    <div class="panel">
        <panel-title title="KVM主机申请"></panel-title>
        <div class="panel-body">
        <div class="form-box" style="width: 50%" v-if="formShow">
          <el-alert
            style="margin-bottom: 30px;"
            title=""
            type="info"
            description="申请创建开发测试环境虚拟机"
            show-icon
            :closable="false">
          </el-alert>
            <el-form ref="form" :model="form" label-width="140px" :rules="rules">
                <el-form-item label="所属工程组" prop="projectGroupName">
                    <el-select v-model="form.projectGroupName" placeholder="工程组">
                        <el-option v-for="item in projectGroups" :label="item" :value="item" :key="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属环境" prop="projectEnv">
                    <el-select v-model="form.projectEnv" placeholder="请选择环境">
                        <el-option label="开发环境" value="DEV"></el-option>
                        <el-option label="测试环境" value="TEST"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="CPU" prop="vmCPU">
                    <el-col :span="10">
                        <el-input v-model.number="form.vmCPU" placeholder="默认2核">
                            <template slot="append">核</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="Memory" prop="vmMEM">
                    <el-col :span="10">
                        <el-input v-model.number="form.vmMEM" placeholder="请输入1024倍数">
                            <template slot="append">M</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="实例数" prop="vmInstances">
                    <el-input-number v-model="form.vmInstances" :min="1" :max="4"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" v-if="submitShow()" @click="onSubmit('form')">提交</el-button>
                    <el-button  type="success" v-if="auditShow()" @click="dialogFormVisible = true">审核</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogFormVisible">
              <el-form :model="auditForm">
                <el-form-item label="审核结果" >
                  <el-select v-model="auditForm.status" placeholder="请选择审核结果">
                      <el-option  label="驳回" value="Refuse"></el-option>
                      <el-option label="通过" value="Approve"></el-option>
                      <el-option label="完成" value="Complete"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="audit">确 定</el-button>
              </div>
            </el-dialog>
        </div>
        </div>
        <!--<div class="panel-body" v-show="logShow()">-->
            <!--<label style="margin-bottom: 100px">执行日志</label>-->
            <!--<el-steps :space="100" direction="vertical" :active="1" style="margin-top: 30px">-->
                <!--<el-step v-for="log in logs" :title="log" :key="log"></el-step>-->
            <!--</el-steps>-->
        <!--</div>-->
        <operate-log :tid="id"></operate-log>
    </div>
</template>

<script>
    import panelTitle from '../../../components/panelTitle'
    import bottomToolBar from '../../../components/bottomToolBar'
    import operateLog from '../../../components/operateLog'

    import * as http from '../../../http.js'
    import api from '../../../api'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                form: {
                    name: 'KVM虚拟机申请',
                    projectGroupName: '',
                    projectEnv: '',
                    vmMEM: 4096,
                    vmCPU: 2,
                    vmInstances: 1
                },
                auditForm: {
                    status: 'Approve'
                },
                projectGroups: [],
                dialogFormVisible: false,
                rules: {
                    name: [{ required: true, message: '请输入工单主题', trigger: 'blur' }],
                    projectGroupName: [{ required: true, message: '请选择工程组', trigger: 'change' }],
                    projectEnv: [{ required: true, message: '请选择环境', trigger: 'change' }],
                    vmCPU: [{type: 'number', message: '请输入正确的cpu核心数'}],
                    vmMEM: [{ required: true, type: 'number', message: '请输入正确的内存数', trigger: 'blur' }]
                },
                status: 'Apply',
                requestBody: {},
                id: this.$route.params.id
            }
        },
        components: {
            panelTitle,
            bottomToolBar,
            operateLog
        },
        computed: {
            ...mapGetters(['userRole']),
            formShow: function () {
                var index = this.$route.path.indexOf('/ticketlist')
                if (index === -1) {
                    return true
                } else if (this.form.name && index === 0) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            getProjectGroup() {
                http.fetch(api.ProjectGroups).then(res => {
                    this.projectGroups = res.data
                })
            },
            auditShow() {
                var index = this.$route.path.indexOf('/ticketlist')
                if (this.userRole === 'admin' && index === 0 && this.status !== 'Complete') {
                    return true
                } else {
                    return false
                }
            },
            submitShow() {
                if (this.status === '' || this.status === 'Apply' || this.status === 'Refuse') {
                    return true
                } else {
                    return false
                }
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        if (JSON.stringify(this.requestBody) === '{}') {
                            this.requestBody = {
                                    'name': this.form.name,
                                    'ticketType': 'createKvmVm',
                                    'status': 'Apply',
                                    'data': this.form
                            }
                        }
                        if (this.id) {
                            http.put(api.Ticket(this.id), this.requestBody).then(data => {
                                this.$message.success('提交成功！')
                                this.onCancel()
                            })
                        } else {
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
            onCancel() {
                this.$router.push({
                    path: '/ticketlist'
                })
            },
            getTicketInfo() {
                http.fetch(api.Ticket(this.id)).then(data => {
                    this.form.name = data.data.data.name
                    this.form.projectEnv = data.data.data.projectEnv
                    this.form.projectGroupName = data.data.data.projectGroupName
                    this.form.vmCPU = data.data.data.vmCPU
                    this.form.vmMEM = data.data.data.vmMEM
                    this.form.vmInstances = data.data.data.vmInstances
                    this.status = data.data.status
                })
            },
            audit() {
                this.dialogFormVisible = false
                this.requestBody = {
                    'name': this.form.name,
                    'ticketType': 'createKvmVm',
                    'status': this.auditForm.status,
                    'data': this.form
                }
                this.onSubmit('form')
            }
        },
        created() {
            this.getProjectGroup()
            if (Boolean(this.id) === true) {
                  this.getTicketInfo()
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
