import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EquipmentService } from '../../../services/equipment.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { Equipment } from '../../../models/equipment';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { PhotoType } from '../../../models/enums/PhotoType';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css'
})
export class EquipmentComponent implements OnInit {
  equipmentList: Equipment[] = [];
  equipmentForm: FormGroup;
  isEditing = false;
  currentEquipmentId: number | null = null;
  isLoading = false;
  imageUrl :string | null = null;
  
  
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploadProgress: number = 0;
  uploadError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private fileUploadService: FileUploadService,
    private authService: AuthService
  ) {
    this.equipmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      status: ['AVAILABLE', Validators.required],
      description: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
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
            // Get the uploaded file URL from the response
            const uploadedFileUrl = event.body.fileUrl;
            // Update the equipment form with the file URL
            this.equipmentForm.patchValue({
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

  loadEquipment(): void {
    this.isLoading = true;
    this.equipmentService.getAllEquipment().subscribe({
      next: (data) => {
        this.equipmentList = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching equipment:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.equipmentForm.valid) {
      const equipmentData = this.equipmentForm.value;
      this.isLoading = true;

      if (this.isEditing && this.currentEquipmentId) {
        this.equipmentService.updateEquipment(this.currentEquipmentId, equipmentData).subscribe({
          next: () => {
            this.loadEquipment();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating equipment:', error);
            this.isLoading = false;
          }
        });
      } else {
        this.equipmentService.createEquipment(equipmentData).subscribe({
          next: () => {
            this.loadEquipment();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error creating equipment:', error);
            this.isLoading = false;
          }
        });
      }
    }
  }

  editEquipment(equipment: Equipment): void {
    if (equipment.id) {
      this.isEditing = true;
      this.currentEquipmentId = equipment.id;
      this.equipmentForm.patchValue({
        name: equipment.name,
        type: equipment.type,
        brand: equipment.brand,
        status: equipment.status,
        description: equipment.description || ''
      });
      this.previewUrl = equipment.image || null;
    }
  }

  deleteEquipment(id: number): void {
    if (confirm('Are you sure you want to delete this equipment?')) {
      this.isLoading = true;
      this.equipmentService.deleteEquipment(id).subscribe({
        next: () => {
          this.loadEquipment();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting equipment:', error);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentEquipmentId = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.equipmentForm.reset({
      status: 'AVAILABLE'
    });
  }
}
