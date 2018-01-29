<template>
    <div class="panel">
        <panel-title title="KVM虚拟机管理"></panel-title>
        <div class="panel-body">
            <div class="level-item is-pulled-right">
                <el-form :inline="true">
                    <el-col :span="20">
                       <el-form-item label="关键字：" prop="searchKeyword">
                            <el-input v-model="searchKeyword" placeholder="请输入内容"></el-input>
                        </el-form-item>

                        <el-form-item >
                            <el-button type="primary" v-on:click="search">查询</el-button>
                        </el-form-item>
                    </el-col>
                        <el-form-item style="float:right;" ><el-button :plain="true" type="info" @click="dialogFormVisible = true">新增主机</el-button></el-form-item>
                </el-form>

            </div>
            <div class="table-container">
                    <el-table :data="KvmList" @selection-change="handleChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="name" label="主机名" sortable :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="ip" label="IP地址" sortable></el-table-column>
                        <el-table-column prop="manager" label="负责人" sortable></el-table-column>
                        <el-table-column prop="hostServer" label="宿主IP" sortable></el-table-column>
                        <el-table-column prop="lastUpdate" label="最后更新" sortable></el-table-column>
                        <el-table-column label="主机状态" sortable>
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status ==='Running'" type="success">运行中</el-tag>
                                <el-tag v-if="scope.row.status ==='Stopping'" type="danger">停止中</el-tag>
                                <i style="color:#F7BA2A" v-if="scope.row.status ==='Locking'" class="el-icon-loading"></i>
                                <el-tag v-if="scope.row.status ==='Locking'" type="warning">执行中</el-tag>

                             </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-dropdown @command="handleCommand">
                                  <el-button type="primary" size="small">
                                    <i class="el-icon-setting"> </i> 管理
                                  </el-button>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :disabled="signStartShow(scope.row.status)" :command="[scope.row.id,'startKvmVm']">启动</el-dropdown-item>
                                    <el-dropdown-item :disabled="signStopShow(scope.row.status)" :command="[scope.row.id,'stopKvmVm']">停止</el-dropdown-item>
                                    <el-dropdown-item :disabled="signStopShow(scope.row.status)" :command="[scope.row.id,'restartKvmVm']">重启</el-dropdown-item>
                                    <el-dropdown-item :disabled="signStartShow(scope.row.status)" :command="[scope.row.id,'deleteKvmVm']">删除</el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
            </div>
            <div class="buttons">
                <el-popover
                  ref="stopPop"
                  placement="top"
                  width="160"
                  v-model="stopPopVisable">
                  <p>是否停止选中主机？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="stopPopVisable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="operateVms('stopKvmVm')">确定</el-button>
                  </div>
                </el-popover>
                <el-popover
                  ref="startPop"
                  placement="top"
                  width="160"
                  v-model="startPopVisable">
                  <p>是否启动选中主机？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="startPopVisable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="operateVms('startKvmVm')">确定</el-button>
                  </div>
                </el-popover>
                <el-popover
                  ref="restartPop"
                  placement="top"
                  width="160"
                  v-model="restartPopVisable">
                  <p>是否重启选中主机？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="restartPopVisable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="operateVms('restartKvmVm')">确定</el-button>
                  </div>
                </el-popover>
                <el-popover
                  ref="deletePop"
                  placement="top"
                  width="160"
                  v-model="deletePopVisable">
                  <p>是否删除选中主机？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="deletePopVisable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="operateVms('deleteKvmVm')">确定</el-button>
                  </div>
                </el-popover>
                <el-button v-popover:startPop :disabled="startShow()">启动</el-button>
                <el-button v-popover:stopPop :disabled="stopShow()">停止</el-button>
                <el-button v-popover:restartPop :disabled="stopShow()">重启</el-button>
                <el-button v-popover:deletePop :disabled="startShow()">删除</el-button>

            </div>
            <el-pagination class="pagination-right"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="page.index"
                           :page-sizes="[1,10, 15, 25, 50]"
                :page-size="page.size"
                           layout="total, sizes, prev, pager, next"
                           :total="page.total">
            </el-pagination>

            <el-dialog title="新建主机" :visible.sync="dialogFormVisible" @open="getProjectGroup()" ref="createKvm">
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
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit('form')" >确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import panelTitle from '../../../components/panelTitle'
    import bottomToolBar from '../../../components/bottomToolBar'
    import * as http from '../../../http.js'
    import api from '../../../api'
    import ElFormItem from '../../../../node_modules/element-ui/packages/form/src/form-item'
