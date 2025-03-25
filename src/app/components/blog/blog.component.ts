import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog-post';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  isLoading = false;
  currentUser: User | null = null;

  constructor(
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.authService.getUserProfile().subscribe(user => {
      this.currentUser = user;
    });
  }

  loadPosts(): void {
    this.isLoading = true;
    this.blogService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
      }
    });
  }

  upvotePost(post: BlogPost): void {
    if (post.id) {
      this.blogService.upvotePost(post.id).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (error) => {
          console.error('Error upvoting post:', error);
        }
      });
    }
  }

  downvotePost(post: BlogPost): void {
    if (post.id) {
      this.blogService.downvotePost(post.id).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (error) => {
          console.error('Error downvoting post:', error);
        }
      });
    }
  }

  deletePost(id: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }
} 