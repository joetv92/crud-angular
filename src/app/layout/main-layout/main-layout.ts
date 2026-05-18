import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar color="primary">Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/home" routerLinkActive="active-link">
            <mat-icon>home</mat-icon> Accueil
          </a>
          <a mat-list-item routerLink="/users" routerLinkActive="active-link">
            <mat-icon>people</mat-icon> Utilisateurs
          </a>
          <a mat-list-item routerLink="/posts" routerLinkActive="active-link">
            <mat-icon>article</mat-icon> Articles
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button type="button" aria-label="Toggle sidenav" mat-icon-button (click)="drawer.toggle()" *ngIf="isHandset$ | async">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Tableau de bord</span>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav { width: 240px; }
    .content { padding: 24px; }
    .active-link { background: rgba(0,0,0,0.1); }
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