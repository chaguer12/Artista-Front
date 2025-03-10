import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, type FormGroup, Validators,ReactiveFormsModule} from "@angular/forms"
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  sidebarOpen = false;
  contactForm!: FormGroup
  submitted = false
  currentYear = new Date().getFullYear()

  constructor(@Inject(FormBuilder)private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", Validators.required],
      message: ["", Validators.required],
    })
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen

    
    if (this.sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }
  get f() {
    return this.contactForm.controls
  }


  onSubmit(): void {
    this.submitted = true

    // Stop here if form is invalid
    if (this.contactForm.invalid) {
      return
    }

    // Process form submission
    console.log("Form submitted:", this.contactForm.value)

    // Show success message (you can replace with your preferred notification method)
    alert("Thank you for your message! We'll get back to you soon.")

    // Reset form
    this.submitted = false
    this.contactForm.reset()
  }
}

