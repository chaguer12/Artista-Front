import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule ,Validators} from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [SidebarComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  errorMessage :string = "";
  loginForm!: FormGroup;

  constructor(private fb:FormBuilder,private router:Router, ){}
   ngOnInit(): void {
        this.loginForm = this.fb.group({
          password: ['', [Validators.required, Validators.minLength(8)]],
          email: ['', [Validators.required, Validators.email]]
        },);
      }

  onSubmit():void{
    
  }    

}