//    import {
//        mapGetters
//    } from 'vuex'
    export default {
        data() {
            return {
                KvmList: [],
                searchKeyword: '',
                page: {
                    index: 1,
                    size: 10,
                    total: 100
                },
                dialogFormVisible: false,
                formLabelWidth: '120px',
                form: {
                    projectGroupName: '',
                    projectEnv: '',
                    vmMEM: 4096,
                    vmCPU: 2,
                    vmInstances: 1
                },
                rules: {
                    projectGroupName: [{ required: true, message: '请选择工程组', trigger: 'change' }],
                    projectEnv: [{ required: true, message: '请选择环境', trigger: 'change' }],
                    vmCPU: [{type: 'number', message: '请输入正确的cpu核心数'}],
                    vmMEM: [{ required: true, type: 'number', message: '请输入正确的内存数', trigger: 'blur' }]
                },
                projectGroups: [],
                statusList: [],
                vmSelection: [],
                stopPopVisable: false,
                startPopVisable: false,
                restartPopVisable: false,
                deletePopVisable: false
            }
        },
        components: {
            ElFormItem,
            panelTitle,
            bottomToolBar
        },
        computed: {

        },
        methods: {
            getKvmList() {
                let skip = (this.page.index - 1) * this.page.size
                http.fetch(api.KvmList, {
                    'limit': this.page.size,
                    'offset': skip,
                    'keyword': this.searchKeyword
                }).then(data => {
                    this.KvmList = data.data.data
                    this.page.total = data.data.totalCount
                    this.statusList = this.KvmList.filter(kvm => kvm.status === 'Locking')
                })
            },
            handleCurrentChange: function (val) {
                this.page.index = val
                this.getKvmList()
            },
            handleSizeChange(val) {
                this.page.size = val
                this.getKvmList()
            },
            search() {
                this.page.index = 1
                this.getKvmList()
            },
            getProjectGroup() {
                http.fetch(api.ProjectGroups).then(res => {
                    this.projectGroups = res.data
                })
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogFormVisible = false
                        let requestBody = {
                                'cpu': this.form.vmCPU,
                                'memory': this.form.vmMEM,
                                'instances': this.form.vmInstances,
                                'group': this.form.projectGroupName,
                                'env': this.form.projectEnv

                        }
                        http.post(api.KvmList, requestBody).then(data => {
                            this.$message.success('创建成功！')
                            this.dialogFormVisible = false
                            this.getKvmList()
                        })
                    } else {
                        return false
                    }
                })
            },
            handleChange(val) {
                this.vmSelection = val
            },
            startShow() {
                if (this.vmSelection.filter(vm => vm.status === 'Running').length > 0 || this.vmSelection.length === 0) {
                    return true
                } else {
                    return false
                }
            },
            stopShow() {
                if (this.vmSelection.filter(vm => vm.status === 'Stopping').length > 0 || this.vmSelection.length === 0) {
                    return true
                } else {
                    return false
                }
            },
            signStartShow(status) {
                console.log(status)
                if (status !== 'Stopping') {
                    return true
                } else {
                    return false
                }
            },
            signStopShow(status) {
                console.log(status)
                if (status !== 'Running') {
                    return true
                } else {
                    return false
                }
            },
            operateVms(action) {
                this.stopPopVisable = false
                this.startPopVisable = false
                this.restartPopVisable = false
                this.deletePopVisable = false
                for (var vm in this.vmSelection) {
                    this.operateVm(action, this.vmSelection[vm].id)
                }
                setTimeout(this.getKvmList(), 1000)
            },
            operateVm(action, id) {
                let body = {
                    'action': action
                }
                http.put(api.Kvm(id), body).then(data => {
                    this.$message.success('success！')
                    this.getKvmList()

                })
            },
            handleCommand(val) {
                this.operateVm(val[1], val[0])
            }
        },
        created() {
            this.getKvmList()
            setInterval(() => {
                if (this.statusList.length > 0) {
                    this.getKvmList()
                }
            }, 3000)
        },
        watch: {
//            statusList(val, oldVal) {
//                if (this.statusList.length > 0) {
//                    this.getKvmList()
//                }
//
//            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .pagination-right{
        padding: 10px 0px 0px;
        float: right;
    }
    .buttons {
        margin: 10px;
    }
</style>
