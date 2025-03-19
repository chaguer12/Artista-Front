import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileUploadService } from '../../../services/file-upload.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  
  // File upload properties
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadProgress: number = 0;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUser();
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.updateForm(user);
      }
    });
  }

    loadUser(): void {
      this.isLoading = true;
  this.authService.getCurrentUser().subscribe(user => {
    if (user) {
      this.user = user;
      this.updateForm(user);
    }
    this.isLoading = false;
  });
    }

  updateForm(user: User): void {
    this.profileForm.patchValue({
      userName: user.userName,
      email: user.email,
      fullName: user.fullName,
      address: user.address || '',
      city: user.city || ''
    });
    this.previewUrl = user.profilePic || null;
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user?.id) {
      this.isLoading = true;
      const userData = {
        ...this.user,
        ...this.profileForm.value
      };
      // TODO: Implement user update logic
      this.isLoading = false;
      this.isEditing = false;
    }
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
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (this.selectedFile && this.user?.id) {
      this.uploadProgress = 0;
      this.uploadError = null;

      this.fileUploadService.upload(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const uploadedFileUrl = event.body.fileUrl;
            // TODO: Implement profile picture update logic
            this.previewUrl = uploadedFileUrl;
          }
        },
        error: (err) => {
          this.uploadProgress = 0;
          this.uploadError = 'Could not upload the file';
          console.error('Upload Error:', err);
        }
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.updateForm(this.user);
    }
  }
} 
