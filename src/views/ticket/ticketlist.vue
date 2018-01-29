<template>
    <div class="panel">
        <panel-title title="工单列表"></panel-title>
        <div class="panel-body">
            <div class="level-item is-pulled-right">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <!-- <el-form :inline="true">
                        <el-form-item>
                            <el-input v-model="searchKeyword" placeholder="工单关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="search">查询</el-button>
                        </el-form-item>
                    </el-form> -->
                </el-col>
            </div>
            <div class="table-container">
                <el-table :data="ticketList" v-loading="listLoading" :default-sort="{'prop':'createTime','order':'descending'}">
                    <!--<el-table-column prop="name" label="工单描述"></el-table-column>-->
                    <el-table-column prop="requestManName" label="申请人"></el-table-column>
                    <el-table-column prop="createTime" label="申请时间" sortable></el-table-column>
                    <el-table-column  label="工单类型">
                        <template slot-scope="scope">
                            <span>{{ contentMapper.getTicketTypeName(scope.row.type) }}</span>
                         </template>
                    </el-table-column>
                    <el-table-column label="工单状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status ==='apply'" type="primary">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='dept_allow'" type="warning">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='it_allow'" type="warning">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='executor_allow'" type="warning">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='refuse'" type="danger">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='complete'" type="success">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                         </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" icon="edit"  @click="editTicket(scope.row)">操作</el-button>
                            <el-button type="danger" size="small" icon="delete" v-if="delete_show(scope.row.status)" @click="deleteTicket(scope.row.id, scope.row.type)">删除</el-button>
                         </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination :total="totalCount" align="left" layout="prev,pager,next,total" :page-size="pageSize" @current-change="paginationChange" :current="pageIndex"></el-pagination>
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
    import contentMapper from '../../assets/js/contentMapper'
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                ticketList: [],
                totalCount: 0,
                takeCount: 20,
                skipCount: 0,
                searchKeyword: '',
                contentMapper: contentMapper,
                listLoading: true,
                filters: {
                    keyword: ''
                }

            }
        },
        components: {
            panelTitle,
            mainContent,
            bottomToolBar
        },
        computed: {
            pageSize: function () {
                return this.takeCount
            },
            pageIndex: {
                get: function () {
                    return this.skipCount / this.takeCount + 1
                },
                set: function (val) {
                    this.skipCount = (val - 1) * this.takeCount
                }
            },
            ...mapGetters(['userId'])
        },
        methods: {
            getTicketList() {
                http.fetch(api.Tickets, {
                    'limit': this.takeCount,
                    'offset': this.skipCount
                    // 'keyword': this.searchKeyword
                }).then(data => {
                    this.ticketList = data.data
                    this.totalCount = data.totalCount
                    this.skipCount = data.offset
                    this.takeCount = data.limit
                    this.listLoading = false
                })
            },
            paginationChange: function (page) {
                this.pageIndex = page
                this.getTicketList()
            },
            gotoInfo: function (row) {
                console.log(row.id)
            },
            search: function () {
                this.pageIndex = 1
                this.getTicketList()
            },
            deleteTicket(id, type) {
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                http.del(api.Ticket(id), {'type': type}).then(data => {
                    this.getTicketList()
                    this.$message.success('删除成功')
                  })
              })
            },
            editTicket(data) {
                this.$router.push({
                    path: '/ticketlist/' + data.type.toLowerCase() + '/' + data.id
                })
            },
            delete_show(status) {
                if (status === 'complete') {
                    return false
                } else {
                    return true
                }
            }
        },
        created() {
            this.getTicketList()
        },
        watch: {

        }
    }

</script>
<style>
    .table-container {
        margin: 10px 0;
    }

</style>
