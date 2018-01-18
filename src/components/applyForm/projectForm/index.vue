<template>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="工单主题" prop="name">
                    <el-input v-model="form.name" placeholder="工单相关描述"></el-input>
                </el-form-item>
                <el-form-item label="工程名称" prop="projectName">
                    <el-input v-model="form.projectName" placeholder="Onekit工程名"></el-input>
                </el-form-item>
                <el-form-item label="工程组" prop="projectGroupName">
                    <el-select v-model="form.projectGroupName" placeholder="工程组">
                        <el-option key="ggfw" label="公共服务" value="公共服务"></el-option>
                        <el-option key="fcxg" label="房产销冠" value="房产销冠"></el-option>
                        <el-option key="xgjj" label="销冠经纪" value="销冠经纪"></el-option>
                        <el-option key="xggj" label="销冠管家" value="销冠管家"></el-option>
                        <el-option key="xgjf" label="销冠金服" value="销冠金服"></el-option>
                        <el-option key="jyyy" label="交易运营" value="交易运营"></el-option>
                        <el-option key="sjzx" label="数据中心" value="数据中心"></el-option>
                        <el-option key="club" label="CLUB" value="CLUB"></el-option>
                        <el-option key="xgq" label="销冠圈" value="销冠圈"></el-option>
                        <el-option key="bdkb" label="博达看板" value="博达看板"></el-option>
                        <el-option key="dsj" label="大数据" value="大数据"></el-option>
                        <el-option key="yxpt" label="营销平台" value="营销平台"></el-option>
                        <el-option key="ops" label="DevOps" value="DevOps"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工程类型" prop="projectType">
                    <el-select v-model="form.projectType" placeholder="请选择工程类型">
                        <el-option label="Java（War）项目" value="Java:War"></el-option>
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
                    <user-select v-model="form.owner"></user-select>
                </el-form-item>
                <el-form-item label="正式域名" prop="domainName">
                    <el-col :span="12"><el-input v-model="form.domainName" placeholder="False"></el-input></el-col><el-col :span="12">.apitops.com</el-col>
                </el-form-item>
                <el-form-item label="工程描述">
                    <el-input type="textarea" v-model="form.projectDescription"></el-input>
                </el-form-item>

            </el-form>
</template>

<script>

    import UserSelect from '../../userSelect'
    import * as http from '../../../http.js'
    import api from '../../../api'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                form: {
                    name: '',
                    projectName: '',
                    projectGroupName: '',
                    projectType: '',
                    owner: '',
                    projectDescription: '',
                    domainName: ''
                },
                rules: {
                    name: [{ required: true, message: '请输入工单主题', trigger: 'blur' }],
                    projectName: [{ required: true, message: '请输入工程名称', trigger: 'blur' }],
                    projectGroupName: [{ required: true, message: '请选择工程组', trigger: 'change' }],
                    projectType: [{ required: true, message: '请选择工程类型', trigger: 'change' }],
                    owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
                    domainName: [{ required: true, message: '请输入域名', trigger: 'blur' }]
                }
            }
        },
        components: {
            UserSelect
        },
        computed: {
            ...mapGetters(['userName', 'userMail'])
        },
        methods: {
            onSubmit(formName) {
                console.log(this.userName, this.userMail)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.form.id) {
                            http.put(api.Ticket(this.form.id), this.form).then(data => {
                                this.$message.success('提交成功！')
                                console.log(data)
                            })
                        } else {
                        let requestBody = {
                                'name': this.form.name,
                                'ticketType': 'createProject',
                                'status': 'Apply',
                                'data': this.form
                            }
                            http.post(api.Tickets, requestBody).then(data => {
                                this.$message.success('提交成功！')
                                console.log(data)
                            })
                        }

                    } else {
                        console.log(this.form)
                        return false
                    }
                })
            },
            onCancel() {
                this.$router.push({
                    path: '/ticketlist'
                })
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
