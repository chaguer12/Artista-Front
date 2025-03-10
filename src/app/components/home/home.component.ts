import { Component,type OnInit,HostListener } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-home',
  imports: [SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  title = "artista";
  sidebarOpen = false;
  ngOnInit(): void {
      this.animateOnScroll()
      this.setActiveNavOnScroll()
  }

 
  animateOnScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      { threshold: 0.1 },
    )

    // Observe all sections except hero
    const sections = document.querySelectorAll("section:not(.hero)")
    sections.forEach((section) => {
      observer.observe(section)
    })
  }
  setActiveNavOnScroll() {
    window.addEventListener("scroll", () => {
      const sections = document.querySelectorAll("section[id]")
      const navItems = document.querySelectorAll(".nav-item")

      let current = ""

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).clientHeight

        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id") || ""
        }
      })

      navItems.forEach((item) => {
        item.classList.remove("active")
        const href = item.getAttribute("href")
        if (href && href.includes(current) && current !== "") {
          item.classList.add("active")
        }

        // Home link active when at the top
        if (window.scrollY < 100 && href === "#") {
          item.classList.add("active")
        }
      })
    })
  }

}
