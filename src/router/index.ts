import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudyView from '../views/StudyView.vue'
import ReleaseNotesView from '../views/ReleaseNotesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/study',
      name: 'study',
      component: StudyView
    },
    {
      path: '/release-notes',
      name: 'release-notes',
      component: ReleaseNotesView
    }
  ]
})

export default router
