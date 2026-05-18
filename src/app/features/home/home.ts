import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Bienvenue sur le tableau de bord</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Gérez vos utilisateurs et leurs publications.</p>
      </mat-card-content>
    </mat-card>
  `
})
export class HomeComponent { }