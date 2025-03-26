import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  teamMembers = [
    {
      name: 'Sarah Chen',
      position: 'CEO & Founder',
      bio: 'With over 15 years of industry experience, Sarah leads our company vision and strategy.',
      image: 'assets/about-us/team1.jpg'
    },
    {
      name: 'Emma Thompson',
      position: 'Creative Director',
      bio: 'Emma brings creative excellence and innovation to our artistic direction.',
      image: 'assets/about-us/team2.jpg'
    },
    {
      name: 'David Rodriguez',
      position: 'Technical Director',
      bio: 'David ensures our technical infrastructure meets the highest standards.',
      image: 'assets/about-us/team3.jpg'
    },
    {
      name: 'Michael Anderson',
      position: 'Head of Operations',
      bio: 'Michael oversees our daily operations and strategic partnerships.',
      image: 'assets/about-us/team4.jpg'
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
