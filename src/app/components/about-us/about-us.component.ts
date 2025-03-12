import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, RouterLink, SidebarComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  teamMembers = [
    {
      name: 'Jane Doe',
      position: 'CEO & Founder',
      bio: 'With over 15 years of industry experience, Jane leads our company vision and strategy.',
      imageUrl: 'assets/1.jpg'
    },
    {
      name: 'John Smith',
      position: 'CTO',
      bio: 'John brings technical expertise and innovation to our products and services.',
      imageUrl: 'assets/2.jpg'
    },
    {
      name: 'Emily Chen',
      position: 'Design Director',
      bio: 'Emily ensures our products are not only functional but beautiful and intuitive.',
      imageUrl: 'assets/3.jpg'
    },
    {
      name: 'Michael Johnson',
      position: 'Head of Customer Success',
      bio: 'Michael works tirelessly to ensure our clients achieve their goals with our solutions.',
      imageUrl: 'assets/4.jpg'
    }
  ];

  values = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries to create solutions that address tomorrow\'s challenges.'
    },
    {
      title: 'Integrity',
      description: 'We believe in transparent, honest relationships with our clients and partners.'
    },
    {
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from code to customer service.'
    },
    {
      title: 'Collaboration',
      description: 'We work together with our clients to achieve shared success and growth.'
    }
  ];

}
