<template>
    <div class="edit-param">
        <div class="header">编辑实体</div>
        <div class="edit-param-form">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="实体名称" prop="entityName">
                    <Input v-model="formValidate.entityName" placeholder="请输入实体名字"></Input>
                </FormItem>
                <FormItem label="实体词表">
                    <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-large ivu-table-border">
                        <div class="ivu-table-header">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <colgroup>
                                    <col width="45%">
                                    <col width="45%">
                                    <col width="10%">
                                </colgroup>
                                <thead>
                                <tr>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>词</span>
                                        </div>
                                    </th>
                                    <th class="">
                                        <div class="ivu-table-cell">
                                            <span>同义词</span>
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
                            <div v-show="formValidate.entries.length == 0" class="no-data">暂无数据</div>
                            <table v-show="formValidate.entries.length > 0" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <colgroup>
                                    <col width="45%">
                                    <col width="45%">
                                    <col width="10%">
                                </colgroup>
                                <tbody class="ivu-table-tbody">
                                <tr v-for="(item,index) in formValidate.entries"
                                    class="ivu-table-row" :key="index">
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <Input v-model="item.value"
                                                   placeholder="请输入实体名字"></Input>
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell" @click="getIndex(index)">
                                            <Select
                                                    v-model="item.synonyms"
                                                    multiple
                                                    filterable
                                                    remote
                                                    :remote-method="changeQuery"
                                            >
                                                <Option v-for="(option, idx) in item.options"
                                                        :value="option"
                                                        :key="idx">{{option}}</Option>
                                            </Select>
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <Button type="text"
                                                    @click="deleteEntry(item,index)"
                                                    icon="trash-a"></Button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                    <Button icon="plus" @click="addNewRow" type="text">新增一行</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">返回</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "edit-param",
        data () {
            return {
                formValidate: {
                    entityName: '',
                    entries: [],
                    optionIndex:0,
                },
                ruleValidate: {
                    entityName: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
                },
            }
        },
        created(){
            if(this.$route.params.id > 0){
                this.getEditParamList();
            }
        },
        methods: {
            //初始化编辑实体页面
            getEditParamList(){
                this.$_ajax(this.$_api.queryEntityById,{
                    id:this.$route.params.id
                }).then(res => {
                    if(res.success){
                        let entries = [];
                        if(res.data.entries.length > 0){
                            res.data.entries = !!res.data.entries ? JSON.parse(res.data.entries.replace(/\&quot;/ig,'"')) :[];
                            for(let i = 0; i < res.data.entries.length; i++){
                                entries.push({
                                    value:res.data.entries[i].value,
                                    synonyms:res.data.entries[i].synonyms,
                                    options:res.data.entries[i].synonyms,
                                })
                            }
                        }
                        this.formValidate = res.data;
                        this.formValidate.entries = entries.slice(0);
                    }
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        for(let i = 0; i < this.formValidate.entries.length; i++){
                            if(!this.formValidate.entries[i].value){
                                this.$Message.error('请填写实体词表');
                                return false;
                            }
                        }
                        this.keepParam();
                    } else {
                        this.$Message.error('请填写实体名字');
                    }
                })
            },
            keepParam(){
                this.$_ajax(this.$_api.saveEntity,{
                    id:this.$route.params.id == 0 ? null : this.$route.params.id,
                    entityName:this.formValidate.entityName,
                    entries:JSON.stringify(this.formValidate.entries)
                },'POST','application/json;charset=utf-8').then(res => {
                    if(res.success){
                        this.$router.push(`/paramList`);
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            },
            handleReset (name) {
                this.$router.push(`/paramList`);
            },
            getIndex(index){
                this.optionIndex = index;
            },
            changeQuery (query) {
                if (query !== '') {
                    this.formValidate.entries[this.optionIndex].options.unshift(query)
                }
            },
            //删除同义词列表
            deleteEntry(item,index){
                this.formValidate.entries.splice(index,1);
            },
            addNewRow(){
                this.formValidate.entries.push({
                    value:'',
                    synonyms:[],
                    options:[],
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .edit-param{
        width: 100%;
        height: 100%;
        background: #ffffff;
        .header{
            height: 40px;
            line-height: 40px;
            padding-left: 28px;
            border-bottom: 1px solid #eee;
        }
        .param-table{
            width: 100%;
            border: 1px solid #eeeeee;
        }
        .edit-param-form{
            padding: 20px;
            .ivu-input-group{
                top: 0;
            }
        }
        .no-data{
            text-align: center;
            line-height: 40px;
        }
    }
</style>