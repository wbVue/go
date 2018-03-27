<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-bg">
            <div class="login-con">
                <Card :bordered="false">
                    <p slot="title">
                        <Icon type="log-in"></Icon>
                        欢迎登录
                    </p>
                    <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules">
                            <FormItem prop="userName">
                                <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button @click="handleSubmit" type="primary" long>登录</Button>
                            </FormItem>
                        </Form>
                        <p class="login-tip">输入用户名(test)和密码(test)</p>
                    </div>
                </Card>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    if(this.form.userName == 'test' && this.form.password == 'test'){
                        let data = {
                            userInfo:{userName:this.form.userName}
                        };
                        sessionStorage.setItem('userInfo',JSON.stringify(data));
                        this.$router.push({ path: '/sceneList' });
                    }
                }
            });
        }
    }
};
</script>

<style>

</style>
