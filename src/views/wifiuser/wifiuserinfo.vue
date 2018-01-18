<template>
    <div class="panel">
        <panel-title title="WIFI管理"></panel-title>
        <div class="panel-body">
            <div v-if="existUser">
                您好 {{user}}，您已有登录公司wifi:XiaoGuanTech的权限，您的密码是 {{password}} ,您可以：
                <el-button @click="dialogFormVisible=true" type="primary">修改密码</el-button>
            </div>
            <div v-if="notExistUser">
                您好 {{user}}，您还未拥有登录公司wifi:XiaoGuanTech的权限，您可以：
                <el-button @click="createWifiUser" type="primary">开通权限</el-button>
            </div>
            <el-dialog title="修改密码" :visible.sync="dialogFormVisible" size="tiny">
            <el-form :model="passForm" :rules="rules" ref="passForm" >
              <el-form-item prop="pass" >
                <el-input type="password" v-model="passForm.pass" auto-complete="off" placeholder="新密码"></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input type="password" v-model="passForm.checkPass" auto-complete="off" placeholder="重复新密码"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm('passForm')" type="primary">提交修改</el-button>
                <el-button @click="resetForm('passForm')">取 消</el-button>
            </div>
            </el-dialog>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '../../components/panelTitle'
    import bottomToolBar from '../../components/bottomToolBar'
    import * as http from '../../http.js'
    import api from '../../api'
    import {
        mapGetters
    } from 'vuex'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else if (value.length < 6) {
                    callback(new Error('长度不能少于6位'))
                } else {
                    if (this.passForm.checkPass !== '') {
                        this.$refs.passForm.validateField('checkPass')
                    }
                    callback()
                }
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value.length < 6) {
                    callback(new Error('长度不能少于6位'))
                } else if (value !== this.passForm.pass) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                existUser: false,
                notExistUser: false,
                user: '',
                userId: '',
                password: '',
                dialogFormVisible: false,
                passForm: {
                    pass: '',
                    checkPass: ''
                },
                rules: {
                  pass: [{validator: validatePass, trigger: 'blur'}],

                  checkPass: [{validator: validatePass2, trigger: 'blur'}]
                }
            }
        },
        components: {
            ElButton,
            panelTitle,
            bottomToolBar

        },
        computed: {
            ...mapGetters(['userLoginName', 'userName'])
        },
        methods: {
            searchWifiUser(key) {
                let data = {
                    'keyword': key
                }
                http.fetch(api.searchWifiUser, data).then(res => {
                    let userinfo = res.data
                    if (JSON.stringify(userinfo) === '{}') {
                        this.user = this.userName
                        this.notExistUser = true
                    } else {
                        this.existUser = true
                        this.user = this.userName
                        this.password = userinfo.value
                        this.userId = userinfo.id
                    }

                })
            },
            createWifiUser() {
                let data = {
                    'username': this.userLoginName,
                    'value': 'TopsTech001'
                }
                http.post(api.wifiUsers, data).then(res => {
                    this.notExistUser = false
                    this.searchWifiUser(this.userLoginName)
                    this.$message.success('创建成功！')

                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.dialogFormVisible = false
                            let data = {
                                'value': this.passForm.pass
                            }
                            http.put(api.wifiUser(this.userId), data).then(res => {
                                this.searchWifiUser(this.userLoginName)
                                this.$message.success('修改成功！')

                            })
                        } else {
                            return false
                        }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
                this.dialogFormVisible = false
            }
        },
        created() {
            this.searchWifiUser(this.userLoginName)

        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
