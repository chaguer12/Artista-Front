import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { User } from '../../../models/user';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.css'
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isLoading = false;
  currentUser: User | null = null;
  
  // File upload properties
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadProgress: number = 0;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du chargement du profil');
        console.error('Error loading user profile:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.showError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.currentUser?.id) {
      this.notificationService.showError('Vous devez être connecté pour publier un article');
      return;
    }

    if (this.blogForm.valid && this.selectedFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('title', this.blogForm.get('title')?.value || '');
      formData.append('content', this.blogForm.get('content')?.value || '');
      formData.append('photo', this.selectedFile);
      formData.append('auteur_id', this.currentUser.id.toString());

      this.blogService.createPost(formData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Article publié avec succès !');
          this.router.navigate(['/blog']);
        },
        error: (error) => {
          this.notificationService.showError('Erreur lors de la publication de l\'article');
          console.error('Error creating blog post:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.notificationService.showError('Veuillez remplir tous les champs requis et sélectionner une image');
    }
  }

  cancel(): void {
    this.router.navigate(['/blog']);
  }
}
