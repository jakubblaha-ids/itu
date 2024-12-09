import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import ListsView from '../views/ListsView.vue'
import ListView from '../views/ListView.vue'
import AddItemView from '../views/AddItemView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lists',
      component: ListsView
    },
    {
      path: '/list/:id',
      name: 'list',
      component: ListView,
      props: true
    },
    {
      path: '/additem/:id',
      name: 'additem',
      component: AddItemView,
      props: true
    }
  ]
})

export default router
