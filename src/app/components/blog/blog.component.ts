import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { BlogPost } from '../../models/blog-post';
import { User } from '../../models/user';
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
  currentUser: User | null = null;
  isLoading = true;

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadPosts();
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du chargement du profil');
        console.error('Error loading user profile:', error);
        this.loadPosts();
      }
    });
  }

  loadPosts(): void {
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du chargement des articles');
        console.error('Error loading posts:', error);
        this.isLoading = false;
      }
    });
  }

  onVote(postId: number, isUpvote: boolean): void {
    if (!this.currentUser) {
      this.notificationService.showError('Vous devez être connecté pour voter');
      return;
    }

    const voteMethod = isUpvote ? this.blogService.upvotePost(postId) : this.blogService.downvotePost(postId);
    voteMethod.subscribe({
      next: () => {
        this.notificationService.showSuccess(isUpvote ? 'Vote positif enregistré' : 'Vote négatif enregistré');
        this.loadPosts();
      },
      error: (error) => {
        this.notificationService.showError('Erreur lors du vote');
        console.error('Error voting:', error);
      }
    });
  }

  deletePost(postId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.blogService.deletePost(postId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Article supprimé avec succès');
          this.loadPosts();
        },
        error: (error) => {
          this.notificationService.showError('Erreur lors de la suppression de l\'article');
          console.error('Error deleting post:', error);
        }
      });
    }
  }

  isAuthor(post: BlogPost): boolean {
    return this.currentUser?.id === post.auteur?.id;
  }
} 