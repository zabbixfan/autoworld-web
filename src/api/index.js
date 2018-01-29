const Host = process.env.API_HOST
const AUTH_SERVER_HOST = process.env.AUTH_SERVER_HOST

export default {
    getUserByToken: Host + '/api/userinfo',
    searchUser: AUTH_SERVER_HOST + '/api/usersearch',
    getUserById: (userId) => AUTH_SERVER_HOST + '/api/userinfo/' + userId,
    Tickets: Host + '/api/tickets',
    Ticket: (ticketId) => Host + '/api/ticket/' + ticketId,
    Services: Host + '/api/services',
    service: Host + '/api/service',
    ticketLogs: (ticketId) => Host + '/api/ticketlog/' + ticketId,
    ProjectGroups: Host + '/api/projectgroups',
    KvmList: Host + '/api/kvm',
    Kvm: (kvmId) => Host + '/api/kvm/' + kvmId,
    searchWifiUser: Host + '/api/searchwifiuser',
    wifiUsers: Host + '/api/wifiuser',
    wifiUser: (userId) => Host + '/api/wifiuser/' + userId,
    servers: 'http://192.168.6.120:6201/api/servers',
    esIndexList: Host + '/api/esindex'
}
