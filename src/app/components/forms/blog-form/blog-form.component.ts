import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { SidebarComponent } from '../../sidebar/sidebar.component';

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
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getUserProfile().subscribe(user => {
      this.currentUser = user;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.blogForm.valid && this.currentUser?.id) {
      this.isLoading = true;
      const postData = {
        ...this.blogForm.value,
        auteur: this.currentUser
      };

      this.blogService.createPost(postData).subscribe({
        next: (response) => {
          if (this.selectedFile && response.id) {
            this.uploadImage(response.id);
          } else {
            this.router.navigate(['/blog']);
          }
        },
        error: (error) => {
          console.error('Error creating post:', error);
          this.isLoading = false;
        }
      });
    }
  }

  uploadImage(postId: number): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('imageFile', this.selectedFile);
      formData.append('entityId', postId.toString());
      formData.append('type', 'BLOG_POST');

      this.fileUploadService.upload(formData).subscribe({
        next: () => {
          this.router.navigate(['/blog']);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/blog']);
  }
}
