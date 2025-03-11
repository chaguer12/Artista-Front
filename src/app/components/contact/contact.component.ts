import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-contact',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  sidebarOpen = false;
  contactForm!: FormGroup;
  submitted = false;
  currentYear = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", Validators.required],
      message: ["", Validators.required],
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    document.body.style.overflow = this.sidebarOpen ? "hidden" : "";
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      console.log("Validation error !");
    }

    console.log("Form submitted:", this.contactForm.value);
    alert("Thank you for your message! We'll get back to you soon.");

    this.submitted = false;
    this.contactForm.reset();
  }
}
