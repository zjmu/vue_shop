import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import BlackList from '../components/blackList/blackList.vue'
import Label from '../components/label/Label'
import Reason from '../components/reason/reason'
import Article from '../components/article/article'
import ReviewArticle from '../components/reviewArticle/reviewArticle'
import ReviewComment from '../components/reviewComment/reviewComment'
import Room from '../components/room/Room'



Vue.use(VueRouter)


const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{path: '/welcome', component: Welcome},
               {path: '/userList', component:Users},
               {path: '/blackList', component:BlackList},
               {path: '/label', component:Label},
               {path: '/reason', component:Reason},
               {path: '/article', component:Article},
               {path: '/reviewArticle', component:ReviewArticle},
               {path: '/reviewComment', component:ReviewComment},
               {path: '/room', component:Room}
               ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
