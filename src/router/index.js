import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Alert from '@/components/alert/alert'
import eboard from '@/components/eborad'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/eboard',
      name: eboard,
      component: eboard
    },
    {
      path: '/alert',
      component: Alert
    }
  ]
})
