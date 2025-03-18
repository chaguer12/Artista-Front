import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [SidebarComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  errorMessage :string = "";
  loginForm!: FormGroup;

  constructor(private fb:FormBuilder,private router:Router, private authService:AuthService){}
   ngOnInit(): void {
        this.loginForm = this.fb.group({
          password: ['', [Validators.required, Validators.minLength(8)]],
          email: ['', [Validators.required, Validators.email]]
        },);
      }

      onSubmit(): void {
        if (this.loginForm.valid) {
          const { email, password } = this.loginForm.value;
    
          this.authService.login(email, password).subscribe(
            (response) => {
              const token = response.token;
              const userRole = this.authService.getUserRole();
              if(userRole === 'ROLE_ADMIN'){
                this.router.navigate(['/dashboard']); 
              }else if(userRole === 'ROLE_PROVIDER'){
                this.router.navigate(['/equipment'])
              }
            },
            (error) => {
              this.errorMessage = 'Invalid credentials or server error';
            }
          );
        }
      }  

}
