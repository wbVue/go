<template>
    <div class="show-scene">
        <div class="tool">
            <Button type="primary" @click="undoEvent">撤销(Ctr+Z)</Button >
            <Button  type="primary" @click="redoEvent">恢复(Ctr+Y)</Button >
            <Button  type="primary" @click="keepData">保存数据</Button >
        </div>
        <Row :gutter="16">
            <Col span="20">
            <div class="edit-scene">
                <div id="myPaletteDiv"></div>
                <div id="myDiagramDiv"></div>
            </div>
            </Col>
            <Col span="4">
            <div class="search-res">

            </div>
            </Col>
        </Row>
        <Modal v-model="nodeConfigModal"
               :closable="false"
               :mask-closable="false"
               width="80%">
            <p slot="header" >
                <Icon type="compose"></Icon>
                <span>节点配置</span>
            </p>
            <Form ref="nodeConfigForm"
                  :model="nodeConfigForm"
                  :rules="nodeConfigFormRule" inline :label-width="80">
                <Collapse v-model="nodeConfigCollapse">
                    <Panel name="1">
                        节点基本信息(Basic)
                        <div slot="content">
                            <FormItem label="节点名字" prop="name">
                                <Input
                                        v-model="nodeConfigForm.name"
                                        @on-keyup="keydownName"
                                        :maxlength="30"
                                        style="width: 200px;"
                                        placeholder="请输入节点名字"></Input>
                            </FormItem>
                            <FormItem
                                    label="节点描述"
                                    prop="nodeDesc">
                                <Input
                                        style="width: 200px;"
                                        v-model="nodeConfigForm.nodeDesc"
                                        placeholder="请输入节点描述"></Input>
                            </FormItem>
                            <FormItem
                                    label="未知交互"
                                    prop="unKnownNum">
                                <Input
                                        v-model="nodeConfigForm.unKnownNum"
                                        @on-keyup="keydownUnKnownNum"
                                        :maxlength="1"
                                        style="width: 200px;"
                                        placeholder="请输入未知交互的次数"></Input>
                            </FormItem>
                        </div>
                    </Panel>
                    <Panel name="2">
                        从何处指向本节点
                        <div slot="content">
                            <Collapse v-model="sourceLink">
                                <Panel v-for="(item,index) in nodeConfigForm.linksInto" :key="index" :name="index.toString()">
                                    {{item.linkName}}
                                    <div slot="content">
                                        <Collapse v-model="sourceLinkInfo">
                                            <Panel name="1">
                                                边的基本信息
                                                <div slot="content">
                                                    <Table border
                                                           :columns="nodeConfigFromLink"
                                                           :data="item.linksIntoBasic"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="2">
                                                前置条件
                                                <div slot="content">
                                                    <Table border
                                                           :columns="nodeConfigFromPrecondition"
                                                           :data="item.linksIntoPrecondition"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="3">
                                                用户描述文本
                                                <div slot="content">
                                                    <Table border
                                                           :columns="nodeConfigUserSay"
                                                           :data="item.linksIntoUserSay"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="4">
                                                规则
                                                <div slot="content">
                                                    <Table border
                                                           :columns="nodeConfigLinkRule"
                                                           :data="item.linksIntoRule"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="5">
                                                实体列表
                                                <div slot="content">
                                                    <Table border
                                                           :columns="nodeConfigFromLinkParams"
                                                           :data="item.linksIntoParam"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="6">
                                                因子列表
                                                <div slot="content">
                                                    <Table border
                                                           :columns="nodeConfigFromLinkFactor"
                                                           :data="item.linksIntoFactor"></Table>
                                                </div>
                                            </Panel>
                                        </Collapse>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </Panel>
                    <Panel name="3">
                        实体和因子列表
                        <div slot="content">
                            <Collapse v-model="sourceParamsFactor">
                                <Panel name="1">
                                    实体列表(Entity)
                                    <div slot="content">
                                        <Button icon="plus" style="margin-bottom: 10px;"
                                                @click="addParams">新增实体</Button>
                                        <Table border
                                               :columns="nodeConfigParams"
                                               :data="nodeConfigForm.nodeParam"></Table>
                                    </div>
                                </Panel>
                                <Panel name="2">
                                    因子列表
                                    <div slot="content">
                                        <Button icon="plus" style="margin-bottom: 10px;"
                                                @click="addNewFactorButton">新增因子</Button>
                                        <Table border
                                               :columns="nodeConfigFactor"
                                               :data="nodeConfigForm.nodeFactor"></Table>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </Panel>
                    <Panel name="4">
                        输出响应
                        <div slot="content">
                            <Button icon="plus" style="margin-bottom: 10px;"
                                    @click="addResponse">新增响应</Button>
                            <Table border :columns="nodeConfigResponse"
                                   :data="nodeConfigForm.nodeResponse"></Table>
                        </div>
                    </Panel>
                    <Panel name="5">
                        接下来指向
                        <div slot="content">
                            <Collapse v-model="sourceToLink" accordion @on-change="changeLinksOutCol">
                                <Panel v-for="(item,index) in nodeConfigForm.linksOutOf" :name="index.toString()" :key="index" >
                                    {{item.linkName}}
                                    <div slot="content">
                                        <Collapse  v-model="sourceToLinkInfo" accordion>
                                            <Panel name="1">
                                                边的基本信息
                                                <div slot="content">
                                                    <FormItem label="边的名字" prop="linkName">
                                                        <Input
                                                                v-model="item.linksOutForm.linkName"
                                                                @on-keyup="keydownName"
                                                                :maxlength="30"
                                                                style="width: 200px;"
                                                                placeholder="请输入边的名字"></Input>
                                                    </FormItem>
                                                    <FormItem
                                                            label="边的描述">
                                                        <Input
                                                                style="width: 200px;"
                                                                v-model="item.linksOutForm.linkDesc"
                                                                placeholder="请输入边的描述"></Input>
                                                    </FormItem>
                                                    <FormItem
                                                            label="边的指向">
                                                        <Input
                                                                v-model="item.linksOutForm.linkDirection"
                                                                :maxlength="1"
                                                                style="width: 200px;"
                                                                placeholder="请输入边的指向"></Input>
                                                    </FormItem>
                                                    <FormItem
                                                            label="边优先级">
                                                        <Input
                                                                v-model="item.linksOutForm.linkPriority"
                                                                @on-keyup="keydownUnKnownNum"
                                                                :maxlength="2"
                                                                style="width: 200px;"
                                                                placeholder="请输入边的优先级"></Input>
                                                    </FormItem>
                                                </div>
                                            </Panel>
                                            <Panel name="2">
                                                前置条件
                                                <div slot="content">
                                                    <Button icon="plus" style="margin-bottom: 10px;"
                                                            @click="addNewLinksOutPrecondition(item,index)">新增前置条件</Button>
                                                    <Table border
                                                           :columns="nodeConfigToPrecondition"
                                                           :data="item.linksOutPrecondition"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="3">
                                                用户描述文本
                                                <div slot="content">
                                                    <Button icon="plus" style="margin-bottom: 10px;"
                                                            @click="addNewUserSay(item,index)">新增用户描述文本</Button>
                                                    <Table border
                                                           :columns="nodeConfigEditUserSay"
                                                           :data="item.linksOutUserSay"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="4">
                                                规则
                                                <div slot="content">
                                                    <Button icon="plus" style="margin-bottom: 10px;"
                                                            @click="addNewLinkRule(item,index)">新增规则</Button>
                                                    <Table border
                                                           :columns="nodeConfigEditLinkRule"
                                                           :data="item.linksOutRule"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="5">
                                                实体列表
                                                <div slot="content">
                                                    <Table border
                                                           :columns="nodeConfigEditFromLinkParams"
                                                           :data="item.linksOutParam"></Table>
                                                </div>
                                            </Panel>
                                            <Panel name="6">
                                                因子列表
                                                <div slot="content">
                                                    <Button icon="plus" style="margin-bottom: 10px;"
                                                            @click="addNewFactorButton('linkFactor')">新增因子</Button>
                                                    <Table border
                                                           :columns="nodeConfigEditFromLinkFactor"
                                                           :data="item.linksOutFactor"></Table>
                                                </div>
                                            </Panel>
                                        </Collapse>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </Panel>
                </Collapse>
            </Form>
            <div slot="footer">

                <Button type="ghost"
                        style="margin-left: 8px" @click="closeNodeConfigModal">取消</Button>
                <Button type="primary" @click="nodeConfigData">保存</Button>
            </div>
        </Modal>
        <Modal v-model="edgeConfigModal"
               :closable="false"
               :mask-closable="false"
               width="80%">
            <p slot="header" >
                <Icon type="compose"></Icon>
                <span>边的配置</span>
            </p>
            <Form ref="edgeForm"
                  :model="edgeConfig"
                  :rules="edgeConfigRule" inline :label-width="80">
                <Collapse  v-model="edgeColl" accordion>
                    <Panel name="1">
                        边的基本信息
                        <div slot="content">
                            <FormItem label="边的名字" prop="linkName">
                                <Input
                                        v-model="edgeConfig.linkName"
                                        @on-keyup="keydownName"
                                        :maxlength="30"
                                        style="width: 200px;"
                                        placeholder="请输入边的名字"></Input>
                            </FormItem>
                            <FormItem
                                    label="边的描述">
                                <Input
                                        style="width: 200px;"
                                        v-model="edgeConfig.linkDesc"
                                        placeholder="请输入边的描述"></Input>
                            </FormItem>
                            <FormItem
                                    label="边的指向">
                                <Input
                                        v-model="edgeConfig.linkDirection"
                                        :maxlength="1"
                                        style="width: 200px;"
                                        placeholder="请输入边的指向"></Input>
                            </FormItem>
                            <FormItem
                                    prop="linkPriority"
                                    label="边优先级">
                                <Input
                                        v-model="edgeConfig.linkPriority"
                                        @on-keyup="keydownUnKnownNum"
                                        :maxlength="2"
                                        style="width: 200px;"
                                        placeholder="请输入边的优先级"></Input>
                            </FormItem>
                        </div>
                    </Panel>
                    <Panel name="2">
                        前置条件
                        <div slot="content">
                            <Button icon="plus" style="margin-bottom: 10px;"
                                    @click="addEdgePrecondition">新增前置条件</Button>
                            <Table border
                                   :columns="nodeConfigToPrecondition"
                                   :data="edgeConfig.linksOutPrecondition"></Table>
                        </div>
                    </Panel>
                    <Panel name="3">
                        用户描述文本
                        <div slot="content">
                            <Button icon="plus" style="margin-bottom: 10px;"
                                    @click="addEdgeUserSay(1,1)">新增用户描述文本</Button>
                            <Table border
                                   :columns="nodeConfigEditUserSay"
                                   :data="edgeConfig.linksOutUserSay"></Table>
                        </div>
                    </Panel>
                    <Panel name="4">
                        规则
                        <div slot="content">
                            <Button icon="plus" style="margin-bottom: 10px;"
                                    @click="addNewLinkRule">新增规则</Button>
                            <Table border
                                   :columns="nodeConfigEditLinkRule"
                                   :data="edgeConfig.linksOutRule"></Table>
                        </div>
                    </Panel>
                    <Panel name="5">
                        实体列表
                        <div slot="content">
                            <Table border
                                   :columns="edgeLinksParams"
                                   :data="edgeConfig.linksOutParam"></Table>
                        </div>
                    </Panel>
                    <Panel name="6">
                        因子列表
                        <div slot="content">
                            <Button icon="plus" style="margin-bottom: 10px;"
                                    @click="addNewFactorButton">新增因子</Button>
                            <Table border
                                   :columns="nodeConfigEditFromLinkFactor"
                                   :data="edgeConfig.linksOutFactor"></Table>
                        </div>
                    </Panel>
                </Collapse>
            </Form>
            <div slot="footer">

                <Button type="ghost"
                        style="margin-left: 8px" @click="closeEdgeConfigModal">取消</Button>
                <Button type="primary" @click="edgeKeepData">保存</Button>
            </div>
        </Modal>
        <Modal v-model="editRule"
               style="z-index: 1001;"
               :closable="false"
               :mask-closable="false"
               width="80%">
            <p slot="header">
                <Icon type="edit"></Icon>
                <span>编辑规则</span>
            </p>
            <div>
                <Row :gutter="16" style="margin-bottom: 10px;">
                    <Col span="7">
                    <Card>
                        <div slot="title"><strong>实体</strong></div>
                        <div style="overflow: hidden;">
                            <div v-for="(item,index) in paramRule"  style="float: left;"
                                 @dragstart="dragStartEvent($event,item)"
                                 draggable="true">
                                <Tag class="symbol-rule">{{item.value}}</Tag>
                            </div>
                        </div>
                    </Card>
                    </Col>
                    <Col span="7">
                    <Card>
                        <div slot="title"><strong>因子</strong></div>
                        <div style="overflow: hidden;">
                            <div v-for="(item,index) in factorRule"  style="float: left;"
                                 @dragstart="dragStartEvent($event,item)"
                                 draggable="true">
                                <Tag class="symbol-rule">{{item.value}}</Tag>
                            </div>
                        </div>
                    </Card>
                    </Col>
                    <Col span="10">
                    <Card>
                        <div slot="title" >
                            <strong style="margin-right: 5px;">常量</strong>
                            <span style="color: #2d8cf0;font-size: 12px;">(enter键可加入规则)</span>
                        </div>
                        <div @keydown.enter="addConstant('newSceneFormValidate')">
                            <Form @submit.native.prevent
                                  ref="addConstantForm"
                                  :model="addConstantForm"
                                  :rules="newSceneRuleValidate"
                                  inline
                                  :label-width="10">
                                <FormItem prop="name">
                                    <Input v-model="addConstantForm.name" placeholder="请输入常量">
                                    <Select v-model="addConstantForm.type" slot="append"
                                            class="input-select">
                                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                    </Input>
                                </FormItem>
                                <Button type="primary" :disabled="!addConstantForm.name" @click="addConstant('newSceneFormValidate')">添加</Button>
                            </Form>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Card style="margin-bottom: 10px;">
                    <div slot="title"><strong>操作符</strong></div>
                    <div style="overflow: hidden;">
                        <div v-for="(item,index) in symbolRule"  style="float: left;"
                             @dragstart="dragStartEvent($event,item)"
                             draggable="true">
                            <Tag class="symbol-rule">{{item.value}}</Tag>
                        </div>
                    </div>
                </Card>
                <div  @drop='drop($event)'
                      @dragover='allowDrop($event)'>
                    <Card >
                        <div slot="title" >
                            <strong style="margin-right: 5px;">输出规则</strong>
                            <span style="color: #2d8cf0;font-size: 12px;">(把规则拖拽到此处)</span>
                        </div>
                        <div
                                style="overflow: hidden;">
                            <div v-for="(item,index) in nodeOutputRule"
                                 style="float: left;">
                                <Tag closable  @on-close="deleteRule(index)" class="symbol-rule out-rule">{{item.value}}</Tag>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
            <div slot="footer">
                <Button type="ghost"
                        @click="closeEditModal"
                        style="margin-left: 8px">取消</Button>
                <Button :loading="keepRuleLoading" @click="keepRule" type="primary">保存</Button>
            </div>
        </Modal>
        <Modal
                v-model="addNewResponseModal"
                :closable="false"
                :mask-closable="false"
                style="z-index: 1001;"
                width="80%">
            <p slot="header">
                <Icon type="plus"></Icon>
                <span>编辑响应内容</span>
            </p>
            <div @keydown.enter="sureEditResopnse('newResopnseRuleValidate')">
                <Form @submit.native.prevent ref="newResopnseRuleValidate"
                      :model="newResopnseFormValidate" :rules="newResopnseRuleValidate"
                      :label-width="80">
                    <FormItem label="响应内容" prop="response">
                        <Input v-model="newResopnseFormValidate.response" placeholder="请输入响应内容"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="cancelEditResponse('newResopnseRuleValidate')"
                        style="margin-left: 8px">取消</Button>
                <Button type="primary"
                        :loading="sureEditResponseLoading"
                        @click="sureEditResopnse('newResopnseRuleValidate')">保存</Button>
            </div>
        </Modal>
        <Modal
                v-model="addNewFactorModal"
                :mask-closable="false"
                style="z-index: 1004;"
                width="80%">
            <p slot="header">
                <Icon type="plus"></Icon>
                <span>新增因子</span>
            </p>
            <div>
                <Table border
                       :columns="factorList"
                       :data="nodeConfigFactorListTable"></Table>
            </div>
            <div slot="footer" style="padding: 0;">
            </div>
        </Modal>
        <Modal v-model="editPreconditionModal"
               style="z-index: 1005;"
               :closable="false"
               :mask-closable="false"
               width="80%">
            <p slot="header">
                <Icon type="edit"></Icon>
                <span>编辑响应规则</span>
            </p>
            <div>
                <Row :gutter="16" style="margin-bottom: 10px;">
                    <Col span="7">
                    <Card>
                        <div slot="title"><strong>实体</strong></div>
                        <div style="overflow: hidden;">
                            <div v-for="(item,index) in paramRule"  style="float: left;"
                                 @dragstart="dragStartEvent($event,item)"
                                 draggable="true">
                                <Tag class="symbol-rule">{{item.value}}</Tag>
                            </div>
                        </div>
                    </Card>
                    </Col>
                    <Col span="7">
                    <Card>
                        <div slot="title"><strong>因子</strong></div>
                        <div style="overflow: hidden;">
                            <div v-for="(item,index) in factorRule"  style="float: left;"
                                 @dragstart="dragStartEvent($event,item)"
                                 draggable="true">
                                <Tag class="symbol-rule">{{item.value}}</Tag>
                            </div>
                        </div>
                    </Card>
                    </Col>
                    <Col span="10">
                    <Card>
                        <div slot="title" >
                            <strong style="margin-right: 5px;">常量</strong>
                            <span style="color: #2d8cf0;font-size: 12px;">(enter键可加入规则)</span>
                        </div>
                        <div @keydown.enter="addConstant('newSceneFormValidate')">
                            <Form @submit.native.prevent
                                  ref="addConstantForm"
                                  :model="addConstantForm"
                                  :rules="newSceneRuleValidate"
                                  inline
                                  :label-width="10">
                                <FormItem prop="name">
                                    <Input v-model="addConstantForm.name" placeholder="请输入常量">
                                    <Select v-model="addConstantForm.type" slot="append"
                                            class="input-select">
                                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                    </Input>
                                </FormItem>
                                <Button type="primary" :disabled="!addConstantForm.name" @click="addConstant('newSceneFormValidate')">添加</Button>
                            </Form>
                        </div>
                    </Card>
                    </Col>
                </Row>
                <Card style="margin-bottom: 10px;">
                    <div slot="title"><strong>操作符</strong></div>
                    <div style="overflow: hidden;">
                        <div v-for="(item,index) in symbolRule"  style="float: left;"
                             @dragstart="dragStartEvent($event,item)"
                             draggable="true">
                            <Tag class="symbol-rule">{{item.value}}</Tag>
                        </div>
                    </div>
                </Card>
                <div  @drop='drop($event)'
                      @dragover='allowDrop($event)'>
                    <Card >
                        <div slot="title" >
                            <strong style="margin-right: 5px;">输出规则</strong>
                            <span style="color: #2d8cf0;font-size: 12px;">(把规则拖拽到此处)</span>
                        </div>
                        <div
                                style="overflow: hidden;">
                            <div v-for="(item,index) in nodeOutputRule"
                                 style="float: left;">
                                <Tag closable  @on-close="deleteRule(index)" class="symbol-rule out-rule">{{item.value}}</Tag>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
            <div slot="footer">
                <Button type="ghost"
                        @click="closeEditPreconditionModal"
                        style="margin-left: 8px">取消</Button>
                <Button :loading="keepRuleLoading" @click="keepPrecondition" type="primary">保存</Button>
            </div>
        </Modal>
        <Modal
                v-model="addNewUserSayModal"
                :closable="false"
                :mask-closable="false"
                style="z-index: 1001;"
                width="80%">
            <p slot="header">
                <Icon type="plus"></Icon>
                <span>编辑用户描述文本</span>
            </p>
            <div>
                <div @keydown.enter="addNewUserSayForm('newUserSayFormValidate')">
                    <Form @submit.native.prevent ref="newUserSayFormValidate"
                          :model="newUserSayForm" :rules="newUserSayFormValidate"
                          :label-width="120">
                        <FormItem label="用户描述文本" prop="response">
                            <Input id="copyInput"
                                   v-model="newUserSayForm.userSay" placeholder="请输入响应内容"></Input>
                        </FormItem>
                    </Form>
                </div>

                <Table border
                       :columns="newUserSayData"
                       :data="newUserSayDataTable"></Table>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="cancelNewUserSayForm('newUserSayFormValidate')"
                        style="margin-left: 8px">取消</Button>
                <Button type="primary"
                        :loading="sureEditResponseLoading"
                        @click="addNewUserSayForm('newUserSayFormValidate')">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "show-scene",
        data(){
            return {
                nodeObj:null, //点开的节点对象
                edgeObj:null, //点开边的节点对象
                //节点配置
                nodeConfigModal: false,
                //节点配置的折叠板
                nodeConfigCollapse: [],
                //节点配置的表单
                nodeConfigForm: {
                    name: '',  //节点名字
                    nodeDesc: '',//节点描述
                    unKnownNum: '',//未知交互
                    //指向该节点的边
                    linksInto: [],
                    //实体列表 paramName paramType paramValue promotoe defaultValue
                    nodeParam:[],
                    //因子列表 factorName  factorDesc factorKeyValue  response
                    nodeFactor:[],
                    //响应输出 priority rule type response
                    nodeResponse:[],
                    //从该点指出去的边
                    linksOutOf: [],
                },
                //从改点指向出去的索引值
                linksOutOfIndex: 0,
                ruleModal: '', //判断是否是什么事件 linkRule, nodeRule响应输出的规则
                factorModal:'',//判断是不是节点的因子弹框 linkFactor nodeFactor
                nodeConfigFormRule: {
                    name: [
                        {required: true, message: '节点名字不能为空', trigger: 'blur'}
                    ],
                    unKnownNum: [
                        {required: true, message: '未知交互次数不能为空', trigger: 'blur'}
                    ]
                },
                //点击边的配置信息

                //节点配置
                sourceLinkInfo: [],
                //边的基本信息
                edgeConfigModal:false,//配置边的信息的节点
                ruleType:'',//edge node 边的规则 或者节点的规则
                userType:'', //edge, node 边的用户描述文本和节点的用户描述文本
                edgeConfig:{
                    linkName:'',
                    linkDesc:'',
                    linkDirection:'',
                    linkPriority:'',
                    linksOutPrecondition:[],
                    linksOutUserSay:[],
                    linksOutRule:[],
                    linksOutParam:[],
                    linksOutFactor:[],
                },
                edgeConfigRule:{
                    linkName: [
                        {required: true, message: '边点名字不能为空', trigger: 'blur'}
                    ],
                    linkPriority: [
                        {required: true, message: '边的优先级不能为空', trigger: 'blur'}
                    ]
                },
                edgeColl:[],
                nodeConfigFromLink: [
                    {
                        title: '边的名字',
                        key: 'linkName',
                        width: 140,
                    },
                    {
                        title: '边的描述',
                        key: 'linkDesc',
                        width: 140,
                    },
                    {
                        title: '边的指向',
                        key: 'direction',
                    },
                    {
                        title: '边的优先级',
                        key: 'priority',
                        width: 140,
                    }
                ],
                //边的前置条件
                nodeConfigFromPrecondition: [
                    {
                        title: '边的前置条件',
                        key: 'precondition',
                    }
                ],
                //边的描述文本
                nodeConfigUserSay: [
                    {
                        title: '用户描述文本',
                        key: 'userSay',

                    },
                    {
                        title: '实体名字',
                        key: 'paramName',
                        width: 120,
                    },
                    {
                        title: '实体类型',
                        key: 'paramType',
                        width: 120,
                    },
                    {
                        title: '实体值',
                        key: 'paramValue',
                        width: 140,
                    }
                ],
                //边的描述文本
                nodeConfigEditUserSay: [
                    {
                        title: '用户描述文本',
                        key: 'userSay',

                    },
                    {
                        title: '实体名字',
                        key: 'paramName',
                        width: 120,
                    },
                    {
                        title: '实体类型',
                        key: 'paramType',
                        width: 120,
                    },
                    {
                        title: '实体值',
                        key: 'paramValue',
                        width: 140,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'edit',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addNewUserSay(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteUserSayRow(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                            ]);
                        }
                    }
                ],
                nodeConfigEditUserSayTable: [
                    {
                        userSay: '我要从北京到上海',
                        paramName: 'location',
                        paramType: 'string',
                        paramValue: '北京',
                    },
                ],
                addNewUserSayModal: false,  //新增用户说的内容
                //实体列表
                newUserSayData: [
                    {
                        title: '实体名字',
                        key: 'paramName',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramName),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体名字',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.newUserSayDataTable[params.index].paramName;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input11' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.newUserSayDataTable.slice(0);
                                            newData[params.index].paramName = _this.inputData;
                                            _this.newUserSayDataTable = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体名字',
                                                value: params.row.paramName,
                                                'element-id': 'input11' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.newUserSayDataTable.slice(0);
                                                    newData[params.index].paramName = _this.inputData;
                                                    _this.newUserSayDataTable = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体类型',
                        key: 'paramType',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramType),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体类型',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.newUserSayDataTable[params.index].paramType;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input12' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.newUserSayDataTable.slice(0);
                                            newData[params.index].paramType = _this.inputData;
                                            _this.newUserSayDataTable = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体类型',
                                                value: params.row.paramType,
                                                'element-id': 'input12' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.newUserSayDataTable.slice(0);
                                                    newData[params.index].paramType = _this.inputData;
                                                    _this.newUserSayDataTable = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体值(value)',
                        key: 'paramValue',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramValue),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体值',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.newUserSayDataTable[params.index].paramValue;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input13' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.newUserSayDataTable.slice(0);
                                            newData[params.index].paramValue = _this.inputData;
                                            _this.newUserSayDataTable = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体值',
                                                value: params.row.paramValue,
                                                'element-id': 'input13' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.newUserSayDataTable.slice(0);
                                                    newData[params.index].paramValue = _this.inputData;
                                                    _this.newUserSayDataTable = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteNewParamsRow(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                newUserSayDataTable: [],
                newUserSayForm: {
                    userSay: '',
                },
                newUserSayFormValidate: {
                    userSay: [
                        {required: true, message: '用户描述文本不能为空', trigger: 'blur'}
                    ]
                },
                //边的规则
                nodeConfigLinkRule: [
                    {
                        title: '边的规则',
                        key: 'linkRule',
                    }
                ],
                //边的实体
                nodeConfigFromLinkParams: [
                    {
                        title: '实体名字',
                        key: 'paramName',
                        width: 140,
                    },
                    {
                        title: '实体类型',
                        key: 'paramType',
                        width: 140,
                    },
                    {
                        title: '实体值',
                        key: 'paramValue',
                    },
                    {
                        title: '实体默认值',
                        key: 'paramDefaultValue',
                    }
                ],
                //边的因子
                nodeConfigFromLinkFactor: [
                    {
                        title: '因子名字',
                        key: 'factorName',
                        width: 140,
                    },
                    {
                        title: '因子描述',
                        key: 'factorDesc',
                        width: 140,
                    },
                    {
                        title: 'key_value',
                        key: 'keyValue',
                    },
                ],
                //实体列表
                nodeConfigParams: [
                    {
                        title: '实体名字',
                        key: 'paramName',
                        width: 140,
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramName),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体名字',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.nodeParam[params.index].paramName;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                            newData[params.index].paramName = _this.inputData;
                                            _this.nodeConfigForm.nodeParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体名字',
                                                value: params.row.paramName,
                                                'element-id': 'input' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                                    newData[params.index].paramName = _this.inputData;
                                                    _this.nodeConfigForm.nodeParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体类型',
                        key: 'paramType',
                        width: '140px',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramType),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体类型',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.nodeParam[params.index].paramType;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input1' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                            newData[params.index].paramType = _this.inputData;
                                            _this.nodeConfigForm.nodeParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体类型',
                                                value: params.row.paramType,
                                                'element-id': 'input1' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                                    newData[params.index].paramType = _this.inputData;
                                                    _this.nodeConfigForm.nodeParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体值(value)',
                        key: 'type',
                        width: '140px',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramValue),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体值',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.nodeParam[params.index].paramValue;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input2' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                            newData[params.index].paramValue = _this.inputData;
                                            _this.nodeConfigForm.nodeParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体值',
                                                value: params.row.paramValue,
                                                'element-id': 'input2' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                                    newData[params.index].paramValue = _this.inputData;
                                                    _this.nodeConfigForm.nodeParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: 'promotoe',
                        key: 'promotoe',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.promotoe),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑promotoe',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.nodeParam[params.index].promotoe;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input3' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                            newData[params.index].promotoe = _this.inputData;
                                            _this.nodeConfigForm.nodeParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入promotoe',
                                                value: params.row.promotoe,
                                                'element-id': 'input3' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                                    newData[params.index].promotoe = _this.inputData;
                                                    _this.nodeConfigForm.nodeParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '默认值',
                        key: 'response',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.defaultValue),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑默认值',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.nodeParam[params.index].defaultValue;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input4' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                            newData[params.index].defaultValue = _this.inputData;
                                            _this.nodeConfigForm.nodeParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入默认值',
                                                value: params.row.defaultValue,
                                                'element-id': 'input4' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.nodeParam.slice(0);
                                                    newData[params.index].defaultValue = _this.inputData;
                                                    _this.nodeConfigForm.nodeParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteParamsRow(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                //因子列表
                nodeConfigFactor: [
                    {
                        title: '因子名字',
                        key: 'factorName',
                        width: 160,
                    },
                    {
                        title: '描述',
                        key: 'factorDesc',
                        width: 160,
                    },
                    {
                        title: 'key_value',
                        key: 'factorKeyValue',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteFactorRow(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),

                            ]);
                        }
                    }
                ],
                addNewFactorModal: false,//添加新的因子
                factorList: [
                    {
                        title: '因子名字',
                        key: 'factorName',
                        width: 200,
                    },
                    {
                        title: '描述',
                        key: 'factorDesc',
                        width: 160,
                    },
                    {
                        title: '状态',
                        key: 'factorStatus',
                        width: 120,
                    },
                    {
                        title: '返回类型',
                        key: 'factorType',
                        width: 120,
                    },
                    {
                        title: 'key_value',
                        key: 'factorKeyValue',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'plus',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addNewFactor(params.index, params.row)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                            ]);
                        }
                    }
                ], //因子列表
                nodeConfigFactorListTable: [
                    {
                        factorName: 'weather_result',
                        factorDesc: '查询天气',
                        factorStatus: '启用',
                        factorType: '字符串',
                        factorKeyValue: '{name:"查询天气"}',
                    },
                ],
                sourceLink: [],//从何处指向本节点的折叠板
                nodeConfigResponse: [
                    {
                        title: '优先级',
                        key: 'priority',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'flag'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                                h('strong', {
                                    style: {
                                        marginRight: '25px'
                                    }
                                }, params.index + 1)
                            ]);
                        }
                    },
                    {
                        title: '规则',
                        key: 'rule',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.rule),
                                h('Button', {
                                    props: {
                                        icon: 'edit',
                                        size: 'small',
                                        type: 'text',
                                    },
                                    on: {
                                        click: () => {
                                            this.editTableRule(params);
                                        }
                                    }
                                }),
                            ]);
                        }
                    },
                    {
                        title: '类型',
                        key: 'type',
                        width: '80px'
                    },
                    {
                        title: '响应内容',
                        key: 'response',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.response),
                                h('Button', {
                                    props: {
                                        icon: 'edit',
                                        size: 'small',
                                        type: 'text',
                                    },
                                    on: {
                                        click: () => {
                                            this.editResponse(params)
                                        }
                                    }
                                }),
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 140,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteResRow(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'chevron-down',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.directionDown(params.index, params.row)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'chevron-up',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.directionUp(params.index, params.row)
                                        }
                                    },
                                })
                            ]);
                        }
                    }
                ],
                inputData: '',//当数据更改的时候
                sourceToLink: [], //此节点指向何处
                sourceToLinkInfo: [],//边的基本信息
                //边的前置条件
                nodeConfigToPrecondition: [
                    {
                        title: '边的前置条件',
                        key: 'precondition',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.precondition),
                                h('Button', {
                                    props: {
                                        icon: 'edit',
                                        size: 'small',
                                        type: 'text',
                                    },
                                    on: {
                                        click: () => {
                                            this.editPrecondition(params,'edge')
                                        }
                                    }
                                }),
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deletePreconditionRow(params,'edge')
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                            ]);
                        }
                    }
                ],
                nodeConfigToPreconditionTable: [
                    {
                        precondition: '_form_say',
                    },
                ],
                //编辑边的规则
                nodeConfigEditLinkRule: [
                    {
                        title: '边的规则',
                        key: 'linkRule',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'edit',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addNewLinkRule(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteNewLinkRule(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),
                            ]);
                        }
                    }
                ],
                nodeConfigEditLinkRuleTable: [
                    {
                        linkRule: '时间大于18点',
                    },
                ],
                preditionParams: '',
                editPreconditionModal: false, //编辑前置条件
                sourceParamsFactor: [],//实体和因子列表
                ruleParams: null, //单条规则的参数
                editRule: false,
                //响应内容的弹框
                addNewResponseModal: false,
                newResopnseFormValidate: {
                    response: '',
                },
                newResopnseRuleValidate: {
                    response: [
                        {required: true, message: '响应内容不能为空', trigger: 'blur'}
                    ]
                },
                edgeLinksParams: [
                    {
                        title: '实体名字',
                        key: 'paramName',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramName),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体名字',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.edgeConfig.linksOutParam[params.index].paramName;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input21' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.edgeConfig.linksOutParam.slice(0);
                                            newData[params.index].paramName = _this.inputData;
                                            _this.edgeConfig.linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体名字',
                                                value: params.row.paramName,
                                                'element-id': 'input21' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.edgeConfig.linksOutParam.slice(0);
                                                    newData[params.index].paramName = _this.inputData;
                                                    _this.edgeConfig.linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体类型',
                        key: 'paramType',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramType),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体类型',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.edgeConfig.linksOutParam[params.index].paramType;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input22' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.edgeConfig.linksOutParam.slice(0);
                                            newData[params.index].paramType = _this.inputData;
                                            _this.edgeConfig.linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体类型',
                                                value: params.row.paramType,
                                                'element-id': 'input22' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.edgeConfig.linksOutParam.slice(0);
                                                    newData[params.index].paramType = _this.inputData;
                                                    _this.edgeConfig.linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体值(value)',
                        key: 'type',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramValue),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体值',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.edgeConfig.linksOutParam[params.index].paramValue;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input23' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.edgeConfig.linksOutParam.slice(0);
                                            newData[params.index].paramValue = _this.inputData;
                                            _this.edgeConfig.linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体值',
                                                value: params.row.paramValue,
                                                'element-id': 'input23' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.edgeConfig.linksOutParam.slice(0);
                                                    newData[params.index].paramValue = _this.inputData;
                                                    _this.edgeConfig.linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '默认值',
                        key: 'response',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.defaultValue),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑默认值',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.edgeConfig.linksOutParam[params.index].defaultValue;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input24' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.edgeConfig.linksOutParam.slice(0);
                                            newData[params.index].defaultValue = _this.inputData;
                                            _this.edgeConfig.linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入默认值',
                                                value: params.row.defaultValue,
                                                'element-id': 'input24' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.edgeConfig.linksOutParam.slice(0);
                                                    newData[params.index].defaultValue = _this.inputData;
                                                    _this.edgeConfig.linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteEditParamsRow(params,'edge')
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                //实体列表
                nodeConfigEditFromLinkParams: [
                    {
                        title: '实体名字',
                        key: 'paramName',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramName),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体名字',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam[params.index].paramName;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input21' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                            newData[params.index].paramName = _this.inputData;
                                            _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体名字',
                                                value: params.row.paramName,
                                                'element-id': 'input21' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                                    newData[params.index].paramName = _this.inputData;
                                                    _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体类型',
                        key: 'paramType',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramType),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体类型',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam[params.index].paramType;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input22' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                            newData[params.index].paramType = _this.inputData;
                                            _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体类型',
                                                value: params.row.paramType,
                                                'element-id': 'input22' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                                    newData[params.index].paramType = _this.inputData;
                                                    _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '实体值(value)',
                        key: 'type',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.paramValue),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑实体值',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam[params.index].paramValue;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input23' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                            newData[params.index].paramValue = _this.inputData;
                                            _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入实体值',
                                                value: params.row.paramValue,
                                                'element-id': 'input23' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                                    newData[params.index].paramValue = _this.inputData;
                                                    _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '默认值',
                        key: 'response',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('span', {
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, params.row.defaultValue),
                                h('Poptip', {
                                    props: {
                                        trigger: 'click',
                                        title: '编辑默认值',
                                        placement: 'top',
                                    },
                                    on: {
                                        'on-popper-show': () => {
                                            _this.inputData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam[params.index].defaultValue;
                                            _this.$nextTick(_ => {
                                                document.getElementById('input24' + params.index).focus();
                                            });
                                        },
                                        'on-popper-hide': () => {
                                            let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                            newData[params.index].defaultValue = _this.inputData;
                                            _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                        }
                                    },
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'edit',
                                            size: 'small',
                                            type: 'text',
                                        }
                                    }),
                                    h('div', {
                                        slot: 'content'
                                    }, [
                                        h('Input', {
                                            props: {
                                                placeholder: '请输入默认值',
                                                value: params.row.defaultValue,
                                                'element-id': 'input24' + params.index
                                            },
                                            on: {
                                                'on-keyup': (e) => {
                                                    _this.inputData = e.target.value;
                                                },
                                                'on-enter': (key) => {
                                                    let newData = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam.slice(0);
                                                    newData[params.index].defaultValue = _this.inputData;
                                                    _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutParam = newData;
                                                }
                                            }
                                        })
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteEditParamsRow(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                //因子列表
                nodeConfigEditFromLinkFactor: [
                    {
                        title: '因子名字',
                        key: 'factorName',
                        width: 160,
                    },
                    {
                        title: '描述',
                        key: 'factorDesc',
                        width: 160,
                    },
                    {
                        title: 'key_value',
                        key: 'factorKeyValue',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'trash-a',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteEditFactorRow(params)
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }),

                            ]);
                        }
                    }
                ],
                //保存响应内容的loading动画
                sureEditResponseLoading: false,
                //实体列表
                paramRule: [
                    {value: '北京', key: ''},
                    {value: '时间', key: ''},
                ],
                //因子列表
                factorRule: [
                    {value: '获取天气', key: ''},
                    {value: '获取地点', key: ''},
                ],
                //操作符类别
                symbolRule: [
                    {value: '(', key: ''},
                    {value: ')', key: ''},
                    {value: '包含', key: ''},
                    {value: '不包含', key: ''},
                    {value: '乘', key: ''},
                    {value: '除', key: ''},
                    {value: '加', key: ''},
                    {value: '减', key: ''},
                    {value: '等于', key: ''},
                    {value: '不等于', key: ''},
                    {value: '大于', key: ''},
                    {value: '大于等于', key: ''},
                    {value: '小于', key: ''},
                    {value: '小于等于', key: ''},
                    {value: '且', key: ''},
                    {value: '或', key: ''}
                ],
                //常量
                addConstantForm: {
                    name: '',
                    type: 'string'
                },
                newSceneRuleValidate: {
                    name: [
                        {message: '常量名字不能为空',}
                    ],
                },
                typeList: [
                    {
                        value: 'number',
                        label: '数字'
                    },
                    {
                        value: 'string',
                        label: '字符串'
                    },
                    {
                        value: 'boolean',
                        label: '布尔值'
                    },
                    {
                        value: 'object',
                        label: '对象'
                    }
                ],
                //拖拽时设置item
                dragItem: '',
                //输出规则
                nodeOutputRule: [],
                //保存规则
                keepRuleLoading: false,
            };
        },
        mounted(){
            let _this = this;

            //初始化Go.js
            const $ = go.GraphObject.make;
            //注册复制事件
            document.body.oncopy = function(e){
                if( e.target.parentNode.id == 'copyInput'){
                    let entityValue = window.getSelection().toString();
                    _this.newUserSayDataTable.push({
                        paramName:'paramName',
                        paramType:'paramType',
                        paramValue:entityValue
                    });
                }
            };
            _this.myDiagram =
                $(go.Diagram, "myDiagramDiv",  // 挂载画布
                    {   //设置栅格
                        grid: $(go.Panel, "Grid",
                            $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
                            $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
                            $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
                            $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
                        ),
                        allowDrop: true,  //允许从调色板拉去东西过来
                        "draggingTool.dragsLink": false, //禁止线条可以拖拽
                        "draggingTool.isGridSnapEnabled": true,
                        "linkingTool.isUnconnectedLinkValid": false, //拉出来的线条必须要求有节点
                        "linkingTool.portGravity": 20,
                        "relinkingTool.isUnconnectedLinkValid": false,
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //鼠标滚轮事件 放大缩小
                        "relinkingTool.portGravity": 20,
                        //选择一个目标对象的时候
                        "ChangedSelection": function(e) {
                            var node = e.diagram.selection.first();
                            if (node instanceof go.Node) {

                            } else {
                                node.data.linkName = 'new_source_edge';
                                node.data.edgeConfig =  node.data.edgeConfig || {
                                    linkName:'new_source_edge',
                                    linkDesc:'',
                                    linkDirection:'',
                                    linkPriority:'',
                                    linksOutPrecondition:[],
                                    linksOutUserSay:[],
                                    linksOutRule:[],
                                    linksOutParam:[],
                                    linksOutFactor:[],
                                };
                            }
                        },
                        "undoManager.isEnabled": true    // Ctr + z撤销， Ctr + Y 合并
                    });
            // 当改变内容 和 保存数据的时候
            _this.myDiagram.addDiagramListener("Modified", _this.modified);
            function makePort(name, spot, output, input) {
                return $(go.Shape, "Circle",
                    {
                        fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                        stroke: null,
                        desiredSize: new go.Size(7, 7),
                        alignment: spot,  // align the port on the main Shape
                        alignmentFocus: spot,  // just inside the Shape
                        portId: name,  // declare _this object to be a "port"
                        fromSpot: spot,
                        toSpot: spot,  // declare where links may connect at _this port
                        fromLinkable: output,
                        toLinkable: input,  // declare whether the user may draw links to/from here
                        cursor: "pointer"  // show a different cursor to indicate potential link point
                    });
            }
            var partContextMenu =
                $(go.Adornment, "Vertical",
                    makeButton("编辑",
                        function(e, obj) { //是当前按钮对象
                            var contextmenu = obj.part;  // 按钮在上下文菜单装饰中。
                            var part = contextmenu.adornedPart;  // adornedPart是上下文菜单修饰的部分。
                            // adornedPart是上下文菜单修饰的部分。
                            //点击线的编辑事件
                            if (part instanceof go.Link){
                                _this.clickSide(false,part);
                                //点击节点的编辑事件
                            } else {
                                _this.clickNode(false,part);
                            };


                        }),
                    makeButton("删除",
                        function(e, obj) { e.diagram.commandHandler.deleteSelection(); },
                        function(o) { return o.diagram.commandHandler.canDeleteSelection(); })

                );
            _this.myDiagram.nodeTemplate =
                $(go.Node, "Spot",
                    {click:_this.clickNode},
                    { locationSpot: go.Spot.Center },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    //选中的时候
                    { selectable: true, selectionAdornmentTemplate:
                            $(go.Shape,{fill:null,stroke: "blue", strokeWidth: 0 })
                    },

                    new go.Binding("angle").makeTwoWay(),
                    // 创建形状
                    $(go.Panel, "Auto",
                        { name: "PANEL" },
                        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        $(go.Shape, "Rectangle",  // default figure
                            {
                                portId: "", // the default port: if no spot on link data, use closest side
                                cursor: "pointer",
                                fill: "white",  // default color
                                strokeWidth: 1,
                                fromLinkable: true,
                                fromLinkableSelfNode: true, //是否语序连接多条是
                                fromLinkableDuplicates: true,//  是否允许连接多条线
                                toLinkable: true,
                                toLinkableSelfNode: true,
                                toLinkableDuplicates: true,
                            },
                            new go.Binding("figure"),
                            new go.Binding("fill")),
                        $(go.TextBlock,
                            {
                                name:'TEXTBLOCK',
                                font: "7px Helvetica, Arial, sans-serif",
                                maxSize: new go.Size(160, NaN),
                                wrap: go.TextBlock.WrapFit,
                                margin:2,
                                editable: false,
                                cursor: "move",
                            },
                            new go.Binding("text",'text').makeTwoWay()),
                        {
                            contextMenu: partContextMenu // 注册鼠标右键事件
                        }
                    ),
                    // 四边的中点
                    makePort("T", go.Spot.Top, false, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, false),
                    {  // 鼠标移入移出
                        mouseEnter: function(e, node) { showSmallPorts(node, true); },
                        mouseLeave: function(e, node) { showSmallPorts(node, false); }
                    }
                );
            //鼠标移入节点的事件
            function showSmallPorts(node, show) {
                node.ports.each(function(port) {
                    if (port.portId !== "") {  // don't change the default port, which is the big shape
                        port.fill = show ? "rgba(0,0,0,.3)" : null;
                    }
                });
            }
            function makeButton(text, action, visiblePredicate) {
                return $("ContextMenuButton",
                    $(go.TextBlock, text,
                        {
                            textAlign: "center",
                            font: "9pt helvetica, arial, sans-serif",
                            margin: 4,
                            cursor: "pointer",
                            editable: false  // enable in-place editing
                        }),
                    { click: action },
                    // don't bother with binding GraphObject.visible if there's no predicate
                    visiblePredicate ? new go.Binding("visible", "", function(o, e)
                    { return o.diagram ? visiblePredicate(o, e) : false; }).ofObject() : {});
            }

            _this.myDiagram.linkTemplate =
                $(go.Link,  // the whole link panel
                    {click:_this.clickSide},
                    {
                        curve: go.Link.Bezier,
                        adjusting: go.Link.Stretch,
                        reshapable: true,
                        relinkableFrom: true,
                        relinkableTo: true,
                        toShortLength: 3
                    },
                    new go.Binding("points").makeTwoWay(),
                    new go.Binding("curviness"),
                    $(go.Shape,  // 线的宽度
                        { strokeWidth: 1.5 }),
                    $(go.Shape,  // 箭头显示
                        { toArrow: "standard", stroke: null }),
                    $(go.Panel, "Auto",
                        $(go.Shape,  // the label background, which becomes transparent around the edges
                            {
                                fill: $(go.Brush, "Radial",
                                    {  0: "rgb(240, 240, 240)",
                                        0.3: "rgb(240, 240, 240)",
                                        1: "rgba(240, 240, 240, 0)" }),
                                stroke: null
                            }),
                        $(go.TextBlock, "new_source_edge",  // the label text
                            {
                                name:'LINKNAME',
                                textAlign: "center",
                                font: "9pt helvetica, arial, sans-serif",
                                margin: 4,
                                editable: false, //不能直接编辑
                                cursor: "pointer",
                            },
                            // 线的描述文字
                            new go.Binding("text",'linkName').makeTwoWay()),
                        {
                            // 注册鼠标右键事件
                            contextMenu: partContextMenu
                        }
                    )
                );
            //初始化数据
            _this.sceneLoad();  //

            // 初始化调色板
            _this.myPalette =
                $(go.Palette, "myPaletteDiv",
                    {
                        maxSelectionCount: 1,
                        nodeTemplateMap: _this.myDiagram.nodeTemplateMap,  // 共享myDiagram使用的模板。
                        linkTemplate: //配置模板
                            $(go.Link,
                                { // 因为GridLayout。对齐是位置，节点有locationSpot == Spot.Center，
                                    // 要以同样的方式排列链接，我们必须假装链接具有相同的位置点。
                                    locationSpot: go.Spot.Center,
                                    selectionAdornmentTemplate:
                                        $(go.Adornment, "Link",
                                            { locationSpot: go.Spot.Center },
                                            $(go.Shape,
                                                {   isPanelMain: true,
                                                    fill: null,
                                                    stroke: "deepskyblue",
                                                    strokeWidth: 0 }),
                                            $(go.Shape,  // the arrowhead
                                                { toArrow: "Standard", stroke: null })
                                        )
                                },
                                {
                                    curve: go.Link.Bezier,
                                    adjusting: go.Link.Stretch,
                                    reshapable: true,
                                    relinkableFrom: true,
                                    relinkableTo: true,
                                    toShortLength: 3
                                },
                                new go.Binding("points"),
                                $(go.Shape,  // the link path shape
                                    { isPanelMain: true, strokeWidth: 2 }),
                                $(go.Shape,  // the arrowhead
                                    { toArrow: "Standard", stroke: null })

                            ),
                        model: new go.GraphLinksModel([  // specify the contents of the Palette
                            {   text: "Start",
                                figure: "Circle",
                                fill: "#00AD5F",
                                name:'newNode',
                            },
                            {   text: "Global",
                                figure: "Circle",
                                fill: "#fff",
                                name:'newNode',
                            },
                            {   text: "step",
                                figure: "RoundedRectangle",
                                fill: "lightyellow",
                                name:'newNode',
                            },
                            {   text: "End",
                                figure: "Circle",
                                fill: "#CE0620",
                                name:'newNode',
                            },
                        ])
                    });
        },
        methods:{
            /*
                go.js需要的函数
             */
            sceneLoad(){
                this.$_ajax(this.$_api.querySceneById,{
                    id:this.$route.params.sceneId
                }).then(res => {
                    if(res.success){
                        let graph = res.data.graph || {};
                        this.myDiagram.model = go.Model.fromJson(graph);
                        let pos = this.myDiagram.model.modelData.position;
                        if (pos) {
                            this.myDiagram.initialPosition = go.Point.parse(pos);
                        }
                    }
                });
            },
            //点击节点
            clickNode(e,obj){
                this.nodeObj = obj; //保存点击的节点对象
                let linksInto = [], linksOutOf = [];
                this.nodeConfigForm = obj.data.nodeConfigForm || {
                    name: '',  //节点名字
                    nodeDesc: '',//节点描述
                    unKnownNum: '',//未知交互
                    //指向该节点的边
                    linksInto: [],
                    //实体列表 paramName paramType paramValue promotoe defaultValue
                    nodeParam:[],
                    //因子列表 factorName  factorDesc factorKeyValue  response
                    nodeFactor:[],
                    //响应输出 priority rule type response
                    nodeResponse:[],
                    //从该点指出去的边
                    linksOutOf: [],
                };
                //指向出去的节点
                obj.findLinksOutOf().each(function(l) {
                    if(!l.data.linkName){
                        linksOutOf.push({
                            linkName:'new_source_dege',
                            linksOutForm: {
                                linkName: '', //边的名字
                                linkDesc: '',  //边的描述
                                linkDirection: '',  //边的指向
                                linkPriority: '',   //边的优先级
                            },
                            linksOutPrecondition:[], //{precondition:''}
                            linksOutUserSay:[],// userSay , paramName ,  paramType , paramValue
                            linksOutRule:[], //linkRule
                            linksOutParam:[],//paramName, paramType ,paramValue , defaultValue
                            linksOutFactor:[],//factorName,factorDesc,factorKeyValue,response,,
                        })
                    }else{
                        linksOutOf.push({
                            linkName: l.data.edgeConfig.linkName,
                            //边的基本信息 linkName linkDesc direction priority
                            linksOutForm:{
                                linkName:l.data.edgeConfig.linkName,
                                linkDesc:l.data.edgeConfig.linkDesc,
                                direction:l.data.edgeConfig.linkDirection,
                                priority:l.data.edgeConfig.linkPriority,
                            },
                            //边的前置条件 precondition
                            linksOutPrecondition:l.data.edgeConfig.linksOutPrecondition,
                            //用户描述userSay paramName paramType paramValue
                            linksOutUserSay:l.data.edgeConfig.linksOutUserSay,
                            //规则 linkRule
                            linksOutRule: l.data.edgeConfig.linksOutRule,
                            //实体列表 paramName  paramType paramValue paramDefaultValue
                            linksOutParam:l.data.edgeConfig.linksOutParam,
                            //因子列表 factorName factorDesc  keyValue
                            linksOutFactor: l.data.edgeConfig.linksOutFactor,
                        })
                    }
                });
                this.nodeConfigForm.linksOutOf = linksOutOf.slice(0);
                //指进来的边
                obj.findLinksInto().each(function(l) {
                    if(!l.data.linkName){
                        linksInto.push({
                            linkName: 'new_source_edge',
                            //边的基本信息 linkName linkDesc direction priority
                            linksIntoBasic:[],
                            //边的前置条件 precondition
                            linksIntoPrecondition: [],
                            //用户描述userSay paramName paramType paramValue
                            linksIntoUserSay: [],
                            //规则 linkRule
                            linksIntoRule: [],
                            //实体列表 paramName  paramType paramValue paramDefaultValue
                            linksIntoParam: [],
                            //因子列表 factorName factorDesc  keyValue
                            linksIntoFactor: []
                        })
                    }else{
                        linksInto.push({
                            linkName: l.data.edgeConfig.linkName,
                            //边的基本信息 linkName linkDesc direction priority
                            linksIntoBasic:[{
                                linkName:l.data.edgeConfig.linkName,
                                linkDesc:l.data.edgeConfig.linkDesc,
                                direction:l.data.edgeConfig.linkDirection,
                                priority:l.data.edgeConfig.linkPriority,
                            }],
                            //边的前置条件 precondition
                            linksIntoPrecondition:l.data.edgeConfig.linksOutPrecondition,
                            //用户描述userSay paramName paramType paramValue
                            linksIntoUserSay:l.data.edgeConfig.linksOutUserSay,
                            //规则 linkRule
                            linksIntoRule: l.data.edgeConfig.linksOutRule,
                            //实体列表 paramName  paramType paramValue paramDefaultValue
                            linksIntoParam:l.data.edgeConfig.linksOutParam,
                            //因子列表 factorName factorDesc  keyValue
                            linksIntoFactor: l.data.edgeConfig.linksOutFactor,
                        })
                    }

                });
                this.nodeConfigForm.linksInto = linksInto.slice(0);
                //显示弹框
                this.nodeConfigModal = true;
            },
            //点击边的时候
            clickSide(e,obj){
                let edge =  !!e ?  e.diagram.selection.first() : obj;
                this.edgeConfig = edge.data.edgeConfig || {
                    linkName:'new_source_edge',
                    linkDesc:'',
                    linkDirection:'',
                    linkPriority:'',
                    linksOutPrecondition:[],
                    linksOutUserSay:[],
                    linksOutRule:[],
                    linksOutParam:[],
                    linksOutFactor:[],
                };
                this.edgeObj = edge;
                this.edgeConfigModal = true;
            },
            //当画布改变的时候
            modified(e){
                let idx = document.title.indexOf("*");
                if (this.myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            },
            //添加响应
            addResponse(){
                this.nodeConfigForm.nodeResponse.push({
                    priority:this.nodeConfigForm.nodeResponse.length + 1,
                    rule:'新增规则',
                    type:'TEXT',
                    response:'新增输出响应',
                });
            },
            //编辑规则按钮
            editTableRule(params){
                this.ruleParams = params;
                this.ruleModal = 'nodeRule';
                this.addConstantForm.name = '';
                this.nodeOutputRule = [];
                //显示弹框
                this.editRule = true;
            },
            //编辑响应内容
            editResponse(params){
                this.ruleParams = params;
                //显示编辑响应内容的弹框
                this.addNewResponseModal = true;
            },
            //编辑前置条件 type  为edge 或者node edge 边上为边的编辑 node 表示为节点的编辑
            editPrecondition(params,type){
                this.preditionParams = params;
                //初始化条件弹框
                this.addConstantForm.name = '';
                this.nodeOutputRule = [];
                this.ruleType = type;
                //显示编辑响应内容的弹框
                this.editPreconditionModal = true;
            },
            //取消添加一个新场景
            cancelEditResponse(name){
                this.addNewResponseModal = false;//关闭弹框
                this.$refs[name].resetFields();
            },
            //确定添加一个新场景
            sureEditResopnse(name){
                let _this = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.sureEditResponseLoading = true;
                        setTimeout(function(){
                            _this.sureEditResponseLoading = false;
                            let newNodeConfigTable = _this.nodeConfigForm.nodeResponse.slice(0);
                            newNodeConfigTable[_this.ruleParams.index].response = _this.newResopnseFormValidate.response;
                            _this.nodeConfigForm.nodeResponse = newNodeConfigTable.slice(0);
                            _this.addNewResponseModal = false; //关闭弹框
                        },300);
                    }
                })
            },
            //删除实体列表
            deleteParamsRow(params){
                this.nodeConfigForm.nodeParam.splice(params.index,1);
            },
            //新增因子
            addNewFactorButton(params){
                this.factorModal = params;
                this.addNewFactorModal = true;
            },
            //点击因子列表的添加按钮
            addNewFactor(index,row){
                if(this.edgeConfigModal){
                    this.edgeConfig.linksOutFactor.push(row);
                }else{
                    if(this.factorModal == 'linkFactor'){
                        this.nodeConfigForm.linksOutOf[this.linksOutOfIndex].linksOutFactor.push(row);
                    }else {
                        this.nodeConfigForm.nodeFactor.push(row);
                    }
                }
                this.addNewFactorModal = false;
            },
            //当前指出去的边的索引
            changeLinksOutCol(value){
                this.linksOutOfIndex = Number(value[value.length - 1]);
            },
            deleteFactorRow(params){
                this.nodeConfigForm.nodeFactor.splice(params.index,1);
            },
            //删除输出响应
            deleteResRow(params){
                this.nodeConfigForm.nodeResponse.splice(params.index,1);
            },
            //删除编辑规则
            deleteEditParamsRow(params,type){
                if(type == 'edge'){
                    this.edgeConfig.linksOutParam.splice(params.index,1);
                }else{
                    this.nodeConfigForm.linksOutOf[this.linksOutOfIndex].linksOutParam.splice(params.index,1);
                }

            },
            //向下交互顺序
            directionDown(index,row){
                if(index < this.nodeConfigForm.nodeResponse.length - 1){
                    let downData = this.nodeConfigForm.nodeResponse[index + 1];
                    let newNodeResponse = this.nodeConfigForm.nodeResponse.splice(0);
                    newNodeResponse[index] = downData;
                    newNodeResponse[index + 1] = row;
                    this.nodeConfigForm.nodeResponse = newNodeResponse.slice(0);
                }
            },
            //向上交换顺序
            directionUp(index,row){
                if(index > 0){
                    let upData = this.nodeConfigForm.nodeResponse[index - 1];
                    let newNodeResponse = this.nodeConfigForm.nodeResponse.splice(0);
                    newNodeResponse[index] = upData;
                    newNodeResponse[index - 1] = row;
                    this.nodeConfigForm.nodeResponse = newNodeResponse.slice(0);
                }
            },
            //新增前置条件
            addNewLinksOutPrecondition(item,index){
                this.nodeConfigForm.linksOutOf[index].linksOutPrecondition.push({
                    precondition:'新增前置条件'
                });
            },
            addEdgePrecondition(){
                this.edgeConfig.linksOutPrecondition.push({
                    precondition:'新增前置条件'
                })
            },
            //删除前置条件
            deletePreconditionRow(params,type){
                if(type == 'edge'){
                    this.edgeConfig.linksOutPrecondition.splice(params.index,1);
                }else{
                    this.nodeConfigForm.linksOutOf[this.linksOutOfIndex].linksOutPrecondition.splice(params.index,1);
                }

            },
            //节点配置只能输入 下划线和字母
            keydownName(e){
                //console.log(e.target.value);
                this.nodeConfigForm.name = this.$_validate.inputNameCode(e);
            },
            //未知交互只能输入数字
            keydownUnKnownNum(e){
                this.nodeConfigForm.unKnownNum = this.$_validate.inputNumber(e);
            },
            //输入常量
            addConstant(name){
                if(this.addConstantForm.name){
                    this.nodeOutputRule.push({
                        value:this.addConstantForm.name,
                        key:'',
                        type:this.addConstantForm.type
                    });
                    this.addConstantForm.name = '';
                }
            },
            //删除用户描述文本
            deleteUserSayRow(params){
                if(this.edgeConfigModal){
                    this.edgeConfig.linksOutUserSay.splice(params.index,1);
                }else {
                    this.nodeConfigForm.linksOutOf[this.linksOutOfIndex].linksOutUserSay.splice(params.index,1);
                }
            },
            //新增用户说的话
            addNewUserSay(params,index){
                if(index != ''){ //编辑用户描述文本
                    this.newUserSayForm.userSay = params.row.userSay;
                    let paramNameArr = params.row.paramName.split('|') ,
                        paramTypeArr = params.row.paramType.split('|') ,
                        paramValueArr = params.row.paramValue.split('|') ;
                    this.newUserSayDataTable = [];
                    for(let i = 0; i < paramNameArr.length; i++){
                        this.newUserSayDataTable.push({
                            paramName:paramNameArr[i],
                            paramType:paramTypeArr[i],
                            paramValue:paramValueArr[i],
                        })
                    }
                }else{ //新增用户描述文本
                    this.newUserSayDataTable = [];
                    this.newUserSayForm.userSay = '';
                }
                this.addNewUserSayModal = true;
            },
            //编辑边的用户说的话
            addEdgeUserSay(params,index){
                if(index == undefined){ //编辑用户描述文本
                    this.newUserSayForm.userSay = params.row.userSay;
                    let paramNameArr = params.row.paramName.split('|') ,
                        paramTypeArr = params.row.paramType.split('|') ,
                        paramValueArr = params.row.paramValue.split('|') ;
                    this.newUserSayDataTable = [];
                    for(let i = 0; i < paramNameArr.length; i++){
                        this.newUserSayDataTable.push({
                            paramName:paramNameArr[i],
                            paramType:paramTypeArr[i],
                            paramValue:paramValueArr[i],
                        })
                    }
                }else{ //新增用户描述文本
                    this.newUserSayDataTable = [];
                    this.newUserSayForm.userSay = '';
                }
                this.userType = 'edge';
                this.addNewUserSayModal = true;
            },
            //删除实体
            deleteNewParamsRow(params){
                this.newUserSayDataTable.splice(params.index,1);
            },
            addNewUserSayForm(name){
                let _this = this;
                let paramNameArr = [] , paramTypeArr = [], paramValueArr = [];
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.sureEditResponseLoading = true;
                        setTimeout(function(){
                            _this.sureEditResponseLoading = false;
                            for(let i = 0 ; i < _this.newUserSayDataTable.length; i++){
                                paramNameArr.push(_this.newUserSayDataTable[i].paramName);
                                paramTypeArr.push(_this.newUserSayDataTable[i].paramType);
                                paramValueArr.push(_this.newUserSayDataTable[i].paramValue);
                            }
                            if(_this.userType == 'edge'){
                                _this.edgeConfig.linksOutUserSay.push({
                                    userSay:_this.newUserSayForm.userSay,
                                    paramName:paramNameArr.join('|'),
                                    paramType:paramTypeArr.join('|'),
                                    paramValue:paramValueArr.join('|'),
                                });
                            }else {
                                _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutUserSay.push({
                                    userSay:_this.newUserSayForm.userSay,
                                    paramName:paramNameArr.join('|'),
                                    paramType:paramTypeArr.join('|'),
                                    paramValue:paramValueArr.join('|'),
                                });
                            }
                            _this.addNewUserSayModal = false; //关闭弹框
                        },300);
                    }
                })
            },
            //新增编辑规则
            addNewLinkRule(params,index){
                this.ruleModal = 'linkRule'; //说明在更改边上的规则
                this.addConstantForm.name = '';
                this.nodeOutputRule = [];
                this.ruleParams = params;
                this.editRule = true;
            },
            deleteNewLinkRule(params){
                if(this.edgeConfigModal){
                    this.edgeConfig.linksOutRule.splice(params.index,1);
                }else {
                    this.nodeConfigForm.linksOutOf[this.linksOutOfIndex].linksOutRule.splice(params.index,1);
                }
            },
            //关闭用户说的弹框
            cancelNewUserSayForm(){
                this.addNewUserSayModal = false;
            },
            //拖拽开始
            dragStartEvent(e,item){
                this.dragItem = item;
            },
            //允许拖拽
            allowDrop(event){
                event.preventDefault();
            },
            //拖拽结束
            drop(event){
                event.preventDefault();
                this.nodeOutputRule.push(this.dragItem);
            },
            //删除规则
            deleteRule(index){
                this.nodeOutputRule.splice(index, 1);
            },
            //删除编辑因子
            deleteEditFactorRow(params){
                if(this.edgeConfigModal){
                    this.edgeConfig.linksOutFactor.splice(params.index, 1);
                }else{
                    this.nodeConfigForm.linksOutOf[this.linksOutOfIndex].linksOutFactor.splice(params.index, 1);
                }
            },
            //保存规则
            keepRule(){
                let _this = this;
                let outArray = [];
                for(let i = 0 ; i < this.nodeOutputRule.length; i++){
                    outArray.push(this.nodeOutputRule[i].value);
                }
                this.keepRuleLoading = true;
                setTimeout(function(){
                    _this.keepRuleLoading = false;

                    if(_this.ruleModal == 'linkRule'){
                        if(_this.edgeConfigModal){
                            let newNodeConfigTable = _this.edgeConfig.linksOutRule.slice(0);
                            if(_this.ruleParams.index == undefined){
                                newNodeConfigTable.push({
                                    linkRule:outArray.join('')
                                })
                            }else{
                                newNodeConfigTable[_this.ruleParams.index].linkRule = outArray.join('');
                            }
                            _this.edgeConfig.linksOutRule = newNodeConfigTable.slice(0);
                        }else {
                            let newNodeConfigTable = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutRule.slice(0);
                            if(_this.ruleParams.index == undefined){
                                newNodeConfigTable.push({
                                    linkRule:outArray.join('')
                                })
                            }else{
                                newNodeConfigTable[_this.ruleParams.index].linkRule = outArray.join('');
                            }
                            _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutRule = newNodeConfigTable.slice(0);
                        }
                    }else if(_this.ruleModal == 'nodeRule'){
                        let newNodeConfigTable = _this.nodeConfigForm.nodeResponse.slice(0);
                        newNodeConfigTable[_this.ruleParams.index].rule = outArray.join('');
                        _this.nodeConfigForm.nodeResponse = newNodeConfigTable.slice(0);
                    }
                    _this.editRule = false;
                },300);
            },
            //关闭编辑规则的弹框
            closeEditModal(){
                this.editRule = false;
            },
            //关闭编辑节点的弹框
            closeNodeConfigModal(){
                this.nodeConfigModal = false;
            },
            //保存节点的数据
            nodeConfigData(){
                let _this = this;
                let paramNameArr = [] , paramTypeArr = [], paramValueArr = [];
                this.$refs['nodeConfigForm'].validate((valid) => {
                    if (valid) {
                        this.myDiagram.model.modelData.position = go.Point.stringify(this.myDiagram.position);
                        let scenceData = JSON.parse(this.myDiagram.model.toJson());
                        for(let i = 0; i < scenceData.nodeDataArray.length; i++){
                            if(this.nodeObj.data.key != scenceData.nodeDataArray[i].key ){
                                if(!!scenceData.nodeDataArray[i].nodeConfigForm){
                                    if(scenceData.nodeDataArray[i].nodeConfigForm.name == this.nodeConfigForm.name) {
                                        this.$Message.error({
                                            content: '节点名字不能重复',
                                            duration: 2
                                        });
                                        return false;
                                    }
                                }
                            }
                        }
                        let node = this.myDiagram.model.findNodeDataForKey(this.nodeObj.data.key);
                        if(node !== null){
                            this.myDiagram.model.setDataProperty(node, "nodeConfigForm", this.nodeConfigForm);
                            this.myDiagram.model.setDataProperty(node, "text", this.nodeConfigForm.name);
                        }
                        this.nodeConfigModal = false;
                    }else{
                        this.$Message.error({
                            content: '请填写完打红*的信息!',
                            duration: 2
                        });
                    }
                })
            },
            //编辑边的弹框
            closeEdgeConfigModal(){
                this.edgeConfigModal = false;
            },
            //保存边的数据
            edgeKeepData(){
                let _this = this;
                this.$refs['edgeForm'].validate((valid) => {
                    if (valid) {
                        this.myDiagram.model.modelData.position = go.Point.stringify(this.myDiagram.position);
                        let scenceData = JSON.parse(this.myDiagram.model.toJson());
                        for(let i = 0; i < scenceData.linkDataArray.length; i++){
                            if(this.edgeObj.data.from == scenceData.linkDataArray[i].from && this.edgeObj.data.to == scenceData.linkDataArray[i].to){
                            }else{
                                if(!!scenceData.linkDataArray[i].edgeConfig){
                                    if(scenceData.linkDataArray[i].edgeConfig.linkName == this.edgeConfig.linkName) {
                                        this.$Message.error({
                                            content: '边的名字不能重复',
                                            duration: 2
                                        });
                                        return false;
                                    }
                                }
                            }
                        }
                        this.edgeObj.data.edgeConfig = this.edgeConfig;
                        this.edgeObj.diagram.startTransaction("ChangeNodeText");
                        this.edgeObj.findObject("LINKNAME").text = this.edgeConfig.linkName;
                        this.edgeObj.diagram.commitTransaction("ChangeNodeText");
                        this.edgeConfigModal = false;
                    }else{
                        this.$Message.error({
                            content: '请填写完打红*的信息!',
                            duration: 2
                        });
                    }
                });
            },
            //关闭编辑规则的弹框
            closeEditPreconditionModal(){
                this.editPreconditionModal = false;
            },
            //保存规则
            keepPrecondition(){
                let _this = this;
                let outArray = [];
                for(let i = 0 ; i < this.nodeOutputRule.length; i++){
                    outArray.push(this.nodeOutputRule[i].value);
                }
                this.keepRuleLoading = true;
                setTimeout(function(){
                    _this.keepRuleLoading = false;
                    if(_this.ruleType == 'edge'){
                        let newNodeConfigTable = _this.edgeConfig.linksOutPrecondition.slice(0);
                        newNodeConfigTable[_this.preditionParams.index].precondition = outArray.join('');
                        _this.edgeConfig.linksOutPrecondition = newNodeConfigTable.slice(0);
                    }else{
                        let newNodeConfigTable = _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutPrecondition.slice(0);
                        newNodeConfigTable[_this.preditionParams.index].precondition = outArray.join('');
                        _this.nodeConfigForm.linksOutOf[_this.linksOutOfIndex].linksOutPrecondition = newNodeConfigTable.slice(0);
                    }

                    _this.editPreconditionModal = false;
                },300);
            },

            //addParams() 新增实体
            addParams(){
                this.nodeConfigForm.nodeParam.push({
                    paramName: 'config',
                    paramType:'sys.config',
                    paramValue: '新增实体值',
                    promotoe: '',
                    defaultValue:'',
                })
            },
            //撤销
            undoEvent(){
                this.myDiagram.commandHandler.undo();
            },
            //恢复
            redoEvent(){
                this.myDiagram.commandHandler.redo()
            },
            //保存数据
            keepData(){
                let _this = this;
                _this.myDiagram.model.modelData.position = go.Point.stringify(_this.myDiagram.position);
                //document.getElementById("mySavedModel").value = _this.myDiagram.model.toJson();
                console.log(_this.myDiagram.model.toJson());
                _this.myDiagram.isModified = false;
            },
        }
    }
</script>

<style lang="scss">
    .tool{
        padding: 5px 30px;
    }
    .show-scene{
        .edit-scene{
            width: 100%;
            display: flex;
            justify-content: space-between;
            #myPaletteDiv{
                border: solid 1px black;
                width: 105px;
                margin-right: 2px;
                background: #ffffff;
            }
            #myDiagramDiv{
                flex-grow: 1;
                height:700px;
                background: #ffffff;
                border: solid 1px black;
            }
        }
        .search-res{
            height: 700px;
            border: 1px solid;
            background: #ffffff;
        }
    }
    .symbol-rule{
        height: 32px;
        line-height: 32px;
        min-width: 50px;
        text-align: center;
        background-color: #ebf8f2;
        border: 1px solid #cfefdf;
        cursor: move;
    }
    .out-rule{
        cursor: pointer;
    }
    .input-select{
        width:100px;
        background-color: #fff;
        .ivu-select-selection{
            border: 1px solid #dddee1 !important;
        }
    }
    .ivu-form-item-error .ivu-select-arrow {
        color: #80848f;
    }
</style>