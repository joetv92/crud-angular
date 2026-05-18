import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    RouterLink,
    DatePipe
  ],
  template: `
    <div class="header">
      <h2>Utilisateurs</h2>
      <button mat-raised-button color="primary" routerLink="add">
        <mat-icon>add</mat-icon> Ajouter
      </button>
    </div>

    <mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2">
      <ng-container matColumnDef="id">
        <mat-header-cell *matHeaderCellDef mat-sort-header>ID</mat-header-cell>
        <mat-cell *matCellDef="let user">{{ user.id }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="username">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Nom d'utilisateur</mat-header-cell>
        <mat-cell *matCellDef="let user">{{ user.username }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="email">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Email</mat-header-cell>
        <mat-cell *matCellDef="let user">{{ user.email }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="createdAt">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Créé le</mat-header-cell>
        <mat-cell *matCellDef="let user">{{ user.createdAt | date:'short' }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="actions">
        <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
        <mat-cell *matCellDef="let user">
          <button mat-icon-button color="primary" [routerLink]="['edit', user.id]">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteUser(user)">
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
  :host {
    animation: fadeInUp 0.5s ease-out;
    display: block;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .header h2 {
    font-size: 1.8rem;
    font-weight: 700;
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header button {
    border-radius: 12px;
    padding: 0.5rem 1.5rem;
    font-weight: 600;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .header button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .mat-mdc-table {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .mat-mdc-header-cell {
    background: #f8fafc;
    font-weight: 700;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--dark);
    padding: 1rem;
  }

  .mat-mdc-cell {
    padding: 1rem;
  }

  .mat-mdc-row {
    transition: background 0.3s, transform 0.3s;
  }

  .mat-mdc-row:hover {
    background: #f1f5f9;
    transform: scale(1.01);
  }

  .mat-mdc-paginator {
    border-radius: 0 0 16px 16px;
  }
`]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'username', 'email', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe(users => {
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Supprimer utilisateur', message: `Voulez-vous supprimer ${user.username} ?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete(user.id!).subscribe(() => {
          this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
          this.loadUsers();
        });
      }
    });
  }
}