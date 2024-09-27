import { Routes } from '@angular/router';
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    children: [
      {
        path: '',
        loadComponent: ()=> import('./shared/main/main.component')
      },
      {
        path: 'log-in',
        loadComponent: ()=> import('./pages/auth/log-in/log-in.component')
      },
      {
        path: 'sign-up',
        loadComponent: ()=> import('./pages/auth/siqn-up/siqn-up.component')
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: ()=> import('./pages/dashboard/dashboard.component')
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    pathMatch: 'full'
  }

];
