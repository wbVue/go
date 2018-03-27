import Main from '@/views/Main.vue';


//登陆模块
import {LoginRouter} from "./module/login";

import {SceneList, ParamList, FactorList,ShowScene,EditParam} from "./module/scene";

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/',
        icon: 'cube',
        name: 'component',
        title: '场景管理',
        component: Main,
        children: [
            {
                path: 'sceneList',
                icon: 'ios-arrow-forward',
                name: 'scene-list',
                title: '场景列表',
                component: SceneList
            },
            {
                path: 'paramList',
                icon: 'ios-arrow-forward',
                name: 'param-list',
                title: '实体列表',
                component: ParamList
            },
            {
                path: 'factorList',
                icon: 'ios-arrow-forward',
                name: 'factor-list',
                title: '因子列表',
                component: FactorList
            }
        ]
    },
];
export const otherRouter = [
    {
        path: '/',
        icon: 'cube',
        name: 'component',
        title: '场景管理',
        component: Main,
        children: [
            {
                path: 'showScene/:sceneId',
                icon: 'ios-arrow-forward',
                name: 'show-scene',
                title: '显示一个场景',
                component: ShowScene
            },
            {
                path: 'editParam/:id',
                name: 'edit-param',
                title: '显示一个场景',
                component: EditParam
            }
        ]
    },
];
export const login = [{
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: LoginRouter
}];

export const routes = login.concat(appRouter,otherRouter);
