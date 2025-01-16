import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../store/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('../views/GenerateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/study',
      name: 'study',
      component: () => import('../views/StudyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/saved-studies',
      name: 'saved-studies',
      component: () => import('../views/SavedStudiesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/saved-study/:id',
      name: 'saved-study',
      component: () => import('../views/SavedStudyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/release-notes',
      name: 'release-notes',
      component: () => import('../views/ReleaseNotesView.vue')
    }
  ]
})

// Navigation guard to protect authenticated routes
router.beforeEach((to) => {
  const authStore = useAuthStore()
  const publicPages = ['/', '/release-notes']

  if (!publicPages.includes(to.path) && !authStore.isAuthenticated()) {
    return '/'
  }
})

export default router
