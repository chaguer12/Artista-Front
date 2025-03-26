import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NotificationComponent],
  template: `
    <div class="app-container">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-notification></app-notification>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }
  `]
})
export class AppComponent {
  title = 'Artista';
}
