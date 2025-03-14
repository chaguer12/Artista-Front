import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule ,FormGroup, Validators,FormBuilder} from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';

@Component({
  selector: 'app-provider-form',
  imports: [CommonModule,ReactiveFormsModule,SidebarComponent],
  templateUrl: './provider-form.component.html',
  styleUrl: './provider-form.component.css',
  standalone:true
})
export class ProviderFormComponent implements OnInit {
  signupForm!: FormGroup;
    errorMessage: string = "";
      constructor(private fb: FormBuilder,private router:Router,private providerService: ProviderService) {}
  
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
  
      onSubmit():void{
        if (this.signupForm.valid) {
          console.log('Form Data to request:', this.signupForm.value);
          this.providerService.createUser(this.signupForm.value).subscribe(
            (resp) =>{ console.log("user created:", resp);},
            (err) => {
               console.log("error creating user:", err);
               if (err.error && err.error.message) {
                this.errorMessage = err.error.message;
              } else {
                this.errorMessage = 'An error occurred while creating the user. Please try again later.';
              }
    
            }
          );
        } else {
          console.log('Form is invalid');
        }
      }

}
