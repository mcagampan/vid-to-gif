import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileUploadService } from '../file-upload.service';

declare var gifshot, $;

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit, OnDestroy {
  imageSource: string;
  uploadedFile: File;

  config = {
    uploadAPI: {
      url: 'http://localhost:5000/upload',
    },
    multiple: false,
    formatsAllowed: '.mp4',
    maxSize: '100',
  };

  filename: string = '';
  isUploading: boolean = false;
  uploadBtnText = 'Upload & Convert';

  constructor(private FileUploadService: FileUploadService) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.FileUploadService.deleteFile(this.filename).subscribe((response) => {
      console.log(response);
    });
  }

  uploadFile() {
    $('#customFile').val('');
    this.isUploading = true;
    this.uploadBtnText = 'Uploading...';
    this.FileUploadService.uploadFile(this.uploadedFile).subscribe(
      (response: any) => {
        console.log(response);
        this.filename = response.message;
        this.uploadBtnText = 'Converting to GIF...';
        gifshot.createGIF(
          {
            video: `http://localhost:5000${response.message}`,
            numFrames: 30,
            gifWidth: 400,
            gifHeight: 400,
          },
          (obj) => {
            if (!obj.error) {
              this.imageSource = obj.image;
              this.uploadedFile = null;
              this.isUploading = false;
              this.uploadBtnText = 'Upload & Convert';
            }
          }
        );
      }
    );
  }

  fileBrowsed(event) {
    this.uploadedFile = event.target.files[0];
    console.log(this.uploadedFile);
  }
}
