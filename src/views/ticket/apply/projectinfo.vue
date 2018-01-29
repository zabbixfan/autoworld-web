<template>
    <div class="panel">
        <panel-title title="Onekit工程申请"></panel-title>
        <div class="panel-body">
        <div class="form-box" style="width: 50%" v-if="formShow">
          <el-alert
            style="margin-bottom: 30px;"
            title=""
            type="info"
            description="填写创建onekit工程所需信息，审核后将会自动创建同名git仓库"
            show-icon
            :closable="false">
          </el-alert>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <!--<el-form-item label="工单主题" prop="name">-->
                    <!--<el-input v-model="form.name" placeholder="工单相关描述"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="工程名称" prop="projectName">
                    <el-input v-model="form.projectName" placeholder="Onekit工程名"></el-input>
                </el-form-item>
                <el-form-item label="工程组" prop="projectGroupName">
                    <el-select v-model="form.projectGroupName" placeholder="工程组">
                        <el-option label="A项目" value="a"></el-option>
                        <el-option label="B项目" value="b"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工程类型" prop="projectType">
                    <el-select v-model="form.projectType" placeholder="请选择工程类型">
                        <el-option label="Java（War）项目" value="Java:War"></el-option>
                        <el-option label="Java（HttpJar）项目" value="Java:HttpJar"></el-option>
                        <el-option label="Java（Jar）项目" value="Java:Jar"></el-option>
                        <el-option label="Web 前端项目" value="FrontEnd"></el-option>
                        <el-option label="Android" value="Android"></el-option>
                        <el-option label="IOS" value="IOS"></el-option>
                        <el-option label=".Net 项目" value="DotNet"></el-option>
                        <el-option label="Python（Flask）项目" value="Python:Flask"></el-option>
                        <el-option label="其他" value="Other"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人" prop="owner">
                    <el-input v-model="form.owner" placeholder="责任人"></el-input>
                </el-form-item>
                <el-form-item label="正式域名" prop="domainName">
                    <el-col :span="13">
                        <el-input v-model="form.domainName" placeholder="无需域名此处留空">
                            <template slot="append">.apitops.com</template>
                        </el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="是否创建代码仓库">
                    <el-switch
                      v-model="form.createGit"
                      on-text=""
                      off-text=""
                      on-value="true"
                      off-value="false">
                    </el-switch>
                </el-form-item>
                <el-form-item label="工程描述">
                    <el-input type="textarea" v-model="form.projectDescription" placeholder="工程简单描述，中文名称等"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" v-if="submitShow()" @click="onSubmit('form')">提交</el-button>
                    <el-button  type="success" v-if="auditShow()" @click="dialogFormVisible = true">审核</el-button>
                    <el-button  @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogFormVisible">
              <el-form :model="auditForm">
                <el-form-item label="审核结果" >
                  <el-select v-model="auditForm.status" placeholder="请选择审核结果">
                      <el-option v-if="statusShow()" label="驳回" value="Refuse"></el-option>
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
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '../../../components/panelTitle'
    import mainContent from '../../../components/mainContent'
    import bottomToolBar from '../../../components/bottomToolBar'
    import UserSelect from '../../../components/userSelect'
    import * as http from '../../../http.js'
    import api from '../../../api'
    import {
        mapGetters
    } from 'vuex'
    import ElOption from '../../../../node_modules/element-ui/packages/select/src/option'
    export default {
        data() {
            return {
                dialogFormVisible: false,
                formLabelWidth: '50px',
                id: this.$route.params.id,
                status: 'Apply',
                form: {
                    name: 'onekit服务创建',
                    projectName: '',
                    projectGroupName: '',
                    projectType: '',
                    owner: '',
                    projectDescription: '',
                    domainName: '',
                    createGit: 'true'
                },
                auditForm: {
                    status: 'Approve'
                },
                rules: {
                    name: [{ required: true, message: '请输入工单主题', trigger: 'blur' }],
                    projectName: [{ required: true, message: '请输入工程名称', trigger: 'blur' }],
                    projectGroupName: [{ required: true, message: '请选择工程组', trigger: 'change' }],
                    projectType: [{ required: true, message: '请选择工程类型', trigger: 'change' }],
                    owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
                },
                requestBody: {},
                projectGroups: []
            }
        },
        components: {
            ElOption,
            panelTitle,
            mainContent,
            bottomToolBar,
            UserSelect
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
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (JSON.stringify(this.requestBody) === '{}') {
                            this.requestBody = {
                                    'name': this.form.name,
                                    'ticketType': 'createProject',
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
                    this.form.projectName = data.data.data.projectName
                    this.form.projectGroupName = data.data.data.projectGroupName
                    this.form.projectType = data.data.data.projectType
                    this.form.owner = data.data.data.owner
                    this.form.domainName = data.data.data.domainName
                    this.form.projectDescription = data.data.data.projectDescription
                    this.form.createGit = data.data.data.createGit
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
                    'ticketType': 'createProject',
                    'status': this.auditForm.status,
                    'data': this.form
                }
                this.onSubmit('form')
            },
            getProjectGroup() {
                http.fetch(api.ProjectGroups).then(res => {
                    this.projectGroups = res.data
                })
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
