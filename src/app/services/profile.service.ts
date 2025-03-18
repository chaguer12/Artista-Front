import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/profiles';

  constructor(private http: HttpClient) { }

  getProfile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${id}`);
  }

  getCurrentProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/current`);
  }

  updateProfile(id: number, profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${id}`, profile);
  }

  updateProfilePicture(id: number, imageUrl: string): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/${id}/picture`, { profilePic: imageUrl });
  }

  updateSocialLinks(id: number, socialLinks: Profile['socialLinks']): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/${id}/social`, { socialLinks });
  }

  validateProfile(id: number): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/${id}/validate`, {});
  }

  invalidateProfile(id: number): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/${id}/invalidate`, {});
  }
} 