/**
 * Created by manatee on 7/3/17.
 */
export default {
    getProjectTypeName(projectType) {
        switch (projectType) {
            case 'DotNet':
                return '.Net 项目'
            case 'Java:War':
                return 'Java（War）项目'
            case 'Java:Jar':
                return 'Java（Jar）项目'
            case 'Java:Http':
                return 'Java(HttpJar)项目'
            case 'FrontEnd':
                return '前端项目'
            case 'Python:Flask':
                return 'Python（Flask）项目'
            case 'Other':
                return '其他'
            default:
                return '未知'
        }
    },
    getTicketTypeName(ticketType) {
        switch (ticketType) {
            case 'kibanaaccess':
                return '日志查看申请'
            case 'dcrecord':
                return '机房进出登记记录'
            case 'restartProject':
                return 'Onekit工程重启'
            default:
                return '未知'
        }
    },
    getTicketStatus(ticketStatus) {
        switch (ticketStatus) {
            case 'delete':
                return '已删除'
            case 'refuse':
                return '驳回'
            case 'dept_allow':
                return '待IT审核'
            case 'it_allow':
                return '待运维审核'
            case 'apply':
                return '待部门审核'
            case 'executor_allow':
                return '待执行'
            case 'complete':
                return '已完成'
            default:
                return '未知'
        }
    }
}
