import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification" 
         class="notification" 
         [class.success]="notification.type === 'success'"
         [class.error]="notification.type === 'error'"
         [class.info]="notification.type === 'info'">
      {{ notification.message }}
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .success {
      background-color: #28a745;
      border-left: 4px solid #1e7e34;
    }

    .error {
      background-color: #dc3545;
      border-left: 4px solid #bd2130;
    }

    .info {
      background-color: #17a2b8;
      border-left: 4px solid #117a8b;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  notification: any = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
    });
  }
} 