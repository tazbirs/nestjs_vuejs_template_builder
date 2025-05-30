import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('../views/templates/TemplateList.vue')
  },
  {
    path: '/templates/new',
    name: 'NewTemplate',
    component: () => import('../views/templates/TemplateForm.vue')
  },
  {
    path: '/templates/:id',
    name: 'EditTemplate',
    component: () => import('../views/templates/TemplateForm.vue'),
    props: true
  },
  {
    path: '/templates/:id/preview',
    name: 'PreviewTemplate',
    component: () => import('../views/templates/TemplatePreview.vue'),
    props: true
  },
  {
    path: '/forms',
    name: 'Forms',
    component: () => import('../views/forms/FormList.vue')
  },
  {
    path: '/forms/new',
    name: 'NewForm',
    component: () => import('../views/forms/FormBuilder.vue')
  },
  {
    path: '/forms/:id',
    name: 'EditForm',
    component: () => import('../views/forms/FormBuilder.vue'),
    props: true
  },
  {
    path: '/forms/:id/view',
    name: 'ViewForm',
    component: () => import('../views/forms/FormView.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
