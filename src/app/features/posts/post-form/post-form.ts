import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    NgIf,
    NgFor,
    AsyncPipe
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEdit ? 'Modifier' : 'Nouvel' }} article</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Titre</mat-label>
            <input matInput formControlName="title" />
            <mat-error *ngIf="form.get('title')?.hasError('required')">Requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contenu</mat-label>
            <textarea matInput formControlName="content" rows="5"></textarea>
            <mat-error *ngIf="form.get('content')?.hasError('required')">Requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Utilisateur</mat-label>
            <mat-select formControlName="userId">
              <mat-option *ngFor="let user of users$ | async" [value]="user.id">
                {{ user.username }} ({{ user.email }})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('userId')?.hasError('required')">Requis</mat-error>
          </mat-form-field>

          <div class="actions">
            <button mat-button type="button" routerLink="/posts">Annuler</button>
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
export class PostFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isEdit = false;
  private postId?: number;
  users$: Observable<User[]> = this.userService.getAll();

  ngOnInit(): void {
    this.isEdit = this.route.snapshot.paramMap.has('id');
    this.postId = this.isEdit ? +this.route.snapshot.paramMap.get('id')! : undefined;

    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      userId: [null, Validators.required]
    });

    if (this.isEdit && this.postId) {
      this.postService.getById(this.postId).subscribe(post => {
        this.form.patchValue({
          title: post.title,
          content: post.content,
          userId: post.user?.id   // ← extrait l'id de l'utilisateur imbriqué
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const postData = this.form.value;   // { title, content, userId }
    const request$ = this.isEdit
      ? this.postService.update(this.postId!, postData)
      : this.postService.create(postData);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Article mis à jour' : 'Article créé',
          'Fermer',
          { duration: 3000 }
        );
        this.router.navigate(['/posts']);
      },
      error: () => this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 })
    });
  }
}