import { RouteDefinition } from '@open-cells/core/types';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    name: 'home',
    component: 'home-page',
    action: async () => {
      await import('../pages/home/home-page.js');
    },
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: 'tasks-page',

    action: async () => {
      await import('../pages/tasks/tasks-page.js');
    },
  },
  {
    path: '/second',
    name: 'second',
    component: 'second-page',
    action: async () => {
      await import('../pages/second/second-page.js');
    },
  },
  {
    path: '/meals',
    name: 'meals',
    component: 'meals-page',
    action: async () => {
      await import('../pages/meals/meals-page.js');
    },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: 'notifications-page',

    action: async () => {
      await import('../pages/notifications/notifications-page.js');
    },
  },
];
