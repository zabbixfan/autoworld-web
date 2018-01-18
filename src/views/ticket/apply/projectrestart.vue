<template>
    <div class="panel">
        <panel-title title="Onekit工程重启申请"></panel-title>
        <div class="panel-body">
        <div class="form-box" v-if="formShow">
          <el-alert
            style="margin-bottom: 30px;"
            title="注意"
            type="info"
            description="此工单可以重启非线上环境onekit工程，现阶段工单提交后自动重启选中服务，单个工单最多重启2个服务，请谨慎选择"
            show-icon
            :closable="false">
          </el-alert>
            <el-form ref="form" :rules="rules" :model="form">
                <!--<el-form-item label="工单主题" prop="name">-->
                    <!--<el-col :span="12">-->
                        <!--<el-input v-model="form.name" placeholder="工单相关描述" labelWidth="80px"></el-input>-->
                    <!--</el-col>-->
                <!--</el-form-item>-->
                <el-form-item label="" prop="restartProject">
                    <el-transfer
                        filterable
                        :filter-method="filterMethod"
                        filter-placeholder="以工程首字母开始进行搜索"
                        v-model="form.restartProject"
                        :data="sourceService"
                        :titles="transTitle">
                    </el-transfer>
                </el-form-item>
                <el-form-item>
                    <el-button  v-if="submitShow()" type="primary" @click="submitVisible=true">提交</el-button>
                    <el-button  type="success" v-if="auditShow()" @click="dialogFormVisible = true">审核</el-button>
                    <el-button  @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogFormVisible">
              <el-form :model="auditForm">
                <el-form-item label="审核结果" >
                  <el-select v-model="auditForm.status" placeholder="请选择审核结果">
                    <el-option v-if="statusShow()" label="通过" value="Approve"></el-option>
                    <el-option v-if="statusShow()" label="驳回" value="Refuse"></el-option>
                    <el-option label="完成" value="Complete"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="audit">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog
              title="提示"
              :visible.sync="submitVisible"
              size="tiny"
            >
              <span>选择重启的服务是:</span>
              <li v-for="item in form.restartProject">
                  <span>{{item}}</span>
              </li>
              <span>是否重启</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="submitVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
              </span>
            </el-dialog>
        </div>
        </div>
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
                    restartProject: [],
                    name: 'onekit服务重启'
                },
                id: this.$route.params.id,
                status: 'Apply',
                sourceService: [],
                transTitle: ['待选择服务', '已选择需要重启服务'],
                rules: {
                    name: [{ required: true, message: '请输入工单主题', trigger: 'blur' }]
                },
                auditForm: {
                    status: ''
                },
                dialogFormVisible: false,
                submitVisible: false,
                requestBody: {},
                logs: []
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
            onSubmit(formName) {
                this.submitVisible = false
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (JSON.stringify(this.requestBody) === '{}') {
                            this.requestBody = {
                                    'name': this.form.name,
                                    'ticketType': 'restartProject',
                                    'status': 'Approve',
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
            getServices() {
                http.fetch(api.Services, {
                    'limit': -1,
                    'env': ['TEST', 'DEV', 'BETA'],
                    'status': 'all'
                }).then(data => {
                    this.sourceService = data.data.Datalist.map(item => {
                        return { key: item.project + '/' + item.env + '/' + item.ip, label: item.project + '/' + item.env + '/' + item.ip }
                    })
                })
            },
            filterMethod(query, item) {
                return item.label.toLowerCase().startsWith(query.toLowerCase())
            },
            onCancel() {
                this.$router.push({
                    path: '/ticketlist'
                })
            },
            getTicketInfo() {
                http.fetch(api.Ticket(this.id)).then(data => {
                    this.form.name = data.data.data.name
                    this.form.restartProject = data.data.data.restartProject
                    this.status = data.data.status
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
            statusShow() {
                if (this.status === '' || this.status === 'Apply') {
                    return true
                } else {
                    return false
                }
            },
            audit() {
                this.dialogFormVisible = false
                this.requestBody = {
                    'name': this.form.name,
                    'ticketType': 'restartProject',
                    'status': this.auditForm.status,
                    'data': this.form
                }
                this.onSubmit('form')
            },
            handleClose(done) {
                this.$confirm('确认提交？').then(_ => {
                    done()
                }).catch(_ => {})
            }
        },
        created() {
            this.getServices()
            if (Boolean(this.id) === true) {
                  this.getTicketInfo()
            }
        }

    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .el-transfer-panel {
        width: 380px;
    }


</style>
