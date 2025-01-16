import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudyView from '../views/StudyView.vue'
import ReleaseNotesView from '../views/ReleaseNotesView.vue'
import GenerateView from '../views/GenerateView.vue'
import { useAuthStore } from '../store/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/generate',
      name: 'generate',
      component: GenerateView,
      meta: { requiresAuth: true }
    },
    {
      path: '/study',
      name: 'study',
      component: StudyView,
      meta: { requiresAuth: true }
    },
    {
      path: '/release-notes',
      name: 'release-notes',
      component: ReleaseNotesView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/')
  } else {
    next()
  }
})

export default router
