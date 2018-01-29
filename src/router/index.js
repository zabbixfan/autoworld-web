import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Cookies from 'js-cookie'

Vue.use(VueRouter)

function load(component) {
    return () => System.import(`../views/${component}.vue`)
}

const router = new VueRouter({
    /*
     * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
     * it is only to be used only for websites.
     *
     * If you decide to go with "history" mode, please also open /config/index.js
     * and set "build.publicPath" to something other than an empty string.
     * Example: '/' instead of current ''
     *
     * If switching back to default "hash" mode, don't forget to set the
     * build publicPath back to '' so Cordova builds work again.
     */

    routes: [{
        path: '/',
        component: load('Index-layout'),
        navName: '首页',
        navIcon: 'fa-home',
        hasSub: false,
        children: [{
            path: '',
            component: load('index')
        }]
    }, {
        path: '/',
        component: load('Index-layout'),
        navName: '工单管理',
        navIcon: 'fa-ticket',
        hasSub: true,
        children: [{
            path: 'apply/',
            navName: '工单申请',
            component: load('ticket/apply'),
            meta: {show: true},
            children: [
            //     {
            //     path: 'projectapply',
            //     component: load('ticket/apply/projectinfo'),
            //     meta: {show: false}
            // }, {
            //     path: 'projectrestart',
            //     component: load('ticket/apply/projectrestart'),
            //     meta: {show: false}
            // }, {
            //     path: 'kvmapply',
            //     component: load('ticket/apply/kvmapply'),
            //     meta: {show: false}
            // }
            {
                path: 'kibanaaccess',
                component: load('ticket/apply/kibanaaccess'),
                meta: {show: false}
            },
            {
                path: 'dcrecord',
                component: load('ticket/apply/dcrecord'),
                meta: {show: false}
            }
            ]
        }, {
            path: 'ticketlist',
            navName: '工单列表',
            component: load('ticket/ticketlist'),
            hasSub: false

        }]
    }, {
        path: '/',
        component: load('Index-layout'),
        children: [
                    // {
                    //     path: 'ticketlist/createproject/:id',
                    //     component: load('ticket/apply/projectinfo')
                    // },
                    // {
                    //     path: 'ticketlist/restartproject/:id',
                    //     component: load('ticket/apply/projectrestart')
                    // },
                    // {
                    //     path: 'ticketlist/createkvmvm/:id',
                    //     component: load('ticket/apply/kvmapply')
                    // }
                    {
                        path: 'ticketlist/kibanaaccess/:id',
                        component: load('ticket/apply/kibanaaccess')
                    },
                    {
                        path: 'ticketlist/dcrecord/:id',
                        component: load('ticket/apply/dcrecord')
                    }
                ]
    },
    // {
    //     path: '/serivice',
    //     component: load('Index-layout'),
    //     navName: '服务状态',
    //     navIcon: 'fa-server',
    //     children: [{
    //             path: '/',
    //             component: load('services/servicelist')
    //         }, {
    //             path: '/test',
    //             component: load('services/servicelist')
    //         }]
    // },
    // {
    //     path: '/admin/',
    //     component: load('Index-layout'),
    //     navName: '后台管理',
    //     navIcon: 'fa-user',
    //     admin: true,
    //     hasSub: true,
    //     children: [{
    //             path: 'kvmmanager',
    //             component: load('admins/manager/kvmmanager'),
    //             navName: 'KVM虚拟机管理'
    //         }, {
    //             path: 'creategroup',
    //             component: load('admins/manager/creategroup'),
    //             navName: '创建组'
    //         }]
    // },
    // {
    //     path: '/wifiuser',
    //     component: load('Index-layout'),
    //     navName: 'WIFI管理',
    //     navIcon: 'fa-wifi',
    //     children: [{
    //             path: '/',
    //             component: load('wifiuser/wifiuserinfo')
    //         }]
    // },
    {
        path: '*',
        component: load('error/404')
    }]
})

router.beforeEach((to, from, next) => {
    if (store.state.account.token) {
        next()
    } else {
        if (to.query.accesstoken) {
            store.dispatch('setUserToken', {
                token: to.query.accesstoken,
                func: next
            })
            // store.dispatch('setUserToken', to.query.accesstoken)
            // next()
        } else if (Cookies.get('token')) {
            store.dispatch('setUserToken', {
                token: Cookies.get('token'),
                func: next
            })

            // store.dispatch('setUserToken', Cookies.get('token'))
            // next()
        } else {
            let s = `${process.env.AUTH_SERVER_HOST}/login?appid=${process.env.APP_ID}&callback=${encodeURI(process.env.LOCAL_HOST + '/%23' + to.fullPath)}`
            location.href = s
        }
    }
})

export default router
