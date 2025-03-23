import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { UserService } from '../../../services/user.service';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-client-form',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent], 
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }
  
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      this.userService.createUser(this.signupForm.value).subscribe({
        next: (resp) => {
          this.successMessage = 'Account created successfully!';
          // Automatically login after successful registration
          const { email, password } = this.signupForm.value;
          this.authService.login(email, password).subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: (err) => {
              this.errorMessage = 'Account created but login failed. Please try logging in manually.';
              this.router.navigate(['/login']);
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'An error occurred while creating the user. Please try again later.';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}