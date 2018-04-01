<template>
  <div class="login">
    <h1>用户登录</h1>
    <div class="login-form">
      <form>
        <label for="username">用户名：</label>
        <input type="text" placeholder="请输入用户名" v-model="userName">
        <label for="password">密码</label>
        <input type="password" placeholder="请输入密码" v-model="password">
        <button type="btn" @click="Login()">登录</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: '',
      password: ''
    }
  },
  methods: {
     Login() {
       console.log(this.userName)
      //  提交用户名和密码
     }
  }
}
</script>

<style scoped>
  .login{
     display: flex;
     min-height: 100vh;
     justify-content: center;
     align-content: center;
     flex-wrap: wrap;
     text-align: center;
     background-color: cadetblue;
  }
  .login>h1,.login>div{
    flex-basis: 100%;
  }
  .login>h1{
    font-size: 32px;
    color: chocolate;
  }
</style>
