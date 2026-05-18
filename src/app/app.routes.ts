import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },
            { path: 'users', loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserListComponent) },
            { path: 'users/add', loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserFormComponent) },
            { path: 'users/edit/:id', loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserFormComponent) },
            { path: 'posts', loadComponent: () => import('./features/posts/post-list/post-list').then(m => m.PostListComponent) },
            { path: 'posts/add', loadComponent: () => import('./features/posts/post-form/post-form').then(m => m.PostFormComponent) },
            { path: 'posts/edit/:id', loadComponent: () => import('./features/posts/post-form/post-form').then(m => m.PostFormComponent) },
        ]
    }
];