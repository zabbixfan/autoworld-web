<template>
    <div class="panel">
        <panel-title title="服务状态查看"></panel-title>
        <div class="panel-body">
            <div class="level-item is-pulled-right">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                       <el-form-item label="工程搜索：" prop="searchKeyword">
                           <el-select
                            v-model="searchKeyword"
                            multiple
                            filterable
                            remote
                            placeholder="请输入onekit工程名"
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
                        <el-form-item label="环境选择：" prop="checkedEnvs" style="width: 410px; margin-right: 0px">
                            <el-checkbox :indeterminate="isIndeterminate"
                                         v-model="checkAll"
                                         @change="handleCheckAllChange"
                                         style="width: 55px;float: left;">全选
                            </el-checkbox>
                            <!--<div style="margin: 15px 0;"></div>-->
                            <el-checkbox-group style="width: 320px" v-model="checkedEnvs" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="env in envs" :label="env" :key="env">{{env}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="只看不正常：">
                            <el-switch v-model="failedStatus" on-color="#13ce66" off-color="#ff4949"></el-switch>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="primary" v-on:click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </div>
            <div class="table-container">
                    <el-table :data="serviceList">
                        <el-table-column prop="project" label="工程名" sortable></el-table-column>
                        <el-table-column prop="env" label="环境" sortable></el-table-column>
                        <el-table-column prop="ip" label="IP地址" sortable></el-table-column>
                        <el-table-column label="服务状态" sortable>
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status ==='ok'" type="success">正常</el-tag>
                                <el-tag v-if="scope.row.status ==='failure'" type="danger">不正常</el-tag>
                             </template>
                        </el-table-column>
                    </el-table>
            </div>
            <el-pagination :total="totalCount" align="left" layout="pager,total" :page-size="pageSize" @current-change="paginationChange" :current="pageIndex"></el-pagination>
        </div>
        <bottom-tool-bar></bottom-tool-bar>
    </div>
</template>

<script>
    import * as http from '../../http'
    import api from '../../api'
    import panelTitle from '../../components/panelTitle'
    import mainContent from '../../components/mainContent'
    import bottomToolBar from '../../components/bottomToolBar'
    import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item'
    const envOptions = ['V5', 'BETA', 'TEST', 'DEV']
    export default {
        data() {
            return {
                serviceList: [],
                totalCount: 0,
                takeCount: 20,
                skipCount: 0,
                searchKeyword: '',
                listLoading: true,
                loading: true,
                filters: {
                    keyword: ''
                },
                serviceOptions: [],
                checkAll: true,
                checkedEnvs: ['V5', 'BETA', 'TEST', 'DEV'],
                envs: envOptions,
                isIndeterminate: true,
                failedStatus: false
            }
        },
        components: {
            ElFormItem,
            panelTitle,
            mainContent,
            bottomToolBar
        },
        computed: {
            pageSize: function () {
                return this.takeCount
            },
            searchList: function () {
                return this.serviceOptions.map(item => {
                    return { value: item, label: item }
              })
            },
            pageIndex: {
                get: function () {
                    return this.skipCount / this.takeCount + 1
                },
                set: function (val) {
                    this.skipCount = (val - 1) * this.takeCount
                }
            }
        },
        methods: {
            getserviceList() {
                http.fetch(api.Services, {
                    'limit': this.takeCount,
                    'offset': this.skipCount,
                    'keyword': this.searchKeyword,
                    'env': this.checkedEnvs,
                    'status': this.failedStatus
                }).then(data => {
                    this.serviceList = data.data.Datalist
                    this.totalCount = data.data.TotalCount
                    this.skipCount = data.data.offset
                    this.takeCount = data.data.limit
                })
            },
            paginationChange: function (page) {
                this.pageIndex = page
                this.getserviceList()
            },
            gotoInfo: function (row) {
                console.log(row.id)
            },
            search: function () {
                this.pageIndex = 1
                this.getserviceList()
            },
            searchService(kw) {
                http.fetch(api.service, {
                    'keyword': kw
                }).then(data => {
                    this.loading = false
                    this.serviceOptions = data.data
                })
            },
            remoteMethod(query) {
                this.loading = true
                // console.log(query)
                this.searchService(query)
            },
            handleCheckAllChange(event) {
                this.checkedEnvs = event.target.checked ? envOptions : []
                this.isIndeterminate = false
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length
                this.checkAll = checkedCount === this.envs.length
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.envs.length
            }
        },
        created() {
            this.getserviceList()
        },
        watch: {}
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .table-container {
        margin: 10px 0;
    }
    .search-form {
        margin-top: 20px;
    }
</style>
