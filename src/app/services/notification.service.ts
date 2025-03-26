import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string, duration: number = 3000): void {
    this.show({ message, type: 'success', duration });
  }

  showError(message: string, duration: number = 5000): void {
    this.show({ message, type: 'error', duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show({ message, type: 'info', duration });
  }

  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
    if (notification.duration) {
      setTimeout(() => {
        this.clear();
      }, notification.duration);
    }
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
} 