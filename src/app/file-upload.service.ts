import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private HttpClient: HttpClient) {}

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.HttpClient.post(
      `${environment.fileUploadURL}/upload`,
      formData
    );
  }

  deleteFile(filename) {
    return this.HttpClient.delete(
      `${environment.fileUploadURL}/delete` + filename
    );
  }
}
