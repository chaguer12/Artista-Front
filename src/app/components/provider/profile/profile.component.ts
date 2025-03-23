import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { UserService } from '../../../services/user.service';
import { ProviderService } from '../../../services/provider.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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
    private authService: AuthService,
    private userService: UserService,
    private providerService: ProviderService,
    private http: HttpClient
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
  }

  loadUser():void{
    this.isLoading = true;
    this.authService.getUserProfile().subscribe(
      (user:User) => {
        if(user){
          this.user = user;
          this.updateForm(user);
        }
        this.isLoading = false;
      },
      error => {
        console.error("Error loading user profile", error);
        this.isLoading = false;
      }
    )
  }
  updateForm(user:User):void{
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
      
      this.userService.updateUser(this.user.id,userData).subscribe({
        next: (response) => {
          console.log("Profile updated successfully");
          this.isLoading = false;
          this.isEditing = false;
        },
        error: (err) => {
          console.error("Error updating profile", err);
          this.isLoading = false;
        }
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.updateForm(this.user); // Reset form when switching to view mode
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
    }
  }

  uploadPhoto(): void {
    if (this.selectedFile && this.user?.email) {
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      formData.append("email", this.user.email);

      this.providerService.uploadPhoto(formData).subscribe({
        next: (response: any) => {
          console.log("Upload successful:", response);
          this.previewUrl = response;
        },
        error: (error) => {
          console.error("Error uploading photo:", error);
        }
      });
    }
  }

  openModal(): void {
    const modal = document.getElementById('customModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('customModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
} 
