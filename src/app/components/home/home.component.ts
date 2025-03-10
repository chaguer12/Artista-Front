import { Component,type OnInit,HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
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

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen

    
    if (this.sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }
  navigateTo(sectionId: string) {
    
    setTimeout(() => {
      this.sidebarOpen = false
      document.body.style.overflow = ""
    }, 150)
  }
  @HostListener("document:keydown.escape")
  onEscapePress() {
      if (this.sidebarOpen) {
      this.toggleSidebar()
      }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
   
    if (window.innerWidth > 1024 && this.sidebarOpen) {
      this.toggleSidebar()
    }
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
