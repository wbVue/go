<template>
    <div class="scene-list">
        <div class="add-new-scene">
            <div class="fl">
                <Button type="primary" @click="addNewScene" icon="plus">新增场景</Button>

            </div>
            <div class="fl">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                    <Button type="ghost" icon="forward" >导入意图</Button>
                </Upload>
            </div>
            <div class="fr" @keydown.enter="getSceneList">
                <Form ref="scenListForm" :model="scenListForm" @submit.native.prevent >
                    <FormItem prop="userName">
                        <Input v-model="scenListForm.name" placeholder="输入场景名字" style="width: 240px;">
                        <Button slot="append" @click="getSceneList" icon="ios-search"></Button>
                        </Input>
                    </FormItem>
                </Form>
            </div>
        </div>
        <Modal
                v-model="addNewSceneModal"
                :closable="false"
                :mask-closable="false"
                width="560">
            <p slot="header">
                <Icon type="plus"></Icon>
                <span>添加新场景</span>
            </p>
            <div @keydown.enter="sureAddNewScene('newSceneFormValidate')">
                <Form @submit.native.prevent ref="newSceneFormValidate" :model="newSceneFormValidate" :rules="newSceneRuleValidate" :label-width="80">
                    <FormItem label="场景名字" prop="name">
                        <Input v-model="newSceneFormValidate.name" placeholder="请输入场景名字"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="cancelAddNewScene('newSceneFormValidate')"
                        style="margin-left: 8px">取消</Button>
                <Button type="primary"
                        :loading="sureAddNewSceneLoading"
                        @click="sureAddNewScene('newSceneFormValidate')">保存</Button>
            </div>
        </Modal>
        <Table :loading="sceneLoading" :data="sceneList"  :columns="sceneTable"></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="totalCount" :current="currentPage" @on-change="changePage"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "scene-list",
        data () {
            return {
                addNewSceneModal:false,
                newSceneFormValidate: {
                    name: '',
                },
                scenListForm:{
                    name: '',
                    page:1,
                    pageSize:10,
                },
                currentPage:1,
                totalCount:0,
                newSceneRuleValidate: {
                    name: [
                        { required: true, message: '场景名字不能为空', trigger: 'blur' }
                    ]
                },
                sureAddNewSceneLoading:false, //保存新场景的loading
                loadingDelete:999,  //删除场景的Loading
                sceneList: [],
                sceneTable: [
                    {
                        title: '场景名字',
                        key: 'name',
                        width:"40%",
                    },
                    {
                        title: '实验版',
                        width:"20%",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                    },
                                    style: {
                                        paddingLeft:'0px',
                                        color:"#2db7f5",
                                    },
                                    on: {
                                        click: () => {
                                            this.editScene(params)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                    },
                                    style: {
                                        color:"#2db7f5",
                                    },
                                    on: {
                                        click: () => {
                                            this.publicScene(params)
                                        }
                                    }
                                }, '发布')
                            ]);
                        }
                    },
                    {
                        title: '线上版本',
                        width:"20%",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                    },
                                    style: {
                                        paddingLeft:'0px',
                                        color:"#2db7f5",
                                    },
                                    on: {
                                        click: () => {
                                            this.testScene(params)
                                        }
                                    }
                                }, '导入'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                    },
                                    style: {
                                        paddingLeft:'0px',
                                        color:"#2db7f5",
                                    },
                                    on: {
                                        click: () => {
                                            this.testScene(params)
                                        }
                                    }
                                }, '测试'),
                            ]);
                        },
                    },
                    {
                        title: '操作',
                        key: 'time',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch',{
                                    props:{
                                        value:params.row.state == 1 ? true : false,
                                    },
                                    style:{
                                        marginRight:'5px'
                                    },
                                    on:{
                                        'on-change':()=>{
                                            this.startUsing(params);
                                        }
                                    }
                                }, [
                                    h('span', {
                                        slot: 'open',
                                    }, '开'),
                                    h('span', {
                                        slot: 'close',
                                    }, '关'),
                                ]),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '确定删除该条数据吗?',
                                        placement: 'top',
                                        confirm:true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteScene(params);
                                        },
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            loading:this.loadingDelete == params.index
                                        },
                                        style: {
                                            color:"#2db7f5",
                                        }
                                    }, '删除')
                                ]),
                            ]);
                        }
                    }
                ],
                sceneLoading:true, //table 的动画
            }
        },
        created(){
            this.getSceneList();
        },
        methods: {
            getSceneList(){
                this.sceneLoading = true;
                this.$_ajax(this.$_api.querySceneInPage,this.scenListForm).then( res => {
                    this.sceneLoading = false;
                    if(res.success){
                        this.sceneList = res.data;
                        this.currentPage = res.currentPage;
                        this.totalCount = res.totalCount;

                    }
                });
            },
            //添加新场景
            addNewScene(){
                this.$refs['newSceneFormValidate'].resetFields();
                this.addNewSceneModal = true;
            },
            //取消添加一个新场景
            cancelAddNewScene(name){
                this.addNewSceneModal = false;//关闭弹框
                this.$refs[name].resetFields();
            },
            //确定添加一个新场景
            sureAddNewScene(name){
                let _this = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.sureAddNewSceneLoading = true;
                        _this.$_ajax(_this.$_api.saveScene,{
                            name:_this.newSceneFormValidate.name
                        },'POST','application/json;charset=utf-8').then( res => {
                            if(res.success){
                                _this.getSceneList();
                                _this.sureAddNewSceneLoading = false;
                                _this.addNewSceneModal = false; //关闭弹框
                            }
                        })

                    } else {

                    }
                })
            },
            //是否启用该场景
            startUsing(params){
                console.log(params)
            },
            //编辑场景
            editScene(params){
                this.$router.push(`/showScene/${params.row.id}`);
            },
            //删除场景
            deleteScene(params){
                this.loadingDelete = params.index;
                this.$_ajax(this.$_api.deleteScene,{
                    id:params.row.id
                }).then(res => {
                    this.loadingDelete = 999;
                    if(res.success){
                        this.sceneList.splice(params.index,1);
                    }
                });
            },
            exportInScene(){},
            //发布到生产环境
            publicScene(params){
                console.log('发布到生产环境',params)
            },
            //测试场景
            testScene(params){
                console.log(params)
            },
            changePage (page) {
                this.paramForm.page = page;
                this.getParamList();
            }
        }
    }
</script>

<style lang="scss">
    .scene-list{
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
                float: right;
                padding: 4px 12px 0 12px;
            }
        }
    }
</style>