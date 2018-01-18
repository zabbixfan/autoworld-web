<template>
    <div class="panel">
        <panel-title title="工单列表"></panel-title>
        <div class="panel-body">
            <div class="level-item is-pulled-right">
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input v-model="searchKeyword" placeholder="工单关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" v-on:click="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </div>
            <div class="table-container">
                <el-table :data="ticketList" v-loading="listLoading">
                    <!--<el-table-column prop="name" label="工单描述"></el-table-column>-->
                    <el-table-column prop="requestMan" label="申请人"></el-table-column>
                    <el-table-column prop="createAt" label="申请时间" sortable></el-table-column>
                    <el-table-column  label="工单类型">
                        <template scope="scope">
                            <span>{{ contentMapper.getTicketTypeName(scope.row.type) }}</span>
                         </template>
                    </el-table-column>
                    <el-table-column label="工单状态">
                        <template scope="scope">
                            <el-tag v-if="scope.row.status ==='Apply'" type="primary">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='Approve'" type="warning">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='Complete'" type="success">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                            <el-tag v-if="scope.row.status ==='Refuse'" type="danger">{{ contentMapper.getTicketStatus(scope.row.status) }}</el-tag>
                         </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button type="info" size="small" icon="edit"  @click="editTicket(scope.row)">操作</el-button>
                            <el-button type="danger" size="small" icon="delete" @click="deleteTicket(scope.row.id)">删除</el-button>
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
                takeCount: 10,
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
            ...mapGetters(['userRole'])
        },
        methods: {
            getTicketList() {
                http.fetch(api.Tickets, {
                    'limit': this.takeCount,
                    'offset': this.skipCount,
                    'keyword': this.searchKeyword
                }).then(data => {
                    this.ticketList = data.data.data
                    this.totalCount = data.data.totalCount
                    this.skipCount = data.data.offset
                    this.takeCount = data.data.limit
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
            deleteTicket(id) {
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                http.del(api.Ticket(id)).then(data => {
                    this.getTicketList()
                    this.$message.success('删除成功')
                  })
              })
            },
            editTicket(data) {
                this.$router.push({
                    path: '/ticketlist/' + data.type.toLowerCase() + '/' + data.id
                })
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
