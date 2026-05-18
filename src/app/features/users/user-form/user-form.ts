import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    NgIf
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEdit ? 'Modifier' : 'Ajouter' }} un utilisateur</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nom d'utilisateur</mat-label>
            <input matInput formControlName="username" />
            <mat-error *ngIf="form.get('username')?.hasError('required')">Requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" />
            <mat-error *ngIf="form.get('email')?.hasError('required')">Requis</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Email invalide</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" *ngIf="!isEdit">
            <mat-label>Mot de passe</mat-label>
            <input matInput formControlName="password" type="password" />
            <mat-error *ngIf="form.get('password')?.hasError('required')">Requis</mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">6 caractères minimum</mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-button type="button" routerLink="/users">Annuler</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
              {{ isEdit ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
  :host {
    animation: fadeInUp 0.5s ease-out;
    display: block;
  }

  mat-card {
    border-radius: 16px;
    box-shadow: var(--shadow-xl);
    background: white;
    max-width: 800px;
    margin: 0 auto;
  }

  mat-card-header {
    background: var(--gradient-1);
    color: white;
    padding: 1.5rem;
    border-radius: 16px 16px 0 0;
  }

  mat-card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }

  mat-card-content {
    padding: 2rem;
  }

  .full-width {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }

  .actions button {
    border-radius: 12px;
    padding: 0.5rem 2rem;
    font-weight: 600;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .actions button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`]
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isEdit = false;
  private userId?: number;

  ngOnInit(): void {
    this.isEdit = this.route.snapshot.paramMap.has('id');
    this.userId = this.isEdit ? +this.route.snapshot.paramMap.get('id')! : undefined;

    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ...(this.isEdit ? {} : { password: ['', [Validators.required, Validators.minLength(6)]] })
    });

    if (this.isEdit && this.userId) {
      this.userService.getById(this.userId).subscribe(user => {
        this.form.patchValue({ username: user.username, email: user.email });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const userData = this.form.value;
    const request$ = this.isEdit
      ? this.userService.update(this.userId!, userData)
      : this.userService.create(userData);

    request$.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Utilisateur mis à jour' : 'Utilisateur créé', 'Fermer', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: () => this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 })
    });
  }
}