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
  styles: [`.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }`]
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