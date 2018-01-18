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
            case 'createProject':
                return 'Onekit工程申请'
            case 'createKvmVm':
                return 'KVM虚拟机申请'
            case 'restartProject':
                return 'Onekit工程重启'
            default:
                return '未知'
        }
    },
    getTicketStatus(ticketStatus) {
        switch (ticketStatus) {
            case 'Delete':
                return '已删除'
            case 'Refuse':
                return '驳回'
            case 'Apply':
                return '待审核'
            case 'Approve':
                return '待执行'
            case 'Complete':
                return '已完成'
            default:
                return '未知'
        }
    }
}
