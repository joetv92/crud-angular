import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { PostService } from '../../core/services/post.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="animate-fade-in-up">
      <!-- En-tête -->
      <div class="welcome-banner">
        <div class="banner-content">
          <h1>👋 Tableau de Bord</h1>
          <p>Gérez vos utilisateurs et publications en toute simplicité</p>
        </div>
        <div class="banner-stats">
          <div class="stat-card gradient-1">
            <mat-icon>people</mat-icon>
            <div>
              <span class="stat-number">{{ userCount() }}</span>
              <span class="stat-label">Utilisateurs</span>
            </div>
          </div>
          <div class="stat-card gradient-2">
            <mat-icon>article</mat-icon>
            <div>
              <span class="stat-number">{{ postCount() }}</span>
              <span class="stat-label">Articles</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="quick-actions">
        <h2>⚡ Actions rapides</h2>
        <div class="actions-grid">
          <button mat-raised-button class="action-card gradient-1" routerLink="/users/add">
            <mat-icon>person_add</mat-icon>
            <span>Nouvel utilisateur</span>
          </button>
          <button mat-raised-button class="action-card gradient-2" routerLink="/posts/add">
            <mat-icon>post_add</mat-icon>
            <span>Nouvel article</span>
          </button>
          <button mat-raised-button class="action-card gradient-3" routerLink="/users">
            <mat-icon>manage_accounts</mat-icon>
            <span>Gérer utilisateurs</span>
          </button>
          <button mat-raised-button class="action-card gradient-4" routerLink="/posts">
            <mat-icon>edit_note</mat-icon>
            <span>Gérer articles</span>
          </button>
        </div>
      </div> 
    </div>
  `,
  styles: [`
    .welcome-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      color: white;
      box-shadow: var(--shadow-xl);
    }

    .banner-content h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .banner-content p {
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .banner-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .stat-card mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .stat-card div {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
    }

    .stat-label {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    .quick-actions {
      margin-bottom: 2rem;
    }

    .quick-actions h2 {
      margin-bottom: 1rem;
      font-size: 1.5rem;
      color: var(--dark);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-card {
      padding: 2rem 1rem !important;
      border-radius: 12px !important;
      color: white !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 0.5rem !important;
      transition: transform 0.3s, box-shadow 0.3s !important;
      box-shadow: var(--shadow-lg) !important;
      height: auto !important;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-xl) !important;
    }

    .action-card mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .gradient-1 { background: var(--gradient-1) !important; }
    .gradient-2 { background: var(--gradient-2) !important; }
    .gradient-3 { background: var(--gradient-3) !important; }
    .gradient-4 { background: var(--gradient-4) !important; }

    .tips-card {
      border-radius: 16px;
      box-shadow: var(--shadow);
    }

    .tips-card mat-card-content ul {
      padding-left: 1.5rem;
      color: var(--dark);
    }

    .tips-card mat-card-content li {
      margin: 0.5rem 0;
    }
  `]
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private postService = inject(PostService);

  // Utilisation de Signals pour la réactivité
  userCount = signal(0);
  postCount = signal(0);

  ngOnInit(): void {
    this.loadCounts();
  }

  private loadCounts(): void {
    forkJoin({
      users: this.userService.getAll(),
      posts: this.postService.getAll()
    }).subscribe({
      next: ({ users, posts }) => {
        this.userCount.set(users.length);
        this.postCount.set(posts.length);
        console.log('✅ Users:', users.length, 'Posts:', posts.length); // Debug
      },
      error: (err) => {
        console.error('❌ Erreur chargement compteurs:', err);
        // Fallback si erreur
        this.userCount.set(0);
        this.postCount.set(0);
      }
    });
  }
}