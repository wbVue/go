<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu 
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../assets/logo.png" key="max-logo" />
                    <svg v-show="shrink" width="32px" height="32px" viewBox="0 0 279 295" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <!-- Generator: Sketch 3.6.1 (26313) - http://www.bohemiancoding.com/sketch -->
                        <title>云客服logo</title>
                        <desc>Created with Sketch.</desc>
                        <defs>
                            <linearGradient x1="0%" y1="50.1349628%" x2="100%" y2="50.1349628%" id="linearGradient-1">
                                <stop stop-color="#74D2FF" offset="0%"></stop>
                                <stop stop-color="#4DBCFF" offset="100%"></stop>
                            </linearGradient>
                        </defs>
                        <g id="Logo" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="Artboard-6" transform="translate(-260.000000, -140.000000)">
                                <g id="云客服logo" transform="translate(260.000000, 140.000000)">
                                    <path d="M196.895,105.784592 L214.047,75.9745408 C219.983,76.6407993 226.026,73.8122109 229.203,68.2884864 C233.484,60.8482653 230.945,51.335017 223.531,47.0394558 C216.118,42.744898 206.637,45.2955442 202.356,52.7357653 C199.177,58.2614966 199.759,64.9311054 203.306,69.7564626 L186.367,99.1952551 C177.553,94.4541837 167.815,91.0105102 157.462,89.1461905 C140.977,83.3635884 125.3,67.4446259 125.3,67.4446259 C125.3,67.4446259 115.622,85.5359524 98.86,96.1328741 C96.659,97.1172109 94.507,98.1808163 92.409,99.3166667 L75.377,69.7163265 C78.924,64.8909694 79.506,58.2213605 76.327,52.6956293 C72.045,45.2544048 62.565,42.7047619 55.152,46.9993197 C47.738,51.2938776 45.199,60.8071259 49.48,68.2483503 C52.658,73.7710714 58.701,76.6006633 64.637,75.9344048 L81.9,105.935102 C60.338,121.604218 46.5,145.872483 46.5,173.113827 C46.5,214.992789 79.206,249.839915 122.399,257.225952 C127.184,253.356837 133.264,251.035969 139.887,251.035969 C146.446,251.035969 152.47,253.31369 157.234,257.114575 C200.113,249.496752 232.5,214.787092 232.5,173.113827 C232.5,145.785187 218.574,121.449694 196.895,105.784592 L196.895,105.784592 Z" id="Shape" fill="#2BAFFF"></path>
                                    <ellipse id="Oval-23" fill="#FFFFFF" cx="139.5" cy="173.254303" rx="34.875" ry="35.0026531"></ellipse>
                                    <path d="M158.304,168.547347 C158.677,170.054456 158.875,171.630799 158.875,173.253299 C158.875,183.993707 150.201,192.700221 139.5,192.700221 C128.799,192.700221 120.125,183.993707 120.125,173.253299 C120.125,162.513895 128.799,153.808384 139.5,153.808384 C139.792,153.808384 140.082,153.815408 140.369,153.828452 C139.088,155.704813 138.337,157.973503 138.337,160.420799 C138.337,166.864643 143.542,172.08835 149.962,172.08835 C153.234,172.087347 156.191,170.730748 158.304,168.547347 L158.304,168.547347 Z" id="Combined-Shape_1_" fill="#24232A"></path>
                                    <path d="M265.467,143.616837 L255.901,141.212687 C253.749,120.287755 246.122,100.992347 234.483,84.7934354 L226.081,94.4471599 C237.47,111.257143 244.126,131.557959 244.126,153.419065 L244.126,168.198163 C244.126,221.314218 204.833,265.218044 153.828,272.229813 C151.311,267.050255 146.016,263.48216 139.889,263.48216 C131.328,263.48216 124.389,270.446769 124.389,279.038895 C124.389,287.63102 131.328,294.595629 139.889,294.595629 C146.452,294.595629 152.064,290.500748 154.324,284.717143 C198.678,279.091071 235.291,248.54352 249.809,207.497381 L265.431,203.74466 C272.925,201.943554 279.001,194.220374 279.001,186.49017 L279.001,161.014813 C279,153.285612 272.945,145.497211 265.467,143.616837 L265.467,143.616837 Z" id="Shape" fill="#89DAFF"></path>
                                    <path d="M23.115,141.06318 L13.534,143.471344 C6.055,145.351718 0,153.140119 0,160.868316 L0,186.343673 C0,194.073878 6.076,201.798061 13.571,203.598163 L28.84,207.266599 C32.168,208.06631 34.875,205.932075 34.875,202.496429 L34.875,153.419065 C34.875,131.571003 41.523,111.282228 52.899,94.4772619 L44.496,84.822534 C32.897,100.977296 25.287,120.208486 23.115,141.06318 L23.115,141.06318 Z" id="Shape" fill="#89DAFF"></path>
                                    <path d="M163.565,74.6691156 C161.374,74.2828061 159.639,72.5930782 159.189,70.4066667 L150.265,27.017585 L140.546,56.4252721 C139.903,58.3698639 138.228,59.7876701 136.209,60.0947109 C134.197,60.4027551 132.172,59.5478571 130.983,57.8812075 L119.966,42.4438776 L111.405,57.4206463 C110.438,59.1133844 108.642,60.1569218 106.698,60.1569218 L85.638,60.1569218 L85.638,49.2670068 L103.556,49.2670068 L114.755,29.6745918 C115.674,28.0671429 117.344,27.0386565 119.189,26.9453401 C121.025,26.8460034 122.798,27.7059184 123.874,29.2130272 L133.601,42.8432313 L146.337,4.30659864 C147.109,1.96767007 149.355,0.439489796 151.804,0.584982993 C154.256,0.728469388 156.306,2.5064966 156.802,4.91967687 L167.051,54.7515986 L174.436,42.6967347 C175.423,41.0852721 177.173,40.1039456 179.059,40.1039456 L193.205,40.1039456 L193.205,50.9928571 L182.094,50.9928571 L169.128,72.157602 C168.128,73.7871259 166.366,74.7513946 164.504,74.7513946 C164.192,74.7513946 163.879,74.7243027 163.565,74.6691156 Z" id="Shape" fill="url(#linearGradient-1)"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-avator-con">

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <Button type="text">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </Button>

                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import {appRouter} from '@/router/router'
    export default {
        components: {
            shrinkableMenu,
        },
        data () {
            return {
                shrink: false,
                userName: JSON.parse(sessionStorage.getItem('userInfo')).userInfo.userName,
                openedSubmenuArr: ['component'],
            };
        },
        computed: {
            menuList () {
                return appRouter;
            },
        },
        methods: {
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
        },
        created () {

        }
    };
</script>
