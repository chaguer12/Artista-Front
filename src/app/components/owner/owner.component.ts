import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { animate, style, transition, trigger } from '@angular/animations';

interface Feature {
  title: string;
  icon: string;
  description: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrl: './owner.component.css',
  imports: [FormsModule, CommonModule, SidebarComponent],
  standalone: true,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class OwnerComponent implements OnInit {
  features: Feature[] = [
    { 
      title: 'Streamlined Scheduling', 
      icon: 'class="fas fa-calendar', 
      description: 'Easily manage your class schedule, instructor availability, and studio resources in one place.' 
    },
    { 
      title: 'Client Management', 
      icon: 'users', 
      description: 'Keep track of member information, attendance, payments, and engagement all in a centralized system.' 
    },
    { 
      title: 'Payment Processing', 
      icon: 'credit-card', 
      description: 'Accept payments online, manage memberships, and automate recurring billing with ease.' 
    },
    { 
      title: 'Marketing Tools', 
      icon: 'megaphone', 
      description: 'Grow your business with integrated email campaigns, social media tools, and promotional offers.' 
    }
  ];

  steps: Step[] = [
    { 
      number: 1, 
      title: 'Create Your Account', 
      description: 'Sign up and set up your studio profile with just a few simple steps.' 
    },
    { 
      number: 2, 
      title: 'Customize Your Studio', 
      description: 'Configure your classes, pricing, and policies to match your unique business needs.' 
    },
    { 
      number: 3, 
      title: 'Invite Your Clients', 
      description: 'Import your existing client list or invite new members to join your digital studio.' 
    },
    { 
      number: 4, 
      title: 'Start Growing', 
      description: 'Use our platform to streamline operations and focus on what matters - growing your business.' 
    }
  ];

  formSubmitted = false;
  loading = false;
  selectedTestimonial = 0;
  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Yoga Studio Owner',
      content: 'StudioHub transformed our scheduling process. We\'ve increased class attendance by 30% since joining.',
      image: 'assets/testimonial1.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Dance Studio Director',
      content: 'The client management tools have helped us build stronger relationships with our students.',
      image: 'assets/testimonial2.jpg'
    },
    {
      name: 'Emma Williams',
      role: 'Fitness Center Owner',
      content: 'Automated payments have saved us countless hours of administrative work each month.',
      image: 'assets/testimonial3.jpg'
    }
  ];

  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize any necessary data or set up observers here
    this.rotateTestimonials();
  }

  submitForm(form: NgForm) {
    if (form.invalid) return;
    
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', this.contactForm);
      this.formSubmitted = true;
      this.loading = false;
      
      // Reset form after submission
      setTimeout(() => {
        this.formSubmitted = false;
        form.resetForm();
      }, 5000);
    }, 1500);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  rotateTestimonials() {
    setInterval(() => {
      this.selectedTestimonial = (this.selectedTestimonial + 1) % this.testimonials.length;
    }, 5000);
  }

  selectTestimonial(index: number) {
    this.selectedTestimonial = index;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}