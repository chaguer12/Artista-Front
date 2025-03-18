import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudioService } from '../../../services/studio.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { EquipmentService } from '../../../services/equipment.service';
import { Studio } from '../../../models/studio';
import { Equipment } from '../../../models/equipment';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css'
})
export class StudioComponent implements OnInit {
  studioList: Studio[] = [];
  equipmentList: Equipment[] = [];
  studioForm: FormGroup;
  isEditing = false;
  currentStudioId: number | null = null;
  isLoading = false;
  
  // File upload properties
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadProgress: number = 0;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private studioService: StudioService,
    private equipmentService: EquipmentService,
    private fileUploadService: FileUploadService
  ) {
    this.studioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', Validators.required],
      description: [''],
      hourlyRate: [0, [Validators.required, Validators.min(0)]],
      availability: ['AVAILABLE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudios();
    this.loadEquipment();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // Upload the file
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.uploadProgress = 0;
      this.uploadError = null;

      this.fileUploadService.upload(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const uploadedFileUrl = event.body.fileUrl;
            this.studioForm.patchValue({
              image: uploadedFileUrl
            });
          }
        },
        error: (err) => {
          this.uploadProgress = 0;
          this.uploadError = 'Could not upload the file';
          console.error('Upload Error:', err);
        }
      });
    }
  }

  loadStudios(): void {
    this.isLoading = true;
    this.studioService.getAllStudios().subscribe({
      next: (data) => {
        this.studioList = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching studios:', error);
        this.isLoading = false;
      }
    });
  }

  loadEquipment(): void {
    this.equipmentService.getAllEquipment().subscribe({
      next: (data) => {
        this.equipmentList = data;
      },
      error: (error) => console.error('Error fetching equipment:', error)
    });
  }

  onSubmit(): void {
    if (this.studioForm.valid) {
      const studioData = this.studioForm.value;
      this.isLoading = true;

      if (this.isEditing && this.currentStudioId) {
        this.studioService.updateStudio(this.currentStudioId, studioData).subscribe({
          next: () => {
            this.loadStudios();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating studio:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.studioService.createStudio(studioData).subscribe({
          next: () => {
            this.loadStudios();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error creating studio:', error);
            this.isLoading = false;
          }
        });
      }
    }
  }

  editStudio(studio: Studio): void {
    if (studio.id) {
      this.isEditing = true;
      this.currentStudioId = studio.id;
      this.studioForm.patchValue({
        name: studio.name,
        location: studio.location,
        description: studio.description || '',
        hourlyRate: studio.hourlyRate || 0,
        availability: studio.availability
      });
      this.previewUrl = studio.image || null;
    }
  }

  deleteStudio(id: number): void {
    if (confirm('Are you sure you want to delete this studio?')) {
      this.isLoading = true;
      this.studioService.deleteStudio(id).subscribe({
        next: () => {
          this.loadStudios();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting studio:', error);
          this.isLoading = false;
        }
      });
    }
  }

  addEquipmentToStudio(studioId: number, equipmentId: number): void {
    this.studioService.addEquipmentToStudio(studioId, equipmentId).subscribe({
      next: () => this.loadStudios(),
      error: (error) => console.error('Error adding equipment to studio:', error)
    });
  }

  removeEquipmentFromStudio(studioId: number, equipmentId: number): void {
    this.studioService.removeEquipmentFromStudio(studioId, equipmentId).subscribe({
      next: () => this.loadStudios(),
      error: (error) => console.error('Error removing equipment from studio:', error)
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentStudioId = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.studioForm.reset({
      availability: 'AVAILABLE',
      hourlyRate: 0
    });
  }
}
