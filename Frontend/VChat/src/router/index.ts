import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ViewChat from '../views/ViewChat.vue'
import ResetPassword from '../views/ResetPassword.vue'
import CheckValidToken from '../api/CheckValidToken.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/VChat',name:'VChat',component: ViewChat}
    { path: '/ResetPassword',name:'ResetPassword',component: ResetPassword}
  ],
})
router.beforeEach(async(to, from, next) => {
  const token = localStorage.getItem('token');
  if(token)
  {
    const isValid=await CheckValidToken();
    if(!isValid)
    {
      localStorage.removeItem('token');
        return next('/login');
    }
    
  }

  if ((to.path === '/' || to.path === '/register') && token) {
    return next('/VChat');
  }

  if (to.path === '/VChat' && !token) {
    return next('/login');
  }

  next();
});

export default router
