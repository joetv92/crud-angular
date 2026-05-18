import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    AsyncPipe,
    NgIf
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">

        <!-- Logo / En-tête sidebar -->
        <div class="sidebar-header">
          <div class="logo-icon">
            <mat-icon>dashboard</mat-icon>
          </div>
          <div class="logo-text">
            <h2>DashBoard Pro</h2>
            <small>Management System</small>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Navigation -->
        <mat-nav-list class="nav-list">
          <a mat-list-item routerLink="/home" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
            <div class="nav-item-content">
              <div class="nav-icon home-icon">
                <mat-icon>home</mat-icon>
              </div>
              <span>Accueil</span>
            </div>
          </a>

          <a mat-list-item routerLink="/users" routerLinkActive="active-link">
            <div class="nav-item-content">
              <div class="nav-icon users-icon">
                <mat-icon>people</mat-icon>
              </div>
              <span>Utilisateurs</span>
            </div>
          </a>

          <a mat-list-item routerLink="/posts" routerLinkActive="active-link">
            <div class="nav-item-content">
              <div class="nav-icon posts-icon">
                <mat-icon>article</mat-icon>
              </div>
              <span>Articles</span>
            </div>
          </a>
        </mat-nav-list>

        <!-- Footer sidebar -->
        <div class="sidebar-footer">
          <small>© 2026 Dashboard Pro</small>
        </div>
      </mat-sidenav>

      <!-- Contenu principal -->
      <mat-sidenav-content>
        <!-- Toolbar -->
        <mat-toolbar class="main-toolbar" color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon>menu</mat-icon>
          </button>

          <div class="toolbar-content">
            <div class="toolbar-left">
              <mat-icon>dashboard</mat-icon>
              <span>Tableau de Bord</span>
            </div>
            <div class="toolbar-right"> 
              <div class="user-avatar">
                <mat-icon>account_circle</mat-icon>
              </div>
            </div>
          </div>
        </mat-toolbar>

        <!-- Contenu de la page -->
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background: #f1f5f9;
    }

    .sidenav {
      width: 280px;
      background: white;
      color: #1e293b;
      border-right: 1px solid #e2e8f0;
    }

    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-icon {
      background: var(--gradient-1);
      border-radius: 12px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .logo-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .logo-text h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: #1e293b;
    }

    .logo-text small {
      opacity: 0.6;
      font-size: 0.8rem;
      color: #64748b;
    }

    .nav-list {
      padding: 1rem 0.75rem;
    }

    .nav-list a {
      margin-bottom: 0.5rem;
      border-radius: 12px;
      height: auto !important;
      padding: 0.75rem 1rem;
      color: #64748b !important;
      transition: all 0.3s ease;
    }

    .nav-list a:hover {
      background: #f1f5f9 !important;
      color: #1e293b !important;
    }

    .nav-item-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .nav-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .home-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .users-icon { background: rgba(236, 72, 153, 0.1); color: #ec4899; }
    .posts-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .active-link {
      background: #f1f5f9 !important;
      color: #4f46e5 !important;
      border-left: 3px solid #4f46e5;
      font-weight: 600;
    }

    .active-link .home-icon { background: #3b82f6; color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
    .active-link .users-icon { background: #ec4899; color: white; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4); }
    .active-link .posts-icon { background: #10b981; color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); }

    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      text-align: center;
      color: #94a3b8;
      font-size: 0.8rem;
      border-top: 1px solid #e2e8f0;
    }

    .main-toolbar {
      background: white !important;
      color: #1e293b !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
      height: 70px;
    }

    .toolbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .toolbar-left mat-icon {
      color: #4f46e5;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--gradient-1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 0.5rem;
      transition: transform 0.3s;
    }

    .user-avatar:hover {
      transform: scale(1.1);
    }

    .user-avatar mat-icon {
      color: white;
    }

    .content {
      padding: 2rem;
      min-height: calc(100vh - 70px);
    }

    @media (max-width: 768px) {
      .content {
        padding: 1rem;
      }
    }
  `]
})
export class MainLayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}