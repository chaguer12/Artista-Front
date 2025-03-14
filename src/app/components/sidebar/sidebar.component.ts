import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarOpen = false;

  ngOnInit(): void {
    this.animateOnScroll();
    this.setActiveNavOnScroll();
  }

  navigateTo(sectionId: string) {
    setTimeout(() => {
      this.sidebarOpen = false;
      document.body.style.overflow = "";
    }, 150);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;

    if (this.sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  @HostListener("document:keydown.escape")
  onEscapePress() {
    if (this.sidebarOpen) {
      this.toggleSidebar();
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    if (window.innerWidth > 1024 && this.sidebarOpen) {
      this.toggleSidebar();
    }
  }

  // Assure-toi d'implémenter ces méthodes si elles sont utilisées
  private animateOnScroll() {
    console.log("Animation au scroll - implémente ici ta logique");
  }

  private setActiveNavOnScroll() {
    console.log("Activation de la navigation en fonction du scroll");
  }
}
