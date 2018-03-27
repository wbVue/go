<template>
    <div class="factor-list">
        <div class="add-new-scene">
            <div class="fl">
                <Button type="primary" @click="addNewParam" icon="plus">新增因子</Button>
            </div>
            <div class="fr" @keydown.enter="getParamList">
                <Form ref="loginForm" :model="paramForm" @submit.native.prevent >
                    <FormItem prop="userName">
                        <Input v-model="paramForm.factorName" placeholder="输入因子名字" style="width: 240px;">
                        <Button slot="append" @click="getParamList" icon="ios-search"></Button>
                        </Input>
                    </FormItem>
                </Form>
            </div>
        </div>
        <Modal
                title="因子编辑"
                v-model="editFactor"
                :mask-closable="false"
                width="750px;"
                :closable="false">
            <div @keydown.enter="keepEditModal">
                <Form ref="formValidate" inline :model="formValidate" :rules="ruleValidate" :label-width="100">

                    <FormItem label="因子名称" style="width: 100%;" prop="factorName">
                        <Input v-model="formValidate.factorName" placeholder="请输入因子名字"></Input>
                    </FormItem>
                    <FormItem label="描述" style="width: 100%;">
                        <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
                    </FormItem>
                    <FormItem label="请求地址" style="width: 100%;">
                        <Input v-model="formValidate.factorUrl" placeholder="请输入请求地址"></Input>
                    </FormItem>

                    <div class="param-list" v-for="(item ,index) in formValidate.inputParams">
                        <FormItem :label="index == 0 ? '入参' : ''">
                            <Input  style="width: 80px;" v-model="item.paramName" placeholder="参数名字"></Input>
                        </FormItem>
                        <FormItem label="" class="no-margin" >
                            <Input  style="width: 80px;" v-model="item.paramCode" placeholder="参数code"></Input>
                        </FormItem>
                        <FormItem label="" class="no-margin">
                            <Input  style="width: 80px;" v-model="item.paramValue" placeholder="参数值"></Input>
                        </FormItem>
                        <FormItem label="" class="no-margin" >
                            <CheckboxGroup  v-model="item.necessary">
                                <Checkbox label="是否必须"></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="" class="no-margin">
                            <ButtonGroup >
                                <Button icon="plus" @click="addInputParams"></Button>
                                <Button icon="trash-a" @click="removeInputParams(item,index)"></Button>
                            </ButtonGroup>
                        </FormItem>
                    </div>
                    <FormItem label="请求方式" style="width: 100%;">
                        <Select v-model="formValidate.requestType" placeholder="请选择">
                            <Option value="">请选择</Option>
                            <Option value="POST">POST</Option>
                            <Option value="GET">GET</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="请求加签" >
                        <CheckboxGroup v-model="formValidate.needSignature">
                            <Checkbox label="加签"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="返回加密" >
                        <CheckboxGroup v-model="formValidate.needEncrypt">
                            <Checkbox label="加密"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="出参key" style="width: 100%;">
                        <Input v-model="formValidate.outputParamKey" placeholder="请输入出参key"></Input>
                    </FormItem>
                    <FormItem label="返回值类型" prop="outputParamType" style="width: 100%;">
                        <Select v-model="formValidate.outputParamType" placeholder="请选择返回值类型">
                            <Option value="">请选择</Option>
                            <Option value="1">数字</Option>
                            <Option value="2">字符串</Option>
                            <Option value="3">布尔值</Option>
                            <Option value="4">对象</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="默认返回值" style="width: 100%;">
                        <Input v-model="formValidate.outputParamDefaultValue" placeholder="请输入出参key"></Input>
                    </FormItem>
                </Form>
            </div>

            <div slot="footer">
                <Button type="ghost"
                        style="margin-left: 8px" @click="cancelEditModal">取消</Button>
                <Button type="primary" :loading="keepButtonLoading" @click="keepEditModal">保存</Button>
            </div>
        </Modal>
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
        name: "factor-list",
        data () {
            return {
                paramForm:{
                    factorName:'',
                    page:1,
                    pageSize:10,
                },
                formValidate: {
                    creator: "",
                    description: "",
                    factorName: "",
                    factorUrl: "",
                    gmtCreate: "",
                    gmtModified: "",
                    inputParams: [{
                        necessary: [],
                        paramCode: "",
                        paramName: "",
                        paramValue: ""
                    }],
                    lastModifier: "",
                    needEncrypt: [],
                    needSignature: [],
                    outputParamDefaultValue: "",
                    outputParamKey: "",
                    outputParamType: "",
                    requestType: "",
                },
                oldFormValidate:null,
                keepButtonLoading:false,
                ruleValidate: {
                    factorName: [
                        { required: true, message: '请输入因子名字', trigger: 'blur' }
                    ],
                    outputParamType: [
                        { required: true, message: '请选择返回值类型', trigger: 'change' }
                    ]
                },
                tableLoading:true,  // 表格的家族动画
                sceneList: [],
                totalCount:0,  //总条数
                currentPage:1,  //总页数
                editFactor:false,
                sceneTable: [
                    {
                        title: '因子名称',
                        key: 'factorName',
                        width:'12%',
                        ellipsis:true,
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
                                }, params.row.factorName),
                            ]);
                        },
                    },
                    {
                        title: '描述',
                        key: 'description',
                        ellipsis:true,
                    },
                    {
                        title: '状态',
                        key: 'state',
                        width:'7%',
                        ellipsis:true,
                        render: (h, params) => {
                            let text = params.row.state == 1 ? '启用' : '停用';
                            return h('div', [
                                h('span', {},text),
                            ]);
                        },
                    },
                    {
                        title: '返回类型',
                        key: 'outputParamType',
                        width:'7%',
                        ellipsis:true,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {},this.$_validate.transformOutputType(params.row.outputParamType)),
                            ]);
                        },
                    },
                    {
                        title: '修改时间',
                        key: 'gmtCreate',
                        width:'15%',
                        ellipsis:true,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {},this.$_validate.timeFormat(params.row.gmtCreate)),
                            ]);
                        },
                    },
                    {
                        title: '修改人',
                        key: 'creator',
                        width:'7%',
                        ellipsis:true,
                    },
                    {
                        title: '操作',
                        key: 'time',
                        width:'20%',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                               /* h('i-switch',{
                                    props:{
                                        value:params.row.state == 1 ? true : false
                                    },
                                    style: {
                                        marginRight: '10px',
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
                                ]),*/
                                /*h('Button', {
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
                                }, '测试'),*/
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
            this.oldFormValidate = JSON.parse(JSON.stringify(this.formValidate));
            this.getParamList();
        },
        methods: {
            //加载实体列表
            getParamList(){
                this.tableLoading = true;
                this.$_ajax(this.$_api.queryFactorInPage,
                    this.paramForm,
                ).then(res => {

                    this.sceneList = res.data;
                    this.currentPage = res.currentPage;
                    this.totalCount = res.totalCount;
                    this.tableLoading = false;
                })
            },
            //新增因子
            addNewParam(){
                this.editFactor = true;
            },
            //编辑因子
            editParam(params){
                this.$_ajax(this.$_api.queryFactorById,{
                    id:params.row.id
                }).then(res => {

                    let formData = res.data;
                    formData.inputParams = !!formData.inputParams ? JSON.parse(formData.inputParams.replace(/\&quot;/ig,'"')) : [];
                    for(let i = 0; i < formData.inputParams.length; i++){
                        formData.inputParams[i].necessary = formData.inputParams[i].necessary == 1 ? ['是否必须'] : [];
                    }
                    if(formData.inputParams.length == 0 ){
                        formData.inputParams.push({
                            necessary: [],
                            paramCode: "",
                            paramName: "",
                            paramValue: ""
                        });
                    }
                    formData.needEncrypt = formData.needEncrypt == 1 ? ['加密'] : [];
                    formData.needSignature = formData.needSignature == 1 ? ['加签'] : [];
                    this.formValidate = formData;
                    this.editFactor = true;
                })

            },
            cancelEditModal(){
                this.editFactor = false;
                this.$refs['formValidate'].resetFields();
                //this.formValidate = JSON.parse(JSON.stringify(this.oldFormValidate));
            },
            startUsing(){

            },
            keepEditModal(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.keepButtonLoading = true;
                        let postData = JSON.parse(JSON.stringify(this.formValidate));
                        postData.needSignature = postData.needSignature.length > 0 ? 1 : 0;
                        postData.needEncrypt = postData.needEncrypt.length > 0 ? 1 : 0;
                        for(let i = 0 ; i < postData.inputParams.length; i++){
                            postData.inputParams[i].necessary = postData.inputParams[i].necessary.length > 0 ? 1 : 0;
                        }
                        postData.inputParams = JSON.stringify(postData.inputParams);
                        this.$_ajax(this.$_api.saveFactor,postData,'POST',true).then(res => {
                            this.keepButtonLoading = false;
                            if(res.success){
                                this.editFactor = false;
                                this.formValidate = JSON.parse(JSON.stringify(this.oldFormValidate));
                                this.getParamList();
                            }
                        });
                    }
                });
            },
            //删除场景
            deleteParams(params){
                this.$_ajax(this.$_api.deleteFactor,{
                    id:params.row.id
                }).then(res => {
                    this.getParamList();
                });
            },
            addInputParams(){
                this.formValidate.inputParams.push({
                    necessary: [],
                    paramCode: "",
                    paramName: "",
                    paramValue: ""
                });
            },
            removeInputParams(item,index){
                if(this.formValidate.inputParams.length > 1){
                    this.formValidate.inputParams.splice(index,1);
                }
            },
            changePage (page) {
                this.paramForm.page = page;
                this.getParamList();
            }
        }
    }
</script>

<style lang="scss">
    .factor-list{
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
    .param-list{
        .no-margin{
            .ivu-form-item-content{
                margin-left: 0 !important;
            }
        }
        .ivu-form-item{
            margin-bottom: 8px;
        }
    }
</style>