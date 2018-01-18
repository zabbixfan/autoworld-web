<template>
    <div class="panel">
        <panel-title title="工程组创建"></panel-title>
        <div class="panel-body">
        <div class="form-box" style="width: 60%">
          <el-alert
            style="margin-bottom: 30px;"
            title=""
            type="info" description="用于创建cmdb组及codehub组,选择cmdb组默认创建onekit组"
            show-icon
            :closable="false">
          </el-alert>
            <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                <el-form-item label="组名称" prop="name">
                    <el-input v-model="form.name" placeholder="工程组名称"></el-input>
                </el-form-item>
                <el-form-item label="组类型" prop="groupType">
                    <el-radio class="radio" v-model="form.groupType" label="all">全部</el-radio>
                    <el-radio class="radio" v-model="form.groupType" label="cmdb">cmdb</el-radio>
                    <el-radio class="radio" v-model="form.groupType" label="codehub">codehub</el-radio>
                </el-form-item>
                <el-form-item v-if="cmdbShow()" label="组负责人" prop="leader">
                    <user-select v-model="form.leader"></user-select>
                </el-form-item>
                <el-form-item v-if="codehubShow()" label="codehub path" prop="groupPath">
                        <el-input v-model="form.groupPath" placeholder="codehub组路径">
                        </el-input>
                </el-form-item>
                <el-form-item v-if="codehubShow()" label="代码组成员" prop="members">
                   <el-select
                    v-model="form.members"
                    multiple
                    filterable
                    remote
                    placeholder="请输入该代码组成员"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                      v-for="item in searchList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <el-button  type="success" @click="dialogFormVisible = true">创建</el-button>
            <el-button  @click="onCancel">取消</el-button>
            <el-dialog :visible.sync="dialogFormVisible">
                <span>确认是否创建</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="audit()">确 定</el-button>
                </span>
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
                form: {
                    name: '',
                    groupType: '',
                    leader: '',
                    groupPath: '',
                    members: []
                },
                auditForm: {
                    status: 'Approve'
                },
                rules: {
                    name: [{ required: true, message: '请输入组名称', trigger: 'blur' }],
                    groupType: [{ required: true, message: '请选择组类型', trigger: 'blur' }],
                    leader: [{ required: true, message: '请输入组负责人', trigger: 'change' }],
                    groupPath: [{ required: true, message: '请输入codehub组路径', trigger: 'change' }],
                    members: [{ required: true, type: 'array', message: '请输入代码组开发人员', trigger: 'blur' }]
                },
                requestBody: {},
                loading: false,
                userOptions: []
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
            searchList: function () {
                return this.userOptions.map(item => {
                    return { value: item.loginName, label: item.name }
              })
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let requestBody = {
                                'name': this.form.name,
                                'groupType': this.form.groupType,
                                'groupPath': this.form.groupPath,
                                'leader': this.form.leader,
                                'members': this.form.members
                            }
                        http.post(api.ProjectGroups, requestBody).then(data => {
                            this.$message.success('提交成功！')
                            this.onCancel()
                        })
                    }
                })
            },
            onCancel() {
                this.$router.push({
                    path: '/ticketlist'
                })
            },
            searchUser(kw) {
                http.fetch(api.searchUser, {
                    'keyword': kw
                }).then(data => {
                    this.loading = false
                    this.userOptions = data.data.searchData
                })
            },
            remoteMethod(query) {
                this.loading = true
                this.searchUser(query)
            },
            cmdbShow() {
                if (this.form.groupType === 'all' || this.form.groupType === 'cmdb') {
                    return true
                } else {
                    return false
                }
            },
            codehubShow() {
                if (this.form.groupType === 'all' || this.form.groupType === 'codehub') {
                    return true
                } else {
                    return false
                }
            },
            audit() {
                this.dialogFormVisible = false
                this.onSubmit('form')
            }
        },
        created() {

        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
