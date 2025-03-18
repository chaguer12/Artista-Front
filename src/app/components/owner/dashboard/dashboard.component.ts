import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../../../services/provider.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../../utils/validation/custom-validators';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone:true
  
})
export class DashboardComponent implements OnInit {
  providerForm!: FormGroup
  providers: User[] = []
  isLoading = false
  formSubmitted = false

  private fb = inject(FormBuilder)
  private providerService = inject(ProviderService)

  ngOnInit(): void {
    this.initForm()
    this.fetchProviders()
  }

  initForm(): void {
    this.providerForm = this.fb.group({
      fullName: ['', [Validators.required]],
        userName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        email: ['', [Validators.required, Validators.email]],
        address:[''],
        city:[''],
    },
    {
      validators: CustomValidators.matchPasswords('password', 'confirmPassword')
    }
  )
  }

  fetchProviders(): void {
    this.isLoading = true
    this.providerService.getUsers().subscribe({
      next: (data) => {
        this.providers = data
        this.isLoading = false
        this.providers.forEach(provider => {
          console.log(`Provider username: ${provider.userName}, isValid: ${provider.isValid}`);
        });
      },
      error: (error) => {
        console.error("Error fetching providers", error)
        this.isLoading = false
      },
    })
  }

  onSubmit(): void {
    this.formSubmitted = true

    if (this.providerForm.invalid) {
      return
    }

    const provider: User = this.providerForm.value
    this.isLoading = true

    this.providerService.createUser(provider).subscribe({
      next: () => {
        this.isLoading = false
        this.providerForm.reset({
          role: "ROLE_PROVIDER",
        })
        this.formSubmitted = false
        this.fetchProviders()
      },
      error: (error) => {
        console.error("Error creating provider", error)
        this.isLoading = false
      },
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.providerForm.get(fieldName);

  if (!field || !field.errors || !field.touched) {
    return "";
  }

  if (field.errors["required"]) {
    return "This field is required";
  }

  if (field.errors["email"]) {
    return "Please enter a valid email";
  }

  if (field.errors["minlength"]) {
    return `Minimum length is ${field.errors["minlength"].requiredLength} characters`;
  }

  if (fieldName === 'confirmPassword' && this.providerForm.hasError('passwordsMismatch')) {
    return "Passwords do not match";
  }

  return "Invalid field";
  }
}

