import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Profile } from '../../models/profile';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  profileForm: FormGroup;
  socialLinksForm: FormGroup;
  isEditing = false;
  isLoading = false;
  
  // File upload properties
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadProgress: number = 0;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private fileUploadService: FileUploadService
  ) {
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      phoneNumber: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      bio: ['']
    });

    this.socialLinksForm = this.fb.group({
      facebook: [''],
      instagram: [''],
      twitter: [''],
      soundcloud: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // Upload the file
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (this.selectedFile && this.profile?.id) {
      this.uploadProgress = 0;
      this.uploadError = null;

      this.fileUploadService.upload(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const uploadedFileUrl = event.body.fileUrl;
            this.updateProfilePicture(uploadedFileUrl);
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

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getCurrentProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.previewUrl = data.profilePic || null;
        this.updateForms(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.isLoading = false;
      }
    });
  }

  updateForms(profile: Profile): void {
    this.profileForm.patchValue({
      userName: profile.userName,
      email: profile.email,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber || '',
      address: profile.address,
      city: profile.city,
      bio: profile.bio || ''
    });

    if (profile.socialLinks) {
      this.socialLinksForm.patchValue({
        facebook: profile.socialLinks.facebook || '',
        instagram: profile.socialLinks.instagram || '',
        twitter: profile.socialLinks.twitter || '',
        soundcloud: profile.socialLinks.soundcloud || ''
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.profile?.id) {
      this.isLoading = true;
      const profileData = {
        ...this.profile,
        ...this.profileForm.value
      };

      this.profileService.updateProfile(this.profile.id, profileData).subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
          this.isEditing = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isLoading = false;
        }
      });
    }
  }

  updateProfilePicture(imageUrl: string): void {
    if (this.profile?.id) {
      this.profileService.updateProfilePicture(this.profile.id, imageUrl).subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
          this.previewUrl = updatedProfile.profilePic || null;
        },
        error: (error) => console.error('Error updating profile picture:', error)
      });
    }
  }

  updateSocialLinks(): void {
    if (this.profile?.id && this.socialLinksForm.valid) {
      const socialLinks = this.socialLinksForm.value;
      this.profileService.updateSocialLinks(this.profile.id, socialLinks).subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
        },
        error: (error) => console.error('Error updating social links:', error)
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.profile) {
      this.updateForms(this.profile);
    }
  }
} 