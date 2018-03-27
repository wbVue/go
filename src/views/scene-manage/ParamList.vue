<template>
    <div class="param-list">
        <div class="add-new-scene">
            <div class="fl">
                <Button type="primary" @click="addNewParam" icon="plus">新增实体</Button>
            </div>
            <div class="fr" @keydown.enter="getParamList">
                <Form ref="loginForm" :model="paramForm" @submit.native.prevent >
                    <FormItem prop="userName">
                        <Input v-model="paramForm.name" placeholder="输入实体名字" style="width: 240px;">
                            <Button slot="append" @click="getParamList" icon="ios-search"></Button>
                        </Input>
                    </FormItem>
                </Form>
            </div>
        </div>
        <Table :loading="tableLoading" :data="sceneList"  :columns="sceneTable"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="totalCount" :current="1" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "param-list",
        data () {
            return {
                paramForm:{
                    name:'',
                    page:1,
                    pageSize:10,
                },
                tableLoading:true,  // 表格的家族动画
                sceneList: [],
                totalCount:0,  //总条数
                currentPage:1,  //总页数
                sceneTable: [
                    {
                        title: '实体名称',
                        key: 'entityName',
                    },
                    {
                        title: '修改时间',
                        key: 'gmtCreate',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {},this.$_validate.timeFormat(params.row.gmtCreate)),
                            ]);
                        },
                    },
                    {
                        title: '修改人',
                        key: 'creator',
                    },
                    {
                        title: '操作',
                        key: 'time',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                    },
                                    style: {
                                        marginRight: '2px',
                                        color:"#2db7f5",
                                        paddingLeft:'0px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editParam(params)
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '确定删除该条数据吗?',
                                        placement: 'top',
                                        confirm:true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteParams(params);
                                        },
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                        },
                                        style: {
                                            color:"#2db7f5",
                                            paddingLeft:'0px'
                                        }
                                    }, '删除')
                                ])
                            ]);
                        },
                    }
                ]
            }
        },
        created(){
            this.getParamList();
        },
        methods: {
            //加载实体列表
            getParamList(){
                this.tableLoading = true;
                this.$_ajax(this.$_api.queryEntityInPage,
                    this.paramForm
                ).then(res => {
                    this.sceneList = res.data;
                    this.currentPage = res.currentPage;
                    this.totalCount = res.totalCount;
                    this.tableLoading = false;
                })
            },
            //添加新场景
            addNewParam(){
                this.$router.push(`/editParam/0`);
            },
            //编辑实体
            editParam(params){
                this.$router.push(`/editParam/${params.row.id}`);
            },
            //删除场景
            deleteParams(params){
                this.$_ajax(this.$_api.deleteEntity,{
                    id:params.row.id
                }).then(res => {
                     this.getParamList();
                })
            },

            changePage (page) {
                this.paramForm.page = page;
                this.getParamList();
            }
        }
    }
</script>

<style lang="scss">
    .param-list{
        .add-new-scene{
            height: 44px;
            margin-bottom: 5px;
            overflow: hidden;
            border-bottom: 1px solid #dddddd;
            background: #ffffff;
            .fl{
                float: left;
                padding: 6px 0 0 12px;
            }
            .fr{
                margin-right: 12px;
                float: right;
                padding: 4px 0 0 12px;
            }
        }
    }
</style>