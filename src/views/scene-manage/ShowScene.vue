<template>
    <div class="show-scene">
        <Row :gutter="16">
            <Col span="20">
                <div class="tool">
                    <div class="tool-button">
                        <Button type="primary" @click="undoEvent">撤销(Ctr+Z)</Button >
                        <Button  type="primary" @click="redoEvent">恢复(Ctr+Y)</Button >
                        <Button  type="primary" @click="keepData">保存数据</Button >
                    </div>
                    <div style="padding-top: 8px;" v-show="keepProcess">
                        <Progress :percent="processPercent" :status="processStatus"></Progress>
                    </div>
                </div>
                <div class="edit-scene">
                    <div id="myPaletteDiv"></div>
                    <div id="myDiagramDiv"></div>
                </div>
            </Col>
            <Col span="4">
                <div class="search-res">
                    <h3 class="scene-test">意图测试</h3>
                    <div @keydown.enter="testScene">
                        <Form @submit.native.prevent
                              :label-width="0">
                            <FormItem>
                                <Input v-model="sceneValue" placeholder="请输入语句"></Input>
                            </FormItem>
                        </Form>
                    </div>
                    <div v-show="enterUserSay">
                        <h6 style="line-height: 30px;">用户说：</h6>
                        <Alert style="background: #e9e9e9;border: 0;" >{{enterUserSay}}</Alert>
                    </div>
                    <Alert v-show="!!testResult">
                        {{testResult}}
                    </Alert>
                    <Alert v-show="!testResult">
                        请在此输入测试语句
                        <span slot="desc">请输入语句以测试意图。 </span>
                    </Alert>
                </div>
            </Col>
        </Row>
        <Modal v-model="nodeConfigModal"
               :closable="false"
               :mask-closable="false"
               width="60%">
            <div slot="header"  >

            </div>
            <Form ref="nodeConfigForm"
                  :model="pointInfo"
                  inline
                  :label-width="80">
                <h3 class="modal-title" style="padding-top: 0px;">节点信息：</h3>
                <FormItem label="节点名字" style="margin-bottom: 0px;">
                    <Input
                            v-model="pointInfo.pointBasic.name"
                            @on-keyup="keydownName"
                            :maxlength="30"
                            autofocus
                            placeholder="请输入节点名字"></Input>
                </FormItem>
                <FormItem
                        label="节点描述"
                        style="margin-bottom: 0px;">
                    <Input
                            v-model="pointInfo.pointBasic.description"
                            placeholder="请输入节点描述"></Input>
                </FormItem>
                <FormItem
                        style="margin-bottom: 0px;"
                        label="未知交互">
                    <Input
                            v-model="pointInfo.pointBasic.unknownLimitNum"
                            @on-keyup="keydownUnKnownNum"
                            :maxlength="1"
                            placeholder="请输入未知交互的次数"></Input>
                </FormItem>
                <h3 class="modal-title">实体列表：</h3>
                <Table border size="small" :columns="pointParamsEntities" :data="pointInfo.pointParamsEntities"></Table>
                <h3 class="modal-title">因子列表：</h3>
                <Select
                        size="small"
                        v-model="chooseFactor"
                        @on-change="nodeChangeFactor"
                        placeholder="新增规则"
                        style="width: 140px; margin-bottom: 10px;"
                >
                    <Option v-for="(factor,idx) in allFactorList"
                            :key="idx" :value="factor.factorName">
                        {{factor.factorName}}
                    </Option>
                </Select>
                <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-header">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <colgroup>
                                    <col width="18%">
                                    <col width="18%">
                                    <col width="54%">
                                    <col width="10%">
                                </colgroup>
                                <thead>
                                <tr>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>因子名字</span>
                                        </div>
                                    </th>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>因子</span>
                                        </div>
                                    </th>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>key_value</span>
                                        </div>
                                    </th>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>操作</span></div>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="ivu-table-body">
                            <div v-show="pointInfo.pointParamsFactors.length == 0" class="no-data">暂无数据</div>
                            <table  cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <colgroup>
                                    <col width="18%">
                                    <col width="18%">
                                    <col width="54%">
                                    <col width="10%">
                                </colgroup>
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row"
                                    v-for="(item,index) in pointInfo.pointParamsFactors" :key="index">
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <Input size="small" v-model="item.paramName"
                                                   placeholder="请输入因子名字"></Input>
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell" >
                                            {{item.factor}}
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell" v-for="(value,idx) in item.keyValue"
                                             v-if="Object.keys(item.keyValue).length > 0" :key="idx">
                                            <FormItem :label="idx" style="width: 100%;margin-bottom: 2px;" >
                                                <Input size="small" v-model="item.keyValue[idx]" placeholder="请输入key值"></Input>
                                            </FormItem>
                                        </div>
                                        <div class="no-data"
                                             v-if="Object.keys(item.keyValue).length <= 0">
                                            无参数
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <Button type="text"
                                                    size="small"
                                                    @click="deleteFactorParam(item,index)"
                                                    icon="trash-a"></Button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <h3 class="modal-title">响应：</h3>
                <Select
                        size="small"
                        v-model="chooseResRule"
                        @on-change="changeResRule"
                        placeholder="新增响应"
                        style="width: 140px;margin-bottom: 10px;"
                >
                    <Option v-for="(response,idx) in responseRuleNme"
                            :key="idx" :value="response.rule">
                        {{response.rule}}
                    </Option>
                </Select>

                <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-header">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <colgroup>
                                    <col width="25%">
                                    <col width="15%">
                                    <col width="45%">
                                    <col width="15%">
                                </colgroup>
                                <thead>
                                <tr>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>规则</span>
                                        </div>
                                    </th>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>类型</span>
                                        </div>
                                    </th>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>响应内容</span>
                                        </div>
                                    </th>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>操作</span></div>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div class="ivu-table-body">
                            <div v-show="pointInfo.pointResponses.length == 0" class="no-data">暂无数据</div>
                            <table  cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <colgroup>
                                    <col width="25%">
                                    <col width="15%">
                                    <col width="45%">
                                    <col width="15%">
                                </colgroup>
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row"
                                    v-for="(item,index) in pointInfo.pointResponses" :key="index">
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            {{item.rule}}
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <Select size="small" v-model="item.type" placeholder="请选择类型">
                                                <Option value="">请选择</Option>
                                                <Option value="1">数字</Option>
                                                <Option value="2">字符串</Option>
                                                <Option value="3">布尔值</Option>
                                                <Option value="4">对象</Option>
                                            </Select>
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <Input size="small" v-model="item.content"
                                                   placeholder="请输入响应内容"></Input>
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <ButtonGroup>
                                                <Button size="small"
                                                        @click="directionDown(item,index)"
                                                        v-if="index != pointInfo.pointResponses.length - 1"
                                                        icon="chevron-down"></Button>
                                                <Button size="small" @click="directionUp(item,index)"
                                                        v-if="index != 0"
                                                        icon="chevron-up"></Button>
                                                <Button size="small"
                                                        @click="deleteResRow(item,index)"
                                                        icon="trash-a"></Button>
                                            </ButtonGroup>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
            <div slot="header" ></div>
            <div @click="closeParamHtml">
                <Form ref="edgeForm"
                      :model="edgeInfo"
                      inline :label-width="80">
                    <h3 class="modal-title" style="padding-top: 0px;">边信息：</h3>
                    <FormItem label="边的名字"
                              style="margin-bottom: 0;">
                        <Input
                                v-model="edgeInfo.edgeBasic.name"
                                @on-keyup="keydownEdgeName"
                                :maxlength="30"
                                autofocus
                                style="width: 200px;"
                                placeholder="请输入边的名字"></Input>
                    </FormItem>
                    <FormItem
                            style="margin-bottom: 0;"
                            label="边的描述">
                        <Input
                                style="width: 200px;"
                                v-model="edgeInfo.edgeBasic.description"
                                placeholder="请输入边的描述"></Input>
                    </FormItem>
                    <FormItem
                            style="margin-bottom: 0;"
                            label="边优先级">
                        <Input
                                v-model="edgeInfo.edgeBasic.priority"
                                @on-keyup="keydownEdgeUnKnownNum"
                                :maxlength="2"
                                style="width: 200px;"
                                placeholder="请输入边的优先级"></Input>
                    </FormItem>
                    <h3 class="modal-title">用户描述：</h3>
                    <Input v-model="userSayText"
                           @on-enter="enterUserSayText"
                           placeholder="请输入用户描述文本" ></Input>

                    <Collapse v-model="userCollapse" accordion  class="user-say" >
                        <Panel  v-for="(item,index) in edgeInfo.edgeUserSays"
                                :name="(index + 1).toString()" :key="index">
                            <div style="position: relative;"
                                 @click="clickInputText(item,index,$event)" @copy="copyInputText">
                                <Input v-model="item.content" class="codeParam"></Input>
                                <Button type="text"
                                        size="small"
                                        style="position: absolute;right: 0;top: 6px;"
                                        @click="deleteUserSay(item,index)"
                                        icon="trash-a"></Button>
                            </div>

                            <div slot="content" style="padding: 0 5px;" >
                                <div class="ivu-table-wrapper">
                                    <div class="ivu-table ivu-table-small ivu-table-border">
                                        <div class="ivu-table-header">
                                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                                <colgroup>
                                                    <col width="15%">
                                                    <col width="15%">
                                                    <col width="30%">
                                                    <col width="30%">
                                                    <col width="10%">
                                                </colgroup>
                                                <thead>
                                                <tr>
                                                    <th class="">
                                                        <div class="ivu-table-cell">
                                                            <span>实体名字</span>
                                                        </div>
                                                    </th>
                                                    <th class="">
                                                        <div class="ivu-table-cell">
                                                            <span>实体类型</span>
                                                        </div>
                                                    </th>
                                                    <th class="">
                                                        <div class="ivu-table-cell">
                                                            <span>实体值</span>
                                                        </div>
                                                    </th>
                                                    <th class="">
                                                        <div class="ivu-table-cell">
                                                            <span>默认值</span>
                                                        </div>
                                                    </th>
                                                    <th class="">
                                                        <div class="ivu-table-cell">
                                                            <span>操作</span></div>
                                                    </th>
                                                </tr>
                                                </thead>
                                            </table>
                                        </div>
                                        <div class="ivu-table-body">
                                            <div v-show="item.paramList.length == 0" class="no-data">暂无数据</div>
                                            <table  cellspacing="0" v-show="item.paramList.length > 0" cellpadding="0" border="0" style="width: 100%;">
                                                <colgroup>
                                                    <col width="15%">
                                                    <col width="15%">
                                                    <col width="30%">
                                                    <col width="30%">
                                                    <col width="10%">
                                                </colgroup>
                                                <tbody class="ivu-table-tbody">
                                                <tr class="ivu-table-row"
                                                    v-for="(param,idx) in item.paramList" :key="idx">
                                                    <td class="">
                                                        <div class="ivu-table-cell">
                                                            <Input size="small" v-model="param.paramName"
                                                                   placeholder="实体名字"></Input>
                                                        </div>
                                                    </td>
                                                    <td class="">
                                                        <div class="ivu-table-cell" @click="clickParamSelect(param,idx)">
                                                            <Select
                                                                    size="small"
                                                                    v-model="param.entityType"
                                                                    @on-change="nodeChangeFactor"
                                                            >
                                                                <Option v-for="(par,idx) in allParamList"
                                                                        :key="idx" :value="par.entityName">
                                                                    {{par.entityName}}
                                                                </Option>
                                                            </Select>
                                                        </div>
                                                    </td>
                                                    <td class="">
                                                        <div class="ivu-table-cell" >
                                                            {{param.entityValue}}
                                                        </div>
                                                    </td>
                                                    <td class="">
                                                        <div class="ivu-table-cell" >
                                                            <Input  placeholder="默认值" v-model="param.defaultValue"></Input>
                                                        </div>
                                                    </td>
                                                    <td class="">
                                                        <div class="ivu-table-cell">
                                                            <Button type="text"
                                                                    size="small"
                                                                    @click="deleteUserSayParam(item,index)"
                                                                    icon="trash-a"></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Panel>

                    </Collapse>
                    <div class="ivu-select-dropdown"
                         :style="{width: '139px' ,position: 'absolute',top:offsetTop + 'px',left:offsetLeft + 'px',display:display}">

                        <ul class="ivu-select-dropdown-list">
                            <li class="ivu-select-item" v-for="(item,index) in allParamList" @click="addParamList(item,index)" :key="index">
                                {{item.entityName}}
                            </li>
                        </ul>
                    </div>
                    <h3 class="modal-title">规则：</h3>
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-small">
                            <div class="ivu-table-body">
                                <div v-show="edgeInfo.edgeRules.length == 0" class="no-data">暂无数据</div>
                                <table  cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                    <colgroup>
                                        <col width="95%">
                                        <col width="5%">
                                    </colgroup>
                                    <tbody class="ivu-table-tbody">
                                        <tr class="ivu-table-row"
                                            v-for="(item,index) in edgeInfo.edgeRules" :key="index">
                                            <td class="">
                                                <div class="ivu-table-cell">
                                                    {{item.rule}}
                                                </div>
                                            </td>
                                            <td class="">
                                                <div class="ivu-table-cell">
                                                    <Button size="small"
                                                            type="text"
                                                            @click="deleteRuleRow(item,index)"
                                                            icon="trash-a"></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Button size="small"
                            type="text"
                            style="color: #2d8cf0;"
                            @click="addNewRule"
                            icon="plus">新增规则</Button>
                    <h3 class="modal-title">实体：</h3>
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-small ivu-table-border">
                            <div class="ivu-table-header">
                                <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                    <colgroup>
                                        <col width="15%">
                                        <col width="15%">
                                        <col width="32%">
                                        <col width="32%">
                                        <col width="6%">
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>实体名字</span>
                                            </div>
                                        </th>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>实体类型</span>
                                            </div>
                                        </th>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>实体值</span>
                                            </div>
                                        </th>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>默认值</span>
                                            </div>
                                        </th>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>操作</span></div>
                                        </th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="ivu-table-body">
                                <div v-show="edgeInfo.edgeParamsEntities.length == 0" class="no-data">暂无数据</div>
                                <table  cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                    <colgroup>
                                        <col width="15%">
                                        <col width="15%">
                                        <col width="32%">
                                        <col width="32%">
                                        <col width="6%">
                                    </colgroup>
                                    <tbody class="ivu-table-tbody">
                                    <tr class="ivu-table-row"
                                        v-for="(item,index) in edgeInfo.edgeParamsEntities" :key="index">
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                <Input size="small" v-model="item.paramName"
                                                       placeholder="请输入因子名字"></Input>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell" @click="clickParamSelect(item,index)">
                                                <Select
                                                        size="small"
                                                        v-model="item.entityType"
                                                        @on-change="nodeChangeFactor"
                                                >
                                                    <Option v-for="(par,idx) in allParamList"
                                                            :key="idx" :value="par.entityName">
                                                        {{par.entityName}}
                                                    </Option>
                                                </Select>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                <Input size="small" v-model="item.entityValue"
                                                       placeholder="请输入实体值"></Input>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                <Input size="small" v-model="item.defaultValue"
                                                       placeholder="默认值"></Input>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                <Button type="text"
                                                        size="small"
                                                        @click="deleteParamRow(item,index)"
                                                        icon="trash-a"></Button>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Button size="small"
                            type="text"
                            style="color: #2d8cf0;"
                            @click="addNewParam"
                            icon="plus">新增实体</Button>
                    <h3 class="modal-title">因子：</h3>
                    <Select
                            size="small"
                            v-model="edgeFactor"
                            @on-change="edgeChangeFactor"
                            placeholder="新增规则"
                            style="width: 140px; margin-bottom: 10px;"
                    >
                        <Option v-for="(factor,idx) in allFactorList"
                                :key="idx" :value="factor.factorName">
                            {{factor.factorName}}
                        </Option>
                    </Select>
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-small ivu-table-border">
                            <div class="ivu-table-header">
                                <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                    <colgroup>
                                        <col width="18%">
                                        <col width="18%">
                                        <col width="54%">
                                        <col width="10%">
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>因子名字</span>
                                            </div>
                                        </th>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>因子</span>
                                            </div>
                                        </th>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>key_value</span>
                                            </div>
                                        </th>
                                        <th class="">
                                            <div class="ivu-table-cell">
                                                <span>操作</span></div>
                                        </th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="ivu-table-body">
                                <div v-show="edgeInfo.edgeParamsFactors.length == 0" class="no-data">暂无数据</div>
                                <table  cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                    <colgroup>
                                        <col width="18%">
                                        <col width="18%">
                                        <col width="54%">
                                        <col width="10%">
                                    </colgroup>
                                    <tbody class="ivu-table-tbody">
                                    <tr class="ivu-table-row"
                                        v-for="(item,index) in edgeInfo.edgeParamsFactors" :key="index">
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                <Input size="small" v-model="item.paramName"
                                                       placeholder="请输入因子名字"></Input>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell" >
                                                {{item.factor}}
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell" v-for="(value,idx) in item.keyValue"
                                                 v-if="Object.keys(item.keyValue).length > 0">
                                                <FormItem :label="idx" style="width: 100%;margin-bottom: 2px;" >
                                                    <Input size="small" v-model="item.keyValue[idx]" placeholder="请输入key值"></Input>
                                                </FormItem>
                                            </div>
                                            <div class="no-data"
                                                 v-if="Object.keys(item.keyValue).length <= 0">
                                                无参数
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                <Button type="text"
                                                        size="small"
                                                        @click="deleteEdgeFactor(item,index)"
                                                        icon="trash-a"></Button>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <h3 class="modal-title">豁免条件：</h3>
                    <div class="ivu-table-wrapper">
                        <div class="ivu-table ivu-table-small">
                            <div class="ivu-table-body">
                                <div v-show="edgeInfo.edgePreconditions.length == 0" class="no-data">暂无数据</div>
                                <table  cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                    <colgroup>
                                        <col width="95%">
                                        <col width="5%">
                                    </colgroup>
                                    <tbody class="ivu-table-tbody">
                                    <tr class="ivu-table-row"
                                        v-for="(item,index) in edgeInfo.edgePreconditions" :key="index">
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                {{item.rule}}
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                <Button size="small"
                                                        type="text"
                                                        @click="deletePrecondRow(item,index)"
                                                        icon="trash-a"></Button>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Button size="small"
                            type="text"
                            style="color: #2d8cf0;"
                            @click="addPreconditonRule"
                            icon="plus">新增豁免条件</Button>
                </Form>
            </div>

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
            <div slot="header"></div>
            <div>
                <Row :gutter="16" style="margin-bottom: 10px;">
                    <Col span="7">
                        <Card>
                            <div slot="title"><strong>实体</strong></div>
                            <div style="overflow: hidden;">
                                <div v-for="(item,index) in paramRule"  style="float: left;"
                                     @dragstart="dragStartEvent($event,item)"
                                     draggable="true">
                                    <Tag class="symbol-rule">{{item.paramName}}</Tag>
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
                                    <Tag class="symbol-rule">{{item.paramName}}</Tag>
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
                <Select
                        v-show="ruleType == 1"
                        size="small"
                        v-model="chooseResRuleModal"
                        @on-change="changeRuleModalRule"
                        placeholder="新增响应"
                        style="width: 140px;margin-bottom: 10px;"
                >
                    <Option v-for="(response,idx) in responseRuleNme"
                            :key="idx" :value="response.rule">
                        {{response.rule}}
                    </Option>
                </Select>
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
                <Button :loading="keepRuleLoading"
                        @click="keepRule"
                        type="primary">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

    export default {
        name: "show-scene",
        data(){
            return {
                linkId:1,
                nodeId:1,
                nodeObj:null, //点开的节点对象
                edgeObj:null, //点开边的节点对象
                //节点配置
                nodeConfigModal: false,
                pointParamsEntities: [
                    {
                        title: '实体名字',
                        key: 'paramName',
                        width:'15%',
                    },
                    {
                        title: '实体类型',
                        key: 'entityType',
                        width:'15%',
                    },
                    {
                        title: '实体值',
                        key: 'entityValue',
                        width:'15%',
                    },
                    {
                        title: 'promote',
                        key: 'promote',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        size: 'small',
                                        value:params.row.promote,
                                    },
                                    on: {
                                        'on-blur': (e) => {
                                            this.pointInfo.pointParamsEntities[params.index].promote = e.currentTarget.value;
                                        }
                                    }
                                }),
                            ]);
                        }
                    },
                    {
                        title: '默认值',
                        key: 'defaultValue'
                    }
                ],
                pointInfo: {
                    pointBasic: {
                        name: "",
                        description: "",
                        unknownLimitNum: ''
                    },
                    pointParamsEntities: [
                        {
                            paramName: "",
                            entityType: "",
                            entityValue: "",
                            promote: "",
                            defaultValue: ""
                        }
                    ],
                    pointParamsFactors: [
                        {
                            paramName: "",
                            factor: "",
                            keyValue: {
                                time:'',
                                local:''
                            },
                        }
                    ],
                    pointResponses: [{
                        rule: "",
                        type: "",
                        content: ""
                    }]
                },
                //边的基本信息
                edgeInfo: {
                    edgeBasic: {
                        name: "",
                        description: "",
                        unknownLimitNum: 0,
                        source: "",
                        direction: "",
                        priority: 1,
                        other: ""
                    },
                    edgePreconditions:[],
                    edgeUserSays: [],
                    edgeRules: [],
                    edgeParamsEntities: [],
                    edgeParamsFactors: []
                },
                edgeFactor:'',
                userSayText:'',
                responseRuleNme:[],
                chooseResRule:'',
                nodeModalTitle:[{
                    title:'节点信息',
                },{
                    title:'实体列表',
                },{
                    title:'因子列表',
                },{
                    title:'响应',
                }],
                userCollapse:'0',
                nodeModalTitleIndex:0,
                chooseFactor:'',

                allParamList:[], //总的实体列表
                allFactorList:[], //所有的因子列表
                factorListSelectIndex:0,//因子列表的索引值
                chooseRuleType:1,  //选择规则  1表示输入响应的规则配置
                //从改点指向出去的索引值
                linksOutOfIndex: 0,
                ruleModal: '', //判断是否是什么事件 linkRule, nodeRule响应输出的规则
                factorModal:'',//判断是不是节点的因子弹框 linkFactor nodeFactor

                //点击边的配置信息
                sceneValue:'',
                //节点配置
                sourceLinkInfo: [],
                //边的基本信息
                edgeConfigModal:false,//配置边的信息的节点
                ruleType:'',//1, 表示节点的响应规则， 2 表示边的进入规则 3 表示豁免条件规则
                userType:'', //edge, node 边的用户描述文本和节点的用户描述文本
                newUserSayDataTable: [],
                newUserSayFormValidate: {
                    userSay: [
                        {required: true, message: '用户描述文本不能为空', trigger: 'blur'}
                    ]
                },
                addNewFactorModal: false,//添加新的因子
                editRule: false,
                chooseResRuleModal:'',
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

                //保存响应内容的loading动画
                sureEditResponseLoading: false,
                //实体列表
                paramRule: [],
                //因子列表
                factorRule: [],
                //操作符类别
                symbolRule: [
                    {value: '(', key: '('},
                    {value: ')', key: ')'},
                    {value: '乘', key: '*'},
                    {value: '除', key: '/'},
                    {value: '加', key: '+'},
                    {value: '减', key: '-'},
                    {value: '等于', key: '=='},
                    {value: '不等于', key: '!='},
                    {value: '大于', key: '>'},
                    {value: '大于等于', key: '>='},
                    {value: '小于', key: '<'},
                    {value: '小于等于', key: '<='},
                    {value: '且', key: '&&'},
                    {value: '或', key: '||'}
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
                //enterUserSay用户说的话
                enterUserSay:'',
                copyIndex:0,
                offsetTop:0,
                offsetLeft:0,
                display:'none',
                paramlistIndex:0,
                selectText:'',
                keepProcess:false,
                processPercent:0,
                processStatus:'active',
                testResult:'',
            };

        },
        mounted(){
            let _this = this;
            //初始化Go.js
            const $ = go.GraphObject.make;
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
                        "linkingTool.isUnconnectedLinkValid": true, //拉出来的线条必须要求有节点

                        "linkingTool.portGravity": 20,
                        "relinkingTool.isUnconnectedLinkValid": false,
                        "clickCreatingTool.isDoubleClick": true,  //shifo是否能够双击
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom, //鼠标滚轮事件 放大缩小
                        "relinkingTool.portGravity": 20,
                        //选择一个目标对象的时候
                        "ChangedSelection": function(e) {
                            var node = e.diagram.selection.first();
                            if (node instanceof go.Node) {
                                if(node !== null){
                                    node.diagram.startTransaction("ChangeNodeText");
                                    node.findObject("TEXTBLOCK").text = 'node' + _this.nodeId++;
                                    node.diagram.commitTransaction("ChangeNodeText");
                                }
                            } else if(node instanceof go.Link) {
                                if(!node.data.to){
                                    node.diagram.commandHandler.deleteSelection();
                                }else{
                                    node.diagram.startTransaction("ChangeEdgeText");
                                    node.findObject("LINKNAME").text = 'edge' + _this.linkId++;
                                    node.diagram.commitTransaction("ChangeEdgeText");
                                }

                            }
                        },
                        "undoManager.isEnabled": true    // Ctr + z撤销， Ctr + Y 合并
                    });
            // 当改变内容 和 保存数据的时候
            _this.myDiagram.addDiagramListener("Modified", _this.modified);
            function makePort(name, spot, output, input) {
                var fill = null;
                return $(go.Shape, "Circle",
                    {
                        fill: fill,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
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
            var nodeResizeAdornmentTemplate =
                $(go.Adornment, "Spot",
                    { locationSpot: go.Spot.Right },
                    $(go.Placeholder),
                    $(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                    $(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                    $(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                    $(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                    $(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

                    $(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                    $(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
                    $(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
                );
            _this.myDiagram.nodeTemplate =
                $(go.Node, "Spot",
                    {doubleClick:_this.clickNode},
                    { locationSpot: go.Spot.Center },
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
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
                                margin:5,
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
                    makePort("L", go.Spot.Left, true, false),
                    makePort("R", go.Spot.Right, true, false),
                    makePort("B", go.Spot.Bottom, true, false),
                    {  // 鼠标移入移出
                        mouseEnter: function(e, node) { showSmallPorts(node, true); },
                        mouseLeave: function(e, node) { showSmallPorts(node, false); }
                    }
                );
            //鼠标移入节点的事件
            function showSmallPorts(node, show) {
                var diagram = node.diagram;
                if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
                node.ports.each(function(port) {
                    if (port.portId !== "") {  // don't change the default port, which is the big shape
                        port.fill = show ? (port.fromLinkable ? "rgba(0,0,0,.3)" : 'blue') : null;
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
                    {doubleClick:_this.clickSide},
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
                        $(go.TextBlock, "edge",  // the label text
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
                                figure: "RoundedRectangle",
                                fill: "#00AD5F",
                                name:'newNode',

                            },
                            {   text: "Global",
                                figure: "RoundedRectangle",
                                fill: "#fff",
                                name:'newNode',
                            },
                            {   text: "step",
                                figure: "RoundedRectangle",
                                fill: "lightyellow",
                                name:'newNode',
                            },
                            {   text: "End",
                                figure: "RoundedRectangle",
                                fill: "#CE0620",
                                name:'newNode',
                                category: "End",
                            },
                        ])
                    });

        },
        created(){
           this.getAllParams();
           this.getFactorList();
        },
        methods:{
            //获取全部的实体列表
            getAllParams(){
                this.$_ajax(this.$_api.queryAll,{

                }).then(res => {
                    if(res.success){
                        this.allParamList = res.data || [];
                    }
                })
            },
            //获取全部的因子列表
            getFactorList(){
                this.$_ajax(this.$_api.factorQueryAll,{

                }).then(res => {
                    if(res.success){
                        let allFactorList = res.data || [];
                        for(let i = 0; i < allFactorList.length; i++){
                            allFactorList[i].inputParams = JSON.parse(allFactorList[i].inputParams.replace(/\&quot;/ig,'"'));
                        }
                        this.allFactorList = JSON.parse(JSON.stringify(allFactorList));
                    }
                })
            },
            /*
                go.js需要的函数
             */
            sceneLoad(){
                this.$_ajax(this.$_api.querySceneById,{
                    id:this.$route.params.sceneId
                }).then(res => {
                    if(res.success){
                        let graph = JSON.parse(res.data.graph.replace(/\&quot;/ig,'"')) || {};
                        let sceneData = {};
                        if(Object.keys(graph).length > 0){
                            sceneData.class = graph.class;
                            sceneData.modelData = graph.modelData;
                            sceneData.linkDataArray = graph.edgeList;
                            sceneData.nodeDataArray = graph.pointList;
                        }
                        this.myDiagram.model = go.Model.fromJson(sceneData);
                        let pos = this.myDiagram.model.modelData.position;
                        if (pos) {
                            this.myDiagram.initialPosition = go.Point.parse(pos);
                        }
                    }
                });
            },
            //点击节点
            clickNode(e,obj){
                let _this = this;
                let node =  !!e ?  e.diagram.selection.first() : obj;
                _this.responseRuleNme = [];
                let pointResponses = [];
                obj.findLinksInto().each(function(l) {
                    _this.responseRuleNme.unshift({
                        rule:l.data.linkName
                    });
                    pointResponses.unshift({
                        rule: l.data.linkName,
                        type: "2",
                        content: ""
                    })
                });
                pointResponses.push({
                    rule: 'default',
                    type: "2",
                    content: ""
                });
                _this.responseRuleNme.push({
                    rule:'规则'
                })
                this.pointInfo = node.data.pointInfo || {
                    pointBasic: {
                        name: node.data.text,
                        description: "",
                        unknownLimitNum: ''
                    },
                    /*
                     {
                            paramName: "test1",
                            entityType: "entityType",
                            entityValue: "entityValue",
                            promote: "promote",
                            defaultValue: "defaultValue"
                        }
                    */
                    pointParamsEntities: [],

                    /*
                    * {
                            paramName: "实体1",
                            factor: "实体1",
                            keyValue: {
                                time:'',
                                local:''
                            },
                        }
                    * */
                    pointParamsFactors: [],
                    /*
                    * {
                        rule: "default",
                        type: "2",
                        content: "请输入目的地"
                    }
                    * */
                    pointResponses: pointResponses
                };

                let diagram = node.diagram;
                if(!diagram || diagram.isReadOnly || !diagram.allowLink ){

                }else {
                    //显示弹框
                    this.nodeConfigModal = true;
                }
                this.nodeObj = node; //保存点击的节点对象
            },
            clickParamSelect(item,index){},
            //点击边的时候
            clickSide(e,obj){
                let edge =  !!e ?  e.diagram.selection.first() : obj;
                this.edgeInfo = edge.data.edgeInfo || {
                    edgeBasic: {
                        name: edge.data.linkName,
                        description: "",
                        unknownLimitNum: '',
                        source: "",
                        direction: "",
                        priority: '',
                        other: ""
                    },
                    /**
                     * {
                        rule: "sourceNode=123123"
                    }*/
                    edgePreconditions: [],
                    /*
                    {
                        content: "是的，我在开车1。",
                        entities: "",
                        paramList:[{
                            paramName: "test1",
                            entityType: "2",
                            entityValue: "111",
                            defaultValue: "22"
                        }]
                    }
                    */
                    edgeUserSays: [],
                    /*
                    {
                        name: "",
                        rule: "$name=1123",
                        state: "0"
                    }
                    */
                    edgeRules: [],
                    /*
                    {
                        paramName: "实体1",
                        entityType: "",
                        entityValue: "",
                        defaultValue: ""
                    }
                    */
                    edgeParamsEntities: [],
                    /*
                    {
                        paramName: "实体1",
                        factor: "",
                        keyValue: ""
                    }
                    * */
                    edgeParamsFactors: []
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
                this.pointInfo.pointResponses.push({
                    rule:'新增规则',
                    type:'',
                    content:'',
                });
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

            changeResRule(value){
                if(value == '规则'){
                    this.ruleType = 1;
                    //对规则实体列表的初始化
                    this.paramRule = this.pointInfo.pointParamsEntities;
                    //对规则因子列表的初始化
                    this.factorRule = this.pointInfo.pointParamsFactors;
                    //对规则输入框的初始化
                    this.nodeOutputRule = [];
                    this.editRule = true;
                }else{
                    this.pointInfo.pointResponses.push({
                        rule:value,
                        type:'2',
                        content:'',
                    })
                }
            },
            changeRuleModalRule(value){
                this.nodeOutputRule.push({
                    value:value,
                    key:value
                })
            },
            //删除输出响应
            deleteResRow(item,index){
                this.pointInfo.pointResponses.splice(index,1);
            },
            deleteRuleRow(item,index){
                this.edgeInfo.edgeRules.splice(index,1);
            },
            deleteParamRow(item,index){
                this.edgeInfo.edgeParamsEntities.splice(index,1);
            },
            deleteEdgeFactor(item,index){
                this.edgeInfo.edgeParamsFactors.splice(index,1);
            },
            addNewParam(){
                this.edgeInfo.edgeParamsEntities.push({
                    paramName: "",
                    entityType: "",
                    entityValue: "",
                    defaultValue: ""
                })
            },
            //新增边的进入规则
            addNewRule(){
                this.ruleType = 2;
                //对规则实体列表的初始化
                this.paramRule = this.edgeInfo.edgeParamsEntities;
                //对规则因子列表的初始化
                this.factorRule = this.edgeInfo.edgeParamsFactors;
                //对规则输入框的初始化
                this.nodeOutputRule = [];
                this.editRule = true;
            },
            //新增豁免条件
            addPreconditonRule(){
                this.ruleType = 3;
                //对规则实体列表的初始化
                this.paramRule = this.edgeInfo.edgeParamsEntities;
                //对规则因子列表的初始化
                this.factorRule = this.edgeInfo.edgeParamsFactors;
                //对规则输入框的初始化
                this.nodeOutputRule = [];
                this.editRule = true;
            },
            //删除前置条件
            deletePrecondRow(item,index){
                this.edgeInfo.edgePreconditions.splice(index,1);
            },

            //向下交互顺序
            directionDown(item,index){
                if(index < this.pointInfo.pointResponses.length - 1){
                    let downData = this.pointInfo.pointResponses[index + 1];
                    let newNodeResponse = this.pointInfo.pointResponses.splice(0);
                    newNodeResponse[index] = downData;
                    newNodeResponse[index + 1] = item;
                    this.pointInfo.pointResponses = newNodeResponse.slice(0);
                }
            },
            //向上交换顺序
            directionUp(item,index){
                if(index > 0){
                    let upData = this.pointInfo.pointResponses[index - 1];
                    let newNodeResponse = this.pointInfo.pointResponses.splice(0);
                    newNodeResponse[index] = upData;
                    newNodeResponse[index - 1] = item;
                    this.pointInfo.pointResponses = newNodeResponse.slice(0);
                }
            },
            copyInputText(e,type){
                if( e.target.parentNode.className.indexOf('codeParam') >= 0){
                    let entityValue = window.getSelection().toString();
                    this.selectText = entityValue;
                    this.display = 'block';
                    this.userCollapse = (this.paramlistIndex + 1).toString();
                }
            },
            closeParamHtml(){
                this.display = 'none';
            },
            addParamList(item,index){

                this.edgeInfo.edgeUserSays[this.paramlistIndex].paramList.push({
                    paramName: item.paramName,
                    entityType: item.entityType,
                    entityValue: this.selectText,
                    defaultValue: item.paramName,
                    id:item.id
                });
                this.userCollapse = (this.paramlistIndex + 1).toString();
            },
            clickInputText(item,index,e){
                let windowWidth = window.innerWidth * 0.2 / 2;
                this.offsetTop = e.y -100;
                this.offsetLeft = e.x - windowWidth;
                this.paramlistIndex = index;
            },

            //节点配置只能输入 下划线和字母
            keydownName(e){
                //console.log(e.target.value);
                this.pointInfo.pointBasic.name = this.$_validate.inputNameCode(e);
            },
            //未知交互只能输入数字
            keydownUnKnownNum(e){
                this.pointInfo.pointBasic.unknownLimitNum = this.$_validate.inputNumber(e);
            },
            //节点配置只能输入 下划线和字母
            keydownEdgeName(e){
                //console.log(e.target.value);
                this.edgeInfo.edgeBasic.name = this.$_validate.inputNameCode(e);
            },
            //未知交互只能输入数字
            keydownEdgeUnKnownNum(e){
                this.edgeInfo.edgeBasic.priority = this.$_validate.inputNumber(e);
            },
            //输入常量
            addConstant(name){
                if(this.addConstantForm.name){
                    this.nodeOutputRule.push({
                        value:this.addConstantForm.name,
                        key:this.addConstantForm.name,
                        type:this.addConstantForm.type
                    });
                    this.addConstantForm.name = '';
                }
            },
            //enter用户描述文本
            enterUserSayText(){
                this.edgeInfo.edgeUserSays.push({
                    content: this.userSayText,
                    entities: "",
                    paramList:[]
                });
                this.userSayText = '';
            },
            deleteUserSayParam(item,index){
                this.edgeInfo.edgeUserSays[this.paramlistIndex].paramList.splice(index,1);
            },
            deleteUserSay(item,index){
                this.edgeInfo.edgeUserSays.splice(index,1);
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
                this.nodeOutputRule.push({
                    value:this.dragItem.paramName || this.dragItem.value,
                    key:this.dragItem.paramName || this.dragItem.key,
                    type:'字符串',
                });
            },
            //删除规则
            deleteRule(index){
                this.nodeOutputRule.splice(index, 1);
            },
            //保存规则
            keepRule(){

                let _this = this;
                let outArray = [];
                for(let i = 0 ; i < this.nodeOutputRule.length; i++){
                    outArray.push(this.nodeOutputRule[i].key);
                }
                if(this.ruleType == 1){ //输出响应的规则
                    this.pointInfo.pointResponses.push({
                        rule: outArray.join(''),
                        type: "2",
                        content: ""
                    });
                }else if(this.ruleType == 2){
                    this.edgeInfo.edgeRules.push({
                        rule:outArray.join('')
                    });
                }else if(this.ruleType == 3){
                    this.edgeInfo.edgePreconditions.push({
                        rule:outArray.join('')
                    });
                }
                _this.editRule = false;
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
                if(!this.pointInfo.pointBasic.name){
                    this.$Message.error({
                        content: '请填写节点的名字',
                        duration: 2
                    });
                    return false;
                }
                if(!this.pointInfo.pointBasic.unknownLimitNum){
                    this.$Message.error({
                        content: '请填写节点的优先级',
                        duration: 2
                    });
                    return false;
                }
                this.myDiagram.model.modelData.position = go.Point.stringify(this.myDiagram.position);
                let scenceData = JSON.parse(this.myDiagram.model.toJson());
                for(let i = 0; i < scenceData.nodeDataArray.length; i++){
                    if(this.nodeObj.data.key != scenceData.nodeDataArray[i].key ){
                        if(!!scenceData.nodeDataArray[i].pointInfo){
                            if(scenceData.nodeDataArray[i].pointInfo.pointBasic.name == this.pointInfo.pointBasic.name) {
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
                    this.myDiagram.model.setDataProperty(node, "pointInfo", this.pointInfo);
                    this.myDiagram.model.setDataProperty(node, "text", this.pointInfo.pointBasic.name);
                }
                this.nodeConfigModal = false;
            },
            //编辑边的弹框
            closeEdgeConfigModal(){
                this.edgeConfigModal = false;
            },
            //保存边的数据
            edgeKeepData(){
                let _this = this;
                if(!this.edgeInfo.edgeBasic.name){
                    this.$Message.error({
                        content: '请填写边的名字',
                        duration: 2
                    });
                    return false;
                }
                if(!this.edgeInfo.edgeBasic.priority){
                    this.$Message.error({
                        content: '请填写边的优先级',
                        duration: 2
                    });
                    return false;
                }
                this.myDiagram.model.modelData.position = go.Point.stringify(this.myDiagram.position);
                let scenceData = JSON.parse(this.myDiagram.model.toJson());
                for(let i = 0; i < scenceData.linkDataArray.length; i++){
                    if((this.edgeObj.data.from == scenceData.linkDataArray[i].from) && (this.edgeObj.data.to == scenceData.linkDataArray[i].to)){
                    }else{
                        if(!!scenceData.linkDataArray[i].edgeInfo){
                            if(scenceData.linkDataArray[i].edgeInfo.edgeBasic.name == this.edgeInfo.edgeBasic.name) {
                                this.$Message.error({
                                    content: '边的名字不能重复',
                                    duration: 2
                                });
                                return false;
                            }
                        }
                    }
                }
                this.edgeObj.data.edgeInfo = this.edgeInfo;
                this.edgeObj.diagram.startTransaction("ChangeNodeText");
                this.edgeObj.findObject("LINKNAME").text = this.edgeInfo.edgeBasic.name;
                this.edgeObj.diagram.commitTransaction("ChangeNodeText");
                this.edgeConfigModal = false;
            },

            //addParams() 新增实体
            addParams(){
                this.pointInfo.pointParamsEntities.push({
                    paramName: "",
                    entityType: "",
                    entityValue: "",
                    promote: "",
                    defaultValue: ""
                });
            },
            //删除实体
            deleteNodeParam(item,index){
                this.pointInfo.pointParamsEntities.splice(index,1);
            },
            //添加因子
            addFactorButton(){
                this.pointInfo.pointParamsFactors.push({
                    paramName: "",
                    factor: "",
                    entityValue: "",
                });
            },
            //点击选择
            nodeChangeFactor(value){
                let keyValue = {};
                for(let i = 0; i < this.allFactorList.length; i++){
                    if(this.allFactorList[i].factorName == value){
                        for(let k = 0; k < this.allFactorList[i].inputParams.length; k++){
                            keyValue[this.allFactorList[i].inputParams[k].paramCode] = this.allFactorList[i].inputParams[k].paramValue;
                        }
                        this.pointInfo.pointParamsFactors.push({
                            paramName:'',
                            factor:value,
                            keyValue:keyValue,
                            id:this.allFactorList[i].id
                        });
                    }
                }
                this.chooseFactor = '';
            },
            edgeChangeFactor(value){
                let keyValue = {};
                for(let i = 0; i < this.allFactorList.length; i++){
                    if(this.allFactorList[i].factorName == value){
                        for(let k = 0; k < this.allFactorList[i].inputParams.length; k++){
                            keyValue[this.allFactorList[i].inputParams[k].paramCode] = this.allFactorList[i].inputParams[k].paramValue;
                        }
                        this.edgeInfo.edgeParamsFactors.push({
                            paramName:'',
                            factor:value,
                            keyValue:keyValue,
                            id:this.allFactorList[i].id
                        });
                    }
                }
                this.edgeFactor = '';
            },
            //删除因子
            deleteFactorParam(item,index){
                this.pointInfo.pointParamsFactors.splice(index,1);
            },

            testScene(){
                this.$_ajax(this.$_api.sendMessage,{
                    sceneId:this.$route.params.sceneId,
                    content:this.sceneValue,
                },'POST',true).then(res => {
                   if(res.success){
                       this.testResult = res.data.result;
                   }
                });
                this.enterUserSay = this.sceneValue;
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
                this.myDiagram.model.modelData.position = go.Point.stringify(this.myDiagram.position);
                let keepData = this.changeKeepData(JSON.parse(this.myDiagram.model.toJson()));
                if(!keepData){

                }else{
                    this.$_ajax(this.$_api.graphSave,keepData,'POST',true).then( res => {
                        if(res.success){
                            this.sceneLoad();
                        }
                    });
                    this.keepProcess = true;
                    this.keepAnimateProcess();
                    this.myDiagram.isModified = false;
                }
            },
            keepAnimateProcess(){
                let _this = this;_this.processPercent = 0;
                let setTag = setInterval(function(){
                    _this.processPercent++;
                    if(_this.processPercent == 100){
                        _this.processStatus = 'success';
                        _this.keepProcess = false;
                        clearInterval(setTag);
                    }
                },30)
            },
            changeKeepData(data){
                let keepData = {};
                for(let i = 0; i < data.linkDataArray.length; i++){
                    if(!data.linkDataArray[i].edgeInfo){
                        this.$Message.error({
                            content: '边' + data.linkDataArray[i].linkName + '没有配置信息',
                            duration: 2
                        });
                        return false;
                    }
                }
                for(let i = 0; i < data.nodeDataArray.length; i++){
                    if(!data.nodeDataArray[i].pointInfo){
                        this.$Message.error({
                            content: '节点 ' +  data.nodeDataArray[i].text + '没有配置信息',
                            duration: 2
                        });
                        return false;
                    }
                }
                keepData.sceneId = this.$route.params.sceneId;
                keepData.edgeList = data.linkDataArray;
                keepData.pointList = data.nodeDataArray;
                keepData.class = data.class;
                keepData.modelData = data.modelData;
               return keepData;
            }
        }

    }
</script>

<style lang="scss">
    .tool{
        position: relative;
        padding: 5px 30px 0 360px;
        height: 44px;
        background: #ffffff;
        margin-bottom: 10px;
        .tool-button{
            position: absolute;
            top: 5px;
            left: 30px;
        }
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
            padding: 5px;
            height: 740px;
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
    .ivu-tabs{
        overflow: initial !important;
    }
    .no-data{
        text-align: center;
        line-height: 40px;
    }
    .scene-test{
        line-height: 40px;
    }
    .ivu-modal-header{
        padding: 0 !important;
        border: 0 !important;
    }
    .modal-title{
        padding: 16px 0;
    }
    .user-say{
        margin-top: 10px;
        .ivu-collapse-item{
            background: #ffffff;
        }
        .ivu-collapse-header{
            padding-left: 10px !important;
            input{
                border: none;
            }
            input:focus{
                box-shadow: none;
                border: none;
            }
        }
        .ivu-icon-arrow-right-b{
            display: none !important;
        }
        .ivu-collapse-content{
            overflow: initial !important;
        }
    }

</style>