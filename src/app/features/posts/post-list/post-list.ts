import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, SlicePipe } from '@angular/common';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    RouterLink,
    DatePipe,
    SlicePipe   // ← pipe slice pour tronquer le contenu
  ],
  template: `
    <div class="header">
      <h2>Articles</h2>
      <button mat-raised-button color="primary" routerLink="add">
        <mat-icon>add</mat-icon> Nouvel article
      </button>
    </div>

    <mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2">

      <ng-container matColumnDef="id">
        <mat-header-cell *matHeaderCellDef mat-sort-header>ID</mat-header-cell>
        <mat-cell *matCellDef="let post">{{ post.id }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="title">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Titre</mat-header-cell>
        <mat-cell *matCellDef="let post">{{ post.title }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="content">
        <mat-header-cell *matHeaderCellDef>Contenu</mat-header-cell>
        <mat-cell *matCellDef="let post">
          {{ post.content | slice:0:80 }}{{ post.content.length > 80 ? '...' : '' }}
        </mat-cell>
      </ng-container>

      <!-- Nouvelle colonne : Auteur (utilisateur) -->
      <ng-container matColumnDef="user">
        <mat-header-cell *matHeaderCellDef>Auteur</mat-header-cell>
        <mat-cell *matCellDef="let post">
          {{ post.user?.username || '—' }}
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="createdAt">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Créé le</mat-header-cell>
        <mat-cell *matCellDef="let post">{{ post.createdAt | date:'short' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="actions">
        <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
        <mat-cell *matCellDef="let post">
          <button mat-icon-button color="primary" [routerLink]="['edit', post.id]">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deletePost(post)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    </mat-table>

    <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  `]
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'title', 'content', 'user', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Post>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAll().subscribe(posts => {
      this.dataSource.data = posts;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deletePost(post: Post): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Supprimer l'article",
        message: `Voulez-vous vraiment supprimer "${post.title}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postService.delete(post.id!).subscribe(() => {
          this.snackBar.open('Article supprimé', 'Fermer', { duration: 3000 });
          this.loadPosts();
        });
      }
    });
  }
}